<style lang="scss"></style>

<script>
import dImage from '@/assets/imgs/default.jpg'
export default {
  name: 'SpImage',
  props: {
    src: String
  },
  render () {
    return <img src={this.src || dImage} width='100%' />
  }
}
</script>
