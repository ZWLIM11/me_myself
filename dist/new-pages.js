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
  shelf.className='games-grid';
  games.forEach(game=>{const card=document.createElement('article');card.className='game-card';const title=document.createElement('h2'),copy=document.createElement('p'),players=document.createElement('small'),play=document.createElement('a');title.textContent=game.title;copy.textContent=game.description||'';players.textContent=game.players||'';play.textContent='Play game ↗';play.href=safe(game.url);play.target='_blank';play.rel='noopener noreferrer';play.className='button primary';card.append(players,title,copy,play);if(safe(game.rulesUrl)){const rules=document.createElement('a');rules.href=safe(game.rulesUrl);rules.textContent='Read the rules ↗';rules.target='_blank';rules.rel='noopener noreferrer';rules.className='text-link';card.append(rules);}shelf.append(card);});
})();
