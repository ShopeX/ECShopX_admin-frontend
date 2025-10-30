const path = require('path')
const QiniuPlugin = require('qiniu-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAliyunOss = require('webpack-aliyun-oss')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const bodyParser = require('body-parser')
const webpackPluginsAutoI18n = require('webpack-auto-i18n-plugin')
const { YoudaoTranslator, EmptyTranslator, Translator } = require('webpack-auto-i18n-plugin')
const axios = require('axios')
const { generateId } = require('./build/utils')

const AutoI18nOptions = {
  excludedPath: ['/src/i18n/index.js'],
  globalPath: path.resolve(__dirname, './src/i18n/lang'),
  targetLangList: ['en', 'zh-tw'],
  rewriteConfig: false,
  includePath: [/src\//, /node_modules\/element-ui\//]
}

if (process.env.NODE_ENV === 'development') {
  AutoI18nOptions['translator'] = new YoudaoTranslator({
    appId: process.env.VUE_YOUDAO_APPID,
    appKey: process.env.VUE_YOUDAO_APPKEY
  })
}

const i18nPlugin = new webpackPluginsAutoI18n.default(AutoI18nOptions)

const SRC_PATH = path.resolve(__dirname, 'src')
const envVars = process.env
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

// 输出环境变量信息
console.log(`🚀 构建模式: ${process.env.NODE_ENV}`)
console.log(`🚀 构建平台: ${process.env.PLATFORM}`)
console.log('📋 环境变量:')
Object.keys(envVars).forEach((key) => {
  if (key.indexOf('VUE_APP') > -1) {
    console.log(`  ${key}: ${envVars[key]}`)
  }
})

// 在构建完成后复制微前端文件
const getNewpcCopyConfig = () => {
  const sourceDir = process.env.PLATFORM === 'bbc' ? './newpc_bbc' : './newpc_b2c'
  return {
    patterns: [
      {
        from: path.resolve(__dirname, sourceDir),
        to: path.resolve(__dirname, './dist/newpc'),
        noErrorOnMissing: true
      }
    ]
  }
}

module.exports = {
  // 基础配置
  lintOnSave: isDev, // 只在开发环境启用 lint
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  runtimeCompiler: true,
  productionSourceMap: false, // 生产环境不生成 source map

  // CSS 配置
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [SRC_PATH]
        },
        additionalData: `@import "~@/styles/imports.sass"`
      },
      scss: {
        additionalData: `@import "~@/styles/imports.scss";`
      }
    },
    // 生产环境提取 CSS
    extract: isProd
      ? {
          ignoreOrder: true // 忽略 CSS 顺序警告
        }
      : false
  },

  // Webpack 配置
  configureWebpack: (config) => {
    // 开发环境配置
    if (isDev) {
      config.devtool = 'eval-cheap-module-source-map' // 更快的 source map
      // 开发环境性能优化
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      }
    }

    // 生产环境优化
    if (isProd) {
      // 代码压缩配置
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.warn']
              },
              output: {
                comments: false
              }
            },
            extractComments: false,
            parallel: true
          }),
          new CssMinimizerPlugin({
            parallel: true,
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: false
                }
              ]
            }
          })
        ],
        // 代码分割优化
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            elementUI: {
              name: 'chunk-elementUI',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              priority: 30,
              chunks: 'all',
              reuseExistingChunk: true
            },
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              chunks: 'all',
              reuseExistingChunk: true
            },
            commons: {
              name: 'chunk-commons',
              minChunks: 2,
              priority: 10,
              chunks: 'all',
              reuseExistingChunk: true
            },
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
              priority: 40,
              reuseExistingChunk: true
            }
          }
        }
      }

      // 在主构建流程中添加文件复制插件
      config.plugins.push(new CopyWebpackPlugin(getNewpcCopyConfig()))
    }

    // OSS CDN 上传配置
    if (process.env.VUE_APP_OSS_CDN === 'true') {
      try {
        config.plugins.push(
          new WebpackAliyunOss({
            from: ['./dist/**', '!./dist/**/*.html', '!./dist/**/*.ico'],
            dist: '/ecshopx-admin',
            region: process.env.VUE_APP_ALIOSS_REGION,
            accessKeyId: process.env.VUE_APP_ALIOSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.VUE_APP_ALIOSS_ACCESS_KEY_SECRET,
            bucket: process.env.VUE_APP_ALIOSS_BUCKET,
            deleteAll: false, // 不删除远程文件
            timeout: 120000 // 2分钟超时
          })
        )
        console.log('✅ OSS CDN 上传插件已启用')
      } catch (error) {
        console.warn('⚠️  OSS CDN 配置错误:', error.message)
      }
    }

    // 别名配置
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'assets': path.resolve(__dirname, './src/assets'),
          'components': path.resolve(__dirname, './src/components'),
          'lodash': 'lodash-es'
        },
        extensions: ['.js', '.vue', '.json', '.ts', '.png', '.jpg', '.jpeg', '.gif', '.svg'],
        modules: ['node_modules', path.resolve(__dirname, 'src')]
      },
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4 * 1024 // 4kb
              }
            },
            generator: {
              filename: 'img/[name].[hash:8][ext]'
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4 * 1024 // 4kb
              }
            },
            generator: {
              filename: 'fonts/[name].[hash:8][ext]'
            }
          }
        ]
      },
      performance: {
        hints: 'warning',
        maxEntrypointSize: 1024 * 1024, // 入口文件大小限制为1MB
        maxAssetSize: 1024 * 1024 // 单个资源大小限制为1MB
      }
    }
  },

  // Webpack 链式配置
  chainWebpack: (config) => {
    // 删除预加载和预获取
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.plugin('i18n').use(i18nPlugin)

    config.plugin('define').tap((args) => {
      args[0]['process.env'] = {
        ...args[0]['process.env'],
        // 添加自定义环境变量
        VUE_APP_PLATFORM: JSON.stringify(process.env.PLATFORM || 'bbc')
      }
      return args
    })

    // 生产环境优化
    if (isProd) {
      // 启用 gzip 压缩
      const CompressionPlugin = require('compression-webpack-plugin')
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240, // 只压缩大于10kb的文件
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 保留原文件
        })
      )

      // 优化CSS提取
      config.plugin('mini-css-extract').use(MiniCssExtractPlugin, [
        {
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css',
          ignoreOrder: true // 忽略 CSS 顺序警告
        }
      ])

      // Bundle 分析（可选）
      if (process.env.ANALYZE) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin)
      }
    }

    // 优化图片加载
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .type('asset')
      .parser({
        dataUrlCondition: {
          maxSize: 4096 // 4kb
        }
      })
      .set('generator', {
        filename: 'img/[name].[hash:8][ext]'
      })

    // 添加别名
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('assets', path.join(__dirname, 'src/assets'))
      .set('components', path.join(__dirname, 'src/components'))

    // 配置字体资源处理
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .type('asset')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 4 * 1024 // 4kb
        }
      })
      .set('generator', {
        filename: 'fonts/[name].[hash:8][ext]'
      })
  },

  // 开发服务器配置
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    compress: true, // 启用 gzip 压缩
    historyApiFallback: true, // 支持 HTML5 History API
    // 添加中间件来解析请求体
    setupMiddlewares: (middlewares, devServer) => {
      // 添加body-parser中间件来解析请求体
      devServer.app.use(bodyParser.json())
      devServer.app.use(bodyParser.urlencoded({ extended: true }))
      return middlewares
    },
    // 性能优化
    client: {
      logging: 'warn', // 只显示警告和错误
      progress: true,
      overlay: {
        errors: true,
        warnings: false
      }
    }
    // 代理配置 - 支持所有HTTP方法 (GET, POST, PUT, DELETE, PATCH等)
    // proxy: {
    //   '/website/decorate': {
    //     target: process.env.VUE_APP_TEMPLATE_URL,
    //     changeOrigin: true,
    //     secure: false, // 支持https
    //     // pathRewrite:{
    //     //   '^/website/decorate': '/template'
    //     // }
    //   },
    //   '/_nuxt': {
    //     target: process.env.VUE_APP_TEMPLATE_URL,
    //     changeOrigin: true,
    //     secure: false, // 支持https
    //     // pathRewrite:{
    //     //   '^/post_template': ''
    //     // }
    //   },
    //   '/api': {
    //     target: 'https://test-dtc-sit.amandax.com.cn',
    //     changeOrigin: true,
    //     // secure: false, // 支持https
    //     // 支持所有HTTP方法
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    //     // 处理请求体
    //     onProxyReq: (proxyReq, req, res) => {
    //       // 记录详细的请求信息
    //       console.log('🔍 代理请求详情:')
    //       console.log('  Method:', req.method)
    //       console.log('  URL:', req.url)
    //       // 处理POST/PUT/PATCH请求的请求体
    //       if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    //         const bodyData = JSON.stringify(req.body);
    //         proxyReq.setHeader('Content-Type', 'application/json');
    //         proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    //         proxyReq.write(bodyData);
    //         console.log('  ✅ 请求体已设置:', bodyData)
    //       } else {
    //         console.log('  ⚠️  没有请求体或不是POST/PUT/PATCH请求')
    //       }
    //     },
    //     // 处理响应
    //     onProxyRes: (proxyRes, req, res) => {
    //       // 可以在这里添加响应处理逻辑
    //       console.log(`代理请求: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
    //     },
    //     // 错误处理
    //     onError: (err, req, res) => {
    //       console.error('代理错误:', err);
    //       res.writeHead(500, {
    //         'Content-Type': 'application/json'
    //       });
    //       res.end(JSON.stringify({ error: '代理请求失败' }));
    //     },
    //     pathRewrite: {
    //       // '^/api': ''
    //     }
    //   }
    // }
  },

  // 并行处理
  parallel: require('os').cpus().length > 1

  // PWA 配置（如果需要）
  // pwa: {
  //   name: 'EcshopX Admin',
  //   themeColor: '#4DBA87',
  //   msTileColor: '#000000',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black'
  // }
}
