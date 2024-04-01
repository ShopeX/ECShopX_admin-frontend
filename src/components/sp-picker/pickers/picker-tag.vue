<style lang="scss">
.picker-tag {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .disableheadselection {
    > .cell .el-checkbox__inner {
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
  <div class="picker-tag">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入标签名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id" v-if="!IS_DISTRIBUTOR && !values" label="店铺名称:">
        <el-select v-model="formData.distributor_id" clearable placeholder="请选择">
          <el-option
            v-for="item in salesStatus"
            :key="item.distributor_id"
            :label="item.name"
            size="mini"
            :value="item.distributor_id"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      row-key="tag_id"
      reserve-selection
      url="/goods/tag"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'tag_id', width: 80 },
          { name: '标签名称', key: 'tag_name' },
          { name: '店铺名称', key: 'distributor_name' },
          { name: '描述', key: 'description' }
        ]
      }"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { IS_DISTRIBUTOR } from '@/utils'

export default {
  name: 'PickerTag',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择商品标签'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: '',
        distributor_id:""
      },
      salesStatus:[],
      multiple: this.value?.multiple ?? true,
      values:this.value?.distributor_id ?? null
    }
  },
  created() {
    this.getDistributorList()
  },
  methods: {
    async getDistributorList(){
      let params = {
        page:1,
        pageSize:500,
      }
      const { list} =
      await this.$api.marketing.getDistributorList(params)
      this.salesStatus = list

    },
    beforeSearch(params) {
      const { keywords,distributor_id } = this.formData
      if(IS_DISTRIBUTOR || this.values){
        params = {
          ...params,
          isPlatform:true,
          distributor_id:this.values
        }
      }else{
        params = {
          ...params,
          tag_source:'all'
        }
      }
     
      if (keywords ||  distributor_id) {
        params = {
          ...params,
          tag_name: keywords,
          distributor_id:distributor_id?distributor_id:this.values,
          tag_source:IS_DISTRIBUTOR?'':'all'
        }
      }
      if (this.value.params) {
        params = {
          ...params,
          ...this.value.params,
          tag_source:'all'
        }
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter((item) => this.value.data.includes(item.tag_id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
