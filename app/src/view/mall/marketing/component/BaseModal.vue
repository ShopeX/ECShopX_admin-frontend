<template>
  <el-card class="mycard">
    <div slot="header">
      {{ title }}
    </div>
    <div class="body">
      <el-row>
        <el-col v-for="(col, colIndex) in labelList" :key="colIndex" :span="span" :offset='1'>
          <el-row class="cus-row-mb">
            <el-col :span="span === 20 ? 4 : 11" class="cus-row-flex">
              {{ addSymbol(col.name) }}
            </el-col>
            <el-col
              :span="1"
              v-for="(pic, index) in info[col.field]"
              :key="pic"
              :offset="index > 0 ? 1 : 0"
              v-if="col.list"
            >
              <img :src="wximageurl + pic" width="40" height="40" />
            </el-col>
            <el-col :span="20" class="word-warp" v-if="col.type">
              <img :src="col.type && info[col.field]" alt="">
            </el-col>
            <el-col :span="span === 20 ? 20 : 13" class="word-warp" v-else>
              {{
                col.filter
                  ? (col.filter(info[col.field]) || '-')
                  : (info[col.field] || '-')
              }}
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { dateFilter } from '@/utils';
export default {
  props: ['labelList', 'info', 'title', 'span'],
  methods: {
    addSymbol: function (symbol) {
      if (symbol.indexOf("：") > -1) {
        return symbol;
      }
      return `${symbol}：`;
    }
  }
}
</script>

<style lang="scss" scoped>
.word-warp {
  word-break: break-all;
}
.cus-row-flex {
  text-align: right;
}
.cus-row-mb {
  margin-bottom: 20px !important;
}
</style>