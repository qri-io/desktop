/**
 * Build config for electron 'Renderer Process' file
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./webpack.config.base')

var sourcePath = __dirname

module.exports = merge(baseConfig, {
  context: sourcePath,
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  entry: ['./app/webapp/index.tsx'],

  output: {
    globalObject: 'self',
    path: path.join(__dirname, 'app/webapp/dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
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
        'ENABLE_COMPARE_SECTION': JSON.stringify(true),
        'TARGET_PLATFORM': JSON.stringify('web'),
        'REMOTE': JSON.stringify(process.env.REMOTE),
        'DEV': JSON.stringify(true)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackPlugin({
      template: './app/webapp/index_dev.html'
    })
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'web',

  devServer: {
    contentBase: path.join(sourcePath, 'app/webapp'),
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },

  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
})
