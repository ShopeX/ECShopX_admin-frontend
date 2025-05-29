<template>
  <div
    class="lucky-wheel-container"
    :style="{
      backgroundImage: config.background ? `url(${config.background})` : '',
      backgroundColor: config.backgroundColor
    }"
  >
    <LuckyWheel
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    />

    <div class="lucky-wheel-buttons">
      <div class="lucky-wheel-button" :style="ruleBtnStyle">
        <div class="lucky-wheel-button-text">
          {{ ruleBtn }}
        </div>
      </div>
      <div class="lucky-wheel-button" :style="recordBtnStyle">
        <div class="lucky-wheel-button-text">
          {{ recordBtn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return {
      blocks: [{ padding: '13px', background: '#617df2' }],
      prizes: [
        { fonts: [{ text: '0', top: '10%' }], background: '#e9e8fe' },
        { fonts: [{ text: '1', top: '10%' }], background: '#b8c5f2' },
        { fonts: [{ text: '2', top: '10%' }], background: '#e9e8fe' },
        { fonts: [{ text: '3', top: '10%' }], background: '#b8c5f2' },
        { fonts: [{ text: '4', top: '10%' }], background: '#e9e8fe' },
        { fonts: [{ text: '5', top: '10%' }], background: '#b8c5f2' }
      ],
      buttons: [
        {
          radius: '35%',
          background: '#8a9bf3',
          pointer: true,
          fonts: [{ text: '开始', top: '-10px' }]
        }
      ],
      ruleBtn: '活动规则',
      recordBtn: '抽奖记录',
      ruleBtnStyle: {},
      recordBtnStyle: {}
    }
  },
  watch: {
    config: {
      handler(newVal) {
        const { prizeData, hotArea, ruleBtnStyle, recordBtnStyle } = newVal || {}
        this.prizes = prizeData.map((item) => {
          const _data = {
            fonts: [{ text: item.text || '', top: '10%' }],
            background: item.background,
            range: item.prize_probability
          }
          if (item?.img) {
            _data.imgs = [{ src: item?.img }]
          }
          return _data
        })
        if (hotArea?.backImg) {
          this.blocks = [
            {
              padding: hotArea.padding,
              imgs: [{ src: hotArea?.backImg }]
            }
          ]
        }
        if (hotArea?.img || hotArea?.background) {
          this.buttons = [
            {
              background: hotArea?.background,
              imgs: [{ src: hotArea?.img }],
              radius: '35%',
              pointer: true,
              fonts: [{ text: '开始', top: '-10px' }]
            }
          ]
        }
        ruleBtnStyle &&
          (this.ruleBtnStyle = {
            backgroundColor: ruleBtnStyle?.rule[0],
            color: ruleBtnStyle?.rule[1],
            backgroundImage: ruleBtnStyle?.img ? `url(${ruleBtnStyle?.img})` : ''
          })
        recordBtnStyle &&
          (this.recordBtnStyle = {
            backgroundColor: recordBtnStyle?.rule[0],
            color: recordBtnStyle?.rule[1],
            backgroundImage: recordBtnStyle?.img ? `url(${recordBtnStyle?.img})` : ''
          })
      },
      deep: true
    }
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback() {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = 0
        // 调用stop停止旋转并传递中奖索引
        this.$refs.myLucky.stop(index)
      }, 3000)
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize)
    }
  }
}
</script>

<style scoped>
.lucky-wheel-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  background-repeat: no-repeat;
  padding-top: 100px;
}

.lucky-wheel-buttons {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
}

.lucky-wheel-button {
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lucky-wheel-button-text {
  font-size: 16px;
}

.lucky-wheel-button-text:hover {
  cursor: pointer;
}

.lucky-wheel-button-text:active {
  background: #6a7df2;
}
</style>
