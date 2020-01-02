import { name } from '../../package.json';
import evaluate from './eval';

class Bundler {
  constructor(config) {
    this.entryPoint = config.entry || 'index.js';
    this.files = config.files || [];
    this.defaultExt = config.defaultExt || 'js';
    this.rules = config.rules || [];
    this.transpiledFiles = {};
  }

  async transpile(sourceFile) {
    let source = this.files[sourceFile];

    if (source === undefined) {
      throw new Error(`${name}: unable to find module ${sourceFile}`);
    }

    try {
      let hasLoader = false;

      for (const rule of this.rules) {
        if (rule.test.test(sourceFile)) {
          hasLoader = true;
          source = await this.runLoaders(source, rule.loaders);
        }
      }

      if (!hasLoader) {
        throw new Error(`${name}: no loader found for file ${sourceFile}`);
      }

      return source;
    } catch (err) {
      throw new Error(`${name}: ${err}`);
    }
  }

  runLoader(source, loader) {
    if (loader === undefined || typeof loader !== 'function') {
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

    // find the dep tree
    const depResolverWorker = new Worker('./dep-resolver.js');

    depResolverWorker.postMessage({
      entryPoint: this.entryPoint,
      files: this.files
    });

    return new Promise((resolve, reject) => {
      depResolverWorker.addEventListener('message', async (evt) => {
        try {
          const { depTree } = evt.data;

          for (const file in depTree) {
            this.transpiledFiles[file] = await this.transpile(file);
          }

          depResolverWorker.terminate();

          evaluate(this.entryPoint, this.transpiledFiles);

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

export default Bundler;
