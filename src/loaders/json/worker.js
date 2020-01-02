const LOADER = 'JSON Loader';

self.addEventListener('message', (evt) => {
  try {
    const { source } = evt.data;

    // validatig the json
    try {
      JSON.stringify(source);
    } catch (err) {
      throw new Error(`${LOADER}: invalid json module ${err}`);
    }

    const transpiledCode = `
      const JSON = ${source.trim()};

      export default JSON;
    `;

    self.postMessage({ err: false, code: transpiledCode });
  } catch (err) {
    self.postMessage({ err, code: '', ast: '' });
  }
});
