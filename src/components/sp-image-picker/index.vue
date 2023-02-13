<style lang="scss">
.sp-image-picker {
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
    width: 80px;
    height: 80px;
    border: 1px solid #d9d9d9;
    margin: 0 10px 10px 0;
    position: relative;
  }
  .placeholder {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icon-camera {
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
}
</style>
<script>
import Vue from 'vue'
import { isArray, isEmpty, isString, isObject } from '@/utils'
export default {
  name: 'SpImagePicker',
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
  created() {},
  methods: {
    // 图片添加
    async handleSelectImage() {
      console.log('handleSelectImage:', this.max, this.value)
      const { data } = await this.$picker.image({
        multiple: this.max > 1,
        num: this.max > 1 ? this.max - this.value.length : 1
      })
      if (isString(this.value)) {
        this.updateValue(data.url)
      } else if (isObject(this.value)) {
        this.updateValue(data)
      } else if (isArray(this.value)) {
        if (this.type == 'string') {
          const res = data.map(({ url }) => url)
          this.updateValue(this.value.concat(res))
        } else {
          this.updateValue(this.value.concat(data))
        }
      }
    },

    async onUpdateImage(index) {
      let val
      if (isArray(this.value)) {
        val = this.value[index]
      } else if (isObject(this.value)) {
        val = this.value.url
      } else {
        val = this.value
      }
      const { data } = await this.$picker.image({
        data: val
      })
      if (isArray(this.value)) {
        if (this.type == 'string') {
          Vue.set(this.value, index, data.url)
        } else {
          Vue.set(this.value, index, data)
        }
      } else if (isObject(this.value)) {
        this.value = data
      } else {
        this.value = data.url
      }
      this.updateValue(this.value)
    },

    updateValue(val) {
      this.$emit('input', val)
      this.$emit('onChange', val)
    },

    handleDeleteItem(index) {
      if (isArray(this.value)) {
        this.value.splice(index, 1)
      } else {
        this.value = isString(this.value) ? '' : {}
      }
      this.updateValue(this.value)
    },

    _renderImage(item, index = 0) {
      return (
        <div class='image-item' key={`image-item__${index}`}>
          <i
            class='iconfont icon-times-circle1'
            on-click={this.handleDeleteItem.bind(this, index)}
          />
          <el-image class='img-content' src={item?.url || item} fit='cover' />
          <span class='image-meta' on-click={this.onUpdateImage.bind(this, index)}>
            更换图片
          </span>
        </div>
      )
    }
  },
  render() {
    const { value, max, size } = this
    const multiple = isArray(value)
    return (
      <div class={['sp-image-picker', size]}>
        {max > 1 && value.map((item, index) => this._renderImage(item, index))}
        {max > 1 && value.length < max && (
          <div class='image-item placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-camera' />
            <div class='add-text'>图片({`${value.length}/${max}`})</div>
          </div>
        )}

        {max == 1 && !isEmpty(value) && this._renderImage(value)}
        {max == 1 && isEmpty(value) && (
          <div class='image-item placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-camera' />
            <div class='add-text'>添加图片</div>
          </div>
        )}
      </div>
    )
  }
}
</script>
