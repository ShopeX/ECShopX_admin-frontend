<template>
  <Result-cpn :current-status="currentStatus" />
</template>

<script>
import ResultCpn from './cpn/result.vue'
export default {
  components: {
    ResultCpn
  },
  data() {
    return {
      currentStatus: {
        resultStatus: 'netin',
        time: '',
        info: ''
      }
    }
  }
}
</script>
