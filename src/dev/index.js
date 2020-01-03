import Bundler from '../../index';
import { babelLoader } from '../loaders/babel';
import { jsonLoader } from '../loaders/json';
import { cssLoader } from '../loaders/css';

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
  import { hello } from './hello.js';
  import { welcome } from './modules/welcome.js';
  import JSON from './jsons/user.json';
  import './css/index.css';
  
  hello();
  welcome('Ameer');
  console.log(JSON);
`;

const hellojs = `
  export function hello(name) {
    console.log('hello from module');
  }
`;

const welcomejs = `
  export function welcome(name) {
    document.getElementById('title').innerHTML = \`Welcome \${name}\`;
  }
`;

const files = {
  './main.js': mainjs,
  './css/index.css': indexCss,
  './hello.js': hellojs,
  './modules/welcome.js': welcomejs,
  './jsons/user.json': userJSON
};

const bundler = new Bundler({
  entry: './main.js',
  files,
  defaultExt: 'js',
  rules: [
    {
      test: /\.js?$/,
      loaders: [babelLoader]
    },
    {
      test: /\.json?$/,
      loaders: [jsonLoader, babelLoader]
    },
    {
      test: /\.css?$/,
      loaders: [cssLoader]
    }
  ]
});

bundler.bundle();

const txt = document.getElementById('updated-code');

txt.value = welcomejs;

setInterval(() => bundler.update('./modules/welcome.js', txt.value), 2000);
