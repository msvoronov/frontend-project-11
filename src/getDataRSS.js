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

const getDataRSS = (url) => {
  const timeoutAbortRequest = 4500;
  const controller = new AbortController();
  setTimeout(() => controller.abort(new Error('networkError')), timeoutAbortRequest);
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`, { signal: controller.signal })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('networkError'))))
    .then((data) => parse(data.contents, url));
};

export default getDataRSS;
