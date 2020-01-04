import { name } from '../../package.json';
import { downloadPackage } from '../package-resolver/package-resolver';
import evaluate from './eval';

class Bundler {
  constructor(config) {
    this.entryPoint = config.entry || 'index.js';
    this.files = config.files || [];
    this.defaultExt = config.defaultExt || 'js';
    this.rules = config.rules || [];
    this.transpiledFiles = {};
    this.depTree = {};
    this.plugins = config.plugins || [];
    this.packages = config.packages || {};
  }

  async syncPackages() {
    const downloadPromises = [];

    for (const packageName in this.packages) {
      downloadPromises.push(downloadPackage(this.packages[packageName]));
    }

    await Promise.all(downloadPromises).then((packages) => {
      let i = 0;

      for (const packageName in this.packages) {
        this.files[packageName] = packages[i];
        i++;
      }
    });
  }

  async update(fileName, updatedSource) {
    this.files[fileName] = updatedSource;

    // transpile and evaluate the affected file
    this.transpiledFiles[fileName] = await this.transpile(fileName);
    evaluate(fileName, this.transpiledFiles);
    // transpile and evaluate the files that uses the changed file
    const deps = this.depTree[fileName];

    if (deps) {
      deps.forEach(async (dep) => {
        evaluate(dep, this.transpiledFiles);
      });
    }
  }

  async transpile(sourceFile) {
    if (!sourceFile.replace('./', '').includes('.')) {
      sourceFile = `${sourceFile}.js`;
    }

    let source = this.files[sourceFile];

    if (source === undefined) {
      throw new Error(`${name}: unable to find module ${sourceFile}`);
    }

    try {
      let hasLoader = false;

      for (const rule of this.rules) {
        if (rule.test.test(sourceFile)) {
          hasLoader = true;
          source = await this.runLoaders(source, sourceFile, rule.loaders);
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

  runLoader(source, sourceFile, loader) {
    if (loader === undefined || typeof loader !== 'function') {
      throw new Error(`${name}: unable to find loader ${loader}`);
    }

    return loader(source, sourceFile);
  }

  runLoaders(source, sourceFile, loaders) {
    /* eslint-disable no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      try {
        for (const loader of loaders) {
          source = await this.runLoader(source, sourceFile, loader);
        }
      } catch (err) {
        reject(err);
      }

      resolve(source);
    });
  }

  async bundle() {
    await this.syncPackages();

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
          const { filesToTranspile, depTree } = evt.data;

          // we will use this to transpile and evaluate only changed files and the files that uses it
          this.depTree = depTree;

          for (const file in filesToTranspile) {
            this.transpiledFiles[file] = await this.transpile(file);
          }

          depResolverWorker.terminate();

          evaluate(this.entryPoint, this.transpiledFiles);

          // run through the plugins
          this.plugins.forEach((plugin) => {
            plugin(this.files);
          });

          depResolverWorker.terminate();

          resolve();
        } catch (err) {
          depResolverWorker.terminate();

          reject(err);
        }
      });
    });
  }
}

export default Bundler;
