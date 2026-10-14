(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const e = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = value => {if(!value)return '';try{const u=new URL(value,location.href);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
  const placeholder = (title,detail,kind='media') => `<div class="content-space ${kind}"><span class="space-icon" aria-hidden="true">${kind==='video'?'▷':'＋'}</span><strong>${e(title)}</strong><span>${e(detail)}</span><small>COMING SOON</small></div>`;
  function photoCard(photo) {
    const src=url(photo.src);
    return `<${src?'button':'article'} class="photo-card" ${src?`data-photo="${e(photo.id)}" aria-label="Open ${e(photo.title)}"`:''}><div class="photo-frame photo-${e(photo.category.toLowerCase())}">${src?`<img src="${e(src)}" alt="${e(photo.alt||photo.title)}" loading="lazy">`:`<span class="photo-outline" aria-hidden="true">⌑</span><span class="photo-reserved">${e(photo.category.toUpperCase())}<small>PHOTOGRAPH COMING SOON</small></span>`}</div><div class="photo-caption"><strong>${e(photo.title)}</strong><span>${e(photo.location || photo.category)}</span></div></${src?'button':'article'}>`;
  }
  const projectCard = p => `<button class="project-card" data-project="${e(p.id)}" aria-label="View ${e(p.title)}"><div class="project-image"><img src="${e(p.image)}" alt="${e(p.alt)}" loading="lazy"></div><span class="project-category">${e(p.label)}</span><h2>${e(p.title)}</h2><p>${e(p.subtitle)}</p><span class="card-arrow" aria-hidden="true">↗</span></button>`;
  const skills = () => `<div class="tool-grid">${data.skills.map((skill,i)=>`<button class="tool-card" data-skill="${i}"><span aria-hidden="true">${e(skill.icon)}</span>${e(skill.name)}<span class="tool-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`;
  document.querySelector('#home-sections').innerHTML = `
    <section class="home-block featured-block" aria-labelledby="featured-title"><div class="block-heading"><div><p class="eyebrow">FEATURED PROJECTS</p><h2 id="featured-title">Turning ideas into <em>real projects.</em></h2><p class="body-copy">Questions, experiments, and practical explorations.</p></div><a class="text-link" href="#projects">View all projects ↗</a></div><div class="project-grid">${data.projects.map(projectCard).join('')}</div></section>
    <section class="home-block photo-preview" aria-labelledby="photo-preview-title"><div><p class="eyebrow">MY PHOTOGRAPHY</p><h2 id="photo-preview-title">Moments<br>outside the screen.</h2><p class="body-copy">Places, details, and daily life.<br>A collection taking shape.</p><a class="button outline-button" href="#photography">Explore the gallery ↗</a></div><div class="photo-carousel"><div class="carousel-controls"><button aria-label="Previous photographs" id="photos-prev">←</button><button aria-label="Next photographs" id="photos-next">→</button></div><div class="photo-track" id="photo-track" tabindex="0" role="region" aria-label="Photography collection; scroll to explore">${data.photography.map(photoCard).join('')}</div></div></section>
    <section class="home-block personal-block"><div class="mini-about"><p class="eyebrow">ABOUT ME</p><h2>A data science student<br>with many interests.</h2><p class="body-copy">I’m Lim Ziwei, a Data Science student at TAR UMT. Beyond data and code, I enjoy photography, sports, and experiencing new places.</p><a class="text-link" href="#about">More about me ↗</a><div class="honest-stats"><span><strong>${data.projects.length}</strong>Project explorations</span><span><strong>${data.photography.filter(p=>url(p.src)).length || 'Soon'}</strong>Photography collection</span></div></div><div class="toolkit"><p class="eyebrow">SKILLS & TOOLS</p><h2>Tools I work with.</h2><p class="body-copy">Select a tool to explore the related work.</p>${skills()}</div></section>
    <section class="home-block home-connect"><div><p class="eyebrow">THE NEXT CHAPTER</p><h2>Good ideas start<br>with a conversation.</h2></div><a href="#contact" class="button primary">Let’s connect <span>↗</span></a></section>`;
  document.querySelector('.skills-strip').outerHTML = `<section class="about-toolkit"><p class="eyebrow">SKILLS & TOOLS</p><h2>Explore my toolkit.</h2>${skills()}</section>`;
  // Keep the hero navigation familiar while inviting visitors to scroll into the new sections.
  const scrollLink=document.querySelector('.scroll-link');
  scrollLink.href='#featured';
  scrollLink.addEventListener('click',event=>{event.preventDefault();document.querySelector('.featured-block').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  const categories=['All',...new Set(data.photography.map(p=>p.category))];
  document.querySelector('#photo-filters').innerHTML=categories.map((category,i)=>`<button class="filter ${i?'':'active'}" data-photo-filter="${e(category)}" aria-pressed="${!i}">${e(category)}</button>`).join('');
  const renderPhotos=category=>{document.querySelector('#photo-gallery').innerHTML=data.photography.filter(p=>category==='All'||p.category===category).map(photoCard).join('');};
  renderPhotos('All');
  document.querySelector('#photo-filters').addEventListener('click',event=>{const button=event.target.closest('[data-photo-filter]');if(!button)return;document.querySelectorAll('[data-photo-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderPhotos(button.dataset.photoFilter);});
  const track=document.querySelector('#photo-track');
  const prev=document.querySelector('#photos-prev');
  const next=document.querySelector('#photos-next');
  const syncArrows=()=>{prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;};
  for(const [button,direction] of [[prev,-1],[next,1]])button.addEventListener('click',()=>track.scrollBy({left:direction*track.clientWidth*.75,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  track.addEventListener('scroll',syncArrows,{passive:true});
  new ResizeObserver(syncArrows).observe(track); syncArrows();
  const dialog=document.querySelector('#info-dialog');
  document.addEventListener('click',event=>{
    const tool=event.target.closest('[data-skill]');
    if(tool){const skill=data.skills[Number(tool.dataset.skill)];const projects=data.projects.filter(p=>skill.projects.includes(p.id));document.querySelector('#info-content').innerHTML=`<p class="eyebrow">SKILLS & TOOLS</p><h2 id="info-title">${e(skill.name)}</h2><p>${e(skill.description)}</p>${projects.length?`<div class="skill-projects">${projects.map(p=>`<button data-open-related="${e(p.id)}">${e(p.title)} <span>↗</span></button>`).join('')}</div>`:placeholder('More work to share','A dedicated example will be added here.','compact')}`;dialog.showModal();}
    const related=event.target.closest('[data-open-related]');
    if(related){dialog.close();document.querySelector(`#home-sections [data-project="${related.dataset.openRelated}"]`).click();}
    const photo=event.target.closest('[data-photo]');
    if(photo){const p=data.photography.find(p=>p.id===photo.dataset.photo);if(window.openPortfolioPhoto){window.openPortfolioPhoto(p,photo);return;}document.querySelector('#info-content').innerHTML=`<p class="eyebrow">${e(p.category)}</p><h2 id="info-title">${e(p.title)}</h2><img class="lightbox-photo" src="${e(url(p.src))}" alt="${e(p.alt||p.title)}"><p>${e(p.caption||p.location)}</p>`;dialog.showModal();}
  });
  window.renderProjectExtras = project => {
    const study=data.caseStudies[project.id]||{};
    const video=url(study.videoUrl),demo=url(study.demoUrl);
    return `<section class="case-study"><p class="eyebrow">A CLOSER LOOK</p><h3>See the project in action.</h3>${video?`<video controls playsinline preload="metadata" ${url(study.videoPoster)?`poster="${e(url(study.videoPoster))}"`:''}><source src="${e(video)}">Your browser cannot play this video. <a href="${e(video)}">Open video</a></video>`:placeholder('Project walkthrough','A video walkthrough will be added here.','video')}<div class="demo-slot">${demo?`<a class="button primary" href="${e(demo)}" target="_blank" rel="noopener noreferrer">Try the live demo ↗</a>`:placeholder('Interactive demo','A hands-on experience is coming soon.','compact')}</div><div class="case-grid">${[['role','My contribution'],['approach','The approach'],['results','Results & evidence'],['lessons','What I learned']].map(([key,title])=>`<article><h4>${title}</h4><p>${e(study[key]||'Details coming soon.')}</p></article>`).join('')}</div><h3>Screenshots & supporting material</h3><div class="case-screens">${study.screenshots?.some(s=>url(s.src))?study.screenshots.filter(s=>url(s.src)).map(s=>`<figure><img src="${e(url(s.src))}" alt="${e(s.alt)}" loading="lazy"><figcaption>${e(s.caption)}</figcaption></figure>`).join(''):placeholder('Behind the build','Screenshots, diagrams, and results will live here.','compact')}</div></section>`;
  };
  document.querySelector('#project-dialog').addEventListener('close',()=>document.querySelectorAll('#project-dialog video').forEach(video=>video.pause()));
  const contactContent=document.querySelector('.contact-content');
  const contactSpace=document.createElement('div');contactSpace.className='contact-reserved';contactSpace.innerHTML='<span aria-hidden="true">✉</span><div><strong>A direct line, coming soon.</strong><p>A contact form will be added here once message delivery is connected.</p></div>';contactContent.append(contactSpace);
  const instagram=document.createElement(url(data.instagram)?'a':'button');
  instagram.innerHTML='<span>◎</span>Instagram <span>↗</span>';
  if(url(data.instagram)){instagram.href=url(data.instagram);instagram.target='_blank';instagram.rel='noopener noreferrer';}
  else instagram.addEventListener('click',()=>{document.querySelector('#info-content').innerHTML='<p class="eyebrow">OUTSIDE THE SCREEN</p><h2 id="info-title">Instagram coming soon.</h2><p>A link to my photography and everyday moments will be added here.</p>';dialog.showModal();});
  document.querySelector('.contact-links').append(instagram);
  document.querySelector('#contact .eyebrow').textContent='04 / THE NEXT CHAPTER';
})();
