export default function evaluate(file, files) {
  if (!/\.js|\.json?$/.test(file)) {
    return;
  }
  /* eslint-disable no-undef */
  exports = {};
  /* eslint-disable no-undef */
  module = { exports };
  /* eslint-disable no-undef */
  require = (module) => {
    // ./hello.js -> hello.js (which has extension it has .)
    if (!module.replace('./', '').includes('.')) {
      module = `${module}.js`;
    }

    return evaluate(module, files);
  };

  eval(files[file]);

  return module.exports;
}
