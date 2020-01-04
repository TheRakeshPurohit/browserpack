// Lot of work needs to be done from downloading to caching
function downloadPackage(packageName) {
  return fetch(packageName).then((res) => res.text());
}

export { downloadPackage };
