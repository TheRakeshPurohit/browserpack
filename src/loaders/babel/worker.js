import { transformSync } from '@babel/core';
import es2015 from 'babel-preset-es2015';

self.addEventListener('message', (evt) => {
  try {
    const { source, options } = evt.data;

    const result = transformSync(source, {
      ...options,
      presets: [es2015],
      ast: true
    });

    self.postMessage({ err: false, code: result.code, ast: result.ast });
  } catch (err) {
    self.postMessage({ err, code: '', ast: '' });
  }
});
