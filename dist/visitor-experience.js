/* Small, opt-in interactions. No accounts, tracking, or generated personal claims. */
(()=>{
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off';
 const grid=document.querySelector('#project-grid');
 const illustrations={
  ripple:'<svg viewBox="0 0 320 150" aria-hidden="true"><rect x="10" y="10" width="300" height="130" rx="8"/><path d="M160 10v130M45 110Q100 30 270 50"/><circle cx="45" cy="110" r="8"/><circle cx="270" cy="50" r="8"/><circle class="demo-defender" cx="155" cy="60" r="10"/><circle class="demo-ball" cx="45" cy="110" r="4"/></svg>',
  'makan-mana':'<svg viewBox="0 0 320 150" aria-hidden="true"><path d="M0 40h320M0 110h320M70 0v150M230 0v150M25 130L100 80 190 100 280 30"/><g class="demo-pins"><circle cx="100" cy="80" r="9"/><circle cx="190" cy="100" r="9"/><circle cx="280" cy="30" r="9"/></g></svg>',
  interview:'<div class="demo-transcript" aria-hidden="true"><span>Speak</span><b>→</b><span>Transcribe</span><b>→</b><span>Review</span></div>'
 };
 function previews(){grid?.querySelectorAll('.project-item:not([data-demo])').forEach(item=>{
  item.dataset.demo='ready';const id=item.querySelector('[data-project]').dataset.project;
  const panel=document.createElement('div');panel.className='mini-demo';panel.id='demo-'+id;panel.hidden=true;
  panel.innerHTML=illustrations[id]+'<small>Illustrated preview · open the project to try the live app.</small>';
  const button=document.createElement('button');button.className='text-link demo-toggle';button.type='button';button.textContent='Preview interaction';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',panel.id);item.append(button,panel);
  let pinned=false;
  const show=on=>{panel.hidden=!on;button.setAttribute('aria-expanded',String(on));button.textContent=on?'Close preview':'Preview interaction';};
  button.onclick=()=>{pinned=!pinned;show(pinned);if(pinned)panel.scrollIntoView({block:'nearest',behavior:reduced()?'instant':'smooth'});};document.addEventListener('portfolio:pagechange',()=>{pinned=false;show(false);});
  item.querySelector('.project-card').addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!reduced())show(true);});
  item.addEventListener('pointerleave',()=>{if(!pinned)show(false);});
  item.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;show(false);button.focus();}});
 });}
 previews();if(grid)new MutationObserver(previews).observe(grid,{childList:true});
 // A selected door responds before the route's existing doorway reveal.
 document.querySelectorAll('.room-doors>a').forEach(door=>{
  const handle=document.createElement('i');handle.className='room-handle';handle.setAttribute('aria-hidden','true');door.append(handle);
  door.addEventListener('click',()=>{if(!reduced())door.classList.add('door-selected');});
 });
 document.addEventListener('portfolio:transitionend',()=>document.querySelectorAll('.door-selected').forEach(d=>d.classList.remove('door-selected')));
 // The journal belongs to the visitor; it never pretends to be Ziwei's review.
 for(const dialog of document.querySelectorAll('#book-dialog,.reading-summary')){
  const journal=document.createElement('form');journal.className='book-journal';
  journal.innerHTML='<h3>Your reading notebook</h3><p>Private to this browser. These are your notes, not Ziwei’s reviews.</p><label>Reading status<select name="status"><option>Want to read</option><option>Reading</option><option>Finished</option></select></label><label>Why I picked this<textarea name="note" maxlength="1200" rows="3" placeholder="What drew you to this book?"></textarea></label><label>A favourite quote<textarea name="quote" maxlength="400" rows="2" placeholder="A short passage you want to remember"></textarea></label><div class="notebook-actions"><button type="submit" class="button primary">Save notebook</button><button type="button" class="text-link notebook-clear">Clear this book’s notes</button></div><p role="status"></p>';
  dialog.append(journal);let key='';const status=journal.querySelector('[role=status]');
  function load(){if(!dialog.open)return;key='reading-notebook:'+dialog.querySelector('h2').textContent.trim();journal.reset();status.textContent='';try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved)for(const name of ['status','note','quote'])journal.elements[name].value=saved[name]||'';}catch{status.textContent='Storage is unavailable. Notes will not persist.';}}
  new MutationObserver(load).observe(dialog,{attributes:true,attributeFilter:['open']});
  journal.onsubmit=e=>{e.preventDefault();try{localStorage.setItem(key,JSON.stringify(Object.fromEntries(['status','note','quote'].map(n=>[n,journal.elements[n].value]))));status.textContent='Saved on this browser.';}catch{status.textContent='Could not save. Copy your notes before closing.';}};
  journal.querySelector('.notebook-clear').onclick=()=>{try{localStorage.removeItem(key);journal.reset();status.textContent='Notes cleared for this book.';}catch{status.textContent='Could not clear stored notes.';}};
 }
 // A small curated chooser: time describes the suggested session, not completion time.
 const picks=[
 {title:'Arcane Chess',kind:'board',players:'solo',mood:'think',time:'short',reason:'Try a short practice game against one of its AI levels.'},
 {title:'Arcane Chess',kind:'board',players:'friends',mood:'think',time:'long',reason:'Take time over a local or online game with a friend.'},
 {title:'Monopoly Deal',kind:'board',players:'friends',mood:'social',time:'short',reason:'A card-table choice for a shared game session.'},
 {title:'The Liar’s Table',kind:'board',players:'friends',mood:'social',time:'long',reason:'Choose the saloon when you want bluffing and conversation.'},
 {title:'Planet Zoo',kind:'steam',players:'solo',mood:'relax',time:'long',reason:'Spend a relaxed session building and managing a zoo.'},
 {title:'Hogwarts Legacy',kind:'steam',players:'solo',mood:'explore',time:'long',reason:'Set aside time to explore its wizarding world.'},
 {title:'Cyberpunk 2077',kind:'steam',players:'solo',mood:'explore',time:'long',reason:'Explore Night City in a story-focused session.'}
 ];
 const chooser=document.createElement('section');chooser.className='game-chooser';chooser.id='game-chooser';chooser.innerHTML='<p class="eyebrow">FIND YOUR NEXT SESSION</p><h2>What are you in the mood for?</h2><form><label>Company<select name="players"><option value="solo">Solo</option><option value="friends">With friends</option></select></label><label>Mood<select name="mood"><option value="think">Think & strategise</option><option value="social">Laugh & bluff</option><option value="relax">Build & unwind</option><option value="explore">Explore a world</option></select></label><label>Time available<select name="time"><option value="short">A short break</option><option value="long">A longer session</option></select></label><button class="button primary" type="submit">Find a game ↗</button><button class="text-link" type="reset">Reset</button></form><p class="chooser-note">A curated shortlist, not a live matchmaking service. Time means session length, not time to finish a game.</p><div class="chooser-results" aria-live="polite"></div>';
 document.querySelector('.room-doors').after(chooser);
 const form=chooser.querySelector('form'),results=chooser.querySelector('.chooser-results');
 form.onsubmit=e=>{e.preventDefault();results.replaceChildren();const values=Object.fromEntries(new FormData(form));const matches=picks.filter(p=>p.players===values.players).map(p=>({...p,score:Number(p.mood===values.mood)*2+Number(p.time===values.time)})).sort((a,b)=>b.score-a.score).slice(0,2);
  for(const p of matches){const article=document.createElement('article'),h=document.createElement('h3'),text=document.createElement('p'),link=document.createElement('a');h.textContent=p.title;text.textContent=(p.score===3?'Matches your choices. ':'Closest match in this shortlist. ')+p.reason;link.className='text-link';link.href=p.kind==='board'?'#board-games':'#steam';link.textContent='Enter '+(p.kind==='board'?'the play room':'the gaming room')+' ↗';link.dataset.pick=p.title;article.append(h,text,link);results.append(article);}
 };
 form.onreset=()=>results.replaceChildren();let pending='';results.addEventListener('click',e=>{const a=e.target.closest('[data-pick]');if(a)pending=a.dataset.pick;});
 document.addEventListener('portfolio:transitionend',()=>{if(!pending)return;const page=document.querySelector('.page.active');page.querySelectorAll('.collection-reset').forEach(b=>{if(!b.disabled)b.click();});const card=[...page.querySelectorAll('.game-box,#steam-collection>a')].find(c=>c.textContent.includes(pending));pending='';if(card){card.scrollIntoView({block:'center',behavior:'instant'});card.focus({preventScroll:true});card.classList.add('chooser-pick');setTimeout(()=>card.classList.remove('chooser-pick'),2400);}});
})();
