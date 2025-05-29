<template>
  <div>
    <SpDialog
      v-model="value"
      width="1000px"
      @input="$emit('input', $event)"
      class="comp-update-logs"
      title="更新日志"
      :isShowFooter="false"
      :modal="false"
      :form="activityForm"
      :form-list="activityFormList"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import { PROMOTION_TYPE_MAP } from '@/consts'
import moment from 'moment'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activityForm: {},
      activityFormList: [
        {
          component: ({ key }, value) => {
            return (
              <SpFinder
                data={this.list}
                show-pager={false}
                no-selection={true}
                setting={this.setting}
              />
            )
          }
        }
      ]
    }
  },
  computed: {
    setting() {
      return createSetting({
        columns: [
          { name: '操作类型', key: 'operation_type' },
          {
            name: '操作内容',
            key: 'operation_content',
            width: 400,
            render: (h, { row }) => {
              return (
                <div>
                  {!row.change_details && <span>{row.operation_content}</span>}
                  {row.change_details?.length > 0 && <SpFinder
                    class='inner-finder'
                    data={row.change_details}
                    show-pager={false}
                    no-selection={true}
                    setting={this.innerSetting}
                  />}
                </div>
              )
            }
          },
          {
            name: '操作人',
            key: 'operator'
          },
          {
            name: '时间',
            key: 'operation_time',
            render: (h, { row }) => {
              return <span>{moment(row.operation_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
          }
        ]
      })
    },
    innerSetting() {
      return createSetting({
        columns: [
          { name: '修改页', key: 'modified_field' },
          { name: '修改前', key: 'before_value' },
          { name: '修改后', key: 'after_value' }
        ]
      })
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.comp-update-logs {
  .el-dialog__body .el-form {
    margin: 0 !important;
  }
}
</style>
<style lang="scss">
.inner-finder {
  .sp-finder-bd {
    .el-table__header-wrapper {
      th {
        background: #edf0f3 !important;
      }
    }
  }
}
.comp-update-logs .el-dialog__body .el-form {
  margin-right: 0px;
}
</style>
