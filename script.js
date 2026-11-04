const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// вступна заставка
const start = () => setTimeout(() => document.body.classList.add('loaded'), reduce ? 0 : 1500);
if (document.readyState === 'complete') start(); else addEventListener('load', start);
setTimeout(() => document.body.classList.add('loaded'), 4000); // страховка

// розбиття заголовків на слова
$$('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="transition-delay:${i * 70}ms">${w}</span></span>`).join('');
});

// поява елементів при прокрутці
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
$$('[data-reveal],[data-split]').forEach(el => io.observe(el));

// лічильники
const cio = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1800;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: .6 });
$$('[data-count]').forEach(el => cio.observe(el));

// прокрутка: індикатор, шапка, паралакс
const header = $('.header'), bar = $('.progress span');
const para = $$('[data-parallax]');
let ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header.classList.toggle('scrolled', y > 60);
  if (!reduce) para.forEach(el => {
    const host = el.parentElement, r = host.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const k = parseFloat(el.dataset.parallax) || .2;
    el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -k}px,0)`;
  });
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// світло за курсором у hero
const hero = $('.hero');
hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
});

// меню
const burger = $('.burger'), nav = $('#nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }
});

// активний пункт меню
const links = $$('a', nav);
const sio = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['plitka', 'solar', 'gazoblok', 'dahy', 'pidloga', 'muzh', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) sio.observe(el); });

// форма (заглушка: підключіть свій backend / Telegram / Formspree)
const form = $('#leadForm'), msg = $('.form__msg', form);
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name, phone = form.phone;
  const okName = !!name.value.trim();
  const okPhone = /^[+\d][\d\s()-]{8,}$/.test(phone.value.trim());
  name.classList.toggle('err', !okName);
  phone.classList.toggle('err', !okPhone);
  if (!okName || !okPhone) { msg.textContent = 'Перевірте ім\'я та номер телефону'; return; }
  msg.textContent = 'Дякуємо! Ми зателефонуємо вам найближчим часом.';
  form.reset();
});
