<template>
  <SpPage class="material-studio">
    <!-- 顶部：模式切换 + 模板入口 -->
    <div slot="page-header" class="studio-header">
      <div class="mode-switch">
        <el-radio-group v-model="mode" size="small" @change="onModeChange">
          <el-radio-button label="image">图片模式</el-radio-button>
          <el-radio-button label="video">视频模式</el-radio-button>
        </el-radio-group>
      </div>

      <div class="header-actions">
        <el-button size="small" plain icon="el-icon-magic-stick" @click="guideOpen = true">提示词指南</el-button>
        <router-link :to="{ name: 'aiMaterialLibrary' }">
          <el-button size="small" type="primary" plain icon="el-icon-folder-opened">素材库</el-button>
        </router-link>
      </div>
    </div>

    <!-- 主区：历史 + 输入条 -->
    <div
      class="studio-body"
      v-loading="generating"
      :element-loading-text="mode === 'video' ? '正在提交视频任务，请稍候...' : '正在生成图片，请稍候...'"
    >
      <!-- 历史会话流（按时间倒序、上滑加载更多） -->
      <div ref="conversationsRef" class="conv-stream" @scroll="onStreamScroll">
        <el-empty
          v-if="!loadingHistory && conversations.length === 0"
          description="还没有制作过图片，输入提示词开始吧"
        />

        <div v-for="c in conversations" :key="c.conversation_id || c._tempId" class="conv-card">
          <div class="conv-meta">
            <span class="conv-time">{{ c.created_at }}</span>
            <el-tag v-if="c.status === 'failed'" type="danger" size="mini">失败</el-tag>
            <el-tag v-else-if="c.status === 'pending' || c.status === 'running'" type="warning" size="mini">
              <i class="el-icon-loading"></i> 生成中
            </el-tag>
          </div>

          <div class="conv-prompt">{{ c.prompt }}</div>

          <div class="conv-params">
            <el-tag size="mini" effect="plain">{{ formatSize(c) }}</el-tag>
            <template v-if="(c.media_type || mode) === 'video'">
              <el-tag v-if="c.params && c.params.duration" size="mini" effect="plain">{{ c.params.duration }}s</el-tag>
              <el-tag v-if="c.params && c.params.generate_audio" size="mini" effect="plain">有声</el-tag>
              <el-tag v-if="c.params && c.params.mode === 'first_last'" size="mini" effect="plain">首尾帧</el-tag>
              <el-tag v-if="c.params && c.params.smart_ratio" size="mini" effect="plain">智能比例</el-tag>
            </template>
            <template v-else>
              <el-tag size="mini" effect="plain">{{ (c.params && c.params.output_format) || 'png' }}</el-tag>
              <el-tag v-if="c.params && c.params.use_web_search" size="mini" effect="plain">联网</el-tag>
              <el-tag v-if="c.params && c.params.watermark" size="mini" effect="plain">水印</el-tag>
            </template>
            <el-tag v-if="c.input_images && c.input_images.length" size="mini" effect="plain">参考素材 {{ c.input_images.length }}</el-tag>
          </div>

          <div v-if="c.input_images && c.input_images.length" class="conv-input-imgs">
            <div
              v-for="(u, i) in c.input_images"
              :key="i"
              class="thumb sm"
              :class="{ 'k-video': isVideoUrl(u), 'k-audio': isAudioUrl(u) }"
            >
              <video v-if="isVideoUrl(u)" :src="u" muted preload="metadata" />
              <i v-else-if="isAudioUrl(u)" class="el-icon-headset thumb-icon" />
              <img v-else :src="u" />
            </div>
          </div>

          <!-- 生成中：占位骨架 -->
          <div v-if="c.status === 'pending' || c.status === 'running'" class="conv-loading">
            <div class="skeleton-card" />
            <div class="skeleton-text">
              {{ (c.media_type || mode) === 'video'
                ? (c.task_id ? `视频生成中（${c.polling_status || 'queued'}），通常需要 1-3 分钟...` : '视频任务提交中...')
                : '生成中，预计 10-30 秒...' }}
            </div>
          </div>

          <!-- 失败提示 -->
          <div v-else-if="c.status === 'failed'" class="conv-error">
            {{ c.error_message || c.error_msg || '生成失败' }}
          </div>

          <!-- 成功结果：图片或视频（按 URL 后缀辨型） -->
          <div v-else-if="c.output_images && c.output_images.length" class="conv-output">
            <div
              v-for="(u, i) in c.output_images"
              :key="i"
              class="result-card"
              :class="{ video: isVideoUrl(u) }"
            >
              <video
                v-if="isVideoUrl(u)"
                :src="videoSrcOf(u, c)"
                :poster="posterOf(c)"
                controls
                preload="metadata"
                class="result-video"
              />
              <div v-else-if="isAudioUrl(u)" class="result-audio">
                <audio :src="u" controls preload="metadata" />
              </div>
              <div v-else class="result-img" @click="previewImage(u)">
                <img :src="u" />
              </div>
              <div v-if="isVideoUrl(u) && (c.params && c.params.result_duration)" class="video-meta">
                {{ c.params.result_duration }}s
              </div>
            </div>
          </div>

          <!-- 操作行：重新编辑 | 保存到素材库 | 更多 -->
          <div class="conv-actions">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit-outline"
              :disabled="c.status === 'pending' || c.status === 'running'"
              @click="onReedit(c)"
            >重新编辑</el-button>

            <el-button
              type="text"
              size="mini"
              icon="el-icon-collection"
              :disabled="!hasSavableOutput(c)"
              @click="onSaveDialog(c)"
            >保存到素材库</el-button>

            <el-button
              type="text"
              size="mini"
              icon="el-icon-magic-stick"
              :disabled="!hasSavableOutput(c)"
              @click="onTemplateDialog(c)"
            >设为模板</el-button>

            <el-dropdown trigger="click" placement="bottom-start" @command="onMoreCommand($event, c)">
              <el-button type="text" size="mini" icon="el-icon-more"></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete" icon="el-icon-delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div v-if="loadingMore" class="load-more-tip">
          <i class="el-icon-loading"></i> 加载中...
        </div>
        <div v-else-if="!hasMore && conversations.length > 0" class="load-more-tip end">
          已经到底了
        </div>
      </div>

      <!-- 底部输入条 -->
      <div class="input-bar">
        <!-- 模板悬浮面板（在输入条正上方） -->
        <TemplateGallery
          v-model="templateOpen"
          :media-type="mode"
          @select="onUseTemplate"
          @open-guide="guideOpen = true"
        />

        <!-- 视频模式输入条 -->
        <VideoInputBar
          v-if="mode === 'video'"
          v-model="videoForm"
          :loading="generating"
          @submit="onGenerateVideo"
          @open-template="templateOpen = !templateOpen"
          @open-settings="settingsOpen = true"
          ref="videoBar"
        />

        <!-- 图片模式输入条 -->
        <template v-else>
          <div v-if="inputImages.length" class="bar-tip">
            使用 <span class="ref-mark">@</span> 可快速引用上传的素材，如：参考 @图片1 中的风格生成。
          </div>
          <div class="bar-top">
            <RefImageUpload v-model="inputImages" kind="image" />

            <PromptInput
              ref="promptInput"
              v-model="promptText"
              :items="imageRefItems"
              :placeholder="inputImages.length ? '结合图片,输入创意描述' : '描述你想生成的图片，比如：电商珠宝摄影...'"
              :min-rows="2"
              :max-rows="6"
              class="prompt-input"
            />

            <el-button
              class="tpl-trigger"
              type="text"
              icon="el-icon-magic-stick"
              @click="templateOpen = !templateOpen"
            >模板</el-button>
          </div>

          <div class="bar-toolbar">
            <div class="toolbar-left">
              <el-dropdown trigger="click" @command="onMaxImagesChange">
                <el-button size="small" plain icon="el-icon-picture">
                  生成{{ form.maxImages }}张
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="n in 4" :key="n" :command="n">{{ n }}张</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <SizePopover
                :resolution="form.resolution"
                :ratio="form.ratio"
                :custom-w="form.customW"
                :custom-h="form.customH"
                @change="onSizeChange"
              />

              <el-button size="small" plain icon="el-icon-setting" @click="settingsOpen = true">详细设置</el-button>
            </div>

            <div class="toolbar-right">
              <span v-if="quotaText" class="quota">{{ quotaText }}</span>
              <el-button v-if="lastResultUrl && inputImages.length === 0" size="small" plain icon="el-icon-back" @click="useLastAsInput">使用上次结果</el-button>
              <el-button
                type="primary"
                size="small"
                circle
                icon="el-icon-top"
                :loading="generating"
                @click="onGenerate"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 详细设置抽屉 -->
    <AdvancedSettingsDrawer
      v-model="settingsOpen"
      :media-type="mode"
      :params="mode === 'video' ? videoForm : form"
      @apply="onApplyAdvanced"
    />

    <!-- 提示词指南 -->
    <PromptGuideDrawer v-model="guideOpen" :media-type="mode" />

    <!-- 大图预览 -->
    <el-dialog :visible.sync="previewVisible" width="auto" top="6vh" :modal="true">
      <img v-if="previewUrl" :src="previewUrl" style="max-width: 80vw; max-height: 80vh; display: block; margin: 0 auto" />
    </el-dialog>

    <!-- 保存到素材库弹窗 -->
    <el-dialog title="保存到素材库" :visible.sync="saveVisible" width="520px" append-to-body>
      <el-form :model="saveForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="saveForm.name" placeholder="给素材取个名字" />
        </el-form-item>
        <el-form-item label="分组">
          <div class="flex items-center gap-2">
            <el-select
              v-model="saveForm.image_cat_id"
              filterable
              clearable
              placeholder="选择分组（不选则未分组）"
              style="flex: 1"
            >
              <el-option :value="0" label="未分组" />
              <el-option
                v-for="g in aiCatList"
                :key="g.image_cat_id"
                :label="g.image_cat_name"
                :value="g.image_cat_id"
              />
            </el-select>
            <el-button size="small" icon="el-icon-plus" @click="onAddAiCat">新建分组</el-button>
          </div>
          <div class="form-tip">AI 素材会落到老素材库的「AI 素材」分类下，与商品图共用一套挂载体系</div>
        </el-form-item>
        <el-form-item label="预览">
          <video
            v-if="saveForm.media_type === 'video'"
            :src="saveForm.url"
            controls
            preload="metadata"
            style="max-width: 240px; max-height: 200px; border-radius: 6px; background: #000"
          />
          <audio
            v-else-if="saveForm.media_type === 'audio'"
            :src="saveForm.url"
            controls
            style="width: 240px"
          />
          <img
            v-else-if="saveForm.url"
            :src="saveForm.url"
            style="max-width: 200px; max-height: 200px; border-radius: 6px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="saveVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSaveConfirm">保存</el-button>
      </div>
    </el-dialog>

    <!-- 设为模板弹窗（独立流程） -->
    <el-dialog title="设为模板" :visible.sync="tplVisible" width="520px" append-to-body>
      <el-form :model="tplForm" label-width="80px">
        <el-form-item label="模板标题">
          <el-input v-model="tplForm.title" placeholder="给模板取个标题，便于他人识别" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="预览">
          <video
            v-if="tplForm.media_type === 'video'"
            :src="tplForm.url"
            controls
            preload="metadata"
            style="max-width: 240px; max-height: 200px; border-radius: 6px; background: #000"
          />
          <img
            v-else-if="tplForm.url"
            :src="tplForm.url"
            style="max-width: 200px; max-height: 200px; border-radius: 6px"
          />
        </el-form-item>
        <div class="form-tip">模板会出现在制作页的「模板」面板中，他人可一键"做同款"。</div>
      </el-form>
      <div slot="footer">
        <el-button @click="tplVisible = false">取消</el-button>
        <el-button type="primary" :loading="tplSaving" @click="onTemplateConfirm">设为模板</el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
