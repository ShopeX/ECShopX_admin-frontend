<script>
export default {
  name: 'WgtSliderAttr',
  props: ['value'],
  provide() {
    return {
      scope: this
    }
  },
  methods: {
    async handleClickAdd() {
      const { data } = await this.$picker.image({
        data: [],
        multiple: true
      })
      this.value.data = data
      console.log(this.value.data)
    },
    onChangeSliderItem(index, val) {
      this.$set(this.value.data, index, val)
    }
  },
  render() {
    const { value } = this
    return (
      <div class='wgt-slider-attr'>
        {value.base.map((item) => (
          <CompCell info={item} v-model={item.value} />
        ))}
        {value.config.map((item) => (
          <CompCell info={item} v-model={item.value} />
        ))}
        <div class='slider-items'>
          {value.data.map((item, index) => (
            <div class='slider-item'>
              <SpImagePicker value={item} on-onChange={this.onChangeSliderItem.bind(this, index)} />
              <CompPickerLink />
            </div>
          ))}
          <el-button class='btn btn-add' plain on-click={this.handleClickAdd.bind(this)}>
            添加图片(0/5)
          </el-button>
        </div>
      </div>
    )
  }
}
</script>

<style lang="scss">
.wgt-slider-attr {
  .slider-items {
    padding: 10px;
    background-color: #f5f5f5;
  }
  .btn-add {
    width: 100%;
  }
  .slider-item {
    display: flex;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    .sp-image-picker {
      margin-right: 10px;
    }
    .comp-picker-link {
      flex: 1;
    }
  }
}
</style>
