<template>
  <div class="wgt-classify-comp-data">
    <div class="flex flex-col">
      <el-radio-group v-model="localValue.type" size="small" @change="handleChangeType">
        <el-radio-button label="select">按选择读取子集</el-radio-button>
        <el-radio-button label="category">指定分类</el-radio-button>
      </el-radio-group>
      <el-cascader
        v-if="localValue.type === 'select'"
        v-model="localValue.category.category_id"
        :options="options"
        :props="props"
        separator="-"
        size="mini"
        @change="handleChange"
      />
      <div v-else class="category-list">
        <CompDragList
          v-model="localValue.data"
          type="text"
          btn-text="添加导航项"
          :is-edit="true"
          :is-delete="true"
          :is-move="true"
          @onAddItem="handleAddNavItem"
          @edit="handleEditNavItem"
          @onDelete="handleDeleteNavItem"
          @move="handleMove"
        >
          <template slot="title" slot-scope="scope">
            <span class="scope-item-label">{{
              scope.data.current_category_name || scope.data.category_name
            }}</span>
          </template>
          <template slot="body" slot-scope="scope">
            <div class="scope-item-wrapper">
              <div class="scope-item">
                <span class="scope-item-label">自定义名</span>
                <div class="scope-item-body">
                  <el-input
                    v-model="localValue.data[scope.index].current_category_name"
                    size="mini"
                    placeholder="分类名称"
                  />
                </div>
              </div>
              <div v-if="!VERSION_STANDARD()" class="scope-item">
                <span class="scope-item-label">圈选店铺</span>
                <CompButton
                  placeholder="设置店铺"
                  format="{0}个店铺"
                  :value="localValue.data[scope.index].store_ids.length"
                  :view-btn="false"
                  @click="onSelectShop(scope.index)"
                  @remove="onRemoveShop(scope.index)"
                />
              </div>
            </div>
          </template>
        </CompDragList>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { VERSION_STANDARD } from '@/utils'
import CompDragList from '../../comps/comp_dragList'
import CompButton from '../../comps/comp-button'

