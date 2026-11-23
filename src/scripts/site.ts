/* Pamasoft — JS minimo, vanilla: menu mobile, dropdown, tab, filtri, selettore CloudPos, form contatti. */

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel) as unknown as T[]);

/* ---------- Dropdown desktop ---------- */
const ddButtons = $$<HTMLButtonElement>('button[data-dd]');
const closeDropdowns = (except?: HTMLButtonElement) => {
  ddButtons.forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    document.getElementById(b.getAttribute('aria-controls') || '')?.setAttribute('hidden', '');
  });
};
ddButtons.forEach((b) => {
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById(b.getAttribute('aria-controls') || '');
    const open = b.getAttribute('aria-expanded') === 'true';
    closeDropdowns(b);
    b.setAttribute('aria-expanded', String(!open));
    if (open) panel?.setAttribute('hidden', '');
    else panel?.removeAttribute('hidden');
  });
});
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.drop')) closeDropdowns();
});

/* ---------- Menu mobile ---------- */
const burger = document.getElementById('burger');
const mob = document.getElementById('mob');
const setMob = (open: boolean) => {
  if (!burger || !mob) return;
  mob.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', (open ? burger.dataset.close : burger.dataset.open) || '');
  document.body.style.overflow = open ? 'hidden' : '';
};
burger?.addEventListener('click', () => setMob(!mob?.classList.contains('open')));
mob?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) setMob(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) setMob(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openBtn = ddButtons.find((b) => b.getAttribute('aria-expanded') === 'true');
  closeDropdowns();
  openBtn?.focus();
  if (mob?.classList.contains('open')) {
    setMob(false);
    burger?.focus();
  }
});

/* ---------- Tab (moduli prodotto) ---------- */
$$('[role="tablist"]').forEach((list) => {
  const tabs = $$<HTMLButtonElement>('[role="tab"]', list);
  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls') || '');
      if (on) panel?.removeAttribute('hidden');
      else panel?.setAttribute('hidden', '');
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      let n = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n >= 0) {
        e.preventDefault();
        select(n, true);
      }
    });
  });
});

/* ---------- Filtro prodotti per settore ---------- */
$$('[data-filter]').forEach((group) => {
  const grid = document.getElementById(group.dataset.filter || '');
  if (!grid) return;
  group.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button');
    if (!b) return;
    $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const k = b.dataset.k;
    $$<HTMLElement>('[data-s]', grid).forEach((c) => {
      c.hidden = !(k === 'tutti' || c.dataset.s === k);
    });
  });
});

/* ---------- Selettore attività CloudPos ---------- */
const cpBiz = document.getElementById('cpbiz');
if (cpBiz) {
  const go = document.getElementById('cpgo') as HTMLAnchorElement | null;
  cpBiz.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button');
    if (!b) return;
    $$('button', cpBiz).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$<HTMLElement>('[data-cp-screen]').forEach((s) => {
      s.hidden = s.dataset.cpScreen !== b.dataset.k;
    });
    if (go) {
      go.href = b.dataset.href || go.href;
      go.textContent = b.dataset.label || go.textContent;
    }
  });
}

/* ---------- Form contatti (POST a erp.pamasoft.com/send-email.jsp) ---------- */
const EN_MESSAGES: [RegExp, string][] = [
  [/Messaggio inviato con successo!?/gi, 'Message sent successfully!'],
  [/Per favore, compila tutti i campi obbligatori\./gi, 'Please fill in all required fields.'],
  [/Indirizzo email non valido\./gi, 'Invalid email address.'],
  [/Per favore, utilizza un indirizzo email valido\./gi, 'Please use a valid email address.'],
  [/Il messaggio è troppo corto[^<]*/gi, 'The message is too short.'],
  [/Per favore, compila il form con più attenzione\./gi, 'Please fill in the form more carefully.'],
  [/Il form è scaduto\. Per favore, ricarica la pagina\./gi, 'The form has expired. Please reload the page.'],
  [/Errore di validazione\. Ricarica la pagina\./gi, 'Validation error. Please reload the page.'],
];

$$<HTMLFormElement>('form[data-contact]').forEach((form) => {
  const ts = form.querySelector<HTMLInputElement>('input[name="form_timestamp"]');
  if (ts) ts.value = String(Date.now());
  const resp = form.querySelector<HTMLElement>('.form-resp');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const d = form.dataset;
  const show = (html: string, ok = false) => {
    if (!resp) return;
    resp.innerHTML = html.includes('alert-notification') ? html : `<div class="alert-notification ${ok ? 'success' : 'error'}">${html}</div>`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? '';
    const privacy = (form.elements.namedItem('privacy_accept') as HTMLInputElement | null)?.checked;
    if (!val('first_name') || !val('last_name') || !val('email') || !val('message') || !privacy) return show(d.errRequired || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) return show(d.errEmail || '');
    if (val('message').length < 20) return show(d.errMessage || '');

    const body = new URLSearchParams();
    new FormData(form).forEach((v, k) => body.append(k, String(v)));
    const label = btn?.textContent || '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = d.sending || label;
    }
    try {
      const r = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        mode: 'cors',
        credentials: 'omit',
      });
      if (!r.ok) throw new Error(String(r.status));
      let html = await r.text();
      if (document.documentElement.lang === 'en') EN_MESSAGES.forEach(([re, en]) => (html = html.replace(re, en)));
      show(html);
      if (html.includes('success')) {
        form.reset();
        if (ts) ts.value = String(Date.now());
      }
    } catch {
      show(d.errNetwork || '');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = label;
      }
    }
  });
});
