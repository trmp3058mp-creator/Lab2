document.addEventListener('DOMContentLoaded', () => {
  const docEl = document.documentElement;
  const topbar = document.querySelector('.topbar');
  const menuBtn = document.querySelector('.menu-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const modeSwitch = document.querySelector('.mode-switch');
  const modeLabel = document.querySelector('.mode-switch-label');
  const bagBtn = document.querySelector('.bag-btn');
  const bagBadge = document.querySelector('.bag-badge');

  const updateHeaderState = () => {
    const isScrolled = window.scrollY > 36 || navDrawer.classList.contains('open');
    topbar.classList.toggle('scrolled', isScrolled);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const toggleMobileNav = (shouldOpen) => {
    navDrawer.classList.toggle('open', shouldOpen);
    menuBtn.setAttribute('aria-expanded', String(shouldOpen));
    updateHeaderState();
  };

  menuBtn.addEventListener('click', () => {
    toggleMobileNav(!navDrawer.classList.contains('open'));
  });

  navDrawer.addEventListener('click', (event) => {
    if (event.target.closest('a')) toggleMobileNav(false);
  });

  const syncThemeUI = () => {
    const isDark = docEl.dataset.theme === 'dark';
    modeSwitch.setAttribute('aria-pressed', String(isDark));
    modeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  };

  modeSwitch.addEventListener('click', () => {
    docEl.dataset.theme = docEl.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('user-theme', docEl.dataset.theme);
    } catch (err) {}
    syncThemeUI();
  });
  syncThemeUI();

  let itemCount = 0;
  const catalogGrid = document.querySelector('.catalog-grid');

  catalogGrid.addEventListener('click', (event) => {
    const addButton = event.target.closest('.quick-add');
    if (!addButton) return;

    itemCount += 1;
    bagBtn.dataset.items = itemCount;
    bagBadge.textContent = itemCount;
    bagBtn.setAttribute('aria-label', `Shopping cart, ${itemCount} items`);
  });

  const paginationNav = document.querySelector('.catalog-pagination');
  const [prevPageBtn, nextPageBtn] = paginationNav.querySelectorAll('.circle-control');
  const dotsContainer = paginationNav.querySelector('.pagination-dots');
  const pageSize = 8;
  let currentPage = 0;

  const allCards = Array.from(catalogGrid.children);
  const totalPages = Math.max(1, Math.ceil(allCards.length / pageSize));

  const renderCatalogPage = () => {
    allCards.forEach((card, index) => {
      const isVisible = index >= currentPage * pageSize && index < (currentPage + 1) * pageSize;
      card.hidden = !isVisible;
    });

    dotsContainer.innerHTML = Array.from({ length: totalPages }, (_, idx) => {
      const activeClass = idx === currentPage ? 'active' : '';
      return `<button type="button" class="${activeClass}" aria-label="Page ${idx + 1}"></button>`;
    }).join('');

    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage === totalPages - 1;
  };

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      renderCatalogPage();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage += 1;
      renderCatalogPage();
    }
  });

  dotsContainer.addEventListener('click', (event) => {
    const dotBtn = event.target.closest('button');
    if (!dotBtn) return;
    currentPage = Array.from(dotsContainer.children).indexOf(dotBtn);
    renderCatalogPage();
  });

  renderCatalogPage();

  const testimonialsList = [
    {
      author: 'Elena Rostova',
      role: 'Senior Product Designer at New York Times',
      quote: '“They have a perfect touch for making a home office both professional and inspiring. The walnut desk and ergonomic chair completely transformed my remote workday.”',
      image: 'img/Workplace.avif',
      alt: 'Warm wooden home office desk with lamp and laptop'
    },
    {
      author: 'Anna Moroz',
      role: 'Software Architect & Remote Lead',
      quote: '“The cable management channels and bright desk setup fit my studio room perfectly. Best investment I have made for my home study.”',
      image: 'img/WhiteWorkplace.avif',
      alt: 'Clean minimalist white workspace with monitor'
    }
  ];

  let reviewIndex = 0;
  const reviewSection = document.querySelector('.reviews-section');
  const [prevReviewBtn, nextReviewBtn] = reviewSection.querySelectorAll('.reviews-controls .circle-control');

  const updateReview = (step) => {
    reviewIndex = (reviewIndex + step + testimonialsList.length) % testimonialsList.length;
    const item = testimonialsList[reviewIndex];
    reviewSection.querySelector('.reviewer-name').textContent = item.author;
    reviewSection.querySelector('.reviewer-role').textContent = item.role;
    reviewSection.querySelector('.review-body p').textContent = item.quote;
    const showcase = reviewSection.querySelector('.review-showcase');
    showcase.src = item.image;
    showcase.alt = item.alt;
  };

  prevReviewBtn.addEventListener('click', () => updateReview(-1));
  nextReviewBtn.addEventListener('click', () => updateReview(1));

  const subForm = document.querySelector('.subscribe-form');
  const subFeedback = document.querySelector('.subscribe-feedback');

  subForm.addEventListener('submit', (event) => {
    event.preventDefault();
    subFeedback.textContent = 'Thank you! Your home office discount code has been sent.';
    subForm.reset();
  });
});