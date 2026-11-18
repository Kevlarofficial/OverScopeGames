const $ = s => document.querySelector(s);
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
const load = u => fetch(u).then(r => r.json()).catch(() => []);
const status = g => g.release_date || (g.coming_soon ? 'Coming soon' : 'Out now');
const steam = g => `https://store.steampowered.com/app/${g.appid}`;
const cover = (g, cls) => { const i = el('img', cls); i.alt = ''; i.src = g.header_image;
  i.onerror = () => { i.onerror = null; i.src = 'assets/icon.png'; i.classList.add('fallback'); }; return i; };
const date = d => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
function newsItem(n) {
  const w = el('article', 'news'); w.append(el('time', '', date(n.date)));
  const b = el('div'), h = el('h3'), a = el('a', '', n.title); a.href = n.url; h.append(a);
  b.append(h, el('p', '', n.excerpt)); w.append(b); return w;
}
(async () => {
  const [games, news] = await Promise.all([load('data/games.json'), load('data/news.json')]);
  const row = $('#games-row');
  if (row) {
    games.forEach(g => { const a = el('a', 'card'); a.href = `game.html?id=${g.appid}`;
      const d = el('div'); d.append(el('h3', '', g.name), el('p', '', status(g))); a.append(cover(g), d); row.append(a); });
    const hero = $('#hero'), btn = $('#hero-cta');
    if (games[0]) btn.href = steam(games[0]);
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches && matchMedia('(pointer:fine)').matches)
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect();
        hero.style.setProperty('--x', e.clientX - r.left + 'px'); hero.style.setProperty('--y', e.clientY - r.top + 'px'); });
  }
  const list = $('#news-list');
  if (list) news.slice(0, 6).forEach(n => list.append(newsItem(n)));
  const page = $('#game');
  if (page) {
    const id = new URLSearchParams(location.search).get('id');
    const g = games.find(x => String(x.appid) === id);
    if (!g) { page.append(el('h1', '', 'Game not found'), el('p', '', 'Go back to the games list.')); return; }
    document.title = `${g.name} | Over Scope Games`;
    const b = el('a', 'btn', g.coming_soon ? 'Wishlist on Steam' : 'View on Steam'); b.href = steam(g);
    page.append(cover(g, 'cover'), el('h1', '', g.name), el('p', 'meta', [status(g), ...(g.genres || [])].join(', ')), el('p', '', g.short_description), b);
    if (g.trailer) { const v = el('video'); v.controls = true; v.src = g.trailer; page.append(v); }
    if (g.screenshots?.length) { const s = el('div', 'shots'); g.screenshots.forEach(u => { const i = el('img'); i.src = u; i.alt = ''; i.loading = 'lazy'; s.append(i); }); page.append(s); }
    const mine = news.filter(n => String(n.appid) === id).slice(0, 5);
    if (mine.length) { page.append(el('h2', '', 'News')); mine.forEach(n => page.append(newsItem(n))); }
  }
})();
