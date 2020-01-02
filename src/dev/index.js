import Bundler from "../../index";
import { babelLoader } from "../loaders";

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
  rules: [
    {
      test: /\.js?$/,
      loaders: [babelLoader]
    }
  ]
});

bundler.bundle();
