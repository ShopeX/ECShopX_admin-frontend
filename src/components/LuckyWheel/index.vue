<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div
    class="lucky-wheel-container"
    :style="{
      backgroundImage: config.background ? `url(${config.background})` : '',
      backgroundColor: config.backgroundColor
    }"
  >
    <div class="lucky-wheel-container-inner">
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
    </div>

    <div class="lucky-wheel-buttons">
      <div class="lucky-wheel-button" :style="recordBtnStyle">
        <div class="lucky-wheel-button-text">
          {{ recordBtn }}
        </div>
      </div>
    </div>

    <div class="lucky-wheel-rule-btn" :style="ruleBtnStyle">
      <div class="lucky-wheel-rule-btn-text">
        {{ ruleBtn }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      blocks: [],
      prizes: [
        { fonts: [{ text: '0', top: '30%' }], background: '#e9e8fe' },
        { fonts: [{ text: '1', top: '30%' }], background: '#b8c5f2' },
        { fonts: [{ text: '2', top: '30%' }], background: '#e9e8fe' },
        { fonts: [{ text: '3', top: '30%' }], background: '#b8c5f2' },
        { fonts: [{ text: '4', top: '30%' }], background: '#e9e8fe' },
        { fonts: [{ text: '5', top: '30%' }], background: '#b8c5f2' }
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
        this.prizes = prizeData.map(item => {
          const _data = {
            fonts: [{ text: item.text || '', top: '30%' }],
            background: item?.background,
            range: item.prize_probability
          }
          if (item?.img) {
            _data.imgs = [{ src: item?.img, width: '50px', height: '50px', top: '60%' }]
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
  background-repeat: no-repeat;
  padding-top: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.lucky-wheel-container-inner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lucky-wheel-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
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
.lucky-wheel-rule-btn {
  padding-left: 20px;
}
</style>
