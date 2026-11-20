(function () {
  'use strict';
  const missions = Array.isArray(window.gta6Missions) ? window.gta6Missions : [];
  const root = document.getElementById('mission-groups');
  const search = document.getElementById('mission-search');
  const filter = document.getElementById('mission-filter');
  const chapterNames = {'Chapter 1':'JUST LIKE PARADISE','Chapter 2':'PARADISE LOST','Chapter 3':'TITS, ASS, DRUG MONEY','Chapter 4':'VICE CITY, BABY','Chapter 5':'TOP OF THE WORLD, MA'};
  const esc = value => String(value || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const card = mission => `<article class="mission-card"><a class="mission-card-link" href="mission.html?id=${encodeURIComponent(mission.id)}"><div class="mission-media"><img loading="lazy" src="${esc(mission.image)}" alt="${esc(mission.imageAlt)}"><span class="mission-image-label">${esc(mission.imageStatus)}</span><span class="mission-number">${String(mission.number).padStart(2,'0')}</span></div><div class="mission-card-body"><span class="mission-category">${esc(mission.chapter)} · MAIN STORY</span><h3>${esc(mission.title)}</h3><p>${esc(mission.description)}</p><div class="mission-meta"><span><b>Location</b>${esc(mission.location)}</span><span><b>Status</b>Main story list</span></div><span class="mission-open">Open walkthrough <span class="inline-arrow" aria-hidden="true"></span></span></div></a></article>`;
  function render() {
    const query = (search.value || '').trim().toLowerCase();
    const selected = filter.value;
    const filtered = missions.filter(m => (selected === 'all' || m.chapter === selected) && (!query || [m.title,m.description,m.tips,m.location,m.chapterTitle].join(' ').toLowerCase().includes(query)));
    document.getElementById('mission-count').textContent = `Showing ${filtered.length} of ${missions.length} main story missions.`;
    root.innerHTML = ['Chapter 1','Chapter 2','Chapter 3','Chapter 4','Chapter 5'].map(chapter => { const items = filtered.filter(m => m.chapter === chapter); if (!items.length) return ''; return `<section class="mission-group"><div class="mission-group-heading"><p class="eyebrow">${chapter.slice(-1).padStart(2,'0')}</p><div><h2>${chapterNames[chapter]}</h2><p>${items.length} of ${missions.filter(m=>m.chapter===chapter).length} main story missions · ${esc(items[0].location)}</p></div></div><div class="mission-grid">${items.map(card).join('')}</div></section>`; }).join('') || '<p class="mission-empty">No main story missions match your search.</p>';
  }
  search.addEventListener('input', render); filter.addEventListener('change', render); render();
}());
