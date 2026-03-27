/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export { default as pageMixin } from './pageMixin'
export { default as remarkMixin } from './remarkMixin'
export default {
  methods: {
    onCopySuccess() {
      this.$notify.success({
        message: this.$t('3afa242c.20a495'),
        showClose: true
      })
    }
  }
}
