<template>
  <el-drawer
    :title="mediaType === 'video' ? '视频参数' : '模型参数'"
    :visible.sync="visible"
    direction="rtl"
    size="380px"
    append-to-body
    @close="onClose"
  >
    <div class="adv-drawer">
      <!-- 图片参数 -->
      <template v-if="mediaType !== 'video'">
        <div class="section">
          <div class="section-title">分辨率</div>
          <el-radio-group v-model="form.resolution" size="small">
            <el-tooltip
              v-for="r in resolutions"
              :key="r.value"
              :disabled="!r.disabled"
              :content="r.tip || ''"
              placement="top"
            >
              <span>
                <el-radio-button :label="r.value" :disabled="r.disabled">{{
                  r.label
                }}</el-radio-button>
              </span>
            </el-tooltip>
          </el-radio-group>
        </div>

        <div class="section">
          <div class="section-title">图片比例</div>
          <div class="ratio-grid">
            <div
              v-for="r in ratios"
              :key="r.value"
              class="ratio-item"
              :class="{ active: form.ratio === r.value }"
              @click="onRatioClick(r.value)"
            >
              {{ r.label }}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">图片尺寸</div>
          <div class="size-inputs">
            <el-input
              v-model.number="form.customW"
              placeholder="W"
              size="small"
              @change="onCustomChange"
            >
              <template slot="prepend">W</template>
            </el-input>
            <i class="el-icon-link link-icon" />
            <el-input
              v-model.number="form.customH"
              placeholder="H"
              size="small"
              @change="onCustomChange"
            >
              <template slot="prepend">H</template>
            </el-input>
          </div>
          <div v-if="errorMsg" class="error-tip">{{ errorMsg }}</div>
        </div>

        <div class="section">
          <div class="section-title">最大生成张数</div>
          <div class="slider-row">
            <el-slider
              v-model="form.maxImages"
              :min="1"
              :max="15"
              style="flex: 1; margin-right: 16px"
            />
            <el-input-number
              v-model="form.maxImages"
              :min="1"
              :max="15"
              size="small"
              :controls="false"
              style="width: 80px"
            />
          </div>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">联网搜索</span>
            <el-switch v-model="form.useWebSearch" />
          </div>
          <div class="hint">开启后模型可使用 web_search 工具拓展素材</div>
        </div>

        <div class="section">
          <div class="section-title">图片格式</div>
          <el-radio-group v-model="form.outputFormat" size="small">
            <el-radio-button label="jpeg">JPEG</el-radio-button>
            <el-radio-button label="png">PNG</el-radio-button>
          </el-radio-group>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">水印</span>
            <el-switch
              :value="form.watermark === 1"
              @change="(v) => (form.watermark = v ? 1 : 0)"
            />
          </div>
        </div>
      </template>

      <!-- 视频参数 -->
      <template v-else>
        <div class="section">
          <div class="section-title">生成模式</div>
          <el-radio-group v-model="form.mode" size="small">
            <el-radio-button label="reference">参考生成</el-radio-button>
            <el-radio-button label="first_last">首尾帧</el-radio-button>
          </el-radio-group>
          <div class="hint">
            参考生成支持参考图/参考视频/参考音频；首尾帧仅支持首帧（必填）+ 尾帧（可选）
          </div>
        </div>

        <div class="section">
          <div class="section-title">画面比例</div>
          <div class="ratio-grid">
            <div
              v-for="r in videoRatios"
              :key="r.value"
              class="ratio-item"
              :class="{ active: !form.smartRatio && form.ratio === r.value }"
              @click="onVideoRatioClick(r.value)"
            >
              {{ r.label }}
            </div>
          </div>
          <el-checkbox v-model="form.smartRatio" style="margin-top: 8px" @change="onToggleSmart"
            >智能比例（adaptive）</el-checkbox
          >
        </div>

        <div class="section">
          <div class="section-title">分辨率</div>
          <el-radio-group v-model="form.resolution" size="small">
            <el-radio-button v-for="r in videoResolutions" :key="r.value" :label="r.value">{{
              r.label
            }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="section">
          <div class="section-title">视频时长（秒）</div>
          <div class="slider-row">
            <el-slider
              v-model="form.duration"
              :min="4"
              :max="15"
              :step="1"
              style="flex: 1; margin-right: 16px"
            />
            <el-input-number
              v-model="form.duration"
              :min="4"
              :max="15"
              :step="1"
              size="small"
              :controls="false"
              style="width: 80px"
            />
          </div>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">生成有声视频</span>
            <el-switch v-model="form.generateAudio" />
          </div>
          <div class="hint">开启后会生成自适应背景音；视频时长不变</div>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">返回尾帧图</span>
            <el-switch v-model="form.returnLastFrame" />
          </div>
          <div class="hint">方便做"接龙"二次创作</div>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">联网搜索</span>
            <el-switch v-model="form.useWebSearch" />
          </div>
        </div>

        <div class="section">
          <div class="section-row">
            <span class="section-title-inline">水印</span>
            <el-switch v-model="form.watermark" />
          </div>
        </div>

        <div class="section">
          <div class="section-title">随机种子（可选）</div>
          <el-input-number
            v-model="form.seed"
            :min="0"
            :max="2147483647"
            size="small"
            :controls="false"
            style="width: 100%"
          />
          <div class="hint">
            种子值用于控制生成内容的随机性，相同的种子值会生成类似的视频内容，-1代表随机数
          </div>
        </div>
      </template>

      <div class="actions">
        <el-button size="small" @click="reset">重置</el-button>
        <el-button type="primary" size="small" @click="apply">应用</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  RESOLUTIONS,
  RATIOS,
  validatePixel,
  VIDEO_RESOLUTIONS,
  VIDEO_RATIOS
} from '../constants/sizeMap'

