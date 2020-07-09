const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');//自动生成HTML文件并引入我们打包好的JS和CSS文件。
const VueLoaderPlugin = require('vue-loader/lib/plugin');//处理分离出来的 .vue 文件

const resolve = dir => require('path').join(__dirname, dir)

//静态资源输出,将src目录下的assets文件夹复制到dist目录下
const CopyPlugin = require("copy-webpack-plugin");
//通过 link 引入CSS文件的方式
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

// const webpack = require('webpack')
/** 
 * babel缓存
 *  cacheDirectory:true
 * hash:每次webpack构建时会生成一个唯一的hash值
     问题：因为js和css同时使用一个hash值
      如果打包，会导致所有缓存失效。（可能只改动一个文件）
 * chunkhash:根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
     问题:js和css的hash值还是一样的
 * contenthash:根据文件的内容生成hash值，不同的文件hash值一定不一样    
 */

/** 
 * tree shaking :去除无用代码
 * 前提：1、必须使用es6模块化  2、开启production环境
 * 在package.json中  "sideEffects":false 所有代码没有副作用(都可以进行tree shaking)
 * 问题：可能会把css / @babel/polyfill (副作用)文件干掉 "sideEffects":["*.css", "*.sass"]
 * 
 */


const config = {
  // mode: 'none',
  //单入口
  entry: {
    main: path.join(__dirname, '../src/main.js')
  },

  //多入口
  // entry: {
  //   //多入口 ： 有一个入口，最终输出就有一个bundle
  //   main: path.join(__dirname, '../src/main.js'),
  //   helper: path.join(__dirname, '../src/helper.js')
  // },


  output: {
    // publicPath: './',
    // filename: '../dist/js/[name].bundle.js',
    filename: isDev ? '[name].bundle.js' : '[name].[contenthash:10].js',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    alias: {
      '@': resolve('../src'),
      '_c': resolve('../src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,  //排除 node_modules 文件夹中的文件
        use: [
          /** 
           * thread-loader  开启多进程
           * 进程启动大概600ms，进程通信也有开销，只有工作消耗时间比较长，才需要多进程打包
           */
          // 'thread-loader',
          //也可配置
          {
            loader: 'thread-loader',
            options: {
              workers: 2 //进程2个
            }
          },
          {
            loader: 'babel-loader',
            options: {
              //预设： 提示babel做怎么样的兼容性处理
              presets: [
                [
                  '@babel/preset-env',
                  {
                    //按需加载
                    useBuiltIns: 'usage',
                    //指定core-js版本
                    corejs: {
                      version: 3
                    },
                    //指定兼容性做到浏览器版本
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ],
              //开启babel缓存
              //第二次构建时，会读取之前的缓存
              cacheDirectory: true
            }
          }
        ],
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },

      {
        test: /\.scss$/,
        use: [
          // 'vue-style-loader',
          {
            loader: isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          // 'vue-style-loader',
          {
            loader: isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          // 'vue-style-loader',
          {
            loader: isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name].[ext]',
              esModule: false,
              outputPath: 'img/'
            }
          }
        ]
      },
      {
        test: /\.(ico)$/,
        loader: 'url-loader',
        options: {
          limit: 50,
          name: '[name].[ext]'//相对于path的路径
        }
      },

    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({ $: 'jquery', jQuery:'jquery' }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/assets'),
        },
      ],
    }),
    // new MiniCssExtractPlugin({
    //   filename: "[name].css"
    // }),
    new HtmlWebpackPlugin({
      title: 'webpack学习',
      template: path.join(__dirname, '../public/index.html'),
      inject: true,
      // 1、true或者body：所有JavaScript资源插入到body元素的底部
      // 2、head: 所有JavaScript资源插入到head元素中
      // 3、false： 所有静态资源css和JavaScript都不会注入到模板文件中
      minify: {
        removeComments: true, //清理html中的注释
        // collapseWhitespace: true, //清理html中的空格、换行符
        // minifyCSS: true, //压缩html内的样式,清理空格、换行和最后一个分号
        // minifyJS: true, //压缩html内的js
        // removeEmptyElements:true, //清理内容为空的元素
        // caseSensitive: true, //区分大小写的方式处理自定义标签内的属性
        // removeScriptTypeAttributes: true, //去掉script标签的type属性
        // removeStyleLinkTypeAttributes: true, //去掉style和link标签的type属性
      }
    })
  ],


  externals: {
    //拒绝jQuery被打包 helper.js即可不用import库，public/index.html中script引入对应cdn即可
    jquery: 'jQuery'
  }

}


module.exports = config