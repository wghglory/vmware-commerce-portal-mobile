const PROXY_CONFIG = {
  // '/api/github': {
  //   target: 'https://api.github.com',
  //   changeOrigin: true,
  //   secure: false,
  //   pathRewrite: {
  //     '^/api/github': '',
  //   },
  // },

  '/api': {
    target: 'https://6726b461-1764-41dc-aff0-1acb9754adf9.mock.pstmn.io',
    changeOrigin: true,
    secure: false,
  },
};

module.exports = PROXY_CONFIG;