export default {
  name: 'AdvancedSettingsDrawer',
  props: {
    value: { type: Boolean, default: false },
    params: { type: Object, default: () => ({}) },
    mediaType: { type: String, default: 'image' }
  },
  data() {
    return {
      visible: this.value,
      resolutions: RESOLUTIONS,
      ratios: RATIOS.filter((r) => r.value !== 'auto'),
      videoResolutions: VIDEO_RESOLUTIONS,
      videoRatios: VIDEO_RATIOS,
      errorMsg: '',
      form: this.normalize(this.params, this.mediaType)
    }
  },
  watch: {
    value(v) {
      this.visible = v
      if (v) this.form = this.normalize(this.params, this.mediaType)
    },
    visible(v) {
      if (v !== this.value) this.$emit('input', v)
    }
  },
  methods: {
    normalize(p, mediaType) {
      if (mediaType === 'video') {
        return {
          mode: p.mode || 'reference',
          resolution: p.resolution || '720p',
          ratio: p.ratio || '16:9',
          smartRatio: !!(p.smartRatio || p.smart_ratio),
          duration: Number(p.duration || 5) || 5,
          durationSmart: !!(p.durationSmart || p.auto_duration),
          count: Math.max(1, Number(p.count || 1) || 1),
          generateAudio: !!(p.generateAudio || p.generate_audio),
          returnLastFrame: !!(p.returnLastFrame || p.return_last_frame),
          useWebSearch: !!(p.useWebSearch || p.use_web_search),
          watermark: !!p.watermark,
          seed: Number(p.seed || -1) || -1
        }
      }
      return {
        resolution: p.resolution || '2K',
        ratio: p.ratio || '1:1',
        customW: Number(p.customW || p.custom_w || 0) || 0,
        customH: Number(p.customH || p.custom_h || 0) || 0,
        maxImages: Number(p.maxImages || p.max_images || 1) || 1,
        useWebSearch: !!(p.useWebSearch || p.use_web_search),
        outputFormat: p.outputFormat || p.output_format || 'png',
        watermark: typeof p.watermark === 'number' ? p.watermark : 1
      }
    },
    onRatioClick(v) {
      this.form.ratio = v
      this.form.customW = 0
      this.form.customH = 0
      this.errorMsg = ''
    },
    onVideoRatioClick(v) {
      this.form.ratio = v
      this.form.smartRatio = false
    },
    onToggleSmart(v) {
      if (v) this.form.ratio = 'adaptive'
    },
    onCustomChange() {
      this.errorMsg = validatePixel(this.form.customW, this.form.customH)
    },
    reset() {
      this.form = this.normalize({}, this.mediaType)
      this.errorMsg = ''
    },
    apply() {
      if (this.mediaType !== 'video' && (this.form.customW || this.form.customH)) {
        this.errorMsg = validatePixel(this.form.customW, this.form.customH)
        if (this.errorMsg) return
      }
      this.$emit('apply', { ...this.form })
      this.visible = false
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.adv-drawer {
  padding: 0 20px 20px;
  overflow-y: auto;
}
.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}
.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title-inline {
  font-size: 13px;
  color: #606266;
}
.hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.ratio-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.ratio-item:hover {
  border-color: #409eff;
}
.ratio-item.active {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}
.size-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}
.size-inputs .el-input {
  flex: 1;
}
.link-icon {
  font-size: 18px;
  color: #909399;
}
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
.slider-row {
  display: flex;
  align-items: center;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
