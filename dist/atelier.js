(()=>{
  let running=[];
  function reveal(){
    running.forEach(a=>a.cancel());running=[];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off')return;
    const page=document.querySelector('.page.active');
    if(!page)return;
    const title=page.querySelector('h1');
    if(!title)return;
    // Animate the intact heading so line wrapping and accessible names stay stable.
    const photo=page.id==='photography';
    running.push(title.animate(photo?[
      {opacity:0,transform:'translateY(5px)'},
      {opacity:1,transform:'translateY(0)'}
    ]:[
      {opacity:0,transform:'translateY(6px)'},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:document.documentElement.dataset.transitionSpeed==='quick'?240:600,easing:'cubic-bezier(.16,1,.3,1)'}));
  }
  document.addEventListener('portfolio:arrival',reveal);
  document.addEventListener('portfolio:pagechange',()=>{running.forEach(a=>a.cancel());running=[];});
  const surfaces=document.querySelectorAll('.room-doors>a,#steam-collection>a,.interest-grid>a,.study-shelves button');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  surfaces.forEach(surface=>{
    surface.classList.add('depth-surface');let frame=0;
    surface.addEventListener('pointermove',e=>{
      if(!fine.matches||window.portfolioMotion?.matches)return;
      cancelAnimationFrame(frame);const x=e.clientX,y=e.clientY;
      frame=requestAnimationFrame(()=>{const r=surface.getBoundingClientRect();const dx=(x-r.left)/r.width-.5,dy=(y-r.top)/r.height-.5;
        surface.style.setProperty('--depth-x',dx);surface.style.setProperty('--depth-y',-dy);surface.style.setProperty('--depth-angle','3deg');
        surface.style.setProperty('--light-x',`${(dx+.5)*100}%`);surface.style.setProperty('--light-y',`${(dy+.5)*100}%`);
      });
    },{passive:true});
    surface.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);surface.style.setProperty('--depth-angle','0deg');});
  });
  document.querySelectorAll('.page:not(.home-page) h1').forEach(title=>{
    title.addEventListener('pointermove',event=>{
      if(!fine.matches||window.portfolioMotion?.matches)return;
      const rect=title.getBoundingClientRect();
      title.style.setProperty('--name-light',`${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
      title.classList.add('heading-lit');
    },{passive:true});
    title.addEventListener('pointerleave',()=>title.classList.remove('heading-lit'));
  });
  reveal();
})();
