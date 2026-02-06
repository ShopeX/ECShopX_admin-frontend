<style lang="scss">
    .picker-shop {
      .sp-filter-form {
        padding: 8px 8px 0px 8px;
      }
    
      .sp-finder-hd {
        display: none;
      }
    
      .disableheadselection {
        >.cell .el-checkbox__inner {
          display: none;
        }
      }
    
      .el-pagination {
        margin: 0;
        padding: 10px;
      }
    }
    </style>
    <template>
      <div class="picker-shop">
        <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="keywords" label="店铺名称">
            <el-input v-model="formData.keywords" placeholder="请输入店铺名称" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="shop_code" label="店铺号">
            <el-input v-model="formData.shop_code" placeholder="请输入店铺号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="is_valid" label="状态">
            <el-select v-model="formData.is_valid" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="启用" value="true" />
              <el-option label="禁用" value="false" />
              <el-option label="废弃" value="delete" />
            </el-select>
          </SpFilterFormItem>
        </SpFilterForm>
        <SpFinder ref="finder" :class="['shop-finder', { 'no-multiple': !multiple }]" reserve-selection :other-config="{
          'max-height': 460,
          'header-cell-class-name': cellClass
        }" url="/distributors" :fixed-row-action="true" :setting="setting" :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }" row-key="distributor_id" @select="onSelect" @select-all="handleSelectAll" />
      </div>
    </template>
    
    <script>
    import { createSetting } from '@shopex-ui/finder'
    import { cloneDeep } from 'lodash'
    import district from '@/common/district.json'
    import BasePicker from './base'
    import PageMixin from '../mixins/page'
    export default {
      name: 'PickerShop',
      extends: BasePicker,
      mixins: [PageMixin],
      config: {
        title: '选择店铺'
      },
      props: ['value'],
      data() {
        return {
          regionauthList: [],
          formData: {
            regionauth_id: '',
            keywords: '',
            shop_code: '',
            is_valid: ''
          },
          district,
          regionArea: [],
          loading: false,
          multiple: this.value?.multiple ?? true,
          rowKey: 'distributor_id',
          localSelection: []
        }
      },
      computed: {
        setting() {
          const columns = [
            { name: '店铺名称', key: 'name' },
            {
              name: '店铺类型',
              key: 'distribution_type',
              width: 100,
              formatter: (value, row, col) => {
                if (value == '1') {
                  return '加盟'
                } else if (value == '0') {
                  return '自营'
                }
              },
              visible: this.VERSION_PLATFORM
            },
            {
              name: '店铺状态',
              key: 'is_valid',
              formatter: (value) =>
                (value === 'true' && '启用') ||
                (value === 'false' && '禁用') ||
                (value === 'delete' && '废弃') ||
                ''
            },
            { name: '店铺号', key: 'shop_code' },
            { name: '店铺地址', key: 'store_address' }
          ]
          return createSetting({
            columns: columns.filter(({ visible }) => visible !== false)
          })
        }
      },
      created() {
        console.log(this.value, 'this.value')
        this.localSelection = cloneDeep(this.value.data) || []
        // this.fetch()
      },
      methods: {
        beforeSearch(params) {
          params = {
            ...params,
            name: this.formData.keywords,
            shop_code: this.formData.shop_code,
            distribution_type: this.value?.distribution_type,
            is_valid: this.formData.is_valid || undefined,
            ...(this.value?.params || {}),
          }
    
          if (this.value?.regionauth_id) {
            params.regionauth_id = this.value?.regionauth_id
          }
          return params
        },
        afterSearch(response) {
          const { list } = response.data.data
          if (this.localSelection.length > 0) {
            const { finderTable } = this.$refs.finder.$refs
            const ids = this.localSelection.map((m) => m[this.rowKey])
            const selectRows = list.filter((item) => ids.includes(item[this.rowKey]))
            setTimeout(() => {
              finderTable.$refs.finderTable.setSelection(selectRows)
            })
          }
        },
        onSearch() {
          this.$refs.finder.refresh(true)
        },
        onSelect(selection, row) {
          if (!this.multiple) {
            const { finderTable } = this.$refs.finder.$refs
            finderTable.clearSelection()
            this.localSelection = [row]
            this.$nextTick(() => {
              finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
            })
          } else {
            const isAdd = selection.includes(row)
            const idx = this.localSelection.findIndex((f) => f[this.rowKey] === row[this.rowKey])
    
            if (isAdd && idx === -1) {
              this.localSelection.push(row)
            } else if (!isAdd && idx !== -1) {
              this.localSelection.splice(idx, 1)
            }
          }
          this.localSelection = this.localSelection.filter(item => item[this.rowKey])
          this.updateVal(this.localSelection)
        },
        /**
          * @description 全选只针对当前页 那么在状态改变的时候 应该不考虑未来的选中数据
          * @description 循环调用 onSelect 方法保存或删除当前页选中数据
          * @param list 当前页勾选数据 如果localSelection存在未来页数据 那么页码切换的时候 list中也会有
          */
        async handleSelectAll(list) {
          const { finderTable } = this.$refs.finder.$refs
          const currentPageData = finderTable.$refs.finderTable.list
          const currentPageDataIds = currentPageData.map((m) => m[this.rowKey])
    
          // 获取当前页面已选中的数据
          const currentPageSelectList = list.filter((item) => currentPageDataIds.includes(item[this.rowKey]))
    
          // 先移除当前页的所有选中项
          this.localSelection = this.localSelection.filter(item => !currentPageDataIds.includes(item[this.rowKey]))
    
          // 如果有选中项，则添加到 localSelection
          if (currentPageSelectList.length > 0) {
            this.localSelection.push(...currentPageData)
          }
    
          this.updateVal(this.localSelection)
    
          // 更新表格选中状态
          this.$nextTick(() => {
            if (currentPageSelectList.length > 0) {
              finderTable.$refs.finderTable.setSelection(currentPageData)
            } else {
              finderTable.$refs.finderTable.clearSelection()
            }
          })
        },
      }
    }
    </script>
    