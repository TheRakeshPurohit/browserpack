export default function evaluate(file, files) {
  /* eslint-disable no-undef */
  exports = {};
  /* eslint-disable no-undef */
  module = { exports };
  /* eslint-disable no-undef */
  require = (module) => evaluate(module, files);

  eval(files[file]);

  return module.exports;
}
