// 오픈 탭 메뉴

const mobileTab = document.querySelector(".m_tab");
const drawerTab = mobileTab.querySelector(".drawer_tab");
const aboutTab = mobileTab.querySelector(".t_about");
const infraTab = mobileTab.querySelector(".t_infra");
const productTab = mobileTab.querySelector(".t_product");

const ARROW_DOWN = "rotate(0deg)";
const ARROW_UP = "rotate(180deg)";

function handleMobileTab() {
    const currentRotate = drawerTab.style.transform;
    //console.log(currentRotate);
    if (currentRotate === ARROW_DOWN) {
        drawerTab.style.transform = ARROW_UP;
        aboutTab.style.margin = "0 0 0 0";
        infraTab.style.margin = "60px 0 0 0";
        productTab.style.margin = "120px 0 0 0";
    } else {
        drawerTab.style.transform = ARROW_DOWN;
        aboutTab.style.margin = "0";
        infraTab.style.margin = "0";
        productTab.style.margin = "0";
    }
};

function init() {
    mobileTab.addEventListener("click", handleMobileTab);
};

init();