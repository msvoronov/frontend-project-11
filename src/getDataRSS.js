const parse = (xml) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(xml, 'application/xml');
  const isParseError = Boolean(content.querySelector('parsererror'));
  return isParseError
    ? 'parseError'
    : content;
};

const getDataRSS = (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => parse(data.contents))
  .catch(() => 'networkError');

export default getDataRSS;
