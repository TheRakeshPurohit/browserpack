export default function(source, options) {
  const worker = new Worker('./worker.js');

  return new Promise((resolve, reject) => {
    worker.postMessage({
      source,
      options
    });

    worker.addEventListener('message', (evt) => {
      const { err, code } = evt.data;

      if (!err) {
        resolve(code);
      } else {
        reject(err);
      }

      worker.terminate();
    });
  });
}
