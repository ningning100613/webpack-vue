const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const webpack = require('webpack')
const apiConfig = require('./api');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',//将编译后的代码映射回原始源代码
  devServer: {
    port: 8080,
    //host: 'localhost', 
    host: '0.0.0.0',
    // overlay: {
    //   errors: true
    // },
    hot: true, //开启HRM功能 实现局部刷新
    historyApiFallback: {
      index: '/index.html' //如果找不到界面就返回默认首页
    },
    compress: true, //启动gzip压缩
    open: true, //自动打开浏览器
    clientLogLevel: 'none', //不要显示启动服务器日志信息
    quiet: true, //除了一些基本启动信息以外，其他内容不要显示
    overlay: false,//如果出错了，不要全屏提示
    //服务器代理，解决开发环境跨域问题
    proxy: {
      //一旦devServer(5000)服务器接收到  /api/xxxx 的请求，就会把请求转发到另外一个服务器(3000)  
      '/api': {
        target: 'http://localhost:3000',
        //发送请求时，请求路径重写： 将 /api/xxxx ---> /xxxx  (去掉/api)
        //请求到 /api/xxx 现在会被代理到请求 http://localhost:3000/xxx
        pathRewrite: {
          '^/api':''
        }
      }
    },
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),//显示模块的相对路径
    // new webpack.HotModuleReplacementPlugin(),//模块热替换插件
    // new webpack.NoEmitOnErrorsPlugin()//在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段

    //webpack.DefinePlugin 添加配置文件，构建期间自动检测环境变化，也就是如何根据NODE_ENV引入配置文件 https://blog.csdn.net/weixin_33872660/article/details/87972955
    new webpack.DefinePlugin({ 
      API_CONFIG: JSON.stringify(apiConfig)
    })
  ]
})
