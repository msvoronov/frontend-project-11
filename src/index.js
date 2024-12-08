import './styles.css'; // Подключаем стили в JS файл для работы bootstrap
import 'bootstrap'; // Подключаем плагины bootstrap для JS
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';
import getDataRSS from './getDataRSS.js';

console.log('https://lorem-rss.hexlet.app/feed');
console.log('https://lorem-rss.hexlet.app/feed?unit=second&interval=30');
console.log('https://www.finam.ru/analysis/conews/rsspoint/');

const i18n = i18next.createInstance();

const state = {
  lng: null,
  statusApp: 'waitingInput',
  typeError: null,
  links: [],
  feeds: [],
  posts: [],
  lastAddedFeed: null,
  lastAddedPosts: null,
};

const watchedState = onChange(state, (path, value) => {
  render(path, value, i18n);
});

const extractFeed = (content) => {
  const title = content.querySelector('title').textContent;
  const description = content.querySelector('description').textContent;
  return { title, description };
};
const extractPosts = (content) => {
  const items = [...content.querySelectorAll('item')];
  return items.map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { title, description, link };
  }).reverse();
};

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  // Валидация ...
  const schema = yup.string().required().url().notOneOf(state.links);
  schema.validate(url)
    .then(() => { // ... прошла
      watchedState.statusApp = 'executing'; // блокируем кнопку
      return getDataRSS(url);
    })
    .then((content) => {
      watchedState.statusApp = 'waitingInput'; // разблокируем кнопку
      if (content === 'Error') {
        watchedState.typeError = 'notContainRSS';
      } else {
        state.links.push(url);

        const newFeed = extractFeed(content);
        const newPosts = extractPosts(content);
        state.feeds.push(newFeed);
        state.posts = [...state.posts, ...newPosts];
        watchedState.lastAddedFeed = newFeed;
        watchedState.lastAddedPosts = newPosts;

        watchedState.typeError = 'noError'; // Отрисовка статуса при удачном добавлении ссылки
        state.typeError = null; // Иначе onChange не сработает при двух корректных ссылках подряд
      }
    })
    .catch((err) => { // ... не прошла
      watchedState.statusApp = 'waitingInput'; // разблокируем кнопку
      watchedState.typeError = err.type;
    });
});

const checkLinks = () => {
  const frequencyChecking = 5000;
  setTimeout(() => {
    state.links.forEach((url) => {
      getDataRSS(url)
        .then((content) => {
          const titlesAddedPosts = state.posts.map((addedPost) => addedPost.title);
          const extractedPosts = extractPosts(content);
          const filteredPosts = extractedPosts
            .filter((newPost) => !titlesAddedPosts.includes(newPost.title));
          if (filteredPosts.length !== 0) {
            state.posts = [...state.posts, ...filteredPosts];
            watchedState.lastAddedPosts = filteredPosts;
          }
        });
    });
    checkLinks();
  }, frequencyChecking);
};
checkLinks();

i18n.init({
  lng: 'ru',
  resources,
}).then(() => {
  watchedState.lng = i18n.language;
});
