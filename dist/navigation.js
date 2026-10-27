(() => {
  const pages=['home','about','projects','photography','contact'];
  const labels=['Home','About','Projects','Photography','Contact'];
  const controls=document.querySelector('.chapter-controls');
  if(controls){
    // Replace the three different end-of-page treatments with one shared sequence.
    document.querySelectorAll('.next-page,.chapter-end').forEach(element=>element.remove());
    const sequence=document.createElement('nav');
    sequence.className='page-sequence';sequence.setAttribute('aria-label','Previous and next page');
    controls.prepend(sequence);
    function update(){
      const index=pages.indexOf(document.querySelector('.page.active')?.id);
      if(index<0)return;
      const previous=(index+pages.length-1)%pages.length,next=(index+1)%pages.length;
      sequence.dataset.page=pages[index];
      sequence.innerHTML=`<a href="#${pages[previous]}" aria-label="Previous page: ${labels[previous]}"><span aria-hidden="true">←</span><strong>${labels[previous]}</strong></a><span class="sequence-position">${String(index+1).padStart(2,'0')} / 05</span><a href="#${pages[next]}" aria-label="Next page: ${labels[next]}"><span>${next===0?'Home':'Next'} →</span><strong>${labels[next]}</strong></a>`;
    }
    controls.querySelectorAll('.chapter-dock a').forEach((link,index)=>{
      link.setAttribute('aria-label',labels[index]);
      link.querySelector('.chapter-link-name').textContent=labels[index];
    });
    document.addEventListener('portfolio:pagechange',update);update();
  }
  // Project documents use real root URLs so these links also work on a direct visit.
  const footer=document.querySelector('.case-footer');
  if(footer){
    const nav=document.createElement('nav');nav.className='portfolio-footer-links';nav.setAttribute('aria-label','Portfolio pages');
    nav.innerHTML=pages.map((id,index)=>`<a href="/#${id}"${id==='projects'?' aria-current="location"':''}>${labels[index]}</a>`).join('');
    footer.prepend(nav);
  }
})();
