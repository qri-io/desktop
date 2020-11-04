/**
 * Build config for electron 'Renderer Process' file
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'cheap-module-source-map',

  entry: ['./app/index'],

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../app/dist/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } } // or whatever your project requires
              ],
              '@babel/preset-typescript',
              '@babel/preset-react'
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ]
          }
        }
      }
    ]
  },

  plugins: [
    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // https://github.com/webpack/webpack/issues/864
    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.DefinePlugin({
      /**
       * compile-time flags are stored under a global __BUILD__ constant.
       * Useful for allowing different behaviour between development builds and
       * release builds. These should be synted with
       *
       */
      '__BUILD__': {
        'ENABLE_COMPARE_SECTION': JSON.stringify(true)
      }
    })
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer'
})
