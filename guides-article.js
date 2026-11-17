const main = document.querySelector('[data-guide]');

const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const slugify = (value) => String(value).toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function linkMarkup(link) {
  const external = /^https?:\/\//.test(link.url);
  return `<a href="${esc(link.url)}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${esc(link.label)}</a>`;
}

function sectionMarkup(section) {
  const id = slugify(section.heading);
  const body = section.body ? `<p>${esc(section.body)}</p>` : '';
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '';
  const table = section.table?.length
    ? `<div class="table-wrap"><table><thead><tr>${section.table[0].map(cell => `<th>${esc(cell)}</th>`).join('')}</tr></thead><tbody>${section.table.slice(1).map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
  return `<section class="article-section" id="${id}"><h2>${esc(section.heading)}</h2>${body}${bullets}${table}</section>`;
}

function renderGuide(guide, allGuides) {
  const related = allGuides.filter(item => item.slug !== guide.slug).slice(0, 3);
  const toc = guide.sections.map(section => `<a href="#${slugify(section.heading)}">${esc(section.heading)}</a>`).join('');
  const sourceLinks = guide.links.map(linkMarkup).join('');
  const relatedLinks = related.map(item => `<a class="related-card" href="${esc(item.slug)}.html"><span>${esc(item.badge)}</span><strong>${esc(item.title)}</strong></a>`).join('');

  main.innerHTML = `
    <nav class="breadcrumbs"><a href="../guides.html">Guides</a><span>/</span><span>${esc(guide.badge)}</span></nav>
    <article>
      <header class="article-hero">
        <div class="article-placeholder ${esc(guide.placeholderClass)}"><span>${esc(guide.placeholder)}</span><small>Subject placeholder · no reuse-permitted image verified</small></div>
        <div class="article-heading"><p class="eyebrow">GTA 6 GUIDE · ${esc(guide.category)}</p><h1>${esc(guide.title)}</h1><p class="lead">${esc(guide.description)}</p><p class="updated">Updated ${esc(guide.updated)} · Research status: source-first and subject to change</p></div>
      </header>
      <div class="article-layout">
        <aside class="article-toc"><p>ON THIS PAGE</p>${toc}</aside>
        <div class="article-content">
          ${guide.sections.map(sectionMarkup).join('')}
          <section class="source-box"><h2>Sources & accuracy</h2><p>Officially published information is separated from community reporting and unknown details. Check the linked sources for the newest announcement before treating a detail as final.</p><div class="source-links">${sourceLinks}</div></section>
          <section class="source-box"><h2>Continue exploring</h2><div class="related-grid">${relatedLinks}</div></section>
        </div>
      </div>
    </article>`;

  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Article', headline: guide.title,
    description: guide.description, dateModified: guide.updated,
    mainEntityOfPage: window.location.href, publisher: { '@type': 'Organization', name: 'ViceCityCompass' }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

fetch('../guides-data.json?v=1')
  .then(response => { if (!response.ok) throw new Error('Could not load guide data'); return response.json(); })
  .then(guides => {
    const guide = guides.find(item => item.slug === main.dataset.guide);
    if (!guide) throw new Error('Guide not found');
    renderGuide(guide, guides);
  })
  .catch(error => {
    console.error(error);
    main.innerHTML = '<div class="article-error"><h1>Guide unavailable</h1><p>Please return to the guides overview and try again.</p><a href="../guides.html">Back to guides</a></div>';
  });
