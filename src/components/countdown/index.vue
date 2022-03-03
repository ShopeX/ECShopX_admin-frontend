<template>
  <div>
    <slot
      :day="day"
      :hour="hour"
      :min="min"
      :sec="sec"
      :content="content"
    >
      <div v-if="!content">
        <span v-if="day > 0">{{ day }}天</span><span v-if="hour > 0">{{ hour }}时</span><span v-if="min > 0">{{ min }}分</span><span v-if="sec > 0">{{ sec }}秒</span>
      </div>
      <div v-else>
        {{ content }}
      </div>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    endTime: {
      type: Number,
      default: 0
    },
    endText: {
      type: String,
      default: ''
    },
    callback: {
      type: Function,
      default: ''
    }
  },
  data () {
    return {
      content: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
      timer: '',
      time: ''
    }
  },
  watch: {
    endTime (val) {
      this.setData(val)
    }
  },
  mounted () {
    this.setData(this.endTime)
  },
  methods: {
    setData (val) {
      this.time = val
      this.countdowm(this.time)
    },
    countdowm (timestamp) {
      let self = this
      clearInterval(self.timer)
      self.content = ''
      this.timer = setInterval(function () {
        let endTime = new Date(timestamp * 1000)
        let nowTime = new Date()
        let t = endTime.getTime() - nowTime.getTime()
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          self.day = day
          self.hour = hour
          self.min = min
          self.sec = sec
        } else {
          clearInterval(self.timer)
          self.content = self.endText
          self._callback()
        }
      }, 1000)
    },
    _callback () {
      if (this.callback && this.callback instanceof Function) {
        this.callback(...this)
      }
    }
  }
}
</script>
