const config = require('../project.config');

// 打包输出配置
let output = config.isDevelopment ? {
  filename: '[name].js',
  path: config.outputPath,
  publicPath: '/'
} : {
  filename: 'js/[name].[hash:7].js',
  path: config.outputPath,
  publicPath: config.publicPath
};

module.exports = output;
