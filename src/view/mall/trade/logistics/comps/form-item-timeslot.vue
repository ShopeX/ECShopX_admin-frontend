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
<style lang="scss">
.fi-item-timeslots {
  .tip {
    font-size: 13px;
    color: #999;
  }
  .el-date-editor {
    width: 120px;
  }
  .separator {
    margin: 0 10px;
  }
  .btn-add {
    margin-left: 10px;
  }
  .btn-delete {
    margin-left: 10px;
  }
}
.area-no {
  margin-right: 10px;
}
</style>
<template>
  <div class="fi-item-timeslots">
    <div class="tip">买家下单时从下方时间段内选择自提时间</div>
    <div class="time-slots">
      <div v-for="(item, index) in data" :key="`solt-item__${index}`">
        <el-time-select
          v-model="item[0]"
          placeholder="起始时间"
          :class="keyClass(`time-${index}_start`)"
          :picker-options="{
            start: '00:00',
            step: '00:01',
            end: '23:59'
          }"
        />
        <span class="separator">~</span>
        <el-time-select
          v-model="item[1]"
          placeholder="结束时间"
          :class="keyClass(`time-${index}_end`)"
          :picker-options="{
            start: '00:00',
            step: '00:01',
            end: '23:59'
          }"
        />

        <el-button v-if="index > 0" class="btn-delete" type="text" @click="deleteTimeSlot(index)">
          删除
        </el-button>
      </div>
    </div>
    <div><el-button class="btn-add" type="text" @click="addTimeSlot()">添加时间段</el-button></div>
  </div>
</template>

<script>
export default {
  name: 'FormItemTimeSlot',
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      data: [],
      isErrorKey: ''
    }
  },
  watch: {
    value(val) {
      this.data = val
    }
  },
  created() {
    this.data = this.value
  },
  methods: {
    addTimeSlot(index) {
      // this.data.splice(index + 1, 0, [null, null])
      this.data.push([null, null])
    },
    deleteTimeSlot(index) {
      this.data.splice(index, 1)
    },
    resetField() {
      this.data.forEach((item, index) => {
        this.$set(this.data, index, [null, null])
      })
    },
    keyClass(key) {
      return [
        key,
        'form-sub-item',
        {
          'is-error': this.isErrorKey == key
        }
      ]
    },
    validator() {
      try {
        this.data.forEach((item, index) => {
          const [timeStart, endStart] = item
          if (!timeStart) {
            this.isErrorKey = `time-${index}_start`
            throw new Error()
          }
          if (!endStart) {
            this.isErrorKey = `time-${index}_end`
            throw new Error()
          }
          // if()
        })
      } catch (e) {
        throw new Error('自提时间段不能为空')
      }
    }
  }
}
</script>
