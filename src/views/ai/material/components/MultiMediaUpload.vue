<template>
  <div
    class="multi-media-upload"
    :class="{ 'is-dragover': dragOver }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="media-list">
      <!-- 上传占位（左侧 +） -->
      <el-upload
        v-if="canUploadMore"
        ref="uploadRef"
        action=""
        :show-file-list="false"
        :multiple="true"
        :http-request="handleUpload"
        :before-upload="beforeUpload"
        :accept="acceptStr"
        class="media-uploader"
      >
        <div class="media-item placeholder">
          <i v-if="!uploading" class="el-icon-plus"></i>
          <i v-else class="el-icon-loading"></i>
          <div class="hint">
            {{ items.length === 0 ? placeholder : items.length + '/' + totalMax }}
          </div>
        </div>
      </el-upload>

      <!-- 已上传项 -->
      <div
        v-for="(it, idx) in itemsWithLabel"
        :key="it.kind + ':' + it.url + ':' + idx"
        ref="items"
        class="media-item"
        :class="{ active: previewIdx === idx, ['k-' + it.kind]: true }"
        @mouseenter="hoverIdx = idx"
        @mouseleave="hoverIdx = -1"
      >
        <!-- 缩略图 -->
        <div class="thumb" @click.stop="togglePreview(idx)">
          <img v-if="it.kind === 'image'" :src="it.url" />
          <video
            v-else-if="it.kind === 'video'"
            :src="it.url"
            muted
            preload="metadata"
            @loadedmetadata="onMetaLoaded(it.url, $event)"
          />
          <div v-else class="audio-tile">
            <i class="el-icon-headset"></i>
          </div>
        </div>
        <div class="thumb-label">{{ it.label }}</div>

        <!-- 删除 -->
        <i
          v-show="hoverIdx === idx || previewIdx === idx"
          class="el-icon-error remove"
          @click.stop="remove(idx)"
        ></i>
      </div>

      <div v-if="dragOver" class="drop-mask">松开鼠标上传图片 / 视频 / 音频</div>
    </div>

    <!-- 浮动预览卡：position: fixed，避免被父级 overflow 截断 -->
    <div
      v-if="previewIdx >= 0 && activeItem"
      class="preview-card"
      :class="'p-' + activeItem.kind"
      :style="previewStyle"
      @click.stop
    >
      <template v-if="activeItem.kind === 'image'">
        <img class="p-img" :src="activeItem.url" />
      </template>

      <template v-else-if="activeItem.kind === 'video'">
        <video
          class="p-video-el"
          :src="activeItem.url"
          muted
          controls
          preload="metadata"
          @loadedmetadata="onMetaLoaded(activeItem.url, $event)"
        />
        <div class="p-video-badge">视频 {{ formatSec(durations[activeItem.url]) }}</div>
      </template>

      <template v-else>
        <div class="p-audio-player">
          <button class="play-btn" @click.stop="toggleAudio">
            <i :class="audioPlaying ? 'el-icon-video-pause' : 'el-icon-caret-right'"></i>
          </button>
          <div class="audio-body">
            <div class="audio-name">{{ activeItem.label }}</div>
            <div class="prog-bar" @click.stop="seekAudio">
              <div class="prog-fill" :style="{ width: audioProgressPct + '%' }"></div>
            </div>
          </div>
          <span class="audio-time"
            >{{ formatMmSs(audioCur) }} / {{ formatMmSs(durations[activeItem.url]) }}</span
          >
          <audio
            :src="activeItem.url"
            preload="metadata"
            @loadedmetadata="onMetaLoaded(activeItem.url, $event)"
            @timeupdate="onAudioTime"
            @ended="onAudioEnded"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UploadUtil from '@/utils/uploadUtil'
import {
  MAX_REF_IMAGES,
  MAX_FILE_SIZE_MB,
  ALLOWED_MIME,
  VIDEO_MAX_REF_VIDEOS,
  VIDEO_MAX_REF_AUDIOS,
  VIDEO_MAX_FILE_SIZE_MB,
  AUDIO_MAX_FILE_SIZE_MB,
  VIDEO_ALLOWED_MIME,
  AUDIO_ALLOWED_MIME
} from '../constants/sizeMap'

const KIND_LABELS = { image: '图片', video: '视频', audio: '音频' }

