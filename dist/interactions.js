(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const magnetic = '.button, .outline-button, .contact-links>a, .contact-links>button';
  const responsive = magnetic + ', .project-card, .about-photo';
  const hero = document.querySelector('.hero-image');
  const orbit = document.querySelector('.contact-art');
  let frame = 0;
  let latest;
  let active;
  const tracked = new Set();
  const properties = ['--magnet-x','--magnet-y','--tilt-x','--tilt-y','--shine-x','--shine-y','--image-x','--image-y','--hero-x','--hero-y','--orbit-x','--orbit-y'];
  const set = (element, values) => { if (!element) return; tracked.add(element); for (const [key,value] of Object.entries(values)) element.style.setProperty(key,value); };
  const clear = element => { if (!element) return; for (const property of properties) element.style.removeProperty(property); tracked.delete(element); };
  function reset() { cancelAnimationFrame(frame); frame = 0; latest = null; active = null; for (const element of [...tracked]) clear(element); }
  function update() {
    frame = 0;
    if (!latest || motion.matches || !pointer.matches) return;
    const { x, y, target } = latest;
    const element = target.closest(responsive);
    if (active !== element) { clear(active); active = element; }
    if (element) {
      const rect = element.getBoundingClientRect();
      const dx = Math.max(-.5, Math.min(.5,(x - rect.left) / rect.width - .5));
      const dy = Math.max(-.5, Math.min(.5,(y - rect.top) / rect.height - .5));
      if (element.matches(magnetic)) set(element, {'--magnet-x':`${dx * 10}px`,'--magnet-y':`${dy * 10}px`});
      else set(element, {'--tilt-x':`${-dy * 8}deg`,'--tilt-y':`${dx * 8}deg`,'--shine-x':`${(dx + .5)*100}%`,'--shine-y':`${(dy + .5)*100}%`,'--image-x':`${dx * -8}px`,'--image-y':`${dy * -8}px`});
    }
    const dx = x / innerWidth - .5;
    const dy = y / innerHeight - .5;
    if (target.closest('#home')) set(hero, {'--hero-x':`${dx * -16}px`,'--hero-y':`${dy * -12}px`}); else clear(hero);
    if (target.closest('#contact')) set(orbit, {'--orbit-x':`${dx * 18}px`,'--orbit-y':`${dy * 14}px`}); else clear(orbit);
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || motion.matches || !pointer.matches || document.querySelector('dialog[open]')) return;
    latest = {x:event.clientX,y:event.clientY,target:event.target};
    if (!frame) frame = requestAnimationFrame(update);
  }, {passive:true});
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) reset();
    else if (active && !active.contains(event.relatedTarget)) { clear(active); active = null; }
  }, {passive:true});
  document.addEventListener('click', event => {
    if (motion.matches) return;
    const button = event.target.closest(magnetic);
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'tap-wave'; wave.setAttribute('aria-hidden','true');
    wave.style.left = `${event.detail ? event.clientX - rect.left : rect.width / 2}px`;
    wave.style.top = `${event.detail ? event.clientY - rect.top : rect.height / 2}px`;
    button.append(wave);
    wave.addEventListener('animationend', () => wave.remove(), {once:true});
    setTimeout(() => wave.remove(), 900);
  });
  window.addEventListener('blur', reset);
  window.addEventListener('hashchange', reset);
  document.addEventListener('portfolio:pagechange', reset);
  window.addEventListener('scroll', reset, {passive:true});
  motion.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
})();
