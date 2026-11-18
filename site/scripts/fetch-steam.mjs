import { readFileSync, writeFileSync } from 'node:fs';
const read = (f, d) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return d; } };
const getJson = async u => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.json(); };
const { appids } = read('games.config.json', { appids: [] });
const old = read('data/games.json', []);
const games = [], news = [];
for (const id of appids) {
  const prev = old.find(g => g.appid === id);
  try {
    const d = (await getJson(`https://store.steampowered.com/api/appdetails?appids=${id}&l=english`))[id];
    if (!d?.success) throw new Error('store page not public yet');
    const a = d.data, m = a.movies?.[0];
    games.push({ appid: id, name: a.name, short_description: a.short_description, header_image: a.header_image,
      coming_soon: a.release_date?.coming_soon ?? false, release_date: a.release_date?.date || '',
      screenshots: (a.screenshots || []).slice(0, 8).map(s => s.path_full),
      trailer: m?.mp4?.max || m?.mp4?.['480'] || '', genres: (a.genres || []).map(g => g.description) });
  } catch (e) {
    console.warn(id, e.message);
    games.push(prev || { appid: id, name: `Game ${id}`, short_description: '', coming_soon: true, release_date: 'Coming soon',
      header_image: `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`, screenshots: [], trailer: '', genres: [] });
  }
  try {
    const n = await getJson(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${id}&count=10&maxlength=400&format=json`);
    for (const i of n.appnews?.newsitems || []) {
      if (i.feedname !== 'steam_community_announcements') continue;
      news.push({ appid: id, title: i.title, date: new Date(i.date * 1000).toISOString(), url: i.url,
        excerpt: i.contents.replace(/\{STEAM_CLAN_IMAGE\}\S*/g, '').replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220) });
    }
  } catch (e) { console.warn('news', id, e.message); }
}
writeFileSync('data/games.json', JSON.stringify(games, null, 1));
if (news.length) writeFileSync('data/news.json', JSON.stringify(news.sort((a, b) => b.date.localeCompare(a.date)), null, 1));
