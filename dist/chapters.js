(() => {
  'use strict';
  const motion=window.portfolioMotion;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pages=['home','about','projects','photography','contact'];
  const names=['Introduction','The person','The projects','Through my lens','Let’s connect'];

  // Persistent chapter shortcuts also work through the keyboard and native hashes.
  const dock=document.createElement('nav');dock.className='chapter-dock';dock.setAttribute('aria-label','Chapter shortcuts');
  dock.innerHTML=`<span class="chapter-caption" aria-hidden="true"></span><div>${pages.map((id,i)=>`<a href="#${id}" aria-label="${names[i]} — chapter ${i+1}">${String(i+1).padStart(2,'0')}</a>`).join('')}</div>`;
  const controls=document.createElement('div');controls.className='chapter-controls';
  controls.append(dock,document.querySelector('#motion-toggle'));document.body.append(controls);
  const progress=document.createElement('div');progress.className='chapter-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';document.querySelector('.header').append(progress);
  function updateChapter(){
    const id=document.querySelector('.page.active').id,index=pages.indexOf(id);
    dock.querySelector('.chapter-caption').textContent=names[index];
    dock.querySelectorAll('a').forEach(link=>{if(link.hash===`#${id}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    progress.firstElementChild.style.transform=`scaleX(${(index+1)/pages.length})`;
  }
  document.addEventListener('portfolio:pagechange',updateChapter);updateChapter();

  // Connections represent shared projects, never scores or invented proficiency.
  const skills=window.PORTFOLIO.skills, toolkit=document.querySelector('.about-toolkit');
  const points=[[23,14],[50,9],[77,14],[86,45],[77,78],[50,88],[23,78],[14,45]];
  toolkit.innerHTML=`<div class="toolkit-heading"><p class="eyebrow">SKILLS & CONNECTIONS</p><h2>Ideas connect.<br><em>So do the tools.</em></h2><p class="body-copy">Explore a tool to see where it fits.</p></div><div class="skill-explorer"><div class="skill-network" role="group" aria-label="Explore skills"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${points.map(([x,y],i)=>`<path data-connection="${i}" d="M50 48 L${x} ${y}"/>`).join('')}<circle cx="50" cy="48" r="17"/><circle cx="50" cy="48" r="12"/></svg><span class="network-core" aria-hidden="true">ZW<span>CONNECT THE DOTS</span></span>${skills.map((skill,i)=>`<button class="skill-node" data-node="${i}" aria-pressed="false" style="--x:${points[i][0]}%;--y:${points[i][1]}%"><span aria-hidden="true">${escape(skill.icon)}</span>${escape(skill.name)}</button>`).join('')}</div><div class="skill-insight"><p class="eyebrow">IN MY TOOLKIT</p><div class="skill-live" aria-live="polite"><h3></h3><p></p></div><button class="text-link" data-skill="0">Explore this tool <span aria-hidden="true">↗</span></button><small>Lines highlight tools used in the same projects.</small></div></div>`;
  let chosen=-1;
  function selectSkill(index){
    if(index===chosen)return;chosen=index;const skill=skills[index];
    toolkit.querySelectorAll('[data-node]').forEach(node=>node.setAttribute('aria-pressed',String(Number(node.dataset.node)===index)));
    toolkit.querySelectorAll('[data-connection]').forEach(path=>{
      const other=Number(path.dataset.connection),active=other===index||skills[other].projects.some(id=>skill.projects.includes(id));
      path.classList.toggle('connected',active);
      path.getAnimations().forEach(a=>a.cancel());
      if(active&&!motion.matches)path.animate([{strokeDashoffset:70},{strokeDashoffset:0}],{duration:420,easing:'ease-out'});
    });
    toolkit.querySelector('.skill-live h3').textContent=skill.name;
    toolkit.querySelector('.skill-live p').textContent=skill.description;
    toolkit.querySelector('[data-skill]').dataset.skill=index;
  }
  toolkit.addEventListener('click',event=>{const node=event.target.closest('[data-node]');if(node)selectSkill(Number(node.dataset.node));});
  toolkit.addEventListener('focusin',event=>{const node=event.target.closest('[data-node]');if(node)selectSkill(Number(node.dataset.node));});
  toolkit.addEventListener('pointerover',event=>{const node=event.target.closest('[data-node]');if(node&&event.pointerType!=='touch')selectSkill(Number(node.dataset.node));});
  selectSkill(0);

  // Animate within the dialog's top layer so the image stays above its backdrop.
  const dialog=document.querySelector('#project-dialog');
  let source=null,active=[],ghost=null,closing=false;
  function clear(){active.forEach(a=>a.cancel());active=[];ghost?.remove();ghost=null;dialog.classList.remove('project-morphing');}
  function animate(element,frames,duration=360){const a=element.animate(frames,{duration,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});active.push(a);return a.finished.catch(()=>{});}
  function makeGhost(image,from,to){
    const visual=document.createElement('img');visual.className='project-flight';visual.src=image.currentSrc||image.src;visual.alt='';visual.setAttribute('aria-hidden','true');
    Object.assign(visual.style,{left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`});
    dialog.append(visual);ghost=visual;
    return [{transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,opacity:1},{transform:'none',opacity:1}];
  }
  document.addEventListener('portfolio:projectopen',async event=>{
    clear();closing=false;source=event.detail.source;
    if(motion.matches||!event.detail.origin||event.detail.origin.image.bottom<0||event.detail.origin.image.top>innerHeight)return;
    const image=dialog.querySelector('.detail-hero img'),target=image.getBoundingClientRect();
    if(!target.width)return;
    const frames=makeGhost(image,event.detail.origin.image,target);dialog.classList.add('project-morphing');
    const title=dialog.querySelector('h2'),rect=title.getBoundingClientRect(),old=event.detail.origin.title;
    const scale=event.detail.origin.fontSize/parseFloat(getComputedStyle(title).fontSize);
    await Promise.all([animate(ghost,frames),animate(title,[{opacity:.35,transform:`translate(${old.left-rect.left}px,${old.top-rect.top}px) scale(${scale})`},{opacity:1,transform:'none'}]),animate(dialog.querySelector('.detail-content'),[{opacity:.4},{opacity:1}])]);
    if(!closing)clear();
  });
  window.closePortfolioProject=async()=>{
    if(closing||!dialog.open)return;closing=true;clear();
    const image=dialog.querySelector('.detail-hero img'),origin=source?.isConnected?source.querySelector('img').getBoundingClientRect():null;
    const current=image?.getBoundingClientRect();
    if(!motion.matches&&origin?.width&&origin.top>=0&&origin.bottom<=innerHeight&&current?.top>=0){
      const frames=makeGhost(image,origin,current);dialog.classList.add('project-morphing');
      await Promise.all([animate(ghost,[frames[1],frames[0]],260),animate(dialog.querySelector('#project-detail'),[{opacity:1},{opacity:0}],220)]);
    }else if(!motion.matches){await animate(dialog,[{opacity:1},{opacity:0,transform:'translateY(8px)'}],160);}
    dialog.close();clear();closing=false;if(source?.isConnected)source.focus({preventScroll:true});
  };
  dialog.addEventListener('close',()=>{clear();closing=false;});
  motion.addEventListener('change',()=>{if(motion.matches)clear();});
})();
