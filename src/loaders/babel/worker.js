import { transformSync } from '@babel/core';
import presetEnv from '@babel/preset-env';
import reactPreset from '@babel/preset-react';
import preactPreset from 'babel-preset-preact';

self.addEventListener('message', (evt) => {
  try {
    const { source, options } = evt.data;

    const result = transformSync(source, {
      ...options,
      presets: [presetEnv, reactPreset, preactPreset],
      ast: true
    });

    self.postMessage({ err: false, code: result.code, ast: result.ast });
  } catch (err) {
    self.postMessage({ err, code: '', ast: '' });
  }
});
