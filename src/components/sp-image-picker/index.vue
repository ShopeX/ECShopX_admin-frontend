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
  .image-list-wrap {
    @include clearfix();
  }
  .image-item {
    width: 80px;
    height: 80px;
    border: 1px solid #d9d9d9;
    margin-right: 10px;
    position: relative;
    float: left;
    &.drag {
      &:hover {
        .icon-tuozhuai {
          display: block;
        }
      }
    }
  }
  &.multiple {
    .image-item {
      margin-bottom: 10px;
    }
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
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 12px;
    cursor: default;
  }
  .icon-tuozhuai {
    background: rgba(0, 0, 0, 0.7);
    display: none;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
  .icon-qingchuFilled {
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
import draggable from 'vuedraggable'
export default {
  name: 'SpImagePicker',
  components: { draggable },
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
    },
    drag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      }
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
      const { data } = await this.$picker.image({
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
      const { data } = await this.$picker.image({
        data: val
      })
      if (isArray(this.localValue)) {
        if (this.type == 'string') {
          Vue.set(this.localValue, index, data.url || val)
        } else {
          Vue.set(this.localValue, index, data)
        }
      } else if (isObject(this.localValue)) {
        this.localValue = data
      } else {
        this.localValue = data.url || val
      }
      this.updateValue(this.localValue)
    },

    updateValue(val) {
      console.log('updateValue========', val)
      this.$emit('input', val)
      this.$emit('onChange', val)
    },

    handleDeleteItem(index) {
      if (isArray(this.localValue)) {
        this.localValue.splice(index, 1)
      } else {
        this.localValue = isString(this.localValue) ? '' : {}
      }
      this.updateValue(this.localValue)
    },

    _renderImage(item, index = 0) {
      return (
        <div class={['image-item', { 'drag': this.drag }]} key={`image-item__${index}`}>
          <i class='ecx-icon icon-tuozhuai' />
          <i
            class='ecx-icon icon-qingchuFilled'
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
    return (
      <div
        class={[
          'sp-image-picker',
          size,
          {
            'multiple': max > 1
          }
        ]}
      >
        {max > 1 && (
          <draggable
            class='list-container'
            list={value}
            disabled={!this.drag}
            options={this.dragOptions}
            handle='.icon-tuozhuai'
          >
            {value.map((item, index) => this._renderImage(item, index))}
          </draggable>
        )}
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
