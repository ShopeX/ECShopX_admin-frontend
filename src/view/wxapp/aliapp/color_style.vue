<style scoped lang="scss">
.color-style-warp {
  padding-top: 60px;
  .form-header {
    display: flex;
    align-items: center;
    position: fixed;
    left: 250px;
    top: 50px;
    right: 0;
    padding: 0 20px;
    height: 80px;
    background: #fff;
    border-bottom: 1px solid #efefef;
    z-index: 20;
    .el-form-item {
      height: 40px;
      margin-bottom: 0;
    }
    .btn-save {
      margin-left: 50px;
    }
  }
  .pages-view-warp {
    display: flex;
    justify-content: center;
    padding: 10px 0 30px 0;
    .pages-view {
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
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
  <transition name="el-fade-in-linear" mode="out-in">
    <div>
      <section class="color-style-warp" :style="'height: ' + (wheight - 160) + 'px;'">
        <div class="form-header">
          <el-form class="view-flex-item" :inline="true" label-width="80px">
            <el-form-item label="主色调">
              <el-color-picker v-model="form.data[0].primary" />
            </el-form-item>
            <el-form-item label="辅色调">
              <el-color-picker v-model="form.data[0].accent" />
            </el-form-item>
            <el-form-item label="会员色">
              <el-color-picker v-model="form.data[0].marketing" />
            </el-form-item>
          </el-form>
          <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
        </div>
        <div class="pages-view-warp">
          <div
            class="pages-view"
            :style="'width: ' + Math.floor((wwidth - 250) / 268) * 268 + 'px'"
          >
            <div
              v-for="(item, index) in pages"
              class="page-view-item"
              :style="
                item.type === 'primary'
                  ? 'background:' + form.data[0].primary
                  : 'background:' + form.data[0].marketing
              "
            >
              <img :src="item.img">
              <div
                v-if="index == 5"
                class="ab-view"
                style="bottom: 0; left: 82px; width: 84px; height: 33px"
                :style="'background:' + form.data[0].accent"
              />
              <div
                v-if="index == 8"
                class="ab-view"
                style="
                  top: 91.5px;
                  left: 50%;
                  transform: translateX(-50%);
                  border-radius: 15px;
                  width: 36px;
                  height: 15px;
                "
                :style="'background:' + form.data[0].primary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
const page01 = require('@/assets/img/page_01.png')
const page02 = require('@/assets/img/page_02.png')
const page03 = require('@/assets/img/page_03.png')
const page04 = require('@/assets/img/page_04.png')
const page05 = require('@/assets/img/page_05.png')
const page06 = require('@/assets/img/page_06.png')
const page07 = require('@/assets/img/page_07.png')
const page08 = require('@/assets/img/page_08.png')
const page09 = require('@/assets/img/page_09.png')
const page10 = require('@/assets/img/page_10.png')
const page11 = require('@/assets/img/page_11.png')
const page12 = require('@/assets/img/page_12.png')
const page13 = require('@/assets/img/page_13.png')
const page14 = require('@/assets/img/page_14.png')
const page15 = require('@/assets/img/page_15.png')
const page16 = require('@/assets/img/page_16.png')
const page17 = require('@/assets/img/page_17.png')
const page18 = require('@/assets/img/page_18.png')
const page19 = require('@/assets/img/page_19.png')
const page20 = require('@/assets/img/page_20.png')
const page21 = require('@/assets/img/page_21.png')
const page22 = require('@/assets/img/page_22.png')
const page23 = require('@/assets/img/page_23.png')
const page24 = require('@/assets/img/page_24.png')
const page25 = require('@/assets/img/page_25.png')
const page26 = require('@/assets/img/page_26.png')
const page27 = require('@/assets/img/page_27.png')
const page28 = require('@/assets/img/page_28.png')

import api from '@/api'
import { mapGetters } from 'vuex'
// api
import { saveALiPageParams, getALiParamByTempName } from '@/api/ali'
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
          img: page01
        },
        {
          type: 'primary',
          img: page02
        },
        {
          type: 'primary',
          img: page03
        },
        {
          type: 'marketing',
          img: page04
        },
        {
          type: 'primary',
          img: page05
        },
        {
          type: 'primary',
          img: page07
        },
        {
          type: 'primary',
          img: page08
        },
        {
          type: 'primary',
          img: page09
        },
        {
          type: 'marketing',
          img: page10
        },
        {
          type: 'primary',
          img: page11
        },
        {
          type: 'primary',
          img: page12
        },
        {
          type: 'primary',
          img: page13
        },
        {
          type: 'primary',
          img: page14
        },
        {
          type: 'primary',
          img: page15
        },
        {
          type: 'primary',
          img: page16
        },
        {
          type: 'primary',
          img: page17
        },
        {
          type: 'primary',
          img: page18
        },
        {
          type: 'marketing',
          img: page19
        },
        {
          type: 'primary',
          img: page20
        },
        {
          type: 'marketing',
          img: page21
        },
        {
          type: 'primary',
          img: page22
        },
        {
          type: 'primary',
          img: page23
        },
        {
          type: 'marketing',
          img: page24
        },
        {
          type: 'primary',
          img: page25
        },
        {
          type: 'marketing',
          img: page26
        },
        {
          type: 'primary',
          img: page27
        },
        {
          type: 'primary',
          img: page28
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight', 'wwidth', 'ali_template_name'])
  },
  mounted() {
    let filter = {
      template_name: this.ali_template_name,
      version: 'v1.0.1',
      page_name: 'color_style'
    }
    getALiParamByTempName(filter).then(res => {
      if (res.data.data.list.length !== 0) {
        this.form = res.data.data.list[0].params
      }
    })
  },
  methods: {
    // 保存设置
    saveConfig() {
      let param = {
        template_name: this.ali_template_name,
        config: JSON.stringify([this.form]),
        page_name: 'color_style'
      }
      saveALiPageParams(param).then(res => {
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
