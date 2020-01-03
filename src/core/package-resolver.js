function downloadPackage(packageName) {
  return fetch(packageName).then((res) => res.text());
}

export { downloadPackage };
