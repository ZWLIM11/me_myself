(() => {
  'use strict';
  const data=window.PORTFOLIO;
  const e=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe=value=>{if(!value)return '';try{const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}};
  const about=document.querySelector('#about .next-page');
  const timeline=(data.timeline||[]).filter(item=>item.title&&item.organization);
  if(timeline.length)about.insertAdjacentHTML('beforebegin',`<section class="journey-section"><div><p class="eyebrow">THE JOURNEY</p><h2>Learning.<br><em>Building. Becoming.</em></h2></div><ol class="journey-list">${timeline.map(item=>`<li><span class="eyebrow">${e(item.kind)} · ${e(item.period)}</span><h3>${e(item.title)}</h3><p>${e(item.organization)}</p>${item.description?`<p class="journey-description">${e(item.description)}</p>`:''}</li>`).join('')}</ol></section>`);
  const credentials=(data.credentials||[]).filter(item=>item.title&&item.issuer);
  if(credentials.length)about.insertAdjacentHTML('beforebegin',`<section class="credentials-section"><p class="eyebrow">MILESTONES</p><h2>Certificates & achievements.</h2><div class="credential-grid">${credentials.map(item=>`<article>${safe(item.image)?`<img src="${e(safe(item.image))}" alt="${e(item.title)}" loading="lazy">`:''}<small>${e(item.issuer)}${item.date?' · '+e(item.date):''}</small><h3>${e(item.title)}</h3>${safe(item.url)?`<a class="text-link" href="${e(safe(item.url))}" target="_blank" rel="noopener noreferrer">View credential ↗</a>`:''}</article>`).join('')}</div></section>`);

  const albums=(data.photoCollections||[]).map(album=>({...album,photos:data.photography.filter(photo=>safe(photo.src)&&(photo.album?photo.album===album.id:(album.categories||[]).includes(photo.category)))})).filter(album=>album.photos.length);
  if(albums.length){
    const section=document.createElement('section');section.className='album-section';section.setAttribute('aria-label','Photo collections');
    section.innerHTML=`<div class="album-heading"><p class="eyebrow">COLLECTIONS</p><button class="text-link" data-album="" aria-pressed="true">All photographs ↗</button></div><div class="album-grid">${albums.map(album=>`<button class="album-card" data-album="${e(album.id)}" aria-pressed="false"><img src="${e(safe(album.photos[0].src))}" alt="" loading="lazy"><span><strong>${e(album.title)}</strong><small>${e(album.description)} · ${album.photos.length} ${album.photos.length===1?'photo':'photos'}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`;
    document.querySelector('#photo-filters').before(section);
    section.addEventListener('click',event=>{const button=event.target.closest('[data-album]');if(!button)return;section.querySelectorAll('[data-album]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.dispatchEvent(new CustomEvent('portfolio:albumchange',{detail:button.dataset.album}));});
    document.querySelector('#photography>.body-copy').textContent='A collection of places, small details, and everyday moments that catch my eye. Choose a collection or explore every frame.';
  }

  const playground=document.createElement('section');playground.className='playground';playground.setAttribute('aria-labelledby','playground-title');
  playground.innerHTML='<div class="playground-heading"><p class="eyebrow">THE PLAYGROUND / 01</p><h2 id="playground-title">Find the <em>pattern.</em></h2><p>How would you group these points? Choose a number of groups, then move the centres one step at a time.</p><small>An interactive K-means experiment using synthetic data.</small></div><div class="cluster-lab"><div class="cluster-controls"><label for="cluster-count">Groups <output id="cluster-value" for="cluster-count">3</output></label><input id="cluster-count" type="range" min="2" max="5" value="3" step="1"><button class="button primary" id="cluster-step">Group points ↗</button><button class="text-link" id="cluster-reset">Reset</button><button class="text-link" id="cluster-new">New sample ↻</button></div><svg id="cluster-plot" viewBox="0 0 600 360" role="img" aria-labelledby="cluster-plot-title cluster-plot-desc"><title id="cluster-plot-title">Interactive clustering of 60 sample points</title><desc id="cluster-plot-desc">Dots are sample data. Numbered crosses mark group centres. The summary below reports the points in each group.</desc><g class="plot-grid" aria-hidden="true"><path d="M100 20V340M200 20V340M300 20V340M400 20V340M500 20V340M20 90H580M20 180H580M20 270H580"/></g><g class="plot-points"></g><g class="plot-centres"></g></svg><div class="cluster-summary" aria-live="polite" aria-atomic="true"></div><p class="cluster-explanation">Each step assigns dots to the nearest centre, then moves each centre to the average of its group.</p></div>';
  document.querySelector('#projects .chapter-end').before(playground);
  const palette=['#ceb78c','#83b6a4','#bba6cf','#db9d8b','#87b7d2'];
  let seed=17,points=[],centres=[],step=0;
  function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  function sample(){points=Array.from({length:60},(_,i)=>{const hubs=[[155,110],[435,115],[310,270]],hub=hubs[i%3];return {x:Math.max(28,Math.min(572,hub[0]+(random()+random()-1)*150)),y:Math.max(28,Math.min(332,hub[1]+(random()+random()-1)*100)),group:0};});}
  function assign(){points.forEach(p=>{let distance=Infinity;p.group=0;centres.forEach((c,i)=>{const d=(p.x-c.x)**2+(p.y-c.y)**2;if(d<distance){distance=d;p.group=i;}});});}
  function paint(settled=false){
    const dots=playground.querySelector('.plot-points');
    if(!dots.children.length)dots.innerHTML=points.map(()=>'<circle r="4.5"/>').join('');
    [...dots.children].forEach((dot,i)=>{dot.setAttribute('cx',points[i].x);dot.setAttribute('cy',points[i].y);dot.style.fill=palette[points[i].group];});
    const markers=playground.querySelector('.plot-centres');
    if(markers.children.length!==centres.length)markers.innerHTML=centres.map((_,i)=>`<g class="cluster-centre"><circle r="13"/><path d="M-6 0H6M0-6V6"/><text x="17" y="4">${i+1}</text></g>`).join('');
    [...markers.children].forEach((marker,i)=>{marker.style.transform=`translate(${centres[i].x}px,${centres[i].y}px)`;marker.style.color=palette[i];});
    playground.querySelector('.cluster-summary').innerHTML=`<strong>${settled?'Pattern settled':step?'Step '+step:'Ready to explore'}</strong><span>${centres.map((_,i)=>`Group ${i+1}: ${points.filter(p=>p.group===i).length}`).join(' · ')}</span>`;
    const button=playground.querySelector('#cluster-step');button.disabled=settled;button.textContent=settled?'Pattern settled ✓':step?'Next step ↗':'Group points ↗';
  }
  function reset(){step=0;const count=Number(playground.querySelector('input').value);playground.querySelector('output').value=count;centres=Array.from({length:count},(_,i)=>({x:75+i*450/(count-1),y:60}));assign();paint();}
  playground.querySelector('#cluster-step').addEventListener('click',()=>{let movement=0;centres=centres.map((c,i)=>{const group=points.filter(p=>p.group===i);if(!group.length)return c;const next={x:group.reduce((s,p)=>s+p.x,0)/group.length,y:group.reduce((s,p)=>s+p.y,0)/group.length};movement+=Math.hypot(next.x-c.x,next.y-c.y);return next;});assign();step++;paint(movement<.05);});
  playground.querySelector('input').addEventListener('input',reset);
  playground.querySelector('#cluster-reset').addEventListener('click',reset);
  playground.querySelector('#cluster-new').addEventListener('click',()=>{sample();reset();});
  sample();reset();
})();