export default {
  name: 'MultiMediaUpload',
  props: {
    images: { type: Array, default: () => [] },
    videos: { type: Array, default: () => [] },
    audios: { type: Array, default: () => [] },
    maxImages: { type: Number, default: MAX_REF_IMAGES },
    maxVideos: { type: Number, default: VIDEO_MAX_REF_VIDEOS },
    maxAudios: { type: Number, default: VIDEO_MAX_REF_AUDIOS },
    placeholder: { type: String, default: '图片/视频/音频' }
  },
  data() {
    return {
      hoverIdx: -1,
      previewIdx: -1,
      previewPos: { x: 0, y: 0 },
      uploading: false,
      dragOver: false,
      durations: {},
      audioPlaying: false,
      audioCur: 0,
      _dragDepth: 0
    }
  },
  computed: {
    items() {
      return [
        ...this.images.map((u) => ({ kind: 'image', url: u })),
        ...this.videos.map((u) => ({ kind: 'video', url: u })),
        ...this.audios.map((u) => ({ kind: 'audio', url: u }))
      ]
    },
    /** 给每个素材加上 视频1 / 音频2 / 图片3 这样的可读标签，用于提示词 @ 引用 */
    itemsWithLabel() {
      const counts = { image: 0, video: 0, audio: 0 }
      return this.items.map((it) => {
        counts[it.kind] += 1
        return { ...it, label: KIND_LABELS[it.kind] + counts[it.kind] }
      })
    },
    totalMax() {
      return this.maxImages + this.maxVideos + this.maxAudios
    },
    canUploadMore() {
      return (
        this.images.length < this.maxImages ||
        this.videos.length < this.maxVideos ||
        this.audios.length < this.maxAudios
      )
    },
    acceptStr() {
      return [...ALLOWED_MIME, ...VIDEO_ALLOWED_MIME, ...AUDIO_ALLOWED_MIME].join(',')
    },
    audioProgressPct() {
      const it = this.itemsWithLabel[this.previewIdx]
      if (!it || it.kind !== 'audio') return 0
      const total = this.durations[it.url] || 0
      if (!total) return 0
      return Math.min(100, Math.max(0, (this.audioCur / total) * 100))
    },
    activeItem() {
      return this.previewIdx >= 0 ? this.itemsWithLabel[this.previewIdx] : null
    },
    previewStyle() {
      return {
        left: this.previewPos.x + 'px',
        top: this.previewPos.y + 'px'
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.onDocClick)
    window.removeEventListener('resize', this.onWinChange)
    window.removeEventListener('scroll', this.onWinChange, true)
  },
  methods: {
    detectKind(file) {
      const t = (file && file.type) || ''
      if (ALLOWED_MIME.includes(t)) return 'image'
      if (VIDEO_ALLOWED_MIME.includes(t)) return 'video'
      if (AUDIO_ALLOWED_MIME.includes(t)) return 'audio'
      if (t.startsWith('image/')) return 'image'
      if (t.startsWith('video/')) return 'video'
      if (t.startsWith('audio/')) return 'audio'
      return ''
    },
    capFor(kind) {
      if (kind === 'video') return this.maxVideos
      if (kind === 'audio') return this.maxAudios
      return this.maxImages
    },
    sizeLimitFor(kind) {
      if (kind === 'video') return VIDEO_MAX_FILE_SIZE_MB
      if (kind === 'audio') return AUDIO_MAX_FILE_SIZE_MB
      return MAX_FILE_SIZE_MB
    },
    listFor(kind) {
      if (kind === 'video') return this.videos
      if (kind === 'audio') return this.audios
      return this.images
    },
    syncEventFor(kind) {
      if (kind === 'video') return 'update:videos'
      if (kind === 'audio') return 'update:audios'
      return 'update:images'
    },

    beforeUpload(file) {
      const kind = this.detectKind(file)
      if (!kind) {
        this.$message.error('暂不支持该文件类型')
        return false
      }
      if (file.size / 1024 / 1024 > this.sizeLimitFor(kind)) {
        this.$message.error(`${kind} 文件不能超过 ${this.sizeLimitFor(kind)}MB`)
        return false
      }
      const cap = this.capFor(kind)
      if (this.listFor(kind).length >= cap) {
        const label = kind === 'video' ? '视频' : kind === 'audio' ? '音频' : '图片'
        this.$message.warning(`${label}最多 ${cap} 个`)
        return false
      }
      return true
    },

    async handleUpload({ file }) {
      const kind = this.detectKind(file)
      if (!kind) return
      this.uploading = true
      try {
        const storage = kind === 'image' ? 'image' : 'videos'
        const util = new UploadUtil(storage)
        const res = await util.uploadImg(file, file.name)
        // AI 素材的参考图/视频/音频只是会话上下文，不写入老素材库（images 表）。
        // 这里直接用 OSS 桶域名 + key 拼出可访问 URL，跳过 POST /espier/image 注册一步。
        const fullUrl = (res && (res.url || res.key)) || ''
        if (!fullUrl) throw new Error('upload returned empty url')

        const list = [...this.listFor(kind)]
        if (list.length < this.capFor(kind)) {
          list.push(fullUrl)
          this.$emit(this.syncEventFor(kind), list)
          this.$emit('change', { kind, list, items: this.items })
          // 上传成功后立刻探测一下时长，方便后续预览展示
          if (kind !== 'image') this.probeDuration(fullUrl, kind)
        }
      } catch (e) {
        this.$message.error((e && e.message) || '上传失败')
      } finally {
        this.uploading = false
      }
    },

    remove(idx) {
      const it = this.itemsWithLabel[idx]
      if (!it) return
      const list = [...this.listFor(it.kind)]
      const localIdx = list.indexOf(it.url)
      if (localIdx >= 0) {
        list.splice(localIdx, 1)
        this.$emit(this.syncEventFor(it.kind), list)
        this.$emit('change', { kind: it.kind, list, items: this.items })
      }
      if (this.previewIdx === idx) this.closePreview()
    },

    togglePreview(idx) {
      if (this.previewIdx === idx) {
        this.closePreview()
        return
      }
      this.stopAudio()
      this.audioPlaying = false
      this.audioCur = 0
      // 同步计算坐标，避免预览卡先在 (0,0) 闪一帧
      this.updatePreviewPos(idx)
      this.previewIdx = idx
      const it = this.itemsWithLabel[idx]
      if (it && it.kind !== 'image' && this.durations[it.url] == null) {
        this.probeDuration(it.url, it.kind)
      }
      this.$nextTick(() => {
        document.removeEventListener('mousedown', this.onDocClick)
        document.addEventListener('mousedown', this.onDocClick)
        window.addEventListener('resize', this.onWinChange)
        window.addEventListener('scroll', this.onWinChange, true)
      })
    },
    closePreview() {
      this.stopAudio()
      this.previewIdx = -1
      this.audioPlaying = false
      this.audioCur = 0
      document.removeEventListener('mousedown', this.onDocClick)
      window.removeEventListener('resize', this.onWinChange)
      window.removeEventListener('scroll', this.onWinChange, true)
    },
    onWinChange() {
      this.closePreview()
    },
    updatePreviewPos(idx) {
      const targetIdx = idx == null ? this.previewIdx : idx
      if (targetIdx < 0) return
      const items = this.$refs.items
      const list = Array.isArray(items) ? items : items ? [items] : []
      const el = list[targetIdx]
      if (!el) return
      const thumb = el.querySelector ? el.querySelector('.thumb') : null
      if (!thumb) return
      const r = thumb.getBoundingClientRect()
      this.previewPos = { x: r.left + r.width / 2, y: r.top }
    },
    getAudioEl() {
      return this.$el ? this.$el.querySelector('.p-audio-player audio') : null
    },
    stopAudio() {
      const a = this.getAudioEl()
      if (a) {
        try {
          a.pause()
        } catch (_) {
          /* noop */
        }
      }
    },
    toggleAudio() {
      const a = this.getAudioEl()
      if (!a) return
      if (a.paused) {
        a.play()
          .then(() => {
            this.audioPlaying = true
          })
          .catch(() => {})
      } else {
        a.pause()
        this.audioPlaying = false
      }
    },
    onAudioTime(e) {
      this.audioCur = (e && e.target && e.target.currentTime) || 0
    },
    onAudioEnded() {
      this.audioPlaying = false
      this.audioCur = 0
    },
    seekAudio(e) {
      const a = this.getAudioEl()
      if (!a || !a.duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      a.currentTime = a.duration * pct
      this.audioCur = a.currentTime
    },
    onDocClick(e) {
      if (!this.$el.contains(e.target)) this.closePreview()
    },

    onMetaLoaded(url, ev) {
      const dur = ev && ev.target ? ev.target.duration : 0
      if (dur && !isNaN(dur)) this.$set(this.durations, url, dur)
    },
    probeDuration(url, kind) {
      if (!url || kind === 'image') return
      const tag = document.createElement(kind === 'video' ? 'video' : 'audio')
      tag.preload = 'metadata'
      tag.muted = true
      tag.src = url
      tag.onloadedmetadata = () => {
        this.$set(this.durations, url, tag.duration || 0)
      }
      tag.onerror = () => {
        this.$set(this.durations, url, 0)
      }
    },
    formatSec(sec) {
      const s = Math.max(0, Math.round(sec || 0))
      return `${s}s`
    },
    formatMmSs(sec) {
      const s = Math.max(0, Math.round(sec || 0))
      const m = Math.floor(s / 60)
      const r = s % 60
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
    },

    onDragEnter() {
      this._dragDepth += 1
      this.dragOver = true
    },
    onDragOver(e) {
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    },
    onDragLeave() {
      this._dragDepth = Math.max(0, this._dragDepth - 1)
      if (this._dragDepth === 0) this.dragOver = false
    },
    async onDrop(e) {
      this._dragDepth = 0
      this.dragOver = false
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || [])
      if (files.length === 0) return
      for (const f of files) {
        if (!this.beforeUpload(f)) continue
        // eslint-disable-next-line no-await-in-loop
        await this.handleUpload({ file: f })
      }
    }
  }
}
</script>

<style scoped>
.multi-media-upload {
  display: block;
  position: relative;
  border-radius: 10px;
  transition: background-color 0.15s, box-shadow 0.15s;
}
.multi-media-upload.is-dragover {
  background: rgba(64, 158, 255, 0.06);
  box-shadow: 0 0 0 2px #409eff inset;
}
.media-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
  position: relative;
  min-height: 80px;
}
.drop-mask {
  position: absolute;
  inset: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(64, 158, 255, 0.12);
  color: #1989fa;
  font-size: 12px;
  border: 1px dashed #409eff;
  border-radius: 10px;
  pointer-events: none;
}

