export default function(source) {
  const worker = new Worker('./worker.js');

  return new Promise((resolve, reject) => {
    worker.postMessage({
      source
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
