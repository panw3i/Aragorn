const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  target: 'electron-renderer',
  entry: [path.resolve(__dirname, '../src/renderer/index.tsx')],
  output: {
    path: path.resolve(__dirname, '../dist/renderer'),
    publicPath: './',
    filename: devMode ? 'js/[name]-[hash:6].bundle.js' : 'js/[name]-[chunkhash:6].bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, '../'), 'node_modules', 'src'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
      fonts: path.resolve(__dirname, '../src/assets/font')
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        common: {
          minSize: 30000,
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]-[hash:base64:6].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name]-[contenthash:6].css',
      ignoreOrder: true
    }),
    new AntdDayjsWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
};
