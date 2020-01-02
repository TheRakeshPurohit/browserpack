import Bundler from '../../index';
import { babelLoader } from '../loaders/babel';
import { jsonLoader } from '../loaders/json';

const userJSON = `{
  "name": "Ameer",
  "location": "Bengaluru"}
`;

const mainjs = `
  import { hello } from './hello.js';
  import { welcome } from './modules/welcome.js';
  import JSON from './jsons/user.json';
  
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
    console.log(\`Welcome \${name}\`);
  }
`;

const files = {
  'main.js': mainjs,
  './hello.js': hellojs,
  './modules/welcome.js': welcomejs,
  './jsons/user.json': userJSON
};

const bundler = new Bundler({
  entry: 'main.js',
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
    }
  ]
});

bundler.bundle();
