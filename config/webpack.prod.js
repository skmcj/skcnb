// const path = require('path');
import path from 'path';
import { fileURLToPath, URL } from 'url';
import { themeName } from './config.js';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

const plugins = [];

/** 构建加载器 */
// 入口
// const entry = `./src/loader.ts`;
// // 出口
// const output = {
//   filename: `loader.js`,
//   path: path.resolve(__dirname, 'dist')
// };

/** 构建主题 */
// 入口
const entry = `./src/themes/${themeName}/index.ts`;
// 出口
const output = {
  filename: `themes/${themeName}.js`,
  path: path.resolve(__dirname, 'dist')
};

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
  mode: 'production',
  // 构建主题
  entry,
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
        test: /\.(ttf|otf|eot|woff2?)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
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
  output
};

export default config;
