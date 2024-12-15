const IMAGE_TYPE = 'image';
const EXTERNAL_URL_PREFIX = 'https://';

function convertRelativeImagePathPlugin() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (node.type === IMAGE_TYPE && !isExternalUrl(node.url)) {
    node.url = convertToRelativePath(node.url);
  }

  if (node.children) {
    node.children.forEach(visit);
  }
}

function isExternalUrl(url) {
  return url && url.startsWith(EXTERNAL_URL_PREFIX);
}

function convertToRelativePath(url) {
  if (!url) return url;
  if (!url.startsWith('./') && !url.startsWith('/')) {
    return './' + url;
  }
  return url;
}

module.exports = convertRelativeImagePathPlugin;
