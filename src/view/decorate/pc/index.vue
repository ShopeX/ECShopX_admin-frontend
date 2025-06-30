<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-pc">
    <div class="decorate-hd">
      <div class="hd-lf">{{ localTitle }}</div>
      <div class="hd-rg">
        <el-button v-if="mode == 'page'" plain @click="onExit">后退</el-button>
        <el-button v-if="mode == 'dialog'" plain @click="onClose"> 关闭</el-button>
        <el-button plain @click="onSaveTemplate"> 保存 </el-button>
      </div>
    </div>
    <div class="decorate-bd">
      <div class="center-container">
        <div class="decorate-view">
          <SpIframe ref="templateIframe" :mode="mode" @ready="handleIframeLoaded" />
        </div>
      </div>
      <div class="right-container">
        <div v-if="activeCompIndex !== null && contentComps[activeCompIndex] && hackReset">
          <div class="wgt-name">
            {{ getComponentAttr(contentComps[activeCompIndex]).wgtName }}
          </div>
          <CompPanel
            v-model="contentComps[activeCompIndex]"
            :class="`wgt-attr-${contentComps[activeCompIndex].name}`"
            :info="getComponentAttr(contentComps[activeCompIndex])"
          />
        </div>
      </div>
    </div>

    <el-backtop target=".center-container" :right="420" />
    <!-- <WgtModal
      :wgtlist="widgets"
      :visible="wgtsSelectModalShow"
      @comfirm="handleAddWgt"
      @close="wgtsSelectModalShow = false"
    /> -->
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { SYSTEM_CONFIG } from '@/consts'
import store from '@/store'
import { hex2rgb } from '@/utils'
import CompPanel from '@/view/decorate/attr_panel'
import gWgts, { SCENE_1001 as widgets } from './wgts'
import { ACTIONS, POST_SOURCE } from './util'
import SpIframe from './comps/sp-iframe'
import InjectDomOperations from './injectDomOperate'

