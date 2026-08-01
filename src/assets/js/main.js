/**
 * 전역 스크립트 — 의존성 없음(vanilla), ES module.
 * ---------------------------------------------------------------------------
 * 기존 사이트가 쓰던 것들을 대체합니다.
 *   jquery-3.5.1 (88KB)  → 불필요
 *   js/hamberger.js      → initNav()
 *   js/bg.js             → initHeaderState()
 *   js/tab.js, open_tab.js, open_footer.js → CSS 만으로 처리 (JS 없음)
 *   js/slider.js         → initHero()  (scroll-snap 기반, 위치 계산 없음)
 *   js/id_control.js     → 불필요 (URL 해시 대신 정상적인 링크 사용)
 *
 * 원칙
 *   - 각 기능은 해당 DOM 이 없으면 조용히 아무것도 하지 않습니다.
 *   - 모션은 prefers-reduced-motion 을 존중합니다.
 *   - JS 가 실패해도 콘텐츠는 항상 읽을 수 있습니다.
 */

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================================
   모바일 내비게이션 드로어
   ========================================================================== */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  if (!toggle || !panel) return;

  const label = toggle.querySelector(".sr-only");

  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "메뉴 닫기" : "메뉴 열기";
    if (backdrop) backdrop.hidden = !open;
  };

  const close = () => setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      close();
      toggle.focus();
    }
  });

  // 드로어 안의 링크를 누르면 닫습니다.
  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  // 데스크톱 폭으로 넘어가면 상태를 초기화합니다.
  window.matchMedia("(min-width: 60rem)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

/* ==========================================================================
   헤더 상태 (히어로 위 투명 → 스크롤 시 불투명)
   IntersectionObserver 로 처리해 스크롤 이벤트 핸들러가 없습니다.
   ========================================================================== */
function initHeaderState() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  // 헤더 바로 위에 1px 감지용 요소를 두고, 그것이 화면에서 벗어나면 stuck.
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  const overlay = header.classList.contains("site-header--overlay");
  const setSentinelPosition = () => {
    const hero = document.querySelector("[data-hero]");
    const offset = window.innerWidth <= 1024 ? 150 : 168;
    const top = overlay && hero ? Math.max(0, hero.offsetHeight - offset) : 0;
    sentinel.style.cssText =
      `position:absolute;top:${top}px;left:0;width:1px;height:1px;pointer-events:none;`;
  };
  setSentinelPosition();
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-stuck", !entry.isIntersecting),
    { rootMargin: "0px" }
  );
  observer.observe(sentinel);
  window.addEventListener("resize", setSentinelPosition, { passive: true });
}

/* ==========================================================================
   메인 슬라이드 (scroll-snap 캐러셀)
   - 위치를 JS 로 계산하지 않고 scrollTo 만 지시합니다 → 터치/키보드 동작이 자연스러움
   - 자동 전환은 hover/focus/탭 비활성/모션 최소화 설정에서 멈춥니다
   ========================================================================== */
function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const track = hero.querySelector("[data-hero-track]");
  const slides = [...hero.querySelectorAll("[data-hero-slide]")];
  const dots = [...hero.querySelectorAll("[data-hero-dot]")];
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 6500;

  const single = slides.length < 2;
  if (single) {
    hero.querySelector("[data-hero-controls]")?.setAttribute("hidden", "");
  }

  const render = () => {
    slides.forEach((slide, i) => slide.setAttribute("data-active", String(i === index)));
    dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
  };

  const goTo = (i, behavior) => {
    index = (i + slides.length) % slides.length;
    track.scrollTo({
      left: slides[index].offsetLeft - track.offsetLeft,
      behavior: behavior || (prefersReducedMotion() ? "auto" : "smooth"),
    });
    render();
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (single || prefersReducedMotion()) return;
    timer = setInterval(() => goTo(index + 1), INTERVAL);
  };

  prev?.addEventListener("click", () => {
    goTo(index - 1);
    start();
  });

  next?.addEventListener("click", () => {
    goTo(index + 1);
    start();
  });

  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      goTo(i);
      start();
    })
  );

  // 사용자가 직접 스와이프한 경우 활성 슬라이드를 따라갑니다.
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

  // 자동 전환 일시 정지 조건
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

/* ==========================================================================
   스크롤 진입 시 나타나기
   ========================================================================== */
