# Vue.js 构建配置优化说明

## 🚀 主要优化内容

### 1. 性能优化
- **开发环境**：使用 `eval-cheap-module-source-map` 提升构建速度
- **生产环境**：启用文件系统缓存，提升重复构建速度
- **代码分割**：优化 chunk 分割策略，分离第三方库和公共代码
- **并行处理**：根据 CPU 核心数启用并行构建

### 2. 代码压缩优化
- 移除 console.log、console.info、console.warn
- 移除 debugger 语句
- 移除代码注释
- 优化 TerserPlugin 配置

### 3. 资源优化
- **图片**：8KB 以下转为 base64，减少 HTTP 请求
- **字体**：4KB 以下转为 base64
- **CSS**：生产环境提取独立文件，忽略顺序警告
- **Gzip 压缩**：自动压缩静态资源

### 4. 开发体验优化
- 只在开发环境启用 ESLint
- 优化错误提示显示
- 改进热更新配置
- 添加更多路径别名

## 📁 新增路径别名

```javascript
// 可以使用以下别名简化导入路径
'@components': './src/components'
'@views': './src/views'
'@utils': './src/utils'
'@api': './src/api'
'@assets': './src/assets'
'@style': './src/style'
```

## 🔧 环境变量配置

创建对应的环境变量文件：
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.local` - 本地环境（不会被提交到 git）

### 必需的环境变量
```bash
# 应用配置
VUE_APP_PUBLIC_PATH=/
VUE_APP_PRODUCT_MODEL=platform

# OSS CDN 配置（可选）
VUE_APP_OSS_CDN=false
VUE_APP_ALIOSS_REGION=oss-cn-hangzhou
VUE_APP_ALIOSS_ACCESS_KEY_ID=your_key
VUE_APP_ALIOSS_ACCESS_KEY_SECRET=your_secret
VUE_APP_ALIOSS_BUCKET=your_bucket
```

## 📊 构建分析

启用 bundle 分析器查看打包结果：
```bash
ANALYZE=true npm run build
```

## 🛠️ 可选优化

### 1. 安装额外的优化插件
```bash
# Gzip 压缩
npm install --save-dev compression-webpack-plugin

# Bundle 分析
npm install --save-dev webpack-bundle-analyzer
```

### 2. CDN 外部依赖
如果使用 CDN，可以在 `configureWebpack.externals` 中配置：
```javascript
externals: {
  'vue': 'Vue',
  'element-ui': 'ELEMENT',
  'axios': 'axios'
}
```

### 3. PWA 支持
如果需要 PWA 功能，取消注释 pwa 配置部分。

## 🚨 注意事项

1. **OSS 上传**：确保 OSS 配置正确，避免构建失败
2. **文件复制**：确保 `newpc_bbc` 或 `newpc_b2c` 目录存在
3. **缓存清理**：如遇到缓存问题，删除 `node_modules/.cache` 目录
4. **内存限制**：大型项目可能需要增加 Node.js 内存限制：
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

## 📈 性能提升预期

- **开发环境**：构建速度提升 20-30%
- **生产环境**：包体积减少 15-25%
- **首屏加载**：通过代码分割和资源优化，提升 10-20%


前端：
 vue

 reference
 todo
 task