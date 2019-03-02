const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('../project.config');

module.exports = {
  minimizer: config.isDevelopment ? [] : [
    new UglifyJsPlugin({
      exclude: /\.min\.js$/,
      cache: true,
      parallel: true, // 开启并行压缩，充分利用cpu
      sourceMap: false,
      extractComments: false, // 移除注释
      uglifyOptions: {
        compress: {
          unused: true,
          warnings: false,
          drop_debugger: true
        },
        output: {
          comments: false
        }
      }
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, // 禁用掉cssnano对于浏览器前缀的处理
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
    })
  ],
  runtimeChunk: 'multiple',
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        minSize: 30000,
        minChunks: 1,
        chunks: 'initial',
        priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
      },
      commons: {
        test: /[\\/]src[\\/]common[\\/]/,
        name: 'commons',
        minSize: 30000,
        minChunks: 3,
        chunks: 'initial',
        priority: -1,
        reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
      }
    }
  }
};