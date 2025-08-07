// скрипт этапов
const transformSlider = () => {
  const transformBlocks = Array.from(document.querySelectorAll('.transformation__item')).filter(block => {
    return window.getComputedStyle(block).display !== 'none';
  });
  const dotsContainers = document.querySelectorAll('.transformation__dots');
  let activeDot = 0;

  // создать точки по количеству слайдов
  dotsContainers.forEach(dotsContainer => {
    dotsContainer.innerHTML = '';
    
    transformBlocks.forEach((block, index) => {
      const dotContainer = document.createElement('span');
      dotContainer.className = 'transformation__dots-container';
      
      const dot = document.createElement('span');
      dot.className = 'transformation__dots-dot';
      
      if (index === activeDot) {
        dot.classList.add('active');
      }
      
      dotContainer.addEventListener('click', () => {
        goToSlide(index);
      });
      
      dotContainer.appendChild(dot);
      dotsContainer.appendChild(dotContainer);
    });
  });

  const prevBtn = document.querySelector('#transformation__prev');
  const nextBtn = document.querySelector('#transformation__next');
  const transformationContainer = document.querySelector('.transformation__blocks');

  // изменить активную точку
  function updateActiveDot() {
    const scrollPosition = transformationContainer.scrollLeft;
    const slideWidth = transformationContainer.offsetWidth;
    const activeIndex = Math.round(scrollPosition / slideWidth);
    
    document.querySelectorAll('.transformation__dots-dot').forEach(dot => {
      dot.classList.remove('active');
    });
    
    const dots = document.querySelectorAll('.transformation__dots-dot');
    if (dots[activeIndex]) {
      dots[activeIndex].classList.add('active');
    }

    // выключение кнопок
    prevBtn.disabled = activeIndex === 0;
    prevBtn.classList.toggle('disabled', activeIndex === 0);
    
    nextBtn.disabled = activeIndex === transformBlocks.length - 1;
    nextBtn.classList.toggle('disabled', activeIndex === transformBlocks.length - 1);
  }

  // перемотка к слайду
  function goToSlide(index, container) {
    const slideWidth = container.offsetWidth;
    activeDot = index;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  }

  if (prevBtn && nextBtn && transformationContainer) {
    nextBtn.addEventListener('click', () => {
      const currentIndex = Math.round(transformationContainer.scrollLeft / transformationContainer.offsetWidth);
      const nextIndex = (currentIndex + 1) % transformBlocks.length;
      goToSlide(nextIndex, transformationContainer);
    });

    prevBtn.addEventListener('click', () => {
      const currentIndex = Math.round(transformationContainer.scrollLeft / transformationContainer.offsetWidth);
      const prevIndex = (currentIndex - 1 + transformBlocks.length) % transformBlocks.length;
      goToSlide(prevIndex, transformationContainer);
    });

    transformationContainer.addEventListener('scroll', updateActiveDot);
  }

  updateActiveDot();
}

const screenWidth = window.innerWidth;

if (screenWidth < 770) {
  transformSlider()
}

// скрипт участников
let visibleSlides = 3;
const prevBtnParty = document.querySelector('#party__prev');
const nextBtnParty = document.querySelector('#party__next');
const partyContainer = document.querySelector('.party__blocks');
const partyBlocks = document.querySelectorAll('.party__person');

// обновление видимых слайдов
function updateVisibleSlides() {
  const allCounter = document.querySelector('.party__counter-all');
  const screenWidth = window.innerWidth;
  
  if (screenWidth < 770) {
    visibleSlides = 1;
    allCounter.textContent = partyBlocks.length;
  } else if (screenWidth < 1280) {
    visibleSlides = 2;
    allCounter.textContent = partyBlocks.length - 1;
  } else {
    visibleSlides = 3;
    allCounter.textContent = partyBlocks.length - 2;
  }
}

// счетчик слайдов
function updateCounter() {
  const slideWidth = partyBlocks[0].offsetWidth + 20;
  const currentIndex = Math.round(partyContainer.scrollLeft / slideWidth);
  document.querySelector('.party__counter-active').textContent = currentIndex + 1;
  updateButtons();
}

// обновление кнопок
function updateButtons() {
  const slideWidth = partyBlocks[0].offsetWidth + 20;
  const currentIndex = Math.round(partyContainer.scrollLeft / slideWidth);
  const maxIndex = partyBlocks.length - visibleSlides;
  
  prevBtnParty.disabled = currentIndex <= 0;
  nextBtnParty.disabled = currentIndex >= maxIndex;
}

// переход слайда
function goToPartySlide(index) {
  const slideWidth = partyBlocks[0].offsetWidth + 20;
  const maxIndex = partyBlocks.length - visibleSlides;
  const targetIndex = Math.min(Math.max(index, 0), maxIndex);
  
  partyContainer.scrollTo({
    left: targetIndex * slideWidth,
    behavior: 'smooth'
  });
  
  setTimeout(updateCounter, 300);
}

updateVisibleSlides();
goToPartySlide(0);

// обработка кнопок
prevBtnParty.addEventListener('click', () => {
  const slideWidth = partyBlocks[0].offsetWidth + 20;
  const currentIndex = Math.round(partyContainer.scrollLeft / slideWidth);
  goToPartySlide(currentIndex - 1);
});

nextBtnParty.addEventListener('click', () => {
  const slideWidth = partyBlocks[0].offsetWidth + 20;
  const currentIndex = Math.round(partyContainer.scrollLeft / slideWidth);
  goToPartySlide(currentIndex + 1);
});

// изменение размера
let resizeTimeout;
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth;
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const oldVisibleSlides = visibleSlides;
    updateVisibleSlides();

    if (currentWidth < 770) {
      transformSlider();
    }
    
    if (oldVisibleSlides !== visibleSlides) {
      const slideWidth = partyBlocks[0].offsetWidth + 20;
      const currentIndex = Math.round(partyContainer.scrollLeft / slideWidth);
      const newIndex = Math.floor(currentIndex * oldVisibleSlides / visibleSlides);
      goToPartySlide(newIndex);
    }
  }, 200);
});

partyContainer.addEventListener('scroll', updateCounter);