<template>
  <el-card class="mycard">
    <div slot="header">
      {{ title }}
      <el-popover v-if="subTitle" placement="top-start" width="400" trigger="hover">
        <i slot="reference" class="el-icon-question" />
        <pre slot="" style="white-space: pre-line">
          {{ subTitle }}
        </pre>
      </el-popover>
    </div>
    <div>
      <el-row>
        <el-col v-for="item in list" :key="item.name" :span="12">
          <el-row>
            <el-col :span="11" style="text-align: right; padding-right: 6px">
              {{ addSymbol(item.name) }}
            </el-col>
            <el-col :span="13">
              {{ item.filter ? item.filter(info[item.field]) || '-' : info[item.field] || '-' }}
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div v-if="title === '分账信息'" class="btn">
      <el-button type="info" disabled> 已审批 </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  // props: ['info', 'title', 'subTitle', 'list'],
  methods: {
    addSymbol: function (symbol) {
      if (symbol.indexOf('：') > -1) {
        return symbol
      }
      return `${symbol}：`
    }
  }
}
</script>

<style lang="scss" scoped>
.mycard {
  border: none;
}
.el-card {
  &__header {
    font-weight: bold;
    padding: 10px 20px !important;
  }
}
.btn {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
