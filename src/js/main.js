const navbar = document.getElementById('navbar');
const navLinksContainer = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main > section'));

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalOpenButtons = document.querySelectorAll('.modal-open');
const modalCloseTargets = document.querySelectorAll('[data-modal-close]');

const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.carousel__dot'));
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
let activeSlide = 0;
let isSlideTransitioning = false;
const SLIDE_TRANSITION_MS = 460;

const modalContent = {
  faav: {
    title: 'Faav',
    html: `
      <p>A social favorites platform designed around discovery and recommendations.</p>
      <ul class="modal__content-list">
        <li>Built around reusable recommendation lists and friend activity.</li>
        <li>Uses a mobile front end with cloud-backed data and authentication.</li>
        <li>Includes enrichment and co-occurrence logic for better recommendations.</li>
      </ul>
    `
  },
  news: {
    title: 'Global News Dashboard',
    html: `
      <p>A multi-service news application focused on search, translation, and summaries.</p>
      <ul class="modal__content-list">
        <li>Node.js service layer with PostgreSQL persistence.</li>
        <li>Containerized deployment designed for cloud hosting.</li>
        <li>AI-assisted summarization and translation features.</li>
      </ul>
    `
  },
  bid2buy: {
    title: 'Bid2Buy',
    html: `
      <p>A command-line auction application designed around clean object-oriented components.</p>
      <ul class="modal__content-list">
        <li>Models users, listings, bids, and auction state as separate objects.</li>
        <li>Uses C++ collections and validation to manage auction data.</li>
        <li>Emphasizes readable class structure and predictable program flow.</li>
      </ul>
    `
  },
  contact: {
    title: 'Contact',
    html: `
      <p>Personal email available per request.</p>
      <ul class="modal__content-list">
        <li>Email: kkala5@illinois.edu</li>
        <li>GitHub: github.com/kailashkalaiselvan</li>
        <li>LinkedIn: linkedin.com/in/kailashkalaiselvan</li>
      </ul>
    `
  }
};

function updateNavbarState() {
  navbar.classList.toggle('is-scrolled', window.scrollY > 30);
  updatePositionIndicator();
}

function updatePositionIndicator() {
  const navBottom = navbar.getBoundingClientRect().bottom;
  const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (isAtBottom) {
    setActiveNav(sections[sections.length - 1].id);
    return;
  }

  let activeId = sections[0].id;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= navBottom + 1 && rect.bottom > navBottom + 1) {
      activeId = section.id;
      break;
    }
  }

  setActiveNav(activeId);
}

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
}

function scrollToSection(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute('href');
  const target = document.querySelector(targetId);

  if (!target) return;

  event.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
  window.scrollTo({ top, behavior: 'smooth' });
  navLinksContainer.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function showSlide(index) {
  const nextSlide = (index + slides.length) % slides.length;

  if (nextSlide === activeSlide || isSlideTransitioning) return;

  const isForward =
    nextSlide === (activeSlide + 1) % slides.length ||
    (nextSlide < activeSlide && nextSlide !== activeSlide - 1);
  const enterClass = isForward ? 'is-enter-right' : 'is-enter-left';
  const exitClass = isForward ? 'is-exit-left' : 'is-exit-right';

  const outgoing = slides[activeSlide];
  const incoming = slides[nextSlide];

  isSlideTransitioning = true;

  incoming.classList.add(enterClass);
  
  void incoming.offsetWidth;

  outgoing.classList.remove('is-active');
  outgoing.classList.add(exitClass);

  incoming.classList.remove(enterClass);
  incoming.classList.add('is-active');

  activeSlide = nextSlide;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === activeSlide);
  });

  window.setTimeout(() => {
    outgoing.classList.remove(exitClass);
    isSlideTransitioning = false;
  }, SLIDE_TRANSITION_MS);
}

function openModal(contentKey) {
  const content = modalContent[contentKey];
  if (!content) return;

  modalTitle.textContent = content.title;
  modalBody.innerHTML = content.html;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

navLinks.forEach((link) => link.addEventListener('click', scrollToSection));

navToggle.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

prevButton.addEventListener('click', () => showSlide(activeSlide - 1));
nextButton.addEventListener('click', () => showSlide(activeSlide + 1));

dots.forEach((dot) => {
  dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo)));
});

modalOpenButtons.forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.project));
});

modalCloseTargets.forEach((target) => target.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => revealObserver.observe(element));

window.addEventListener('scroll', updateNavbarState, { passive: true });
window.addEventListener('resize', updatePositionIndicator);
window.addEventListener('load', updateNavbarState);
