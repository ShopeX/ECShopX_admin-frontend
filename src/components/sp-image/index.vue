<style lang="scss">
.sp-image {
  display: flex;
  align-items: center;
}
</style>

<script>
import dImage from '@/assets/imgs/default.jpg'
import { isNumber, isString, isBoolean } from '@/utils'
export default {
  name: 'SpImage',
  props: {
    src: String,
    width: Number,
    height: Number,
    circle: [Boolean, Number]
  },
  render() {
    const { src, width, height, circle } = this
    // console.log('sp-image render src:', src);
    let styleNames = {}
    if (width) {
      styleNames['width'] = `${width}px`
    }
    if (height) {
      styleNames['height'] = `${height}px`
    }
    if (circle) {
      if (isBoolean(circle)) {
        styleNames['border-radius'] = `${width / 2}px`
      } else {
        styleNames['border-radius'] = `${circle}px`
      }
    }

    return (
      <el-image class={'sp-image'} style={styleNames} src={src || dImage} fit='cover'>
        <template slot='error'>图片加载错误</template>
      </el-image>
    )
  }
}
</script>
