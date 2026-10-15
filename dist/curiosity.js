(() => {
  const seal=document.querySelector('.hero-seal');
  const trigger=document.createElement('button');trigger.className='curiosity-trigger';trigger.type='button';trigger.setAttribute('aria-label','Explore your interests');trigger.setAttribute('aria-haspopup','dialog');trigger.innerHTML='<span class="curiosity-code" aria-hidden="true">&lt;/&gt;</span><span class="curiosity-hint">EXPLORE ↗</span>';
  seal.removeAttribute('aria-hidden');seal.querySelector('svg').setAttribute('aria-hidden','true');seal.querySelector(':scope > span').remove();seal.append(trigger);
  const dialog=document.createElement('dialog');dialog.id='curiosity-dialog';dialog.setAttribute('aria-labelledby','curiosity-title');
  dialog.innerHTML='<button class="close-dialog" aria-label="Close curiosity explorer">×</button><p class="eyebrow">A LITTLE CURIOSITY</p><h2 id="curiosity-title">What catches your eye?</h2><p class="curiosity-intro">Choose a point. Follow the connection.</p><div class="curiosity-map"><svg viewBox="0 0 420 210" aria-hidden="true"><path class="map-guide" d="M70 60 210 150 350 60M70 60H350"/><path class="map-connection" d="M210 150 70 60"/><circle cx="210" cy="150" r="5"/></svg><button data-interest="data" aria-pressed="true"><span aria-hidden="true">◇</span>Data</button><button data-interest="code" aria-pressed="false"><span aria-hidden="true">&lt;/&gt;</span>Code</button><button data-interest="photo" aria-pressed="false"><span aria-hidden="true">⌑</span>Photography</button></div><div class="curiosity-description" aria-live="polite"><h3></h3><p></p></div><a class="button primary curiosity-destination" href="#projects"></a>';
  document.body.append(dialog);
  const interests={data:{title:'From questions to insight.',copy:'Explore recommendation systems, language processing, and streaming data.',href:'#projects',label:'Explore the projects ↗',path:'M210 150 70 60'},code:{title:'Meet the person behind the code.',copy:'Discover my interests, approach, and the tools I’m learning to build with.',href:'#about',label:'A little about me ↗',path:'M70 60 210 150 350 60'},photo:{title:'A different way of seeing.',copy:'Step outside the screen. My photography collection is taking shape.',href:'#photography',label:'Explore photography ↗',path:'M210 150 350 60'}};
  function choose(key){
    const item=interests[key];dialog.querySelectorAll('[data-interest]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.interest===key)));
    dialog.querySelector('h3').textContent=item.title;dialog.querySelector('.curiosity-description p').textContent=item.copy;
    const link=dialog.querySelector('.curiosity-destination');link.href=item.href;link.textContent=item.label;
    const line=dialog.querySelector('.map-connection');line.setAttribute('d',item.path);line.getAnimations().forEach(a=>a.cancel());
    if(!window.portfolioMotion.matches)line.animate([{strokeDashoffset:400},{strokeDashoffset:0}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  choose('data');trigger.addEventListener('click',()=>dialog.showModal());
  dialog.addEventListener('click',event=>{
    const choice=event.target.closest('[data-interest]');if(choice)choose(choice.dataset.interest);
    if(event.target.closest('.close-dialog,.curiosity-destination'))dialog.close();
    if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}
  });
})();