function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (targets.length === 0) return;

  // 모션을 끄는 설정이거나 IntersectionObserver 가 없으면 아무것도 하지 않습니다.
  // (CSS 기본 상태가 "보임"이므로 콘텐츠는 그대로 노출됩니다.)
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

  // 여기서부터 숨김 상태가 적용됩니다.
  document.documentElement.classList.add("js-reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // 한 화면에 여러 개가 들어올 때만 아주 짧게 시차를 둡니다 (최대 180ms).
        entry.target.style.transitionDelay = `${Math.min(i * 60, 180)}ms`;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   이미지 폴백
   사진 에셋이 아직 배치되지 않았거나 파일명이 바뀐 경우, 깨진 이미지 아이콘
   대신 "이미지 준비중" 자리를 보여줍니다. (콘솔에 경로를 남겨 원인 파악도 쉽게)
   ========================================================================== */
function initImageFallback() {
  const handle = (img) => {
    img.style.display = "none";
    const holder = img.closest(
      ".product-card__media, .product-category-card__media, .hero__media, .media-placeholder"
    );
    if (holder) holder.classList.add("is-empty");
    if (img.closest(".brand")) img.closest(".brand").classList.add("is-fallback");
    if (img.closest(".site-footer__brand")) {
      img.closest(".site-footer__brand").querySelector(".brand__fallback")?.style.setProperty("display", "block");
    }
    console.warn("[assets] 이미지를 찾을 수 없습니다:", img.getAttribute("src"));
  };

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) handle(img);
    else img.addEventListener("error", () => handle(img), { once: true });
  });
}

/* ==========================================================================
   모바일 푸터 메뉴
   ========================================================================== */
function initFooterNav() {
  const toggles = [...document.querySelectorAll("[data-footer-toggle]")];
  if (toggles.length === 0) return;

  const closeAll = (except) => {
    toggles.forEach((toggle) => {
      if (toggle === except) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.closest("dl")?.classList.remove("open");
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (!window.matchMedia("(max-width: 64rem)").matches) return;
      const open = toggle.getAttribute("aria-expanded") !== "true";
      closeAll(toggle);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.closest("dl")?.classList.toggle("open", open);
    });
  });

  window.matchMedia("(min-width: 64.01rem)").addEventListener("change", (event) => {
    if (event.matches) closeAll();
  });
}

/* ==========================================================================
   문의 폼
   - 엔드포인트가 설정되어 있으면 fetch 로 전송
   - 없으면 mailto 로 대체 (정적 호스팅에서도 문의가 끊기지 않도록)

   검증은 브라우저 기본 검사(required / type / pattern / maxlength) 위에
   아래를 더합니다. 브라우저 검사만으로는 막지 못하는 것들입니다.
     · 공백만 입력  — required 는 "   " 를 통과시킵니다
     · 길이 초과    — maxlength 는 입력을 막을 뿐, 자동완성·스크립트로 들어온
                      값이나 maxlength 를 지운 폼은 걸러내지 못합니다
     · 개인정보 동의 — 체크되지 않으면 전송하지 않습니다
     · 봇          — honeypot 에 더해 "너무 빨리 제출" 을 함께 봅니다
     · 중복 전송    — 연타로 같은 문의가 여러 번 가는 것을 막습니다
   ========================================================================== */

/** 제출까지 이보다 빠르면 사람이 채운 것으로 보지 않습니다(ms). */
const MIN_FILL_MS = 3000;

/**
 * mailto 본문. 전송 서비스가 없을 때와, 전송이 실패했을 때 모두 씁니다.
 * 폼의 모든 항목이 빠짐없이 담기도록 한 곳에서 만듭니다.
 */
const mailBody = (data) =>
  [
    `회사명: ${data.get("company") || "-"}`,
    `부서명: ${data.get("department") || "-"}`,
    `성명: ${data.get("name") || "-"}`,
    `직책: ${data.get("position") || "-"}`,
    `연락처: ${data.get("phone") || "-"}`,
    `이메일: ${data.get("email") || "-"}`,
    `관심 솔루션: ${data.get("solution") || "-"}`,
    `문의 분류: ${data.get("category") || "-"}`,
    `개인정보 수집·이용 동의: 동의함 (${data.get("privacy_agreed_at")})`,
    "",
    data.get("message") || "",
  ].join("\n");

/** 필드 이름 → 화면에 쓰는 이름 (오류 메시지용). */
const FIELD_LABELS = {
  name: "성명",
  position: "직책",
  company: "회사명",
  department: "부서명",
  phone: "연락처",
  email: "이메일",
  message: "문의내용",
};

