<style lang="scss" scoped>
.content-part-nav-item {
  margin-left: -80px;
  width: calc(100% + 80px);

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
}
</style>
<style lang="scss">
.content-part-nav-item {
  .item-bd {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .scope-item-item {

    .placeholder,
    .image-item {
      width: 32px !important;
      height: 32px !important;

      .icon-camera {
        font-size: 12px;
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
}
</style>

<template>
  <div class="content-part-nav-item">
    <CompDragList v-model="localValue" type="text" btn-text="添加导航项" :show-title="true" title="导航项"
      @onAddItem="handleAddNavItem">
      <template slot="body" slot-scope="scope">
        <div class="scope-item">
          <span class="scope-item-label">导航名称</span>
          <div class="scope-item-body">
            <el-input v-model="localValue[scope.index].navItemName" size="small" placeholder="导航项名称" />
          </div>
        </div>
        <div class="scope-item">
          <span class="scope-item-label">导航项形式</span>
          <div class="scope-item-body">
            <el-radio-group v-model="localValue[scope.index].navitemtype" size="small" placeholder="请选择导航项形式">
              <el-radio label="text">文字</el-radio>
              <el-radio label="image">图片 </el-radio>
            </el-radio-group>
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
            <span @click="handleClickWidget(scope.data, item, index)">{{ item.wgtName }}</span>
            <div class="scope-content-icon">
              <i class="icon-shoudongpaixu el-icon-sort" />
              <i class="el-icon-delete" @click.stop="handleDeleteWidget(scope.index, index)" />
            </div>
          </div>
        </draggable>
        <el-button type="primary" @click="handleAddWidget(scope.index)">添加挂件</el-button>
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
import CompPanel from '@/view/decorate/comps/comp_panel'
import draggable from 'vuedraggable'
import CompDragList from '../../comps/comp_dragList'
import gWgts from '../index'

// import { transformSelectTem, getWgts } from "../../utils"
export default {
  name: 'NavItem',
  components: { CompDragList, draggable, CompPanel },
  props: {
    value: Array,
    // 组件唯一标识
    uuid: String
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
  watch: {
    localValue: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.localValue = cloneDeep(this.value)
    const wgts = gWgts[this.localScene]
    Object.keys(wgts).forEach((index) => {
      if (wgts[index].name != 'Contentpart') {
        this.gWgtsArr.push(wgts[index])
      }
    })
  },
  methods: {
    handleAddNavItem() {
      this.localValue.push({
        children: [],
        navItemName: '',
        navitemtype: 'text',
        imgUrl: '',
        navitemactiveimg: '',
        navitemcolor: '#666666',
        navitembg: '#ffffff',
        navitemactivecolor: '#1A1A1A',
        navitemactivebg: '#ffffff',
        navactivebg: '#ffffff',
        navactivebgimg: '',
        navitempaddedlr: 0,
        navitemradius: 0,
        navitemborder: false,
        leftimgUrl: '',
        rightimgUrl: ''
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
        // 是否存在挂件
        const wgtInitParams = this.cloneDefaultField(wgt)
        // 默认值
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
    // 点击挂件
    handleClickWidget(data, child, index) {
      this.drawerTitle = child.wgtName
      this.activeWidget = child
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true // 重建组件
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
