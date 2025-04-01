
document.addEventListener('DOMContentLoaded', () => {
  //бургер

  const burger = document.querySelector('.burger');
  const burgerSpan = document.querySelector('.burger span');
  const menu = document.querySelector('.menu');
  const menuItems = document.querySelectorAll('.menu li');

  burger.addEventListener('click', () => {
    document.body.classList.toggle("no-scroll");
    menu.classList.toggle('open');
    burgerSpan.classList.toggle('open-burger');
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !burger.contains(event.target)) {
      menu.classList.remove('open');
      document.body.classList.remove("no-scroll");
      burgerSpan.classList.remove('open-burger');
      menuItems.forEach(item => {
        item.classList.remove('open');
      });
    }
  });

  //обертка для изменения шрифта первого слова в слайдере

  function makeFirstWordBig(selector) {
    const paragraphs = document.querySelectorAll(selector);

    paragraphs.forEach(paragraph => {
      const text = paragraph.textContent;
      const words = text.trim().split(' ');

      if (words.length > 0) {
        const firstWord = words[0];
        const restOfText = words.slice(1).join(' ');
        paragraph.innerHTML = `<span class="first-word">${firstWord}</span> ${restOfText ? ' ' + restOfText : ''}`;
      }
    });
  }

  // Использование (можно вызывать для разных наборов элементов)
  makeFirstWordBig('#big-first-word');

  //инициализация слайдера 

  new Swiper(".top-slider-init-wrap", {
    pagination: {
      el: ".swiper-pagination",
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });



  // слайдер с сегментами

  const pieChartContainer = document.querySelector('.pie-chart-container svg');
  const swiperSlides = document.querySelectorAll('.swiper-slide');
  let swiper;
  let pieSegments;

  function extractPercentage(slide) {
    let titleText = '';
    try {
      titleText = slide.querySelector('.num-percent').textContent;
    } catch (e) {

    }
    const percentageMatch = titleText.match(/(\d+)%/);
    return percentageMatch ? parseInt(percentageMatch[1], 10) : 0;
  }

  function getCSSVariable(index) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--segment-color-${index}`);
  }

  function generatePieChart(data) {
    // Начинаем с -90°, чтобы 0° было в позиции 12 часов.
    let startAngle = -90;

    if (pieChartContainer) {
      pieChartContainer.innerHTML = '';
    }

    pieSegments = [];

    const innerRadius = 20;
    const outerRadius = 50;
    const centerX = 50;
    const centerY = 50;

    // Сумма процентов для слайдов с индексом >= 1
    const remainingSum = data.slice(1).reduce((acc, val) => acc + val, 0);

    data.forEach((percentage, index) => {
      let angle;
      if (index === 0) {
        // Фиксированный угол для первого сегмента: 120°
        angle = 120;
      } else {
        // Остальные сегменты получают пропорциональную долю от 240°
        angle = (percentage / remainingSum) * 240;
      }
      const endAngle = startAngle + angle;

      const x1 = centerX + innerRadius * Math.cos(Math.PI * startAngle / 180);
      const y1 = centerY + innerRadius * Math.sin(Math.PI * startAngle / 180);
      const x2 = centerX + innerRadius * Math.cos(Math.PI * endAngle / 180);
      const y2 = centerY + innerRadius * Math.sin(Math.PI * endAngle / 180);

      const x3 = centerX + outerRadius * Math.cos(Math.PI * endAngle / 180);
      const y3 = centerY + outerRadius * Math.sin(Math.PI * endAngle / 180);
      const x4 = centerX + outerRadius * Math.cos(Math.PI * startAngle / 180);
      const y4 = centerY + outerRadius * Math.sin(Math.PI * startAngle / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const d = `M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

      const segmentElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      segmentElement.setAttribute('d', d);
      segmentElement.setAttribute('fill', getCSSVariable(index));
      segmentElement.setAttribute('class', 'pie-segment');
      segmentElement.dataset.index = index;

      segmentElement.addEventListener('click', () => {
        swiper.slideTo(index);
      });

      pieChartContainer.appendChild(segmentElement);
      pieSegments.push(segmentElement);
      startAngle = endAngle;
    });

    // Устанавливаем активным первый сегмент (индекс 0)
    updateActiveSegment(0);
  }

  function updateActiveSegment(index) {
    pieSegments.forEach((segment, i) => {
      const color = getCSSVariable(i);
      if (i === index) {
        segment.classList.add('active');
        segment.setAttribute('fill', '#3b5bdb');
      } else {
        segment.classList.remove('active');
        segment.setAttribute('fill', color);
      }
    });
  }

  function initializeSwiper() {
    const slidesData = Array.from(swiperSlides).map(extractPercentage);

    swiper = new Swiper('.swiper-container', {
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true,
      initialSlide: 0, // первый слайд соответствует первому сегменту
    });

    swiper.on('slideChange', () => {
      updateActiveSegment(swiper.realIndex);
    });

    generatePieChart(slidesData);
  }

  window.addEventListener('load', () => {
    initializeSwiper();
  });


  
});



