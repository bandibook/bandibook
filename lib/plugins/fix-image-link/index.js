const fixImageLinkPathPlugin = require('./fixImageLinkPathPlugin');
const replaceToDefaultImage = require('./replaceToDefaultImagePlugin');

function fixImageLinkPlugin() {
  const fixImageLinkPath = fixImageLinkPathPlugin();
  const replaceDefault = replaceToDefaultImage();
  
  return (tree, file) => {
    // 1. 이미지 경로 표현에 문제가 있으면 정정 (기존 만베거 유저들이 그냥 글을 올려도 문제 없다.)
    fixImageLinkPath(tree, file);
      
    // 2. 존재하지 않는 이미지를 기본 이미지로 대체
    replaceDefault(tree, file);
      
    return tree;
  };
}

module.exports = fixImageLinkPlugin;
