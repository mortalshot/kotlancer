// Подключение функционала "Чертоги Фрилансера"
import { isMobile, bodyLockToggle } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

let swup;
function initSwup() {
  if (swup) return; // не инициализировать дважды!
  swup = new Swup({
    animationSelector: '#swup'
  });

  swup.hooks.replace('animation:out:await', async () => {
    console.log('ANIMATION OUT');
    await gsap.to('#swup', { opacity: 0, y: 50, duration: 0.5 });
  });
  swup.hooks.replace('animation:in:await', async () => {
    console.log('ANIMATION IN');
    gsap.set('#swup', { opacity: 0, y: 50 });
    handleLogo();


    initPageAnimations();
    await gsap.to('#swup', { opacity: 1, y: 0, duration: 0.5 });
    ScrollTrigger.refresh();
  });
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    swup = null; // сбросим, чтобы можно было заново инициализировать
    initSwup();
  }
});


function handleLogo() {
  const pageType = document.getElementById('swup').dataset.page;
  const logo = document.querySelector('.header__logo');
  if (logo) {
    if (pageType === 'home') {
      gsap.to(logo, { opacity: 0, pointerEvents: 'none', duration: 0 });
    } else {
      gsap.to(logo, { opacity: 1, pointerEvents: 'all', duration: 0.3 });
    }
  }
}


// Общие обработчики событий
function setupGlobalEvents() {
  document.addEventListener('click', function (e) {
    const targetElement = e.target;

    if (document.documentElement.classList.contains('menu-open') && !targetElement.closest('.menu__body')) {
      bodyLockToggle(); // Функция блокировки скролла
      document.documentElement.classList.remove("menu-open");
    }
  })

  // Функция обработки скролла с троттлингом
  const header = document.querySelector('.header');
  function handleScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const screenHeight = window.innerHeight;
    const scrollRatio = scrollPosition / screenHeight;

    // Управление классами в зависимости от позиции скролла
    header.classList.toggle('_scrolled2', scrollRatio > 0.67);
    header.classList.toggle('_scrolled', scrollRatio > 0.8);
    header.classList.toggle('_show', scrollRatio > 1);
  }
  // Оптимизированная версия с троттлингом
  const throttledScroll = throttle(handleScroll, 100);
  window.addEventListener('scroll', throttledScroll);
  // Функция троттлинга для оптимизации производительности
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // Эффект наведения для элементов с классом link-up
  function initLinkHoverEffects() {
    const links = gsap.utils.toArray('.link-up');

    links.forEach(link => {
      // Сохраняем начальное положение
      gsap.set(link, { y: 0 });

      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      });
    });
  }
  initLinkHoverEffects();
}

