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
          <el-button type="primary" icon="plus" @click="openDialog()">
            {{ $t('92f7db48.cf02c6') }}
          </el-button>
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
      dialogTitle: '',
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
      typeList: {},
      rankingFormList: []
    }
  },
  async mounted() {
    this.dialogTitle = this.$t('92f7db48.81cfbe')
    this.typeList = {
      category_ranking: this.$t('92f7db48.4abc55'),
      platform_ranking: this.$t('92f7db48.b7986d')
    }
    await this.getMainCategory()
    this.initFormList()
  },
  computed: {
    finderSetting() {
      return {
        columns: [
          { name: this.$t('92f7db48.962772'), key: 'id', width: '100' },
          { name: this.$t('92f7db48.7cdb40'), key: 'name' },
          {
            name: this.$t('92f7db48.b3ed9f'),
            key: 'category_name',
            width: '150',
            formatter: (value, row, col) => {
              return value || '-'
            }
          },
          {
            name: this.$t('92f7db48.72cf37'),
            key: 'intro',
            width: '150',
            formatter: (value, row, col) => {
              return value || '-'
            }
          },
          {
            name: this.$t('92f7db48.5f2e60'),
            key: 'sort',
            width: '120',
            formatter: (value, row, col) => {
              return value !== null && value !== undefined ? value : '-'
            }
          },
          {
            name: this.$t('92f7db48.c7b42d'),
            key: 'start_time',
            width: '180',
            formatter: (value, row, col) => {
              return this.formatDate(value)
            }
          },
          {
            name: this.$t('92f7db48.a9fe1c'),
            key: 'end_time',
            width: '180',
            formatter: (value, row, col) => {
              return this.formatDate(value)
            }
          }
        ],
        actions: [
          {
            name: this.$t('92f7db48.95b351'),
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
            name: this.$t('92f7db48.2f4aad'),
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
            name: this.$t('92f7db48.7cdb40'),
            key: 'name',
            type: 'input',
            placeholder: this.$t('92f7db48.270f1f')
          },
          {
            name: this.$t('92f7db48.b3ed9f'),
            key: 'category_name',
            type: 'input',
            placeholder: this.$t('92f7db48.1ff189')
          },
          {
            name: this.$t('92f7db48.c7b42d'),
            key: 'start_time',
            type: 'date-range',
            start: 'start_time_start',
            end: 'start_time_end',
            placeholder: this.$t('92f7db48.819bac')
          },
          {
            name: this.$t('92f7db48.a9fe1c'),
            key: 'end_time',
            type: 'date-range',
            start: 'end_time_start',
            end: 'end_time_end',
            placeholder: this.$t('92f7db48.5ca388')
          }
        ]
      }
    }
  },
  methods: {
    initFormList() {
      this.rankingFormList = [
        {
          label: this.$t('92f7db48.7cdb40'),
          type: 'input',
          key: 'name',
          defaultValue: '',
          placeholder: this.$t('92f7db48.02cc4f'),
          required: true,
          message: this.$t('92f7db48.7adf8c')
        },
        {
          label: this.$t('92f7db48.72cf37'),
          type: 'input',
          key: 'intro',
          defaultValue: '',
          maxlength: 12,
          placeholder: this.$t('92f7db48.02cc4f')
        },
        {
          label: this.$t('92f7db48.ee8ecb'),
          type: 'number',
          key: 'sort',
          defaultValue: 0,
          placeholder: this.$t('92f7db48.02cc4f'),
          min: 0,
          step: 1,
          required: true,
          message: this.$t('92f7db48.aecabe')
        },
        {
          label: this.$t('92f7db48.438907'),
          key: 'show_time',
          defaultValue: [],
          component({ disabled }, value) {
            return (
              <div class='preheat-time'>
                <el-date-picker
                  v-model={value['show_time']}
                  disabled={disabled}
                  type='datetimerange'
                  placeholder={this.$t('92f7db48.4b8cb9')}
                  start-placeholder={this.$t('92f7db48.592c59')}
                  end-placeholder={this.$t('92f7db48.f78277')}
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
              callback(new Error(this.$t('92f7db48.dde02e')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('92f7db48.726a6f'),
          key: 'rank_by',
          type: 'radio',
          options: [
            {
              label: 'hot',
              name: this.$t('92f7db48.89ead3')
            }
          ],
          required: true,
          defaultValue: 'hot'
        },
        {
          label: this.$t('92f7db48.0c4efc'),
          key: 'background',
          type: 'image',
          defaultValue: '',
          placeholder: this.$t('92f7db48.197c4f'),
          required: true,
          message: this.$t('92f7db48.4dc2f1'),
          tip: this.$t('92f7db48.9a5506'),
          component({ disabled }, value) {
            return <SpImagePicker v-model={value['background']} disabled={disabled} />
          }
        },
        {
          label: this.$t('92f7db48.6a252f'),
          key: 'apply_scope',
          type: 'radio',
          options: [
            {
              label: 'main_category',
              name: this.$t('92f7db48.adece7')
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
                callback(new Error(this.$t('92f7db48.45bf88')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('92f7db48.a92812'),
          key: 'reason',
          defaultValue: {
            top1_intro: '',
            top2_intro: '',
            top3_intro: ''
          },
          placeholder: this.$t('92f7db48.02cc4f'),
          component({ disabled }, value) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP1:</span>
                  <el-input
                    v-model={value.reason.top1_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP2:</span>
                  <el-input
                    v-model={value.reason.top2_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP3:</span>
                  <el-input
                    v-model={value.reason.top3_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
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
          label: this.$t('92f7db48.7cdb40'),
          type: 'input',
          key: 'name',
          defaultValue: '',
          placeholder: this.$t('92f7db48.02cc4f'),
          required: true,
          message: this.$t('92f7db48.7adf8c')
        },
        {
          label: this.$t('92f7db48.72cf37'),
          type: 'input',
          key: 'intro',
          defaultValue: '',
          maxlength: 12,
          placeholder: this.$t('92f7db48.02cc4f')
        },
        {
          label: this.$t('92f7db48.ee8ecb'),
          type: 'number',
          key: 'sort',
          defaultValue: 0,
          placeholder: this.$t('92f7db48.02cc4f'),
          min: 0,
          step: 1,
          required: true,
          message: this.$t('92f7db48.aecabe')
        },
        {
          label: this.$t('92f7db48.438907'),
          key: 'show_time',
          defaultValue: [],
          component: ({ disabled }, value) => {
            return (
              <div class='preheat-time'>
                <el-date-picker
                  v-model={value['show_time']}
                  disabled={disabled}
                  type='datetimerange'
                  placeholder={this.$t('92f7db48.4b8cb9')}
                  start-placeholder={this.$t('92f7db48.592c59')}
                  end-placeholder={this.$t('92f7db48.f78277')}
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
              callback(new Error(this.$t('92f7db48.dde02e')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('92f7db48.726a6f'),
          key: 'rank_by',
          type: 'radio',
          options: [
            {
              label: 'hot',
              name: this.$t('92f7db48.89ead3')
            }
          ],
          required: true,
          defaultValue: 'hot'
        },
        {
          label: this.$t('92f7db48.0c4efc'),
          key: 'background',
          type: 'image',
          defaultValue: '',
          placeholder: this.$t('92f7db48.197c4f'),
          required: true,
          message: this.$t('92f7db48.4dc2f1'),
          tip: this.$t('92f7db48.9a5506'),
          component: ({ disabled }, value) => {
            return <SpImagePicker v-model={value['background']} disabled={disabled} />
          }
        },
        {
          label: this.$t('92f7db48.6a252f'),
          key: 'apply_scope',
          type: 'radio',
          options: [
            {
              label: 'main_category',
              name: this.$t('92f7db48.adece7')
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
                callback(new Error(this.$t('92f7db48.45bf88')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('92f7db48.a92812'),
          key: 'reason',
          defaultValue: {
            top1_intro: '',
            top2_intro: '',
            top3_intro: ''
          },
          placeholder: this.$t('92f7db48.02cc4f'),
          component: ({ disabled }, value) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP1:</span>
                  <el-input
                    v-model={value.reason.top1_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP2:</span>
                  <el-input
                    v-model={value.reason.top2_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ width: '50px' }}>TOP3:</span>
                  <el-input
                    v-model={value.reason.top3_intro}
                    type='input'
                    placeholder={this.$t('92f7db48.02cc4f')}
                    disabled={disabled}
                  />
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
      Object.keys(params).forEach((key) => {
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
        console.error('Get category failed:', error)
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
          show_time:
            detail.start_time && detail.end_time
              ? [detail.start_time * 1000, detail.end_time * 1000]
              : [],
          rank_by: detail.rank_by || 'hot',
          background: detail.background || '',
          apply_scope: detail.apply_scope || 'main_category',
          scope_id: detail.scope_id
            ? Array.isArray(detail.scope_id)
              ? detail.scope_id
              : [detail.scope_id]
            : [],
          reason: {
            top1_intro: detail.top1_intro || '',
            top2_intro: detail.top2_intro || '',
            top3_intro: detail.top3_intro || ''
          }
        }
        this.dialogTitle = this.$t('92f7db48.d14463')
      } else {
        // 新增模式，重置表单
        this.dialogTitle = this.$t('92f7db48.81cfbe')
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
      const scope_id =
        Array.isArray(this.rankingForm.scope_id) && this.rankingForm.scope_id.length > 0
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
        if (this.dialogTitle === this.$t('92f7db48.d14463')) {
          await editRanking(this.rankingForm.id, params)
        } else {
          await createRanking(params)
        }
        this.ranking_dialog = false
        this.$refs.finder.refresh(true)
        this.$message({
          type: 'success',
          message: this.$t('92f7db48.3b1083')
        })
      } catch (error) {
        console.error(error)
        this.$message.error(this.$t('92f7db48.6de920'))
      }
    },
    delRanking(id) {
      this.$confirm(this.$t('92f7db48.db2b21'), this.$t('92f7db48.02d981'), {
        confirmButtonText: this.$t('92f7db48.38cf16'),
        cancelButtonText: this.$t('92f7db48.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteRanking(id)
            .then(() => {
              this.$message({ type: 'success', message: this.$t('92f7db48.0007d1') })
              this.$refs.finder.refresh(true)
            })
            .catch((error) => {
              console.error(error)
              this.$message.error(this.$t('92f7db48.acf066'))
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
