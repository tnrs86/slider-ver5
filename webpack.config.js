const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = path.join(__dirname, '../src');
  
const appConfig = {
  mode: 'development',
  entry: './src/apps/view.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader
         ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  }, 
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: './src/page/page.pug',
      filename: './about/page-1.html',
      inject: true
    })
  ],
};

const testConfigView = {
  mode: 'development',
  entry: './tests/view/view_test2.ts', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'view.test.js'    
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  node: {
    module: "empty",
    fs: "empty",
    child_process: "empty"
  },
  externals: {
    puppeteer: 'require("puppeteer")',
    jsdom: 'require("jsdom")',
    jest: 'require("jest")',
    expect: 'require("jest")'
  },

};

const testConfigPresenter = {
  mode: 'development',
  entry: './tests/presenter/presenter_test.ts', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'presenter.test.js'    
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  node: {
    module: "empty",
    fs: "empty",
    child_process: "empty"
  },
  externals: {    
    jsdom: 'require("jsdom")'
  }
};

const testConfigModel = {
  mode: 'development',
  entry: './tests/model/model_test.ts', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'model.test.js'    
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  node: {
    module: "empty",
    fs: "empty",
    child_process: "empty"
  }
};

module.exports = [ testConfigPresenter ];