import {
  generateImage,
  listConversations,
  getConversation,
  deleteConversation,
  saveToLibrary,
  createTemplate
} from '@/api/aiMaterial'
import { getImageAllCatgory, addImageCatgory } from '@/api/picker'
import { parseSize, SIZE_MAP } from './constants/sizeMap'
import SizePopover from './components/SizePopover'
import AdvancedSettingsDrawer from './components/AdvancedSettingsDrawer'
import TemplateGallery from './components/TemplateGallery'
import PromptGuideDrawer from './components/PromptGuideDrawer'
import RefImageUpload from './components/RefImageUpload'
import VideoInputBar from './components/VideoInputBar'
import PromptInput from './components/PromptInput'
import { buildRefItems } from './utils/refItems'

const DEFAULT_VIDEO_FORM = () => ({
  mode: 'reference',
  prompt: '',
  imageStart: '',
  imageEnd: '',
  referenceImages: [],
  referenceVideos: [],
  referenceAudios: [],
  resolution: '720p',
  ratio: '16:9',
  smartRatio: false,
  duration: 5,
  durationSmart: false,
  count: 1,
  generateAudio: false,
  watermark: false,
  returnLastFrame: false,
  useWebSearch: false,
  seed: 0
})

export default {
  name: 'MaterialStudio',
  components: { SizePopover, AdvancedSettingsDrawer, TemplateGallery, PromptGuideDrawer, RefImageUpload, VideoInputBar, PromptInput },
  data() {
    const defaultSize = parseSize((SIZE_MAP['2K'] && SIZE_MAP['2K']['1:1']) || '2048x2048')
    return {
      mode: 'image',
      promptText: '',
      inputImages: [],
      form: {
        resolution: '2K',
        ratio: '1:1',
        customW: defaultSize.w,
        customH: defaultSize.h,
        maxImages: 1,
        useWebSearch: false,
        outputFormat: 'png',
        watermark: 1
      },

      videoForm: DEFAULT_VIDEO_FORM(),

      conversations: [],
      loadingHistory: false,
      loadingMore: false,
      generating: false,

      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
      _scrollLockMs: 0,

      settingsOpen: false,
      templateOpen: false,
      guideOpen: false,

      previewVisible: false,
      previewUrl: '',

      saveVisible: false,
      saving: false,
      saveForm: {
        url: '', conversation_id: 0, name: '',
        media_type: 'image', mime: '',
        image_cat_id: 0
      },
      // AI 素材分组（espier_uploadimages_cat where source=ai_generate），弹窗里下拉选择
      aiCatList: [],

      tplVisible: false,
      tplSaving: false,
      tplForm: {
        url: '', conversation_id: 0, title: '', media_type: 'image'
      },

      _pollTimer: null
    }
  },
  computed: {
    lastResultUrl() {
      const c = this.conversations.find((x) => x.output_images && x.output_images.length > 0)
      return c ? c.output_images[0] : ''
    },
    quotaText() { return '' /* 后续接配额接口 */ },
    /** 图片模式 PromptInput 的 @ 引用候选 */
    imageRefItems() {
      return buildRefItems({ images: this.inputImages })
    }
  },
  mounted() {
    this.fetchConversations()
    this.startPolling()
  },
  beforeDestroy() {
    this.stopPolling()
  },
  methods: {
    // —— 媒体类型判定（按 URL 后缀）——
    isVideoUrl(u) {
      return typeof u === 'string' && /\.(mp4|mov|m4v|webm|mkv|avi)(\?|$)/i.test(u)
    },
    isAudioUrl(u) {
      return typeof u === 'string' && /\.(mp3|wav|m4a|aac|ogg|flac)(\?|$)/i.test(u)
    },
    /**
     * poster：仅当 cover_url 是图片 URL 时才给 <video poster>，
     * 兼容老数据里 cover_url 被错写成 mp4 URL 的情况（mp4 当 poster 会渲染为黑色）。
     */
    posterOf(c) {
      if (!c) return ''
      const u = c.cover_url
      if (typeof u !== 'string' || !u) return ''
      if (this.isVideoUrl(u) || this.isAudioUrl(u)) return ''
      return u
    },
    /**
     * 视频 src：当 conversation 没有真实封面图（图片）时，给 URL 追加 #t=0.1 的 Media Fragment，
     * 浏览器会 seek 到 0.1s 解码该帧并作为静态显示帧（首帧），避免黑屏。
     * 有真实封面图时以 poster 为准，无需 hash。
     */
    videoSrcOf(u, c) {
      if (typeof u !== 'string' || !u) return u
      if (this.posterOf(c)) return u
      if (u.indexOf('#') !== -1) return u
      return u + '#t=0.1'
    },

    /**
     * 聊天式：服务端按 id DESC 返回（最新在前），前端不做翻转。
     * 容器使用 flex-direction: column-reverse，使最新视觉在底部、最早在顶部。
     * 向上滚动 → 视觉接近顶部（实际是 scrollTop 绝对值变大） → 触发加载更早。
     */
    async fetchConversations(append = false) {
      if (append) {
        this.loadingMore = true
      } else {
        this.loadingHistory = true
      }
      try {
        const { data } = await listConversations({
          page: this.page,
          page_size: this.pageSize,
          media_type: this.mode
        })
        const items = (data.data && data.data.items) || [] // DESC：新 -> 旧
        const total = (data.data && data.data.total) || 0
        this.total = total

        if (append) {
          // 更早的页面：拼到数组末尾（在 column-reverse 下视觉上出现在更上方）
          const exist = new Set(this.conversations.map((x) => x.conversation_id).filter(Boolean))
          const older = items.filter((it) => !exist.has(it.conversation_id))
          this.conversations = [...this.conversations, ...older]
        } else {
          this.conversations = items
        }
        const realLoaded = this.conversations.filter((x) => x.conversation_id).length
        this.hasMore = realLoaded < total
      } catch (e) {
        this.$message.error(e.message || '加载历史失败')
      } finally {
        this.loadingHistory = false
        this.loadingMore = false
      }
    },
    async loadMore() {
      if (this.loadingMore || this.loadingHistory || !this.hasMore) return
      this.page += 1
      await this.fetchConversations(true)
    },
    onStreamScroll(e) {
      const el = e.target
      if (!el) return
      // column-reverse 下 scrollTop=0 表示视觉底部；向上滚动 scrollTop 的绝对值变大。
      // 触发条件：滚动到剩余 ≤60px 即可看到顶部时加载更早。
      const distanceToTop = el.scrollHeight - el.clientHeight - Math.abs(el.scrollTop)
      if (distanceToTop <= 60) {
        this.loadMore()
      }
    },
    async fetchAiCats() {
      try {
        const { data } = await getImageAllCatgory({ image_cat_id: 0, source: 'ai_generate' })
        // 后端返回 { list: [...] }
        const list = (data && data.list) || (data && data.data && data.data.list) || []
        this.aiCatList = list
      } catch (e) { /* silent */ }
    },
    async onAddAiCat() {
      try {
        const { value } = await this.$prompt('请输入分组名称', '新建 AI 素材分组', {
          confirmButtonText: '创建',
          cancelButtonText: '取消',
          inputValidator: (v) => (v && v.trim().length > 0 && v.length <= 20) || '名称必填且不超过 20 字'
        })
        const name = (value || '').trim()
        await addImageCatgory({
          image_cat_name: name,
          parent_id: 0,
          source: 'ai_generate'
        })
        await this.fetchAiCats()
        // 自动选中刚建的分组
        const created = this.aiCatList.find((c) => c.image_cat_name === name)
        if (created) this.saveForm.image_cat_id = created.image_cat_id
        this.$message.success('分组已创建')
      } catch (e) {
        if (e !== 'cancel' && e && e.message) this.$message.error(e.message)
      }
    },
    onModeChange() {
      this.page = 1
      this.hasMore = true
      this.conversations = []
      this.fetchConversations()
    },

    /**
     * 视频任务异步轮询：5s 一次轮询所有 running 视频任务，
     * 触发后端 GET /conversations/{id} 时会顺带 pollOne 拉取最新状态。
     */
    startPolling() {
      this.stopPolling()
      this._pollTimer = setInterval(() => this.pollVideoTasks(), 5000)
    },
    stopPolling() {
      if (this._pollTimer) {
        clearInterval(this._pollTimer)
        this._pollTimer = null
      }
    },
    async pollVideoTasks() {
      const targets = this.conversations.filter((c) =>
        (c.media_type || '') === 'video'
        && (c.status === 'pending' || c.status === 'running')
        && c.conversation_id
      )
      if (!targets.length) return
      for (const c of targets) {
        try {
          const { data } = await getConversation(c.conversation_id)
          const fresh = (data && data.data) || null
          if (!fresh) continue
          const idx = this.conversations.findIndex((x) => x.conversation_id === c.conversation_id)
          if (idx >= 0) this.$set(this.conversations, idx, fresh)
        } catch (e) { /* silent */ }
      }
    },
    onSizeChange(v) {
      this.form.resolution = v.resolution
      this.form.ratio = v.ratio
      this.form.customW = v.customW
      this.form.customH = v.customH
    },
    onApplyAdvanced(v) {
      if (this.mode === 'video') {
        this.videoForm = { ...this.videoForm, ...v }
      } else {
        this.form = { ...this.form, ...v }
      }
    },
    onMaxImagesChange(n) { this.form.maxImages = n },
    onUseTemplate(t) {
      const tplMedia = t.media_type || 'image'
      // 模板类型与当前模式不一致时自动切换
      if (tplMedia !== this.mode) {
        this.mode = tplMedia
        this.onModeChange()
      }
      const p = t.params || {}
      if (tplMedia === 'video') {
        const next = DEFAULT_VIDEO_FORM()
        next.prompt = t.prompt || ''
        next.mode = p.mode || 'reference'
        next.resolution = p.resolution || next.resolution
        next.ratio = p.ratio || next.ratio
        next.smartRatio = !!(p.smart_ratio || p.smartRatio || p.ratio === 'adaptive')
        next.duration = Number(p.duration || next.duration) || next.duration
        next.durationSmart = !!(p.auto_duration || p.durationSmart)
        next.count = Math.max(1, Number(p.count || 1))
        next.generateAudio = !!(p.generate_audio || p.generateAudio)
        next.returnLastFrame = !!(p.return_last_frame || p.returnLastFrame)
        next.useWebSearch = !!(p.use_web_search || p.useWebSearch)
        next.watermark = !!p.watermark
        next.seed = Number(p.seed || 0) || 0
        next.imageStart = (p.image_start || p.imageStart || '')
        next.imageEnd = (p.image_end || p.imageEnd || '')
        // 输入素材是混合数组（图/视频/音频），按 URL 后缀拆分回三个引用列表
        const inputs = Array.isArray(t.input_images)
          ? t.input_images.filter((u) => typeof u === 'string' && u)
          : (Array.isArray(p.reference_images) ? p.reference_images.filter(Boolean) : [])
        const imgs = []
        const vids = []
        const auds = []
        inputs.forEach((u) => {
          if (this.isVideoUrl(u)) vids.push(u)
          else if (this.isAudioUrl(u)) auds.push(u)
          else imgs.push(u)
        })
        next.referenceImages = imgs.slice(0, 9)
        next.referenceVideos = vids.slice(0, 3)
        next.referenceAudios = auds.slice(0, 3)
        if (!next.imageStart && imgs.length) next.imageStart = imgs[0]
        // 首尾帧模式下 referenceImages 应清空
        if (next.mode === 'first_last') {
          next.referenceImages = []
          next.referenceVideos = []
          next.referenceAudios = []
        } else {
          next.imageStart = ''
          next.imageEnd = ''
        }
        this.videoForm = next
        this.$nextTick(() => this.$refs.videoBar && this.$refs.videoBar.focus && this.$refs.videoBar.focus())
        return
      }
      // 图片
      this.promptText = t.prompt || ''
      const imgs = Array.isArray(t.input_images) ? t.input_images.filter(Boolean) : []
      this.inputImages = imgs.slice(0, 14)
      this.form.resolution = p.resolution || this.form.resolution
      this.form.ratio = p.ratio || this.form.ratio
      this.form.outputFormat = p.output_format || this.form.outputFormat
      this.form.watermark = typeof p.watermark === 'number' ? p.watermark : this.form.watermark
      this.form.useWebSearch = !!p.use_web_search
      this.form.maxImages = p.max_images || this.form.maxImages
      if (p.size) {
        const { w, h } = parseSize(p.size)
        this.form.customW = w
        this.form.customH = h
      }
      this.$nextTick(() => this.$refs.promptInput && this.$refs.promptInput.focus())
    },
    formatSize(c) {
      const p = c.params || {}
      return p.size || `${p.resolution || ''} ${p.ratio || ''}`.trim() || '-'
    },
    previewImage(url) {
      this.previewUrl = url
      this.previewVisible = true
    },
    useLastAsInput() {
      if (this.lastResultUrl) {
        this.inputImages = [this.lastResultUrl]
      }
    },
    onReedit(c) {
      const cMedia = c.media_type || 'image'
      if (cMedia !== this.mode) {
        this.mode = cMedia
        this.onModeChange()
      }
      const p = c.params || {}
      if (cMedia === 'video') {
        const next = DEFAULT_VIDEO_FORM()
        next.prompt = c.prompt || ''
        next.mode = p.mode || 'reference'
        next.resolution = p.resolution || next.resolution
        next.ratio = p.ratio || next.ratio
        next.smartRatio = !!(p.smart_ratio || p.smartRatio || p.ratio === 'adaptive')
        next.duration = Number(p.duration || next.duration) || next.duration
        next.durationSmart = !!(p.auto_duration || p.durationSmart)
        next.count = Math.max(1, Number(p.count || 1))
        next.generateAudio = !!(p.generate_audio || p.generateAudio)
        next.returnLastFrame = !!(p.return_last_frame || p.returnLastFrame)
        next.useWebSearch = !!(p.use_web_search || p.useWebSearch)
        next.watermark = !!p.watermark
        next.seed = Number(p.seed || 0) || 0
        next.imageStart = (p.image_start || '')
        next.imageEnd = (p.image_end || '')
        // 优先用混合 input_images（按后缀拆分），回退到 params.reference_*
        const inputs = Array.isArray(c.input_images) && c.input_images.length
          ? c.input_images.filter((u) => typeof u === 'string' && u)
          : []
        if (inputs.length) {
          const imgs = []
          const vids = []
          const auds = []
          inputs.forEach((u) => {
            if (this.isVideoUrl(u)) vids.push(u)
            else if (this.isAudioUrl(u)) auds.push(u)
            else imgs.push(u)
          })
          next.referenceImages = imgs.slice(0, 9)
          next.referenceVideos = vids.slice(0, 3)
          next.referenceAudios = auds.slice(0, 3)
        } else {
          next.referenceImages = Array.isArray(p.reference_images) ? p.reference_images.filter(Boolean).slice(0, 9) : []
          next.referenceVideos = Array.isArray(p.reference_videos)
            ? p.reference_videos.map((v) => (typeof v === 'string' ? v : (v && v.video_url) || '')).filter(Boolean).slice(0, 3)
            : []
          next.referenceAudios = Array.isArray(p.reference_audios) ? p.reference_audios.filter(Boolean).slice(0, 3) : []
        }
        this.videoForm = next
        this.$nextTick(() => {
          this.$refs.videoBar && this.$refs.videoBar.focus && this.$refs.videoBar.focus()
          const el = this.$refs.conversationsRef
          if (el) el.scrollTop = 0
        })
        return
      }
      this.promptText = c.prompt || ''
      this.form.resolution = p.resolution || this.form.resolution
      this.form.ratio = p.ratio || this.form.ratio
      this.form.outputFormat = p.output_format || this.form.outputFormat
      this.form.watermark = typeof p.watermark === 'number' ? p.watermark : this.form.watermark
      this.form.useWebSearch = !!p.use_web_search
      this.form.maxImages = p.max_images || 1
      if (p.size) {
        const { w, h } = parseSize(p.size)
        this.form.customW = w
        this.form.customH = h
      }
      // 重新编辑：把原始的"输入参考图"放回输入框
      const refs = Array.isArray(c.input_images) ? c.input_images.filter(Boolean) : []
      this.inputImages = refs.slice(0, 14)
      this.$nextTick(() => {
        this.$refs.promptInput && this.$refs.promptInput.focus()
        const el = this.$refs.conversationsRef
        if (el) el.scrollTop = 0
      })
    },
    onMoreCommand(cmd, c) {
      if (cmd === 'delete') this.onDeleteConv(c)
    },
    async onDeleteConv(c) {
      try {
        await this.$confirm('确定删除这条制作记录吗？', '提示', { type: 'warning' })
        if (c.conversation_id) {
          await deleteConversation(c.conversation_id)
        }
        this.conversations = this.conversations.filter((x) =>
          c.conversation_id ? x.conversation_id !== c.conversation_id : x._tempId !== c._tempId
        )
        this.$message.success('已删除')
      } catch (e) { /* canceled */ }
    },
    async onGenerate() {
      const prompt = (this.promptText || '').trim()
      if (!prompt) { this.$message.warning('请输入提示词'); return }

      const params = {
        resolution: this.form.resolution,
        ratio: this.form.ratio,
        custom_w: this.form.customW || 0,
        custom_h: this.form.customH || 0,
        output_format: this.form.outputFormat,
        watermark: this.form.watermark,
        use_web_search: this.form.useWebSearch ? 1 : 0,
        max_images: this.form.maxImages,
        size: `${this.form.customW || 0}x${this.form.customH || 0}`
      }
      const payload = {
        prompt,
        params,
        input_images: this.inputImages,
        use_last_output: this.inputImages.length === 0
      }

      // 1) 乐观插入一条 pending 记录到数组开头（DESC：最新）
      // 在 column-reverse 容器下视觉上即刻出现在底部（最靠近输入框）
      const tempId = `temp_${Date.now()}`
      const optimistic = {
        _tempId: tempId,
        conversation_id: 0,
        status: 'pending',
        prompt,
        params,
        input_images: [...this.inputImages],
        output_images: [],
        media_type: this.mode,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      this.conversations = [optimistic, ...this.conversations]

      this.generating = true
      try {
        const { data } = await generateImage(payload)
        const conv = (data && data.data) || {}
        const idx = this.conversations.findIndex((x) => x._tempId === tempId)
        if (idx >= 0) {
          this.$set(this.conversations, idx, conv)
        } else if (conv.conversation_id) {
          this.conversations = [conv, ...this.conversations]
        }
        // 提交成功（已创建会话）后清空输入；参数（分辨率/比例等）保留
        this.promptText = ''
        this.inputImages = []
      } catch (e) {
        const idx = this.conversations.findIndex((x) => x._tempId === tempId)
        if (idx >= 0) {
          this.$set(this.conversations, idx, {
            ...this.conversations[idx],
            status: 'failed',
            error_message: (e && e.message) || '生成失败'
          })
        }
        this.$message.error((e && e.message) || '生成失败')
        // 失败保留输入，方便用户改完重试
      } finally {
        this.generating = false
      }
    },
    hasSavableOutput(c) {
      if (!c) return false
      return !!(c.output_images && c.output_images.length)
    },
    onSaveDialog(conv) {
      const url = (conv.output_images && conv.output_images[0]) || ''
      const mediaType = this._guessMediaType(conv, url)
      this.saveForm = {
        url,
        conversation_id: conv.conversation_id,
        name: '',
        media_type: mediaType,
        mime: this._guessMimeFromUrl(url, mediaType),
        image_cat_id: 0
      }
      this.saveVisible = true
      // 拉一次 AI 分组（可能是首次打开）
      this.fetchAiCats()
    },
    async onSaveConfirm() {
      if (!this.saveForm.url) { this.$message.warning('未找到可保存的素材 URL'); return }
      this.saving = true
      try {
        await saveToLibrary({
          oss_url: this.saveForm.url,
          name: this.saveForm.name,
          media_type: this.saveForm.media_type || 'image',
          mime: this.saveForm.mime || '',
          image_cat_id: Number(this.saveForm.image_cat_id || 0)
        })
        this.$message.success('已保存到素材库')
        this.saveVisible = false
      } catch (e) {
        this.$message.error(e.message || '保存失败')
      } finally {
        this.saving = false
      }
    },
    onTemplateDialog(conv) {
      const url = (conv.output_images && conv.output_images[0]) || ''
      this.tplForm = {
        url,
        conversation_id: conv.conversation_id || 0,
        title: '',
        media_type: this._guessMediaType(conv, url)
      }
      this.tplVisible = true
    },
    async onTemplateConfirm() {
      if (!this.tplForm.conversation_id) {
        this.$message.warning('未关联会话，无法设为模板')
        return
      }
      const title = (this.tplForm.title || '').trim()
      if (!title) { this.$message.warning('请填写模板标题'); return }
      this.tplSaving = true
      try {
        await createTemplate({
          source_conversation_id: this.tplForm.conversation_id,
          media_type: this.tplForm.media_type || 'image',
          title
          // 后端从 conversation 反查 prompt / output_images / input_images / params
        })
        this.$message.success('已设为模板')
        this.tplVisible = false
      } catch (e) {
        this.$message.error(e.message || '设为模板失败')
      } finally {
        this.tplSaving = false
      }
    },

    _guessMediaType(conv, url) {
      if (conv && (conv.media_type === 'video' || conv.media_type === 'audio' || conv.media_type === 'image')) {
        return conv.media_type
      }
      const ext = String(url || '').split('?')[0].split('.').pop().toLowerCase()
      if (['mp4', 'mov', 'webm', 'm4v'].indexOf(ext) > -1) return 'video'
      if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].indexOf(ext) > -1) return 'audio'
      return 'image'
    },
    _guessMimeFromUrl(url, mediaType) {
      const ext = String(url || '').split('?')[0].split('.').pop().toLowerCase()
      const map = {
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
        webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp',
        mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
        mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg'
      }
      if (map[ext]) return map[ext]
      if (mediaType === 'video') return 'video/mp4'
      if (mediaType === 'audio') return 'audio/mpeg'
      return 'image/png'
    },

    /**
     * 视频生成：构造与后端 AIMaterialController.generate (media_type=video) 匹配的 payload
     */
    async onGenerateVideo(form) {
      const prompt = (form.prompt || '').trim()
      if (!prompt) { this.$message.warning('请输入提示词'); return }

      const params = {
        mode: form.mode,
        resolution: form.resolution,
        ratio: form.smartRatio ? 'adaptive' : form.ratio,
        smart_ratio: form.smartRatio ? 1 : 0,
        duration: form.durationSmart ? 0 : form.duration,
        auto_duration: form.durationSmart ? 1 : 0,
        count: form.count || 1,
        generate_audio: form.generateAudio ? 1 : 0,
        return_last_frame: form.returnLastFrame ? 1 : 0,
        use_web_search: form.useWebSearch ? 1 : 0,
        watermark: form.watermark ? 1 : 0,
        seed: form.seed || 0
      }

      const payload = {
        media_type: 'video',
        prompt,
        mode: form.mode,
        params,
        image_start: form.mode === 'first_last' ? (form.imageStart || '') : '',
        image_end: form.mode === 'first_last' ? (form.imageEnd || '') : '',
        reference_images: form.mode === 'reference' ? (form.referenceImages || []) : [],
        reference_videos: form.mode === 'reference' ? (form.referenceVideos || []) : [],
        reference_audios: form.mode === 'reference' ? (form.referenceAudios || []) : []
      }

      const inputThumbs = []
      if (form.mode === 'first_last') {
        if (form.imageStart) inputThumbs.push(form.imageStart)
        if (form.imageEnd) inputThumbs.push(form.imageEnd)
      } else {
        // 混合输入：图/视频/音频按上传顺序合并
        inputThumbs.push(...(form.referenceImages || []))
        inputThumbs.push(...(form.referenceVideos || []))
        inputThumbs.push(...(form.referenceAudios || []))
      }

      const tempId = `temp_${Date.now()}`
      const optimistic = {
        _tempId: tempId,
        conversation_id: 0,
        status: 'pending',
        prompt,
        params,
        input_images: inputThumbs,
        output_images: [],
        media_type: 'video',
        polling_status: 'queued',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      this.conversations = [optimistic, ...this.conversations]

      this.generating = true
      try {
        const { data } = await generateImage(payload)
        const conv = (data && data.data) || {}
        const idx = this.conversations.findIndex((x) => x._tempId === tempId)
        if (idx >= 0) {
          this.$set(this.conversations, idx, conv)
        } else if (conv.conversation_id) {
          this.conversations = [conv, ...this.conversations]
        }
        // 提交成功后清空提示词和参考素材；参数（分辨率/比例/时长/数量等）保留
        this.videoForm = {
          ...this.videoForm,
          prompt: '',
          imageStart: '',
          imageEnd: '',
          referenceImages: [],
          referenceVideos: [],
          referenceAudios: []
        }
      } catch (e) {
        const idx = this.conversations.findIndex((x) => x._tempId === tempId)
        if (idx >= 0) {
          this.$set(this.conversations, idx, {
            ...this.conversations[idx],
            status: 'failed',
            error_message: (e && e.message) || '提交视频任务失败'
          })
        }
        this.$message.error((e && e.message) || '提交视频任务失败')
        // 失败保留输入便于调整重试
      } finally {
        this.generating = false
      }
    }
  }
}
</script>

