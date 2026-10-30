/* Personal collection tools: local-only saves, shareable summaries, and room polish. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduced=()=>window.portfolioMotion?.matches||matchMedia('(prefers-reduced-motion:reduce)').matches;
const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
const action=(text,fn)=>{const b=make('button',text,'text-link');b.type='button';b.addEventListener('click',fn);return b;};
const slug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const groups=[{room:'books',name:'Study',selector:'.study-shelves .reading-book',dialogs:['#book-dialog','.reading-summary']},{room:'board-games',name:'Play Room',selector:'.game-box',dialogs:['#shelf-dialog']},{room:'steam',name:'Gaming Room',selector:'#steam-collection>a',dialogs:['#video-game-dialog']}];
const items=groups.flatMap(g=>all(g.selector).map(card=>({group:g,card,title:card.querySelector('strong,h2').textContent.replace(/\s+/g,' ').trim()}))).map(i=>({...i,id:i.group.room+'--'+slug(i.title)}));
let saved=new Set();try{const value=JSON.parse(localStorage.getItem('portfolio-picks')||'[]');if(Array.isArray(value))saved=new Set(value.filter(id=>items.some(i=>i.id===id)));}catch{}
const feedback=make('p','','collection-feedback');feedback.setAttribute('role','status');$('#living-room').append(feedback);
function persist(){try{localStorage.setItem('portfolio-picks',JSON.stringify([...saved]));return true;}catch{return false;}}
const picks=make('details',null,'my-picks');picks.append(make('summary','My Picks'),make('p','Saved on this device. No account needed.'));const list=make('div',null,'picks-list');picks.append(list);$('.living-room-scene').before(picks);
function renderPicks(){picks.querySelector('summary').textContent=`My Picks (${saved.size})`;list.replaceChildren();for(const i of items.filter(i=>saved.has(i.id))){const row=make('div',null,'pick-row');row.append(action(i.title,()=>openItem(i)),make('small',i.group.name),action('Remove',()=>{saved.delete(i.id);const ok=persist();renderPicks();feedback.textContent=ok?'Removed from My Picks.':'Removed for this visit; device storage is unavailable.';}));list.append(row);}if(!saved.size)list.append(make('p','Open a book or game and select “Save to My Picks” to start your collection.'));all('[data-pick-id]').forEach(b=>{const on=saved.has(b.dataset.pickId);b.setAttribute('aria-pressed',String(on));b.textContent=on?'Saved to My Picks':'Save to My Picks';});}
renderPicks();
let pending=null;
function navigate(room){const a=make('a');a.href='#'+room;document.body.append(a);a.click();a.remove();}
function openItem(item){all('dialog[open]').forEach(d=>d.close());pending=item;if($('.page.active')?.id===item.group.room)finishOpen();else navigate('living-room');}
function finishOpen(){if(!pending||document.documentElement.classList.contains('is-routing'))return;const room=$('.page.active')?.id;if(room==='living-room'){navigate(pending.group.room);return;}if(room!==pending.group.room)return;const i=pending;pending=null;$('#'+room).querySelectorAll('.collection-reset').forEach(b=>{if(!b.disabled)b.click();});i.card.scrollIntoView({block:'center',behavior:'instant'});i.card.click();}
document.addEventListener('portfolio:transitionend',finishOpen);document.addEventListener('portfolio:pagechange',()=>{if(reduced())queueMicrotask(finishOpen);});
// Opening a saved item while already at the hub needs no route change.
picks.addEventListener('click',()=>queueMicrotask(finishOpen));
const dialogs=new Map();
for(const item of items){item.card.addEventListener('click',()=>{queueMicrotask(()=>{const d=item.group.dialogs.map(s=>$(s)).find(x=>x.open);if(!d)return;dialogs.set(d,item);decorate(d,item);});});}
function decorate(d,item){
 d.classList.add('collection-sheet');d.dataset.room=item.group.room;
 let tools=d.querySelector('.item-tools');if(!tools){tools=make('div',null,'item-tools');d.querySelector('h2').after(tools);}tools.replaceChildren();
 const status=make('p',null,'item-status');status.setAttribute('role','status');
 const save=action(saved.has(item.id)?'Saved to My Picks':'Save to My Picks',()=>{saved.has(item.id)?saved.delete(item.id):saved.add(item.id);const ok=persist();renderPicks();status.textContent=ok?(saved.has(item.id)?'Saved on this device.':'Removed from your picks.'):'Storage is unavailable. Your picks will last for this visit only.';});save.dataset.pickId=item.id;save.setAttribute('aria-pressed',String(saved.has(item.id)));
 const share=action('Copy item link',async()=>{const url=new URL(location.origin+location.pathname);url.searchParams.set('item',item.id);url.hash='living-room';try{await navigator.clipboard.writeText(url.href);status.textContent='Item link copied.';}catch{const input=make('input');input.readOnly=true;input.value=url.href;input.setAttribute('aria-label','Shareable item link');tools.append(input);input.select();status.textContent='Copy this link to share the summary.';}});
 tools.append(save,share,status);
 const journal=d.querySelector('.book-journal');if(journal){let exp=journal.querySelector('.export-notes');if(!exp){exp=action('Export notes (.md)',()=>{const title=d.querySelector('h2').textContent;const lines=['# '+title,'','Reading status: '+journal.elements.status.value,'','## Why I picked this',journal.elements.note.value,'','## A favourite quote',journal.elements.quote.value,'','Personal reading notes exported from Lim Ziwei’s portfolio.'];const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}));const a=make('a');a.href=url;a.download=slug(title)+'-notes.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);journal.querySelector('[role=status]').textContent='Notes exported as Markdown.';});exp.classList.add('export-notes');journal.querySelector('.notebook-actions').append(exp);}}
 animateFrom(d,item.card,false);
}
function animateFrom(d,card,closing){
 const r=card.getBoundingClientRect(),box=d.getBoundingClientRect();
 const visible=r.bottom>0&&r.top<innerHeight;
 const compact=matchMedia('(max-width:700px)').matches;
 const start=reduced()||!visible?{opacity:0}:compact?{opacity:.6,transform:'translateY(32px)'}:{opacity:.35,transform:`translate(${r.left+r.width/2-box.left-box.width/2}px,${r.top+r.height/2-box.top-box.height/2}px) scale(${Math.max(.25,Math.min(.75,r.width/box.width))})`};
 const end={opacity:1,transform:'none'};d.getAnimations().forEach(a=>a.cancel());
 return d.animate(closing?[end,start]:[start,end],{duration:reduced()?100:closing?180:360,easing:'cubic-bezier(.16,1,.3,1)'});
}
for(const selector of groups.flatMap(g=>g.dialogs)){const d=$(selector);if(!d)continue;let closing=false;const dismiss=()=>{if(closing)return;closing=true;const i=dialogs.get(d);if(!i){d.close();closing=false;return;}animateFrom(d,i.card,true).finished.catch(()=>{}).then(()=>{d.close();closing=false;});};d.addEventListener('cancel',e=>{e.preventDefault();dismiss();});d.addEventListener('click',e=>{const rect=d.getBoundingClientRect();if(e.target.closest('.close-dialog')||(e.target===d&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))){e.preventDefault();e.stopImmediatePropagation();dismiss();}},true);}
for(const g of groups){const page=$('#'+g.room),controls=page.querySelector('.library-controls,.board-filters')||page.querySelector('.new-intro');const wrap=make('div',null,'surprise-tools');const result=make('p');result.setAttribute('role','status');const b=action('Surprise me',()=>{const choices=items.filter(i=>i.group===g&&!i.card.hidden&&!i.card.closest('[hidden]'));if(!choices.length){result.textContent='No matches. Reset or change your filters first.';return;}const i=choices[Math.floor(Math.random()*choices.length)];i.card.click();queueMicrotask(()=>{const d=g.dialogs.map(s=>$(s)).find(x=>x.open);const reason=make('p',`Selected from the ${choices.length} ${g.room==='books'?(choices.length===1?'book':'books'):(choices.length===1?'game':'games')} matching your current filters.`,'surprise-reason');d?.querySelector('.surprise-reason')?.remove();d?.querySelector('.item-tools')?.after(reason);});});wrap.append(b,result);controls.after(wrap);}
// A compact map keeps normal room entrances at the hub.
for(const room of ['living-room',...groups.map(g=>g.room)]){const map=make('nav',null,'room-map');map.setAttribute('aria-label','Room map');for(const [id,name] of [['living-room','Living Room'],...groups.map(g=>[g.room,g.name])]){if(id===room){const label=make('span',name);label.setAttribute('aria-current','page');map.append(label);}else{const link=make('a',name);link.href='#living-room';link.addEventListener('click',()=>{if(id!=='living-room'){const focusDoor=()=>{const door=$(`.room-doors a[href="#${id}"]`);door?.scrollIntoView({block:'center',behavior:'instant'});door?.focus({preventScroll:true});};if(room==='living-room')focusDoor();else document.addEventListener(reduced()?'portfolio:pagechange':'portfolio:transitionend',focusDoor,{once:true});}});map.append(link);}}$('#'+room).prepend(map);}
const news=make('details',null,'whats-new');news.append(make('summary','What’s new'),make('p','30 October 2026 · Personal collections'),make('p','Save books and games, discover a filtered surprise, share a summary, and export your reading notes. Collection details now have a room-inspired finish and a phone-friendly sheet.'));picks.after(news);
const requested=new URL(location.href).searchParams.get('item');if(requested){const i=items.find(i=>i.id===requested);if(i){const start=()=>{openItem(i);queueMicrotask(finishOpen);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();}else feedback.textContent='That shared item is not in this collection. Browse the rooms to find something else.';}
})();
