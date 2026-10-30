/* Visitor continuity and opt-in room experiences. No external services. */
(()=>{
 const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
 const reduced=()=>window.portfolioMotion?.matches;
 const button=(text,action)=>{const b=document.createElement('button');b.type='button';b.className='text-link';b.textContent=text;b.onclick=action;return b;};
 const active=()=>$('.page.active')?.id;
 // Filters persist for this tab, including a reload; routing preserves scroll positions.
 for(const controls of all('.library-controls,.browse-controls')){
  const page=controls.closest('.page')?.id;if(!page)continue;
  const fields=[...controls.querySelectorAll('input,select')];
  const key='collection-filters:'+page;
  try{const values=JSON.parse(sessionStorage.getItem(key)||'[]');fields.forEach((f,i)=>{if(typeof values[i]==='string'){f.value=values[i];f.dispatchEvent(new Event(f.tagName==='SELECT'?'change':'input',{bubbles:true}));}});}catch{}
  const save=()=>{try{sessionStorage.setItem(key,JSON.stringify(fields.map(f=>f.value)));}catch{}};
  controls.addEventListener('input',save);controls.addEventListener('change',save);
 }
 const groups=[{cards:'.study-shelves .reading-book',dialogs:['#book-dialog','.reading-summary']},{cards:'.game-box',dialogs:['#shelf-dialog']},{cards:'#steam-collection>a',dialogs:['#video-game-dialog']}];
 const drafts=new Map();
 for(const group of groups){
  let selected=null;
  const cards=all(group.cards);
  cards.forEach(card=>card.addEventListener('click',()=>{selected=card;queueMicrotask(refresh);}));
  function refresh(){
   for(const selector of group.dialogs){const dialog=$(selector);if(!dialog?.open)continue;
    const visible=cards.filter(c=>!c.hidden&&!c.closest('[hidden]'));
    const index=visible.indexOf(selected);if(index<0)continue;
    let nav=dialog.querySelector('.collection-pager');if(!nav){nav=document.createElement('nav');nav.className='collection-pager';nav.setAttribute('aria-label','Browse collection');dialog.querySelector('h2').after(nav);}
    const move=delta=>{
     const journal=dialog.querySelector('.book-journal');if(journal)drafts.set(selected,[...journal.querySelectorAll('input,select,textarea')].map(f=>f.value));
     dialog.close();setTimeout(()=>{visible[index+delta].click();queueMicrotask(()=>{const next=group.dialogs.map(s=>$(s)).find(d=>d.open);const values=drafts.get(selected);if(values&&next)next.querySelectorAll('.book-journal input,.book-journal select,.book-journal textarea').forEach((f,i)=>f.value=values[i]??'');next?.querySelector('.collection-pager button:not(:disabled)')?.focus({preventScroll:true});if(next)next.scrollTop=0;});},0);
    };
    const prev=button('← Previous',()=>move(-1)),next=button('Next →',()=>move(1)),count=document.createElement('span');prev.disabled=index===0;next.disabled=index===visible.length-1;count.textContent=`${index+1} of ${visible.length}`;nav.replaceChildren(prev,count,next);dialog.scrollTop=0;
   }
  }
 }
 // Study lighting is independent of the site's light/dark preference.
 const desk=$('.study-desk');if(desk){const lamp=button('Reading lamp: off',()=>{const on=$('#books').classList.toggle('reading-lamp-on');lamp.setAttribute('aria-pressed',String(on));lamp.textContent='Reading lamp: '+(on?'on':'off');});lamp.classList.add('reading-lamp');lamp.setAttribute('aria-pressed','false');desk.prepend(lamp);}
 // The opened box rests on a tabletop, rather than looking like another book.
 const table=$('#shelf-dialog');if(table){table.classList.add('game-table-dialog');const box=table.querySelector('.opened-book');box.classList.add('table-game-box');new MutationObserver(()=>{if(table.open&&!reduced())box.animate([{transform:'translateY(-24px) rotate(-8deg)',opacity:.5},{transform:'translateY(0) rotate(-3deg)',opacity:1}],{duration:440,easing:'cubic-bezier(.16,1,.3,1)'});}).observe(table,{attributes:true,attributeFilter:['open']});}
 const monitor=$('.gaming-monitor');if(monitor){monitor.parentElement.removeAttribute('aria-hidden');monitor.setAttribute('aria-live','polite');const description=document.createElement('p');description.className='monitor-description';monitor.append(description);all('#steam-collection>a').forEach(card=>card.addEventListener('click',()=>{monitor.querySelector('strong').textContent=card.querySelector('h2').textContent;description.textContent=$('#video-game-dialog .game-description').textContent;}));}
 // Connections stay within the room-entry model: choose a door from the hub.
 function roomSuggestion(dialog,target,title){let host=dialog.querySelector('.related-discovery');if(!host){host=document.createElement('aside');host.className='related-discovery';dialog.append(host);}host.replaceChildren();if(!title)return;const p=document.createElement('p');p.textContent=title;const go=button('Find it in the Living Room →',()=>{dialog.close();navigate('living-room');pendingDoor=target;});host.append(p,go);}
 let pendingDoor='';
 for(const selector of ['#book-dialog','.reading-summary','#video-game-dialog']){const dialog=$(selector);if(!dialog)continue;const refresh=()=>{if(!dialog.open)return;const title=dialog.querySelector('h2').textContent;roomSuggestion(dialog,/Hogwarts/.test(title)?'books':'steam',/Harry Potter|Fantastic Beasts|Quidditch|Beedle/.test(title)?'Another way into this world: explore Hogwarts Legacy in the Gaming Room.':/Hogwarts/.test(title)?'Continue the wizarding world on the Study’s Harry Potter shelf.':'');};new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:['open']});}
 function navigate(id){const a=document.createElement('a');a.href='#'+id;document.body.append(a);a.click();a.remove();}
 function highlightDoor(){if(active()!=='living-room'||!pendingDoor)return;const door=$(`.room-doors a[href="#${pendingDoor}"]`);pendingDoor='';door?.focus({preventScroll:true});door?.scrollIntoView({block:'center',behavior:'instant'});}
 document.addEventListener('portfolio:transitionend',highlightDoor);document.addEventListener('portfolio:pagechange',()=>{if(reduced())highlightDoor();});
 const sport=$('.sport-story');if(sport){const link=document.createElement('a');link.href='/projects/ripple/';link.className='text-link';link.textContent='Explore football passing with Ripple →';sport.append(link);const refresh=()=>link.hidden=$('[data-sport="football"]')?.getAttribute('aria-pressed')!=='true';all('[data-sport]').forEach(b=>b.addEventListener('click',refresh));refresh();}
 // Byte's optional tour uses the existing navigation and leaves the visitor in control.
 const chat=$('#byte-chat');const tour=document.createElement('aside');tour.className='byte-tour';tour.hidden=true;tour.setAttribute('aria-label','Byte guided tour');tour.innerHTML='<p class="tour-progress"></p><h2></h2><p class="tour-copy"></p><div class="tour-actions"></div>';document.body.append(tour);
 const routes={work:[['projects','RecruitView','Explore the interview assessment workflow.','interview'],['projects','Ripple','Try moving players to explore passing lanes.','ripple'],['projects','Makan Mana','Discover nearby food and plan your next stop.','makan-mana']],explore:[['living-room','Welcome to the Living Room','Three doors lead to stories, shared games, and digital worlds.'],['living-room','The Study','Open the Study door to browse books and keep private reading notes.','books'],['living-room','The Play Room','Open the Play Room door to choose a board game.','board-games'],['living-room','The Gaming Room','Open the Gaming Room door to discover the Steam collection.','steam']]};
 let steps=[],step=0;
 function end(){tour.hidden=true;document.body.classList.remove('tour-running');}
 function renderTour(){const [page,title,copy,target]=steps[step];tour.hidden=false;document.body.classList.add('tour-running');tour.querySelector('h2').textContent=title;tour.querySelector('.tour-copy').textContent=copy;tour.querySelector('.tour-progress').textContent=`Byte’s tour · ${step+1} / ${steps.length}`;const actions=tour.querySelector('.tour-actions');actions.replaceChildren();if(target){actions.append(button(page==='projects'?'Open project':'Enter room',()=>{if(active()!==page||document.documentElement.classList.contains('is-routing'))return;end();if(page==='projects')$(`[data-project="${target}"]`)?.click();else $(`.room-doors a[href="#${target}"]`)?.click();}));}actions.append(button(step===steps.length-1?'Finish tour':'Next stop →',()=>{if(step===steps.length-1)end();else{step++;renderTour();}}),button('Leave tour',end));if(active()!==page)navigate(page);tour.querySelector('button')?.focus({preventScroll:true});}
 document.addEventListener('portfolio:pagechange',()=>{if(!tour.hidden&&active()!==steps[step]?.[0])end();});
 if(chat){const choices=document.createElement('div');choices.className='tour-choices';choices.setAttribute('aria-label','Guided tours');for(const [key,label] of [['work','Show me your work · guided tour'],['explore','Let me explore · room tour']])choices.append(button(label,()=>{chat.close();steps=routes[key];step=0;renderTour();}));chat.querySelector('.byte-chat-companion').after(choices);}
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!tour.hidden)end();});
 // Reserve existing image containers and offer readable failure feedback.
 function images(){all('img:not([data-image-feedback])').forEach(img=>{if(!img.getAttribute('src'))return;img.dataset.imageFeedback='ready';img.addEventListener('load',()=>{img.style.visibility='';img.parentElement.querySelector('.image-unavailable')?.remove();});const fail=()=>{if(img.parentElement.querySelector('.image-unavailable'))return;img.style.visibility='hidden';const note=document.createElement('span');note.className='image-unavailable';note.textContent=img.alt||'Image unavailable';note.setAttribute('role','status');img.parentElement.append(note);};img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail();});}
 images();new MutationObserver(images).observe($('#main'),{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
})();
