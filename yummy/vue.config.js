const { defineConfig } = require('@vue/cli-service');
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // URL de tu backend
        changeOrigin: true
      }
    }
  }
};

