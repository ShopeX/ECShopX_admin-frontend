export default {
  data () {
    return {
      remarksType: ''
    }
  },
  methods: {
    clickShowRemark (row, type) {
      this.$refs.modalRef.showRemark(row, type)
      this.remarksType = type
    },
    handleRemarksDone () {
      if (this.remarksType === 'normalList') {
        this.$emit('refreshList')
      } else if (this.remarksType === 'normalList2') {
        this.getOrders(this.params)
      } else if (this.remarksType === 'afterList') {
        this.getAftersalesList(this.params)
      } else if (this.remarksType === 'orderDetail') {
        this.$emit('onRefresh')
      } else if (this.remarksType === 'afterDetail') {
        this.aftersaleInfo()
      }
    }
  }
}
