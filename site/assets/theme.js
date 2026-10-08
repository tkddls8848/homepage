(() => {
  const key = 'portfolio-theme';
  const root = document.documentElement;
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* Storage may be unavailable; the toggle still works. */ }

  function apply() {
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#09090b' : '#ffffff');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
    }
  }

  // Runs in the head before the stylesheet to restore the theme before paint.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      apply();
      try { localStorage.setItem(key, theme); } catch { /* Keep session choice. */ }
    });
  });
  window.addEventListener('storage', (event) => {
    if (event.key === key || event.key === null) {
      theme = event.newValue === 'light' ? 'light' : 'dark';
      apply();
    }
  });
})();
