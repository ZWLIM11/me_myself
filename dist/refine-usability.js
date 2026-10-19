(() => {
  const grid=document.querySelector('#project-grid'),row=document.querySelector('#projects .filter-row');
  if(!grid||!row)return;
  const bar=document.createElement('div');bar.className='project-results';
  bar.innerHTML='<span role="status" aria-live="polite"></span><button type="button" hidden>Show all projects ↗</button>';row.after(bar);
  function update(){const count=grid.querySelectorAll('.project-card').length,total=window.PORTFOLIO.projects.length;
    bar.querySelector('span').textContent=`${count} of ${total} project${total===1?'':'s'}`;
    bar.querySelector('button').hidden=document.querySelector('.filter[data-filter="all"]').getAttribute('aria-pressed')==='true';}
  bar.querySelector('button').addEventListener('click',()=>{const all=document.querySelector('.filter[data-filter="all"]');all.click();all.focus({preventScroll:true});});
  new MutationObserver(update).observe(grid,{childList:true});update();
})();
