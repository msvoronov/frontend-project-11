const form = document.querySelector('form');
const input = form.querySelector('input');
const feedback = form.nextElementSibling;

const renderError = (value, i18n) => {
  if (value) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    feedback.textContent = i18n.t(`errors.${value}`);
  } else {
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('errors.not');
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

const render = (path, value, i18n) => {
  switch (path) {
    case 'tyreError':
      renderError(value, i18n);
      break;
    case 'lng':
      renderTexts(i18n);
      break;
    default:
      throw new Error(`Unknown state parameter: '${path}'!`);
  }
};

export default render;
