<script>
export default {
  name: 'WgtHotzoneAttr',
  props: ['value'],
  methods: {
    async handleClickAdd () {
      const { data } = await this.$picker.image({
        data: 100
        // multiple: true
      })
      debugger
    }
  },
  render () {
    const { value } = this
    return (
      <div class='wgt-hotzone-attr'>
        {value.base.map((item) => (
          <CompCell info={item} v-model={item.value} />
        ))}
        {value.config.map((item) => (
          <CompCell info={item} v-model={item.value} />
        ))}
        <div>
          <SpImagePicker />
        </div>

        <div class=''>
          <div>轮播项</div>
        </div>
      </div>
    )
  }
}
</script>
