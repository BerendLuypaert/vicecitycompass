(() => {
  const groups = [
    ['early', 'EARLY STORY MISSIONS', "Missions believed to take place near the beginning of Jason and Lucia's story."],
    ['story-unknown', 'STORY MISSIONS — ORDER UNKNOWN', 'Story sequences and possible missions revealed so far. Their chronological order has not been confirmed.'],
    ['activities', 'OPEN-WORLD ACTIVITIES', 'Optional criminal activities and encounters across Leonida.'],
    ['special', 'SPECIAL EDITION CONTENT', 'Additional activities associated with special editions of Grand Theft Auto VI.']
  ];
  const root = document.querySelector('#mission-groups');
  const search = document.querySelector('#mission-search');
  const filter = document.querySelector('#mission-filter');
  let missions = [];
  const esc = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const card = mission => `<article class="mission-card"><div class="mission-media"><img loading="lazy" src="${esc(mission.image)}" alt="${esc(mission.imageAlt)}"><span class="mission-image-label">${esc(mission.imageStatus)}</span></div><div class="mission-card-body"><span class="mission-category">${esc(mission.category)}</span><h3>${esc(mission.title)}</h3><p>${esc(mission.description)}</p><div class="mission-meta"><span><b>Story timing</b>${esc(mission.timing)}</span><span><b>Status</b>${esc(mission.verification)}</span></div><p class="mission-source">Source: <a href="${esc(mission.source)}" target="_blank" rel="noreferrer">Rockstar Games media</a></p></div></article>`;
  const matchesFilter = mission => {
    if (filter.value === 'all') return true;
    if (filter.value === 'story') return mission.group === 'early' || mission.group === 'story-unknown';
    if (filter.value === 'activity') return mission.group === 'activities';
    return mission.group === 'special';
  };
  function render() {
    const query = search.value.trim().toLowerCase();
    root.innerHTML = groups.map(([id, title, subtitle], index) => {
      const items = missions.filter(mission => mission.group === id && matchesFilter(mission) && (!query || `${mission.title} ${mission.category} ${mission.description}`.toLowerCase().includes(query)));
      if (!items.length) return '';
      return `<section class="mission-group"><div class="mission-group-heading"><p class="eyebrow">0${index + 1}</p><h2>${title}</h2><p>${subtitle}</p></div><div class="mission-grid">${items.map(card).join('')}</div></section>`;
    }).join('') || '<p class="mission-empty">No missions match your search.</p>';
    root.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
      image.parentElement.innerHTML = '<div class="mission-placeholder"><span>IMAGE NOT AVAILABLE</span><strong>VERIFY SOURCE</strong></div>';
    }, {once: true}));
  }
  fetch('missions.json?v=1', {cache: 'no-store'}).then(response => { if (!response.ok) throw new Error('Mission data unavailable'); return response.json(); }).then(data => { missions = data; render(); }).catch(() => { root.innerHTML = '<p class="mission-empty">Mission data could not be loaded. Please refresh the page.</p>'; });
  search.addEventListener('input', render);
  filter.addEventListener('change', render);
})();
