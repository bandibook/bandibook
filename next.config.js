const fixImageLink = require('./lib/plugins/fix-image-link');
const fixBrTag = require('./lib/plugins/fixBrTagPlugin');

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  mdxOptions: {
    remarkPlugins: [
      fixBrTag,
      fixImageLink,
    ]
  }
});

module.exports = withNextra({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/book',
        permanent: true,
      },
    ];
  }
});
