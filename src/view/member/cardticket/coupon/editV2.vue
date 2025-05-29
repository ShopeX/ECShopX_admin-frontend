<template>
  <div>
    <SpForm
      v-model="form"
      class="form-wrap"
      :form-list="formList"
      :submit="!disable"
      @onSubmit="onOnSubmit"
    />
  </div>
</template>

<script>
import { formSchema, createDistributorTableSchema } from './editSchema'
import { generatorParams } from '@/utils/schemaHelper'
import SkuSelector from '@/components/function/skuSelector'
import { handleUploadFile, exportUploadTemplate } from '@/api/common'

import CrowdSelect from '@/components/function/crowdSelect'

import moment from 'moment'

import api from '@/api'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SkuSelector,
    // eslint-disable-next-line vue/no-unused-components
    CrowdSelect
  },
  props: {
    card_type: {
      type: String,
      default: ''
    },
    form_data: {
      type: Object,
      default: () => {}
    },
    areas: {
      type: Array,
      default: () => []
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  inject: ['refresh'],
  data() {
    return {
      form: generatorParams(formSchema(this)),
      relItems: [],
      categoryList: [],
      distributorInfo: [],
      item_category: [],
      tempDays: [],
      editFlag: false
    }
  },
  computed: {
    formList() {
      return formSchema(this)
    },
    distributorTableSchema() {
      return createDistributorTableSchema(this)
    }
  },
  watch: {
    form_data: {
      handler(val) {
        console.log(val, '222')
        if (val) {
          this.form = {
            ...generatorParams(formSchema(this), val),
            platform_cost_ratio: val.platform_cost_ratio,
            platform_cost_ratio_1: 100 - val.platform_cost_ratio,
            days: val.days
          }
          this.$nextTick(() => {
            this.relItems = val.itemTreeLists
            this.item_category = val.item_category
          })

          if (val.distributor_ids?.length) {
            const _pros = val.distributor_ids?.map((el) => {
              return api.marketing.getDistributorInfo({ distributor_id: el })
            })
            Promise.all(_pros).then((res) => {
              this.distributorInfo = res
            })
          }
          this.editFlag = val?.getNum > 0 || this.disable
          if (val.date_type === 'DATE_TYPE_FIX_TERM') {
            this.form.begin_time = val.begin_time
            this.form.end_time = moment(val.end_time).format('YYYY-MM-DD HH:mm:ss')
          }
          if (val.date_type === 'DATE_TYPE_FIX_TIME_RANGE') {
            this.form.date_range = [
              moment(val.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              moment(val.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            ]
          }
          if (val?.send_begin_time > 0) {
            this.form.time = [
              moment(val.send_begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              moment(val.send_end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            ]
          }
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.cardId) {
      this.card_id = this.$route.query.cardId
    }
    let tempDays = [{ text: '当天', value: 0 }]
    for (let i = 1; i <= 90; i++) {
      tempDays.push({ text: i + '天', value: i })
    }
    this.tempDays = tempDays
    this.fetchMainCate()
  },
  methods: {
    async onOnSubmit() {
      const _baseForm = {
        ...this.form,
        card_type: this.card_type,
        color: '#000000',
        use_all_shops: true,
        card_id: this.card_id || ''
      }
      if (_baseForm.use_all_items == 'distributor' && this.distributorInfo.length > 0) {
        _baseForm.distributor_ids = this.distributorInfo
          .map((item) => item.distributor_id)
          ?.join(',')
      }
      if (_baseForm.use_all_items == 'category' && this.item_category?.length > 0) {
        _baseForm.item_category = JSON.stringify(this.item_category)
      }

      if (_baseForm.use_all_items !== 'false') {
        _baseForm.rel_item_ids = ''
      }

      if (this.card_type === 'cash') {
        _baseForm.useCondition = 2
      }

      if (_baseForm.date_type == 'DATE_TYPE_FIX_TERM') {
        _baseForm.begin_time = this.form.begin_time
        _baseForm.end_time = moment(this.form.end_time).unix()
      } else {
        _baseForm.begin_time = moment(this.form.date_range[0]).unix()
        _baseForm.end_time = moment(this.form.date_range[1]).unix()
      }
      if (_baseForm?.time?.length) {
        _baseForm.send_begin_time = moment(this.form.time[0]).unix()
        _baseForm.send_end_time = moment(this.form.time[1]).unix()
      }

      delete _baseForm.date_range
      delete _baseForm.time
      delete _baseForm.user_type
      if (this.card_id) {
        const _form = { ..._baseForm }
        await this.$api.cardticket.updateCard(_form)
      } else {
        await this.$api.cardticket.creatCard(_baseForm)
      }
      this.refresh()
      this.$router.go(-1)
    },
    removeUserTag(tagId) {
      this.form = {
        ...this.form,
        'member_tags': this.form.member_tags.filter((item) => item.tag_id !== tagId)
      }
    },
    async fetchMainCate() {
      if (this.is_distributor) {
        const res = await this.$api.goods.getCategory({ is_show: false })
        this.categoryList = res
        return
      }
      const res = await this.$api.goods.getCategory({ is_main_category: true, ignore_none: true })
      this.categoryList = res
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate() {
      let params = { file_type: 'marketing_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    getItems(data) {
      console.log(data)
      let ids = []
      data.forEach((item) => {
        ids.push(item.itemId)
      })
      this.form.rel_item_ids = JSON.stringify(ids)
    },
    /**
     * 上传模板
     * */
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `以下商品编号不存在：${str}`,
              type: 'error',
              duration: 5000
            })
          }, 1500)
        }
        if (data.succ.length <= 0) return
        this.relItems = data.succ
        let list = []
        data.succ.forEach((item) => {
          if (!item.nospec) {
            list.push(Object.assign(item, { spec_items: [] }))
          } else {
            list.push(item)
          }
        })
      })
    },
    deleteDistributor(row) {
      this.distributorInfo = this.distributorInfo.filter(
        (item) => item.distributor_id !== row.distributor_id
      )
    },
    async addDistributorAction() {
      try {
        const res = await this.$picker.shopV2({
          multiple: true,
          data: this.distributorInfo?.map((item) => item.distributor_id)
        })
        this.distributorInfo = res.data
        console.log(this.distributorInfo)
      } catch (error) {
        console.log(error)
      }
    },
    usePrdChange() {
      this.relItems = []
      this.item_category = []
      this.distributorInfo = []
    },
    dateTypeChange() {
      this.form = {
        ...this.form,
        begin_time: '',
        end_time: '',
        days: '',
        date_range: []
      }
    }
  }
}
</script>

<style scoped>
.valid-time >>> .el-radio {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.form-wrap >>> .el-textarea {
  widows: 500px;
}
</style>
