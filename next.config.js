const replaceBr = require('./lib/remark-plugin');

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
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
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: 'remark-loader',
          options: {
            remarkOptions: {
              plugins: [replaceBr],
            },
          },
        },
      ],
    });

    return config;
  },
});