<style scoped>
.material-studio { display: flex; flex-direction: column; height: 100%; }
.studio-header { display: flex; align-items: center; justify-content: space-between; }
.header-actions { display: flex; gap: 8px; }

.studio-body {
  display: flex; flex-direction: column;
  height: calc(100vh - 220px);
  min-height: 520px;
  background: #f5f7fa; border-radius: 8px; overflow: hidden; position: relative;
}

.conv-stream {
  flex: 1; overflow-y: auto; overflow-anchor: none;
  padding: 20px 24px 220px;
  display: flex;
  /* 聊天式布局：服务端 DESC 顺序不动，column-reverse 把"最新"渲染到底部 */
  flex-direction: column-reverse;
  gap: 16px;
}
.conv-card {
  background: #fff; border-radius: 10px; padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.conv-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; color: #909399; }
.meta-spacer { flex: 1; }
.conv-prompt { color: #303133; font-size: 14px; line-height: 1.6; margin-bottom: 8px; }
.conv-params { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.conv-input-imgs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.thumb.sm { position: relative; width: 48px; height: 48px; border-radius: 4px; overflow: hidden; border: 1px solid #ebeef5; background: #f5f7fa; }
.thumb.sm img,
.thumb.sm video { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb.sm.k-video::after {
  content: '\25B6';
  position: absolute; right: 2px; bottom: 0;
  color: #fff; font-size: 10px;
  text-shadow: 0 0 2px rgba(0,0,0,.6);
}
.thumb.sm.k-audio { display: flex; align-items: center; justify-content: center; }
.thumb.sm .thumb-icon { font-size: 22px; color: #909399; }

.conv-output { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
.result-card {
  width: 220px; border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden;
  background: #fafafa;
}
.result-img { cursor: zoom-in; }
.result-img img { width: 100%; display: block; aspect-ratio: 1; object-fit: cover; }
.result-card.video { width: 320px; position: relative; }
.result-video { width: 100%; display: block; background: #000; max-height: 320px; }
.video-meta {
  position: absolute; right: 6px; bottom: 6px;
  background: rgba(0,0,0,.55); color: #fff; font-size: 11px;
  padding: 1px 6px; border-radius: 3px;
}

.conv-error {
  background: #fef0f0; color: #f56c6c; font-size: 13px;
  padding: 10px 12px; border-radius: 6px; border-left: 3px solid #f56c6c;
  margin-bottom: 8px;
}

.conv-loading {
  display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
}
.skeleton-card {
  width: 220px; height: 220px; border-radius: 8px;
  background: linear-gradient(90deg, #f5f7fa 0%, #ebeef5 50%, #f5f7fa 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}
.skeleton-text { color: #909399; font-size: 13px; }
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.conv-actions {
  display: flex; align-items: center; gap: 8px;
  padding-top: 8px; border-top: 1px dashed #f0f2f5;
}
.conv-actions .el-button + .el-button { margin-left: 0; }

.load-more-tip {
  text-align: center; color: #909399; font-size: 12px; padding: 8px 0;
}
.load-more-tip.end { color: #c0c4cc; }

/* —— 输入条 —— */
.input-bar {
  position: absolute; left: 24px; right: 24px; bottom: 16px;
  background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, .08);
  border: 1px solid #ebeef5; z-index: 10;
  padding: 12px 14px;
}
.bar-tip {
  font-size: 12px; color: #909399; line-height: 1.5;
  margin: 0 0 6px;
}
.bar-tip .ref-mark { color: #409eff; font-weight: 600; }
.bar-top {
  display: flex; align-items: flex-start; gap: 10px;
}
.prompt-input {
  flex: 1;
}
.prompt-input >>> .el-textarea__inner {
  border: none; box-shadow: none; padding: 6px 4px; font-size: 14px;
  background: transparent; resize: none;
}
.prompt-input >>> .el-textarea__inner:focus { box-shadow: none; }
.tpl-trigger {
  flex-shrink: 0; padding: 0;
  font-size: 13px; color: #606266;
}
.tpl-trigger:hover { color: #409eff; }

.bar-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0 0; gap: 12px;
  border-top: 1px solid #f5f7fa;
  margin-top: 8px;
}
.toolbar-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.toolbar-right { display: flex; align-items: center; gap: 8px; }
.quota { color: #909399; font-size: 12px; }

.form-tip { color: #909399; font-size: 12px; line-height: 1.5; margin-top: 4px; }
</style>
