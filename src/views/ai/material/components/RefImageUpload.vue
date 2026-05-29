<template>
  <div
    class="ref-img-upload"
    :class="{ 'is-dragover': dragOver }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="ref-list">
      <div
        v-for="(url, idx) in urls"
        :key="idx"
        ref="items"
        class="ref-item"
        :class="{ active: previewIdx === idx, ['k-' + kind]: true }"
        @mouseenter="hoverIdx = idx"
        @mouseleave="hoverIdx = -1"
      >
        <div class="thumb" @click.stop="togglePreview(idx)">
          <img v-if="kind === 'image'" :src="url" />
          <video
            v-else-if="kind === 'video'"
            :src="url"
            muted
            preload="metadata"
            @loadedmetadata="onMetaLoaded(url, $event)"
          />
          <div v-else class="audio-tile">
            <i class="el-icon-headset"></i>
          </div>
        </div>
        <i
          v-show="hoverIdx === idx || previewIdx === idx"
          class="el-icon-error remove"
          @click.stop="remove(idx)"
        ></i>
      </div>

      <el-upload
        v-if="urls.length < max"
        ref="uploadRef"
        action=""
        :show-file-list="false"
        :multiple="true"
        :http-request="handleUpload"
        :before-upload="beforeUpload"
        :accept="acceptStr"
        class="ref-uploader"
      >
        <div class="ref-item placeholder">
          <i v-if="!uploading" :class="placeholderIcon"></i>
          <i v-else class="el-icon-loading"></i>
          <div class="hint">
            {{ urls.length === 0 ? placeholderLabel : `${urls.length}/${max}` }}
          </div>
        </div>
      </el-upload>

      <div v-if="dragOver" class="drop-mask">{{ dropMaskText }}</div>
    </div>

    <!-- 浮动预览卡：fixed 定位避免被父级 overflow 截断 -->
    <div
      v-if="previewIdx >= 0 && urls[previewIdx]"
      class="preview-card"
      :class="'p-' + kind"
      :style="previewStyle"
      @click.stop
    >
      <template v-if="kind === 'image'">
        <img class="p-img" :src="urls[previewIdx]" />
      </template>
      <template v-else-if="kind === 'video'">
        <video
          class="p-video-el"
          :src="urls[previewIdx]"
          muted
          controls
          preload="metadata"
          @loadedmetadata="onMetaLoaded(urls[previewIdx], $event)"
        />
        <div class="p-video-badge">视频 {{ formatSec(durations[urls[previewIdx]]) }}</div>
      </template>
      <template v-else>
        <div class="p-audio-player">
          <button class="play-btn" @click.stop="toggleAudio">
            <i :class="audioPlaying ? 'el-icon-video-pause' : 'el-icon-caret-right'"></i>
          </button>
          <div class="audio-body">
            <div class="audio-name">音频{{ previewIdx + 1 }}</div>
            <div class="prog-bar" @click.stop="seekAudio">
              <div class="prog-fill" :style="{ width: audioProgressPct + '%' }"></div>
            </div>
          </div>
          <span class="audio-time"
            >{{ formatMmSs(audioCur) }} / {{ formatMmSs(durations[urls[previewIdx]]) }}</span
          >
          <audio
            :src="urls[previewIdx]"
            preload="metadata"
            @loadedmetadata="onMetaLoaded(urls[previewIdx], $event)"
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

