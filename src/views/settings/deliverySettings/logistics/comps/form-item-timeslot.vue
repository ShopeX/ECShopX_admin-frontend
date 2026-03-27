<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
    <div class="tip">{{ $t('c89bb72c.7ab9fa') }}</div>
    <div class="time-slots">
      <div v-for="(item, index) in data" :key="`solt-item__${index}`">
        <el-time-select
          v-model="item[0]"
          :placeholder="$t('c89bb72c.26dac3')"
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
          :placeholder="$t('c89bb72c.f78277')"
          :class="keyClass(`time-${index}_end`)"
          :picker-options="{
            start: '00:00',
            step: '00:01',
            end: '23:59'
          }"
        />

        <el-button v-if="index > 0" class="btn-delete" type="text" @click="deleteTimeSlot(index)">
          {{ $t('c89bb72c.2f4aad') }}
        </el-button>
      </div>
    </div>
    <div>
      <el-button class="btn-add" type="text" @click="addTimeSlot()">
{{
        $t('c89bb72c.96fd7a')
      }}
</el-button>
    </div>
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
        throw new Error(this.$t('c89bb72c.c2ddf7'))
      }
    }
  }
}
</script>
