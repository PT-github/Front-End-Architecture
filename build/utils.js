const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../project.config');
const path = require('path');

exports.cssLoaders = function() {

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: config.isDevelopment
    }
  };
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: config.isDevelopment
    }
  }

  // function generateLessLoaders() {
  //   var loaders = [
  //     MiniCssExtractPlugin.loader,
  //     cssLoader,
  //     postcssLoader,
  //     {
  //       loader: 'less-loader',
  //       options: {
  //         sourceMap: config.isDevelopment
  //       }
  //     },
  //     {
  //       loader: 'sass-resources-loader',
  //       options: {
  //         resources: [
  //           path.resolve(__dirname, '../src/assets/css/common.less'),
  //         ]
  //       }
  //     }
  //   ];
  //   return ['vue-style-loader'].concat(loaders)
  // }
  function generateScssLoaders() {
    var loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'
        }
      },
      cssLoader,
      postcssLoader,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: config.isDevelopment,
          // data: '@import "@/assets/css/_variable.scss"'
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/assets/css/_variable.scss'),
          ]
        }
      }
    ];
    return ['vue-style-loader'].concat(loaders)
  }

  function generateLoaders(loader, loaderOptions) {
    const loaders = [{
      loader:MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../'
      }
    }, cssLoader, postcssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: config.isDevelopment
        })
      });
    }
    return ['vue-style-loader'].concat(loaders);
  };
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    // less: generateLessLoaders(),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateScssLoaders()
  };

};

exports.styleLoaders = function() {
  const output = [];
  const loaders = exports.cssLoaders();

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};