export default {
  name: 'RefImageUpload',
  props: {
    value: { type: Array, default: () => [] },
    /** image | video | audio */
    kind: { type: String, default: 'image' },
    max: { type: Number, default: 0 }
  },
  data() {
    return {
      urls: [...this.value],
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
  beforeDestroy() {
    document.removeEventListener('mousedown', this.onDocClick)
    window.removeEventListener('resize', this.onWinChange)
    window.removeEventListener('scroll', this.onWinChange, true)
  },
  computed: {
    allowedMime() {
      if (this.kind === 'video') return VIDEO_ALLOWED_MIME
      if (this.kind === 'audio') return AUDIO_ALLOWED_MIME
      return ALLOWED_MIME
    },
    maxSizeMb() {
      if (this.kind === 'video') return VIDEO_MAX_FILE_SIZE_MB
      if (this.kind === 'audio') return AUDIO_MAX_FILE_SIZE_MB
      return MAX_FILE_SIZE_MB
    },
    effectiveMax() {
      if (this.max > 0) return this.max
      if (this.kind === 'video') return VIDEO_MAX_REF_VIDEOS
      if (this.kind === 'audio') return VIDEO_MAX_REF_AUDIOS
      return MAX_REF_IMAGES
    },
    acceptStr() {
      return this.allowedMime.join(',')
    },
    placeholderIcon() {
      if (this.kind === 'video') return 'el-icon-video-camera'
      if (this.kind === 'audio') return 'el-icon-microphone'
      return 'el-icon-picture-outline'
    },
    placeholderLabel() {
      if (this.kind === 'video') return '视频'
      if (this.kind === 'audio') return '音频'
      return '图片'
    },
    dropMaskText() {
      if (this.kind === 'video') return '松开鼠标上传视频'
      if (this.kind === 'audio') return '松开鼠标上传音频'
      return '松开鼠标上传图片'
    },
    uploadStorage() {
      if (this.kind === 'video') return 'videos'
      if (this.kind === 'audio') return 'videos'
      return 'image'
    },
    audioProgressPct() {
      if (this.previewIdx < 0 || this.kind !== 'audio') return 0
      const url = this.urls[this.previewIdx]
      const total = this.durations[url] || 0
      if (!total) return 0
      return Math.min(100, Math.max(0, (this.audioCur / total) * 100))
    },
    previewStyle() {
      return {
        left: this.previewPos.x + 'px',
        top: this.previewPos.y + 'px'
      }
    }
  },
  watch: {
    value(v) {
      this.urls = [...v]
    }
  },
  methods: {
    beforeUpload(file) {
      if (this.allowedMime.length && !this.allowedMime.includes(file.type)) {
        const tip =
          this.kind === 'video'
            ? '视频格式仅支持 MP4 / MOV'
            : this.kind === 'audio'
            ? '音频格式仅支持 MP3 / WAV'
            : '图片格式仅支持 JPEG/PNG/WEBP/BMP/TIFF/GIF'
        this.$message.error(tip)
        return false
      }
      if (file.size / 1024 / 1024 > this.maxSizeMb) {
        this.$message.error(`文件大小不能超过 ${this.maxSizeMb}MB`)
        return false
      }
      const max = this.effectiveMax
      if (this.urls.length >= max) {
        this.$message.warning(`最多 ${max} 个`)
        return false
      }
      return true
    },
    async handleUpload({ file }) {
      this.uploading = true
      try {
        const util = new UploadUtil(this.uploadStorage)
        const res = await util.uploadImg(file, file.name)
        // AI 素材的参考图/视频/音频只是会话上下文，不写入老素材库（images 表）。
        // 这里直接用 OSS 桶域名 + key 拼出可访问 URL，跳过 POST /espier/image 注册一步。
        const fullUrl = (res && (res.url || res.key)) || ''
        if (!fullUrl) throw new Error('upload returned empty url')

        if (this.urls.length < this.effectiveMax) {
          this.urls.push(fullUrl)
          this.$emit('input', this.urls)
          this.$emit('change', this.urls)
        }
      } catch (e) {
        this.$message.error((e && e.message) || '上传失败')
      } finally {
        this.uploading = false
      }
    },
    remove(idx) {
      this.urls.splice(idx, 1)
      this.$emit('input', this.urls)
      this.$emit('change', this.urls)
      if (this.previewIdx === idx) this.closePreview()
      else if (this.previewIdx > idx) this.previewIdx -= 1
    },

    togglePreview(idx) {
      if (this.previewIdx === idx) {
        this.closePreview()
        return
      }
      this.stopAudio()
      this.audioPlaying = false
      this.audioCur = 0
      this.updatePreviewPos(idx)
      this.previewIdx = idx
      const url = this.urls[idx]
      if (this.kind !== 'image' && url && this.durations[url] == null) {
        this.probeDuration(url)
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
      const d = ev && ev.target ? ev.target.duration : 0
      if (d && !isNaN(d)) this.$set(this.durations, url, d)
    },
    probeDuration(url) {
      if (!url || this.kind === 'image') return
      const tag = document.createElement(this.kind === 'video' ? 'video' : 'audio')
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
      const remain = this.effectiveMax - this.urls.length
      if (remain <= 0) {
        this.$message.warning(`最多 ${this.effectiveMax} 个`)
        return
      }
      if (files.length > remain) {
        this.$message.warning(`最多 ${this.effectiveMax} 个，已截取前 ${remain} 个`)
      }
      for (const f of files.slice(0, remain)) {
        if (!this.beforeUpload(f)) continue
        await this.handleUpload({ file: f })
      }
    }
  }
}
</script>

<style scoped>
.ref-img-upload {
  display: inline-block;
  position: relative;
  border-radius: 10px;
  transition: background-color 0.15s, box-shadow 0.15s;
}
.ref-img-upload.is-dragover {
  background: rgba(64, 158, 255, 0.06);
  box-shadow: 0 0 0 2px #409eff inset;
}
.ref-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  position: relative;
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
.ref-item {
  position: relative;
  width: 56px;
}
.ref-item .thumb {
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
.ref-item .thumb:hover {
  border-color: #c0c4cc;
}
.ref-item.active .thumb {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.25);
}
.ref-item .thumb img,
.ref-item .thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.ref-item .thumb .audio-tile {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e7f8f3, #b8eedc);
  color: #2eb389;
}
.ref-item .thumb .audio-tile i {
  font-size: 22px;
}

.ref-item.placeholder {
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  border: 1px dashed #dcdfe6;
  background: #fafbfc;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.ref-item.placeholder:hover {
  border-color: #409eff;
  color: #409eff;
}
.ref-item.placeholder i {
  font-size: 18px;
}
.ref-item.placeholder .hint {
  font-size: 11px;
  margin-top: 2px;
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
.ref-uploader >>> .el-upload {
  display: block;
}

/* —— 浮动预览卡（fixed 定位 + 自身向上偏移） —— */
.preview-card {
  position: fixed;
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
