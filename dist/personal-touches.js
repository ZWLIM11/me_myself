(() => {
  const data=window.PORTFOLIO;
  if(!data)return;
  const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const extras=window.renderProjectExtras;
  window.renderProjectExtras=project=>{
    const story=project.inspiration,challenge=project.challenge;
    return `${story?`<section class="project-personal"><p class="eyebrow">THE CURIOSITY BEHIND IT</p><p>${escape(story)}</p>${challenge?`<div class="project-challenge"><span>YOUR TURN</span><h3>${escape(challenge)}</h3><p>Try it in the live app using the button above.</p></div>`:''}</section>`:''}${extras?extras(project):''}`;
  };
  const gallery=document.querySelector('#photo-gallery');
  function attachNotes(){
    gallery?.querySelectorAll('.photo-card:not([data-note-ready])').forEach(card=>{
      card.dataset.noteReady='true';
      const photo=data.photography.find(p=>p.id===card.dataset.photo);
      const note=photo?.note||photo?.story||photo?.caption;
      if(!note)return;
      const frame=card.querySelector('.photo-frame');if(!frame)return;
      const front=document.createElement('div');front.className='photo-note-front';
      while(frame.firstChild)front.append(frame.firstChild);
      const back=document.createElement('div');back.className='photo-note-back';
      const label=document.createElement('span');label.textContent='BEHIND THE FRAME';
      const text=document.createElement('p');text.textContent=note;
      back.append(label,text);frame.append(front,back);card.classList.add('has-photo-note');
      const toggle=document.createElement('button');toggle.type='button';toggle.className='text-link photo-note-toggle';toggle.textContent='Read note ↻';toggle.setAttribute('aria-expanded','false');
      back.id='photo-note-'+photo.id;toggle.setAttribute('aria-controls',back.id);
      card.after(toggle);
      toggle.addEventListener('click',()=>{const on=card.classList.toggle('note-open');toggle.setAttribute('aria-expanded',String(on));toggle.textContent=on?'Show photograph ↻':'Read note ↻';});
    });
  }
  if(gallery){new MutationObserver(attachNotes).observe(gallery,{childList:true,subtree:true});attachNotes();}
  const contact=document.querySelector('.contact-content .body-copy');
  if(contact)contact.textContent='Have an idea, an opportunity, or a favourite food spot? I’d love to hear from you.';
  const dialog=document.createElement('dialog');dialog.id='byte-chat';dialog.setAttribute('aria-labelledby','byte-chat-title');
  dialog.innerHTML='<button type="button" class="close-dialog" aria-label="Close Byte chat">×</button><p class="eyebrow">YOUR CURIOUS COMPANION</p><h2 id="byte-chat-title">Ask <em>Byte.</em></h2><p class="byte-chat-disclosure">Local portfolio guide · preset answers, not generative AI. Messages stay in this tab and are not saved or sent.</p><div class="byte-messages" role="log" aria-label="Conversation with Byte" aria-live="polite" aria-relevant="additions"></div><div class="byte-prompts"><button type="button">Show me Ripple</button><button type="button">Meet Ziwei</button><button type="button">How can I contact him?</button></div><form class="byte-chat-form"><label for="byte-question">What would you like to explore?</label><div><input id="byte-question" type="text" maxlength="300" placeholder="Ask about a project or page…" autocomplete="off" required><button class="button primary" type="submit">Ask ↗</button></div></form><button type="button" class="text-link byte-clear">Clear conversation</button>';
  document.body.append(dialog);
  const companion=document.createElement('div');companion.className='byte-chat-companion';
  companion.innerHTML='<div class="byte-chat-figure" aria-hidden="true"><span class="bc-antenna"></span><div class="bc-head"><div class="bc-visor"><i></i><i></i><span class="bc-mouth"></span></div></div><div class="bc-body"><span>&lt;/&gt;</span></div><span class="bc-arm bc-left"></span><span class="bc-arm bc-right"></span><span class="bc-foot bc-left"></span><span class="bc-foot bc-right"></span></div><div><span class="eyebrow">BYTE IS HERE</span><p class="byte-figure-caption">A little curiosity. A helpful companion.</p></div>';
  dialog.querySelector('.byte-chat-disclosure').after(companion);
  const figure=companion.querySelector('.byte-chat-figure');let reactions=[];
  function stopReaction(){reactions.forEach(animation=>animation.cancel());reactions=[];}
  function react(){
    stopReaction();
    if(!dialog.open||document.hidden||window.portfolioMotion?.matches)return;
    const animate=(element,frames,options)=>{const a=element.animate(frames,options);reactions.push(a);};
    animate(figure,[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-4px) rotate(-4deg)'},{transform:'translateY(0) rotate(0)'}],{duration:650,easing:'ease-in-out'});
    animate(figure.querySelector('.bc-right.bc-arm'),[{rotate:'0deg'},{rotate:'-55deg'},{rotate:'-35deg'},{rotate:'0deg'}],{duration:700,easing:'ease-in-out'});
    animate(figure.querySelector('.bc-mouth'),[{scale:'1 1'},{scale:'1 .3'},{scale:'1 1.5'},{scale:'1 1'}],{duration:280,iterations:3});
  }
  dialog.addEventListener('close',stopReaction);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopReaction();});
  window.portfolioMotion?.addEventListener('change',stopReaction);
  const log=dialog.querySelector('.byte-messages'),input=dialog.querySelector('input');let opener=null;
  function message(text,who,answer){
    const entry=document.createElement('div');entry.className='byte-message '+who;
    const label=document.createElement('span');label.textContent=who==='visitor'?'YOU':'BYTE';
    const copy=document.createElement('p');copy.textContent=text;entry.append(label,copy);
    if(answer){const link=document.createElement('a');link.className='text-link';link.href=answer.href;link.textContent=answer.label+' ↗';link.addEventListener('click',()=>dialog.close());entry.append(link);}
    log.append(entry);while(log.children.length>16)log.firstElementChild.remove();entry.scrollIntoView({block:'nearest',behavior:'instant'});
    if(who==='byte')react();
  }
  function greet(){log.replaceChildren();message('Hi, I’m Byte. Tell me what you’re curious about and I’ll help you find it.','byte');}
  function ask(text){const value=text.trim();if(!value)return;message(value,'visitor');const reply=window.getByteReply(value);message(reply.text,'byte',reply);input.value='';}
  dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();ask(input.value);input.focus({preventScroll:true});});
  dialog.querySelector('.byte-prompts').addEventListener('click',event=>{const button=event.target.closest('button');if(button)ask(button.textContent);});
  const pagePrompts={home:['Meet Ziwei','Show me projects','What can I explore?'],about:['What are his skills?','What sports does he enjoy?','Contact Ziwei'],projects:['Show me Ripple','Show me Makan Mana','Show me RecruitView'],photography:['Show me photo stories','Beyond the screen','Contact Ziwei'],beyond:['What sports does he enjoy?','Show me photography','Show me board games'],playground:['Explain clustering','Explain the reaction challenge','Show me board games'],'board-games':['Help me choose a game','Show me chess','Show me Monopoly Deal'],contact:['How can I contact him?','Show me projects','Meet Ziwei']};
  function contextPrompts(){const id=document.querySelector('.page.active')?.id||'home';const host=dialog.querySelector('.byte-prompts');host.replaceChildren();for(const text of pagePrompts[id]||pagePrompts.home){const button=document.createElement('button');button.type='button';button.textContent=text;host.append(button);}}
  document.addEventListener('portfolio:pagechange',contextPrompts);contextPrompts();
  dialog.querySelector('.byte-clear').addEventListener('click',greet);
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(opener?.isConnected&&!opener.closest('dialog'))opener.focus({preventScroll:true});});
  function launch(event){contextPrompts();opener=event.currentTarget;document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();if(!log.children.length)greet();dialog.querySelector('.close-dialog').focus({preventScroll:true});}
  const contextual=document.createElement('button');contextual.type='button';contextual.className='text-link byte-context-launch';contextual.textContent='Ask Byte ↗';contextual.setAttribute('aria-haspopup','dialog');document.querySelector('.chapter-controls').append(contextual);contextual.addEventListener('click',launch);
  for(const parent of [document.querySelector('.home-content .actions'),document.querySelector('.robot-dialog-content .curiosity-intro'),document.querySelector('.robot-slot>div'),document.querySelector('.contact-content')]){
    if(!parent)continue;const button=document.createElement('button');button.type='button';button.className='text-link byte-chat-launch';button.textContent='Ask Byte ↗';button.setAttribute('aria-haspopup','dialog');parent.append(button);button.addEventListener('click',launch);
  }
})();
