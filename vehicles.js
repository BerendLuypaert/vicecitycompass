(() => {
  const grid = document.querySelector('#vehicle-grid');
  const search = document.querySelector('#vehicle-search');
  const category = document.querySelector('#category-filter');
  const verification = document.querySelector('#verification-filter');
  const count = document.querySelector('#vehicle-count');
  let vehicles = [];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const colors = [['#633fd0','#24154d'],['#e86a84','#722244'],['#e8783d','#702c25'],['#1f9690','#12484c'],['#dfad40','#4b2b16'],['#5d78d8','#272f71']];
  const initials = (vehicle) => `${vehicle.manufacturer.slice(0,1)}${vehicle.model.replace(/[^A-Za-z0-9]/g,'').slice(0,2)}`.toUpperCase();

  function populateCategories() {
    [...new Set(vehicles.map((vehicle) => vehicle.category))].sort().forEach((item) => {
      const option = document.createElement('option'); option.value = item; option.textContent = item; category.append(option);
    });
  }

  function card(vehicle, index) {
    const [a,b] = colors[index % colors.length];
    const imageLabel = vehicle.imageOrigin === 'GTA V Reference' ? 'GTA V REFERENCE IMAGE' : vehicle.imageAvailability === 'remote' ? 'GTA 6 reference image' : 'GTA 6 Image';
    const image = vehicle.image ? `<img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.manufacturer + ' ' + vehicle.model)} vehicle reference image" /><span class="vehicle-image-label">${imageLabel}</span>` : `<div class="vehicle-placeholder" style="--placeholder-a:${a};--placeholder-b:${b}"><small>Image Not Yet Available</small><strong>${escapeHtml(initials(vehicle))}</strong></div>`;
    const badgeClass = vehicle.verification === 'Community Identified' ? 'vehicle-badge community' : 'vehicle-badge';
    const origin = vehicle.imageAvailability === 'placeholder' ? 'No verified image is currently available.' : vehicle.imageOrigin === 'GTA V Reference' ? 'GTA V REFERENCE IMAGE — its GTA 6 appearance may differ.' : vehicle.imageAvailability === 'remote' ? 'GTA 6 reference image from the supplied Photo Pack.' : 'GTA 6 Image';
    return `<article class="vehicle-card"><div class="vehicle-card-media">${image}</div><div class="vehicle-card-body"><span class="vehicle-manufacturer">${escapeHtml(vehicle.manufacturer)}</span><div class="vehicle-card-top"><h2>${escapeHtml(vehicle.model)}</h2><span class="vehicle-category">${escapeHtml(vehicle.category)}</span></div><span class="${badgeClass}">${escapeHtml(vehicle.verification)}</span><p class="vehicle-card-description">${escapeHtml(vehicle.description)}</p><p class="vehicle-attribution">${escapeHtml(origin)}<br />Source: <a href="${escapeHtml(vehicle.imageSource)}" target="_blank" rel="noreferrer">research reference</a></p></div></article>`;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = category.value;
    const selectedVerification = verification.value;
    const filtered = vehicles.filter((vehicle) => {
      const haystack = `${vehicle.manufacturer} ${vehicle.model}`.toLowerCase();
      return (!query || haystack.includes(query)) && (selectedCategory === 'all' || vehicle.category === selectedCategory) && (selectedVerification === 'all' || vehicle.verification === selectedVerification);
    });
    count.textContent = `Showing ${filtered.length} Vehicle${filtered.length === 1 ? '' : 's'}`;
    grid.innerHTML = filtered.length ? filtered.map((vehicle) => card(vehicle, vehicles.indexOf(vehicle))).join('') : '<p class="vehicle-empty">No vehicles match these filters.</p>';
    grid.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => {
      const media = image.parentElement;
      const fallback = document.createElement('div');
      fallback.className = 'vehicle-placeholder';
      fallback.style.setProperty('--placeholder-a', '#633fd0');
      fallback.style.setProperty('--placeholder-b', '#24154d');
      fallback.innerHTML = '<small>Image Not Yet Available</small><strong>VERIFY</strong>';
      media.replaceChildren(fallback);
    }, {once:true}));
  }

  fetch('vehicles.json?v=1', {cache:'no-store'}).then((response) => { if (!response.ok) throw new Error('Vehicle data unavailable'); return response.json(); }).then((data) => { vehicles = data; populateCategories(); render(); }).catch(() => { count.textContent = 'Vehicle data unavailable'; grid.innerHTML = '<p class="vehicle-empty">The vehicle database could not be loaded. Please refresh the page.</p>'; });
  [search, category, verification].forEach((control) => control.addEventListener('input', render));
})();
