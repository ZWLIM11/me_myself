(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const data=window.PORTFOLIO;
  const safeURL=value=>{if(!value)return '';try{const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}};

  // Preserve semantic headings and natural wrapping within each authored line.
  document.querySelectorAll('h1,.home-block h2:not(.project-card h2),.about-toolkit h2').forEach(heading=>{
    const nodes=[...heading.childNodes];let line=document.createElement('span');line.className='heading-line';
    heading.replaceChildren(line);
    nodes.forEach(node=>{if(node.nodeName==='BR'){line=document.createElement('span');line.className='heading-line';heading.append(line);}else line.append(node);});
  });

  const nav=document.querySelector('.header nav');
  const indicator=document.createElement('span');indicator.className='nav-indicator';indicator.ariaHidden='true';nav.append(indicator);
  function moveIndicator(link=nav.querySelector('a.active')){
    if(!link)return;
    indicator.style.width=`${link.offsetWidth}px`;
    indicator.style.transform=`translateX(${link.offsetLeft}px)`;
    indicator.style.opacity='1';
  }
  nav.addEventListener('pointerover',event=>{const link=event.target.closest('a');if(link)moveIndicator(link);});
  nav.addEventListener('pointerleave',()=>moveIndicator());
  nav.addEventListener('focusin',event=>{if(event.target.matches('a'))moveIndicator(event.target);});
  nav.addEventListener('focusout',()=>moveIndicator());
  new ResizeObserver(()=>moveIndicator()).observe(nav);
  document.fonts.ready.then(()=>moveIndicator());

  const progress=document.createElement('div');progress.className='reading-progress';progress.ariaHidden='true';document.body.append(progress);
  const hero=document.querySelector('.home-hero');
  const seal=document.createElement('div');seal.className='hero-seal';seal.ariaHidden='true';
  seal.innerHTML='<svg viewBox="0 0 120 120"><defs><path id="seal-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs><text><textPath href="#seal-circle" textLength="282">DATA · CODE · PHOTOGRAPHY · </textPath></text></svg><span>&lt;/&gt;</span>';
  hero.append(seal);
  let heroVisible=true,frame=0;
  new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;seal.classList.toggle('is-visible',heroVisible&&!document.hidden);schedule();}).observe(hero);
  function paint(){
    frame=0;const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
    hero.style.setProperty('--hero-scroll',`${heroVisible&&!reduced.matches?Math.min(scrollY*.055,22):0}px`);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  new ResizeObserver(schedule).observe(document.querySelector('main'));
  document.addEventListener('portfolio:pagechange',()=>{moveIndicator();schedule();pausePreviews();});
  document.addEventListener('visibilitychange',()=>{seal.classList.toggle('is-visible',heroVisible&&!document.hidden);if(document.hidden)pausePreviews();});
  schedule();moveIndicator();

  const track=document.querySelector('#photo-track');
  const counter=document.createElement('span');counter.className='film-counter';document.querySelector('.carousel-controls').prepend(counter);
  function countFrames(){const cards=[...track.children];const x=track.getBoundingClientRect().left;let nearest=0;cards.forEach((card,i)=>{if(Math.abs(card.getBoundingClientRect().left-x)<Math.abs(cards[nearest].getBoundingClientRect().left-x))nearest=i;});counter.textContent=`FRAME ${String(nearest+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;}
  track.addEventListener('scroll',countFrames,{passive:true});new ResizeObserver(countFrames).observe(track);countFrames();
  track.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();track.scrollBy({left:(event.key==='ArrowRight'?1:-1)*(track.firstElementChild.getBoundingClientRect().width+24),behavior:reduced.matches?'instant':'smooth'});});

  // No preview requests until a visitor hovers or explicitly presses Play.
  const previews=new Set();
  function pausePreview(state){state.wanted=false;state.video.pause();state.video.classList.remove('is-playing');state.button.textContent='▷ Play preview';state.button.setAttribute('aria-pressed','false');}
  function pausePreviews(){previews.forEach(pausePreview);}
  async function playPreview(state){
    previews.forEach(other=>{if(other!==state)pausePreview(other);});
    state.wanted=true;state.button.textContent='Loading…';
    if(!state.video.src)state.video.src=state.src;
    try{await state.video.play();if(!state.wanted){state.video.pause();return;}state.video.classList.add('is-playing');state.button.textContent='Ⅱ Pause preview';state.button.setAttribute('aria-pressed','true');}
    catch{if(state.wanted){state.wanted=false;state.button.textContent='▷ Retry preview';state.button.setAttribute('aria-pressed','false');}}
  }
  const previewObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting){const state=[...previews].find(s=>s.shell===entry.target);if(state)pausePreview(state);}}));
  function preparePreviews(){
    previews.forEach(state=>{if(!state.shell.isConnected){pausePreview(state);previewObserver.unobserve(state.shell);previews.delete(state);}});
    document.querySelectorAll('.project-card[data-project]').forEach(card=>{
      if(card.closest('.preview-shell'))return;
      const src=safeURL(data.caseStudies[card.dataset.project]?.previewVideoUrl);if(!src)return;
      const shell=document.createElement('div');shell.className='preview-shell';card.before(shell);shell.append(card);
      const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';video.tabIndex=-1;video.ariaHidden='true';card.querySelector('.project-image').append(video);
      const button=document.createElement('button');button.className='preview-toggle';button.type='button';button.textContent='▷ Play preview';button.setAttribute('aria-label',`Toggle preview for ${data.projects.find(p=>p.id===card.dataset.project).title}`);button.setAttribute('aria-pressed','false');shell.append(button);
      const state={shell,video,button,src,wanted:false};previews.add(state);previewObserver.observe(shell);
      shell.addEventListener('pointerenter',()=>{if(fine.matches&&!reduced.matches&&!navigator.connection?.saveData)playPreview(state);});
      shell.addEventListener('pointerleave',()=>{if(fine.matches)pausePreview(state);});
      button.addEventListener('click',()=>state.wanted?pausePreview(state):playPreview(state));
    });
  }
  preparePreviews();new MutationObserver(preparePreviews).observe(document.querySelector('#project-grid'),{childList:true});
  document.addEventListener('click',event=>{if(event.target.closest('[data-project]'))pausePreviews();});
  addEventListener('blur',pausePreviews);reduced.addEventListener('change',()=>{pausePreviews();schedule();});

  const lightbox=document.createElement('dialog');lightbox.id='photo-lightbox';lightbox.setAttribute('aria-labelledby','lightbox-title');
  lightbox.innerHTML='<button class="close-dialog" aria-label="Close photograph">×</button><div class="lightbox-stage"><img alt=""></div><div class="lightbox-footer"><div><h2 id="lightbox-title"></h2><p class="lightbox-caption"></p></div><div class="lightbox-controls"><button class="lightbox-prev" aria-label="Previous photograph">←</button><span class="lightbox-count" aria-live="polite"></span><button class="lightbox-next" aria-label="Next photograph">→</button></div></div>';
  document.body.append(lightbox);
  const image=lightbox.querySelector('img');let photos=[],index=0,revision=0;
  async function showPhoto(origin){
    const version=++revision,p=photos[index];
    image.getAnimations().forEach(animation=>animation.cancel());
    image.src=safeURL(p.src);image.alt=p.alt||p.title;
    lightbox.querySelector('h2').textContent=p.title;lightbox.querySelector('.lightbox-caption').textContent=p.caption||p.location||p.category;
    lightbox.querySelector('.lightbox-count').textContent=`${index+1} / ${photos.length}`;
    lightbox.querySelector('.lightbox-prev').disabled=index===0;lightbox.querySelector('.lightbox-next').disabled=index===photos.length-1;
    try{await image.decode();}catch{return;}
    if(version!==revision||!lightbox.open||reduced.matches)return;
    const rect=image.getBoundingClientRect();
    const from=origin?{opacity:.35,transform:`translate(${origin.left-rect.left}px,${origin.top-rect.top}px) scale(${origin.width/rect.width},${origin.height/rect.height})`}:{opacity:.3,transform:'translateY(8px)'};
    image.animate([from,{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.2,.65,.3,1)'});
  }
  window.openPortfolioPhoto=(photo,source)=>{
    const ids=[...source.parentElement.querySelectorAll('[data-photo]')].map(el=>el.dataset.photo);
    photos=data.photography.filter(p=>safeURL(p.src)&&ids.includes(p.id));index=photos.findIndex(p=>p.id===photo.id);if(index<0)return;
    const origin=source.querySelector('img').getBoundingClientRect();image.style.transformOrigin='top left';
    lightbox.showModal();showPhoto(origin);
  };
  function step(direction){const next=index+direction;if(next<0||next>=photos.length)return;index=next;showPhoto();}
  lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));lightbox.querySelector('.lightbox-next').addEventListener('click',()=>step(1));
  lightbox.querySelector('.close-dialog').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowLeft'?-1:1);}});
  lightbox.addEventListener('click',event=>{if(event.target!==lightbox)return;const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();});
  lightbox.addEventListener('close',()=>{revision++;image.getAnimations().forEach(animation=>animation.cancel());});
})();
