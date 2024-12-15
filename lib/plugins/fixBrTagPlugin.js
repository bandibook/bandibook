const HTML_TYPE = 'html';
const TARGET_BR_TAG = /<br\s*\/?>/gi;
const REPLACEMENT_BR_TAG = '<br />';

function fixBrTagPlugin() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (node.type === HTML_TYPE) {
    node.value = replaceBrTag(node.value);
  }

  if (node.children) {
    node.children.forEach(visit);
  }
}

function replaceBrTag(htmlContent) {
  return htmlContent.replace(TARGET_BR_TAG, REPLACEMENT_BR_TAG);
}

module.exports = fixBrTagPlugin;
