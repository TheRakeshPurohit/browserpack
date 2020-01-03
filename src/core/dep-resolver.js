import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const parser = acorn.Parser.extend(jsx());

function findDeps(fileName, files, filesToTranspile = {}, depTree = {}) {
  if (!fileName.replace('./', '').includes('.')) {
    fileName = `${fileName}.js`;
  }

  filesToTranspile[fileName] = true;

  if (!/\.js?$/.test(fileName)) {
    return;
  }

  let ast = parser.parse(files[fileName], {
    sourceType: 'module'
  });

  const deps = ast.body.filter((nodes) => nodes.type === 'ImportDeclaration');

  if (!deps) {
    return filesToTranspile;
  }

  deps.forEach((dep) => {
    let depFile = dep.source.value;

    if (!depFile.replace('./', '').includes('.')) {
      depFile = `${depFile}.js`;
    }

    if (!depTree[depFile]) {
      depTree[depFile] = [];
    }

    depTree[depFile].push(fileName);
    findDeps(dep.source.value, files, filesToTranspile, depTree);
  });

  return { filesToTranspile, depTree };
}

self.addEventListener('message', (evt) => {
  const { files, entryPoint } = evt.data;
  const { filesToTranspile, depTree } = findDeps(entryPoint, files);

  self.postMessage({
    filesToTranspile,
    depTree
  });
});