// Инициализация всех анимаций для текущей страницы
function initPageAnimations(container = document) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 767.98;

  // Проверяем скролл при загрузке
  const isScrolled = window.scrollY > window.innerHeight / 4;

  document.fonts.ready.then(() => {
    initAnimations(isScrolled, container);
  }).catch(() => {
    setTimeout(() => initAnimations(isScrolled, container), 300);
  });

  // Анимация для .firstscreen и .cases
  function initAnimations(isScrolled, container) {
    const masterTimeline = gsap.timeline();
    const firstScreen = container.querySelector('.firstscreen');

    // Анимация первого экрана
    if (firstScreen && !prefersReducedMotion && !isMobile) {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.5 } });

      masterTimeline.add(heroTimeline);

      // Анимация заголовка
      const firstScreenTitle = firstScreen.querySelector('.firstscreen__title');
      if (firstScreenTitle) {
        const splitTitle = new SplitText(firstScreenTitle, { type: "chars,lines", linesClass: "line-wrapper" });
        heroTimeline.from(splitTitle.chars, {
          y: 20, opacity: 0, stagger: 0.05, ease: "back.out(1.7)"
        });
      }

      // Анимация приветственного текста
      const helloText = firstScreen.querySelector('.firstscreen__hello');
      if (helloText) {
        const splitHello = new SplitText(helloText, { type: "words,lines", linesClass: "hello-line" });
        heroTimeline.from(splitHello.words, {
          y: 20, opacity: 0, stagger: 0.1, duration: 0.3
        }, "-=0.4");
      }

      // Анимация изображения
      const image = firstScreen.querySelector('.firstscreen__image');
      if (image) {
        heroTimeline.from(image, {
          scale: 0.8, opacity: 0, filter: "blur(5px)", duration: 1.5, ease: "elastic.out(1, 0.5)"
        }, "-=0.3");
      }

      // Анимация меню
      const header = container.querySelector('.header');
      if (header && !header.classList.contains('_scrolled2')) {
        const menuItems = container.querySelectorAll('.header__row .menu__body ul li');
        if (menuItems.length > 0) {
          heroTimeline.from(menuItems, {
            y: -20, opacity: 0, stagger: 0.2, duration: 0.3, ease: "back.out(1.2)"
          }, "-=1");
        }
      }
    } else if (firstScreen) {
      // Упрощенная анимация
      const simpleHeroTimeline = gsap.timeline();
      masterTimeline.add(simpleHeroTimeline);

      const elements = [].filter.call(
        firstScreen.querySelectorAll('.firstscreen__title, .firstscreen__image, .firstscreen__hello'),
        el => !!el
      );

      if (elements.length > 0) {
        simpleHeroTimeline.from(elements, {
          duration: 0.6, y: -20, opacity: 0, stagger: 0.3, ease: "power1.out"
        });
      }
    }

    // Функция для анимации заголовка
    function animateTitle(element) {
      gsap.to(element, {
        opacity: 1,
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          once: true,
        }
      });

      const splitTitle = new SplitText(element, {
        type: "chars,lines",
        linesClass: "cases-title-line"
      });

      gsap.from(splitTitle.chars, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)",
        onComplete: () => splitTitle.revert(),
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true,
        }
      });
    }
    const casesTitle = container.querySelector('.cases-title');
    if (casesTitle) {
      if (!isScrolled && firstScreen) {
        masterTimeline.add(() => animateTitle(casesTitle), "-=1");
      } else {
        animateTitle(casesTitle);
      }
    }

    // Функция для анимации карточек
    function animateCaseItems(items) {
      items.forEach((item, index) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index % 2 * 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
          }
        });
      });
    }
    const caseItems = gsap.utils.toArray(container.querySelectorAll('.widget-cases__item'));
    if (caseItems.length > 0) {
      if (!isScrolled && firstScreen) {
        masterTimeline.add(() => animateCaseItems(caseItems), "-=0.3");
      } else {
        animateCaseItems(caseItems);
      }
    }

    // Функция для анимации кнопки
    function animateButton(element) {
      gsap.to(element,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            once: true,
          }
        }
      );
    }
    const casesButton = container.querySelector('.widget-cases__button');
    if (casesButton) {
      if (!isScrolled) {
        masterTimeline.add(() => animateButton(casesButton));
      } else {
        animateButton(casesButton);
      }
    }
  }

  // Анимация для .widget-about
  function initAboutAnimations() {
    // Сначала скрываем все анимируемые элементы
    gsap.set([
      ...container.querySelectorAll('.widget-about__caption'),
      ...container.querySelectorAll('.widget-about__text'),
      ...container.querySelectorAll('.firstscreen__features .firstscreen__column'),
      ...container.querySelectorAll('.widget-about__item')
    ], { opacity: 0 });

    // Затем создаем timeline с анимациями
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.querySelector('.widget-about'),
        start: "top 80%",
        once: true,
        // markers: true,
      }
    });

    tl.fromTo(container.querySelector('.widget-about__caption'),
      { xPercent: 30, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.7 }
    )
      .fromTo(container.querySelector('.widget-about__text'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(container.querySelectorAll('.firstscreen__features .firstscreen__column'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2 },
        "-=0.3"
      )
      .fromTo(container.querySelectorAll('.widget-about__item'),
        {
          x: (i) => i % 2 ? -50 : 50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6
        },
        "-=0.4"
      );
  }
  if (container.querySelector('.widget-about')) {
    initAboutAnimations();
  }

  // Анимация пунктов контактов
  function initFooterAnimations() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.querySelector('.footer'),
        start: "top 95%",
        once: true,
      }
    });

    // Анимация заголовка
    const footerCaption = container.querySelector('.footer__caption');
    if (footerCaption) {
      const splitCaption = new SplitText(footerCaption, {
        type: "chars,lines",
        linesClass: "cases-title-line"
      });

      tl.from(splitCaption.chars, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)",
        onComplete: () => splitCaption.revert()
      });
    }

    // Эффект "капающих" контактов
    tl.from(container.querySelectorAll('.footer .menu-contacts__item'), {
      y: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "bounce.out"
    }, "-=0.3");
  }
  document.fonts.ready.then(() => {
    initFooterAnimations();
  });

  // Добавляем анимацию наведения на кнопки
  container.querySelectorAll('.ripple-button').forEach(btn => {
    const fillEffect = document.createElement('span');
    fillEffect.classList.add('fill-effect');
    btn.insertBefore(fillEffect, btn.firstChild);

    // Обработчик движения мыши
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      fillEffect.style.left = `${x}px`;
      fillEffect.style.top = `${y}px`;
    });

    // Возвращаем заливку в точку ухода курсора
    btn.addEventListener('mouseleave', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      fillEffect.style.left = `${x}px`;
      fillEffect.style.top = `${y}px`;
      fillEffect.style.width = '0';
      fillEffect.style.height = '0';
    });
  });

  // Добавляем анимацию наведения на изображения
  container.querySelectorAll('.js-magnetic-img').forEach(preview => {
    const img = preview.querySelector('img');
    const strength = 25;
    let rafId;

    // Настройки анимации
    const scaleNormal = 1;
    const scaleHover = 0.96;
    const transitionSpeed = 0.7; // секунды

    // Инициализация стилей
    img.style.transition = `
      transform ${transitionSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      scale ${transitionSpeed}s ease-out
    `;
    img.style.willChange = 'transform';

    // Плавное появление scale при наведении
    preview.addEventListener('mouseenter', () => {
      img.style.transform = `scale(${scaleHover})`;
    });

    const moveImg = (e) => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = preview.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Применяем трансформации, но сохраняем scale
        img.style.transform = `
          scale(${scaleHover})
          translate(${x * strength}px, ${y * strength}px)
          rotateX(${-y * 5}deg)
          rotateY(${x * 5}deg)
        `;
      });
    };

    // Плавный сброс
    const resetImg = () => {
      cancelAnimationFrame(rafId);
      img.style.transform = `scale(${scaleNormal})`;
    };

    preview.addEventListener('mousemove', moveImg);
    preview.addEventListener('mouseleave', resetImg);
  });
}

