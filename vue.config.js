const path = require('path')
const QiniuPlugin = require( 'qiniu-webpack-plugin' );
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SRC_PATH = path.resolve(__dirname, 'src')
const envVars = process.env

// const mode = process.env
// console.log(process.argv)
// // console.log(JSON.stringify(process.env))
// console.log(`build mode: ${mode}`);
// require('dotenv-flow').config({
//   node_env: mode
// })

console.log(process.env.NODE_ENV)
Object.keys(envVars).forEach((key) => {
  if (key.indexOf('VUE_APP') > -1) {
    console.log(`${key}: ${envVars[key]}`)
  }
})

module.exports = {
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [SRC_PATH]
        },
        additionalData: `@import "~@/style/imports.sass"`
      },
      scss: {
        additionalData: `@import "~@/style/imports.scss";`
      }
    }
  },
  configureWebpack: config => {
    if(process.env.NODE_ENV !== 'production') {
      config.devtool = 'eval-source-map'
    }
    if ( process.env.VUE_APP_OSS_CDN == 'true' ) {
      config.plugins.push(
        new QiniuPlugin({
          ACCESS_KEY: process.env.VUE_APP_QINIU_ACCESS_KEY,
          SECRET_KEY: process.env.VUE_APP_QINIU_SECRET_KEY,
          bucket: process.env.VUE_APP_QINIU_BUCKET,
          path: process.env.VUE_APP_QINIU_PATH
        })
      )
    }
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, process.env.VUE_APP_PRODUCT_MODEL == 'platform' ? "./newpc_bbc" : './newpc_b2c' ),
        to: path.resolve(__dirname, "./dist/newpc"),
        ignore: [".*"],
      }])
    )
    return {
      resolve: {
        alias: {
          '@/': path.resolve(__dirname, './src'),
          lodash: 'lodash-es'
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload') 
    config.plugins.delete('prefetch') 
  },
  // devServer: {
  //   port: 10086,
  //   disableHostCheck: true
  // }
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@/': path.resolve(__dirname, './src'),
  //       lodash: 'lodash-es'
  //     }
  //   }
  // }
  // chainWebpack(config) {
  //   config.module
  //     .rule('fonts')
  //     .test(/.(ttf|otf|eot|woff|woff2)$/)
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap((options) => {
  //       options = {
  //         // limit: 10000,
  //         name: '/static/fonts/[name].[ext]'
  //       }
  //       return options
  //     })
  //     .end()
  // }
}
