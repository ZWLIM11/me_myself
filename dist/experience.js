(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const animations = new Set();
  // Animate on entry instead of hiding content: everything remains readable if JS fails.
  const selector = '.home-block > :not(.project-grid):not(.photo-carousel), .home-block .project-card, .about-layout > *, .about-toolkit, .photo-gallery > *, .projects-intro, #project-grid > *, .contact-content > *, .photography-page > h1';
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting || target.closest('[hidden]') || reduced.matches || document.documentElement.classList.contains('is-routing')) return;
      const animation = target.animate([{opacity:.65,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:460,easing:'cubic-bezier(.2,.65,.3,1)'});
      animations.add(animation); animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
      observer.unobserve(target);
    });
  }, {threshold:0,rootMargin:'0px 0px 45px 0px'});
  function watch() { document.querySelectorAll(selector).forEach(element=>{if(!seen.has(element)){seen.add(element);observer.observe(element);}}); }
  watch();
  const mutation = new MutationObserver(watch);
  mutation.observe(document.querySelector('#project-grid'),{childList:true});
  mutation.observe(document.querySelector('#photo-gallery'),{childList:true});
  document.addEventListener('portfolio:pagechange',()=>{document.querySelectorAll(selector).forEach(element=>observer.observe(element));hideCursor();});
  document.addEventListener('portfolio:transitionend',()=>{
    document.querySelectorAll(selector).forEach(element=>{
      if(element.closest('[hidden]'))return;
      const rect=element.getBoundingClientRect();
      // Already-visible content has just entered with the page. Reveal only later scroll content.
      if(rect.top<innerHeight && rect.bottom>0) observer.unobserve(element);
      else observer.observe(element);
    });
  });
  const updateHeader = () => header.classList.toggle('is-scrolled',scrollY>30);
  window.addEventListener('scroll',updateHeader,{passive:true}); updateHeader();
  const projects=document.querySelector('#projects');
  const end=document.createElement('div');end.className='chapter-end';end.innerHTML='<a href="#photography">Next chapter · Through my lens ↗</a>';projects.append(end);
  const cursor=document.createElement('div');cursor.className='focus-cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<span class="focus-ring"><svg class="circuit-orbit" viewBox="0 0 64 64"><g class="circuit-rotor"><path d="M32 5 55 18v28L32 59 9 46V18Z"/><path d="M32 5v9l8 5M55 46l-8-5v-9M9 46l8-5 8 5"/><circle cx="32" cy="5" r="2.5"/><circle cx="55" cy="46" r="2.5"/><circle cx="9" cy="46" r="2.5"/></g><path class="code-core" d="m27 26-6 6 6 6m10-12 6 6-6 6m-3-15-4 18"/></svg><span class="focus-label"></span></span>';
  document.body.append(cursor);
  const name=document.querySelector('#home-title');
  let frame=0, point=null, position=null, lastTime=0;
  function hideCursor(){cancelAnimationFrame(frame);frame=0;point=null;position=null;lastTime=0;cursor.classList.remove('visible','has-label','over-action');name.classList.remove('name-lit');}
  function draw(time){
    frame=0;if(!point)return;
    if(!position)position={...point};
    const blend=1-Math.exp(-Math.min(lastTime?time-lastTime:16,50)/38);lastTime=time;
    position.x+=(point.x-position.x)*blend;position.y+=(point.y-position.y)*blend;
    cursor.style.transform=`translate3d(${position.x}px,${position.y}px,0)`;cursor.classList.add('visible');
    if(Math.abs(point.x-position.x)+Math.abs(point.y-position.y)>.2)frame=requestAnimationFrame(draw);
  }
  document.addEventListener('pointermove',event=>{
    if(reduced.matches||!fine.matches||event.pointerType==='touch'||document.querySelector('dialog[open]')){hideCursor();return;}
    point={x:event.clientX,y:event.clientY};
    const project=event.target.closest('[data-project]');
    const photo=event.target.closest('[data-photo]');
    const tool=event.target.closest('[data-skill]');
    const action=event.target.closest('a,button');
    const label=project?'EXPLORE ↗':photo?'VIEW ↗':tool?'DISCOVER ↗':'';
    cursor.querySelector('.focus-label').textContent=label;cursor.classList.toggle('has-label',!!label);cursor.classList.toggle('over-action',!!action);
    const overName=event.target.closest('#home-title');
    name.classList.toggle('name-lit',!!overName);
    if(overName){const rect=name.getBoundingClientRect();name.style.setProperty('--name-light',`${event.clientX-rect.left}px`);}
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
