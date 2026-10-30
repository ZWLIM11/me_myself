/* Apply the approved room concept without replacing collection or router logic. */
(()=>{
 const hub=document.getElementById('living-room');if(!hub)return;
 const scene=hub.querySelector('.living-room-scene');if(!scene)return;
 const paths=[
  '<path d="M40 20Q24 10 8 18v45q16-8 32 2 16-10 32-2V18q-16-8-32 2v45M18 30l14 3M48 33l14-3"/>',
  '<rect x="15" y="15" width="50" height="50" rx="9"/><circle cx="28" cy="28" r="3"/><circle cx="52" cy="28" r="3"/><circle cx="40" cy="40" r="3"/><circle cx="28" cy="52" r="3"/><circle cx="52" cy="52" r="3"/>',
  '<rect x="10" y="13" width="60" height="43" rx="3"/><path d="M40 56v12M25 68h30M29 27l-8 8 8 8M51 27l8 8-8 8"/>'
 ];
 hub.querySelectorAll('.room-doors>a').forEach((door,i)=>{
  const icon=door.querySelector('b');if(icon)icon.innerHTML='<svg aria-hidden="true" viewBox="0 0 80 80">'+paths[i]+'</svg>';
 });
 const furniture=scene.querySelector('.lobby-furniture');
 if(furniture){const bench=document.createElement('div');bench.className='room-bench';bench.setAttribute('aria-hidden','true');furniture.append(bench);}
 // Collections remain available below the entrance rather than pushing the doors away.
 const picks=hub.querySelector('.my-picks'),news=hub.querySelector('.whats-new');
 if(picks)scene.after(picks);if(news)(picks||scene).after(news);
})();
