// const path = require('path');
import path from 'path';
import { fileURLToPath, URL } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { themeName, template } from './config.js';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

const devServer = {
  static: {
    directory: path.join(__dirname, 'public')
  },
  compress: true,
  port: 3000,
  // host: 'localhost',
  host: '0.0.0.0',
  // open: true,
  hot: true
};

// 预览整体
// const plugins = [
//   new HtmlWebpackPlugin({
//     // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
//     template: path.resolve(__dirname, `public/index.html`),
//     // 是否插入JS
//     inject: false
//   })
// ];

// 预览某一页
const plugins = [
  new HtmlWebpackPlugin({
    // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
    template: path.resolve(__dirname, `public/templates/${template}.html`),
    // 是否插入JS
    inject: false
  })
];

const cssLoader = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  },
  'postcss-loader'
];

const scssLoader = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2
    }
  },
  'postcss-loader',
  'sass-loader'
];

const config = {
  mode: 'development',
  entry: `./src/themes/${themeName}/index.ts`,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: cssLoader
      },
      {
        test: /\.scss$/i,
        use: scssLoader
      },
      {
        test: /\.(jpg|png|svg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'imgs/[name]-[hash:6][ext]'
        }
      },
      {
        test: /\.(ttf|otf|eof|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]-[hash:6][ext]'
        }
      }
    ]
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.js']
  },
  output: {
    filename: `themes/${themeName}.js`,
    path: path.resolve(__dirname, 'dist')
  },
  devServer
};

export default config;
