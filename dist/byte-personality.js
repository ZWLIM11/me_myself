(() => {
  'use strict';
  const dialog=document.querySelector('#curiosity-dialog');
  const stage=dialog.querySelector('.robot-stage'),figure=dialog.querySelector('.robot-object');
  const eyes=dialog.querySelector('.bot-eyes'),motion=window.portfolioMotion;
  const prop=document.createElement('div');prop.className='byte-prop';prop.setAttribute('aria-hidden','true');figure.append(prop);
  const caption=document.createElement('p');caption.className='byte-role';caption.setAttribute('role','status');stage.after(caption);
  const blinkButton=document.createElement('button');blinkButton.className='text-link';blinkButton.textContent='Make Byte blink';blinkButton.type='button';dialog.querySelector('.robot-tools').append(blinkButton);
  dialog.querySelector('#robot-help').textContent='Drag to rotate · tap the face to blink · arrow keys to turn';
  const costumes={
    home:['Your curious companion','<span class="byte-spark">✦</span>'],
    about:['Learning something new','<span class="byte-book"><i></i><i></i></span>'],
    projects:['Ready to build','<span class="byte-terminal"><b>● ● ●</b><i>&lt;/&gt;_</i></span>'],
    photography:['Looking for a good frame','<span class="byte-camera"><i></i><b></b></span>'],
    contact:['Hello! Let’s connect.','<span class="byte-envelope">↗</span>']
  };
  let eyeFrame=0,point=null,tap=null,blinkAnimation=null,waveAnimation=null;
  function resetEyes(){cancelAnimationFrame(eyeFrame);eyeFrame=0;point=null;eyes.style.translate='0 0';}
  function cancel(){resetEyes();tap=null;blinkAnimation?.cancel();waveAnimation?.cancel();}
  function wave(){waveAnimation?.cancel();if(motion.matches||!dialog.open)return;waveAnimation=dialog.querySelector('.arm-right').animate([{rotate:'0deg'},{rotate:'-110deg'},{rotate:'-75deg'},{rotate:'-110deg'},{rotate:'0deg'}],{duration:850,easing:'ease-in-out'});}
  function choose(id){const [label,markup]=costumes[id]||costumes.home;dialog.dataset.bytePage=id;prop.innerHTML=markup;caption.textContent=label;waveAnimation?.cancel();if(id==='contact')wave();}
  function blink(){if(!dialog.open)return;blinkAnimation?.cancel();caption.textContent=dialog.classList.contains('is-charged')?'A happy blink. Thanks for the energy!':'Blink! You have my attention.';if(!motion.matches)blinkAnimation=eyes.animate([{scale:'1 1'},{scale:'1 .12',offset:.35},{scale:'1 1',offset:.65},{scale:'1 1'}],{duration:340,easing:'ease-in-out'});}
  function look(){eyeFrame=0;if(!point||motion.matches||!dialog.open||document.hidden||stage.classList.contains('dragging'))return;const r=stage.getBoundingClientRect();const dx=Math.max(-1,Math.min(1,(point.x-r.left)/r.width*2-1));const dy=Math.max(-1,Math.min(1,(point.y-r.top)/r.height*2-1));eyes.style.translate=`${dx*5}px ${dy*3}px`;}
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||motion.matches||stage.classList.contains('dragging'))return;point={x:e.clientX,y:e.clientY};if(!eyeFrame)eyeFrame=requestAnimationFrame(look);},{passive:true});
  stage.addEventListener('pointerleave',resetEyes);
  stage.addEventListener('pointerdown',e=>{resetEyes();tap=e.button===0&&e.target.closest('.bot-head')?{id:e.pointerId,x:e.clientX,y:e.clientY}:null;});
  stage.addEventListener('pointerup',e=>{if(tap&&tap.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<7)blink();tap=null;});
  stage.addEventListener('pointercancel',()=>{tap=null;});
  blinkButton.addEventListener('click',blink);
  dialog.addEventListener('byte:page',e=>choose(e.detail));
  dialog.querySelector('#robot-wave').addEventListener('click',()=>{caption.textContent='Hello, curious human!';});
  dialog.querySelector('#robot-reset').addEventListener('click',()=>{cancel();choose(dialog.dataset.bytePage);});
  dialog.addEventListener('close',cancel);
  motion.addEventListener('change',()=>{if(motion.matches)cancel();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  addEventListener('resize',resetEyes,{passive:true});
  choose(dialog.querySelector('[data-robot-page][aria-pressed="true"]').dataset.robotPage);
})();
