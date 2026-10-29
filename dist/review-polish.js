(()=>{
 const header=document.querySelector('.header,.case-header');
 function scrolled(){header?.classList.toggle('has-scrolled',scrollY>24);}addEventListener('scroll',scrolled,{passive:true});scrolled();
 // Mobile chat belongs with the header controls, never over page content.
 const launcher=document.querySelector('.byte-context-launch'),footer=document.querySelector('.chapter-controls'),utilities=document.querySelector('.header-utilities');
 if(launcher&&footer){const mobile=matchMedia('(max-width:700px)');function place(){const destination=mobile.matches?document.querySelector('.header-utilities'):footer;if(destination)destination.append(launcher);}mobile.addEventListener('change',place);place();if(!utilities)document.addEventListener('DOMContentLoaded',place);}
 const shelf=document.querySelector('.study-shelves');
 if(shelf){
  const switcher=document.createElement('div');switcher.className='library-view';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Library layout');
  for(const [value,label] of [['shelf','Bookshelf'],['compact','Compact list']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.view=value;b.onclick=()=>setView(value);switcher.append(b);}
  shelf.before(switcher);function setView(value){shelf.classList.toggle('compact-books',value==='compact');switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===value)));try{localStorage.setItem('library-view',value);}catch{}}
  let value='shelf';try{value=localStorage.getItem('library-view')||value;}catch{}setView(value);
 }
 // The chooser is a table within the room, with the furniture framing it.
 const doors=document.querySelector('.room-doors'),furniture=document.querySelector('.lobby-furniture'),chooser=document.querySelector('.game-chooser');
 if(doors&&furniture&&chooser){const room=document.createElement('div');room.className='living-room-scene';doors.before(room);room.append(doors,furniture,chooser);chooser.querySelector('.eyebrow').textContent='AT THE COFFEE TABLE · PICK A GAME';}
})();
