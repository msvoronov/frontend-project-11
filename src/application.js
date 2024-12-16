import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';
import getDataRSS from './getDataRSS.js';
import insertIds from './insertIds.js';

const app = (state, i18n) => {
  render('lng', i18n.lng, i18n);

  const watchedState = onChange(state, (path, value, previousValue) => {
    if (path === 'posts') {
      const newPosts = value.filter((post) => !previousValue.includes(post));
      render(path, newPosts, i18n);
      return;
    }
    if (path === 'feeds') {
      const newFeed = value.at(-1);
      render(path, newFeed, i18n);
      return;
    }
    render(path, value, i18n);
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    const schema = yup.string().required().url().notOneOf(state.feeds.map((feed) => feed.url));
    schema.validate(url)
      .then(() => { // Валидация прошла
        watchedState.form.statusApp = 'executingRequest'; // блокируем кнопку
        watchedState.form.typeError = null; // обнуляем предыдущую отрисовку
        return getDataRSS(url);
      })
      .then((content) => { // Данные с сервера получены
        watchedState.form.statusApp = 'waitingInput'; // разблокируем кнопку
        watchedState.form.typeError = 'noError';

        const { feed, posts } = content;
        watchedState.feeds.push(feed);

        const preparedPosts = insertIds(posts);
        watchedState.posts = [...state.posts, ...preparedPosts];
      })
      .catch((err) => { // Валидация не прошла или выброшена ошибка в getDataRSS
        watchedState.form.statusApp = 'waitingInput'; // разблокируем кнопку
        if (err.message === 'networkError' || err.message === 'Failed to fetch') {
          watchedState.form.typeError = 'networkError';
        } else if (err.message === 'parseError') {
          watchedState.form.typeError = 'parseError';
        } else {
          watchedState.form.typeError = err.type;
        }
      });
  });

  const postsList = document.querySelector('.posts');
  postsList.addEventListener('click', (e) => {
    if (e.target.matches('[data-id]')) {
      const { id } = e.target.dataset;
      const selectedPost = state.posts.find((post) => post.id === id);
      watchedState.modalPost = selectedPost;
    }
  });

  const checkLinks = () => {
    const frequencyChecking = 5000;
    setTimeout(() => {
      const urls = state.feeds.map((feed) => feed.url);
      const promises = urls.map((url) => getDataRSS(url)
        .then((content) => {
          const titlesAddedPosts = state.posts.map((addedPost) => addedPost.title);
          const { posts } = content;
          const filteredPosts = posts
            .filter((newPost) => !titlesAddedPosts.includes(newPost.title));
          if (filteredPosts.length !== 0) {
            const preparedPosts = insertIds(filteredPosts);
            watchedState.posts = [...state.posts, ...preparedPosts];
          }
        }));
      Promise.all(promises).then(() => checkLinks());
    }, frequencyChecking);
  };
  checkLinks();
};

const init = () => {
  const defaultLanguage = 'ru';
  const state = {
    lng: defaultLanguage,
    form: {
      statusApp: 'waitingInput',
      typeError: null,
    },
    modalPost: null,
    feeds: [],
    posts: [],
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: state.lng,
    resources,
  }).then(() => {
    app(state, i18n);
  });
};

export default init;