export default {
  name: 'AttrData',
  components: { CompDragList, CompButton },
  props: {
    dataType: {
      type: String,
      default: 'manage'
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children',
        checkStrictly: true
      },
      selectValue: '',
      localValue: {
        type: 'select',
        data: [],
        category: {
          category_id: ''
        }
      }
    }
  },
  computed: {
    options() {
      return this.flattenToTwoLevels(this.list)
    }
  },
  watch: {
    dataType: {
      handler(newVal) {
        this.getList()
      },
      immediate: true
    }
  },
  created() {
    this.$set(this.localValue, 'type', this.value.type)
    this.$set(this.localValue, 'category', this.value.category)
    this.$set(this.localValue, 'data', this.value.data)
  },
  methods: {
    flattenToTwoLevels(data) {
      // 只保留两级联动数据
      const result = []

      if (!Array.isArray(data)) {
        return result
      }

      // 遍历第一级数据
      data.forEach((item) => {
        const firstLevel = {
          category_id: item.category_id,
          category_name: item.category_name,
          image_url: item.image_url,
          children: []
        }

        // 处理第二级数据
        if (Array.isArray(item.children)) {
          item.children.forEach((child) => {
            firstLevel.children.push({
              category_id: child.category_id,
              category_name: child.category_name,
              image_url: child.image_url
            })
          })
        }

        result.push(firstLevel)
      })

      return result
    },
    handleChangeType() {
      this.$emit('input', this.localValue)
    },
    async getList() {
      this.list = []
      this.$set(this.localValue, 'data', [])
      if (this.dataType == 'manage') {
        const res = await api.goods.getCategory({
          // parent_id: 0,
          is_main_category: true
        })
        this.list = res
        console.log(this.list, 'manage')
      }
      if (this.dataType == 'sales') {
        const res = await api.goods.getCategory({
          // parent_id: 0
        })
        this.list = res
        console.log(this.list, 'sales')
      }
    },
    handleChange(value) {
      // 获取选中项的完整数据
      if (value && value.length > 0) {
        // 查找选中的分类
        const categoryId = value[value.length - 1]
        let selectedCategory = null

        // 在一级分类中查找
        for (const category of this.list) {
          if (category.category_id === categoryId) {
            selectedCategory = category
            break
          }

          // 在二级分类中查找
          if (category.children) {
            for (const child of category.children) {
              if (child.category_id === categoryId) {
                selectedCategory = child
                break
              }
            }
            if (selectedCategory) break
          }
        }

        console.log('选中的分类数据:', selectedCategory)
        this.$emit('input', {
          type: this.localValue.type,
          category: selectedCategory,
          data: []
        })
        this.$emit('change', {
          type: this.localValue.type,
          category: selectedCategory,
          data: []
        })
      }
    },
    async handleAddNavItem() {
      let res = null
      if (this.dataType === 'manage') {
        res = await this.$picker.category({
          is_main_category: true,
          multiple: false
        })
      } else {
        res = await this.$picker.saleCategory({
          is_main_category: false
        })
      }
      const category_id = res.data[0].id //分类id
      const category_name = res.data[0].title //分类名称
      const image_url = res.data[0].image_url //分类图片
      console.log(res.data, 'res')
      this.localValue.data.push({
        category_id,
        category_name,
        image_url,
        current_category_name: '',
        store_ids: []
      })

      this.$emit('input', {
        type: this.localValue.type,
        category: {
          category_id: ''
        },
        data: this.localValue.data
      })
    },
    async onSelectShop(index) {
      const res = await this.$picker.shop({
        multiple: true,
        data: this.localValue.data[index].store_ids
      })
      console.log(res, 'res')
      const ids = res.data.map((item) => item.distributor_id)
      this.localValue.data[index].store_ids = ids

      this.$emit('input', {
        type: this.localValue.type,
        category: {
          category_id: ''
        },
        data: this.localValue.data
      })
    },
    onRemoveShop(index) {
      this.localValue.data[index].store_ids = []
      this.$emit('input', {
        type: this.localValue.type,
        category: {
          category_id: ''
        },
        data: this.localValue.data
      })
    },
    // 编辑导航项：重新选择分类
    async handleEditNavItem({ item, index }) {
      let res = null
      if (this.dataType === 'manage') {
        res = await this.$picker.category({
          is_main_category: true,
          multiple: false,
          data: item.category_id
        })
      } else {
        res = await this.$picker.saleCategory({
          is_main_category: false,
          data: item.category_id
        })
      }
      if (!res || !res.data || !res.data[0]) return
      const category_id = res.data[0].id
      const category_name = res.data[0].title
      const image_url = res.data[0].image_url
      this.$set(this.localValue.data, index, {
        ...item,
        category_id,
        category_name,
        image_url,
        current_category_name: category_name
      })
      this.$emit('input', {
        type: this.localValue.type,
        category: this.localValue.category,
        data: this.localValue.data
      })
    },
    // 删除导航项（组件内部已 splice，此处同步并通知父组件）
    handleDeleteNavItem() {
      this.$emit('input', {
        type: this.localValue.type,
        category: this.localValue.category,
        data: this.localValue.data
      })
    },
    // 拖拽排序结束后同步到父组件
    handleMove() {
      this.$emit('input', {
        type: this.localValue.type,
        category: this.localValue.category,
        data: this.localValue.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wgt-classify-comp-data {
  .flex-col {
    flex-direction: column;
  }
  .category-list {
    padding-top: 10px;

    .scope-item-wrapper {
      padding: 10px;
    }
  }

  .scope-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .scope-item-label {
      font-size: 12px;
      color: #999;
      width: 80px;
    }
  }
}
</style>
<style lang="scss">
.wgt-classify-comp-data {
  .category-list {
    margin-left: -150px;
    .drag-list {
      border: 1px solid #dcdcdc;
      border-radius: 4px;

      .item-hd {
        background-color: #f8f8f8;
        box-sizing: border-box;
        padding: 5px 10px;
      }
    }
  }
}
</style>
