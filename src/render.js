const renderError = (error, i18n, elements) => {
  const { formInput, feedback } = elements;
  if (error === null) {
    formInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger', 'text-success');
    feedback.textContent = '';
  } else if (error === 'noError') {
    formInput.value = '';
    formInput.focus();
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('errors.none');
  } else {
    formInput.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t(`errors.${error}`);
  }
};

const renderTexts = (i18n, elements) => {
  const { modalRead, formInput, formButton } = elements;
  modalRead.textContent = i18n.t('modal.read');
  modalRead.nextElementSibling.textContent = i18n.t('modal.close');

  const h1 = document.querySelector('h1');
  h1.textContent = i18n.t('title');
  h1.nextElementSibling.textContent = i18n.t('subtitle');

  formInput.nextElementSibling.textContent = i18n.t('label');
  formButton.textContent = i18n.t('button');
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
      <a href="${post.link}" class="fw-bold" target="_blank" data-id="${post.id}" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('view')}</button>`;
    ul.prepend(li);
  });
};

const renderModal = (post, elements) => {
  const { modalTitle, modalBody, modalRead } = elements;
  const a = document.querySelector(`[data-id="${post.id}"]`);
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal', 'link-secondary');
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalRead.setAttribute('href', post.link);
};

const render = (path, value, i18n) => {
  const elements = {
    formInput: document.querySelector('form input'),
    formButton: document.querySelector('form button'),
    feedback: document.querySelector('.feedback'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalRead: document.querySelector('.full-article'),
  };

  switch (path) {
    case 'form.statusApp':
      elements.formButton.disabled = value === 'executingRequest';
      break;
    case 'form.typeError':
      renderError(value, i18n, elements);
      break;
    case 'lng':
      renderTexts(i18n, elements);
      break;
    case 'feeds':
      renderFeed(value, i18n);
      break;
    case 'posts':
      renderPosts(value, i18n);
      break;
    case 'modalPost':
      renderModal(value, elements);
      break;
    default:
      throw new Error(`Unknown state parameter: '${path}'!`);
  }
};

export default render;
