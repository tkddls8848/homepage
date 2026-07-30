// 메인 슬라이드

const slider = document.querySelector(".slider");
const slide = slider.querySelector(".slide");
const prev = slider.querySelector(".prev");
const next = slider.querySelector(".next");

const FIRST_SLIDE = "1";
const SECOND_SLIDE = "0";

function handlePrev() {
    const currentSlide = slide.style.opacity;
    if (currentSlide === FIRST_SLIDE) {
        slide.style.opacity = SECOND_SLIDE;
    } else {
        slide.style.opacity = FIRST_SLIDE;
    }
};

function handleNext() {
    const currentSlide = slide.style.opacity;
    if (currentSlide === FIRST_SLIDE) {
        slide.style.opacity = SECOND_SLIDE;
    } else {
        slide.style.opacity = FIRST_SLIDE;
    }
};

function autoSlide() {
    const currentSlide = slide.style.opacity;
    if (currentSlide === FIRST_SLIDE) {
        slide.style.opacity = SECOND_SLIDE;
    } else {
        slide.style.opacity = FIRST_SLIDE;
    }
};



function init() {
    prev.addEventListener("click", handlePrev);
    next.addEventListener("click", handleNext);
    autoSlide();
    setInterval(autoSlide, 3000);
};

init();