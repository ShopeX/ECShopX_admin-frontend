<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd">
      <div class="hd-lf">{{ localTitle }}</div>
      <div class="hd-rg">
        <el-button v-if="mode == 'page'" plain @click="onExit"> 后退 </el-button>
        <el-button v-if="mode == 'dialog'" plain @click="onClose"> 关闭 </el-button>
        <el-button plain @click="onSaveTemplate"> 保存 </el-button>
      </div>
    </div>
    <div class="decorate-bd">
      <div class="left-container">
        <draggable
          class="wgts-view"
          :chosen-class="'wgts-chosen'"
          :list="widgets"
          :group="{
            name: 'easyview',
            pull: 'clone',
            put: false
          }"
          :sort="false"
          :clone="cloneDefaultField"
        >
          <div
            v-for="(wgt, index) in widgets"
            :key="`wgt-item__${index}`"
            class="wgt-item"
            :data-name="wgt.name"
          >
            <!-- <i
              class="wgt-icon iconfont"
              :class="wgt.wgtIcon"
                      /> -->
            <div :class="['wgt-icon', wgt.wgtIcon]" />
            <div class="wgt-name">
              {{ wgt.wgtName }}
            </div>
            <div class="wgt-placeholder">
              <div class="placholder-txt">放置区域</div>
            </div>
          </div>
        </draggable>
      </div>
      <div class="center-container">
        <!-- {{ contentComps }} -->
        <!-- {{ headerData }} -->
        <div class="weapp-template">
          <Header v-if="headerVisible" :value="headerData" @change="handleClickHeader" />
          <div class="weapp-body" :style="weappBodyStyle">
            <draggable :list="contentComps" group="easyview" class="components-design-wrap">
              <div
                v-for="(wgt, index) in contentComps"
                :key="`wgt-render-item__${index}`"
                class="wgt-render-item"
                :class="{ active: activeCompIndex == index }"
                @click="handleClickWgtItem(index)"
              >
                <div class="wgt-tip">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-tools" :class="{ active: activeCompIndex == index }">
                  <!-- <i class="iconfont icon-arrow-alt-circle-up1" @click="onMoveUpComp(index)" />
                            <i class="iconfont icon-arrow-alt-circle-dow1" @click="onMoveDownComp(index)" /> -->
                  <i class="iconfont icon-copy1" @click="onCopyComp(index, wgt)" />
                  <i class="iconfont icon-trash-alt1" @click="onDeleteComp(index)" />
                </div>
                <component :is="wgt.name" :value="wgt" />
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div v-if="activeCompIndex !== null && contentComps[activeCompIndex] && hackReset">
          <div class="wgt-name">
            {{ getComponentAttr(contentComps[activeCompIndex]).wgtName }}
          </div>
          <attrPanel
            v-model="contentComps[activeCompIndex]"
            :class="`wgt-attr-${contentComps[activeCompIndex].name}`"
            :info="getComponentAttr(contentComps[activeCompIndex])"
          />
        </div>
        <div v-if="activeCompIndex == null && hackReset && headerAttr">
          <div class="wgt-name">{{ headerAttr.wgtName }}</div>
          <attrPanel v-model="headerData" :info="headerAttr" />
        </div>
      </div>
    </div>

    <el-backtop target=".center-container" :right="420" />
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import { SYSTEM_CONFIG } from '@/consts'
import store from '@/store'
import { hex2rgb } from '@/utils'
import gWgts from './wgts'
import attrPanel from './attr_panel'
import Header from './wgts/wgt-page'
export default {
  components: {
    draggable,
    attrPanel,
    Header
  },
  async beforeRouteLeave(to, from, next) {
    this.resetDecorateTheme()
    next()
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'page' // page || dialog
    },
    scene: {
      type: String,
      default: '1001'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localScene: '1001',
      localTitle: '',
      widgets: [],
      contentComps: [],
      activeComp: null,
      activeCompIndex: null,
      hackReset: true,
      headerData: null,
      headerAttr: null
    }
  },
  computed: {
    weappBodyStyle() {
      const { newPageBackgroundStyle } = this.headerData || {}
      return {
        'background-color': newPageBackgroundStyle?.color,
        'background-image': `url(${ newPageBackgroundStyle?.image})`,
        'background-size': 'cover',
        'background-position': 'center'
      }
    },
    headerVisible() {
      if (this.mode == 'page' && this.scene == '1001') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    const { mode } = this
    if (mode == 'page') {
      const { scene = '1001' } = this.$route.query
      this.localScene = scene

      const _title = {
        1001: '商城装修',
        1002: '商品详情',
        1003: '店铺装修',
        1004: '自定义页装修',
        1006: '分类模版装修',
        1008: '个人中心模版装修',
        1009: '导购模板装修',
      }
      this.localTitle = _title[scene]
    } else {
      this.localScene = this.scene
      this.localTitle = this.title
      this.contentComps = this.value
    }
    this.regsiterWgts()
    if (this.mode == 'page') {
      this.getTemplateDetial()
    }
  },
  mounted() {
    document.body.style.setProperty('--themeColor', '#155bd4')
    document.body.style.setProperty('--themeColorRgb', [21, 91, 212].join(','))
    const { primary } = this.$store.getters?.color_theme || {}
    document.body.style.setProperty('--appThemeColor', primary)
    document.body.style.setProperty('--appThemeColorRgb', hex2rgb(primary))
  },
  methods: {
    regsiterWgts() {
      // const { scene = '1001' } = this.$route.query
      const wgts = gWgts[this.localScene]
      Object.keys(wgts).forEach((index) => {
        this.widgets.push(wgts[index])
        Vue.component(wgts[index].name, wgts[index])
      })
    },
    resetDecorateTheme() {
      const { theme } = SYSTEM_CONFIG[store.getters.versionMode]
      const red = parseInt(theme.replace('#', '').slice(0, 2), 16)
      const green = parseInt(theme.replace('#', '').slice(2, 4), 16)
      const blue = parseInt(theme.replace('#', '').slice(4, 6), 16)
      document.body.style.setProperty('--themeColor', theme)
      document.body.style.setProperty('--themeColorRgb', [red, green, blue].join(','))
    },
    getComponentAttr(item) {
      const { wgtName, config } = this.widgets.find((wgt) => {
        return wgt.name.toLowerCase() == item.name.toLowerCase()
      })
      return {
        wgtName,
        ...config
      }
    },
    cloneDefaultField(e) {
      const { wgtName, wgtDesc, config } = e
      const { setting, name } = JSON.parse(JSON.stringify(config))
      const compData = {
        name,
        wgtName,
        wgtDesc
      }
      setting.forEach((item) => {
        compData[item.key] = item.value
      })
      // console.log('compData', compData)
      return compData
    },
    handleClickHeader() {
      this.activeCompIndex = null
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true // 重建组件
      })
    },
    handleClickWgtItem(index) {
      this.activeCompIndex = index
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true // 重建组件
      })
    },
    transform(wgt) {
      const { setting } = wgt.config
      return setting
    },
    async getTemplateDetial() {
      const { id } = this.$route.query
      let list = []
      try {
        if (this.localScene == '1004' || this.localScene == '1006' || this.localScene == '1008') {
          const resTemplate = await this.$api.wxa.getParamByTempName({
            template_name: 'yykweishop',
            page_name: `custom_${id}`,
            version: 'v1.0.1'
          })
          list = resTemplate?.list || []
        } else {
          const { template_content } = await this.$api.template.getPagesTemplateDetail({
            pages_template_id: id
          })
          list = template_content?.list || []
        }
      } catch (e) {
        console.error(e)
      }

      console.log('Header:', Header)
      // 页面设置初始数据
      const { setting, name } = Header.config
      let headerData = {
        name,
        wgtName: Header.wgtName,
        wgtDesc: Header.wgtDesc
      }
      setting.forEach((item) => {
        headerData[item.key] = item.value
      })
      const wgtHeader = list.find((item) => item.name == 'page')
      if (wgtHeader) {
        const headParams = Header.config.transformIn(wgtHeader.params)
        headerData = {
          // 初始数据
          ...headerData,
          ...headParams
        }
      }
      this.headerData = headerData
      this.headerAttr = {
        wgtName: Header.wgtName,
        ...Header.config
      }

      list.forEach((li) => {
        // 是否存在挂件
        const wgt = this.widgets.find((item) => item.name.toLowerCase() == li.name.toLowerCase())
        if (wgt) {
          // console.log('getTemplateDetial wgt:', wgt)
          const wgtInitParams = this.cloneDefaultField(wgt)
          const params = wgt.config.transformIn(li.params)
          this.contentComps.push({
            wgtName: wgt.wgtName,
            ...wgtInitParams,
            ...params
          })
        }
      })
      console.log('getTemplateDetial:', this.contentComps)
    },
    onMoveUpComp(index) {
      this.contentComps
    },
    onMoveDownComp(index) {},
    onCopyComp(index, wgt) {
      this.contentComps.splice(index + 1, 0, cloneDeep(wgt))
    },
    onDeleteComp(index) {
      if (this.contentComps.length == index + 1) {
        setTimeout(() => {
          this.handleClickHeader()
        }, 20)
      }
      this.contentComps.splice(index, 1)
    },
    async onSaveTemplate() {
      // console.log('onSaveTemplate:', JSON.stringify(data))
      if (this.mode == 'dialog') {
        this.resetDecorateTheme()
        this.$emit('change', this.contentComps)
        return
      }
      const data = this.contentComps.map((item) => {
        const { transformOut } = this.widgets.find(
          (wgt) => wgt.name.toLowerCase() == item.name.toLowerCase()
        )?.config
        return transformOut(item)
      })
      data.unshift(this.headerAttr.transformOut(this.headerData))
      const { id } = this.$route.query
      if (this.localScene == '1004' || this.localScene == '1006' || this.localScene == '1008') {
        await this.$api.wxa.savePageParams({
          template_name: 'yykweishop',
          page_name: `custom_${id}`,
          version: 'v1.0.1',
          config: JSON.stringify(data)
        })
      } else {
        await this.$api.template.savePagesTemplate({
          pages_template_id: id,
          template_name: 'yykweishop',
          template_content: JSON.stringify({
            content: data
          })
        })
      }

      this.$message.success('保存成功')
    },
    onExit() {
      this.$router.go(-1)
    },
    onClose() {
      this.resetDecorateTheme()
      this.$emit('close')
    }
  }
}
</script>
