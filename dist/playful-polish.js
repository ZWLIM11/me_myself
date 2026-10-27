(() => {
  const nav=document.querySelector('.header nav');
  const menu=document.createElement('details');menu.className='explore-menu';
  const summary=document.createElement('summary');summary.textContent='Explore';
  const links=document.createElement('div');links.className='explore-dropdown';
  for(const id of ['photography','beyond','playground','board-games']){const link=nav.querySelector(`[href="#${id}"]`);if(link)links.append(link);}
  menu.append(summary,links);nav.querySelector('[href="#contact"]').before(menu);
  function mark(){const selected=links.querySelector('[aria-current="page"]');summary.classList.toggle('active',!!selected);summary.setAttribute('aria-label',selected?'Explore — '+selected.textContent:'Explore more pages');menu.open=false;}
  document.addEventListener('portfolio:pagechange',mark);mark();
  document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;summary.focus();event.stopPropagation();}});
  const art=document.querySelector('.sport-art'),switches=document.querySelector('.sport-switch');
  const play=document.createElement('button');play.type='button';play.className='button primary sport-play';
  const output=document.createElement('p');output.className='sport-feedback';output.setAttribute('role','status');
  switches.after(play,output);let shots=0,animation=null;
  const chosen=()=>document.querySelector('[data-sport][aria-pressed=true]').dataset.sport;
  function reset(){animation?.cancel();animation=null;shots=0;const id=chosen();play.textContent=id==='badminton'?'Play a rally ↗':id==='volleyball'?'Try a serve ↗':'Make a pass ↗';output.textContent='Tap to move the '+(id==='badminton'?'shuttle.':'ball.');}
  switches.addEventListener('click',reset);reset();
  play.addEventListener('click',()=>{
    animation?.cancel();const id=chosen(),ball=art.querySelector('.sport-ball');shots++;
    const left=shots%2===0,start=left?'0px 0px':'-190px 115px',end=left?'-190px 115px':'0px 0px';
    const mid=id==='football'?'-90px 75px':id==='volleyball'?'-70px -90px':'-90px -60px';
    ball.style.transform=`translate(${end.replace(' ', ',')})`;
    if(!window.portfolioMotion.matches){animation=ball.animate([{transform:`translate(${start.replace(' ', ',')})`},{transform:`translate(${mid.replace(' ', ',')})`,offset:.5},{transform:`translate(${end.replace(' ', ',')})`}],{duration:id==='football'?650:900,easing:'ease-in-out'});}
    output.textContent=(id==='badminton'?'Rally shots: ':id==='volleyball'?'Serves played: ':'Passes played: ')+shots+'. '+(id==='football'?'Find the next passing lane.':id==='volleyball'?'Send it over the net.':'Keep the shuttle moving.');
  });
  const stop=()=>{animation?.cancel();animation=null;};window.portfolioMotion.addEventListener('change',stop);
  document.addEventListener('portfolio:pagechange',()=>{if(!document.querySelector('#beyond').classList.contains('active'))stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();
