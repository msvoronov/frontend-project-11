const parse = (xml) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(xml, 'application/xml');
  const title = content.querySelector('title');
  return title.textContent === 'Error'
    ? 'parseError'
    : content;
};

const getDataRSS = (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.json())
  .then((data) => parse(data.contents))
  .catch(() => 'networkError');

export default getDataRSS;
