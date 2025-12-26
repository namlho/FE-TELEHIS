const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/telemed',
    createProxyMiddleware({
      target: 'https://telehis.hoangphucthanh.vn:4001',
      changeOrigin: true,
      secure: false,
      logLevel: 'warn',
      pathRewrite: {
        '^/telemed': '/telemed'
      }
    })
  );
};
