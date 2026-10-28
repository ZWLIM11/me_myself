(()=>{
const steam=document.querySelector('.steam-profile');steam.className='steam-profile';steam.innerHTML='<span aria-hidden="true">◉</span>Steam<span aria-hidden="true">↗</span>';document.querySelector('.contact-links').append(steam);
const shelf=document.querySelector('.study-shelves'),cards=[...shelf.querySelectorAll('.reading-book')];
const controls=document.createElement('div');controls.className='library-controls';controls.innerHTML='<label for="book-search">Find a book or author</label><input id="book-search" type="search" placeholder="Try Sherlock Holmes or Jane Austen"><p role="status"></p>';
shelf.before(controls);const more=document.createElement('button');more.className='button primary library-more';more.textContent='Show more books';shelf.after(more);let limit=12;
function render(){const q=controls.querySelector('input').value.trim().toLowerCase();const matches=cards.filter(c=>c.textContent.toLowerCase().includes(q));cards.forEach(c=>c.hidden=true);matches.slice(0,limit).forEach(c=>c.hidden=false);controls.querySelector('[role=status]').textContent=matches.length?`Showing ${Math.min(limit,matches.length)} of ${matches.length} books`:'No books found. Try another title or author.';more.hidden=limit>=matches.length;}
controls.querySelector('input').addEventListener('input',()=>{limit=12;render();});more.onclick=()=>{limit+=12;render();};render();
// Ensure long descriptions can be dismissed with a pointer or keyboard.
const dialog=document.querySelector('.reading-summary');dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});document.addEventListener('portfolio:pagechange',()=>{if(dialog.open)dialog.close();});
})();
