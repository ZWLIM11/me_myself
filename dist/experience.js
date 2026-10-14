(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const animations = new Set();
  // Animate on entry instead of hiding content: everything remains readable if JS fails.
  const selector = '.home-block > *, .about-layout > *, .about-toolkit, .photo-gallery > *, .projects-intro, #project-grid > *, .contact-content > *, .photography-page > h1';
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting || target.closest('[hidden]') || reduced.matches) return;
      const animation = target.animate([{opacity:.15,translate:'0 42px'},{opacity:1,translate:'0 0'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'});
      animations.add(animation); animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
      observer.unobserve(target);
    });
  }, {threshold:.08});
  function watch() { document.querySelectorAll(selector).forEach(element=>{if(!seen.has(element)){seen.add(element);observer.observe(element);}}); }
  watch();
  const mutation = new MutationObserver(watch);
  mutation.observe(document.querySelector('#project-grid'),{childList:true});
  mutation.observe(document.querySelector('#photo-gallery'),{childList:true});
  document.addEventListener('portfolio:pagechange',()=>{document.querySelectorAll(selector).forEach(element=>observer.observe(element));hideCursor();});
  const updateHeader = () => header.classList.toggle('is-scrolled',scrollY>30);
  window.addEventListener('scroll',updateHeader,{passive:true}); updateHeader();
  const projects=document.querySelector('#projects');
  const end=document.createElement('div');end.className='chapter-end';end.innerHTML='<a href="#photography">Next chapter · Through my lens ↗</a>';projects.append(end);
  const cursor=document.createElement('div');cursor.className='data-cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<svg viewBox="0 0 84 84"><g class="satellites"><path d="M16 25 64 16 70 62 25 71 16 25 70 62M25 71 64 16"/><circle cx="16" cy="25" r="3"/><circle cx="64" cy="16" r="3"/><circle cx="70" cy="62" r="3"/><circle cx="25" cy="71" r="3"/></g></svg><span class="cursor-label"></span>';
  document.body.append(cursor);
  let frame=0, point=null;
  function hideCursor(){cancelAnimationFrame(frame);frame=0;point=null;cursor.classList.remove('visible','has-label');}
  function draw(){frame=0;if(!point)return;cursor.style.transform=`translate3d(${point.x-42}px,${point.y-42}px,0)`;cursor.classList.add('visible');}
  document.addEventListener('pointermove',event=>{
    if(reduced.matches||!fine.matches||event.pointerType==='touch'||document.querySelector('dialog[open]')){hideCursor();return;}
    point={x:event.clientX,y:event.clientY};
    const project=event.target.closest('[data-project]');
    const photo=event.target.closest('[data-photo]');
    const tool=event.target.closest('[data-skill]');
    const action=event.target.closest('a,button');
    const label=project?'EXPLORE ↗':photo?'VIEW ↗':tool?'DISCOVER ↗':action?'OPEN ↗':'';
    cursor.querySelector('.cursor-label').textContent=label;cursor.classList.toggle('has-label',!!label);
    if(!frame)frame=requestAnimationFrame(draw);
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hideCursor();},{passive:true});
  document.addEventListener('click',hideCursor);
  window.addEventListener('blur',hideCursor);
  window.addEventListener('scroll',hideCursor,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor();});
  reduced.addEventListener('change',()=>{hideCursor();if(reduced.matches){animations.forEach(a=>a.cancel());animations.clear();}});
  fine.addEventListener('change',hideCursor);
})();
