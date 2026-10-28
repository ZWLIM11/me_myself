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
      {opacity:0,transform:'translateY(10px)'},
      {opacity:1,transform:'translateY(0)'}
    ]:[
      {opacity:0,transform:'translateY(12px)'},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:document.documentElement.dataset.transitionSpeed==='quick'?340:850,easing:'cubic-bezier(.16,1,.3,1)'}));
  }
  document.addEventListener('portfolio:arrival',reveal);
  document.addEventListener('portfolio:pagechange',()=>{running.forEach(a=>a.cancel());running=[];});
  reveal();
})();
