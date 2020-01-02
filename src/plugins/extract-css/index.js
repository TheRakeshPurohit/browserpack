function extractCssPlugin(files) {
  let css = '';
  const styleTagId = 'EXTRACT_CSS_PLUGIN_STYLES';

  for (const file in files) {
    if (/\.css$/.test(file)) {
      css = css.concat(files[file]);
    }
  }

  let oldStyleTag = document.getElementById(styleTagId);

  if (oldStyleTag) {
    document.removeChild(oldStyleTag);
  }

  const styleTag = document.createElement('style');

  styleTag.id = `EXTRACT_CSS_PLUGIN_STYLES`;
  styleTag.innerHTML = css.trim();

  document.head.appendChild(styleTag);
}

export { extractCssPlugin };
