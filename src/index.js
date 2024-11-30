import './styles.css'; // Подключаем стили в JS файл для работы bootstrap
import 'bootstrap'; // Подключаем плагины bootstrap для JS
import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';

console.log('Пример RSS-ссылки: https://lorem-rss.hexlet.app/feed');

const state = {
  feed: [],
  tyreError: null,
};

const watchedState = onChange(state, render);

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
      watchedState.tyreError = null;
    })
    .catch((err) => {
      watchedState.tyreError = err.type;
    });
});
