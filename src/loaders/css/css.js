export default function(source, sourceFile) {
  const worker = new Worker('./worker.js');

  return new Promise((resolve, reject) => {
    worker.postMessage({
      source
    });

    worker.addEventListener('message', (evt) => {
      const { err, code } = evt.data;

      const styleTagId = sourceFile;

      let styleTag = document.getElementById(sourceFile);

      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleTagId;
        document.head.appendChild(styleTag);
      }

      styleTag.innerHTML = code.trim();

      if (!err) {
        resolve(code);
      } else {
        reject(err);
      }

      worker.terminate();
    });
  });
}
