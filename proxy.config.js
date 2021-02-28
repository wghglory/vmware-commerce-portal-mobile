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
    target: 'https://vcp-uat2.vdp-stg.vmware.com', // https://4aeb705f-384c-40d5-880c-5f473b687d7e.mock.pstmn.io
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api',
    },
    onProxyRes(proxyResponse) {
      const cookies = proxyResponse.headers['set-cookie'];
      const prune = (cookie = '') => cookie.replace(/;\W*secure/gi, '').replace(/;\W*SameSite=None/gi, '');

      if (cookies) {
        proxyResponse.headers['set-cookie'] = cookies.map(prune);
      }
    },
  },
};

module.exports = PROXY_CONFIG;
