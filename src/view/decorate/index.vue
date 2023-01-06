<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd">
      <el-button @click="onSaveTemplate"> 保存 </el-button>
    </div>
    <div class="decorate-bd">
      <div class="left-container">
        <draggable
          class="components-view"
          :chosen-class="'components-view-chosen'"
          :list="widgets"
          :group="{
            name: 'easyview',
            pull: 'clone',
            put: false
          }"
          :sort="false"
          :clone="cloneDefaultField"
          @start="onStart"
          @end="onEnd"
          @change="log1"
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
        {{ contentComps }}
        <div class="weapp-template">
          <div class="weapp-header" />
          <div class="weapp-body">
            <draggable :list="contentComps" group="easyview" class="components-wrap" @change="log2">
              <div
                v-for="(wgt, index) in contentComps"
                :key="`wgt-render-item__${index}`"
                class="wgt-render-item"
                :class="{ active: activeCompIndex == index }"
                @click="handleClickWgtItem(index)"
              >
                <!-- {{wgt}} -->
                <div class="wgt-tip">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-tools" :class="{ active: activeCompIndex == index }">
                  <i class="iconfont icon-arrow-alt-circle-up1" />
                  <i class="iconfont icon-arrow-alt-circle-dow1" />
                  <i class="iconfont icon-copy1" @click="onCopyComp(wgt)" />
                  <i class="iconfont icon-trash-alt1" @click="onDeleteComp(index)" />
                </div>
                <!-- <component :is="wgt.name" :value="transform(wgt)" /> -->
                <component :is="wgt.name" :value="wgt" />
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div v-if="activeCompIndex !== null && hackReset">
          <div class="wgt-name">
            {{ getComponentAttr(contentComps[activeCompIndex]).wgtName }}
          </div>
          <attrPanel
            v-model="contentComps[activeCompIndex]"
            :info="getComponentAttr(contentComps[activeCompIndex])"
          />
          <!-- <component
            :is="`${contentComps[activeCompIndex].name}Attr`"
            :value="contentComps[activeCompIndex].config"
          /> -->
          <!-- <div class="">
            <div class="wgt-name">{{activeComp.wgtName}}</div>
            <div v-for="(item, idx) in activeComp.base" :key="`ba-${idx}`">
              <attrPanel :info="item" v-model="item.value" />
            </div>
            <div v-for="(item, idx) in activeComp.config" :key="`config-${idx}`">
              <attrPanel :info="item" v-model="item.value" />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import wgts from './wgts'
import comps from './comps'
import attrPanel from './attr_panel'
export default {
  name: '',
  components: {
    draggable,
    attrPanel
  },
  data() {
    return {
      widgets: [],
      contentComps: [],
      activeComp: null,
      activeCompIndex: null,
      hackReset: false
    }
  },
  created() {
    this.regsiterWgts()
    this.getTemplateDetial()
  },
  mounted() {
    document.body.style.setProperty('--themeColor', '#155bd4')
    document.body.style.setProperty('--themeColorRgb', [21, 91, 212].join(','))
  },
  methods: {
    regsiterWgts() {
      console.log('wgts:', wgts, comps)
      Object.keys(wgts).forEach((index) => {
        this.widgets.push(wgts[index])
        Vue.component(wgts[index].name, wgts[index])
      })
    },
    getComponentAttr(item) {
      const { wgtName, config } = this.widgets.find((wgt) => wgt.name == item.name)
      return {
        wgtName,
        ...config
      }
    },
    // 拖拽绑定事件
    onStart(evt) {
      // console.log('onStart:', evt, evt.target.getAttribute('data-name'))
      // const { name } = evt.item.dataset
      // if (evt.target.className === 'components-view') {
      //   this.saveInit = JSON.stringify(this.initData[evt.oldIndex])
      // } else {
      //   this.setCurrent(evt.oldIndex)
      // }
    },
    onEnd(evt) {
      // const { name } = evt.item.dataset
      // console.log('---onEnd---: ', name)
      // this.setCurrent(evt.newIndex)
      // if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
      //   this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      // }
      // debugger
    },
    log1: function (evt) {
      window.console.log('log1:', evt)
    },
    log2: function (evt) {
      window.console.log('log2:', evt)
    },
    cloneDefaultField(e) {
      const { wgtName, config } = e
      const { setting, name } = config
      const compData = {
        name,
        wgtName
      }
      setting.forEach((item) => {
        compData[item.key] = item.value
      })
      console.log('compData', compData)
      return compData
      // return JSON.parse(JSON.stringify(e))
    },
    // handleClickWgtItem ({ name, config, wgtName }) {
    //   console.log(`handleClickWgtItem:`, config, wgtName)
    //   this.activeComp = {
    //     ...config,
    //     wgtId: name,
    //     wgtName
    //   }
    // },
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
      // let temp = {}
      // const { name, base, config, data } = wgt.config
      // temp = {
      //   name,
      //   data
      // }
      // base.forEach((item) => {
      //   temp[item.key] = item.value
      // })
      // config.forEach((item) => {
      //   temp[item.key] = item.value
      // })
      // return temp
    },
    async getTemplateDetial() {
      const { id } = this.$route.query
      const { template_content } = await this.$api.template.getPagesTemplateDetail({
        pages_template_id: id
      })

      // template_content.config.map((item) => {
      //   Object.keys(wgts).forEach((key) => {
      //     if (wgts[key].name.indexOf('Attr') == -1) {
      //       if (wgts[key].config.name == item.name) {
      //         const { base, config } = wgts[key].config
      //         base.forEach((b) => {
      //           b.value = item.base[b.key] || b.value
      //         })
      //         config.forEach((c) => {
      //           c.value = item.config[c.key] || c.value
      //         })
      //         this.contentComps.push(JSON.parse(JSON.stringify(wgts[key])))
      //       }
      //     }
      //   })
      // })
      // console.log(this.contentComps)
    },
    onCopyComp(wgt) {
      // this.contentComps.
    },
    onDeleteComp(index) {
      this.contentComps.splice(index, 1)
    },
    onSaveTemplate() {
      console.log('onSaveTemplate:', this.contentComps)
    }
  }
}
</script>
