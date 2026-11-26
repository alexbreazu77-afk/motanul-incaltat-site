// Builds the public site (dist/) from template.html + the editable files in content/.
// Runs on Netlify after every change saved in the admin panel. No extra packages needed.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f + '.json'), 'utf8'));

const data = {
  setari: read('setari'), acasa: read('acasa'), despre: read('despre'), tarife: read('tarife'),
  galerie: read('galerie'), documente: read('documente'), informatii: read('informatii'),
  an: String(new Date().getFullYear()),
};

const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (p) => p.split('.').reduce((o, k) => (o == null ? '' : o[k]), data);
const tel = (n) => {
  let d = String(n || '').replace(/[^\d+]/g, '');
  if (d.startsWith('0')) d = '+4' + d;
  return 'tel:' + d;
};
const paras = (t, cls) => String(t || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  .map((p) => `<p${cls ? ` class="${cls}"` : ''}>${esc(p).replace(/\n/g, '<br>')}</p>`).join('\n        ');
const list = (a) => (Array.isArray(a) ? a : []);
const ICONS = ['users', 'globe', 'clock', 'food', 'tree', 'moon', 'shield', 'handshake', 'brain', 'chart', 'sun', 'file', 'heart', 'book', 'palette', 'home', 'mountain', 'check', 'chat', 'lock'];
const icon = (n) => (ICONS.includes(n) ? n : 'check');
const slug = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fileName = (u) => { try { return decodeURIComponent(String(u).split('/').pop()); } catch (e) { return String(u).split('/').pop(); } };
const fileType = (u) => (fileName(u).split('.').pop() || 'PDF').toUpperCase();

const D = data;
const blocks = {
  slider: () => list(D.acasa.slider).map((s, i) =>
    `\n      <figure class="hs-s${i === 0 ? ' on' : ''}"><img src="${esc(s.imagine)}" alt="${esc(s.descriere)}"></figure>`).join(''),
  facts: () => list(D.acasa.informatii).map((f) =>
    `\n    <li><i class="ico"><svg><use href="#i-${icon(f.iconita)}"/></svg></i><div><b>${esc(f.titlu)}</b><span>${esc(f.text)}</span></div></li>`).join(''),
  fundament_text: () => paras(D.despre.fundament_text, 'muted'),
  zi: () => list(D.despre.zi).map((z) => `\n        <li><b>${esc(z.ora)}</b><span>${esc(z.activitate)}</span></li>`).join(''),
  spatii: () => list(D.despre.spatii).map((s) =>
    `\n        <article class="space"><img src="${esc(s.imagine)}" alt="${esc(s.titlu)}" loading="lazy"><div><h3>${esc(s.titlu)}</h3><p>${esc(s.text)}</p></div></article>`).join(''),
  parteneri: () => list(D.despre.parteneri).map((p) =>
    `\n        <div class="box"><i class="ico"><svg><use href="#i-${icon(p.iconita)}"/></svg></i><h3>${esc(p.titlu)}</h3><p>${esc(p.text)}</p></div>`).join(''),
  include: () => list(D.tarife.include).map((x) => `\n          <li><svg><use href="#i-check"/></svg>${esc(x)}</li>`).join(''),
  optionale: () => list(D.tarife.optionale).map((o) =>
    `\n          <li><svg><use href="#i-check"/></svg><span>${esc(o.nume)}${o.detalii ? `<small>${esc(o.detalii)}</small>` : ''}</span></li>`).join(''),
  pasi: () => list(D.tarife.pasi).map((p) => `\n        <li><h3>${esc(p.titlu)}</h3><p>${esc(p.text)}</p></li>`).join(''),
  intrebari: () => list(D.tarife.intrebari).map((q) =>
    `\n        <details><summary>${esc(q.intrebare)}<i><svg><use href="#i-plus"/></svg></i></summary><p>${esc(q.raspuns)}</p></details>`).join(''),
  galerie: () => list(D.galerie.poze).map((g) =>
    `\n      <button data-c="${esc(g.categorie)}" data-cap="${esc(g.titlu)}"><img src="${esc(g.imagine)}" alt="${esc(g.titlu)}" loading="lazy"><span>${esc(g.titlu)}</span></button>`).join(''),
  doc_chips: () => {
    const NAMES = { 'Autorizații': 'Autorizații', 'Regulamente': 'Regulamente și proceduri', 'Ofertă educațională': 'Ofertă educațională', 'Strategie': 'Strategie', 'Rapoarte': 'Rapoarte și buget', 'Proiecte': 'Proiecte', 'Altele': 'Altele' };
    const used = [...new Set(list(D.documente.documente).map((d) => d.categorie))];
    const order = Object.keys(NAMES).filter((k) => used.includes(k)).concat(used.filter((k) => !NAMES[k]));
    return '<button type="button" class="chip on" data-f="toate">Toate</button>' +
      order.map((c) => `<button type="button" class="chip" data-f="${esc(c)}">${esc(NAMES[c] || c)}</button>`).join('');
  },
  documente: () => list(D.documente.documente).map((d) =>
    `\n      <a class="doc" data-c="${esc(d.categorie)}" href="${esc(d.fisier)}" target="_blank" rel="noopener"><i class="ico"><svg><use href="#i-file"/></svg></i><span><b>${esc(d.titlu)}</b><small>${esc(d.categorie)} · ${esc(fileType(d.fisier))}</small></span><em><svg><use href="#i-down"/></svg><span>Descarcă</span></em></a>`).join(''),
  info_nav: () => list(D.informatii.sectiuni).map((s) =>
    `<button type="button" class="chip" data-go="i-${slug(s.titlu)}">${esc(s.scurt || s.titlu)}</button>`).join(''),
  info_sectiuni: () => list(D.informatii.sectiuni).map((s, i) => {
    let body = `\n    <h2>${esc(s.titlu)}</h2>`;
    if (s.text) body += '\n    ' + paras(s.text);
    if (s.citat) body += `\n    <div class="vquote">${s.citat_eticheta ? `<span>${esc(s.citat_eticheta)}</span>` : ''}<blockquote>${esc(s.citat)}</blockquote></div>`;
    if (list(s.lista).length) body += '\n    <ol class="goals">' + list(s.lista).map((x) => `\n      <li>${esc(x)}</li>`).join('') + '\n    </ol>';
    return `\n  <section class="sec${i % 2 ? ' alt' : ''} info" id="i-${slug(s.titlu)}"><div class="wrap itext">${body}\n  </div></section>\n`;
  }).join(''),
};

let html = fs.readFileSync(path.join(ROOT, 'template.html'), 'utf8');
html = html.replace(/<!--#(\w+)-->/g, (m, name) => {
  if (!blocks[name]) throw new Error('Bloc necunoscut: ' + name);
  return blocks[name]();
});
html = html.replace(/\{\{tel:([\w.]+)\}\}/g, (m, p) => esc(tel(get(p))));
html = html.replace(/\{\{([\w.]+)\}\}/g, (m, p) => esc(get(p)));
if (/\{\{|<!--#/.test(html)) throw new Error('Au rămas marcaje necompletate în pagină.');

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'static'), OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('Site construit în dist/ (' + Math.round(html.length / 1024) + ' KB)');
