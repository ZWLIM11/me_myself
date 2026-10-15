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
  const skills = () => `<div class="tool-grid">${data.skills.map((skill,i)=>`<button class="tool-card" data-skill="${i}"><span aria-hidden="true">${e(skill.icon)}</span>${e(skill.name)}<span class="tool-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`;
  document.querySelector('.skills-strip').outerHTML = `<section class="about-toolkit"><p class="eyebrow">SKILLS & TOOLS</p><h2>Explore my toolkit.</h2>${skills()}</section>`;
  const categories=['All',...new Set(data.photography.map(p=>p.category))];
  document.querySelector('#photo-filters').innerHTML=categories.map((category,i)=>`<button class="filter ${i?'':'active'}" data-photo-filter="${e(category)}" aria-pressed="${!i}">${e(category)}</button>`).join('');
  let galleryPhotos=[], selectedPhoto=null;
  const gallery=document.querySelector('#photo-gallery');
  function selectPhoto(id, origin) {
    const photo=galleryPhotos.find(p=>p.id===id);if(!photo)return;
    selectedPhoto=id;
    const stage=gallery.querySelector('.gallery-feature');
    stage.innerHTML=photoCard(photo);
    const index=galleryPhotos.indexOf(photo);
    gallery.querySelector('.gallery-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(galleryPhotos.length).padStart(2,'0')}`;
    gallery.querySelector('.gallery-prev').disabled=index===0;
    gallery.querySelector('.gallery-next').disabled=index===galleryPhotos.length-1;
    gallery.querySelectorAll('[data-photo-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.photoSelect===id)));
    if(origin&&!window.portfolioMotion.matches){
      const frame=stage.querySelector('.photo-frame'), target=frame.getBoundingClientRect();
      const visual=frame.querySelector('img,.photo-outline'),thumb=origin instanceof Element?origin.querySelector('.thumb-visual'):null;
      if(url(photo.src)&&thumb&&target.width){
        const from=thumb.getBoundingClientRect();
        frame.animate([{transform:`translate(${from.left-target.left}px,${from.top-target.top}px) scale(${from.width/target.width},${from.height/target.height})`,opacity:.65},{transform:'none',opacity:1}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
      }else if(visual && target.width){
        visual.animate([{opacity:.25,transform:'scale(.96)'},{opacity:1,transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
    }
  }
  const renderPhotos=category=>{
    galleryPhotos=data.photography.filter(p=>category==='All'||p.category===category);
    gallery.innerHTML=`<div class="gallery-feature" aria-live="polite"></div><div class="gallery-selection"><div class="gallery-toolbar"><span class="eyebrow">CONTACT SHEET</span><div><button class="gallery-prev" aria-label="Previous featured photograph">←</button><span class="gallery-count"></span><button class="gallery-next" aria-label="Next featured photograph">→</button></div></div><div class="gallery-rail">${galleryPhotos.map(photo=>`<button class="gallery-thumb" data-photo-select="${e(photo.id)}" aria-label="Feature ${e(photo.title)}" aria-pressed="false"><span class="thumb-visual photo-${e(photo.category.toLowerCase())}">${url(photo.src)?`<img src="${e(url(photo.src))}" alt="" loading="lazy">`:'<span aria-hidden="true">⌑</span>'}</span><span>${e(photo.category)}<small>${url(photo.src)?e(photo.title):'Coming soon'}</small></span></button>`).join('')}</div><p class="gallery-hint">Choose a frame to bring it into focus.</p></div>`;
    if(galleryPhotos.length)selectPhoto(galleryPhotos.some(p=>p.id===selectedPhoto)?selectedPhoto:galleryPhotos[0].id);
    else gallery.querySelector('.gallery-feature').innerHTML='<p>No photographs in this collection yet.</p>';
  };
  renderPhotos('All');
  gallery.addEventListener('click',event=>{
    const thumb=event.target.closest('[data-photo-select]');
    if(thumb){
      selectPhoto(thumb.dataset.photoSelect,thumb);
      if(event.detail>0&&matchMedia('(max-width:700px)').matches)gallery.querySelector('.gallery-feature').scrollIntoView({block:'start',behavior:window.portfolioMotion.matches?'instant':'smooth'});
      return;
    }
    const direction=event.target.closest('.gallery-prev')?-1:event.target.closest('.gallery-next')?1:0;
    if(direction){const next=galleryPhotos[galleryPhotos.findIndex(p=>p.id===selectedPhoto)+direction];if(next)selectPhoto(next.id,true);}
  });
  gallery.addEventListener('keydown',event=>{
    const thumb=event.target.closest('[data-photo-select]');if(!thumb||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();const buttons=[...gallery.querySelectorAll('[data-photo-select]')];const index=buttons.indexOf(thumb);
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:Math.max(0,Math.min(buttons.length-1,index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)));
    buttons[next].focus();selectPhoto(buttons[next].dataset.photoSelect,buttons[next]);
  });
  document.querySelector('#photo-filters').addEventListener('click',event=>{const button=event.target.closest('[data-photo-filter]');if(!button)return;document.querySelectorAll('[data-photo-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderPhotos(button.dataset.photoFilter);});
  const dialog=document.querySelector('#info-dialog');
  document.addEventListener('click',event=>{
    const tool=event.target.closest('[data-skill]');
    if(tool){const skill=data.skills[Number(tool.dataset.skill)];const projects=data.projects.filter(p=>skill.projects.includes(p.id));document.querySelector('#info-content').innerHTML=`<p class="eyebrow">SKILLS & TOOLS</p><h2 id="info-title">${e(skill.name)}</h2><p>${e(skill.description)}</p>${projects.length?`<div class="skill-projects">${projects.map(p=>`<button data-open-related="${e(p.id)}">${e(p.title)} <span>↗</span></button>`).join('')}</div>`:placeholder('More work to share','A dedicated example will be added here.','compact')}`;dialog.showModal();}
    const related=event.target.closest('[data-open-related]');
    if(related){dialog.close();window.openPortfolioProject(related.dataset.openRelated);}
    const photo=event.target.closest('[data-photo]');
    if(photo){const p=data.photography.find(p=>p.id===photo.dataset.photo);if(window.openPortfolioPhoto){window.openPortfolioPhoto(p,photo);return;}document.querySelector('#info-content').innerHTML=`<p class="eyebrow">${e(p.category)}</p><h2 id="info-title">${e(p.title)}</h2><img class="lightbox-photo" src="${e(url(p.src))}" alt="${e(p.alt||p.title)}"><p>${e(p.caption||p.location)}</p>`;dialog.showModal();}
  });
  window.renderProjectExtras = project => {
    const study=data.caseStudies[project.id]||{};
    const video=url(study.videoUrl),demo=url(study.demoUrl);
    return `<section class="case-study"><p class="eyebrow">A CLOSER LOOK</p><h3>See the project in action.</h3>${video?`<video controls playsinline preload="metadata" ${url(study.videoPoster)?`poster="${e(url(study.videoPoster))}"`:''}><source src="${e(video)}">Your browser cannot play this video. <a href="${e(video)}">Open video</a></video>`:placeholder('Project walkthrough','A video walkthrough will be added here.','video')}<div class="demo-slot">${demo?`<a class="button primary" href="${e(demo)}" target="_blank" rel="noopener noreferrer">Try the live demo ↗</a>`:placeholder('Interactive demo','A hands-on experience is coming soon.','compact')}</div><div class="case-grid">${[['problem','The problem'],['role','My contribution'],['approach','The approach'],['results','Results & evidence'],['lessons','What I learned']].map(([key,title])=>`<article><h4>${title}</h4><p>${e(study[key]||'Details coming soon.')}</p></article>`).join('')}</div><h3>Screenshots & supporting material</h3><div class="case-screens">${study.screenshots?.some(s=>url(s.src))?study.screenshots.filter(s=>url(s.src)).map(s=>`<figure><img src="${e(url(s.src))}" alt="${e(s.alt)}" loading="lazy"><figcaption>${e(s.caption)}</figcaption></figure>`).join(''):placeholder('Behind the build','Screenshots, diagrams, and results will live here.','compact')}</div></section>`;
  };
  document.querySelector('#project-dialog').addEventListener('close',()=>document.querySelectorAll('#project-dialog video').forEach(video=>video.pause()));
  const instagram=document.createElement(url(data.instagram)?'a':'button');
  instagram.innerHTML='<span>◎</span>Instagram <span>↗</span>';
  if(url(data.instagram)){instagram.href=url(data.instagram);instagram.target='_blank';instagram.rel='noopener noreferrer';}
  else instagram.addEventListener('click',()=>{document.querySelector('#info-content').innerHTML='<p class="eyebrow">OUTSIDE THE SCREEN</p><h2 id="info-title">Instagram coming soon.</h2><p>A link to my photography and everyday moments will be added here.</p>';dialog.showModal();});
  document.querySelector('.contact-links').append(instagram);
  document.querySelector('#contact .eyebrow').textContent='04 / THE NEXT CHAPTER';
})();
