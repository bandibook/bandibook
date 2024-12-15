const path = require('path');
const fs = require('fs');

const IMAGE_TYPE = 'image';
const EXTERNAL_URL_PREFIX = 'https://';

const DEFAULT_IMAGE = '/default-image.png';

function replaceToDefaultImagePlugin() {
  return (tree, file) => {
    visit(tree, file);
  };
}

function visit(node, file) {
  if (node.type === IMAGE_TYPE && !isExternalUrl(node.url)) {
    node.url = replaceIfNotExists(node.url, file);
  }

  if (node.children) {
    node.children.forEach(childNode => visit(childNode, file));
  }
}

function replaceIfNotExists(imagePath, file) {
  if (!imagePath) return DEFAULT_IMAGE;
  
  const rootDirectory = path.dirname(file.path);
  const fullImagePath = path.join(rootDirectory, imagePath);
  
  return isExists(fullImagePath) ? imagePath : DEFAULT_IMAGE;
}

function isExists(fullPath) {
  try {
    fs.accessSync(fullPath);
    return true;
  } catch {
    return false;
  }
}

function isExternalUrl(url) {
  return url && url.startsWith(EXTERNAL_URL_PREFIX);
}

module.exports = replaceToDefaultImagePlugin;
