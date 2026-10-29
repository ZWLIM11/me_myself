(()=>{
  let running=[];
  function reveal(){
    running.forEach(a=>a.cancel());running=[];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off')return;
    const page=document.querySelector('.page.active');
    if(!page)return;
    const title=page.querySelector('h1');
    if(!title)return;
    // Animate the intact heading so line wrapping and accessible names stay stable.
    const photo=page.id==='photography';
    running.push(title.animate(photo?[
      {opacity:0,transform:'translateY(5px)'},
      {opacity:1,transform:'translateY(0)'}
    ]:[
      {opacity:0,transform:'translateY(6px)'},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:document.documentElement.dataset.transitionSpeed==='quick'?200:500,easing:'cubic-bezier(.16,1,.3,1)'}));
  }
  document.addEventListener('portfolio:arrival',reveal);
  document.addEventListener('portfolio:pagechange',()=>{running.forEach(a=>a.cancel());running=[];});
  const surfaces=document.querySelectorAll('.room-doors>a,#steam-collection>a,.interest-grid>a,.study-shelves button');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  surfaces.forEach(surface=>{
    surface.classList.add('depth-surface');let frame=0;
    surface.addEventListener('pointermove',e=>{
      if(!fine.matches||window.portfolioMotion?.matches)return;
      cancelAnimationFrame(frame);const x=e.clientX,y=e.clientY;
      frame=requestAnimationFrame(()=>{const r=surface.getBoundingClientRect();const dx=(x-r.left)/r.width-.5,dy=(y-r.top)/r.height-.5;
        surface.style.setProperty('--depth-x',dx);surface.style.setProperty('--depth-y',-dy);surface.style.setProperty('--depth-angle','3deg');
        surface.style.setProperty('--light-x',`${(dx+.5)*100}%`);surface.style.setProperty('--light-y',`${(dy+.5)*100}%`);
      });
    },{passive:true});
    surface.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);surface.style.setProperty('--depth-angle','0deg');});
  });
  document.querySelectorAll('.page:not(.home-page) h1').forEach(title=>{
    title.addEventListener('pointermove',event=>{
      if(!fine.matches||window.portfolioMotion?.matches)return;
      const rect=title.getBoundingClientRect();
      title.style.setProperty('--name-light',`${Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))}%`);
      title.classList.add('heading-lit');
    },{passive:true});
    title.addEventListener('pointerleave',()=>title.classList.remove('heading-lit'));
  });
  reveal();
})();

// One visible filtering interface, with native change events preserving existing filtering.
(()=>{
  document.querySelectorAll('.library-controls').forEach(controls=>{
    const select=controls.querySelector('select'),input=controls.querySelector('input');
    if(!select||!input)return;
    const chips=document.createElement('div');chips.className='collection-chips';chips.setAttribute('role','group');chips.setAttribute('aria-label',select.getAttribute('aria-label'));
    const buttons=[...select.options].map(option=>{
      const button=document.createElement('button');button.type='button';button.textContent=option.textContent;
      button.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();};chips.append(button);return button;
    });
    select.hidden=true;select.after(chips);
    const reset=document.createElement('button');reset.type='button';reset.className='collection-reset text-link';reset.textContent='Reset filters';controls.append(reset);
    function sync(){buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(select.selectedIndex===i)));reset.disabled=!input.value&&[...controls.querySelectorAll('select')].every(s=>s.selectedIndex===0);}
    reset.onclick=()=>{input.value='';controls.querySelectorAll('select').forEach(s=>{s.selectedIndex=0;s.dispatchEvent(new Event('change',{bubbles:true}));});select.selectedIndex=0;select.dispatchEvent(new Event('change',{bubbles:true}));input.dispatchEvent(new Event('input',{bubbles:true}));sync();input.focus();};
    controls.addEventListener('change',sync);controls.addEventListener('input',sync);select.addEventListener('change',sync);sync();
  });
  for(const [id,label] of Object.entries({books:'Study', 'board-games':'Play Room',steam:'Gaming Room'})){
    const page=document.getElementById(id);if(!page)continue;
    page.querySelectorAll('.room-return').forEach(a=>a.remove());
    const crumb=document.createElement('nav');crumb.className='room-breadcrumb';crumb.setAttribute('aria-label','Room location');
    crumb.innerHTML='<a href="#living-room">← Living Room</a><span aria-hidden="true">/</span><span aria-current="page">'+label+'</span>';page.prepend(crumb);
  }
})();
(()=>{
 const host=document.querySelector('#board-collection');if(!host)return;
 const cards=[...host.querySelectorAll('.game-slot')],genres=['Cards','Bluffing','Strategy','Cards','Strategy'];
 const controls=document.createElement('div');controls.className='library-controls';
 controls.innerHTML='<div class="collection-chips" role="group" aria-label="Board game genre"></div><p role="status"></p><button type="button" class="collection-reset text-link">Reset filters</button>';host.before(controls);
 let selected='All games';const group=controls.querySelector('.collection-chips'),reset=controls.querySelector('.collection-reset');
 for(const genre of ['All games',...new Set(genres)]){const b=document.createElement('button');b.type='button';b.textContent=genre;b.onclick=()=>{selected=genre;render();};group.append(b);}
 function render(){let count=0;cards.forEach((c,i)=>{c.hidden=selected!=='All games'&&genres[i]!==selected;if(!c.hidden)count++;});group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===selected)));controls.querySelector('p').textContent=`${count} of ${cards.length} games`;reset.disabled=selected==='All games';}
 reset.onclick=()=>{selected='All games';render();};render();
})();
