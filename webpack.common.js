const __MajorVersionString__ = 0
const childProcess = require('child_process')
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const __MinorVersionString__ = childProcess.execSync('git rev-list HEAD --count').toString().replace(/\r?\n|\r/g,'');
const __versionString__ = `${__MajorVersionString__}.${__MinorVersionString__}`
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|otf)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.(html)$/i, 
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(mp3|wav)$/i, 
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(html)$/i,
        loader: 'string-replace-loader',
        options: {
          search: '{version\}',
          replace: __versionString__,
          flags: 'gi'
        }
      },
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  entry: {
    app: './src/index.tsx',
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
  ],
  output: {
    filename: `[name].${__versionString__}.bundle.js`,
    path: path.resolve(__dirname, 'build'),
  },
};