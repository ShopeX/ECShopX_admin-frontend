<style lang="scss">
.sp-image {
  display: block;
  object-fit: contain;
}
</style>

<script>
import dImage from '@/assets/imgs/default.jpg'
export default {
  name: 'SpImage',
  props: {
    src: String,
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    }
  },
  render () {
    const { src, width, height } = this
    return (
      <img
        class='sp-image'
        src={src || dImage}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    )
  }
}
</script>
