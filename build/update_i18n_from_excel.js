#!/usr/bin/env node
/**
 * 从 Excel 文件更新 i18n JSON 文件
 * Excel 格式：多个 sheet，每个 sheet 有三列：中文、原文、新文本
 */
const fs = require('fs')
const path = require('path')
const ExcelJS = require('exceljs')

/**
 * 将 worksheet 转为二维数组（兼容原 xlsx sheet_to_json header:1 格式）
 */
function worksheetToArray(worksheet) {
  const jsonData = []
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    const rowData = []
    const maxCol = Math.max(worksheet.columnCount || 0, row.cellCount || 0)
    for (let col = 1; col <= maxCol; col++) {
      const cell = row.getCell(col)
      let value = cell.value
      if (value == null) {
        value = ''
      } else if (typeof value === 'object') {
        if (value.richText) {
          value = value.richText.map((item) => item.text).join('')
        } else if (value.text) {
          value = value.text
        } else if (value.result !== undefined) {
          value = value.result
        } else if (value instanceof Date) {
          value = value.toISOString()
        } else {
          value = String(value)
        }
      }
      rowData.push(value)
    }
    jsonData.push(rowData)
  })
  return jsonData
}

/**
 * 读取 Excel 工作簿
 */
async function readWorkbook(excelPath) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(excelPath)
  return workbook
}

/**
 * 判断文本是否包含中文字符
 */
function isChineseText(text) {
  if (!text) return false
  const str = String(text)
  return /[\u4e00-\u9fff]/.test(str)
}

/**
 * 判断文本是否主要是英文（包含英文字母且不包含中文）
 */
function isEnglishText(text) {
  if (!text) return false
  const textStr = String(text).trim()
  if (!textStr) return false
  const hasEnglish = /[a-zA-Z]/.test(textStr)
  const hasChinese = /[\u4e00-\u9fff]/.test(textStr)
  return hasEnglish && !hasChinese
}

/**
 * 建立索引：zh-cn -> [keys] 和 en -> [keys]，支持一个中文/英文对应多个 key
 */
function buildIndex(data) {
  const zhCnToKeys = new Map()
  const enToKeys = new Map()
  const keyToEntry = new Map()

  for (const [key, entry] of Object.entries(data)) {
    keyToEntry.set(key, entry)
    const zhCnValue = (entry['zh-cn'] || '').trim()
    const enValue = (entry.en || '').trim()

    // 如果 key 本身就是中文，也加入索引
    if (!zhCnValue && isChineseText(key)) {
      if (!zhCnToKeys.has(key)) {
        zhCnToKeys.set(key, [])
      }
      zhCnToKeys.get(key).push(key)
    } else if (zhCnValue) {
      if (!zhCnToKeys.has(zhCnValue)) {
        zhCnToKeys.set(zhCnValue, [])
      }
      zhCnToKeys.get(zhCnValue).push(key)
    }

    // 建立英文索引（忽略大小写和空格）
    if (enValue && isEnglishText(enValue)) {
      const enNormalized = enValue.toLowerCase().trim()
      if (!enToKeys.has(enNormalized)) {
        enToKeys.set(enNormalized, [])
      }
      enToKeys.get(enNormalized).push(key)
    }
  }

  return { zhCnToKeys, enToKeys }
}

/**
 * 通过中文查找匹配的 key（完全匹配，不使用模糊匹配）
 */
function findMatchingKeysByZhCn(zhCn, zhCnToKeys, data) {
  const matchedKeys = []

  // 确保中文文本已trim，用于完全匹配
  const zhCnTrimmed = String(zhCn || '').trim()
  if (!zhCnTrimmed) {
    return matchedKeys
  }

  // 首先检查 key 本身是否就是中文文本（完全匹配）
  if (data[zhCnTrimmed]) {
    matchedKeys.push(zhCnTrimmed)
  }

  // 通过索引查找（完全匹配）
  if (zhCnToKeys.has(zhCnTrimmed)) {
    for (const key of zhCnToKeys.get(zhCnTrimmed)) {
      if (!matchedKeys.includes(key)) {
        matchedKeys.push(key)
      }
    }
  }

  return matchedKeys
}

