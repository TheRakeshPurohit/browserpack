self.addEventListener('message', (evt) => {
  try {
    const { source } = evt.data;

    self.postMessage({ err: false, code: source });
  } catch (err) {
    self.postMessage({ err, code: '' });
  }
});
