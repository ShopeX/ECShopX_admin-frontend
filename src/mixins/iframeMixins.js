export default {
  data() {
    return {
      iframeTimeOut: null
    }
  },
  methods: {
    createInterval(_this, func) {
      let IS_NOT_IFRAME = sessionStorage.getItem('IS_NOT_IFRAME')
      setTimeout(
        () => {
          func.bind(_this)()
        },
        IS_NOT_IFRAME ? 0 : 3000
      )
    }
  }
}
