<style lang="scss">
.sp-image-picker {
  // width: 80px;
  // height: 80px;
  // border: 1px solid #d9d9d9;
  // position: relative;
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
    // margin-top: 12px;
  }
  .add-text {
    font-size: 12px;
    color: #999;
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
import { isArray, isEmpty, isString } from '@/utils'
export default {
  name: 'SpImagePicker',
  // props: ['info', 'value'],
  props: {
    value: {
      type: [Object, Array, String]
    },
    max: {
      type: Number,
      default: 3
    },
    size: {
      type: String,
      default: 'normal'
    }
    // multiple: {
    //   type: Boolean,
    //   default: false
    // }
  },
  created() {},
  methods: {
    async handleSelectImage() {
      console.log('handleSelectImage:', this.max, this.value)
      const { data } = await this.$picker.image({
        data: this.value,
        multiple: isArray(this.value),
        max: this.max
      })
      if (isString(this.value)) {
        this.$emit('input', data.url)
        this.$emit('onChange', data.url)
      } else {
        this.$emit('input', data)
        this.$emit('onChange', data)
      }
    },
    handleDeleteItem(index) {
      const { value, max } = this
      const multiple = isArray(value)
      let data
      if (multiple) {
        data = value.splice(index, 1)
      } else {
        data = isString(this.value) ? '' : {}
      }
      this.$emit('input', data)
      this.$emit('onChange', data)
    },
    _renderImage(item, index = 0) {
      return (
        <div class='image-item' key={`image-item__${index}`}>
          <i
            class='iconfont icon-times-circle1'
            on-click={this.handleDeleteItem.bind(this, index)}
          />
          <el-image class='img-content' src={item?.url || item} fit='cover' />
          <span class='image-meta' on-click={this.handleSelectImage}>
            更换图片
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
      <div class={['sp-image-picker', size]}>
        {multiple && value.map((item, index) => this._renderImage(item, index))}

        {multiple && value.length == 0 && (
          <div class='image-item placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-camera' />
            <div class='add-text'>添加图片({`${value.length}/${max}`})</div>
          </div>
        )}

        {!multiple && !isEmpty(value) && this._renderImage(value)}
        {!multiple && isEmpty(value) && (
          <div class='image-item placeholder' on-click={this.handleSelectImage}>
            <i class='iconfont icon-camera' />
            <div class='add-text'>添加图片</div>
          </div>
        )}

        {/* <div class='placeholder' on-click={this.handleSelectImage}>
          <i class='iconfont icon-camera' />
          <div class='add-text'>添加图片</div>
        </div> */}
      </div>
    )
  }
}
</script>
