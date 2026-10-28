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
      {opacity:0,filter:'blur(5px)',transform:'scale(.98)'},
      {opacity:1,filter:'blur(0)',transform:'scale(1)'}
    ]:[
      {opacity:0,transform:'translateY(22px)',clipPath:'inset(0 0 100% 0)'},
      {opacity:1,transform:'translateY(0)',clipPath:'inset(-12% -4% -12% -4%)'}
    ],{duration:720,easing:'cubic-bezier(.16,1,.3,1)'}));
    const emphasis=title.querySelector('em');
    if(emphasis)running.push(emphasis.animate([{opacity:.3},{opacity:1}],{duration:900,easing:'ease-out'}));
  }
  document.addEventListener('portfolio:transitionend',reveal);
  document.addEventListener('portfolio:pagechange',()=>{running.forEach(a=>a.cancel());running=[];});
  reveal();
})();
