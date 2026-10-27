(() => {
  const projects=window.PORTFOLIO.projects,grid=document.querySelector('.explore-grid'),status=document.querySelector('.explore-status');
  let saved=new Set(),interest='all',persistent=true;
  try{const value=JSON.parse(localStorage.getItem('portfolio-shortlist')||'[]');if(Array.isArray(value))saved=new Set(value.filter(id=>projects.some(p=>p.id===id)));}catch{persistent=false;}
  function save(){try{localStorage.setItem('portfolio-shortlist',JSON.stringify([...saved]));}catch{persistent=false;}}
  function render(focusId){
    grid.replaceChildren();
    const matches=projects.filter(p=>interest==='all'||interest===p.id||interest==='saved'&&saved.has(p.id));
    status.textContent=matches.length?`${matches.length} project${matches.length===1?'':'s'} · ${saved.size} saved${persistent?'':' · saving unavailable; this page only'}`:'Your shortlist is empty. Explore a project and choose “Save for later”.';
    for(const p of matches){
      const card=document.createElement('article');card.className='explore-card';
      const image=document.createElement('img');image.src='/'+p.image;image.alt=p.alt;image.loading='lazy';image.width=600;image.height=400;
      const body=document.createElement('div'),heading=document.createElement('h2'),copy=document.createElement('p'),link=document.createElement('a'),button=document.createElement('button');
      heading.textContent=p.title;copy.textContent=p.subtitle;link.href='/projects/'+p.id+'/';link.textContent='Discover the project ↗';
      button.type='button';button.className='save-project';button.dataset.project=p.id;button.setAttribute('aria-pressed',String(saved.has(p.id)));button.setAttribute('aria-label',(saved.has(p.id)?'Remove ':'Save ')+p.title);button.textContent=saved.has(p.id)?'Saved ✓ · remove':'Save for later +';
      button.addEventListener('click',()=>{saved.has(p.id)?saved.delete(p.id):saved.add(p.id);save();render(p.id);});
      body.append(heading,copy,link,button);card.append(image,body);grid.append(card);
    }
    if(focusId)(grid.querySelector(`[data-project="${focusId}"]`)||document.querySelector('[data-interest="saved"]')).focus({preventScroll:true});
  }
  document.querySelectorAll('[data-interest]').forEach(button=>button.addEventListener('click',()=>{interest=button.dataset.interest;document.querySelectorAll('[data-interest]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));render();
})();
