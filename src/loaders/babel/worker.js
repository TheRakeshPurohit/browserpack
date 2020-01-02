import { transformSync } from '@babel/core';
import presetEnv from '@babel/preset-env';

self.addEventListener('message', (evt) => {
  try {
    const { source, options } = evt.data;

    const result = transformSync(source, {
      ...options,
      presets: [presetEnv],
      ast: true
    });

    self.postMessage({ err: false, code: result.code, ast: result.ast });
  } catch (err) {
    self.postMessage({ err, code: '', ast: '' });
  }
});
