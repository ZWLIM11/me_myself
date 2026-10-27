(() => {
  const root=document.documentElement, system=matchMedia('(prefers-color-scheme: light)');
  let choice;try{choice=localStorage.getItem('portfolio-theme');}catch{}
  function apply(){
    root.dataset.theme=choice==='light'||choice==='dark'?choice:system.matches?'light':'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',root.dataset.theme==='light'?'#f5f1e8':'#0d1412');
    document.querySelectorAll('.theme-toggle').forEach(b=>{b.textContent=root.dataset.theme==='light'?'☾ Dark mode':'☀ Light mode';b.setAttribute('aria-label','Switch to '+(root.dataset.theme==='light'?'dark':'light')+' mode');});
  }
  apply();system.addEventListener('change',apply);
  document.addEventListener('DOMContentLoaded',()=>{
    const host=document.querySelector('.chapter-controls,.case-footer,.explore-tools');if(!host)return;
    const button=document.createElement('button');button.type='button';button.className='theme-toggle';
    button.addEventListener('click',()=>{choice=root.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('portfolio-theme',choice);}catch{}apply();});host.append(button);apply();
  });
})();
