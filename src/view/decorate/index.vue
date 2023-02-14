<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd">
      <el-button @click="onSaveTemplate"> 后退 </el-button>
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
          <Header :value="headerData" @change="handleClickHeader" />
          <div class="weapp-body" :style="weappBodyStyle">
            <draggable :list="contentComps" group="easyview" class="components-wrap">
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
                  <i class="iconfont icon-arrow-alt-circle-up1" />
                  <i class="iconfont icon-arrow-alt-circle-dow1" />
                  <i class="iconfont icon-copy1" @click="onCopyComp(wgt)" />
                  <i class="iconfont icon-trash-alt1" @click="onDeleteComp(index)" />
                </div>
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
        </div>
        <div v-if="activeCompIndex == null && hackReset && headerAttr">
          <div class="wgt-name">{{ headerAttr.wgtName }}</div>
          <attrPanel v-model="headerData" :info="headerAttr" />
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
import Header from './wgts/wgt-header'
export default {
  name: '',
  components: {
    draggable,
    attrPanel,
    Header
  },
  data() {
    return {
      widgets: [],
      contentComps: [],
      activeComp: null,
      activeCompIndex: null,
      hackReset: false,
      headerData: null,
      headerAttr: null
    }
  },
  computed: {
    weappBodyStyle() {
      const { pageBackgroundStyle, pageBackgroundColor, pageBackgroundImage } =
        this.headerData || {}
      if (pageBackgroundStyle == '1') {
        return {
          'background-color': pageBackgroundColor
        }
      } else {
        return {
          'background-image': `url(${pageBackgroundImage})`,
          'background-size': 'cover',
          'background-position': 'center'
        }
      }
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
      const { setting, name } = config
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
      const { template_content } = await this.$api.template.getPagesTemplateDetail({
        pages_template_id: id
      })
      const { list } = template_content
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
    onCopyComp(wgt) {
      // this.contentComps.
    },
    onDeleteComp(index) {
      this.contentComps.splice(index, 1)
    },
    async onSaveTemplate() {
      const data = this.contentComps.map((item) => {
        const { transformOut } = this.widgets.find(
          (wgt) => wgt.name.toLowerCase() == item.name.toLowerCase()
        )?.config
        return transformOut(item)
      })
      console.log('onSaveTemplate:', JSON.stringify(data))
      const { id } = this.$route.query
      await this.$api.template.savePagesTemplate({
        pages_template_id: id,
        template_name: 'yykweishop',
        template_content: JSON.stringify({
          content: data
        })
      })
      this.$message.success('保存成功')
    }
  }
}
</script>
