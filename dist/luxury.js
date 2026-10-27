(() => {
  // Suspend decorative CSS motion off screen; do not interfere with pointer-driven hover effects.
  const idle = () => document.documentElement.classList.toggle('page-idle', document.hidden);
  document.addEventListener('visibilitychange', idle);
  idle();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle('motion-suspended', !entry.isIntersecting);
        if (!entry.isIntersecting) entry.target.querySelectorAll('video').forEach(video => video.pause());
      }
    }, {rootMargin:'80px'});
    document.querySelectorAll('.robot-stage,.contact-art,.hero-seal,.photo-gallery,.project-grid').forEach(element => observer.observe(element));
  }
  document.querySelectorAll('img').forEach(img => { img.decoding = 'async'; });
})();
