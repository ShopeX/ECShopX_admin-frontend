<template>
  <transition name="tpl-fade">
    <div v-if="visible" class="tpl-panel" v-loading="loading">
      <div class="tpl-head">
        <span class="tpl-title-tag">精选</span>
        <div class="tpl-head-right">
          <a class="tpl-guide" @click="$emit('open-guide')">
            <i class="el-icon-magic-stick"></i>
            提示词指南
          </a>
          <i class="el-icon-close tpl-close" @click="close"></i>
        </div>
      </div>

      <el-empty v-if="!loading && templates.length === 0" description="暂无模板" :image-size="80" />

      <div v-else class="tpl-grid">
        <div
          v-for="t in templates"
          :key="t.template_id"
          class="tpl-card"
          @mouseenter="onHover(t, true)"
          @mouseleave="onHover(t, false)"
        >
          <div
            class="tpl-cover"
            :class="{ 'no-cover': !coverOf(t) && !previewVideoOf(t) }"
            :style="coverOf(t) ? { backgroundImage: `url(${coverOf(t)})` } : null"
          >
            <i v-if="!coverOf(t) && !previewVideoOf(t)" class="el-icon-picture-outline cover-fallback"></i>

            <!-- 视频模板：默认展示首帧（preload=metadata），hover 自动播放；无静态封面时常驻可见 -->
            <video
              v-if="isVideoTpl(t) && previewVideoOf(t)"
              ref="videoPlayers"
              :src="previewVideoOf(t)"
              :muted="!unmuted[t.template_id]"
              preload="metadata"
              loop
              playsinline
              class="tpl-video"
              :class="{ playing: hoverId === t.template_id, 'as-poster': !coverOf(t) }"
              :data-tid="t.template_id"
            />

            <!-- 类型角标 -->
            <div class="tpl-type-badge" :class="badgeClass(t)">
              <i :class="badgeIcon(t)"></i>
              <span v-if="t.has_audio" class="audio-dot" title="包含参考音频"></span>
            </div>

            <!-- 视频静音切换 -->
            <i
              v-if="isVideoTpl(t) && hoverId === t.template_id"
              class="audio-toggle"
              :class="unmuted[t.template_id] ? 'el-icon-bell' : 'el-icon-close-notification'"
              @click.stop="toggleAudio(t)"
            ></i>

            <div class="tpl-title-chip">{{ t.title }}</div>

            <div class="tpl-mask">
              <div class="tpl-prompt">{{ t.prompt | truncate(60) }}</div>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-magic-stick"
                round
                @click="useTemplate(t)"
              >{{ isVideoTpl(t) ? '立即体验' : '做同款' }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { listTemplates } from '@/api/aiMaterial'

export default {
  name: 'TemplateGallery',
  filters: {
    truncate(v, n) {
      v = String(v || '')
      return v.length > n ? v.slice(0, n) + '...' : v
    }
  },
  props: {
    value: { type: Boolean, default: false },
    mediaType: { type: String, default: 'image' }
  },
  data() {
    return {
      visible: this.value,
      loading: false,
      templates: [],
      hoverId: 0,
      unmuted: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.visible = v
        if (v && this.templates.length === 0) this.fetch()
      }
    },
    visible(v) { if (v !== this.value) this.$emit('input', v) },
    mediaType() { this.templates = []; if (this.visible) this.fetch() }
  },
  methods: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await listTemplates({ media_type: this.mediaType })
        this.templates = (data.data && data.data.items) || []
      } catch (e) {
        this.$message.error(e.message || '加载模板失败')
      } finally {
        this.loading = false
      }
    },
    isVideoTpl(t) {
      return (t && t.media_type === 'video') || !!this.previewVideoOf(t)
    },
    previewVideoOf(t) {
      if (!t) return ''
      const raw = t.preview_video_url || (() => {
        const outputs = Array.isArray(t.output_images) ? t.output_images : []
        return outputs.find((u) => typeof u === 'string' && /\.(mp4|mov|m4v|webm|mkv|avi)(\?|$)/i.test(u)) || ''
      })()
      if (!raw) return ''
      // 没有静态封面时追加 #t=0.1，强制浏览器 seek 到首帧解码作为显示帧（避免黑屏）
      if (this.coverOf(t)) return raw
      return raw.indexOf('#') === -1 ? raw + '#t=0.1' : raw
    },
    coverOf(t) {
      if (!t) return ''
      const isVideoUrl = (u) => typeof u === 'string' && /\.(mp4|mov|m4v|webm|mkv|avi)(\?|$)/i.test(u)
      const isImageUrl = (u) => typeof u === 'string' && u && !isVideoUrl(u)
      if (isImageUrl(t.cover_url)) return t.cover_url
      const pickFirstImage = (arr) => {
        if (!Array.isArray(arr)) return ''
        const u = arr.find(isImageUrl)
        return u || ''
      }
      return pickFirstImage(t.output_images) || pickFirstImage(t.input_images) || ''
    },
    badgeClass(t) {
      if (this.isVideoTpl(t)) return 'is-video'
      if (t && t.media_type === 'audio') return 'is-audio'
      return 'is-image'
    },
    badgeIcon(t) {
      if (this.isVideoTpl(t)) return 'el-icon-video-camera'
      if (t && t.media_type === 'audio') return 'el-icon-headset'
      return 'el-icon-picture-outline'
    },
    onHover(t, enter) {
      const id = t.template_id
      this.hoverId = enter ? id : 0
      this.$nextTick(() => {
        const players = this.$refs.videoPlayers || []
        const list = Array.isArray(players) ? players : [players]
        list.forEach((v) => {
          if (!v || !v.tagName) return
          const tid = Number(v.dataset && v.dataset.tid)
          if (enter && tid === id) {
            try { v.currentTime = 0; v.play() } catch (_) { /* ignore autoplay errors */ }
          } else {
            try { v.pause() } catch (_) { /* noop */ }
          }
        })
      })
    },
    toggleAudio(t) {
      const id = t.template_id
      this.$set(this.unmuted, id, !this.unmuted[id])
    },
    useTemplate(t) {
      this.$emit('select', t)
      this.close()
    },
    close() { this.visible = false }
  }
}
</script>

