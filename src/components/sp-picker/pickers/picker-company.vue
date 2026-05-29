<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-company {
  .sp-filter-form {
    margin-bottom: 0;
    .filter-form__bd {
      margin-left: 16px;
    }
  }
  .filter-tools {
    display: flex;
    align-items: center;
    padding: 8px;
    .el-cascader,
    .el-input {
      width: 196px;
      margin-right: 8px;
    }
  }
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="picker-company">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name">
        <el-input v-model="formData.name" :placeholder="$t('f5fd2a50.f47e27')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_sn">
        <el-input v-model="formData.enterprise_sn" :placeholder="$t('f5fd2a50.705f0a')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      url="/enterprise"
      :class="['company-finder', { 'no-multiple': !multiple }]"
      :fixed-row-action="true"
      :setting="companySetting"
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
import { cloneDeep } from 'lodash'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerCompany',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择企业'
  },
  props: ['value'],
  computed: {
    companySetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: t('f5fd2a50.f47e27'), key: 'name' },
          { name: t('f5fd2a50.705f0a'), key: 'enterprise_sn' },
          {
            name: t('63ede0f6.3fea7c'),
            key: 'disabled',
            width: 88,
            formatter: (value, row) => {
              if (
                row == null ||
                row.disabled === undefined ||
                row.disabled === null ||
                row.disabled === ''
              ) {
                return '—'
              }
              const d = row.disabled
              const isDisabled = d === '1' || d === 1 || d === true
              return isDisabled ? t('f15fc38a.710ad0') : t('f15fc38a.7854b5')
            }
          }
        ]
      }
    }
  },
  data() {
    return {
      type: 'pickerCompany',
      formData: {
        name: '',
        enterprise_sn: ''
      },
      regionArea: [],
      loading: false,
      localData: [],
      multiple: this.value.multiple ?? true,
      /** 当前表格页数据，用于 selection-change 时与跨页已选合并 */
      lastPageList: [],
      /** id -> 企业行（跨页累积） */
      selectedById: {}
    }
  },
  created() {
    this.$options.config.title = this.$t('f5fd2a50.0067d7')
    this.bootstrapSelectedFromValue(this.value)
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.bootstrapSelectedFromValue(val)
      }
    }
  },
  methods: {
    normalizeCompanyId(entry) {
      const id = typeof entry === 'object' && entry != null ? entry.id : entry
      const n = Number(id)
      return Number.isFinite(n) && n > 0 ? n : null
    },
    bootstrapSelectedFromValue(val) {
      if (!val || val.data === undefined) {
        return
      }
      const next = {}
      ;(val.data || []).forEach((entry) => {
        const id = this.normalizeCompanyId(entry)
        if (id == null) {
          return
        }
        const row = typeof entry === 'object' && entry != null ? { ...entry } : { id }
        const prev = this.selectedById[id]
        next[id] = prev && typeof prev === 'object' ? { ...prev, ...row } : row
      })
      this.selectedById = next
      const meta = val && typeof val === 'object' ? cloneDeep(val) : {}
      delete meta.data
      this.localVal = {
        ...meta,
        type: meta.type || 'pickerCompany',
        data: Object.values(next)
      }
    },
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData
      }
      if ('distributor_id' in this.value) {
        params.distributor_id = this.value.distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data || { list: [] }
      this.lastPageList = list || []
      const idSet = new Set(Object.keys(this.selectedById).map((k) => Number(k)))
      const selectRow = this.lastPageList.filter((item) => idSet.has(Number(item.id)))
      selectRow.forEach((row) => {
        const id = Number(row.id)
        this.$set(this.selectedById, id, { ...row })
      })
      const meta = this.value && typeof this.value === 'object' ? cloneDeep(this.value) : {}
      delete meta.data
      this.localVal = {
        ...meta,
        type: meta.type || 'pickerCompany',
        data: Object.values(this.selectedById)
      }
      const finderTable = this.$refs['finder'].$refs.finderTable.$refs.finderTable

      setTimeout(() => {
        finderTable.setSelection(selectRow)
      })
    },
    onSearch() {
      this.$refs.finder.refresh()
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
        })
      }
    },
    onSelectionChange(selection) {
      const list = this.lastPageList || []
      const pageIds = new Set(list.map((r) => Number(r.id)))
      const sel = Array.isArray(selection) ? selection : []
      const selIds = new Set(sel.map((r) => Number(r.id)))
      pageIds.forEach((id) => {
        if (!selIds.has(id)) {
          this.$delete(this.selectedById, id)
        }
      })
      sel.forEach((row) => {
        const id = Number(row.id)
        this.$set(this.selectedById, id, { ...row })
      })
      const meta = this.value && typeof this.value === 'object' ? cloneDeep(this.value) : {}
      delete meta.data
      this.localVal = {
        ...meta,
        type: meta.type || 'pickerCompany',
        data: Object.values(this.selectedById)
      }
      this.$emit('input', this.localVal)
    },
    getVal() {
      const rows = Object.values(this.selectedById).filter((r) => r != null && r.id != null)
      if (this.multiple) {
        const { num, islimitImgType = false } = this.value
        if (num) {
          if (rows.length > num) {
            throw new Error(this.$t('40cc67c2.a0672e') + num + this.$t('40cc67c2.f932ef'))
          }
        }
        if (islimitImgType) {
          let similarCount = 0
          rows.forEach((element) => {
            if (element.attribute_type == 'item_spec' && element.is_image == 'true') {
              similarCount += 1
            }
            if (similarCount > 1) {
              throw new Error(this.$t('40cc67c2.1979f8'))
            }
          })
        }
      }
      const meta = this.value && typeof this.value === 'object' ? cloneDeep(this.value) : {}
      delete meta.data
      return { ...meta, type: meta.type || 'pickerCompany', data: rows }
    }
  }
}
</script>
