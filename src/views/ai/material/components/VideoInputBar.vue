<template>
  <div class="video-input-bar">
    <!-- 顶部：素材区 + 提示词 + 模板 -->
    <div class="bar-top">
      <!-- 参考生成：三合一上传器 -->
      <div v-if="form.mode === 'reference'" class="ref-area">
        <MultiMediaUpload
          :images.sync="form.referenceImages"
          :videos.sync="form.referenceVideos"
          :audios.sync="form.referenceAudios"
          :max-images="9"
          :max-videos="3"
          :max-audios="3"
        />
      </div>

      <!-- 首尾帧：image_start + image_end -->
      <div v-else class="frame-rows">
        <div class="frame-col">
          <RefImageUpload v-model="firstFrameWrap" kind="image" :max="1" />
          <div class="frame-label">首帧 <span class="required">*</span></div>
        </div>
        <i class="el-icon-right divider"></i>
        <div class="frame-col">
          <RefImageUpload v-model="lastFrameWrap" kind="image" :max="1" />
          <div class="frame-label">尾帧</div>
        </div>
      </div>

      <PromptInput
        ref="promptInput"
        v-model="form.prompt"
        :items="refItems"
        :placeholder="promptPlaceholder"
        :min-rows="2"
        :max-rows="6"
        class="prompt-input"
      />

      <el-button
        class="tpl-trigger"
        type="text"
        icon="el-icon-magic-stick"
        @click="$emit('open-template')"
        >模板</el-button
      >
    </div>

    <!-- 提示文案：仅在参考生成且有素材时显示 -->
    <div v-if="form.mode === 'reference' && hasAnyRef" class="ref-tip">
      使用 @ 可快速引用上传的文件，如：参考 @视频1 中的动作，生成 @图片2 和 @图片3
      中的角色打斗的视频。
    </div>

    <!-- 工具条 -->
    <div class="bar-toolbar">
      <div class="toolbar-left">
        <!-- 模式下拉 -->
        <el-dropdown trigger="click" @command="setMode">
          <el-button size="small" plain icon="el-icon-magic-stick">
            {{ modeLabel }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="reference" :divided="false">参考生成</el-dropdown-item>
            <el-dropdown-item command="first_last">首尾帧</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 视频参数聚合按钮（比例 / 分辨率 / 时长 / 数量） -->
        <el-popover
          trigger="click"
          placement="top-start"
          width="360"
          popper-class="video-params-popover"
          v-model="paramsPopoverOpen"
        >
          <div class="params-pop">
            <!-- 视频比例 -->
            <div class="pop-section">
              <div class="pop-section-title">视频比例</div>
              <div class="ratio-grid">
                <div
                  v-for="r in videoRatios"
                  :key="r.value"
                  class="ratio-cell"
                  :class="{ active: !form.smartRatio && form.ratio === r.value }"
                  @click="onPickRatio(r.value)"
                >
                  <i class="ratio-icon" :class="ratioIconClass(r.value)"></i>
                  <div class="ratio-label">{{ r.label }}</div>
                </div>
                <div
                  class="ratio-cell"
                  :class="{ active: form.smartRatio }"
                  @click="onToggleSmart(true)"
                >
                  <i class="el-icon-magic-stick ratio-icon smart"></i>
                  <div class="ratio-label">智能</div>
                </div>
              </div>
            </div>

            <!-- 分辨率 -->
            <div class="pop-section">
              <div class="pop-section-title">分辨率</div>
              <div class="seg-row">
                <div
                  v-for="r in videoResolutions"
                  :key="r.value"
                  class="seg-cell"
                  :class="{ active: form.resolution === r.value }"
                  @click="form.resolution = r.value"
                >
                  {{ r.label }}
                </div>
              </div>
            </div>

            <!-- 视频时长 -->
            <div class="pop-section">
              <div class="pop-section-title">视频时长</div>
              <div class="seg-row">
                <div
                  class="seg-cell"
                  :class="{ active: !form.durationSmart }"
                  @click="form.durationSmart = false"
                >
                  按秒数
                </div>
                <div
                  class="seg-cell"
                  :class="{ active: form.durationSmart }"
                  @click="form.durationSmart = true"
                >
                  智能时长
                </div>
              </div>
              <div v-if="!form.durationSmart" class="slider-row">
                <el-slider
                  v-model="form.duration"
                  :min="durationMin"
                  :max="durationMax"
                  :step="1"
                  :show-tooltip="false"
                  style="flex: 1; margin-right: 12px"
                />
                <div class="num-display">{{ form.duration }} <span class="unit">秒</span></div>
              </div>
              <div v-else class="pop-tip">智能时长时，模型根据画面动作自适应视频长度</div>
            </div>

            <!-- 选择生成数量 -->
            <div class="pop-section">
              <div class="pop-section-title">选择生成数量</div>
              <div class="slider-row">
                <el-slider
                  v-model="form.count"
                  :min="1"
                  :max="4"
                  :step="1"
                  :show-tooltip="false"
                  style="flex: 1; margin-right: 12px"
                />
                <div class="num-display">{{ form.count }} <span class="unit">条</span></div>
              </div>
            </div>
          </div>

          <el-button slot="reference" size="small" plain class="agg-btn">
            <i class="el-icon-sort agg-icon"></i>
            <span class="agg-seg">{{ ratioLabel }}</span>
            <span class="agg-sep">|</span>
            <span class="agg-seg">{{ form.resolution }}</span>
            <span class="agg-sep">|</span>
            <span class="agg-seg">{{ durationLabel }}</span>
            <span class="agg-sep">|</span>
            <span class="agg-seg">{{ form.count }}条</span>
          </el-button>
        </el-popover>

        <!-- 生成声音 -->
        <el-tooltip content="生成有声视频（generate_audio）" placement="top">
          <el-button
            size="small"
            :type="form.generateAudio ? 'primary' : ''"
            :plain="!form.generateAudio"
            icon="el-icon-headset"
            @click="form.generateAudio = !form.generateAudio"
            >{{ form.generateAudio ? '有声' : '输出声音' }}</el-button
          >
        </el-tooltip>

        <el-button size="small" plain icon="el-icon-setting" @click="$emit('open-settings')"
          >详细设置</el-button
        >
      </div>

      <div class="toolbar-right">
        <el-button
          type="primary"
          size="small"
          circle
          icon="el-icon-top"
          :loading="loading"
          @click="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MultiMediaUpload from './MultiMediaUpload'
import RefImageUpload from './RefImageUpload'
import PromptInput from './PromptInput'
import { VIDEO_RATIOS, VIDEO_RESOLUTIONS, VIDEO_DURATIONS } from '../constants/sizeMap'
import { buildRefItems } from '../utils/refItems'

const DEFAULT_FORM = {
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
}

const MODE_LABELS = {
  reference: '参考生成',
  first_last: '首尾帧'
}

/**
 * 注意：value/form 双向同步使用 syncing 标志位防止反复触发引发的递归（点击切换模式时表现为页面卡死）。
 */
export default {
  name: 'VideoInputBar',
  components: { MultiMediaUpload, RefImageUpload, PromptInput },
  props: {
    value: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      form: { ...DEFAULT_FORM, ...(this.value || {}) },
      paramsPopoverOpen: false,
      syncing: false
    }
  },
  computed: {
    videoRatios() {
      return VIDEO_RATIOS
    },
    videoResolutions() {
      return VIDEO_RESOLUTIONS
    },
    videoDurations() {
      return VIDEO_DURATIONS
    },
    durationMin() {
      return VIDEO_DURATIONS[0] || 4
    },
    durationMax() {
      return VIDEO_DURATIONS[VIDEO_DURATIONS.length - 1] || 15
    },
    ratioLabel() {
      return this.form.smartRatio ? '智能比例' : this.form.ratio
    },
    durationLabel() {
      return this.form.durationSmart ? '智能时长' : `${this.form.duration}秒`
    },
    modeLabel() {
      return MODE_LABELS[this.form.mode] || '参考生成'
    },
    promptPlaceholder() {
      return this.form.mode === 'first_last'
        ? '描述首尾帧之间的动作，比如：从左侧缓慢推近...'
        : '描述你想生成的视频，比如：海浪拍打沙滩，镜头缓慢推近...'
    },
    hasAnyRef() {
      return (
        (this.form.referenceImages || []).length +
          (this.form.referenceVideos || []).length +
          (this.form.referenceAudios || []).length >
        0
      )
    },
    /** 提示词 @ 引用候选：按 图片N / 视频N / 音频N 编号的扁平列表 */
    refItems() {
      return buildRefItems({
        images: this.form.referenceImages,
        videos: this.form.referenceVideos,
        audios: this.form.referenceAudios
      })
    },
    firstFrameWrap: {
      get() {
        return this.form.imageStart ? [this.form.imageStart] : []
      },
      set(v) {
        this.form.imageStart = (v && v[0]) || ''
      }
    },
    lastFrameWrap: {
      get() {
        return this.form.imageEnd ? [this.form.imageEnd] : []
      },
      set(v) {
        this.form.imageEnd = (v && v[0]) || ''
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        if (this.syncing) return
        // 仅当父侧 value 与本地 form 实质不同时再回填，避免与 form watcher 形成回环
        const next = { ...DEFAULT_FORM, ...(v || {}) }
        if (JSON.stringify(next) === JSON.stringify(this.form)) return
        this.syncing = true
        this.form = next
        this.$nextTick(() => {
          this.syncing = false
        })
      }
    },
    form: {
      deep: true,
      handler(v) {
        if (this.syncing) return
        this.syncing = true
        this.$emit('input', { ...v })
        this.$nextTick(() => {
          this.syncing = false
        })
      }
    }
  },
  methods: {
    setMode(m) {
      if (this.form.mode === m) return
      // 一次性整包替换，避免多个独立属性 mutation 触发的多轮 emit
      this.syncing = true
      const next = { ...this.form, mode: m }
      if (m === 'reference') {
        next.imageStart = ''
        next.imageEnd = ''
      } else {
        next.referenceImages = []
        next.referenceVideos = []
        next.referenceAudios = []
      }
      this.form = next
      this.$emit('input', { ...next })
      this.$nextTick(() => {
        this.syncing = false
      })
    },
    onPickRatio(v) {
      this.form.ratio = v
      this.form.smartRatio = false
    },
    onToggleSmart(v) {
      this.form.smartRatio = !!v
      if (v) this.form.ratio = 'adaptive'
    },
    ratioIconClass(v) {
      const map = {
        '21:9': 'r-2109',
        '16:9': 'r-169',
        '4:3': 'r-43',
        '1:1': 'r-11',
        '3:4': 'r-34',
        '9:16': 'r-916'
      }
      return 'ratio-shape ' + (map[v] || 'r-11')
    },
    onSubmit() {
      const prompt = (this.form.prompt || '').trim()
      if (!prompt) {
        this.$message.warning('请输入提示词')
        return
      }
      if (this.form.mode === 'first_last' && !this.form.imageStart) {
        this.$message.warning('首尾帧模式需要提供首帧图')
        return
      }
      this.$emit('submit', { ...this.form })
    },
    focus() {
      this.$nextTick(() => this.$refs.promptInput && this.$refs.promptInput.focus())
    }
  }
}
</script>

