<style lang="scss">
.picker-sale-category {
  .cascader-header {
    display: flex;
    background-color: #f0f2f5;

    .hd {
      color: #222;
      width: 180px;
      padding: 6px 20px;
      border-left: 1px solid #e8e8e8;
    }
  }

  .el-cascader-panel {
    height: 526px;
    border-radius: 0;
  }

  .el-cascader-menu__wrap {
    height: 526px;
  }

  &.check-strictly {
    .el-scrollbar {
      &:not(:first-child) {
        .el-checkbox {
          display: none;
        }
      }
    }
  }
}
</style>
<template>
  <div :class="['picker-sale-category', { 'check-strictly': value?.checkStrictly }]">
    <div class="cascader-header">
      <div class="hd">一级</div>
      <div class="hd">二级</div>
      <div class="hd">三级</div>
    </div>
    <el-cascader-panel v-model="localValue" :options="options" :props="{
      ...props,
      multiple: multiple,
    }" @change="onChangeCascader" />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { getRegionauthId } from '@/utils'
export default {
  name: 'PickerSaleCategory',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择销售分类'
  },
  props: ['value'],
  data() {
    return {
      props: {
        label: 'category_name',
        value: 'category_id',
        children: 'children',
        checkStrictly: true
      },
      options: [],
      multiple: this.value?.multiple ?? false,
      localValue: []
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { data } = this.value
      const res = await this.$api.goods.getCategory({
         regionauth_id: getRegionauthId()
      })
      this.options = res
      this.localValue = this.findPathById(res, data)
    },
    findPathById(list, v, path) {
      if (typeof path === 'undefined') {
        path = []
      }
      // 如果v是数组，需要收集所有匹配的路径
      if (this.value?.multiple) {
        const allPaths = [];
        const ids = v.map(item => item.id);
        for (let i = 0; i < list.length; i++) {
          let tempPath = [...path];
          tempPath.push(list[i].category_id);
          if (ids.includes(list[i].category_id)) {
            console.log(tempPath, 'tempPath');
            allPaths.push(tempPath);
          }
          if (list[i].children) {
            const childPaths = this.findPathById(list[i].children, v, tempPath);
            if (childPaths && childPaths.length) {
              allPaths.push(...childPaths);
            }
          }
        }
        return allPaths.length ? allPaths : null;
      } else {
        for (let i = 0; i < list.length; i++) {
          let tempPath = [...path]
          tempPath.push(list[i].category_id)
          if (list[i].category_id == v) {
            return tempPath
          }
          if (list[i].children) {
            const result = this.findPathById(list[i].children, v, tempPath)
            if (result) {
              return result
            }
          }
        }
      }
    },
    getNodeInfo(list, e, index) {
      const node = list.find(({ category_id }) => category_id == e[index])
      if (index < e.length - 1) {
        return this.getNodeInfo(node.children, e, ++index)
      } else {
        const { category_id, category_name } = node
        return {
          id: category_id,
          title: category_name
        }
      }
    },
    onChangeCascader(e) {
      if (this.multiple) {
        const nodeInfoList = e.map(item => this.getNodeInfo(this.options, item, 0))
        this.updateVal(nodeInfoList)
      } else {
        const nodeInfo = this.getNodeInfo(this.options, e, 0)
        this.updateVal([nodeInfo])
      }
    }
  }
}
</script>
