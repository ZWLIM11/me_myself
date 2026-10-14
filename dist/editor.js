(() => {
  const $=selector=>document.querySelector(selector),form=$('#photo-form'),dialog=$('#edit-dialog');
  let token='',photos=[],editing=null,previewURL='',busy=false;
  async function api(path='',options={}){
    let response;try{response=await fetch('/api/photography'+path,{...options,headers:{Authorization:`Bearer ${token}`,...options.headers},cache:'no-store'});}catch{throw Error('Connection failed. Your edits are still here; please try again.');}
    const result=await response.json().catch(()=>({error:'The photo API is not deployed yet. Complete the Cloudflare setup in PHOTOGRAPHY-SETUP.md.'}));
    if(!response.ok)throw Error(result.error||'Could not complete this request.');return result;
  }
  function render(){
    const library=$('#library');library.replaceChildren();
    if(!photos.length){const p=document.createElement('p');p.textContent='Your collection starts here. Add your first photograph.';library.append(p);}
    photos.forEach(photo=>{
      const card=document.createElement('article');card.className='library-card';
      if(photo.published){const img=document.createElement('img');img.src=photo.src;img.alt=photo.alt;img.loading='lazy';card.append(img);}else{const slot=document.createElement('div');slot.className='hidden-photo';slot.textContent='Hidden from portfolio';card.append(slot);}
      const title=document.createElement('h3');title.textContent=photo.title;const caption=document.createElement('p');caption.textContent=`${photo.category} · ${photo.published?'Published':'Hidden'}`;
      const edit=document.createElement('button');edit.textContent='Edit photograph ↗';edit.setAttribute('aria-label',`Edit ${photo.title}`);edit.addEventListener('click',()=>open(photo));card.append(title,caption,edit);library.append(card);
    });
  }
  async function load(){photos=(await api('/manage')).photos;render();}
  $('#unlock').addEventListener('submit',async event=>{
    event.preventDefault();const button=$('#unlock button');button.disabled=true;token=$('#key').value;$('#status').textContent='Connecting to your collection…';
    try{await load();$('#unlock').hidden=true;$('#studio').hidden=false;$('#lock').hidden=false;$('#key').value='';$('#status').textContent='Connected. Published photos appear in the gallery for everyone.';}
    catch(error){token='';$('#status').textContent=error.message;}finally{button.disabled=false;}
  });
  $('#lock').addEventListener('click',()=>{token='';photos=[];$('#library').replaceChildren();$('#studio').hidden=true;$('#lock').hidden=true;$('#unlock').hidden=false;$('#status').textContent='Editor locked.';});
  function clearPreview(){if(previewURL){URL.revokeObjectURL(previewURL);previewURL='';}$('#preview').removeAttribute('src');$('#preview').hidden=true;}
  function open(photo=null){
    editing=photo;form.reset();clearPreview();$('#form-status').textContent='';$('#file-label').hidden=!!photo;$('#file').required=!photo;
    $('#edit-title').textContent=photo?'Edit photograph':'Add photograph';$('.save').textContent=photo?'Save changes ↗':'Publish photograph ↗';
    if(photo){['title','category','location','alt','caption'].forEach(key=>form.elements[key].value=photo[key]||'');form.elements.published.checked=photo.published;if(photo.published){$('#preview').src=photo.src;$('#preview').hidden=false;}}
    dialog.showModal();
  }
  $('#new-photo').addEventListener('click',()=>open());$('#cancel').addEventListener('click',()=>{if(!busy)dialog.close();});
  dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});dialog.addEventListener('close',clearPreview);
  $('#file').addEventListener('change',()=>{
    clearPreview();const file=$('#file').files[0];if(!file)return;
    if(file.size>10*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type)){$('#form-status').textContent='Choose a JPG, PNG or WebP image smaller than 10 MB.';$('#file').value='';return;}
    previewURL=URL.createObjectURL(file);$('#preview').src=previewURL;$('#preview').hidden=false;$('#form-status').textContent='Ready to upload. Add a title and image description.';
    if(!form.elements.title.value)form.elements.title.value=file.name.replace(/\.[^.]+$/,'').slice(0,80);
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;busy=true;$('.save').disabled=true;$('#cancel').disabled=true;
    const details=Object.fromEntries(['title','category','location','alt','caption'].map(key=>[key,form.elements[key].value]));details.published=form.elements.published.checked;
    $('#form-status').textContent=editing?'Saving changes…':'Uploading photograph…';
    try{
      let result;
      if(editing){details.etag=editing.etag;result=await api('/'+editing.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(details)});}
      else{const body=new FormData();body.append('photo',$('#file').files[0]);body.append('details',JSON.stringify(details));result=await api('',{method:'POST',body});}
      const i=photos.findIndex(p=>p.id===result.photo.id);if(i<0)photos.unshift(result.photo);else photos[i]=result.photo;
      render();dialog.close();$('#status').textContent=details.published?'Saved. Your photograph is now visible on the portfolio.':'Saved. This photograph is hidden from the portfolio.';
    }catch(error){$('#form-status').textContent=error.message;}finally{busy=false;$('.save').disabled=false;$('#cancel').disabled=false;}
  });
  addEventListener('beforeunload',event=>{if(dialog.open){event.preventDefault();event.returnValue='';}});
})();