/* —— 单项缩略 + 标签 —— */
.media-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 56px;
}
.media-item .thumb {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  background: #fafbfc;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.media-item .thumb:hover {
  border-color: #c0c4cc;
}
.media-item.active .thumb {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.25);
}
.media-item .thumb img,
.media-item .thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.media-item .thumb .audio-tile {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e7f8f3, #b8eedc);
  color: #2eb389;
}
.media-item .thumb .audio-tile i {
  font-size: 22px;
}
.media-item.k-image .thumb-label {
  color: #606266;
}
.media-item.k-video .thumb-label {
  color: #606266;
}
.media-item.k-audio .thumb-label {
  color: #2eb389;
}
.media-item.active .thumb-label {
  color: #409eff;
  font-weight: 500;
}

.thumb-label {
  font-size: 12px;
  color: #606266;
  line-height: 1;
}

/* —— 占位 —— */
.media-item.placeholder {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  border: 1px dashed #dcdfe6;
  background: #fafbfc;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.media-item.placeholder:hover {
  border-color: #409eff;
  color: #409eff;
}
.media-item.placeholder i {
  font-size: 18px;
}
.media-item.placeholder .hint {
  font-size: 11px;
  margin-top: 2px;
  line-height: 1.2;
  text-align: center;
}

.remove {
  position: absolute;
  top: -4px;
  right: -4px;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  padding: 1px;
  z-index: 2;
}
.media-uploader >>> .el-upload {
  display: block;
}

