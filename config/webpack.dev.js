const paths = require('./paths')
const Dotenv = require('dotenv-webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },

  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),

  module: {
    rules: [
      // ... other rules
      {
        test: /\.[js]sx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              // ... other options
              plugins: [
                // ... other plugins
                require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
})
