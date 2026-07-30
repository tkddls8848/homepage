// 하얀바탕

const bg = document.querySelector(".wt_bg");

function killBackground() {
    const currentDisplay = bg.style.display;
    if (currentDisplay === "block") {
        bg.style.display = "none";
    }
};

window.onload = function() {
    killBackground();
}