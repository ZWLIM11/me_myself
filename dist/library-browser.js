(()=>{
const steam=document.querySelector('.steam-profile');steam.className='steam-profile';steam.innerHTML='<span aria-hidden="true">◉</span>Steam<span aria-hidden="true">↗</span>';document.querySelector('.contact-links').append(steam);
const shelf=document.querySelector('.study-shelves'),cards=[...shelf.querySelectorAll('.reading-book')];
const controls=document.createElement('div');controls.className='library-controls';controls.innerHTML='<label for="book-search">Find a book or author</label><input id="book-search" type="search" placeholder="Try Sherlock Holmes or Jane Austen"><p role="status"></p>';
shelf.before(controls);
const select=document.createElement('select');select.id='book-category';select.setAttribute('aria-label','Book category');for(const text of ['All books','Novels','Short stories','Series guide','Companion books','Screenplays']){const o=document.createElement('option');o.textContent=text;select.append(o);}controls.querySelector('input').after(select);
function category(c){const t=c.querySelector('strong').textContent;if(/screenplay/i.test(t))return 'Screenplays';if(/Companion Book|Quidditch|Beedle/.test(t))return 'Companion books';if(t==='The Five Find-Outers and Dog')return 'Series guide';if(/Adventures of Sherlock|Memoirs of Sherlock|Return of Sherlock|Jungle Book/.test(t))return 'Short stories';return 'Novels';}
function render(){const q=controls.querySelector('input').value.trim().toLowerCase();let count=0;cards.forEach(c=>{const show=c.textContent.toLowerCase().includes(q)&&(select.value==='All books'||category(c)===select.value);c.hidden=!show;if(show)count++;});controls.querySelector('[role=status]').textContent=count?`${count} of ${cards.length} books`:'No books found. Try another title or category.';}
controls.querySelector('input').addEventListener('input',render);select.addEventListener('change',render);render();
// Ensure long descriptions can be dismissed with a pointer or keyboard.
const dialog=document.querySelector('.reading-summary');dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});document.addEventListener('portfolio:pagechange',()=>{if(dialog.open)dialog.close();});
})();
