const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //自动删除webpack里的dist目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const webpack = require('webpack')
const apiConfig = require('./api');



module.exports = merge(common, {
  mode: 'production',
  //使用SplitChunksPlugin分割代码
  optimization: {
    splitChunks: {
      chunks: 'initial',
      // minSize: 30*1024, //分割的chunk最小为30kb
      // maxSize: 0 ,//最大没有限制
      // minChunks: 1,//要提取的chunk最少被引用1次
      // maxAsyncRequests: 5, //按需加载时并行加载的文件最大的数量
      // maxInitialRequests: 3,//入口js文件最大并行请求数量
      automaticNameDelimiter: '~',//名称连接符
      name: true,//可以使用命名规则

      // initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
      // async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
      // all: 匹配文件无论是否动态模块，都打包进该vendor
      cacheGroups: {//分割chunk的组
        commons: {
          name: 'commons', // 打包后的文件名
          chunks: 'initial',
          minChunks: 2,  // 模块最少被多少个入口文件依赖   大于等于minChunks设定的值该模块就会被打包到公用包中
          priority: 3, // 优先级配置，优先匹配优先级更高的规则，不设置的规则优先级默认为0
          minSize: 1
        },
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
          minSize: 1
          // priority: 1
        }
      }
    },
    //runtimeChunk 当前模块记录其他模块的hash单独打包一个文件 解决修改a文件导致b文件hash值变化
    runtimeChunk: {
      name: entrypoint => `manifest.${entrypoint.name}`
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:10].css'
    }),
    // new CleanWebpackPlugin()
    // 每一次打包都会删除dist文件夹，但是现在需要保留dll文件夹，不需要重复打包
    //忽略掉不需要删除的文件，相当于exclude,被忽略的文件需要在开头加上 "!"号，数组中必须带有"**/*"通配符
    //否则dist下的文件都不会被删除
    //删除指定文件/文件夹 path.resolve(__dirname, 'test6')
    // cleanOnceBeforeBuildPatterns: [
    //   path.resolve(__dirname, 'test6'),
    //   "**/*", "!1.js", "!images",
    //   path.resolve(__dirname, 'test5')
    //   ],
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        // path.resolve(__dirname, '../dist/css'),
        "**/*", "!dll", "!dll/jquery.js", "!dll/manifest.json",
      ],
    }),

    //webpack.DefinePlugin 添加配置文件，构建期间自动检测环境变化，也就是如何根据NODE_ENV引入配置文件
    new webpack.DefinePlugin({
      API_CONFIG: JSON.stringify(apiConfig)
    })


  ],
  devtool: 'eval-source-map', // 加入devtool配置  source-map的功能，将编译后的代码映射回原始源代码
  /** 
   * [inline- | hidden- | eval-][nosources-][cheap-[module-]]source-map
   * source-map 外部
   * inline-source-map 内联  只生成一个内联source-map
   *                   错误代码准确信息 和 源代码准确位置
   * hidden-source-map 外部
   *                   不能追踪源代码位置，只能提示到构建后代码的错误位置
   * eval-source-map 内联 每一个文件都生成对应的source-map，都在eval
   *                 错误代码准确信息 和 源代码准确位置
   * nosources-source-map 外部
   *                      错误代码准确信息，没有任何源代码信息
   * cheap-source-map 外部
   *                  错误代码准确信息 和 源代码准确位置 只能精确到行
   * cheap-module-source-map  外部
   *                          错误代码准确信息 和 源代码准确位置  module会将loader的source-map加入
   * 开发环境：速度快，调试更友好
   *        速度快（eval>inline>cheap>...）
   *        调试跟友好   source-map > cheap-module-source-map > cheap-source-map
   *    --> eval-source-map / eval-cheap-module-source-map 结合速度和调试更好一些(添加cheap-module更完整显示信息)
   * 生产环境
   *        内联会让代码变大，不考虑内联
   *        nosources-source-map  全部隐藏  
   *        hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
   *    ---> source-map / cheap-module-source-map
   */

})