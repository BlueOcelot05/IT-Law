(function () {
  /* ---------- Consent-gated YouTube embeds ---------- */
  function mkIframe(videoId, privacy, titleText) {
    const host = privacy ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
    const url = `${host}/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`;
    const iframe = document.createElement("iframe");
    iframe.className = "yt-iframe";
    iframe.src = url;
    iframe.loading = "lazy";                 // performance
    iframe.title = titleText || "YouTube video";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    return iframe;
  }

  function wireConsent(el) {
    const btn = el.querySelector(".yt-load-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const vid = el.dataset.videoId;
      const privacy = el.dataset.privacy === "true";
      const titleText = el.closest(".card")?.querySelector("h2")?.textContent?.trim();
      el.replaceChildren(mkIframe(vid, privacy, titleText));
    });
  }

  document.querySelectorAll(".yt-consent").forEach(wireConsent);

  /* ---------- Theme toggle (dark <-> light) ---------- */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  function switchTheme() {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  if (toggle) toggle.addEventListener("click", switchTheme);

  /* ---------- Simple filter + search ---------- */
  const chips = document.querySelectorAll(".chip");
  const cards = Array.from(document.querySelectorAll(".card"));
  const q = document.getElementById("q");

  function applyFilter() {
    const activeChip = document.querySelector(".chip.is-active");
    const tag = activeChip ? activeChip.dataset.filter : "all";
    const term = (q?.value || "").trim().toLowerCase();

    cards.forEach(card => {
      const tags = (card.dataset.tags || "").toLowerCase();
      const text = (card.textContent || "").toLowerCase();
      const matchTag = tag === "all" || tags.includes(tag);
      const matchText = !term || text.includes(term);
      card.style.display = (matchTag && matchText) ? "" : "none";
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      applyFilter();
    });
  });

  if (q) {
    q.addEventListener("input", applyFilter);
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); q.focus();
      }
    });
  }

  /* ---------- Global consent toggle (load all embeds) ---------- */
  const box = document.getElementById("ytGlobalConsent");
  const KEY = "ytbConsentAll";
  function loadAllEmbeds() {
    document.querySelectorAll(".yt-consent").forEach(el => {
      if (el.firstElementChild?.classList?.contains("yt-iframe")) return; // already loaded
      const vid = el.dataset.videoId;
      const privacy = el.dataset.privacy === "true";
      const titleText = el.closest(".card")?.querySelector("h2")?.textContent?.trim();
      el.replaceChildren(mkIframe(vid, privacy, titleText));
    });
  }
  if (box) {
    const savedAll = localStorage.getItem(KEY) === "1";
    box.checked = savedAll;
    if (savedAll) loadAllEmbeds();
    box.addEventListener("change", () => {
      localStorage.setItem(KEY, box.checked ? "1" : "0");
      if (box.checked) loadAllEmbeds();
    });
  }

  applyFilter();
})();
