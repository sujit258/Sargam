import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hydrate, filterSongs, isPlayableSong } from '../web/lib/catalogue.ts';
const catalog = JSON.parse(fs.readFileSync(new URL('../web/public/catalogue.json', import.meta.url)));
const discovery = JSON.parse(fs.readFileSync(new URL('../data/catalogs/marathi/discovery.json', import.meta.url)));
for (const imported of discovery) {
  const raw = catalog.songs.find(s => s.id === imported.id);
  assert.ok(raw && isPlayableSong(raw), imported.title);
  const song = hydrate(raw, catalog.facets);
  assert.equal(song.video, imported.source.id);
  assert.ok(filterSongs(catalog, {}, song.title).some(s => s.id === song.id), `Search: ${song.title}`);
  for (const category of imported.categories) assert.ok(song.categories.includes(category));
}
const unavailable = catalog.songs.filter(s => s.lang === 'marathi' && !s.source_verified);
assert.ok(unavailable.length > 0);
assert.ok(unavailable.every(s => !isPlayableSong(s)));
assert.equal(isPlayableSong({v:'Ift2EvKopvc', source_verified:false}), false);
assert.equal(isPlayableSong({v:'', source_verified:true}), false);
console.log(`PASS: ${discovery.length} imported songs hydrate, search, categorize and qualify for playback; ${unavailable.length} unavailable rows excluded from queues.`);
