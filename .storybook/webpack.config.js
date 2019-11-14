const path = require('path')

module.exports = async ({ config }) => {
  config.module.rules.push({
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
  });

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader',
    ],
    include: path.resolve(__dirname, '../app'),
  })

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};