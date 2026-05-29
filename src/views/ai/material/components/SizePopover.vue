<template>
  <el-popover placement="top" width="480" trigger="click" popper-class="size-popover">
    <div class="size-popover-content">
      <div class="section">
        <div class="section-title">分辨率</div>
        <el-radio-group v-model="innerResolution" size="small" @change="onChange">
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
            :class="{ active: innerRatio === r.value }"
            @click="onRatioClick(r.value)"
          >
            <div class="ratio-icon" :class="`r-${r.value.replace(':', '-')}`"></div>
            <span class="ratio-label">{{ r.label }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">图片尺寸</div>
        <div class="size-inputs">
          <el-input v-model.number="innerW" placeholder="W" size="small" @change="onCustomChange">
            <template slot="prepend">W</template>
          </el-input>
          <i
            :class="lockOn ? 'el-icon-link' : 'el-icon-close'"
            class="link-icon"
            @click="lockOn = !lockOn"
          />
          <el-input v-model.number="innerH" placeholder="H" size="small" @change="onCustomChange">
            <template slot="prepend">H</template>
          </el-input>
        </div>
        <div v-if="errorMsg" class="error-tip">{{ errorMsg }}</div>
      </div>
    </div>

    <el-button slot="reference" size="small" plain class="btn-chip">
      <span class="chip-resolution">{{ innerResolution }}</span>
      <span class="chip-divider">·</span>
      <span class="chip-ratio">{{ ratioDisplay }}</span>
    </el-button>
  </el-popover>
</template>

<script>
import { RESOLUTIONS, RATIOS, SIZE_MAP, parseSize, validatePixel } from '../constants/sizeMap'

export default {
  name: 'SizePopover',
  props: {
    resolution: { type: String, default: '2K' },
    ratio: { type: String, default: '1:1' },
    customW: { type: [Number, String], default: 0 },
    customH: { type: [Number, String], default: 0 }
  },
  data() {
    const res = this.resolution || '2K'
    const ratio = this.ratio || '1:1'
    let w = Number(this.customW) || 0
    let h = Number(this.customH) || 0
    if (!w || !h) {
      const fallback = SIZE_MAP[res] && SIZE_MAP[res][ratio]
      if (fallback) {
        const p = parseSize(fallback)
        w = p.w
        h = p.h
      }
    }
    return {
      resolutions: RESOLUTIONS,
      ratios: RATIOS.filter((r) => r.value !== 'auto'),
      innerResolution: res,
      innerRatio: ratio,
      innerW: w,
      innerH: h,
      lockOn: true,
      errorMsg: ''
    }
  },
  computed: {
    ratioDisplay() {
      if (this.innerW && this.innerH) {
        return `${this.innerW}x${this.innerH}`
      }
      return this.innerRatio
    }
  },
  watch: {
    resolution(v) {
      this.innerResolution = v
    },
    ratio(v) {
      this.innerRatio = v
    },
    customW(v) {
      this.innerW = Number(v) || 0
    },
    customH(v) {
      this.innerH = Number(v) || 0
    }
  },
  methods: {
    onRatioClick(v) {
      this.innerRatio = v
      const sizeStr = SIZE_MAP[this.innerResolution] && SIZE_MAP[this.innerResolution][v]
      if (sizeStr) {
        const { w, h } = parseSize(sizeStr)
        this.innerW = w
        this.innerH = h
      }
      this.errorMsg = ''
      this.emitChange()
    },
    onChange() {
      const sizeStr =
        SIZE_MAP[this.innerResolution] && SIZE_MAP[this.innerResolution][this.innerRatio]
      if (sizeStr) {
        const { w, h } = parseSize(sizeStr)
        this.innerW = w
        this.innerH = h
      }
      this.errorMsg = ''
      this.emitChange()
    },
    onCustomChange() {
      this.errorMsg = validatePixel(this.innerW, this.innerH)
      if (!this.errorMsg) {
        this.emitChange()
      }
    },
    emitChange() {
      this.$emit('change', {
        resolution: this.innerResolution,
        ratio: this.innerRatio,
        customW: this.innerW,
        customH: this.innerH
      })
    }
  }
}
</script>

<style scoped>
.size-popover-content {
  padding: 4px;
}
.section {
  margin-bottom: 16px;
}
.section-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}
.ratio-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
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
.ratio-icon {
  width: 22px;
  height: 22px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  margin-bottom: 4px;
}
.r-1-1 {
  width: 18px;
  height: 18px;
}
.r-3-4 {
  width: 14px;
  height: 18px;
}
.r-4-3 {
  width: 18px;
  height: 14px;
}
.r-16-9 {
  width: 22px;
  height: 12px;
}
.r-9-16 {
  width: 12px;
  height: 22px;
}
.r-3-2 {
  width: 21px;
  height: 14px;
}
.r-2-3 {
  width: 14px;
  height: 21px;
}
.r-21-9 {
  width: 24px;
  height: 10px;
}
.ratio-label {
  font-size: 11px;
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
  cursor: pointer;
}
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
.btn-chip {
  font-weight: 400;
}
.chip-divider {
  margin: 0 4px;
  color: #c0c4cc;
}
</style>
