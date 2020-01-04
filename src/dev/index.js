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
  import { h, render } from 'preact';
  import { Counter } from './components/counter';
  import './css/index.css';

  welcome(JSON.name);
  const container = document.getElementById('preact-root');

  render(<Counter />, container, container.firstChild);
`;

const counterjs = `
  import { h, Component } from 'preact';

  export class Counter extends Component {
    constructor(props) {
      super(props)

      this.state = {
        count: 0
      }

      setInterval(() => {
        this.setState({ count: this.state.count + 1 });
      }, 1000);
    }

    render() {
      return <p>Preact Counter: {this.state.count}</p>;
    }
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
  './components/counter.js': counterjs,
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
  ],
  packages: {
    'preact.js': 'https://unpkg.com/preact@2.8.2/dist/preact.js'
  }
});

bundler.bundle();
