import * as acorn from 'acorn';

function findDeps(fileName, files, filesToTranspile = {}, depTree = {}) {
  filesToTranspile[fileName] = true;

  if (!/\.js?$/.test(fileName)) {
    return;
  }

  let ast = acorn.parse(files[fileName], {
    sourceType: 'module'
  });

  const deps = ast.body.filter((nodes) => nodes.type === 'ImportDeclaration');

  if (!deps) {
    return filesToTranspile;
  }

  deps.forEach((dep) => {
    const depFile = dep.source.value;

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
