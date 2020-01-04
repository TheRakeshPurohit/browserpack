import Bundler from '../../index';
import { babelLoader, jsonLoader, cssLoader } from '../loaders';

const userJSON = `{
  "name": "Ameer",
  "location": "Bengaluru"}
`;

const indexCss = `
 h1 {
   color: green;
 }
`;

const mainjs = `
  import { welcome } from './modules/welcome';
  import JSON from './jsons/user.json';
  import './css/index.css';

  welcome(JSON.name);
`;
const welcomejs = `
  export function welcome(name) {
    document.getElementById('title').innerHTML = \`Welcome \${name}\`;
  }
`;

const files = {
  './main.js': mainjs,
  './css/index.css': indexCss,
  './modules/welcome.js': welcomejs,
  './jsons/user.json': userJSON
};

const bundler = new Bundler({
  entry: './main.js',
  files
});

bundler.bundle();
