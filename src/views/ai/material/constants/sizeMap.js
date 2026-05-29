/**
 * AI 素材库 - 分辨率/比例 → 像素映射
 */
export const RESOLUTIONS = [
  { value: '2K', label: '2K', disabled: false },
  { value: '3K', label: '3K', disabled: false },
  { value: '4K', label: '4K', disabled: true, tip: '即将开放' }
]
export const RESOLUTION_VALUES = RESOLUTIONS.map((r) => r.value)

export const RATIOS = [
  { label: '智能', value: 'auto' },
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '2:3', value: '2:3' },
  { label: '3:2', value: '3:2' },
  { label: '21:9', value: '21:9' }
]

export const SIZE_MAP = {
  '2K': {
    '1:1': '2048x2048',
    '3:4': '1728x2304',
    '4:3': '2304x1728',
    '16:9': '2848x1600',
    '9:16': '1600x2848',
    '3:2': '2496x1664',
    '2:3': '1664x2496',
    '21:9': '3136x1344'
  },
  '3K': {
    '1:1': '3072x3072',
    '3:4': '2592x3456',
    '4:3': '3456x2592',
    '16:9': '4096x2304',
    '9:16': '2304x4096',
    '3:2': '3744x2496',
    '2:3': '2496x3744',
    '21:9': '4704x2016'
  }
}

export const PIXEL_MIN = 3686400
export const PIXEL_MAX = 10404496
export const ASPECT_MIN = 1 / 16
export const ASPECT_MAX = 16
export const MAX_REF_IMAGES = 14
export const MAX_FILE_SIZE_MB = 10
export const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/gif'
]

// —— 视频生成常量（Seedance 2.0）——
export const VIDEO_RESOLUTIONS = [
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' }
]
export const VIDEO_RATIOS = [
  { label: '21:9', value: '21:9' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '1:1', value: '1:1' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' }
]
export const VIDEO_DURATIONS = [4, 5, 6, 7, 8, 9, 10, 12, 15]
export const VIDEO_MAX_REF_IMAGES = 9
export const VIDEO_MAX_REF_VIDEOS = 3
export const VIDEO_MAX_REF_AUDIOS = 3
export const VIDEO_MAX_FILE_SIZE_MB = 50
export const AUDIO_MAX_FILE_SIZE_MB = 15
export const VIDEO_ALLOWED_MIME = ['video/mp4', 'video/quicktime']
export const AUDIO_ALLOWED_MIME = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3']

export function resolveSize(resolution, ratio, customW, customH) {
  if (customW && customH && Number(customW) > 14 && Number(customH) > 14) {
    return `${Number(customW)}x${Number(customH)}`
  }
  if (resolution && ratio && SIZE_MAP[resolution] && SIZE_MAP[resolution][ratio]) {
    return SIZE_MAP[resolution][ratio]
  }
  return '2048x2048'
}

export function parseSize(size) {
  if (!size || typeof size !== 'string') return { w: 0, h: 0 }
  const m = size.split('x')
  return { w: Number(m[0]) || 0, h: Number(m[1]) || 0 }
}

export function validatePixel(w, h) {
  const wn = Number(w)
  const hn = Number(h)
  if (!wn || !hn) return '请填写宽高'
  if (wn <= 14 || hn <= 14) return '宽高需大于 14px'
  const area = wn * hn
  if (area < PIXEL_MIN) return '总像素过低（最低 3,686,400）'
  if (area > PIXEL_MAX) return '总像素过高（最大 10,404,496）'
  const ratio = wn / hn
  if (ratio < ASPECT_MIN || ratio > ASPECT_MAX) return '宽高比超出范围 [1/16, 16]'
  return ''
}
