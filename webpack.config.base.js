/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const webpack = require('webpack')
const {
  dependencies: externals
} = require('./app/package.json');

const targetPlatform = process.env.TARGET_PLATFORM || 'electron'

module.exports = {
  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js',

    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      'node_modules',
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/(.*)\.TARGET_PLATFORM(\.*)/, function (resource) {
      resource.request = resource.request.replace(/\.TARGET_PLATFORM/, `.${targetPlatform}`)
    })
  ],

  externals: Object.keys(externals || {})
};
