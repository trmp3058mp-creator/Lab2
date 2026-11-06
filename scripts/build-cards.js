const fs = require("fs");

const DATA_PATH = "data/products.json";
const HTML_PATH = "index.html";
const START_MARKER = "<!-- cards:start -->";
const END_MARKER = "<!-- cards:end -->";

function readProducts(filePath) {
  let rawContent;
  try {
    rawContent = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Помилка: Не знайдено файл даних "${filePath}".`);
    process.exit(1);
  }

  let parsedData;
  try {
    parsedData = JSON.parse(rawContent);
  } catch (err) {
    console.error(`Помилка: Файл "${filePath}" містить некоректний JSON (${err.message}).`);
    process.exit(1);
  }

  if (!Array.isArray(parsedData) || parsedData.length < 6) {
    console.error(`Помилка: У "${filePath}" має бути масив щонайменше з 6 товарів.`);
    process.exit(1);
  }

  return parsedData;
}

function renderCard(product) {
  const oldPriceValue = product.oldPrice ? product.oldPrice : product.price + 15;
  return `        <article class="product-item" data-id="${product.id}">
          <div class="product-thumb">
            <img src="${product.image}" alt="${product.title}" width="290" height="300" loading="lazy">
            <button class="quick-add" type="button" data-title="${product.title}" aria-label="Add ${product.title} to cart">+</button>
          </div>
          <div class="product-info">
            <h3 class="product-name"><a href="${product.link}">${product.title}</a></h3>
            <p class="product-desc">${product.description}</p>
            <p class="product-pricing"><span class="price-current">$${product.price}.00</span> <s class="price-old">$${oldPriceValue}.00</s></p>
          </div>
        </article>`;
}

function injectMarkup(htmlContent, generatedMarkup) {
  const startIndex = htmlContent.indexOf(START_MARKER);
  const endIndex = htmlContent.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    console.error(`Помилка: В "${HTML_PATH}" не знайдено маркерів ${START_MARKER} та ${END_MARKER}.`);
    process.exit(1);
  }

  const before = htmlContent.slice(0, startIndex + START_MARKER.length);
  const after = htmlContent.slice(endIndex);

  return `${before}\n${generatedMarkup}\n      ${after}`;
}

function main() {
  let htmlContent;
  try {
    htmlContent = fs.readFileSync(HTML_PATH, "utf8");
  } catch (err) {
    console.error(`Помилка: Не вдалося прочитати файл "${HTML_PATH}".`);
    process.exit(1);
  }

  const products = readProducts(DATA_PATH);
  const cardsMarkup = products.map(renderCard).join("\n\n");
  const updatedHtml = injectMarkup(htmlContent, cardsMarkup);

  try {
    fs.writeFileSync(HTML_PATH, updatedHtml, "utf8");
    console.log(`Згенеровано карток: ${products.length}`);
  } catch (err) {
    console.error(`Помилка запису у файл "${HTML_PATH}": ${err.message}`);
    process.exit(1);
  }
}

main();