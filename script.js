(function(){
  const grid = document.getElementById('galleryGrid');

  function addImage(src, alt){
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt||'Event photo';
    img.loading = 'lazy';
    img.addEventListener('click', ()=> openLightbox(src));
    grid.appendChild(img);
  }

  function openLightbox(src){
    const overlay = document.createElement('div');
    overlay.style.position='fixed';overlay.style.inset=0;overlay.style.background='rgba(0,0,0,0.85)';overlay.style.display='flex';overlay.style.alignItems='center';overlay.style.justifyContent='center';overlay.style.zIndex=9999;
    const img = document.createElement('img');
    img.src=src; img.style.maxWidth='90%'; img.style.maxHeight='90%'; img.style.borderRadius='8px'; overlay.appendChild(img);
    overlay.addEventListener('click', ()=> document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  }

  // Try to fetch list.txt which can contain explicit filenames (one per line)
  fetch('images/gallery/list.txt').then(r=> {
    if(!r.ok) throw new Error('no list');
    return r.text();
  }).then(txt=>{
    const names = txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    names.forEach(n=> addImage('images/gallery/'+n, n));
  }).catch(()=>{
    // fallback: try gallery1..gallery20 with jpg/png
    const exts = ['jpg','jpeg','png','webp'];
    const max = 20;
    for(let i=1;i<=max;i++){
      exts.forEach(ext=>{
        const path = `images/gallery/gallery${i}.${ext}`;
        // test image by creating Image and onload/onerror
        const tester = new Image();
        tester.onload = ()=> addImage(path, `gallery${i}.${ext}`);
        tester.onerror = ()=> {};
        tester.src = path;
      });
    }
  });

})();