<style lang="scss" scoped>
.content-part-nav-item {
  width: 100%;

  .scope-item {
    display: flex;
    align-items: center;

    &-label {
      width: 100px;
      font-size: 12px;
      color: #999;
    }

    &-body {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;

      .scope-item-item {
        display: flex;
        align-items: center;
        gap: 10px;

        .scope-item-item-label {
          font-size: 12px;
          color: #999;
          width: 70px;
        }

        .sp-image-picker {
          width: 34px;
          height: 34px;

          .el-icon-camera {
            font-size: 12px !important;
          }
        }
      }
    }
  }

  .cover-tips {
    display: block;
    font-size: 10px;
    text-align: center;
    width: calc(100% - 10px);
  }

  .cover-color {
    font-size: 10px;
  }

  .color-cell {
    display: flex;

    .image-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    align-items: center;
    padding-top: 2px;
  }

  .scope-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0px 10px;
    height: 40px;
    border-bottom: 1px solid #f5f7fa;
    border-left: 1px solid #f5f7fa;
    border-right: 1px solid #f5f7fa;

    &:hover {
      background-color: #f5f7fa;
    }

    .scope-content-icon {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .icon-shoudongpaixu {
        margin-right: 10px;
      }
    }
  }

  .add-widget-btn {
    margin-top: 10px;
  }
}
</style>
<style lang="scss">
.content-part-nav-item {
  .item-bd {
    display: flex;
    flex-direction: column;
  }

  .btn-todo {
    width: 100%;
    text-align: center;
  }

  .drag-list {
    .item-hd {
      padding: 5px 10px;
      border: 1px solid #f5f7fa;
    }

    .scope-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:last-child) {
        padding: 0px 10px;
        border-bottom: 1px solid #f5f7fa;
        border-left: 1px solid #f5f7fa;
        border-right: 1px solid #f5f7fa;
      }
    }
  }

  .scope-item-item {

    .placeholder,
    .image-item {
      width: 32px !important;
      height: 32px !important;

      .el-icon-camera {
        font-size: 12px !important;
        margin-bottom: 0!important;
      }

      .add-text {
        display: none;
      }

      .image-meta {
        font-size: 7px;
        height: 14px;
        line-height: 14px;
      }
    }
  }
  .el-drawer__header{
    height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid #f5f5f5;
  }
}
</style>

<template>
  <div class="content-part-nav-item">
    <CompDragList v-model="localValue" btn-text="添加导航项" type="text" :show-title="true" title="导航项"
      @onAddItem="handleAddNavItem">
      <template v-if="showSwitch" slot="title" slot-scope="scope">
        <div class="scope-item-title" style="float: right; margin-left: 10px;">
          <el-switch v-model="localValue[scope.index].isActive" @change="handleChangeIsActive(scope.index)" />
        </div>
      </template>
      <template slot="body" slot-scope="scope">
        <div class="scope-item">
          <span class="scope-item-label">导航项形式</span>
          <div class="scope-item-body">
            <el-radio-group v-model="localValue[scope.index].navitemtype" size="small" placeholder="请选择导航项形式">
              <el-radio label="text">文字</el-radio>
              <el-radio label="image">图片 </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="localValue[scope.index].navitemtype == 'text'" class="scope-item">
          <span class="scope-item-label">导航名称</span>
          <div class="scope-item-body">
            <el-input v-model="localValue[scope.index].navItemName" size="small" placeholder="导航项名称" />
          </div>
        </div>
        <div v-if="localValue[scope.index].navitemtype == 'image'" class="scope-item">
          <span class="scope-item-label">导航项图片</span>
          <div class="scope-item-body">
            <div class="scope-item-item">
              <span class="scope-item-item-label">默认图片</span>
              <SpImagePicker v-model="localValue[scope.index].imgUrl" size="small" text="" />
            </div>
            <div class="scope-item-item">
              <span class="scope-item-item-label">选中图片</span>
              <SpImagePicker v-model="localValue[scope.index].navitemactiveimg" size="small" text="" />
            </div>
          </div>
        </div>
        <div class="scope-item">
          <span class="scope-item-label">默认样式</span>
          <div class="scope-item-body">
            <div class="scope-item-item">
              <span class="scope-item-item-label">文字颜色</span>
              <el-color-picker v-model="localValue[scope.index].navitemcolor" size="small" text="" />
            </div>
            <div class="scope-item-item">
              <span class="scope-item-item-label">背景颜色</span>
              <el-color-picker v-model="localValue[scope.index].navitembg" size="small" text="" />
            </div>
          </div>
        </div>
        <div class="scope-item">
          <span class="scope-item-label">选中样式</span>
          <div class="scope-item-body">
            <div class="scope-item-item">
              <span class="scope-item-item-label">文字颜色</span>
              <el-color-picker v-model="localValue[scope.index].navitemactivecolor" size="small" text="" />
            </div>
            <div class="scope-item-item">
              <span class="scope-item-item-label">背景颜色</span>
              <el-color-picker v-model="localValue[scope.index].navitemactivebg" size="small" text="" />
            </div>
          </div>
        </div>
        <div class="scope-item">
          <span class="scope-item-label">选中时导航栏</span>
          <div class="scope-item-body">
            <div class="scope-item-item">
              <span class="scope-item-item-label">背景色</span>
              <el-color-picker v-model="localValue[scope.index].navactivebg" size="small" text="" />
            </div>
            <div class="scope-item-item">
              <span class="scope-item-item-label">背景图</span>
              <SpImagePicker v-model="localValue[scope.index].navactivebgimg" size="small" text="" />
            </div>
          </div>
        </div>
        <draggable :list="scope.data.children" :options="dragOptions" style="width: 100%" handle=".icon-shoudongpaixu">
          <div v-for="(item, index) in scope.data.children" :key="index" class="scope-content"
            @click="handleClickWidget(scope.data, item, index)">
            <span>{{ item.wgtCustName || item.wgtName }}</span>
            <div class="scope-content-icon">
              <i class="icon-shoudongpaixu el-icon-sort" />
              <i class="el-icon-delete" @click.stop="handleDeleteWidget(scope.index, index)" />
            </div>
          </div>
        </draggable>
        <el-button type="primary" class="add-widget-btn" @click="handleAddWidget(scope.index)">
          添加挂件
        </el-button>
      </template>
    </CompDragList>
    <!--   显示配置 -->
    <el-drawer :title="drawerTitle" :append-to-body="false" :before-close="handleCloseDrawer"
      :visible.sync="showDrawer">
      <div v-if="activeWidget && hackReset">
        <CompPanel v-model="activeWidget" :info="getComponentAttr(activeWidget)" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import CompPanel from './comp_panel'
