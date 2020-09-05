/**
 * Build config for electron 'Renderer Process' file
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'cheap-module-source-map',

  entry: ['./app/webapp/index.tsx'],

  output: {
    globalObject: 'self',
    path: path.join(__dirname, 'app/webapp/dist'),
    publicPath: './',
    filename: 'bundle.js',
    libraryTarget: 'umd'
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
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              'react-hot-loader/babel'
            ]
          }
        }
      }
    ]
  },

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

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
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackPlugin({
      template: './app/webapp/index.html'
    })
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'web'
})
