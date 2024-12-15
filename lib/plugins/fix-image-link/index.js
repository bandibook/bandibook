const convertRelativeImagePath = require('./convertRelativeImagePathPlugin');
const replaceToDefaultImage = require('./replaceToDefaultImagePlugin');

function fixImageLinkPlugin() {
  const convertToRelative = convertRelativeImagePath();
  const replaceDefault = replaceToDefaultImage();
  
  return (tree, file) => {
    // 1. 절대 경로를 상대 경로로 변환
    convertToRelative(tree, file);
    
    // 2. 존재하지 않는 이미지를 기본 이미지로 대체
    replaceDefault(tree, file);
    
    return tree;
  };
}

module.exports = fixImageLinkPlugin;
