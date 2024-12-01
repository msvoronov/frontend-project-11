import './styles.css'; // Подключаем стили в JS файл для работы bootstrap
import 'bootstrap'; // Подключаем плагины bootstrap для JS
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';

console.log('Пример RSS-ссылки: https://lorem-rss.hexlet.app/feed');

const i18n = i18next.createInstance();

const state = {
  feed: [],
  tyreError: null,
  lng: null,
};

const watchedState = onChange(state, (path, value) => {
  render(path, value, i18n);
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  // Валидация
  const schema = yup.string().required().url().notOneOf(state.feed);
  schema.validate(url)
    .then(() => {
      state.feed.push(url);
      watchedState.tyreError = false;
    })
    .catch((err) => {
      watchedState.tyreError = err.type;
    });
});

i18n.init({
  lng: 'ru',
  resources,
}).then(() => {
  watchedState.lng = i18n.lng;
});
