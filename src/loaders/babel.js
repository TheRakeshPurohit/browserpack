import { transformSync } from "@babel/core";

export default function loaderFn(source, options) {
  return transformSync(source, options);
}
