async function replaceBr() {
  const { default: visit } = await import('unist-util-visit');

  return (tree) => {
    visit(tree, 'html', (node) => {
      node.value = node.value.replace(/<br\s*\/?>/gi, '<br />');
    });
  };
}

module.exports = replaceBr;
