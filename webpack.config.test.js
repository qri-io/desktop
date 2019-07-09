/** Used in .babelrc for 'test' environment */

const devConfig = require('./webpack.config.development');

module.exports = {
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    // Use base + development rules, but exclude 'babel-loader'
    rules: devConfig.module.rules.slice(1)
  }
};
