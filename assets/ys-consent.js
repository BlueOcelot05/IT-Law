(function () {
  function mkIframe(videoId, privacy) {
    // Use privacy-enhanced mode if requested (no cookies until user interacts),
    // still loads from YouTube domain once consent is given.
    const host = privacy ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
    const url = `${host}/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`;
    const iframe = document.createElement("iframe");
    iframe.className = "yt-iframe";
    iframe.setAttribute("allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    iframe.src = url;
    return iframe;
  }

  function wire(el) {
    const btn = el.querySelector(".yt-load-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const vid = el.dataset.videoId;
      const privacy = el.dataset.privacy === "true";
      const iframe = mkIframe(vid, privacy);
      el.replaceChildren(iframe);
    });
  }

  document.querySelectorAll(".yt-consent").forEach(wire);
})();
