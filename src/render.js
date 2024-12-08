const form = document.querySelector('form');
const input = form.querySelector('input');
const feedback = form.nextElementSibling;

const renderButton = (status) => {
  if (status === 'executing') {
    form.querySelector('button').disabled = true;
  } else {
    form.querySelector('button').disabled = false;
  }
};

const renderError = (error, i18n) => {
  if (error === 'noError') {
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('errors.none');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    feedback.textContent = i18n.t(`errors.${error}`);
  }
};

const renderTexts = (i18n) => {
  const modalRead = document.querySelector('.full-article');
  modalRead.textContent = i18n.t('modal.read');
  modalRead.nextElementSibling.textContent = i18n.t('modal.close');

  const h1 = document.querySelector('h1');
  h1.textContent = i18n.t('title');
  h1.nextElementSibling.textContent = i18n.t('subtitle');

  input.nextElementSibling.textContent = i18n.t('label');
  form.querySelector('button').textContent = i18n.t('button');
};

const renderFeed = (feed, i18n) => {
  const feedsList = document.querySelector('.feeds');
  if (feedsList.innerHTML === '') { // Отрисовка HTML для первого добавленного фида
    feedsList.innerHTML = `
      <div class="card border-0">
        <div class="card-body"><h2 class="card-title h4">${i18n.t('feeds')}</h2></div>
        <ul class="list-group border-0 rounded-0"></ul>
      </div>`;
  }
  const ul = feedsList.querySelector('ul');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  li.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>`;
  ul.prepend(li);
};

const renderPosts = (posts, i18n) => {
  const postsList = document.querySelector('.posts');
  if (postsList.innerHTML === '') { // Отрисовка HTML для первого добавленного поста
    postsList.innerHTML = `
      <div class="card border-0">
        <div class="card-body"><h2 class="card-title h4">${i18n.t('posts')}</h2></div>
        <ul class="list-group border-0 rounded-0"></ul>
      </div>`;
  }
  const ul = postsList.querySelector('ul');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.innerHTML = `
      <a href="${post.link}" class="fw-bold" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('view')}</button>`;

    const a = li.querySelector('a');
    const button = li.querySelector('button');
    const markAsVisited = () => {
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
    };
    a.addEventListener('click', markAsVisited);
    button.addEventListener('click', () => {
      document.querySelector('.modal-title').textContent = post.title;
      document.querySelector('.modal-body').textContent = post.description;
      document.querySelector('.full-article').setAttribute('href', post.link);
      markAsVisited();
    });
    ul.prepend(li);
  });
};

const render = (path, value, i18n) => {
  switch (path) {
    case 'statusApp':
      renderButton(value);
      break;
    case 'typeError':
      renderError(value, i18n);
      break;
    case 'lng':
      renderTexts(i18n);
      break;
    case 'lastAddedFeed':
      renderFeed(value, i18n);
      break;
    case 'lastAddedPosts':
      renderPosts(value, i18n);
      break;
    default:
      throw new Error(`Unknown state parameter: '${path}'!`);
  }
};

export default render;
