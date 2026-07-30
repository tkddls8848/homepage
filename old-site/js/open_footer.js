// // 오픈 탭 메뉴

// const footerNav = document.querySelector(".footer_nav");
// const biggerMenus = footerNav.querySelectorAll("dl");
// const footerIcons = footerNav.querySelectorAll("i");

// const CLOSE_MENU = "40px";
// const OPEN_MENU = "fit-content";

// function handleFooterNav(e) {
//     const icon = e.target;
//     const biggerMenu = icon.parentNode;
//     const currentHeight = biggerMenu.style.height;
//     biggerMenus.forEach((biggerMenu) => {
//         if(biggerMenu.style.height === "fit-content") {
//             biggerMenu.style.height = "40px";
//             return;
//         }
//     })
//     if (currentHeight === CLOSE_MENU || currentHeight === "") {
//         biggerMenu.style.height = OPEN_MENU;
//     } else {
//         biggerMenu.style.height = CLOSE_MENU;
//     }
// };

// function init() {
//     biggerMenus.forEach((footerIcon) => {
//         footerIcon.addEventListener("click", handleFooterNav);
//     })
// };

// init();

// 오픈 탭 메뉴

const footerNav = document.querySelector(".footer_nav");
const biggerMenus = footerNav.querySelectorAll("dl");
const footerIcons = footerNav.querySelectorAll("i");

const OPEN_MENU = "open";

function handleFooterNav(e) {
    const icon = e.target;
    const biggerMenu = icon.parentNode;
    const currentClass = biggerMenu.className;
    for(var i=0;i<biggerMenus.length;i++){
        if(biggerMenus[i].className === "open") {
             biggerMenus[i].classList.remove("open");
             break;
         }
 }
    if (currentClass === OPEN_MENU) {
        biggerMenu.classList.remove(OPEN_MENU);
    } else {
        biggerMenu.classList.add(OPEN_MENU);
    }
};

function init() {
    for(var i=0;i<biggerMenus.length;i++){
        biggerMenus[i].addEventListener("click", handleFooterNav);
 }
};

init();