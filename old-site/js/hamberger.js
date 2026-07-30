// 햄버거 버튼

const body = document.querySelector("body");
const headerHam = document.querySelector("header");
const innerHeader = headerHam.querySelector(".inner");
const hamMenu = innerHeader.querySelector("nav");
const hamButton = headerHam.querySelector(".btn_ham");
const closeButton = innerHeader.querySelector(".btn_close");

function handleHam() {
    hamMenu.style.right = "0px";
    body.style.position = "fixed"
};

function handleClose() {
    hamMenu.style.right = "-100vw";
    body.style.position = "unset"
};

function init() {
    hamButton.addEventListener("click", handleHam);
    closeButton.addEventListener("click", handleClose);
};

init();