<style scoped>
.tpl-panel {
  position: absolute;
  left: 24px; right: 24px; bottom: 100%;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #ebeef5;
  padding: 14px 16px 16px;
  z-index: 11;
}
.tpl-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.tpl-title-tag {
  background: #303133; color: #fff; font-size: 12px;
  padding: 4px 10px; border-radius: 6px; font-weight: 600;
}
.tpl-head-right { display: flex; align-items: center; gap: 14px; color: #606266; font-size: 13px; }
.tpl-guide { cursor: pointer; color: #606266; }
.tpl-guide:hover { color: #409eff; }
.tpl-close { font-size: 18px; color: #909399; cursor: pointer; }
.tpl-close:hover { color: #303133; }

.tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}
.tpl-grid::-webkit-scrollbar { width: 6px; }
.tpl-grid::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
.tpl-grid::-webkit-scrollbar-thumb:hover { background: #c0c4cc; }
.tpl-card {
  border-radius: 10px;
  overflow: hidden;
  background: #f5f7fa;
  cursor: pointer;
}
.tpl-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background-size: cover;
  background-position: center;
  background-color: #ebeef5;
  overflow: hidden;
}
.tpl-cover.no-cover {
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #f0f2f5, #e4e7ed);
}
.cover-fallback { font-size: 36px; color: #c0c4cc; }
.tpl-title-chip {
  position: absolute; left: 10px; top: 10px;
  background: rgba(0, 0, 0, 0.55); color: #fff;
  font-size: 12px; padding: 3px 10px; border-radius: 6px;
  max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tpl-type-badge {
  position: absolute; right: 10px; top: 10px;
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(0, 0, 0, 0.55); color: #fff;
  font-size: 12px; padding: 3px 8px; border-radius: 6px;
}
.tpl-type-badge.is-video { background: rgba(64, 158, 255, .85); }
.tpl-type-badge.is-audio { background: rgba(230, 162, 60, .85); }
.tpl-type-badge .audio-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #f56c6c;
}
.audio-toggle {
  position: absolute; right: 10px; bottom: 10px;
  background: rgba(0, 0, 0, 0.55); color: #fff;
  font-size: 14px; padding: 5px; border-radius: 50%; cursor: pointer;
  z-index: 4;
}
.audio-toggle:hover { background: rgba(0, 0, 0, 0.8); }

.tpl-video {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0; transition: opacity .2s;
  z-index: 2;
  background: #000;
}
/* 没有静态封面时把视频常驻可见，靠 preload=metadata 显示首帧 */
.tpl-video.as-poster { opacity: 1; }
.tpl-video.playing { opacity: 1; }

.tpl-mask {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 50%, rgba(0,0,0,0) 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding: 10px 10px 14px; gap: 10px;
  opacity: 0; transition: opacity .2s;
  z-index: 3;
}
.tpl-cover:hover .tpl-mask { opacity: 1; }
.tpl-prompt {
  width: 100%;
  font-size: 12px; line-height: 1.5; color: #fff;
  text-align: left;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

.tpl-fade-enter-active, .tpl-fade-leave-active { transition: opacity .15s, transform .15s; }
.tpl-fade-enter, .tpl-fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
