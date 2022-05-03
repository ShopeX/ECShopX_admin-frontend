<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd" />
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
          :clone="cloneDog"
          :sort="false"
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
            <i
              class="wgt-icon iconfont"
              :class="wgt.wgtIcon"
            />
            <div class="wgt-name">
              {{ wgt.wgtName }}
            </div>
          </div>
        </draggable>
      </div>
      <div class="center-container">
        <draggable
          :list="comps"
          group="easyview"
          class="components-wrap"
          @change="log2"
        >
          <div class="weapp-template">
            <div class="weapp-header" />
            <div>
              <div
                v-for="(wgt, index) in comps"
                :key="`wgt-render-item__${index}`"
                class="wgt-render-item"
                @click="handleClickWgtItem(wgt)"
              >
                <!-- {{wgt}} -->
                <div class="wgt-tip">
                  {{ wgt.wgtName }}
                </div>
                <component
                  :is="wgt.name"
                  :value="transform(wgt)"
                />
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <div class="right-container">
        <div v-if="activeComp">
          <!-- {{activeComp}} -->
          <div class="wgt-name">
            {{ activeComp.wgtName }}
          </div>
          <component
            :is="`${activeComp.wgtId}Attr`"
            :value="activeComp"
          />
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
  data () {
    return {
      widgets: [],
      comps: [],
      activeComp: null
    }
  },
  created () {
    this.regsiterWgts()
  },
  mounted () {
    document.body.style.setProperty('--themeColor', '#409EFF')
    document.body.style.setProperty('--themeColorRgb', [64, 158, 255].join(','))
  },
  methods: {
    regsiterWgts () {
      console.log('wgts:', wgts, comps)
      Object.keys(wgts).forEach((index) => {
        if (wgts[index].name.indexOf('Attr') == -1) {
          this.widgets.push(wgts[index])
        }
        Vue.component(wgts[index].name, wgts[index])
      })
      Object.keys(comps).forEach((index) => {
        Vue.component(comps[index].name, comps[index])
      })
    },
    // 拖拽绑定事件
    onStart (evt) {
      // console.log('onStart:', evt, evt.target.getAttribute('data-name'))
      // const { name } = evt.item.dataset
      // if (evt.target.className === 'components-view') {
      //   this.saveInit = JSON.stringify(this.initData[evt.oldIndex])
      // } else {
      //   this.setCurrent(evt.oldIndex)
      // }
    },
    onEnd (evt) {
      // const { name } = evt.item.dataset
      // console.log('---onEnd---: ', name)
      // this.setCurrent(evt.newIndex)
      // if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
      //   this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      // }
    },
    log1: function (evt) {
      window.console.log('log1:', evt)
    },
    log2: function (evt) {
      window.console.log('log2:', evt)
    },
    cloneDog ({ name, wgtName, wgtIcon, config }) {
      return {
        name,
        wgtName,
        wgtIcon,
        config
      }
    },
    handleClickWgtItem ({ name, config, wgtName }) {
      console.log(`handleClickWgtItem:`, config, wgtName)
      this.activeComp = {
        ...config,
        wgtId: name,
        wgtName
      }
    },
    transform (wgt) {
      let temp = {}
      const { name, base, data } = wgt.config
      temp = {
        name
      }
      base.forEach((item) => {
        temp[item.key] = item.value
      })
      return temp
    }
  }
}
</script>
