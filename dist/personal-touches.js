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
  const log=dialog.querySelector('.byte-messages'),input=dialog.querySelector('input');let opener=null;
  function message(text,who,answer){
    const entry=document.createElement('div');entry.className='byte-message '+who;
    const label=document.createElement('span');label.textContent=who==='visitor'?'YOU':'BYTE';
    const copy=document.createElement('p');copy.textContent=text;entry.append(label,copy);
    if(answer){const link=document.createElement('a');link.className='text-link';link.href=answer.href;link.textContent=answer.label+' ↗';link.addEventListener('click',()=>dialog.close());entry.append(link);}
    log.append(entry);while(log.children.length>16)log.firstElementChild.remove();entry.scrollIntoView({block:'nearest',behavior:'instant'});
  }
  function greet(){log.replaceChildren();message('Hi, I’m Byte. Tell me what you’re curious about and I’ll help you find it.','byte');}
  function ask(text){const value=text.trim();if(!value)return;message(value,'visitor');const reply=window.getByteReply(value);message(reply.text,'byte',reply);input.value='';}
  dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();ask(input.value);input.focus({preventScroll:true});});
  dialog.querySelectorAll('.byte-prompts button').forEach(button=>button.addEventListener('click',()=>ask(button.textContent)));
  dialog.querySelector('.byte-clear').addEventListener('click',greet);
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(opener?.isConnected&&!opener.closest('dialog'))opener.focus({preventScroll:true});});
  function launch(event){opener=event.currentTarget;document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();if(!log.children.length)greet();dialog.querySelector('.close-dialog').focus({preventScroll:true});}
  for(const parent of [document.querySelector('.home-content .actions'),document.querySelector('.robot-dialog-content .curiosity-intro'),document.querySelector('.robot-slot>div'),document.querySelector('.contact-content')]){
    if(!parent)continue;const button=document.createElement('button');button.type='button';button.className='text-link byte-chat-launch';button.textContent='Ask Byte ↗';button.setAttribute('aria-haspopup','dialog');parent.append(button);button.addEventListener('click',launch);
  }
})();
