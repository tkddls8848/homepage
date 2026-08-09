const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  const label = toggle.querySelector(".sr-only");

  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "메뉴 닫기" : "메뉴 열기";
    backdrop.hidden = !open;
  };
  const close = () => setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  backdrop.addEventListener("click", close);
  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      close();
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 60rem)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

function initHeader() {
  const header = document.querySelector("[data-site-header]");
  const sentinel = document.createElement("div");
  const overlay = header.classList.contains("site-header--overlay");

  sentinel.setAttribute("aria-hidden", "true");
  const positionSentinel = () => {
    const hero = document.querySelector("[data-hero]");
    const offset = window.innerWidth <= 1024 ? 150 : 168;
    const top = overlay && hero ? Math.max(0, hero.offsetHeight - offset) : 0;
    sentinel.style.cssText =
      `position:absolute;top:${top}px;left:0;width:1px;height:1px;pointer-events:none`;
  };

  positionSentinel();
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-stuck", !entry.isIntersecting);
  }).observe(sentinel);
  window.addEventListener("resize", positionSentinel, { passive: true });
}

function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const track = hero.querySelector("[data-hero-track]");
  const slides = [...hero.querySelectorAll("[data-hero-slide]")];
  const dots = [...hero.querySelectorAll("[data-hero-dot]")];
  let index = 0;
  let timer;

  const render = () => {
    slides.forEach((slide, slideIndex) =>
      slide.setAttribute("data-active", String(slideIndex === index))
    );
    dots.forEach((dot, dotIndex) =>
      dot.setAttribute("aria-current", String(dotIndex === index))
    );
  };
  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.scrollTo({
      left: slides[index].offsetLeft - track.offsetLeft,
      behavior: reduceMotion() ? "auto" : "smooth",
    });
    render();
  };
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (!reduceMotion()) timer = setInterval(() => goTo(index + 1), 6500);
  };

  hero.querySelector("[data-hero-prev]").addEventListener("click", () => {
    goTo(index - 1);
    start();
  });
  hero.querySelector("[data-hero-next]").addEventListener("click", () => {
    goTo(index + 1);
    start();
  });
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      goTo(dotIndex);
      start();
    });
  });

  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          index = slides.indexOf(entry.target);
          render();
        }
      }
    },
    { root: track, threshold: [0.6] }
  );
  slides.forEach((slide) => visibility.observe(slide));

  hero.addEventListener("pointerenter", stop);
  hero.addEventListener("pointerleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start()
  );

  render();
  start();
}

function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length || reduceMotion()) return;

  document.documentElement.classList.add("js-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(index * 60, 180)}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0 0 -8%", threshold: 0.08 }
  );
  targets.forEach((target) => observer.observe(target));
}

function initFooter() {
  const toggles = [...document.querySelectorAll("[data-footer-toggle]")];
  const closeAll = (except) => {
    toggles.forEach((toggle) => {
      if (toggle === except) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.closest("dl").classList.remove("open");
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (!window.matchMedia("(max-width: 64rem)").matches) return;
      const open = toggle.getAttribute("aria-expanded") !== "true";
      closeAll(toggle);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.closest("dl").classList.toggle("open", open);
    });
  });
  window.matchMedia("(min-width: 64.01rem)").addEventListener("change", (event) => {
    if (event.matches) closeAll();
  });
}

const mailBody = (data) =>
  [
    `회사명: ${data.get("company") || "-"}`,
    `부서명: ${data.get("department") || "-"}`,
    `성명: ${data.get("name")}`,
    `직책: ${data.get("position") || "-"}`,
    `연락처: ${data.get("phone")}`,
    `이메일: ${data.get("email")}`,
    `관심 솔루션: ${data.get("solution")}`,
    `문의 분류: ${data.get("category")}`,
    `개인정보 수집·이용 동의: ${data.get("privacy")} (${data.get("privacy_agreed_at")})`,
    "",
    data.get("message"),
  ].join("\n");

function initForm() {
  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[type='submit']");
  const message = form.elements.namedItem("message");
  const counter = form.querySelector("[data-count-for='message']");
  const hint = counter.closest(".field__hint");
  let sending = false;

  const say = (text, state = "") => {
    status.textContent = text;
    status.dataset.state = state;
  };
  const renderCount = () => {
    counter.textContent = String(message.value.length);
    hint.dataset.state = message.value.length >= message.maxLength * 0.9 ? "warn" : "";
  };
  message.addEventListener("input", renderCount);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(form);
    data.set("privacy_agreed_at", new Date().toISOString());
    const subject = `[홈페이지 문의] ${data.get("company") || ""} ${data.get("name")}`.trim();
    data.set("subject", subject);

    const endpoint = form.getAttribute("action");
    if (!endpoint) {
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(mailBody(data))}`;
      say("메일 작성 창이 열립니다. 열리지 않으면 아래 주소로 보내주세요.", "ok");
      return;
    }

    sending = true;
    submit.disabled = true;
    say("전송 중입니다…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);

      form.reset();
      renderCount();
      say("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.", "ok");
    } catch (error) {
      console.error(error);
      say(`전송에 실패했습니다. ${form.dataset.mailto}로 보내주세요.`, "error");
    } finally {
      sending = false;
      submit.disabled = false;
    }
  });
}

initNav();
initHeader();
initHero();
initReveal();
initFooter();
initForm();
