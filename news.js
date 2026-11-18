const newsGrid = document.querySelector('#news-grid');

function escapeNews(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function renderNews(articles) {
  newsGrid.innerHTML = articles.map((article) => `
    <article class="news-card news-theme-${escapeNews(article.theme)}">
      <div class="news-thumbnail">
        <img src="${escapeNews(article.thumbnail)}" alt="${escapeNews(article.title)} thumbnail" loading="lazy" onerror="this.onerror=null;this.src='${escapeNews(article.fallback)}'" />
      </div>
      <div class="news-card-content">
        <div class="news-meta">
          <span class="news-badge">${escapeNews(article.category)}</span>
          ${article.date ? `<time class="news-date" datetime="${escapeNews(article.date)}">${escapeNews(article.date)}</time>` : ''}
        </div>
        <h3>${escapeNews(article.title)}</h3>
        <p>${escapeNews(article.description)}</p>
        ${article.note ? `<p class="news-note">${escapeNews(article.note)}</p>` : ''}
        <a class="news-link" href="${escapeNews(article.sourceUrl)}"${/^https?:\/\//.test(article.sourceUrl) ? ' target="_blank" rel="noopener noreferrer"' : ''}>Read Article <span class="inline-arrow" aria-hidden="true"></span></a>
      </div>
    </article>`).join('');
}

fetch('data/news.json?v=4', { cache: 'no-store' })
  .then((response) => { if (!response.ok) throw new Error('News data unavailable'); return response.json(); })
  .then(renderNews)
  .catch(() => { newsGrid.innerHTML = '<p class="news-empty">News articles are temporarily unavailable.</p>'; });
