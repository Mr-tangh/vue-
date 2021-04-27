const path = require("path");
const resolvePath = dir => path.resolve(__dirname, dir);
console.log(resolvePath('src/components'), 'resolvePath');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')   //这里引入插件
module.exports = {
  mode: 'development',
  entry: path.join(__dirname,'../src/main.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',      // 打包后的文件名称
  },
  resolve: {
    extensions: ['*', '.js', '.vue'],
    alias: {
      '@src': resolvePath('../src'),
      '_c': resolvePath('../src/components')
    },
  },
  devServer: {
    publicPath: '/',
    host: 'localhost',
    hot: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        }
       
      },
      {
        test: /\.(less|css)(\?.*)?$/,
        use:['style-loader','css-loader', 'less-loader'] // 从右向左解析原则
      },
      {
        test:/\.(woff|woff2|eot|otf|ttf)$/,
        use:'file-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader',
          },
        },
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html')
    })
  ]
}