const paths = require('./paths'); // Import paths configuration
const Dotenv = require('dotenv-webpack'); //for loading environment variables
const { merge } = require('webpack-merge'); // for merging configurations
const common = require('./webpack.common.js'); // Import common configuration
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); // for hot module replacement

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
    historyApiFallback: true, // Allow HTML5 History API fallback
    contentBase: paths.build, // Specify the directory to serve static files from
    open: true, // Open the default browser when server starts
    compress: true, // Enable gzip compression
    hot: true, // Enable hot module replacement
    port: 3000, // Specify port number
  },

  // Plugins for webpack build process
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(), // Enable React Refresh for fast development
  ].filter(Boolean),

  // Module rules for handling different file types
  module: {
    rules: [
      // ... other rules
      {
        test: /\.[js]sx?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'), // Use babel-loader for transpiling JavaScript
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
