const utils = require('./utils');
const path = require('path');
const config = require('../project.config');

// 预处理器配置
let vueLoader = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: utils.cssLoaders(),
    cssSourceMap: config.isDevelopment,
    // postcss: [require('postcss-cssnext')()]
  }
};
let urlLoader = [
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 1,
      name: path.posix.join(config.staticPath,
        'img/[name].[hash:7].[ext]')
    }
  }, {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 1,
      name: path.posix.join(config.staticPath,
        'media/[name].[hash:7].[ext]')
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 1,
      name: path.posix.join(config.staticPath,
        'fonts/[name].[hash:7].[ext]')
    }
  }];
let styleLoaders = utils.styleLoaders();

let babelLoader = {
  test: /\.js/,
  exclude: [
    // path.resolve(config.projectRoot, 'src/config')
  ],
  include: [
    path.resolve(config.projectRoot, 'src')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            'helpers': false,
            'regenerator': true
          }
        ],
        ['syntax-dynamic-import']
      ]
    }
  }
};

let loaders = [vueLoader, babelLoader, ...styleLoaders, ...urlLoader];

module.exports = loaders;
