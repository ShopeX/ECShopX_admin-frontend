<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFinder
      ref="finder"
      url="/goods/ranking/list"
      no-selection
      fixed-row-action
      row-actions-width="200px"
      :setting="finderSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    >
      <template #tableTop>
        <div class="action-container">
          <el-button type="primary" icon="plus" @click="openDialog()"> 添加榜单 </el-button>
        </div>
      </template>
    </SpFinder>

    <SpDialog
      ref="rankingDialogRef"
      v-model="ranking_dialog"
      :title="dialogTitle"
      :modal="false"
      width="800px"
      :form="rankingForm"
      :form-list="rankingFormList"
      @onSubmit="saveRanking"
    />
  </SpPage>
</template>

<script>
import { createRanking, editRanking, deleteRanking } from '@/api/ranking'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

export default {
  name: 'Ranking',
  components: {
    SpImagePicker
  },
  data() {
    return {
      ranking_dialog: false,
      dialogTitle: '新增榜单',
      mainCategoryList: [],
      rankingForm: {
        id: '',
        name: '',
        intro: '',
        sort: 0,
        show_time: [],
        rank_by: 'hot',
        background: '',
        apply_scope: 'main_category',
        scope_id: [],
        reason: {
          top1_intro: '',
          top2_intro: '',
          top3_intro: ''
        }
      },
      typeList: {
        category_ranking: '品类榜单',
        platform_ranking: '平台榜单'
      },
      rankingFormList: []
    }
  },
  async mounted() {
    await this.getMainCategory()
    this.initFormList()
  },
  computed: {
    finderSetting() {
      return {
        columns: [
          { name: '榜单ID', key: 'id', width: '100' },
          { name: '榜单名称', key: 'name' },
          {
            name: '管理分类',
            key: 'category_name',
            width: '150',
            formatter: (value, row, col) => {
              return value || '-'
            }
          },
          {
            name: '副标题',
            key: 'intro',
            width: '150',
            formatter: (value, row, col) => {
              return value || '-'
            }
          },
          {
            name: '排序优先级',
            key: 'sort',
            width: '120',
            formatter: (value, row, col) => {
              return value !== null && value !== undefined ? value : '-'
            }
          },
          {
            name: '展示开始时间',
            key: 'start_time',
            width: '180',
            formatter: (value, row, col) => {
              return this.formatDate(value)
            }
          },
          {
            name: '展示结束时间',
            key: 'end_time',
            width: '180',
            formatter: (value, row, col) => {
              return this.formatDate(value)
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'primary',
            action: {
              handler: (rows) => {
                this.openDialog(rows[0])
              }
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'danger',
            action: {
              handler: (rows) => {
                this.delRanking(rows[0].id)
              }
            }
          }
        ],
        search: [
          {
            name: '榜单名称',
            key: 'name',
            type: 'input',
            placeholder: '请输入榜单名称'
          },
          {
            name: '管理分类',
            key: 'category_name',
            type: 'input',
            placeholder: '请输入管理分类'
          },
          {
            name: '展示开始时间',
            key: 'start_time',
            type: 'date-range',
            start: 'start_time_start',
            end: 'start_time_end',
            placeholder: '请选择开始时间区间'
          },
          {
            name: '展示结束时间',
            key: 'end_time',
            type: 'date-range',
            start: 'end_time_start',
            end: 'end_time_end',
            placeholder: '请选择结束时间区间'
          }
        ]
      }
    }
  },
  methods: {
    initFormList() {
      this.rankingFormList = [
        {
          label: '榜单名称',
          type: 'input',
          key: 'name',
          defaultValue: '',
          placeholder: '请输入',
          required: true,
          message: '榜单名称不能为空'
        },
        {
          label: '副标题',
          type: 'input',
          key: 'intro',
          defaultValue: '',
          maxlength: 12,
          placeholder: '请输入'
        },
        {
          label: '优先级',
          type: 'number',
          key: 'sort',
          defaultValue: 0,
          placeholder: '请输入',
          min: 0,
          step: 1,
          required: true,
          message: '优先级不能为空'
        },
        {
          label: '展示时间',
          key: 'show_time',
          defaultValue: [],
          component({ disabled }, value) {
            return (
              <div class='preheat-time'>
                <el-date-picker
                  v-model={value['show_time']}
                  disabled={disabled}
                  type='datetimerange'
                  placeholder='选择日期范围'
                  start-placeholder='开始时间'
                  end-placeholder='结束时间'
                  format='yyyy-MM-dd HH:mm:ss'
                  value-format='timestamp'
                  default-time={['00:00:00', '23:59:59']}
                  style='width: 100%'
                />
              </div>
            )
          },
          disabled: false,
          required: true,
          validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error('请选择展示时间'))
            } else {
              callback()
            }
          }
        },
        {
          label: '排序规则',
          key: 'rank_by',
          type: 'radio',
          options: [
            {
              label: 'hot',
              name: '按热力值排序(销量*2000+PV*100)'
            }
          ],
          required: true,
          defaultValue: 'hot'
        },
        {
          label: '榜单背景图',
          key: 'background',
          type: 'image',
          defaultValue: '',
          placeholder: '请上传',
          required: true,
          message: '请上传榜单背景图',
          tip: '建议上传尺寸1125×1125，文件大小不超过200kb，支持上传文件格式为JPG、PNG、JPEG',
          component({ disabled }, value) {
            return <SpImagePicker v-model={value['background']} disabled={disabled} />
          }
        },
        {
          label: '商品范围',
          key: 'apply_scope',
          type: 'radio',
          options: [
            {
              label: 'main_category',
              name: '指定商品管理分类'
            }
          ],
          required: true,
          defaultValue: 'main_category'
        },
        {
          key: 'scope_id',
          label: '',
          defaultValue: [],
          component({ key, disabled }, value) {
            return (
              <el-cascader
                v-model={value['scope_id']}
                options={this.mainCategoryList}
                clearable
                show-all-levels={false}
                disabled={disabled}
                props={{ value: 'category_id', label: 'category_name', checkStrictly: true }}
                style='width: 100%'
              />
            )
          },
          validator: (rule, value, callback) => {
            const form = this.rankingForm
            if (form.apply_scope === 'main_category') {
              if (!value || value.length === 0) {
                callback(new Error('请选择商品管理分类'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '上榜理由',
          key: 'reason',
          defaultValue: {
            top1_intro: '',
            top2_intro: '',
            top3_intro: ''
          },
          placeholder: '请输入',
          component({ disabled }, value) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP1:</span>
                  <el-input v-model={value.reason.top1_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP2:</span>
                  <el-input v-model={value.reason.top2_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP3:</span>
                  <el-input v-model={value.reason.top3_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    initFormList() {
      this.rankingFormList = [
        {
          label: '榜单名称',
          type: 'input',
          key: 'name',
          defaultValue: '',
          placeholder: '请输入',
          required: true,
          message: '榜单名称不能为空'
        },
        {
          label: '副标题',
          type: 'input',
          key: 'intro',
          defaultValue: '',
          maxlength: 12,
          placeholder: '请输入'
        },
        {
          label: '优先级',
          type: 'number',
          key: 'sort',
          defaultValue: 0,
          placeholder: '请输入',
          min: 0,
          step: 1,
          required: true,
          message: '优先级不能为空'
        },
        {
          label: '展示时间',
          key: 'show_time',
          defaultValue: [],
          component: ({ disabled }, value) => {
            return (
              <div class='preheat-time'>
                <el-date-picker
                  v-model={value['show_time']}
                  disabled={disabled}
                  type='datetimerange'
                  placeholder='选择日期范围'
                  start-placeholder='开始时间'
                  end-placeholder='结束时间'
                  format='yyyy-MM-dd HH:mm:ss'
                  value-format='timestamp'
                  default-time={['00:00:00', '23:59:59']}
                  style='width: 100%'
                />
              </div>
            )
          },
          disabled: false,
          required: true,
          validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error('请选择展示时间'))
            } else {
              callback()
            }
          }
        },
        {
          label: '排序规则',
          key: 'rank_by',
          type: 'radio',
          options: [
            {
              label: 'hot',
              name: '按热力值排序(销量*2000+PV*100)'
            }
          ],
          required: true,
          defaultValue: 'hot'
        },
        {
          label: '榜单背景图',
          key: 'background',
          type: 'image',
          defaultValue: '',
          placeholder: '请上传',
          required: true,
          message: '请上传榜单背景图',
          tip: '建议上传尺寸1125×1125，文件大小不超过200kb，支持上传文件格式为JPG、PNG、JPEG',
          component: ({ disabled }, value) => {
            return <SpImagePicker v-model={value['background']} disabled={disabled} />
          }
        },
        {
          label: '商品范围',
          key: 'apply_scope',
          type: 'radio',
          options: [
            {
              label: 'main_category',
              name: '指定商品管理分类'
            }
          ],
          required: true,
          defaultValue: 'main_category'
        },
        {
          key: 'scope_id',
          label: '',
          defaultValue: [],
          component: ({ key, disabled }, value) => {
            return (
              <el-cascader
                v-model={value['scope_id']}
                options={this.mainCategoryList}
                clearable
                show-all-levels={false}
                disabled={disabled}
                props={{ value: 'category_id', label: 'category_name', checkStrictly: true }}
                style='width: 100%'
              />
            )
          },
          validator: (rule, value, callback) => {
            const form = this.rankingForm
            if (form.apply_scope === 'main_category') {
              if (!value || value.length === 0) {
                callback(new Error('请选择商品管理分类'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '上榜理由',
          key: 'reason',
          defaultValue: {
            top1_intro: '',
            top2_intro: '',
            top3_intro: ''
          },
          placeholder: '请输入',
          component: ({ disabled }, value) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP1:</span>
                  <el-input v-model={value.reason.top1_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP2:</span>
                  <el-input v-model={value.reason.top2_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '50px' }}>TOP3:</span>
                  <el-input v-model={value.reason.top3_intro} type='input' placeholder='请输入' disabled={disabled} />
                </div>
              </div>
            )
          }
        }
      ]
    },
    dateStrToTimeStamp(str) {
      if (!str) return ''
      return Math.floor(Date.parse(new Date(str)) / 1000)
    },
    beforeSearch(params) {
      // 处理开始时间区间
      if (params.start_time_start && params.start_time_end) {
        params.start_time_start = this.dateStrToTimeStamp(params.start_time_start)
        params.start_time_end = this.dateStrToTimeStamp(params.start_time_end + ' 23:59:59')
      } else {
        delete params.start_time_start
        delete params.start_time_end
      }
      
      // 处理结束时间区间
      if (params.end_time_start && params.end_time_end) {
        params.end_time_start = this.dateStrToTimeStamp(params.end_time_start)
        params.end_time_end = this.dateStrToTimeStamp(params.end_time_end + ' 23:59:59')
      } else {
        delete params.end_time_start
        delete params.end_time_end
      }
      
      // 移除空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      return params
    },
    async getMainCategory() {
      try {
        const res = await this.$api.goods.getCategory({ is_main_category: true })
        console.log(res)
        // 处理返回数据格式，可能是 res 或 res.data.data
        const categoryData = res?.data?.data || res || []
        this.mainCategoryList = categoryData
      } catch (error) {
        console.error('获取管理分类失败:', error)
        this.mainCategoryList = []
      }
    },
    openDialog(detail = null) {
      this.ranking_dialog = true
      if (detail) {
        // 编辑模式，填充数据
        this.rankingForm = {
          id: detail.id,
          name: detail.name || '',
          intro: detail.intro || '',
          sort: detail.sort || 0,
          show_time: detail.start_time && detail.end_time 
            ? [detail.start_time * 1000, detail.end_time * 1000] 
            : [],
          rank_by: detail.rank_by || 'hot',
          background: detail.background || '',
          apply_scope: detail.apply_scope || 'main_category',
          scope_id: detail.scope_id ? (Array.isArray(detail.scope_id) ? detail.scope_id : [detail.scope_id]) : [],
          reason: {
            top1_intro: detail.top1_intro || '',
            top2_intro: detail.top2_intro || '',
            top3_intro: detail.top3_intro || ''
          }
        }
        this.dialogTitle = '编辑榜单'
      } else {
        // 新增模式，重置表单
        this.dialogTitle = '新增榜单'
        this.rankingForm = {
          id: '',
          name: '',
          intro: '',
          sort: 0,
          show_time: [],
          rank_by: 'hot',
          background: '',
          apply_scope: 'main_category',
          scope_id: [],
          reason: {
            top1_intro: '',
            top2_intro: '',
            top3_intro: ''
          }
        }
      }
    },
    async saveRanking() {
      // 处理展示时间，转换为时间戳
      let start_time = ''
      let end_time = ''
      if (this.rankingForm.show_time && this.rankingForm.show_time.length === 2) {
        start_time = Math.floor(this.rankingForm.show_time[0] / 1000)
        end_time = Math.floor(this.rankingForm.show_time[1] / 1000)
      }

      // 处理管理分类ID
      const scope_id = Array.isArray(this.rankingForm.scope_id) && this.rankingForm.scope_id.length > 0
        ? this.rankingForm.scope_id[this.rankingForm.scope_id.length - 1]
        : ''

      const params = {
        name: this.rankingForm.name.trim(),
        intro: this.rankingForm.intro || '',
        sort: this.rankingForm.sort || 0,
        start_time,
        end_time,
        rank_by: this.rankingForm.rank_by || 'hot',
        background: this.rankingForm.background || '',
        apply_scope: this.rankingForm.apply_scope || 'main_category',
        scope_id,
        top1_intro: this.rankingForm.reason?.top1_intro || '',
        top2_intro: this.rankingForm.reason?.top2_intro || '',
        top3_intro: this.rankingForm.reason?.top3_intro || ''
      }

      try {
        if (this.dialogTitle === '编辑榜单') {
          await editRanking(this.rankingForm.id, params)
        } else {
          await createRanking(params)
        }
        this.ranking_dialog = false
        this.$refs.finder.refresh(true)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } catch (error) {
        console.error(error)
        this.$message.error('保存失败')
      }
    },
    delRanking(id) {
      this.$confirm('确认删除该榜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRanking(id)
            .then(() => {
              this.$message({ type: 'success', message: '删除成功' })
              this.$refs.finder.refresh(true)
            })
            .catch((error) => {
              console.error(error)
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    },
    handleCancel() {
      this.ranking_dialog = false
    },
    formatDate(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style lang="scss" scoped>
.action-container {
  margin-bottom: 20px;
}
</style>
