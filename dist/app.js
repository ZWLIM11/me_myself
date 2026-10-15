(() => {
  'use strict';
  const config = window.PORTFOLIO;
  const pages = ['home', 'about', 'projects', 'photography', 'contact'];
  const reduceMotion = (window.portfolioMotion || matchMedia('(prefers-reduced-motion: reduce)'));
  const nav = document.querySelector('.header nav');
  const menu = document.querySelector('.menu-toggle');
  const grid = document.querySelector('#project-grid');
  const projectDialog = document.querySelector('#project-dialog');
  const infoDialog = document.querySelector('#info-dialog');
  const curtain=document.createElement('div');curtain.id='page-curtain';curtain.setAttribute('aria-hidden','true');curtain.innerHTML='<span></span>';document.body.append(curtain);
  let current = 'home';
  let transition;
  let navigating = false;
  let queuedPage = null;
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => { if (!value) return ''; try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };

  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
  async function showPage(id, initial = false) {
    if (!pages.includes(id)) id = 'home';
    closeMenu();
    if (navigating) { queuedPage = id; return; }
    if (current === id && !initial) return;
    const direction = pages.indexOf(id) >= pages.indexOf(current) ? 1 : -1;
    document.documentElement.style.setProperty('--page-direction', direction);
    const update = () => {
      for (const page of document.querySelectorAll('.page')) { page.hidden = page.id !== id; page.classList.toggle('active', page.id === id); }
      document.querySelectorAll('.header nav a').forEach(link => { const active = link.hash === '#' + id; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
      document.querySelector('#page-number').textContent = String(pages.indexOf(id) + 1).padStart(2, '0');
      document.title = `${id === 'home' ? 'Data & Possibility' : id[0].toUpperCase() + id.slice(1)} — Lim Ziwei`;
      current = id;
      if (!initial) document.getElementById(id).classList.add('has-entered');
      window.scrollTo({top: 0, behavior: 'instant'});
      if (!initial) document.querySelector('#main').focus({preventScroll:true});
      document.dispatchEvent(new CustomEvent('portfolio:pagechange'));
    };
    if (initial || reduceMotion.matches) { update(); return; }
    navigating = true;
    document.documentElement.classList.add('is-routing');
    const main = document.querySelector('#main');
    main.setAttribute('aria-busy', 'true');
    const routeAnimations=[];
    try {
      const curtain=document.querySelector('#page-curtain');
      curtain.querySelector('span').textContent=String(pages.indexOf(id)+1).padStart(2,'0')+' / '+id.toUpperCase();
      const cover=curtain.animate([{transform:`translateY(${direction*100}%)`},{transform:'translateY(0)'}],{duration:230,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'});
      routeAnimations.push(cover);
      await cover.finished.catch(()=>{});
      update();
      const reveal=curtain.animate([{transform:'translateY(0)'},{transform:`translateY(${-direction*100}%)`}],{duration:310,easing:'cubic-bezier(.25,.7,.25,1)',fill:'forwards'});
      routeAnimations.push(reveal);
      if(!reduceMotion.matches){
        const arrival=main.animate([{opacity:.85,transform:`translateY(${direction*12}px)`},{opacity:1,transform:'translateY(0)'}],{duration:310,easing:'cubic-bezier(.2,.7,.2,1)'});
        routeAnimations.push(arrival);
      }
      cover.cancel();
      if(reduceMotion.matches)reveal.finish();
      await reveal.finished.catch(()=>{});reveal.cancel();
    } catch { if (current !== id) update(); }
    finally {
      routeAnimations.forEach(animation=>animation.cancel());
      transition = null;
      navigating = false;
      document.documentElement.classList.remove('is-routing');
      main.removeAttribute('aria-busy');
      document.dispatchEvent(new CustomEvent('portfolio:transitionend'));
      const next = queuedPage; queuedPage = null;
      if (next && next !== current) showPage(next);
    }
  }
  reduceMotion.addEventListener('change', () => {
    if (!reduceMotion.matches) return;
    transition?.skipTransition();
    document.querySelector('#main').getAnimations().forEach(animation=>animation.cancel());
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.hash.slice(1);
    if (!pages.includes(id)) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    showPage(id);
  });
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });

  function renderProjects(filter = 'all') {
    grid.innerHTML = config.projects.filter(p => filter === 'all' || p.category === filter).map((p, index) => `<button class="project-card" data-project="${escape(p.id)}" style="animation-delay:${index * 85}ms" aria-label="View ${escape(p.title)}"><div class="project-image"><span class="project-number">0${config.projects.indexOf(p) + 1} /</span><img src="${escape(p.image)}" alt="${escape(p.alt)}" loading="lazy"></div><span class="project-category">${escape(p.label)}</span><h2>${escape(p.title)}</h2><p>${escape(p.subtitle)}</p><span class="card-arrow" aria-hidden="true">↗</span></button>`).join('');
  }
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    renderProjects(button.dataset.filter);
  }));
  function openProject(id, source) {
    const p = config.projects.find(p => p.id === id); if (!p) return;
    source ||= [...document.querySelectorAll('[data-project]')].find(card => card.dataset.project === id && !card.closest('[hidden]'));
    const origin = source ? {image:source.querySelector('img').getBoundingClientRect(),title:source.querySelector('h2').getBoundingClientRect(),fontSize:parseFloat(getComputedStyle(source.querySelector('h2')).fontSize)} : null;
    document.querySelector('#project-detail').innerHTML = `<div class="detail-hero"><img src="${escape(p.image)}" alt="${escape(p.alt)}"></div><div class="detail-content"><p class="eyebrow">${escape(p.label)} / PROJECT EXPLORATION</p><h2 id="project-dialog-title">${escape(p.fullTitle)}</h2><div class="tags">${p.tags.map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="detail-columns"><div><h3>Project overview</h3><p>${escape(p.overview)}</p></div><div><h3>Areas of exploration</h3><ul>${p.features.map(f => `<li>${escape(f)}</li>`).join('')}</ul></div></div>${p.url && safeUrl(p.url) ? `<a class="text-link" href="${escape(safeUrl(p.url))}" target="_blank" rel="noopener noreferrer">View repository ↗</a>` : `<p class="detail-note">${escape(p.note)}</p>`}</div>`;
    if (window.renderProjectExtras) document.querySelector('#project-detail').insertAdjacentHTML('beforeend', window.renderProjectExtras(p));
    const demo=safeUrl(config.caseStudies?.[p.id]?.demoUrl);
    document.querySelector('#project-detail .tags').insertAdjacentHTML('afterend',`<div class="project-page-actions"><a class="text-link" href="/projects/${encodeURIComponent(p.id)}/">Full project page ↗</a>${demo?`<a class="button primary" href="${escape(demo)}" target="_blank" rel="noopener noreferrer">Open live app ↗</a>`:''}</div>`);
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
    document.dispatchEvent(new CustomEvent('portfolio:projectopen', {detail:{source,origin}}));
  }
  window.openPortfolioProject=openProject;
  document.addEventListener('click',event=>{const button=event.target.closest('[data-project]');if(button)openProject(button.dataset.project,button);});
  function showInfo(type) {
    if (type === 'email' && config.email) { window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(config.email), '_blank', 'noopener,noreferrer'); return; }
    if (type === 'jobstreet') { window.open(safeUrl(config.jobstreet) || 'https://my.jobstreet.com/profiles/lim-ziwei-qmt24rpynk', '_blank', 'noopener,noreferrer'); return; }
    if (type === 'resume' && config.resumeUrl && safeUrl(config.resumeUrl)) { window.open(safeUrl(config.resumeUrl), '_blank', 'noopener,noreferrer'); return; }
    const content = type === 'resume' ? `<p class="eyebrow">AT A GLANCE</p><h2 id="info-title">Lim Ziwei</h2><p>Data Science student · Malaysia</p><div class="resume-lines"><p><strong>Education</strong><br>TAR UMT — Bachelor of Data Science (current)</p><p><strong>Interests</strong><br>Data analysis, machine learning, and intelligent systems</p><p><strong>Languages</strong><br>English, Mandarin, Malay</p></div><p>The full résumé will be added soon. In the meantime, explore the projects or find me on GitHub.</p><a href="#projects" class="button primary" data-close>Explore projects ↗</a>` : `<p class="eyebrow">LET’S CONNECT</p><h2 id="info-title">${type === 'email' ? 'Email' : 'JobStreet'} details coming soon.</h2><p>This portfolio is taking shape. For now, you can find my work on GitHub.</p><a class="button primary" href="${escape(safeUrl(config.github))}" target="_blank" rel="noopener noreferrer">Find me on GitHub ↗</a>`;
    document.querySelector('#info-content').innerHTML = content;
    infoDialog.showModal();
  }
  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => showInfo(button.dataset.dialog)));
  document.querySelectorAll('dialog').forEach(dialog => {
    const close = () => dialog === projectDialog && window.closePortfolioProject ? window.closePortfolioProject() : dialog.close();
    dialog.querySelector('.close-dialog').addEventListener('click', close);
    dialog.addEventListener('cancel', event => { if(dialog === projectDialog && window.closePortfolioProject){event.preventDefault();close();} });
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } if (event.target.closest('[data-close]')) close(); });
  });
  document.querySelectorAll('a[href="https://github.com/ZWLIM11"]').forEach(link => { if (safeUrl(config.github)) link.href = safeUrl(config.github); });
  const clock = () => { document.querySelector('#local-time').textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kuala_Lumpur',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()) + ' MYT'; };
  clock(); setInterval(clock, 60000); document.querySelector('#year').textContent = new Date().getFullYear();
  // The composited focus cursor replaces the old repainting glow.
  renderProjects(); showPage(location.hash.slice(1) || 'home', true);
})();
