const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  devServer: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' https://www.google.com https://www.gstatic.com;",
        "style-src 'self' https://fonts.googleapis.com;",
        "img-src 'self' https://images.pexels.com https://cdn.hellofresh.com https://i.pinimg.com https://media.citybeat.com https://www.agoda.com https://images.unsplash.com https://mir-s3-cdn-cf.behance.net https://img.icons8.com https://www.gstatic.com https://www.google.com data:;",
        "connect-src 'self' ws://172.18.4.101:8081 http://localhost:5000 data: https://www.google.com;",
        "font-src 'self' https://fonts.gstatic.com data:;",
        "object-src 'none';",
        "frame-ancestors 'none';",
        "frame-src https://www.google.com https://www.gstatic.com;",
        "form-action 'self';",
        "base-uri 'self';",
        "script-src-attr 'none';"
      ].join(' ')
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  configureWebpack: config => {
    config.optimization = {
      ...config.optimization,
      minimize: true
    };
  },

  productionSourceMap: false,

  filenameHashing: true,
};