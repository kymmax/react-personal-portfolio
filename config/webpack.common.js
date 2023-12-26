const paths = require('./paths')
const glob = require('glob')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extract css to files
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer') // help tailwindcss to work

// 

function generateEntries() {
  
  const entry = {};
  const entryFiles = glob.sync(paths.src + '/pages/**/*.js');

  entryFiles.forEach(entryFile => {
    const key = entryFile.replace('.js', '').split('pages/')[1];
    entry[key] = entryFile;
  });

  return entry;
}

let entries = generateEntries();

// 

function generateHtmlWebpackPlugin(){

  let html = [];
  Object.keys(entries).forEach(function (pathname) {
    var conf = {
      template: paths.public + '/' + pathname + '.html',
      filename: pathname + '.html',
      // inject: true,
      // minify: false
    };
    if (pathname in entries) {
      conf.chunks = [pathname];
    }
    html.push(new HtmlWebpackPlugin(conf));
  });

  return html;
}

let htmlWebpackPluginArray = generateHtmlWebpackPlugin();

// 

module.exports = {
  // Where webpack looks to start building the bundle
  entry: entries,

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: 'styles/[id].[contenthash].css',
    }),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.src + '/assets',
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    // Generates an HTML file from a template
    ...htmlWebpackPluginArray,

  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  tailwindcss, 
                  autoprefixer
                ],
              },
            },
          },
          'sass-loader',
        ],
      },

      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg|hdr)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },
    ],
  },
}