/**
 * 제어문자(줄바꿈·탭 제외)를 제거하고 앞뒤 공백을 정리합니다.
 * 메일 제목·본문에 제어문자가 섞여 들어가는 것을 막습니다.
 */
const clean = (value) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

function initForm() {
  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[type='submit']");
  const loadedAt = Date.now();
  let sending = false;

  let limits = {};
  try {
    limits = JSON.parse(form.dataset.limits || "{}");
  } catch {
    limits = {};
  }

  const say = (message, state) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state || "";
  };

  /* 문의내용 글자 수 표시. 남은 양을 알려줘 잘린 채로 보내는 일을 줄입니다. */
  const message = form.elements.namedItem("message");
  const counter = form.querySelector("[data-count-for='message']");
  if (message && counter && limits.message) {
    // 마크업이 바뀌어 hint 가 사라져도 폼 초기화 전체가 죽지 않도록 분리합니다.
    const hint = counter.closest(".field__hint");
    const render = () => {
      counter.textContent = String(message.value.length);
      if (hint) {
        hint.dataset.state = message.value.length >= limits.message * 0.9 ? "warn" : "";
      }
    };
    message.addEventListener("input", render);
    render();
  }

  /**
   * 브라우저 검사 이후의 추가 검증.
   * @returns {string} 문제가 있으면 사용자에게 보여줄 메시지, 없으면 빈 문자열
   */
  const validate = () => {
    for (const [field, max] of Object.entries(limits)) {
      const input = form.elements.namedItem(field);
      if (input && clean(input.value).length > max) {
        return `${FIELD_LABELS[field] || field} 항목을 ${max}자 이내로 줄여 주세요.`;
      }
    }

    for (const field of ["name", "phone", "email", "message"]) {
      const input = form.elements.namedItem(field);
      if (input && !clean(input.value)) {
        return `${FIELD_LABELS[field] || field} 항목을 입력해 주세요.`;
      }
    }

    if (!form.elements.namedItem("privacy")?.checked) {
      return "개인정보 수집·이용에 동의해 주세요.";
    }

    return "";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (sending) return;
    if (!form.reportValidity()) return;

    // 봇이 채우는 필드가 비어 있지 않으면 조용히 무시합니다.
    if (form.elements.namedItem("_gotcha")?.value) return;

    // 사람이 채웠다고 보기 어려운 속도. 사람일 수도 있으므로 안내는 합니다.
    if (Date.now() - loadedAt < MIN_FILL_MS) {
      say("입력을 마친 뒤 잠시 후 다시 눌러 주세요.", "error");
      return;
    }

    const problem = validate();
    if (problem) {
      say(problem, "error");
      return;
    }

    const data = new FormData(form);
    for (const [key, value] of [...data.entries()]) {
      if (typeof value === "string") data.set(key, clean(value));
    }
    // 동의 사실과 시점을 문의 내용에 함께 남깁니다(별도 저장소가 없으므로).
    data.set("privacy_agreed_at", new Date().toISOString());

    // 담당자가 메일함에서 한눈에 알아볼 제목.
    const subject = `[홈페이지 문의] ${data.get("company") || ""} ${data.get("name") || ""}`.trim();
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
    submit?.setAttribute("disabled", "");
    say("전송 중입니다…");

    try {
      // 우리 쪽에서만 쓰는 함정 필드는 보내지 않습니다(받는 메일이 지저분해짐).
      const payload = Object.fromEntries(data);
      delete payload._gotcha;

      // Web3Forms 는 JSON 본문을 공식 경로로 안내합니다. 라디오·텍스트뿐이라
      // Object.fromEntries 로 값이 유실될 필드가 없습니다(파일·다중선택 없음).
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      // 200 이 아니면 본문에 사유가 담겨 옵니다(키 오류, 스팸 판정 등).
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      form.reset();
      say("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.", "ok");
    } catch (error) {
      console.error(error);
      // 전송이 실패해도 문의가 끊기지 않도록 mailto 로 넘겨 줍니다.
      say(
        `전송에 실패했습니다. 메일 작성 창을 엽니다. 열리지 않으면 ${form.dataset.mailto} 로 보내주세요.`,
        "error"
      );
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(mailBody(data))}`;
    } finally {
      sending = false;
      submit?.removeAttribute("disabled");
    }
  });
}

/* ==========================================================================
   부트스트랩
   ========================================================================== */
const boot = () => {
  document.documentElement.classList.remove("no-js");
  initNav();
  initHeaderState();
  initHero();
  initReveal();
  initImageFallback();
  initFooterNav();
  initForm();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
