const fs = require('fs')
const path = require('path')

// 定义不同文件类型的开源标识模板
const LICENSE_HEADERS = {
  js: `/*
 * +----------------------------------------------------------------------
 * | ECShopX open source E-commerce
 * | ECShopX 开源商城系统 
 * +----------------------------------------------------------------------
 * | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
 * +----------------------------------------------------------------------
 * | Corporate Website:  https://www.shopex.cn 
 * +----------------------------------------------------------------------
 * | Licensed under the Apache License, Version 2.0
 * | http://www.apache.org/licenses/LICENSE-2.0
 * +----------------------------------------------------------------------
 * | The removal of shopeX copyright information without authorization is prohibited.
 * | 未经授权不可去除shopeX商派相关版权
 * +----------------------------------------------------------------------
 * | Author: shopeX Team <mkt@shopex.cn>
 * | Contact: 400-821-3106
 * +----------------------------------------------------------------------
 */
`,
  css: `/*
 * +----------------------------------------------------------------------
 * | ECShopX open source E-commerce
 * | ECShopX 开源商城系统 
 * +----------------------------------------------------------------------
 * | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
 * +----------------------------------------------------------------------
 * | Corporate Website:  https://www.shopex.cn 
 * +----------------------------------------------------------------------
 * | Licensed under the Apache License, Version 2.0
 * | http://www.apache.org/licenses/LICENSE-2.0
 * +----------------------------------------------------------------------
 * | The removal of shopeX copyright information without authorization is prohibited.
 * | 未经授权不可去除shopeX商派相关版权
 * +----------------------------------------------------------------------
 * | Author: shopeX Team <mkt@shopex.cn>
 * | Contact: 400-821-3106
 * +----------------------------------------------------------------------
 */
`,
  html: `<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
`
}

/**
 * 获取文件扩展名对应的许可证头部
 * @param {string} filePath 文件路径
 * @returns {string|null} 许可证头部内容
 */
function getLicenseHeader(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  
  switch (ext) {
    case '.js':
    case '.mjs':
      return LICENSE_HEADERS.js
    case '.css':
      return LICENSE_HEADERS.css
    case '.html':
    case '.htm':
      return LICENSE_HEADERS.html
    default:
      return null
  }
}

/**
 * 检查文件是否已经包含开源标识
 * @param {string} content 文件内容
 * @returns {boolean} 是否已包含开源标识
 */
function hasLicenseHeader(content) {
  return content.includes('ECShopX open source E-commerce') || 
         content.includes('ECShopX 开源商城系统') ||
         content.includes('ShopeX,Inc.All rights reserved') ||
         content.includes('shopeX Team')
}

/**
 * 为单个文件添加开源标识
 * @param {string} filePath 文件路径
 */
function addLicenseToFile(filePath) {
  try {
    const licenseHeader = getLicenseHeader(filePath)
    if (!licenseHeader) {
      return // 不支持的文件类型，跳过
    }

    const content = fs.readFileSync(filePath, 'utf8')
    
    // 检查是否已经包含开源标识
    if (hasLicenseHeader(content)) {
      console.log(`⏭️  跳过已有开源标识的文件: ${filePath}`)
      return
    }

    // 添加开源标识到文件开头
    const newContent = licenseHeader + content
    fs.writeFileSync(filePath, newContent, 'utf8')
    
    console.log(`✅ 已添加开源标识: ${filePath}`)
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
  }
}

/**
 * 递归遍历目录并处理文件
 * @param {string} dir 目录路径
 * @param {Array<string>} excludeDirs 排除的目录名
 */
function processDirectory(dir, excludeDirs = []) {
  try {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (excludeDirs.includes(item)) {
          console.log(`⏭️  跳过目录: ${fullPath}`)
          continue
        }
        // 递归处理子目录
        processDirectory(fullPath, excludeDirs)
      } else if (stat.isFile()) {
        // 处理文件
        addLicenseToFile(fullPath)
      }
    }
  } catch (error) {
    console.error(`❌ 处理目录失败 ${dir}:`, error.message)
  }
}

/**
 * 主函数
 */
function main() {
  const buildDir = path.resolve(__dirname, '../dist')
  
  console.log('🚀 开始为构建产物添加开源标识...')
  console.log(`📁 构建目录: ${buildDir}`)
  
  if (!fs.existsSync(buildDir)) {
    console.error('❌ 构建目录不存在，请先执行构建命令')
    process.exit(1)
  }
  
  // 排除不需要添加开源标识的目录
  const excludeDirs = [
    'img',
    'fonts',
    'favicon',
    'icons'
  ]
  
  processDirectory(buildDir, excludeDirs)
  
  console.log('✅ 开源标识添加完成！')
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = {
  addLicenseToFile,
  processDirectory,
  main
}
