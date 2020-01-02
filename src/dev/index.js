import Bundler from "../../index";
import { babelLoader } from "../loaders/babel";

const mainjs = `
  import { hello, welcome } from './hello.js';
  
  hello();
  welcome('Ameer');
`;

const hellojs = `
  import { welcome } from './modules/welcome.js';

  function hello(name) {
    console.log('hello from module');
  }

  export { welcome, hello };
`;

const welcomejs = `
  export function welcome(name) {
    console.log(\`Welcome \${name}\`);
  }
`;

const files = {
  "main.js": mainjs,
  "./hello.js": hellojs,
  "./modules/welcome.js": welcomejs
};

const bundler = new Bundler({
  entry: "main.js",
  files,
  defaultExt: "js",
  rules: [
    {
      test: /\.js?$/,
      loaders: [babelLoader]
    }
  ]
});

bundler.bundle();
