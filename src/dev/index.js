import Bundler from "../../index";
import { babelLoader } from "../loaders";
import es2015 from "babel-preset-es2015";

const mainjs = `
  import { hello } from './hello.js';
  
  hello();
`;

const hellojs = `
  export function hello() {
    console.log('hello from module');
  }
`;

const files = {
  "main.js": mainjs,
  "./hello.js": hellojs
};

const bundler = new Bundler({
  entry: "main.js",
  files,
  defaultExt: "js",
  loaders: [
    {
      test: /\.js?$/,
      loader: babelLoader,
      options: {
        presets: [es2015]
      }
    }
  ]
});

bundler.bundle();