/* —— 浮动预览卡（fixed 定位 + 自身向上偏移） —— */
.preview-card {
  position: fixed;
  /* left/top 由 :style 指定为缩略图顶边中心，整张卡再向上&左半宽偏移 */
  transform: translate(-50%, calc(-100% - 10px));
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  padding: 6px;
  z-index: 9999;
}
.preview-card::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: -1px;
  border: 6px solid transparent;
  border-top-color: #fff;
}

/* 图片 / 视频预览：尺寸统一 */
.p-image .p-img {
  display: block;
  width: 280px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 6px;
}
.preview-card.p-video {
  padding: 0;
  line-height: 0;
}
.preview-card.p-video .p-video-el {
  display: block;
  width: 280px;
  height: 158px;
  object-fit: contain;
  background: #000;
  border-radius: 6px;
}
.p-video-badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  line-height: 1.4;
}

/* 音频播放器 */
.p-audio {
  padding: 8px 10px;
}
.p-audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 260px;
}
.p-audio-player .play-btn {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: #409eff;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.15s;
}
.p-audio-player .play-btn:hover {
  background: #66b1ff;
}
.p-audio-player .audio-body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.p-audio-player .audio-name {
  font-size: 12px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}
.p-audio-player .prog-bar {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #ebeef5;
  cursor: pointer;
  overflow: hidden;
}
.p-audio-player .prog-fill {
  height: 100%;
  background: #409eff;
  border-radius: 2px;
  transition: width 0.1s linear;
}
.p-audio-player .audio-time {
  flex: 0 0 auto;
  font-size: 11px;
  color: #909399;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.p-audio-player audio {
  display: none;
}
</style>
