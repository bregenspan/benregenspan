const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { ANALYZE } = process.env;

const extraPlugins = ANALYZE ? [new BundleAnalyzerPlugin()] : [];

const extractSass = new ExtractTextPlugin({
  filename: '[name].[md5:contenthash:base36:8].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: {
    'index': './src/js/main',
    '404': './src/js/404'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    hashDigestLength: 10 // Note: MD5 hex digest by default. Probably not worth writing a plugin to use base36
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpg|gif|eot|woff|ttf|svg|pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[md5:hash:base36:8].[ext]'
            }
          },
          'img-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          interpolate: true
        }
      }
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src/js'),
      path.resolve(__dirname, 'src/scss')
    ],
    extensions: ['.js', '.css', '.scss']
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter: assetFilename => {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: 'source-map',

  context: __dirname,

  target: 'web',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    // hot: true,
    https: false
  },

  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      chunks: ['index'],
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      chunks: ['404'],
      filename: '404.html',
      template: 'src/404.html'
    }),
    new HtmlWebpackHarddiskPlugin(),
    ...extraPlugins
  ]
};
