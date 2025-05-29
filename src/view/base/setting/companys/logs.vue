<template>
  <div class="">
    <SpFinder
      ref="finder"
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="company/operatorlogs"
      no-selection
    />
    <el-dialog title="操作日志详情" :visible.sync="dialogVisible" width="50%">
      <div>
        <pre style="white-space: pre-wrap; word-break: break-word"
          >{{ row }}
        </pre>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { createSetting } from '@shopex/finder'

const tableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'operator_name', name: '操作内容', placeholder: '请输入' },
      { key: 'username', name: '操作人名称', placeholder: '请输入' },
      { key: 'login_name', name: '账号', placeholder: '请输入' }
    ],
    columns: [
      {
        name: '操作',
        key: 'option',
        width: '160',
        render(h, scope) {
          return (
            <el-button className='actBtn' type='text' onClick={() => vm.handleDetail(scope.row)}>
              详情
            </el-button>
          )
        }
      },
      { name: '操作内容', key: 'operator_name', width: '160' },
      { name: '操作者', key: 'username' },
      { name: 'IP', key: 'ip', width: '160' },
      { name: '操作人账号', key: 'login_name', width: '160' },
      {
        name: '角色',
        key: 'role_name',
        width: '160',
        render(h, { row }) {
          return row?.role_name?.map((item) => {
            return (
              <el-tag key={item} size='mini' type='warning'>
                {item}
              </el-tag>
            )
          })
        }
      },
      {
        name: '区域',
        key: 'area',
        render(_, { row }) {
          return row?.regionauth_ids?.map((item) => {
            return (
              <el-tag key={item.regionauth_id} size='mini' type='warning'>
                {item.regionauth_name}
              </el-tag>
            )
          })
        }
      },
      {
        name: '时间',
        key: 'created',
        width: '160',
        render(h, scope) {
          return <span>{moment(scope?.row?.created * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      }
    ]
  })

export default {
  data() {
    return {
      setting: tableSchema(this),
      dialogVisible: false,
      row: null
    }
  },
  methods: {
    beforeSearch(params) {
      return {
        ...params
      }
    },
    handleDetail(row) {
      console.log(row)
      this.dialogVisible = true
      this.row = JSON.stringify(row, null, 2)
    }
  }
}
</script>
<style></style>
