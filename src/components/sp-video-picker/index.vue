<style lang="scss">
.sp-video-picker {
  display: flex;
  &.small {
    .image-item {
      width: 64px;
      height: 64px;
    }
    .placeholder {
      height: 64px;
    }
  }
  .image-item {
    width: 142px;
    height: 80px;
    border: 1px solid #d9d9d9;
    margin: 0 10px 10px 0;
    position: relative;
  }
  .add-video {
    width: 80px;
  }
  .placeholder {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icon-video {
    font-size: 24px;
    color: #d9d9d9;
    line-height: initial;
    // margin-top: 12px;
  }
  .add-text {
    font-size: 12px;
    color: #999;
    line-height: initial;
  }
  .img-content {
    // position: relative;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
    // max-width: 100%;
    // max-height: 100%;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  &:hover {
    .image-meta {
      display: block;
    }
  }
  .image-meta {
    height: 20px;
    width: 100%;
    line-height: 20px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
    // display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 12px;
    cursor: default;
  }
  .icon-times-circle1 {
    position: absolute;
    right: -7px;
    z-index: 99;
    top: -17px;
    font-size: 18px;
    color: #666;
  }

  .picker-video-player {
    .vjs-big-play-button {
      display: none;
    }
  }
}
</style>
<script>
import Vue from 'vue'
import { isArray, isEmpty, isString, isObject } from '@/utils'
export default {
  name: 'SpVideoPicker',
  props: {
    value: {
      type: [Object, Array, String]
    },
    max: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'string' // string | object 只针对value为数组时有效
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  watch: {
    value: {
      handler(nVal) {
        this.localValue = nVal
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 图片添加
    async handleSelectImage() {
      const { data } = await this.$picker.video({
        multiple: this.max > 1,
        num: this.max > 1 ? this.max - this.localValue.length : 1
      })
      if (isString(this.localValue)) {
        this.updateValue(data.url)
      } else if (isObject(this.localValue)) {
        this.updateValue(data)
      } else if (isArray(this.localValue)) {
        if (this.type == 'string') {
          const res = data.map(({ url }) => url)
          this.updateValue(this.localValue.concat(res))
        } else {
          this.updateValue(this.localValue.concat(data))
        }
      }
    },

    async onUpdateImage(index) {
      let val
      if (isArray(this.localValue)) {
        val = this.localValue[index]
      } else if (isObject(this.localValue)) {
        val = this.localValue.url
      } else {
        val = this.localValue
      }
      const { data } = await this.$picker.video({
        data: val
      })
      if (isArray(this.localValue)) {
        if (this.type == 'string') {
          Vue.set(this.localValue, index, data.url)
        } else {
          Vue.set(this.localValue, index, data)
        }
      } else if (isObject(this.localValue)) {
        this.localValue = data
      } else {
        this.localValue = data.url
      }
      this.updateValue(this.localValue)
    },

    updateValue(val) {
      this.$emit('input', val)
      this.$emit('onChange', val)
    },

    handleDeleteItem(index) {
      let tempValue = JSON.parse(JSON.stringify(this.localValue))
      if (isArray(tempValue)) {
        tempValue.splice(index, 1)
      } else {
        tempValue = isString(tempValue) ? '' : {}
      }
      this.updateValue(tempValue)
    },

    getOptions(src) {
      return {
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            type: 'video/mp4',
            src
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: false
      }
    },

    _renderImage(item, index = 0) {
      return (
        <div class='image-item' key={`image-item__${index}`}>
          <i
            class='iconfont icon-times-circle1'
            on-click={this.handleDeleteItem.bind(this, index)}
          />
          <video-player class='picker-video-player' options={this.getOptions(item?.url || item)} />
          <span class='image-meta' on-click={this.onUpdateImage.bind(this, index)}>
            更换视频
          </span>
        </div>
      )
    }
  },
  render() {
    const { value, max, size } = this
    const multiple = isArray(value)
    console.log('value:', value)
    return (
      <div class={['sp-video-picker', size]}>
        {max > 1 && value.map((item, index) => this._renderImage(item, index))}
        {max > 1 && value.length < max && (
          <div class='image-item add-video placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-video' />
            <div class='add-text'>视频({`${value.length}/${max}`})</div>
          </div>
        )}

        {max == 1 && !isEmpty(value) && this._renderImage(value)}
        {max == 1 && isEmpty(value) && (
          <div class='image-item add-video placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-video' />
            <div class='add-text'>添加视频</div>
          </div>
        )}
      </div>
    )
  }
}
</script>