/**
 * 通过英文查找匹配的 key（完全匹配，不使用模糊匹配）
 * 只进行完全匹配，忽略大小写和首尾空格，但必须是完全相同的文本
 */
function findMatchingKeysByEn(enText, enToKeys, data) {
  const matchedKeys = []

  if (!enText || !isEnglishText(enText)) {
    return matchedKeys
  }

  // 归一化：去除首尾空格并转为小写，用于完全匹配
  const enNormalized = String(enText).trim().toLowerCase()
  if (!enNormalized) {
    return matchedKeys
  }

  // 只进行完全匹配（忽略大小写），确保文本完全相同
  // 不进行部分匹配、包含匹配或相似度匹配
  if (enToKeys.has(enNormalized)) {
    for (const key of enToKeys.get(enNormalized)) {
      if (!matchedKeys.includes(key)) {
        matchedKeys.push(key)
      }
    }
  }

  return matchedKeys
}

/**
 * 查找匹配的 key（优先中文，如果失败则尝试英文）
 * 返回匹配的keys和匹配类型
 */
function findMatchingKeys(zhCn, oldEn, zhCnToKeys, enToKeys, data) {
  // 首先尝试通过中文匹配（完全匹配）
  let matchedKeys = findMatchingKeysByZhCn(zhCn, zhCnToKeys, data)
  let matchType = 'zhCn'

  // 如果中文匹配失败，且原文是英文，则尝试通过英文匹配（完全匹配）
  if (matchedKeys.length === 0 && oldEn && isEnglishText(oldEn)) {
    matchedKeys = findMatchingKeysByEn(oldEn, enToKeys, data)
    matchType = 'en'
  }

  return { matchedKeys, matchType }
}

/**
 * 查找相似的中文文本（用于错误报告）
 */
function findSimilarText(zhCn, zhCnToKeys, data) {
  const similar = []
  const zhCnTrim = zhCn.trim()

  // 查找包含相同关键词的条目
  const keywords = zhCnTrim.split(/[\s，。、；：！？]/).filter((k) => k.length > 1)

  for (const [key, entry] of Object.entries(data)) {
    const entryZhCn = (entry['zh-cn'] || '').trim()
    if (!entryZhCn) continue

    // 计算相似度
    let similarity = 0

    // 完全匹配
    if (entryZhCn === zhCnTrim) {
      similarity = 100
    }
    // 包含关系
    else if (entryZhCn.includes(zhCnTrim) || zhCnTrim.includes(entryZhCn)) {
      similarity = 50
    }
    // 关键词匹配
    else {
      const matchedKeywords = keywords.filter((k) => entryZhCn.includes(k))
      if (matchedKeywords.length > 0) {
        similarity = (matchedKeywords.length / keywords.length) * 30
      }
    }

    if (similarity > 0) {
      similar.push({
        key: key,
        zhCn: entryZhCn,
        similarity: similarity
      })
    }
  }

  // 按相似度排序
  similar.sort((a, b) => b.similarity - a.similarity)

  return similar.slice(0, 5) // 返回前5个最相似的
}

/**
 * 智能识别列索引
 */
function detectColumns(headers) {
  let zhCnCol = null
  let oldEnCol = null
  let newEnCol = null

  // 查找列索引
  headers.forEach((header, idx) => {
    const headerStr = String(header || '')
      .trim()
      .toLowerCase()
    if (headerStr.includes('中文') || (idx === 0 && zhCnCol === null)) {
      zhCnCol = idx
    } else if (headerStr.includes('原文')) {
      oldEnCol = idx
    } else if (
      headerStr.includes('新文本') ||
      (headerStr.includes('新') && headerStr.includes('文本'))
    ) {
      newEnCol = idx
    }
  })

  // 如果没找到，使用默认顺序
  if (zhCnCol === null) {
    zhCnCol = 0
  }
  if (oldEnCol === null) {
    // 尝试找到第一个非空且非中文的列作为原文列
    for (let idx = 0; idx < headers.length; idx++) {
      if (idx !== zhCnCol && headers[idx]) {
        const headerStr = String(headers[idx]).trim()
        if (headerStr && (headerStr.includes('原文') || idx === 1)) {
          oldEnCol = idx
          break
        }
      }
    }
    if (oldEnCol === null) {
      oldEnCol = headers.length > 1 ? 1 : null
    }
  }
  if (newEnCol === null) {
    // 尝试找到"新文本"列
    for (let idx = 0; idx < headers.length; idx++) {
      if (idx !== zhCnCol && idx !== oldEnCol && headers[idx]) {
        const headerStr = String(headers[idx]).trim()
        if (headerStr.includes('新') || idx === 2) {
          newEnCol = idx
          break
        }
      }
    }
    if (newEnCol === null) {
      newEnCol = headers.length > 2 ? 2 : null
    }
  }

  return { zhCnCol, oldEnCol, newEnCol }
}

