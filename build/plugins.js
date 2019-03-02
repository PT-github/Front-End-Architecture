const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const config = require('../project.config');

// 插件配置
let plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new MiniCssExtractPlugin({
    filename: config.isDevelopment ? '[name].css' : 'css/[name].[hash:7].css',
    chunkFilename: config.isDevelopment
      ? '[name].css'
      : 'css/[name].[chunkhash:7].css'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      ENV_CONFIG: '"' + config.env + '"',
      PUB_PROJECTNAME: config.isDevelopment ? '""' : '"' + config.pubProjectName + '"'
    }
  }),
  new CleanWebpackPlugin([config.outputDir], { // 清除上一次打包的文件
    root: config.projectRoot,
    verbose: true,
    dry: false
  }),
  new VueLoaderPlugin(), // vue-loader需要
  new HtmlWebpackPlugin({ // 指定打包的index.html模板
    filename: 'index.html',
    template: path.join(config.projectRoot, 'index.html'),
    inject: true
  })
  // new CopyWebpackPlugin([
  //   {
  //     from: path.resolve(config.projectRoot, 'lib'),
  //     to: path.resolve(config.outputPath, 'lib'),
  //     ignore: ['.*']
  //   }
  // ])
];

module.exports = plugins;
