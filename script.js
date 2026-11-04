// мобільне меню
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => { if (e.target.tagName === 'A') nav.classList.remove('open'); });

// фільтри робіт
const works = document.querySelectorAll('.work');
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters .on').classList.remove('on');
    btn.classList.add('on');
    works.forEach(w => w.classList.toggle('hide', btn.dataset.f !== 'all' && w.dataset.c !== btn.dataset.f));
    track.scrollTo({ left: 0 });
  });
});

// слайдер
const track = document.querySelector('.track');
document.querySelector('.arrow--l').addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .8 }));
document.querySelector('.arrow--r').addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .8 }));

// форма (заглушка: підключіть свій backend / Telegram / Formspree)
const form = document.getElementById('leadForm');
const msg = form.querySelector('.form__msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name, phone = form.phone;
  name.classList.toggle('err', !name.value.trim());
  const okPhone = /^[+\d][\d\s()-]{8,}$/.test(phone.value.trim());
  phone.classList.toggle('err', !okPhone);
  if (!name.value.trim() || !okPhone) { msg.textContent = 'Перевірте ім\'я та номер телефону'; return; }
  msg.textContent = 'Дякуємо! Ми зателефонуємо вам найближчим часом.';
  form.reset();
});

// підсвічування активного пункту меню
const links = [...nav.querySelectorAll('a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
['top','paving','types','solar','extra','why','works','process','contact'].forEach(id => {
  const el = document.getElementById(id); if (el) io.observe(el);
});
