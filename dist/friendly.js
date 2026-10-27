(() => {
  'use strict';
  const motion=window.portfolioMotion;
  // Optional, keyboard-accessible tour. No automatic start or timed advancement.
  const tour=document.createElement('dialog');tour.id='byte-tour';tour.setAttribute('aria-labelledby','tour-title');
  tour.innerHTML='<button class="close-dialog" aria-label="Skip or close tour">×</button><div class="tour-mark" aria-hidden="true">[ ◉ ◉ ]</div><div class="tour-step"></div><div aria-live="polite"><h2 id="tour-title"></h2><p class="tour-copy"></p></div><a class="text-link tour-visit"></a><div class="tour-actions"><button class="tour-back">Back</button><button class="tour-skip">Skip tour</button><button class="tour-next">Next →</button></div>';
  document.body.append(tour);
  const stops=[['The person behind the pixels.','I’m Byte. Ziwei is a Data Science student who enjoys football, photography, and turning curious questions into useful tools. Let’s meet the person behind the projects.','about','Meet Ziwei'],['Try something, learn something.','Try closing a passing lane in Ripple, explore an interview workflow in RecruitView, or find your next meal with Makan Mana. Each project has a small invitation to try it yourself.','projects','Explore projects'],['A different way of seeing.','Photography is where the screen makes room for everyday life. The collection is being prepared. When photos and notes arrive, flip a frame to discover its story.','photography','Explore photography']];
  let step=0,returnTo=null,reopenRobot=false;
  function paint(){const [title,copy,page,label]=stops[step];tour.querySelector('.tour-step').textContent=`BYTE’S TOUR / ${step+1} OF 3`;tour.querySelector('h2').textContent=title;tour.querySelector('.tour-copy').textContent=copy;const link=tour.querySelector('.tour-visit');link.href='#'+page;link.textContent=label+' ↗';tour.querySelector('.tour-back').disabled=step===0;tour.querySelector('.tour-next').textContent=step===2?'Finish ✓':'Next →';}
  function launch(e){returnTo=e.currentTarget;const robot=document.querySelector('#curiosity-dialog');reopenRobot=robot.open;if(reopenRobot)robot.close();step=0;paint();tour.showModal();}
  for(const parent of [document.querySelector('.robot-dialog-content .curiosity-intro'),document.querySelector('.robot-slot .button')]){const button=document.createElement('button');button.className='text-link byte-tour-launch';button.textContent='Explore with Byte · 3 stops ↗';button.setAttribute('aria-haspopup','dialog');parent.after(button);button.addEventListener('click',launch);}
  tour.querySelector('.tour-back').addEventListener('click',()=>{step=Math.max(0,step-1);paint();});
  tour.querySelector('.tour-next').addEventListener('click',()=>{if(step===2)tour.close();else{step++;paint();}});
  tour.querySelector('.tour-skip').addEventListener('click',()=>tour.close());tour.querySelector('.close-dialog').addEventListener('click',()=>tour.close());
  tour.querySelector('.tour-visit').addEventListener('click',()=>{reopenRobot=false;tour.close();});
  tour.addEventListener('close',()=>{if(reopenRobot){document.querySelector('#curiosity-dialog').showModal();returnTo?.focus({preventScroll:true});}else if(returnTo?.isConnected&&!returnTo.closest('dialog'))returnTo.focus({preventScroll:true});});

  // The existing viewer remains responsible for selection, captions, and arrows.
  const lightbox=document.querySelector('#photo-lightbox'),stage=lightbox.querySelector('.lightbox-stage'),image=stage.querySelector('img');
  const controls=document.createElement('div');controls.className='photo-zoom-controls';controls.innerHTML='<button aria-label="Zoom out photograph">−</button><output aria-label="Photograph zoom">100%</output><button aria-label="Zoom in photograph">+</button><button class="zoom-reset">Reset view</button>';
  stage.after(controls);const hint=document.createElement('p');hint.className='photo-touch-hint';hint.textContent='Swipe to change photos · pinch or use + / − to zoom · drag to pan';controls.after(hint);
  const minus=controls.querySelector('button'),plus=controls.querySelectorAll('button')[1],output=controls.querySelector('output');
  let scale=1,x=0,y=0,frame=0,gesture=null,pinched=false;const pointers=new Map();
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function draw(){frame=0;const maxX=Math.max(0,(image.clientWidth*scale-stage.clientWidth)/2),maxY=Math.max(0,(image.clientHeight*scale-stage.clientHeight)/2);x=clamp(x,-maxX,maxX);y=clamp(y,-maxY,maxY);image.style.scale=String(scale);image.style.translate=`${x}px ${y}px`;output.textContent=Math.round(scale*100)+'%';minus.disabled=scale<=1;plus.disabled=scale>=4;}
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  function reset(){cancelAnimationFrame(frame);frame=0;scale=1;x=y=0;pointers.clear();gesture=null;pinched=false;draw();}
  function zoom(value){scale=clamp(value,1,4);draw();}
  minus.addEventListener('click',()=>zoom(scale-.5));plus.addEventListener('click',()=>zoom(scale+.5));controls.querySelector('.zoom-reset').addEventListener('click',reset);
  function start(){const pts=[...pointers.values()];if(pts.length>=2){pinched=true;const r=stage.getBoundingClientRect(),mx=(pts[0].x+pts[1].x)/2-r.left-r.width/2,my=(pts[0].y+pts[1].y)/2-r.top-r.height/2;gesture={distance:Math.max(1,Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)),scale,anchorX:(mx-x)/scale,anchorY:(my-y)/scale};}else if(pts.length)gesture={startX:pts[0].x,startY:pts[0].y,x,y};}
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;image.getAnimations().forEach(a=>a.cancel());pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);start();});
  stage.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...pointers.values()];if(pts.length>=2){const r=stage.getBoundingClientRect();scale=clamp(gesture.scale*Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)/gesture.distance,1,4);x=(pts[0].x+pts[1].x)/2-r.left-r.width/2-gesture.anchorX*scale;y=(pts[0].y+pts[1].y)/2-r.top-r.height/2-gesture.anchorY*scale;}else if(scale>1){x=gesture.x+e.clientX-gesture.startX;y=gesture.y+e.clientY-gesture.startY;}schedule();});
  stage.addEventListener('pointerup',e=>{if(!pointers.has(e.pointerId))return;const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;const swipe=!pinched&&scale===1&&Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5;pointers.delete(e.pointerId);if(swipe)lightbox.querySelector(dx<0?'.lightbox-next':'.lightbox-prev').click();if(pointers.size)start();else{gesture=null;pinched=false;}});
  stage.addEventListener('pointercancel',()=>{pointers.clear();gesture=null;pinched=false;});
  stage.addEventListener('dblclick',()=>zoom(scale===1?2:1));
  lightbox.addEventListener('photo:change',reset);lightbox.addEventListener('close',reset);image.addEventListener('load',draw);
  addEventListener('resize',()=>{if(lightbox.open)reset();},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});reset();

  // Horizontal touch swipes in the featured gallery preserve vertical scrolling.
  const gallery=document.querySelector('#photo-gallery');let swipeStart=null,suppressClick=false;
  gallery.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.isPrimary&&e.target.closest('.gallery-feature'))swipeStart={x:e.clientX,y:e.clientY,id:e.pointerId};});
  gallery.addEventListener('pointerup',e=>{if(!swipeStart||e.pointerId!==swipeStart.id)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){suppressClick=true;gallery.querySelector(dx<0?'.gallery-next':'.gallery-prev').click();setTimeout(()=>suppressClick=false,350);}});
  gallery.addEventListener('pointercancel',()=>swipeStart=null);
  gallery.addEventListener('click',e=>{if(suppressClick&&e.isTrusted){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
})();
