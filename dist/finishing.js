(() => {
  const trigger=document.querySelector('.curiosity-trigger');
  trigger.setAttribute('aria-label','Meet Byte — drag and play');
  trigger.querySelector('.curiosity-hint').textContent='MEET BYTE · DRAG & PLAY';
  let seen=false;try{seen=localStorage.getItem('portfolio-byte-discovered')==='true';}catch{}
  if(!seen){const hint=document.createElement('span');hint.className='byte-first-hint';hint.textContent='A little companion. Tap to meet.';hint.setAttribute('aria-hidden','true');trigger.append(hint);trigger.addEventListener('click',()=>{hint.remove();try{localStorage.setItem('portfolio-byte-discovered','true');}catch{}},{once:true});}
  const ids=['home','about','projects','photography','contact'],labels=['Home','About','Projects','Photos','Contact'];
  let visited=new Set();try{const saved=JSON.parse(localStorage.getItem('portfolio-passport'));if(Array.isArray(saved))visited=new Set(saved.filter(id=>ids.includes(id)));}catch{}
  const passport=document.createElement('details');passport.className='byte-passport';passport.innerHTML='<summary>Discovery passport <span></span></summary><p>Five chapters, five little discoveries. Progress stays on this device.</p><div class="passport-stamps"></div><p class="passport-status" role="status"></p><button class="passport-celebrate" disabled>Celebrate with Byte ✦</button><button class="passport-reset">Reset stamps</button>';
  document.querySelector('.robot-dialog-content').append(passport);
  function draw(){passport.querySelector('summary span').textContent=`${visited.size} / 5`;const stamps=passport.querySelector('.passport-stamps');stamps.replaceChildren();ids.forEach((id,i)=>{const a=document.createElement('a');a.href='#'+id;a.className=visited.has(id)?'stamped':'';a.textContent=(visited.has(id)?'✓ ':'○ ')+labels[i];a.setAttribute('aria-label',labels[i]+(visited.has(id)?' — visited':' — not visited'));a.addEventListener('click',()=>document.querySelector('#curiosity-dialog').close());stamps.append(a);});passport.querySelector('.passport-celebrate').disabled=visited.size!==5;passport.querySelector('.passport-status').textContent=visited.size===5?'All five discovered. Your celebration is unlocked.':'Visit each chapter to collect its stamp.';try{localStorage.setItem('portfolio-passport',JSON.stringify([...visited]));}catch{}}
  function stamp(){const id=document.querySelector('.page.active')?.id;if(ids.includes(id))visited.add(id);draw();}
  document.addEventListener('portfolio:pagechange',stamp);stamp();
  passport.querySelector('.passport-celebrate').addEventListener('click',()=>{document.querySelector('#robot-dance').click();document.querySelector('.robot-stage').scrollIntoView({block:'center',behavior:window.portfolioMotion.matches?'instant':'smooth'});});
  passport.querySelector('.passport-reset').addEventListener('click',()=>{visited.clear();stamp();});
})();
