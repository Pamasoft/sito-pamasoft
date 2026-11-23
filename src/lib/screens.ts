/**
 * HTML builders for the product "screens" drawn in HTML/CSS (no screenshots).
 * Ported 1:1 from the approved mockup. All strings are static site copy.
 */

export type Tag = [string, string];

export const row = (a: string, b: string, c: string, t: Tag) =>
  `<div class="r"><span><b>${a}</b><small>${b}</small></span><span>${c}</span><span class="tag ${t[0]}">${t[1]}</span></div>`;

export const meterRow = (a: string, v: number, sub = '', color = '') =>
  `<div class="r"><span><b>${a}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="meter"><i style="width:${v}%${color ? `;background:${color}` : ''}"></i></span><span>${v}%</span></div>`;

export const tile = (n: string, p: string, c: string, s = '') =>
  `<div class="tile"><i style="background:${c}"></i><b>${n}</b>${s ? s + ' · ' : ''}${p}</div>`;

export const till = (lines: [string, string][], tot: string, pay: string, totalLabel: string) =>
  `<div class="till">${lines.map(([a, b]) => `<div class="l"><span>${a}</span><span>${b}</span></div>`).join('')}<div class="t"><span>${totalLabel}</span><span>${tot}</span></div><div class="pay">${pay}</div></div>`;

export const bar = (label: string) => `<div class="bar"><i></i><i></i><i></i><span>${label}</span></div>`;

export const winS = (u: string, side: string[], on: number, main: string) =>
  `<div class="win">${bar(u)}<div class="app"><div class="side">${side.map((s, i) => `<div${i === on ? ' class="on"' : ''}>${s}</div>`).join('')}</div><div class="main">${main}</div></div></div>`;

export const phoneS = (h: string, body: string) => `<div class="phone"><div class="notch"></div><h4>${h}</h4>${body}</div>`;

export const toastS = (t: string, s: string) => `<div class="toast"><i>✓</i><span><b>${t}</b>${s}</span></div>`;

export const pl = (a: string, b: string) => `<div class="pl"><span>${a}</span><b>${b}</b></div>`;

/** Appointment grid: apps = [row, col, span, html, colorClass] */
export const ag = (cols: string[], hours: string[], apps: [number, number, number, string, string][]) => {
  let h = '<div class="dh"></div>' + cols.map((c) => `<div class="dh">${c}</div>`).join('');
  hours.forEach((hr, r) => {
    h += `<div class="rn">${hr}</div>`;
    cols.forEach((_c, ci) => {
      const a = apps.find((x) => x[0] === r && x[1] === ci);
      h += `<div>${a ? `<span class="ap ${a[4]}" style="height:calc(${a[2] * 100}% + ${a[2] - 1}px - 6px)">${a[3]}</span>` : ''}</div>`;
    });
  });
  return `<div class="ag">${h}</div>`;
};

/** Booking calendar: rooms = [roomNo, [startCol, span, label, colorClass][]] */
export const calendar = (cls: 'mini' | 'cal', days: string[], rooms: [string, [number, number, string, string][]][]) => {
  let h = '<div class="dh"></div>' + days.map((d) => `<div class="dh">${d}</div>`).join('');
  rooms.forEach(([n, bs]) => {
    h += `<div class="rn">${n}</div>`;
    for (let i = 0; i < days.length; i++) {
      const b = bs.find((x) => x[0] === i);
      h += `<div>${b ? `<span class="bk ${b[3]}" style="width:calc(${b[1] * 100}% + ${b[1] - 1}px - 6px)">${b[2]}</span>` : ''}</div>`;
    }
  });
  return `<div class="${cls}">${h}</div>`;
};

export const ICONS: Record<string, string> = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l9-9M17 5l3 3"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  chart: '<path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4"/>',
  broom: '<path d="M14 4l-4 8M6 13h10l2 7H4z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v2M12 16v2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8S10 3 7.5 4 9 8 12 8zm0 0s2-5 4.5-4S15 8 12 8z"/>',
  hub: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="5" r="2"/><circle cx="20" cy="5" r="2"/><circle cx="12" cy="21" r="2"/><path d="M6 6l4 4M18 6l-4 4M12 15v4"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z"/>',
  chain: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cup: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
  scis: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5L20 19M8.5 15.5L20 5"/>',
  dumb: '<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L3 18l3 3 6.2-6.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.8-.7-.7-2.8z"/>',
  till: '<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7 10V4h10v6M7 14h4M15 14h2"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  box: '<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
  id: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 10h3M15 14h3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  pc: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  tab: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/>',
  scan: '<path d="M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 8v8M10 8v8M13 8v8M16 8v8"/>',
  tray: '<path d="M3 15h18M5 15a7 7 0 0 1 14 0M12 6V4M2 19h20"/>',
  test: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chef: '<path d="M7 14h10v6H7zM7 14a4 4 0 0 1-1-7.8A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 6 2.2A4 4 0 0 1 17 14"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
};

/** Icon tile (".ic"), optionally tinted with a business colour */
export const icon = (k: string, c = '') =>
  `<div class="ic"${c ? ` style="background:${c}1a"` : ''}><svg viewBox="0 0 24 24" aria-hidden="true"${c ? ` style="stroke:${c}"` : ''}>${ICONS[k] ?? ICONS.spark}</svg></div>`;

export const vIco = (c: string, ic: string) =>
  `<span class="vi" style="background:${c}1a;color:${c}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[ic]}</svg></span>`;

export const dot = (color: string, abbr: string) => `<span class="dot" style="background:${color}" aria-hidden="true">${abbr}</span>`;