<style scoped>
.video-input-bar {
  width: 100%;
}
.bar-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.ref-area {
  flex-shrink: 0;
  min-width: 80px;
}

.frame-rows {
  display: flex;
  align-items: center;
  gap: 6px;
}
.frame-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.frame-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.frame-label .required {
  color: #f56c6c;
}
.divider {
  font-size: 18px;
  color: #c0c4cc;
}

.prompt-input {
  flex: 1;
}
.prompt-input >>> .el-textarea__inner {
  border: none;
  box-shadow: none;
  padding: 6px 4px;
  font-size: 14px;
  background: transparent;
  resize: none;
}
.prompt-input >>> .el-textarea__inner:focus {
  box-shadow: none;
}
.tpl-trigger {
  flex-shrink: 0;
  padding: 0;
  font-size: 13px;
  color: #606266;
}
.tpl-trigger:hover {
  color: #409eff;
}

.ref-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin: 6px 0 -2px;
}

.bar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 0;
  gap: 12px;
  border-top: 1px solid #f5f7fa;
  margin-top: 8px;
}
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* —— 聚合按钮（智能比例 | 720p | 5秒 | 1条）—— */
.agg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
}
.agg-btn .agg-icon {
  font-size: 14px;
  color: #606266;
  transform: rotate(90deg);
}
.agg-btn .agg-seg {
  font-size: 13px;
  color: #303133;
}
.agg-btn .agg-sep {
  color: #dcdfe6;
  font-weight: 300;
}

