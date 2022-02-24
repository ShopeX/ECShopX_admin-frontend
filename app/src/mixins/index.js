import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export { default as pageMixin } from './pageMixin'
export default {
  methods: {
    onCopySuccess() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    }
  }
}
