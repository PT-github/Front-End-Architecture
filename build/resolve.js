const path = require('path');
const config = require('../project.config');

// 文件路径配置
let fileResolve = {
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': path.resolve(config.projectRoot, 'src')
  },
  extensions: [
    '.js',
    '.jsx',
    '.vue',
    '.json'
  ]
};

module.exports = fileResolve;