export default {
  async beforeRouteLeave(to, from, next) {
    this.resetDecorateTheme()
    next()
  },
  components: {
    CompPanel,
    // WgtModal,
    SpIframe
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
      default: '1006'
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    contentComps: {
      handler: function (val, oldVal) {
        console.log('contentComps-change', val)
        const data = val.map(item => {
          const { transformOut } = this.widgets.find(
            wgt => wgt.config.name.toLowerCase() == item.name.toLowerCase()
          )?.config
          return transformOut(cloneDeep(item), cloneDeep(this.widgets))
        })
        this.postMessage({
          action: ACTIONS.UPDATE,
          payload: {
            value: data
          }
        })
      },
      deep: true
    }
  },
  data() {
    return {
      domOperate: null,
      wgtsSelectModalShow: false,
      localScene: '1006',
      localTitle: '',
      widgets: widgets,
      contentComps: [],
      activeComp: null,
      activeCompIndex: null,
      hackReset: true,
      headerData: null,
      headerAttr: null,
      wgtsAddIndex: null
    }
  },
  created() {
    // this.regsiterWgts()
  },
  methods: {
    //    regsiterWgts() {
    //   const { scene = '1006' } = this.$route.query
    //   const wgts = gWgts[scene]
    //   Object.keys(wgts).forEach((index) => {
    //     this.widgets.push(wgts[index])
    //     // Vue.component(wgts[index].name, wgts[index])
    //   })
    // },
    async getTemplateDetial() {
      const { id } = this.$route.query
      const data = await this.$api.webtemplate.getTemplateContent({
        theme_pc_template_id: id,
        page_type: 'pc'
      })
      if (data) {
        this.contentComps = this.getSettingConfig(
          data.map(item => {
            const citem = { ...item.config, uuid: uuidv4() }
            return citem
          })
        )
      }
    },
    handleIframeLoaded(iframe) {
      setTimeout(() => {
        this.domOperate = new InjectDomOperations({
          targetClass: 'wgt-render-item',
          rootDomClass: 'template-edit',
          bodyDomClass: 'template-body',
          iframe: iframe,
          callback: info => {
            this.receiveInfo(info)
          }
        })

        this.getTemplateDetial()
      }, 300)
    },
    getSettingConfig(list) {
      return list
        .filter(item => item.name !== 'page')
        .map(item => {
          console.log('item', item)
          const wgts = this.widgets.find(iitem => {
            return iitem.config.name == item.name
          })
          const { transformIn } = wgts.config
          return transformIn(item, this.widgets)
        })
    },
    async receiveInfo(info) {
      switch (info.action) {
        case ACTIONS.UPDATE:
          // eslint-disable-next-line no-case-declarations
          const list = info.payload && info.payload.length ? info.payload : []

          this.contentComps = this.getSettingConfig(list)
          break
        case ACTIONS.CHECKED:
          this.activeCompIndex = this.contentComps.findIndex(item => item.uuid == info.payload.uuid)
          console.log('this.contentComps', this.contentComps)
          console.log('activeCompIndex', this.activeCompIndex)
          break
        case ACTIONS.ADD:
          // eslint-disable-next-line no-case-declarations
          const { scene = '1006' } = this.$route.query

          const wgts = gWgts[scene]
          console.log('wgts', wgts)
          const { data } = await this.$picker.widget({
            value: [],
            list: wgts,
            multiple: false
          })

          this.handleAddWgt(data[0].config.name)
          // this.wgtsAddIndex = info.payload.uuid
          //   ? this.contentComps.findIndex((item, index) => item.uuid == info.payload.uuid)
          //   : null
          break
        case ACTIONS.DELETE:
          if (this.contentComps.findIndex((item, index) => item.uuid == info.payload.uuid) != -1) {
            this.contentComps.splice(
              this.contentComps.findIndex((item, index) => item.uuid == info.payload.uuid),
              1
            )
          }
          break
        case ACTIONS.UP:
        case ACTIONS.DOWN:
          this.replaceIndex(info.payload.uuid, info.action)
          break
      }
    },
    replaceIndex(uuid, action) {
      const direction = {
        up: 1,
        down: -1
      }
      const currentModeArr = cloneDeep(this.contentComps)
      const index = currentModeArr.findIndex((item, index) => item.uuid == uuid)
      if (index != -1 && currentModeArr[index - direction[action]]) {
        const move = index - direction[action]
        const cIdx = index
        const temp = this.contentComps[move]
        this.$set(this.contentComps, move, this.contentComps[cIdx])
        this.$set(this.contentComps, cIdx, temp)
        this.activeCompIndex = move
      }
    },
    postMessage(options) {
      this.$refs.templateIframe.post(options)
    },
    handleAddWgt(value) {
      const example = this.getComponentAttr({ name: value }, 'example')
      this.contentComps.splice(
        this.wgtsAddIndex !== null ? this.wgtsAddIndex + 1 : this.contentComps.length,
        0,
        //这里一定要深度克隆，否则可能出现引用重叠
        { ...cloneDeep(example), uuid: uuidv4() }
      )
    },
    resetDecorateTheme() {
      const { theme } = SYSTEM_CONFIG[store.getters.versionMode]
      const red = parseInt(theme.replace('#', '').slice(0, 2), 16)
      const green = parseInt(theme.replace('#', '').slice(2, 4), 16)
      const blue = parseInt(theme.replace('#', '').slice(4, 6), 16)
      document.body.style.setProperty('--primary', theme)
      document.body.style.setProperty('--themeColorRgb', [red, green, blue].join(','))
    },
    getComponentAttr(item, pick) {
      const { wgtName, config, example } = this.widgets.find(wgt => {
        return wgt.config.name.toLowerCase() == item.name.toLowerCase()
      })
      const obj = {
        wgtName,
        example,
        ...config
      }
      return pick ? obj[pick] : obj
    },

    async onSaveTemplate() {
      const data = this.contentComps.map(item => {
        const { transformOut } = this.widgets.find(
          wgt => wgt.config.name.toLowerCase() == item.name.toLowerCase()
        )?.config
        return transformOut(cloneDeep(item), this.widgets)
      })
      const { id } = this.$route.query
      await this.$api.webtemplate.saveTemplateContent({
        theme_pc_template_id: id,
        config: JSON.stringify(data)
      })
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
