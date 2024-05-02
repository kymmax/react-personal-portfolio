const paths = require('./paths'); // Import paths configuration
const Dotenv = require('dotenv-webpack'); // for loading environment variables
const { merge } = require('webpack-merge'); // for merging configurations
const common = require('./webpack.common.js'); // Import common configuration

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // for minifying CSS
const TerserPlugin = require('terser-webpack-plugin'); // for minifying JavaScript

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // Generate source maps for better debugging experience
  output: {
    path: paths.build,
    filename: 'js/[name].[contenthash].bundle.js',
    publicPath: '/react-personal-portfolio/',
  },
  plugins: [
    new Dotenv({
      path: './.env.production',
    }),
  ],
  module: {
    rules: [],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new TerserPlugin(),  // Minify JavaScript
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    hints: false, // Disable performance hints (false / "warning" / "error")
    maxEntrypointSize: 512000, // Set maximum entry point size
    maxAssetSize: 512000, // Set maximum asset size
  },
})
