const path = require('path');
const config = require('./project.config');

module.exports = {
  mode: config.isDevelopment ? 'development' : 'production',
  entry: config.entry,
  module: {
    rules: require('./build/loaders')
  },
  resolve: require('./build/resolve'),
  devtool: config.isDevelopment ? 'eval-source-map' : '', // 生产环境不生成source-map
  devServer: {
    useLocalIp: true,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    progress: true,
    hot: true,
    disableHostCheck: true
  },
  externals: config.isDevelopment ? {} : { // 生产环境下，这些库不打包，由index.html引入
    // 'vue': 'Vue',
    // 'vue-router': 'VueRouter'
  },
  optimization: require('./build/optimization'),
  plugins: require('./build/plugins'),
  output: require('./build/output')
}