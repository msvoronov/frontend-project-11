import { v4 as uuidv4 } from 'uuid';

export default (posts) => posts.map((post) => ({ ...post, ...{ id: uuidv4() } }));