/* —— 聚合 popover —— */
.params-pop {
  padding: 4px 4px 0;
}
.params-pop .pop-section {
  margin-bottom: 14px;
}
.params-pop .pop-section:last-child {
  margin-bottom: 0;
}
.params-pop .pop-section-title {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 8px;
}
.params-pop .pop-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}

/* 比例网格：每格上方一个示意图标，下方文字 */
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.ratio-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  background: #fff;
}
.ratio-cell:hover {
  border-color: #409eff;
}
.ratio-cell.active {
  background: #ecf5ff;
  border-color: #409eff;
}
.ratio-cell .ratio-label {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}
.ratio-cell.active .ratio-label {
  color: #409eff;
}

/* 比例缩略图：用纯 CSS 绘制不同长宽比的小矩形 */
.ratio-icon {
  display: block;
}
.ratio-shape {
  border: 1.5px solid #909399;
  border-radius: 2px;
  background: transparent;
}
.ratio-cell.active .ratio-shape {
  border-color: #409eff;
}
.ratio-shape.r-2109 {
  width: 28px;
  height: 12px;
}
.ratio-shape.r-169 {
  width: 26px;
  height: 14px;
}
.ratio-shape.r-43 {
  width: 22px;
  height: 16px;
}
.ratio-shape.r-11 {
  width: 18px;
  height: 18px;
}
.ratio-shape.r-34 {
  width: 14px;
  height: 18px;
}
.ratio-shape.r-916 {
  width: 12px;
  height: 20px;
}
.ratio-icon.smart {
  font-size: 18px;
  color: #909399;
}
.ratio-cell.active .ratio-icon.smart {
  color: #409eff;
}

/* 分段控件：分辨率 / 时长模式 */
.seg-row {
  display: flex;
  gap: 0;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 3px;
}
.seg-cell {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  border-radius: 4px;
  transition: all 0.15s;
}
.seg-cell:hover {
  color: #409eff;
}
.seg-cell.active {
  background: #fff;
  color: #303133;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.slider-row {
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.num-display {
  width: 64px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 0;
  font-size: 13px;
  color: #303133;
}
.num-display .unit {
  color: #909399;
  font-size: 12px;
  margin-left: 2px;
}
</style>