import draggable from 'vuedraggable'
import CompDragList from '../../comps/comp_dragList'
import gWgts from '../index'

export default {
  name: 'NavItem',
  components: { CompDragList, draggable, CompPanel },
  props: {
    value: Array,
    // 组件唯一标识
    uuid: String,
    animate: String
  },
  data() {
    return {
      dragOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      localValue: [],
      localScene: '1001',
      showDrawer: false,
      gWgtsArr: [],
      activeWidget: null,
      hackReset: false,
      drawerTitle: ''
    }
  },
  computed: {
    showSwitch() {
      return this.animate == 'horizontal'
    }
  },
  watch: {
    localValue: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      deep: true
    },
  },
  mounted() {
    this.localValue = cloneDeep(this.value)
    let scene = this.$route.query.scene || '1001'
    console.log(this.localValue, 'localValue')
    const wgts = gWgts[scene]
    Object.keys(wgts).forEach((index) => {
      if (!['contentpartition','locationmodule'].includes(wgts[index].name.toLowerCase())) {
        this.gWgtsArr.push(wgts[index])
      }
    })
  },
  methods: {
    handleChangeIsActive(index) {
      console.log(this.localValue[index].isActive)
      if (this.localValue[index].isActive) {
        this.localValue.forEach((item, key) => {
          if (key != index) {
            this.$set(this.localValue, key, {
              ...item,
              isActive: false
            })
          }
        })
      }
    },
    handleAddNavItem() {
      this.localValue.push({
        children: [],
        navItemName: '',
        navitemtype: 'text',
        imgUrl: '',
        navitemactiveimg: '',
        navitemcolor: '#666666',
        navitembg: '',
        navitemactivecolor: '#1A1A1A',
        navitemactivebg: '',
        navactivebg: '',
        navactivebgimg: '',
        isActive: false,
        configType: 'widget',
        tags: {
          type: '2',
          meber_tags: [],
          no_meber_tags: []
        }
      })
    },
    // 添加挂件
    async handleAddWidget(index) {
      const res = await this.$picker.widget({
        value: [],
        list: this.gWgtsArr,
        multiple: true
      })
      const arr = []
      res.data.forEach((wgt) => {
        const wgtInitParams = this.cloneDefaultField(wgt)
        arr.push({
          wgtName: wgt.wgtName,
          ...wgtInitParams
        })
      })
      Vue.set(this.localValue[index], 'children', this.localValue[index].children.concat(arr))
    },
    getComponentAttr(item) {
      const { wgtName, config } = this.gWgtsArr.find((wgt) => {
        return wgt.name.toLowerCase() == item.name.toLowerCase()
      })
      return {
        wgtName,
        ...config
      }
    },
    // 点击挂件编辑
    handleClickWidget(data, child, index) {
      this.drawerTitle = child.wgtName
      this.activeWidget = child
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
      this.showDrawer = true
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
      return compData
    },
    async handleDeleteWidget(index, cindex) {
      this.localValue[index].children.splice(cindex, 1)
    },
    async handledelLink(index) {
      this.$set(this.localValue[index], 'cusTom', null)
    },
    handleCloseDrawer() {
      this.activeWidget = null
      this.hackReset = false
      this.showDrawer = false
    }
  }
}
</script>