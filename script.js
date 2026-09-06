const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = document.querySelectorAll('.site-nav a');
const progress = document.querySelector('.progress span');
const year = document.querySelector('[data-year]');
const navToggleLabel = navToggle?.querySelector('.sr-only');
const mainContent = document.querySelector('main');
const footer = document.querySelector('.site-footer');
const brand = document.querySelector('.brand');

if (year) year.textContent = new Date().getFullYear();

if (navToggle && navigation) {
  const setMenuState = (open, { focusFirst = false, returnFocus = false } = {}) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggleLabel.textContent = open ? 'Close navigation' : 'Open navigation';
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (mainContent) mainContent.inert = open;
    if (footer) footer.inert = open;
    if (brand) brand.tabIndex = open ? -1 : 0;

    if (focusFirst) navigation.querySelector('a')?.focus();
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    setMenuState(open, { focusFirst: open, returnFocus: !open });
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false, { returnFocus: true });
    }

    if (event.key === 'Tab' && navToggle.getAttribute('aria-expanded') === 'true') {
      const focusable = [navToggle, ...navigation.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 650 && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
    }
  });
}

function updateProgress() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
  if (progress) progress.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
