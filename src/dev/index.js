import Bundler from "../../index";
import { babelLoader } from "../loaders/babel";

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
  "./hello.js": hellojs,
  "./help.js": "const a = 2;"
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

bundler.bundle().then(output => console.log(output));
