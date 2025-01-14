const path = require('path');
const IMAGE_TYPE = 'image';
const EXTERNAL_URL_PREFIX = 'https://';

function fixImageLinkPathPlugin() {
  return (tree, file) => {
    visit(tree, file);
  };
}

function visit(node, file) {
  if (node.type === IMAGE_TYPE && !isExternalUrl(node.url)) {
    node.url = calculateRelativePath(node.url, file.path);
  }

  if (node.children) {
    node.children.forEach(child => visit(child, file));
  }
}

function calculateRelativePath(imagePath, markdownFilePath) {
  if (!imagePath || isRelativePath(imagePath)) {
    return imagePath;
  }

  if (!imagePath.startsWith('/')) {
    return './' + imagePath;
  }
  
  return fixAbsolutePath(imagePath, markdownFilePath);
}

function fixAbsolutePath(imagePath, markdownFilePath) {
  const imagePathParts = imagePath.split('/').filter(Boolean);
  const firstDirectory = imagePathParts[0];
  
  if (!containsFirstDirectory(firstDirectory, markdownFilePath)) {
    return imagePath;
  }
  
  const currentDepth = calculateDepth(firstDirectory, markdownFilePath);
  
  // 상대 경로 표현 추가
  const goUpPath = '../'.repeat(currentDepth - 1); 
  const remainingPath = imagePathParts.slice(1).join('/');
  return goUpPath + remainingPath;
}

function isExternalUrl(url) {
  return url && url.startsWith(EXTERNAL_URL_PREFIX);
}

function isRelativePath(imagePath) {
  return imagePath.startsWith('./') || imagePath.startsWith('../');
}

function containsFirstDirectory(firstDirectory, markdownFilePath) {
  const mdPathParts = markdownFilePath.split(path.sep);
  return mdPathParts.indexOf(firstDirectory) !== -1;
}

function calculateDepth(firstDirectory, markdownFilePath) {
  const mdPathParts = markdownFilePath.split(path.sep);
  const firstDirectoryIndex = mdPathParts.indexOf(firstDirectory);

  // 마크다운 파일 디렉토리 Depth 계산
  return mdPathParts.length - firstDirectoryIndex - 1;  // -1은 파일명 제외
}

module.exports = fixImageLinkPathPlugin;
