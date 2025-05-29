<style lang="scss" scoped>
.sp-decorate {
  width: 375px;
  // padding: 10px;
  background-color: #f5f5f5;
  line-height: initial;
  position: relative;

  .weapp-body {
    box-shadow: 0 0 14px 0 rgb(0 0 0 / 10%);

    &::-webkit-scrollbar {
      display: none;
    }

    .wgt-render-item {
      &:last-child {
        margin-bottom: 16px;
      }
    }
  }

  .btn-edit {
    text-align: center;
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 10px 0;
  }
}
</style>
<style lang="scss">
.dialog-decorate {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>
<template>
  <div class="sp-decorate">
    <div class="weapp-template">
      <!-- {{ localValue }} -->
      <div class="weapp-body">
        <div
          v-for="(wgt, index) in getWgtsValue(value)"
          :key="`wgt-render-item__${index}`"
          class="wgt-render-item"
        >
          <component :is="wgt.name" :value="wgt" />
        </div>
      </div>
    </div>
    <div class="btn-edit">
      <el-button type="primary" plain round @click="onEdit"> 编辑内容 </el-button>
    </div>

    <el-dialog
      :visible="dialogVisible"
      class="dialog-decorate"
      :append-to-body="true"
      :show-close="false"
      fullscreen
      lock-scroll
    >
      <DecorateView
        v-if="dialogVisible"
        ref="decorateViewRef"
        :title="title"
        mode="dialog"
        :value="localValue"
        :scene="scene"
        @change="onSave"
        @close="onClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import gWgts from '@/view/decorate/wgts'
import DecorateView from '@/view/decorate'
export default {
  name: 'SpDecorate',
  components: {
    draggable,
    DecorateView
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    scene: {
      type: String,
      default: '1001'
    },
    title: {
      type: String,
      default: '商品描述'
    }
  },
  data() {
    return {
      localValue: [],
      widgets: [],
      contentComps: [],
      dialogVisible: false
    }
  },
  watch: {
    value: function (nVal, oVal) {
      this.localValue = this.getWgtsValue(nVal)
    }
  },
  created() {
    this.registerWgts()
  },
  methods: {
    getWgtsValue(val) {
      const filterWidget = []
      val.forEach((k) => {
        const wgt = this.widgets.find((item) => item.name.toLowerCase() == k.name.toLowerCase())
        if (wgt) {
          const wgtInitParams = this.cloneDefaultField(wgt)
          const params = wgt.config.transformIn(k)
          filterWidget.push({
            wgtName: wgt.wgtName,
            ...wgtInitParams,
            ...params
          })
        }
      })
      return filterWidget
    },
    registerWgts() {
      // const { scene = '1001' } = this.$route.query
      const wgts = gWgts[this.scene]
      Object.keys(wgts).forEach((index) => {
        this.widgets.push(wgts[index])
        Vue.component(wgts[index].name, wgts[index])
      })
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
      return compData
    },
    onEdit() {
      this.dialogVisible = true
    },
    onSave(data) {
      const result = data.map((item) => {
        const { transformOut } = this.widgets.find(
          (wgt) => wgt.name.toLowerCase() == item.name.toLowerCase()
        )?.config
        return transformOut(item)
      })
      this.$emit('input', result)
      this.dialogVisible = false
    },
    onClose() {
      this.localValue = this.getWgtsValue(this.value)
      this.dialogVisible = false
    },
    resetDecorateTheme() {
      this.$refs['decorateViewRef'].resetDecorateTheme()
    }
  }
}
</script>
