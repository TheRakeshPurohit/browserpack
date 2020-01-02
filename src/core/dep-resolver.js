import * as acorn from "acorn";

function findDeps(fileName, files, result = {}) {
  if (!result[fileName]) {
    result[fileName] = [];
  }

  if (!/\.js?$/.test(fileName)) {
    return;
  }

  let ast = acorn.parse(files[fileName], {
    sourceType: "module"
  });

  const deps = ast.body.filter(nodes => nodes.type === "ImportDeclaration");

  if (!deps) {
    return result;
  }

  deps.forEach(dep => {
    result[fileName].push(dep.source.value);

    findDeps(dep.source.value, files, result);
  });

  return result;
}

self.addEventListener("message", evt => {
  const { files, entryPoint } = evt.data;
  const depTree = findDeps(entryPoint, files);

  self.postMessage({
    depTree
  });
});
