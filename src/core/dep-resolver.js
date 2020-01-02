import * as acorn from "acorn";

self.addEventListener("message", evt => {
  const { code } = evt;

  let ast = acorn.parse(code, {
    sourceType: "module"
  });

  self.postMessage({
    ast
  });
});
