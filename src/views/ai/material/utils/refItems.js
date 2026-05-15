/**
 * AI 素材输入条共用工具：
 *   1) 把 referenceImages / referenceVideos / referenceAudios 三类素材按"图片N / 视频N / 音频N"
 *      的位置规则编号，得到 PromptInput @ 引用候选的扁平列表
 *   2) 提供 @ 引用文本的匹配正则
 *
 * 注意编号规则：每种 kind 内独立从 1 开始计数（与 MultiMediaUpload.itemsWithLabel 对齐）。
 */

export const KIND_LABELS = { image: '图片', video: '视频', audio: '音频' }

/**
 * 把 image/video/audio 三个数组合并为带 label 的扁平 items 列表。
 * @param {{images?:string[], videos?:string[], audios?:string[]}} input
 * @returns {{kind:'image'|'video'|'audio', url:string, label:string}[]}
 */
export function buildRefItems({ images = [], videos = [], audios = [] } = {}) {
  const out = []
  ;(images || []).forEach((u, i) => {
    if (u) out.push({ kind: 'image', url: u, label: KIND_LABELS.image + (i + 1) })
  })
  ;(videos || []).forEach((u, i) => {
    if (u) out.push({ kind: 'video', url: u, label: KIND_LABELS.video + (i + 1) })
  })
  ;(audios || []).forEach((u, i) => {
    if (u) out.push({ kind: 'audio', url: u, label: KIND_LABELS.audio + (i + 1) })
  })
  return out
}

/**
 * 用于回填解析：扫描提示词字符串中的 @图片1 / @视频2 / @音频3 这类引用片段。
 * 注意：g 标志 + lastIndex 重置由调用方处理；此处仅返回正则字面量。
 */
export function atRefRegex() {
  return /@(图片|视频|音频)(\d+)/g
}

/** kind 中文名 -> kind key */
export const LABEL_KIND_MAP = { 图片: 'image', 视频: 'video', 音频: 'audio' }
