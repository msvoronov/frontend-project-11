const form = document.querySelector('form');
const input = form.querySelector('input');
const feedback = form.nextElementSibling;

const render = (path, value) => {
  if (value) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    switch (value) {
      case 'url':
        feedback.textContent = 'Ссылка должна быть валидным URL';
        break;
      case 'notOneOf':
        feedback.textContent = 'RSS уже существует';
        break;
      case '??':
        feedback.textContent = 'Ресурс не содержит валидный RSS';
        break;
      default:
        throw new Error(`Unknown type of error: '${value}'!`);
    }
  } else {
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS успешно загружен';
  }
};

export default render;
