import { name } from "../../package.json";

class Bundler {
  constructor(config) {
    this.entryPoint = config.entry || "index.js";
    this.files = config.files || [];
    this.defaultExt = config.defaultExt || "js";
    this.rules = config.rules || [];
  }

  transpile(sourceFile) {
    let source = this.files[sourceFile];

    if (source === undefined) {
      throw new Error(`${name}: unable to find module ${sourceFile}`);
    }

    try {
      for (const rule of this.rules) {
        if (rule.test.test(sourceFile)) {
          this.runLoaders(source, rule.loaders).then(transpiledCode => {
            console.log(transpiledCode);
          });
        }
      }
    } catch (err) {
      throw new Error(`${name}: ${err}`);
    }
  }

  runLoader(source, loader) {
    if (loader === undefined || typeof loader !== "function") {
      throw new Error(`${name}: unable to find loader ${loader}`);
    }

    return loader(source);
  }

  runLoaders(source, loaders) {
    /* eslint-disable no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      try {
        for (const loader of loaders) {
          source = await this.runLoader(source, loader);
        }
      } catch (err) {
        reject(err);
      }

      resolve(source);
    });
  }

  bundle() {
    const entryPointFile = this.files[this.entryPoint];

    if (entryPointFile === undefined) {
      throw new Error(
        `${name}: could not find the entrypoint ${(this, this.entryPoint)}`
      );
    }

    return this.transpile(this.entryPoint);
  }
}

export default Bundler;
