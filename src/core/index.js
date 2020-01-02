import { name } from "../../package.json";

class Bundler {
  constructor(config) {
    this.entryPoint = config.entry || "index.js";
    this.files = config.files || [];
    this.defaultExt = config.defaultExt || "js";
    this.loaders = config.loaders || [];
  }

  parse(sourceFile) {
    let source = this.files[sourceFile];

    if (source === undefined) {
      throw new Error(`${name}: unable to find module ${sourceFile}`);
    }

    try {
      for (const loader of this.loaders) {
        if (loader.test.test(sourceFile)) {
          const loaderFn = loader.loader;

          console.log(`${loaderFn} parsing ${sourceFile}`);

          if (loaderFn === undefined || typeof loaderFn !== "function") {
            throw new Error(`${name}: unable to find loader ${loader.loader}`);
          }

          // stub commonjs exports and require
          /* eslint-disable no-undef */
          require = module => this.parse(module);
          /* eslint-disable no-undef */
          exports = {};
          /* eslint-disable no-undef */
          module = { exports };

          source = loaderFn(source, loader.options).code;

          eval(source);
        }
      }

      return module.exports;
    } catch (err) {
      throw new Error(`${name}: ${err}`);
    }
  }

  bundle() {
    const entryPointFile = this.files[this.entryPoint];

    if (entryPointFile === undefined) {
      throw new Error(
        `${name}: could not find the entrypoint ${(this, this.entryPoint)}`
      );
    }

    return this.parse(this.entryPoint);
  }
}

export default Bundler;
