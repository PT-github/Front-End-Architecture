const path = require('path');
const isDevelopment = process.env.BUILD_TYPE !== 'pro';

const outputDir = path.resolve(__dirname, 'dist');

let config = {

  pubProjectName: 'vueApp', // 如果按照域名+项目名访问 此处填写对应的项目名称

  env: process.env.ENV_CONFIG, // 环境变量

  isDevelopment, // 是否打包成开发模式

  entry: ['babel-polyfill', './src/main.js'], // 入口js

  staticPath: isDevelopment ? '' : 'assets', // 项目的静态文件路径

  outputDir, // 所有输出文件的目标路径

  publicPath: '', // 输出解析文件的目录，url 相对于 HTML 页面

  projectRoot: path.resolve(__dirname, './') // 项目根目录

};

config.outputPath = path.resolve(config.projectRoot, config.outputDir); // 输出的目录路径

module.exports = config;