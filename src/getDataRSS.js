const extractFeed = (content, url) => {
  const title = content.querySelector('title').textContent;
  const description = content.querySelector('description').textContent;
  return { title, description, url };
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

const parse = (xml, url) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(xml, 'text/xml');
  if (content.querySelector('parsererror')) {
    throw new Error('parseError');
  }
  return { feed: extractFeed(content, url), posts: extractPosts(content) };
};

const getDataRSS = (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('networkError');
  })
  .then((data) => parse(data.contents, url));

export default getDataRSS;
