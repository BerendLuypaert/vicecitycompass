(function () {
  'use strict';

  const cheats = Array.isArray(window.gta6Cheats) ? window.gta6Cheats : [];
  const grid = document.getElementById('cheat-grid');
  const search = document.getElementById('cheat-search');
  const filter = document.getElementById('cheat-filter');
  const platform = document.getElementById('platform-select');
  const summary = document.getElementById('cheat-summary');
  const platformNote = document.getElementById('platform-note');
  const categoryNames = { player: 'Player', weapons: 'Weapons', vehicles: 'Vehicles', weather: 'Weather', effects: 'Effects' };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
    });
  }

  function codeMarkup(code) {
    if (!code) return '<p class="unknown-code">Code not yet verified</p><button class="copy-code" type="button" disabled>Copy unavailable</button>';
    return '<div class="dpad-sequence" aria-label="' + escapeHtml(code) + '">' + code.split(' ').map(function (key) {
      return '<span class="dpad-key">' + escapeHtml(key) + '</span>';
    }).join('') + '</div><button class="copy-code" type="button" data-code="' + escapeHtml(code) + '">Copy code</button>';
  }

  function cardMarkup(cheat) {
    const statusLabel = cheat.status === 'reported' ? 'Reported' : 'Code Unknown';
    return '<article class="cheat-card"><div class="cheat-card-head"><div><h2>' + escapeHtml(cheat.name) + '</h2><p class="cheat-meta">' + escapeHtml(categoryNames[cheat.category] || cheat.category) + '</p></div><span class="cheat-badge ' + escapeHtml(cheat.status) + '">' + statusLabel + '</span></div>' +
      '<p class="cheat-effect">' + escapeHtml(cheat.effect) + '</p><p class="cheat-unlock"><strong>Unlock:</strong> ' + escapeHtml(cheat.unlock) + '</p><div class="cheat-code"><div class="code-label"><span>D-pad combination</span><span>' + escapeHtml(platform ? platform.value : 'PS5') + '</span></div>' + codeMarkup(cheat.code) + '</div><p class="cheat-source">Research source: <a href="' + escapeHtml(cheat.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(cheat.source) + '</a></p></article>';
  }

  function render() {
    const query = (search ? search.value : '').trim().toLowerCase();
    const selectedCategory = filter ? filter.value : 'all';
    const results = cheats.filter(function (cheat) {
      const matchesText = !query || [cheat.name, cheat.effect, cheat.category, cheat.unlock].join(' ').toLowerCase().includes(query);
      return matchesText && (selectedCategory === 'all' || cheat.category === selectedCategory);
    });
    if (summary) summary.textContent = 'Showing ' + results.length + ' of ' + cheats.length + ' reported GTA 6 cheats.';
    if (grid) grid.innerHTML = results.length ? results.map(cardMarkup).join('') : '<p class="database-empty">No cheats match your search.</p>';
    document.querySelectorAll('.copy-code[data-code]').forEach(function (button) {
      button.addEventListener('click', function () {
        const code = button.getAttribute('data-code');
        const done = function () { button.textContent = 'Copied'; setTimeout(function () { button.textContent = 'Copy code'; }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done).catch(function () { fallbackCopy(code, done); });
        else fallbackCopy(code, done);
      });
    });
  }

  function fallbackCopy(value, done) {
    const input = document.createElement('textarea'); input.value = value; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.appendChild(input); input.select();
    try { document.execCommand('copy'); done(); } finally { input.remove(); }
  }

  function updatePlatform() {
    if (platformNote && platform) platformNote.textContent = 'These reported combinations use the D-pad on ' + platform.value + '. The same sequence is reported for both supported platforms; no code is labelled Rockstar-verified yet.';
    render();
  }

  if (search) search.addEventListener('input', render);
  if (filter) filter.addEventListener('change', render);
  if (platform) platform.addEventListener('change', updatePlatform);
  updatePlatform();
}());
