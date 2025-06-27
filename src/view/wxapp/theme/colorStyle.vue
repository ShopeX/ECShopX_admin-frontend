<style scoped lang="scss">
.color-style-warp {
  .form-color {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item {
      margin: 0;
    }
  }
  .pages-view-warp {
    display: flex;
    padding: 10px 0 30px 0;
    .pages-view {
      display: flex;
      flex-wrap: wrap;
    }
    .page-view-item {
      position: relative;
      width: 100%;
      margin: 15px 8px 0 8px;
      width: 250px;
      border: 1px solid #efefef;
      z-index: 1;
      img {
        position: relative;
        display: block;
        width: 100%;
        height: auto;
        z-index: 10;
      }
      .ab-view {
        position: absolute;
        z-index: 5;
      }
    }
  }
}
</style>

<template>
  <SpPage>
    <div class="color-style-warp">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
      <div class="form-color">
        <el-form class="view-flex-item" :inline="true" label-width="80px">
          <el-form-item label="主色调">
            <el-color-picker v-model="form.data[0].primary" />
          </el-form-item>
          <el-form-item label="辅色调">
            <el-color-picker v-model="form.data[0].accent" />
          </el-form-item>
          <!-- <el-form-item label="会员色">
              <el-color-picker v-model="form.data[0].marketing" />
            </el-form-item> -->
        </el-form>
        <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
      </div>
      <div class="pages-view-warp">
        <div class="pages-view" :style="'width: ' + Math.floor((wwidth - 250) / 268) * 268 + 'px'">
          <div
            v-for="(item, index) in pages"
            :key="`page-view-item__${index}`"
            class="page-view-item"
            :style="
              item.type === 'primary'
                ? 'background:' + form.data[0].primary
                : 'background:' + form.data[0].marketing
            "
          >
            <img :src="item.img">
          </div>
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
const page07 = require('@/assets/img/page_07.png')
const page11 = require('@/assets/img/page_11.png')
const page15 = require('@/assets/img/page_15.png')

import api from '@/api'
import { mapGetters } from 'vuex'
import { isArray } from '@/utils'
// api
import { savePageParams, getParamByTempName } from '@/api/wxa'
export default {
  data() {
    return {
      listWidth: '820',
      form: {
        name: 'base',
        data: [
          {
            primary: '#d42f29',
            accent: '#fba629',
            marketing: '#2e3030'
          }
        ]
      },
      pages: [
        {
          type: 'primary',
          img: page07
        },
        {
          type: 'primary',
          img: page11
        },
        {
          type: 'primary',
          img: page15
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wwidth', 'template_name'])
  },
  mounted() {
    let filter = { template_name: this.template_name, version: 'v1.0.1', page_name: 'color_style' }
    getParamByTempName(filter).then(res => {
      if (res.data.data.list.length !== 0) {
        if (typeof res.data.data.list[0].params.data != 'undefined') {
          this.form.data = res.data.data.list[0].params.data
        }
      }
    })
  },
  methods: {
    // 保存设置
    saveConfig() {
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.form]),
        page_name: 'color_style'
      }
      savePageParams(param).then(res => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