if (document.querySelector('.cases')) {
  const filterBtns = document.querySelectorAll('.cases__filter');
  const sortBtn = document.querySelector('.cases__sort-btn');
  const cardsContainer = document.querySelector('.cases__items');
  let cards = Array.from(document.querySelectorAll('.cases__item'));

  let activeCategory = null;
  let sortDirection = 'newest';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const category = this.dataset.filterCategory;

      if (activeCategory === category) {
        activeCategory = null;
        this.classList.remove('_active');
      } else {
        activeCategory = category;
        filterBtns.forEach(b => b.classList.remove('_active'));
        this.classList.add('_active');
      }

      updateCards();
    });
  });

  sortBtn.addEventListener('click', function () {
    sortDirection = sortDirection === 'newest' ? 'oldest' : 'newest';
    updateCards();
  });

  function updateCards() {
    // Flip state
    const state = Flip.getState(cards);

    // Фильтрация
    let filteredCards = cards.filter(card => {
      if (!activeCategory) return true;
      const categories = card.dataset.categories.split(',').map(cat => cat.trim());
      return categories.includes(activeCategory);
    });

    // Удаляем все карточки
    cards.forEach(card => {
      if (card.parentNode === cardsContainer) {
        cardsContainer.removeChild(card);
      }
    });


    // Вставляем новые карточки
    filteredCards.sort((a, b) => {
      const yearA = parseInt(a.dataset.year);
      const yearB = parseInt(b.dataset.year);
      return sortDirection === 'newest' ? yearB - yearA : yearA - yearB;
    });
    filteredCards.forEach(card => cardsContainer.appendChild(card));

    // Flip-анимация
    Flip.from(state, {
      duration: 0.7,
      absolute: true,
      scale: true,
      fade: true,
      ease: "power1.inOut",
      stagger: 0.03,
      // Опционально — кастомизируй вход/выход:
      onEnter: el => gsap.fromTo(el, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.55 }),
      onLeave: el => gsap.to(el, { opacity: 0, scale: 0.92, duration: 0.45 }),
      onComplete: () => {
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 700);
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(SplitText, ScrollTrigger, Flip);
  setupGlobalEvents();
  initPageAnimations();
  initSwup();
});

window.addEventListener('popstate', function (event) {
  window.location.href = location.href;
});