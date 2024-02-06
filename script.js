'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btn = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tapsContent = document.querySelector('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// making the mobile navigation work

const labelMobileNav = document.querySelector('.btn-mobile-nav');
labelMobileNav.addEventListener('click', function () {
  header.classList.toggle('nav-open');
});

// old way of creating smooth scrolling for learn more button
/*
btn.addEventListener('click', function () {
  const toTop = section1.offsetTop;
  window.scroll({
    top: toTop,
    left: 0,
    behavior: 'smooth',
  });
});
*/
// modern way of creating smooth scrolling but not supported in some modern browsers.
btn.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// for (const btn of btnsOpenModal) btn.addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////

/********  page navigation (its work but not efficient) *********/
/*
const links = document.querySelectorAll('.nav__link');
links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = link.getAttribute('href');
    console.log(href);
    const scrollTo = document.querySelector(href);
    console.log(scrollTo);
    scrollTo.scrollIntoView({ behavior: 'smooth' });
  });
});
*/
/*******************page navigation Using event delegation*****************/
// -1 select the parent of those links and add event handler to it
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // -2 check which event has the class nav__link
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });

    // close the mobile navigation
    header.classList.remove('nav-open');
  }
});

/******************** Tapped Component ********************/
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  const contentNumber = clicked.dataset.tab;
  document
    .querySelectorAll('.operations__content')
    .forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${contentNumber}`)
    .classList.add('operations__content--active');
});

/**************** menu fade animation *********************/
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (link !== el) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/********** sticky navigation using intersection Observer API *********/
// const callback = function (entries, observer) {
//   entries.forEach(entery => {
//     console.log(entery);
//   });
// };
// const options = {
//   root: null,
//   threshold: [0, 0.1],
// };
// const obs = new IntersectionObserver(callback, options);
// obs.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entery] = entries;
  if (!entery.isIntersecting) nav.classList.add('sticky');
  if (entery.isIntersecting) nav.classList.remove('sticky');
  // console.log(entery);
};
const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObs.observe(header);

/************Revealing sections on scroll***************/
const revealSections = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

/************ Making lazy loading images ***************/
const imgs = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgs.forEach(img => imgObserver.observe(img));

/************building the slider component***************/
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');
let currentSlide = 0;
let maxSlide = slides.length - 1;

// creating dots
const createdots = function () {
  slides.forEach((_, i) => {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createdots();

function activateDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}
activateDot(0);
function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}
goToSlide(0);

function nextSlide() {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}
function prevSlide() {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}
// Next slide(right button)
btnRight.addEventListener('click', nextSlide);
// Previous slide(left button)
btnLeft.addEventListener('click', prevSlide);
// add event listner to the left and right arrow when they pressed
document.addEventListener('keydown', function (e) {
  if (e.code === 'ArrowRight') nextSlide();
  e.code === 'ArrowLeft' && prevSlide();
});

dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
