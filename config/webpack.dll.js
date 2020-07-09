/** 
 * 使用dll技术，对某些库（第三方库：jquery、vue、react...）进行单独打包
*/

const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    //最终打包生成的 [name] ---> jquery
    //['jquery']  要打包的库是jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dist/dll'),
    library: '[name]_[hash]', //打包的库里面向外暴露出去的名字
  },
  plugins: [

    //打包生成一个 manifest.json ---> 提供和jquery映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', //映射库的暴露的内容名称
      path: resolve(__dirname, '../dist/dll/manifest.json'), //输出文件路径
    })
  ],





}