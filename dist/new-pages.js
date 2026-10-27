(() => {
  const sports={badminton:['Quick feet. Quiet focus.','A shuttle, a net, and a game built on timing. Badminton is one of the sports I enjoy.'],volleyball:['Better, together.','A rally is a shared effort. Volleyball brings teamwork and movement into this corner of my life.'],football:['Read the space. Make the move.','Football is an interest that also finds its way into my projects—Ripple explores the possibilities of a passing lane.']};
  const art=document.querySelector('.sport-art'),story=document.querySelector('.sport-story');
  function sport(id){
    document.querySelectorAll('[data-sport]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sport===id)));
    story.querySelector('h2').textContent=sports[id][0];story.querySelector('p').textContent=sports[id][1];
    const field=id==='football'?'<circle cx="300" cy="200" r="45"/><path d="M70 120h65v160H70M530 120h-65v160h65"/>':id==='volleyball'?'<path d="M215 70v260M385 70v260"/>':'<path d="M105 70v260M495 70v260M210 70v260M390 70v260M70 105h460M70 295h460"/>';
    art.innerHTML=`<svg viewBox="0 0 600 400" fill="none"><rect x="70" y="70" width="460" height="260" rx="2"/><path d="M300 70v260"/>${field}<circle class="sport-ball" cx="360" cy="155" r="${id==='badminton'?7:13}"/><path class="sport-trail" d="M170 270Q240 110 360 155" stroke-dasharray="5 8"/></svg><span>${id.toUpperCase()} / A DIFFERENT KIND OF PLAY</span>`;
    if(!window.portfolioMotion.matches)art.animate([{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260});
  }
  document.querySelectorAll('[data-sport]').forEach(b=>b.addEventListener('click',()=>sport(b.dataset.sport)));sport('badminton');
  const pad=document.querySelector('.reaction-pad'),status=document.querySelector('#reaction-status');let phase='idle',timer,started=0;
  function reset(){clearTimeout(timer);phase='idle';pad.dataset.state='idle';pad.textContent='Start a round ↗';status.textContent='Your next round starts here.';}
  pad.addEventListener('click',()=>{
    if(phase==='waiting'){clearTimeout(timer);phase='idle';pad.dataset.state='early';pad.textContent='Try again ↗';status.textContent='A little early! Wait for “Go” before tapping.';return;}
    if(phase==='ready'){const ms=Math.round(performance.now()-started);phase='idle';pad.dataset.state='done';pad.textContent=ms+' ms · play again';status.textContent='Round complete. Your reaction took '+ms+' milliseconds on this device.';return;}
    phase='waiting';pad.dataset.state='waiting';pad.textContent='Wait for Go…';status.textContent='Stay ready. The pad will change when it is time.';
    timer=setTimeout(()=>{if(document.hidden||!document.querySelector('#playground').classList.contains('active')){reset();return;}phase='ready';pad.dataset.state='ready';pad.textContent='Go!';started=performance.now();status.textContent='Go—tap the pad now!';},1400+Math.random()*2200);
  });
  document.querySelector('#reaction-reset').addEventListener('click',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});document.addEventListener('portfolio:pagechange',()=>{if(!document.querySelector('#playground').classList.contains('active'))reset();});
  const shelf=document.querySelector('#board-collection');
  const safe=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch{return '';}};
  const games=(window.BOARD_GAMES||[]).filter(g=>g.title&&safe(g.url));
  if(!games.length){shelf.innerHTML='<div class="games-empty"><div class="board-art" aria-hidden="true"><i>♟</i><i>◇</i><i>♜</i></div><div><p class="eyebrow">THE COLLECTION IS TAKING SHAPE</p><h2>A place for<br>the next great round.</h2><p>Game links and rules are being prepared. Published games will appear here when they are ready.</p><a class="text-link" href="#playground">Try the Playground while you wait ↗</a></div></div>';return;}
  shelf.className='game-cabinet';
  const label=document.createElement('div');label.className='cabinet-label';label.innerHTML='<span>THE PRIVATE COLLECTION</span><span>'+games.length+' GAMES · SELECT A BOX</span>';
  const rack=document.createElement('div');rack.className='game-rack';rack.setAttribute('role','group');rack.setAttribute('aria-label','Choose a game from the shelf');
  const detail=document.createElement('div');detail.className='shelf-detail';detail.id='shelf-detail';
  const summary=document.createElement('div');summary.className='shelf-summary';summary.setAttribute('aria-live','polite');summary.setAttribute('aria-atomic','true');
  const category=document.createElement('p');category.className='eyebrow';const title=document.createElement('h2'),copy=document.createElement('p'),edition=document.createElement('span');edition.className='shelf-edition';summary.append(category,title,edition,copy);
  const play=document.createElement('a');play.className='button primary';play.target='_blank';play.rel='noopener noreferrer';
  const actions=document.createElement('div');actions.className='shelf-actions';const note=document.createElement('small');note.textContent='Opens the game in a new tab.';actions.append(play,note);detail.append(summary,actions);shelf.append(label,rack,detail);
  const narrow=matchMedia('(max-width:600px)');let selected=0;
  function select(index){selected=index;const game=games[index];if(narrow.matches)rack.children[index].append(detail);else shelf.append(detail);rack.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));category.textContent=game.category||'FROM THE COLLECTION';title.textContent=game.title;edition.textContent=game.edition||'';copy.textContent=game.description||'';play.href=safe(game.url);play.textContent='Play '+game.title+' ↗';}
  games.forEach((game,index)=>{const slot=document.createElement('div');slot.className='game-slot';const box=document.createElement('button');box.type='button';box.className='game-box';box.setAttribute('aria-label','Select '+game.title);box.setAttribute('aria-controls','shelf-detail');box.setAttribute('aria-pressed','false');
    if(/^#[0-9a-f]{6}$/i.test(game.color||''))box.style.setProperty('--box-color',game.color);
    const spine=document.createElement('span');spine.className='box-spine';spine.setAttribute('aria-hidden','true');spine.textContent=String(index+1).padStart(2,'0')+' / ZW';
    const cover=document.createElement('span');cover.className='box-cover';const number=document.createElement('span');number.className='box-number';number.textContent='COLLECTION / '+String(index+1).padStart(2,'0');const mark=document.createElement('span');mark.className='box-mark';mark.setAttribute('aria-hidden','true');mark.textContent=game.mark||'◇';const name=document.createElement('strong');name.textContent=game.title;const sub=document.createElement('span');sub.className='box-edition';sub.textContent=game.edition||'';const foot=document.createElement('span');foot.className='box-foot';foot.textContent='SELECT TO EXPLORE';cover.append(number,mark,name,sub,foot);box.append(spine,cover);box.addEventListener('click',()=>select(index));slot.append(box);rack.append(slot);
  });select(0);narrow.addEventListener('change',()=>select(selected));
})();
