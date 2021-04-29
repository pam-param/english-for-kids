const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const fileName = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const cssLoaders = (extra) => {
  const config = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '',
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    }];

  if (extra) {
    config.push(extra);
  }

  return config;
};

const babelOptions = (preset) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './js/index.js', './styles/styles.scss'],

  },
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  devtool: isDev ? 'source-map' : false,

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 5700,
    open: {
      app: ['chrome'],
    },
  },

  plugins: [
    new ESLintPlugin(),
    new FaviconsWebpackPlugin('./assets/icon/logo.png'),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: fileName('css'),

    }),
  ],
  module: {
    rules: [
      {
        test: /\.(?:gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'audio/[name][ext]',
        },

      },
      {
        test: /\.svg$/,
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.scss$/,
        use: cssLoaders({
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
      {
        test: /.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
