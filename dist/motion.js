(() => {
  const system=matchMedia('(prefers-reduced-motion: reduce)');
  let saved=false;
  try{saved=localStorage.getItem('portfolio-reduce-motion')==='true';}catch{}
  const preference=new EventTarget();
  Object.defineProperty(preference,'matches',{get:()=>system.matches||saved});
  window.portfolioMotion=preference;
  function update(){
    document.documentElement.dataset.motion=preference.matches?'off':'on';
    const button=document.querySelector('#motion-toggle');
    if(button){button.textContent=preference.matches?'Motion: reduced':'Motion: on';button.setAttribute('aria-pressed',String(preference.matches));button.disabled=system.matches;button.title=system.matches?'Reduced motion is enabled in your device settings.':'Toggle reduced motion';}
    if(preference.matches)document.getAnimations().forEach(animation=>animation.cancel());
    preference.dispatchEvent(new Event('change'));
  }
  window.togglePortfolioMotion=()=>{saved=!saved;try{localStorage.setItem('portfolio-reduce-motion',String(saved));}catch{}update();};
  system.addEventListener('change',update);update();
  document.addEventListener('DOMContentLoaded',()=>{document.querySelector('#motion-toggle').addEventListener('click',window.togglePortfolioMotion);update();});
})();
