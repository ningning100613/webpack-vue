const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',//将编译后的代码映射回原始源代码
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    hot: true, //实现局部刷新
    historyApiFallback: {
      index: '/index.html'
    }
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),//显示模块的相对路径
    // new webpack.HotModuleReplacementPlugin(),//模块热替换插件
    // new webpack.NoEmitOnErrorsPlugin()//在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段
  ]
})
