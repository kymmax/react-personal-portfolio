const paths = require('./paths'); // Import paths configuration
const glob = require('glob'); // Import glob package for file path matching

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // for cleaning build directories
const CopyWebpackPlugin = require('copy-webpack-plugin'); // for copying files
const HtmlWebpackPlugin = require('html-webpack-plugin'); // for generating HTML files
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // for extracting CSS to files
// const tailwindcss = require('tailwindcss'); // for styling
const autoprefixer = require('autoprefixer'); // for adding vendor prefixes to CSS rules

// Function to generate entry points for webpack
function generateEntries() {
  
  const entry = {};
  const entryFiles = glob.sync(paths.src + '/pages/**/*.js'); // Get all JavaScript files under 'src/pages' directory

  entryFiles.forEach(entryFile => {
    const key = entryFile.replace('.js', '').split('pages/')[1]; // Generate entry key from file path
    entry[key] = entryFile;
  });

  return entry;
}

let entries = generateEntries();

// Function to generate HtmlWebpackPlugin instances for each entry
function generateHtmlWebpackPlugin(){

  let html = [];
  Object.keys(entries).forEach(function (pathname) {
    var conf = {
      template: paths.public + '/' + pathname + '.html', // Specify template HTML file
      filename: pathname + '.html', // Specify output HTML file name
      // inject: true,  // Auto-inject scripts into HTML
      // minify: false  // Disable HTML minification
    };
    if (pathname in entries) {
      conf.chunks = [pathname];  // Specify which chunks to include in the HTML file
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

    // Extracts CSS to separate files
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',  // Specify output file name for CSS
      chunkFilename: 'styles/[id].[contenthash].css',  // Specify output file name for CSS chunks
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
          'css-loader',  // Resolve @import and url() paths
          {
            loader: 'postcss-loader', // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  // tailwindcss, 
                  autoprefixer
                ],
              },
            },
          },
          'sass-loader',  // Compile SASS to CSS
        ],
      },

      // SVG files: Use @svgr/webpack to handle SVG as React components
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg|hdr)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      // { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },
    ],
  },
}

