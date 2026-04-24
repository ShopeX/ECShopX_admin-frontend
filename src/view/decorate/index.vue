<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd">
      <div class="hd-lf">{{ localTitle }}</div>
      <div class="hd-rg">
        <el-button v-if="mode == 'page'" plain @click="onExit">
          {{ $t('c3827da6.5094c1') }}
        </el-button>
        <el-button v-if="mode == 'dialog'" plain @click="onClose">
          {{ $t('c3827da6.b15d91') }}
        </el-button>
        <el-button type="primary" @click="onSaveTemplate">{{ $t('c3827da6.be5fbb') }}</el-button>
      </div>
    </div>
    <div class="decorate-bd">
      <div class="left-container">
        <div class="wgts-categories">
          <!-- 通用挂件 -->
          <div v-if="widgetCategories.general.length > 0" class="wgt-category">
            <div class="category-title">{{ $t('c3827da6.c67610') }}</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.general"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.general"
                :key="`wgt-general__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <SpIcon size="24" :name="wgt.wgtIcon" />
                <!-- <div :class="['wgt-icon', wgt.wgtIcon]" /> -->
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">{{ $t('c3827da6.b3d296') }}</div>
                </div>
              </div>
            </draggable>
          </div>

          <!-- 功能挂件 -->
          <div v-if="widgetCategories.functional.length > 0" class="wgt-category">
            <div class="category-title">{{ $t('c3827da6.1c4b6c') }}</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.functional"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.functional"
                :key="`wgt-functional__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <SpIcon size="24" :name="wgt.wgtIcon" />
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">{{ $t('c3827da6.b3d296') }}</div>
                </div>
              </div>
            </draggable>
          </div>

          <!-- 专用挂件 -->
          <div v-if="widgetCategories.dedicated.length > 0" class="wgt-category">
            <div class="category-title">{{ $t('c3827da6.c69295') }}</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.dedicated"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.dedicated"
                :key="`wgt-dedicated__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <SpIcon size="24" :name="wgt.wgtIcon" />

                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">{{ $t('c3827da6.b3d296') }}</div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="center-container">
        <!-- {{ contentComps }} -->
        <!-- {{ headerData }} -->
        <div class="weapp-template">
          <Header v-if="headerVisible" :value="headerData" @change="handleClickHeader" />
          <div class="weapp-body" :style="weappBodyStyle">
            <draggable
              :list="contentComps"
              group="easyview"
              class="components-design-wrap"
              :move="onDragMove"
              @add="onDragAdd"
            >
              <div
                v-for="(wgt, index) in contentComps"
                :key="`wgt-render-item__${index}`"
                class="wgt-render-item"
                :class="{ active: activeCompIndex == index }"
                @click="handleClickWgtItem(index)"
              >
                <div class="wgt-tip">
                  {{ (wgt && wgt.wgtName) || '' }}
                </div>
                <div
                  class="wgt-tools flex flex-col gap-1"
                  :class="{ active: activeCompIndex == index }"
                >
                  <SpIcon name="copy" @click="onCopyComp(index, wgt)" />
                  <SpIcon name="delete" @click="onDeleteComp(index)" />
                </div>
                <component
                  v-if="wgt && wgt.name"
                  ref="previewWgts"
                  :is="getComponentName(wgt)"
                  :value="wgt"
                />
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div v-if="activeCompIndex !== null && contentComps[activeCompIndex] && hackReset">
          <div class="wgt-name">
            {{ (getComponentAttr(contentComps[activeCompIndex]) || {}).wgtName }}
          </div>
          <attrPanel
            v-model="contentComps[activeCompIndex]"
            :class="`wgt-attr-${contentComps[activeCompIndex].name}`"
            :info="getComponentAttr(contentComps[activeCompIndex])"
          />
        </div>
        <div v-if="activeCompIndex == null && hackReset && headerAttr && headerVisible">
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
        'background-image': `url(${newPageBackgroundStyle?.image})`,
        'background-size': 'cover',
        'background-position': 'center'
      }
    },
    headerVisible() {
      // 商城装修(1001)、店铺装修(1003)、个人中心(1008)展示页面设置挂件，1007 分类模版等不展示
      return (
        this.mode == 'page' &&
        (this.localScene == '1001' ||
          this.localScene == '1003' ||
          this.localScene == '1008' ||
          this.localScene == '1004')
      )
    },
    widgetCategories() {
      // 通用挂件：轮播、热区图、视频、文字轮播
      const generalNames = ['Slider', 'ImgHotzone', 'Film', 'Marquees']
      // 功能挂件：店铺、优惠券
      const functionalNames = [
        'Shop',
        'Classify',
        'CouponCard',
        'StoreAlphabet',
        'Speedkill',
        'Group',
        'hotranking',
        'Ranking',
        'goods',
        'goodsCard'
      ]
      // 专用挂件：订单导航
      const dedicatedNames = ['OrderNavigation']

      const categories = {
        general: [],
        functional: [],
        dedicated: []
      }

      // 显示所有挂件，不进行过滤
      this.widgets.forEach((wgt) => {
        const name = wgt.name
        if (generalNames.includes(name)) {
          categories.general.push(wgt)
        } else if (functionalNames.includes(name)) {
          categories.functional.push(wgt)
        } else if (dedicatedNames.includes(name)) {
          categories.dedicated.push(wgt)
        } else {
          // 未分类的组件默认放到通用挂件
          categories.general.push(wgt)
        }
      })

      return categories
    }
  },
  watch: {
    // 自动剔除无效/空白挂件（null、空对象或未在 widgets 中注册的项），避免出现“无用”条
    contentComps: {
      handler() {
        if (!this.widgets.length) return
        this.$nextTick(() => {
          const valid = this.contentComps.filter((c) => this.isValidContentComp(c))
          if (valid.length < this.contentComps.length) {
            this.contentComps.splice(0, this.contentComps.length, ...valid)
            if (
              this.activeCompIndex !== null &&
              (this.activeCompIndex >= this.contentComps.length ||
                !this.contentComps[this.activeCompIndex])
            ) {
              this.activeCompIndex =
                this.contentComps.length > 0 ? this.contentComps.length - 1 : null
            }
          }
        })
      },
      deep: true
    }
  },
  created() {
    const { mode } = this
    if (mode == 'page') {
      const { scene = '1001' } = this.$route.query
      this.localScene = scene

      const _title = {
        1001: this.$t('c3827da6.3d97fc'),
        1002: this.$t('c3827da6.b4f5db'),
        1003: this.$t('c3827da6.eab3fc'),
        1004: this.$t('c3827da6.9d3c40'),
        1007: this.$t('c3827da6.38e3c7'),
        1008: this.$t('c3827da6.fbd049'),
        1009: this.$t('c3827da6.fa06ad')
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
  mounted() {},
  methods: {
    regsiterWgts() {
      // const { scene = '1001' } = this.$route.query
      const wgts = gWgts[this.localScene]
      Object.keys(wgts).forEach((index) => {
        this.widgets.push(wgts[index])
        Vue.component(wgts[index].name, wgts[index])
      })
    },
    resetDecorateTheme() {},
    // 落库 name 多为 config.name（如 goodsCard），与 Vue 组件名（如 Goods）可能不一致
    findWidgetForPersistedName(persistedName) {
      const key = String(persistedName || '').toLowerCase()
      if (!key || !this.widgets.length) return null
      let w = this.widgets.find((item) => (item.name || '').toLowerCase() === key)
      if (w) return w
      w = this.widgets.find((item) => String(item.config?.name || '').toLowerCase() === key)
      if (w) return w
      if (String(this.localScene) === '1005' && key === 'goods') {
        return (
          this.widgets.find((item) => String(item.config?.name || '').toLowerCase() === 'goodscard') ||
          this.widgets.find((item) => (item.name || '').toLowerCase() === 'goods') ||
          null
        )
      }
      return null
    },
    // 用 widgets 中注册的组件名（如 LocationModule）渲染，避免 config.name（如 locationModule）与 Vue 注册名大小写不一致导致预览不显示
    getComponentName(item) {
      if (!item?.name || !this.widgets.length) return item?.name || ''
      const w = this.findWidgetForPersistedName(item.name)
      return w ? w.name : item.name
    },
    getComponentAttr(item) {
      if (!item) return { wgtName: '', config: {} }
      const wgt = this.findWidgetForPersistedName(item.name)
      if (!wgt) return { wgtName: item.wgtName || item.name || '', ...(item.config || {}) }
      return {
        wgtName: wgt.wgtName,
        ...wgt.config
      }
    },
    cloneDefaultField(e) {
      const { wgtName, wgtDesc, config } = e
      const { setting, name } = JSON.parse(JSON.stringify(config))

      // 检查是否可以添加（在克隆时检查）
      if (!this.canAddWgt(name)) {
        this.$message.error(this.getMutualExclusiveMessage(name))
        // 返回 null 或抛出错误来阻止克隆
        return null
      }

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
        if (
          this.localScene == '1004' ||
          this.localScene == '1006' ||
          this.localScene == '1007' ||
          this.localScene == '1008'
        ) {
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
        const headParams = Header.config.transformIn(
          { id: wgtHeader?.id, ...wgtHeader.params },
          this.widgets
        )
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
        const wgt = this.findWidgetForPersistedName(li.name)
        if (wgt) {
          // console.log('getTemplateDetial wgt:', wgt)
          const wgtInitParams = this.cloneDefaultField(wgt)
          const params = wgt.config.transformIn({ id: li?.id, ...li.params }, this.widgets)
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
      if (!wgt || !wgt.name) return
      // 检查互斥逻辑（wgt.name 是 config.name，如 storeAlphabet、fullSlider）
      if (!this.canAddWgt(wgt.name)) {
        this.$message.error(this.getMutualExclusiveMessage(wgt.name))
        return
      }
      const copy = cloneDeep(wgt)
      // 与原件共用同一服务端 id 时，保存后后端会按 id 合并/覆盖，再次进入装修页副本会丢失
      delete copy.id
      this.contentComps.splice(index + 1, 0, copy)
    },
    onDeleteComp(index) {
      if (this.contentComps.length == index + 1) {
        setTimeout(() => {
          this.handleClickHeader()
        }, 20)
      }
      this.contentComps.splice(index, 1)
    },
    // 拖拽移动时的处理（在拖拽过程中检查，返回 false 可以阻止拖拽）
    onDragMove(evt) {
      // 如果是从左侧拖拽到右侧（添加新挂件）
      // evt.relatedContext.list === this.contentComps 表示要添加到右侧列表
      if (evt.relatedContext && evt.relatedContext.list === this.contentComps) {
        // 添加空值检查，防止访问 undefined.element 报错
        if (!evt.draggedContext || !evt.draggedContext.element) {
          return true // 允许拖拽，让其他逻辑处理
        }
        const draggedWgt = evt.draggedContext.element

        // 从左侧拖拽时，draggedWgt 可能是组件对象（name 是组件名如 StoreAlphabet）
        // 也可能是克隆后的数据（name 是 config.name 如 storeAlphabet）
        if (!draggedWgt || !draggedWgt.name) {
          return true // 允许拖拽，让其他逻辑处理
        }
        let configName = draggedWgt.name

        // 如果是组件对象，需要转换为 config.name
        if (draggedWgt.config) {
          // 已经是克隆后的数据，直接使用 name
          configName = draggedWgt.name
        } else {
          // 是组件对象，需要查找对应的 config.name
          const wgt = this.widgets.find((w) => w.name === draggedWgt.name)
          configName = wgt?.config?.name || draggedWgt.name
        }

        // 检查是否可以添加
        if (!this.canAddWgt(configName)) {
          this.$message.error(this.getMutualExclusiveMessage(configName))
          return false // 阻止拖拽
        }
      }
      return true // 允许拖拽
    },
    // 拖拽添加挂件时的处理（备用检查，防止 move 事件未触发）
    onDragAdd(evt) {
      if (!evt || !evt.added) return
      const addedWgt = evt.added.element
      const addedIndex = evt.added.newIndex
      // 互斥时 clone 可能返回 null，仍会加入列表形成空白项；或加入的是不允许的挂件
      const name = addedWgt && addedWgt.name ? addedWgt.name : ''
      const shouldRemove = !addedWgt || !name || !this.canAddWgt(name)
      if (shouldRemove) {
        // 在下一帧按“刚添加的索引”移除（确保 vuedraggable 已更新列表），避免留下空白/无用挂件
        this.$nextTick(() => {
          if (addedIndex >= 0 && addedIndex < this.contentComps.length) {
            this.contentComps.splice(addedIndex, 1)
          }
          // 只保留在 widgets 中注册的有效挂件，剔除 null、空对象或未知项
          this.contentComps = this.contentComps.filter((c) => this.isValidContentComp(c))
          if (
            this.activeCompIndex !== null &&
            (this.activeCompIndex >= this.contentComps.length ||
              !this.contentComps[this.activeCompIndex])
          ) {
            this.activeCompIndex =
              this.contentComps.length > 0 ? this.contentComps.length - 1 : null
          }
        })
        this.$message.error(this.getMutualExclusiveMessage(name))
      }
    },
    // 是否为有效挂件（在 widgets 中注册且可渲染）
    isValidContentComp(c) {
      if (!c || typeof c !== 'object' || !c.name) return false
      return !!this.findWidgetForPersistedName(c.name)
    },
    // 检查是否可以添加挂件（互斥逻辑：店铺字母列表、整屏滑动 与其余挂件互斥）
    canAddWgt(wgtName) {
      const storeAlphabetConfigName = 'storeAlphabet'
      const storeAlphabetComponentName = 'StoreAlphabet'
      const fullSliderConfigName = 'fullSlider'
      const fullSliderComponentName = 'FullSlider'

      const isAddingStoreAlphabet =
        wgtName === storeAlphabetConfigName || wgtName === storeAlphabetComponentName
      const isAddingFullSlider =
        wgtName === fullSliderConfigName || wgtName === fullSliderComponentName
      const isMutuallyExclusiveWgt = isAddingStoreAlphabet || isAddingFullSlider

      const hasStoreAlphabet = this.contentComps.some(
        (comp) => comp && comp.name === storeAlphabetConfigName
      )
      const hasFullSlider = this.contentComps.some(
        (comp) => comp && comp.name === fullSliderConfigName
      )
      const hasOtherWgts = this.contentComps.some(
        (comp) =>
          comp && comp.name !== storeAlphabetConfigName && comp.name !== fullSliderConfigName
      )

      // 添加整屏滑动/店铺字母列表时，已有其他挂件则不允许
      if (
        isMutuallyExclusiveWgt &&
        (hasOtherWgts ||
          (isAddingFullSlider && hasStoreAlphabet) ||
          (isAddingStoreAlphabet && hasFullSlider))
      ) {
        return false
      }
      // 添加其他挂件时，已有整屏滑动或店铺字母列表则不允许
      if (!isMutuallyExclusiveWgt && (hasStoreAlphabet || hasFullSlider)) {
        return false
      }

      return true
    },
    // 互斥时的提示文案（按组件区分）
    getMutualExclusiveMessage(wgtName) {
      return this.$t('c3827da6.e6e7eb')
    },
    async syncSliderFirstScreenHeights() {
      await this.$nextTick()
      const refs = this.$refs.previewWgts
      const list = Array.isArray(refs) ? refs : refs ? [refs] : []
      await Promise.all(
        list
          .filter((c) => c && typeof c.measureFirstScreenHeight === 'function')
          .map((c) => Promise.resolve(c.measureFirstScreenHeight()))
      )
      await this.$nextTick()
    },
    async onSaveTemplate() {
      await this.syncSliderFirstScreenHeights()
      // console.log('onSaveTemplate:', JSON.stringify(data))
      if (this.mode == 'dialog') {
        this.$emit('change', this.contentComps)
        return
      }
      const data = this.contentComps.map((item) => {
        const wgt = this.findWidgetForPersistedName(item.name)
        const { transformOut } = wgt?.config || {}
        return transformOut ? transformOut(item, this.widgets) : item
      })
      data.unshift(this.headerAttr.transformOut(this.headerData, this.widgets))
      const { id } = this.$route.query
      console.log('onSaveTemplate data:', data)
      if (
        this.localScene == '1004' ||
        this.localScene == '1006' ||
        this.localScene == '1008' ||
        this.localScene == '1007'
      ) {
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

      this.$message.success(this.$t('c3827da6.3b1083'))
    },
    onExit() {
      this.$router.go(-1)
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