/**
 * 从 Excel 文件更新 JSON 文件
 * @param {string} excelPath - Excel文件路径
 * @param {string} jsonPath - JSON文件路径
 * @param {Object} data - 可选的JSON数据对象（用于批量处理时共享数据）
 * @returns {Object} 统计信息和更新后的数据对象
 */
async function updateJsonFromExcel(excelPath, jsonPath, data = null) {
  console.log(`正在读取 Excel 文件: ${excelPath}`)
  const workbook = await readWorkbook(excelPath)
  const sheetNames = workbook.worksheets.map((sheet) => sheet.name)

  // 读取现有 JSON 文件（如果未提供数据对象）
  if (!data) {
    console.log(`正在读取 JSON 文件: ${jsonPath}`)
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    data = JSON.parse(jsonContent)
  }

  console.log(`当前 JSON 文件包含 ${Object.keys(data).length} 个条目\n`)

  // 建立索引
  const { zhCnToKeys, enToKeys } = buildIndex(data)
  console.log(`已建立 ${zhCnToKeys.size} 个中文文本索引`)
  console.log(`已建立 ${enToKeys.size} 个英文文本索引\n`)

  // 统计信息
  const stats = {
    totalSheets: sheetNames.length,
    totalRows: 0,
    updated: [],
    failed: [],
    skipped: []
  }

  // 遍历所有 sheet
  console.log(`\n发现 ${sheetNames.length} 个 Sheet: ${sheetNames.join(', ')}\n`)
  console.log('开始处理所有 Sheet...\n')

  const processedSheets = []

  for (const sheetName of sheetNames) {
    console.log('='.repeat(60))
    console.log(
      `处理 Sheet: ${sheetName} (${sheetNames.indexOf(sheetName) + 1}/${sheetNames.length})`
    )
    console.log('='.repeat(60))

    const worksheet = workbook.getWorksheet(sheetName)
    const jsonData = worksheet ? worksheetToArray(worksheet) : []

    if (jsonData.length === 0) {
      console.log(`Sheet '${sheetName}' 为空，跳过\n`)
      continue
    }

    // 读取表头
    const headers = jsonData[0] || []
    console.log(`表头: ${JSON.stringify(headers)}\n`)

    // 智能识别列索引
    const { zhCnCol, oldEnCol, newEnCol } = detectColumns(headers)
    console.log(`列映射: 中文=${zhCnCol}, 原文=${oldEnCol}, 新文本=${newEnCol}\n`)

    // 从第二行开始读取数据
    let sheetRowCount = 0
    for (let rowIdx = 1; rowIdx < jsonData.length; rowIdx++) {
      const row = jsonData[rowIdx]

      // 跳过空行
      if (!row || !row[zhCnCol]) {
        continue
      }

      const zhCn = String(row[zhCnCol] || '').trim()
      if (!zhCn) {
        continue
      }

      sheetRowCount++
      stats.totalRows++

      // 获取原文和新文本
      const oldEn = oldEnCol !== null && row[oldEnCol] ? String(row[oldEnCol]).trim() : ''
      const newEn = newEnCol !== null && row[newEnCol] ? String(row[newEnCol]).trim() : ''

      // 判断原文是否未翻译（是中文）
      const isOldUntranslated = isChineseText(oldEn) || !oldEn

      // 确定要使用的英文翻译（优先使用新文本）
      let targetEn = newEn || (isEnglishText(oldEn) ? oldEn : '')

      if (!targetEn) {
        stats.skipped.push({
          sheet: sheetName,
          row: rowIdx + 1,
          zhCn: zhCn,
          reason: '没有可用的英文翻译'
        })
        continue
      }

      // 查找匹配的条目（优先中文，如果失败则尝试英文）
      const { matchedKeys, matchType } = findMatchingKeys(zhCn, oldEn, zhCnToKeys, enToKeys, data)

      if (matchedKeys.length === 0) {
        // 尝试查找相似的中文文本
        const similarKeys = findSimilarText(zhCn, zhCnToKeys, data)

        stats.failed.push({
          sheet: sheetName,
          row: rowIdx + 1,
          zhCn: zhCn,
          oldEn: oldEn || '(空)',
          targetEn: targetEn,
          reason: '未找到匹配的中文或英文条目',
          similarMatches: similarKeys.slice(0, 5) // 保存前5个相似匹配
        })
        continue
      }

      // 更新所有匹配的条目（严格验证完全匹配）
      let updatedAny = false
      const zhCnTrimmed = String(zhCn || '').trim()

      for (const key of matchedKeys) {
        const entry = data[key]
        const currentEn = (entry.en || '').trim()
        const currentZhCn = (entry['zh-cn'] || '').trim()

        // 严格验证：根据匹配类型进行完全匹配验证
        let isValidMatch = false

        if (matchType === 'zhCn') {
          // 通过中文匹配：验证中文必须完全相等（trim后）
          isValidMatch = currentZhCn === zhCnTrimmed
        } else if (matchType === 'en' && oldEn && isEnglishText(oldEn)) {
          // 通过英文匹配：验证英文必须完全相等（trim和toLowerCase后）
          const oldEnNormalized = String(oldEn).trim().toLowerCase()
          const currentEnNormalized = currentEn.toLowerCase()
          isValidMatch = currentEnNormalized === oldEnNormalized
        }

        if (!isValidMatch) {
          // 匹配的key但验证失败，跳过（说明索引可能有问题，不应该发生）
          console.warn(`警告: Key "${key}" 验证失败。匹配类型: ${matchType}。跳过更新。`)
          continue
        }

        // 如果原文未翻译，或者新文本与当前不同，则更新
        if (isOldUntranslated || (targetEn && currentEn !== targetEn)) {
          entry.en = targetEn

          // 只有当中文完全匹配时，才更新中文字段
          if (matchType === 'zhCn' && currentZhCn === zhCnTrimmed) {
            entry['zh-cn'] = zhCnTrimmed
          }
          updatedAny = true
        }
      }

      if (updatedAny) {
        stats.updated.push({
          sheet: sheetName,
          row: rowIdx + 1,
          zhCn: zhCn,
          oldEn: oldEn || '(空)',
          newEn: targetEn,
          matchedKeys: matchedKeys
        })
      } else {
        stats.skipped.push({
          sheet: sheetName,
          row: rowIdx + 1,
          zhCn: zhCn,
          reason: '英文翻译已是最新或无需更新'
        })
      }
    }

    console.log(`Sheet '${sheetName}' 处理完成，共处理 ${sheetRowCount} 行\n`)

    processedSheets.push({
      name: sheetName,
      rows: sheetRowCount,
      updated: stats.updated.filter((u) => u.sheet === sheetName).length,
      failed: stats.failed.filter((f) => f.sheet === sheetName).length,
      skipped: stats.skipped.filter((s) => s.sheet === sheetName).length
    })
  }

  // 显示所有 sheet 的处理摘要
  console.log('\n' + '='.repeat(60))
  console.log('所有 Sheet 处理摘要')
  console.log('='.repeat(60))
  processedSheets.forEach((sheet, idx) => {
    console.log(`\n${idx + 1}. Sheet: ${sheet.name}`)
    console.log(`   处理行数: ${sheet.rows}`)
    console.log(`   成功更新: ${sheet.updated} 条`)
    console.log(`   未匹配: ${sheet.failed} 条`)
    console.log(`   跳过: ${sheet.skipped} 条`)
  })
  console.log('\n' + '='.repeat(60))

  // 生成报告
  console.log('\n' + '='.repeat(60))
  console.log('更新报告')
  console.log('='.repeat(60))
  console.log(`总 Sheet 数: ${stats.totalSheets}`)
  console.log(`总处理行数: ${stats.totalRows}`)
  console.log(`成功更新: ${stats.updated.length} 条`)
  console.log(`跳过: ${stats.skipped.length} 条`)
  console.log(`失败: ${stats.failed.length} 条`)
  console.log('\n' + '='.repeat(60))

  // 详细报告：成功更新的条目
  if (stats.updated.length > 0) {
    console.log(`\n✅ 成功更新的条目 (${stats.updated.length} 条):`)
    console.log('-'.repeat(60))
    const displayCount = Math.min(20, stats.updated.length)
    for (let i = 0; i < displayCount; i++) {
      const item = stats.updated[i]
      console.log(`${i + 1}. [${item.sheet}] 行${item.row}`)
      console.log(`   中文: ${item.zhCn}`)
      console.log(`   原文: ${item.oldEn}`)
      console.log(`   新翻译: ${item.newEn}`)
      const keysDisplay = item.matchedKeys.slice(0, 3).join(', ')
      const moreKeys = item.matchedKeys.length > 3 ? '...' : ''
      console.log(`   匹配的 Key: ${keysDisplay}${moreKeys}`)
      console.log()
    }
    if (stats.updated.length > 20) {
      console.log(`   ... 还有 ${stats.updated.length - 20} 条已更新\n`)
    }
  }

  // 详细报告：失败的条目
  if (stats.failed.length > 0) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`❌ 未替换成功的条目 (${stats.failed.length} 条)`)
    console.log(`${'='.repeat(60)}\n`)

    stats.failed.forEach((item, i) => {
      console.log(`${i + 1}. 中文: "${item.zhCn}"`)
      console.log(`   英文: "${item.targetEn}"`)
      console.log()
    })

    // 生成便于搜索的文本文件
    const failedSearchPath = 'i18n_failed_search.txt'
    let searchContent = `未替换成功的条目\n`
    searchContent += `${'='.repeat(60)}\n\n`
    searchContent += `共 ${stats.failed.length} 条\n`
    searchContent += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`

    stats.failed.forEach((item, i) => {
      searchContent += `${i + 1}. 中文: "${item.zhCn}"\n`
      searchContent += `   英文: "${item.targetEn}"\n\n`
    })

    fs.writeFileSync(failedSearchPath, searchContent, 'utf-8')
    console.log(`\n📄 已生成文件: ${failedSearchPath}\n`)
  }

  // 详细报告：跳过的条目
  if (stats.skipped.length > 0) {
    console.log(`\n⏭️  跳过的条目 (${stats.skipped.length} 条):`)
    console.log('-'.repeat(60))
    const skippedByReason = {}
    stats.skipped.forEach((item) => {
      const reason = item.reason
      if (!skippedByReason[reason]) {
        skippedByReason[reason] = []
      }
      skippedByReason[reason].push(item)
    })

    for (const [reason, items] of Object.entries(skippedByReason)) {
      console.log(`\n原因: ${reason} (${items.length} 条)`)
      const displayCount = Math.min(10, items.length)
      for (let i = 0; i < displayCount; i++) {
        const item = items[i]
        console.log(`  ${i + 1}. [${item.sheet}] 行${item.row}: ${item.zhCn}`)
      }
      if (items.length > 10) {
        console.log(`  ... 还有 ${items.length - 10} 条`)
      }
    }
  }

  // 保存更新后的 JSON 文件（仅在单独调用时保存）
  // 批量处理时由主函数统一保存
  const shouldSave = !process.argv[2] || process.argv[2] === excelPath

  if (stats.updated.length > 0 && shouldSave) {
    // 备份原文件（仅在第一次保存时备份）
    const backupPath = jsonPath + '.backup'
    if (!fs.existsSync(backupPath)) {
      console.log(`\n正在备份原文件到: ${backupPath}`)
      const originalContent = fs.readFileSync(jsonPath, 'utf-8')
      fs.writeFileSync(backupPath, originalContent, 'utf-8')
    }

    // 保存更新后的文件
    console.log(`正在保存更新后的文件: ${jsonPath}`)
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, '\t'), 'utf-8')
    console.log('✅ 文件保存成功！')
  } else if (stats.updated.length === 0) {
    console.log('\n⚠️  没有条目需要更新，文件未修改')
  }

  // 保存详细报告到文件（每个文件单独保存报告）
  const reportPath = `i18n_update_report_${path.basename(excelPath, '.xlsx')}.json`
  fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2), 'utf-8')
  console.log(`\n详细报告已保存到: ${reportPath}`)

  return { stats, data }
}

// 主函数
async function main() {
  const jsonPath = 'src/i18n/lang/index.json'

  // 支持命令行参数指定 Excel 文件，或使用默认的4个文件
  const excelFiles = process.argv[2]
    ? [process.argv[2]]
    : ['gy.xlsx', 'gyg.xlsx', 'sale.xlsx', 'yd.xlsx']

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ 错误: JSON 文件不存在: ${jsonPath}`)
    process.exit(1)
  }

  let totalFailed = 0
  let totalUpdated = 0
  const allStats = []

  // 读取JSON文件（所有文件共享同一个数据对象）
  console.log(`正在读取 JSON 文件: ${jsonPath}`)
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
  let sharedData = JSON.parse(jsonContent)
  console.log(`初始 JSON 文件包含 ${Object.keys(sharedData).length} 个条目\n`)

  // 处理每个Excel文件
  for (const excelPath of excelFiles) {
    if (!fs.existsSync(excelPath)) {
      console.warn(`⚠️  警告: Excel 文件不存在: ${excelPath}，跳过`)
      continue
    }

    console.log('\n' + '='.repeat(80))
    console.log(`处理文件: ${excelPath}`)
    console.log('='.repeat(80))

    try {
      const result = await updateJsonFromExcel(excelPath, jsonPath, sharedData)
      sharedData = result.data // 更新共享的数据对象
      allStats.push({ file: excelPath, stats: result.stats })
      totalFailed += result.stats.failed.length
      totalUpdated += result.stats.updated.length
    } catch (error) {
      console.error(`\n❌ 处理文件 ${excelPath} 时发生错误: ${error.message}`)
      console.error(error.stack)
      // 继续处理其他文件
    }
  }

  // 批量处理时，统一保存更新后的JSON文件
  if (excelFiles.length > 1 && totalUpdated > 0) {
    // 备份原文件
    const backupPath = jsonPath + '.backup'
    if (!fs.existsSync(backupPath)) {
      console.log(`\n正在备份原文件到: ${backupPath}`)
      fs.writeFileSync(backupPath, jsonContent, 'utf-8')
    }

    // 保存更新后的文件
    console.log(`\n正在保存更新后的文件: ${jsonPath}`)
    fs.writeFileSync(jsonPath, JSON.stringify(sharedData, null, '\t'), 'utf-8')
    console.log('✅ 文件保存成功！')
  }

  // 汇总报告
  console.log('\n' + '='.repeat(80))
  console.log('所有文件处理汇总')
  console.log('='.repeat(80))
  console.log(`处理文件数: ${allStats.length}`)
  console.log(`总更新条目: ${totalUpdated}`)
  console.log(`总失败条目: ${totalFailed}`)

  // 返回码：如果有失败的条目，返回非0
  if (totalFailed > 0) {
    console.log(`\n⚠️  警告: 有 ${totalFailed} 条未找到匹配的条目`)
    process.exit(1)
  } else {
    console.log('\n✅ 所有条目处理完成！')
    process.exit(0)
  }
}

// 运行主函数
if (require.main === module) {
  main().catch((error) => {
    console.error(`\n❌ 发生错误: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  })
}

module.exports = { updateJsonFromExcel }
