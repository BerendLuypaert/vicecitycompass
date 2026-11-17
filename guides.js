(() => {
  const grid=document.querySelector('#guide-grid'); if(!grid)return;
  const esc=v=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const search=document.querySelector('#guide-search'),filter=document.querySelector('#guide-filter'); let guides=[];
  const card=g=>`<article class="guide-card"><div class="guide-placeholder ${esc(g.placeholderClass)}"><span>VICECITYCOMPASS GUIDE</span><strong>${esc(g.placeholder)}</strong><small>Illustrative placeholder</small></div><div class="guide-card-body"><span class="guide-badge">${esc(g.badge)}</span><h2>${esc(g.title)}</h2><p>${esc(g.description)}</p><a class="guide-read" href="guides/${esc(g.slug)}.html">Read Guide <span>↗</span></a></div></article>`;
  function render(){const q=search.value.trim().toLowerCase(),cat=filter.value;const items=guides.filter(g=>(cat==='all'||g.category===cat)&&(!q||`${g.title} ${g.description} ${g.badge}`.toLowerCase().includes(q)));grid.innerHTML=items.length?items.map(card).join(''):'<p class="guides-empty">No guides match your search.</p>';}
  fetch('guides-data.json?v=1',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{guides=data;render()}).catch(()=>{grid.innerHTML='<p class="guides-empty">The guide library could not be loaded. Please refresh the page.</p>'});search.addEventListener('input',render);filter.addEventListener('change',render);
})();
