<template>
  <div class="mainSecond">
    <SpForm
      ref="form"
      labelWidth="120px"
      :formList="formList"
      v-model="privacyForm"
      :submit="false"
      @onSubmit="handleSubmit"
    />
    <div class="footer-container">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import ActivitySelect from '@/components/function/activitySelect'
import moment from 'moment'
export default {
  inject: ['refresh'],
  data() {
    return {
      id: '',
      activitySelectList: [],
      loading: false,
      privacyForm: {
        regionauth_id: '',
        collection_name: '',
        collection_desc: '',
        share_title: '',
        share_pic: '',
        is_enabled: false,
        header_pic: '',
        activity_type: 'seckill',
        items: []
      },
      formList: [
        {
          label: '基础信息',
          type: 'group'
        },
        {
          key: 'regionauth_id',
          type: 'select',
          label: '区域',
          options: [],
          required: true,
          message: '请选择区域'
        },
        {
          label: '页面名称',
          type: 'input',
          key: 'collection_name',
          required: true,
          message: '请输入页面名称'
        },
        {
          label: '活动规则',
          type: 'textarea',
          key: 'collection_desc',
          required: true,
          message: '请输入活动规则'
        },
        {
          label: '分享标题',
          type: 'input',
          key: 'share_title',
          required: false
        },
        {
          label: '分享图片',
          key: 'share_pic',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} max={1} />
        },
        {
          label: '是否启用',
          type: 'switch',
          key: 'is_enabled'
        },
        {
          label: '顶部背景图',
          key: 'header_pic',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} max={1} />
        },
        {
          label: '活动类型',
          key: 'activity_type',
          type: 'radio',
          required: true,
          message: '请输入活动类型',
          options: [
            {
              label: 'seckill',
              name: '限时特惠'
            },
            {
              label: 'groups',
              name: '拼团活动'
            }
          ]
        },
        {
          label: '关联活动',
          type: 'group',
          isShow: () => this.privacyForm.activity_type === 'seckill'
        },
        {
          isShow: () => this.privacyForm.activity_type === 'seckill',
          component: () => <ActivitySelect hasArea areaId={this.privacyForm.regionauth_id} v-model={this.privacyForm.items} />
        }
      ],
      privacyOptions: []
    }
  },
  mounted() {
    const id = this.$route.params.itemId
    this.getAreaList()
    if (id) {
      this.id = id
      //编辑
      this.fetchDetail()
    }
  },
  methods: {
    async getAreaList() {
      // 查询区域数据
      const res = await this.$api.regionauth.getRegionauth()
      this.formList[1].options = res?.list?.map((el) => ({
        value: el.regionauth_id,
        title: el.regionauth_name
      }))
    },
    async fetchDetail() {
      const res = await this.$api.promotions.getCollectionDetail({ collection_id: this.id })
      const _form = {
        ...res,
        regionauth_id: res.regionauth_id + '',

      }
      if (_form.activity_type === 'seckill') {
        _form.items = res.items.map((el) => ({
          seckill_id: el.relation_id,
          activity_name: el.name,
          activity_type: el.activity_type,
          activity_start_time: el.start_time,
          activity_start_date: moment(el.start_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          activity_end_time: el.end_time,
          activity_end_date: moment(el.end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          created: el.created,
          created_date: moment(el.created * 1000).format('YYYY-MM-DD HH:mm:ss')
        }))
      } else {
        _form.items = []
      }

      this.privacyForm = _form
    },
    async handleSubmit(type) {
      let params = { ...this.privacyForm }
      if (this.privacyForm.activity_type === 'seckill') {
        if (!params.items.length) {
          this.$message.error('请选择关联活动')
          return
        }
        console.log(111,params.items)
        params.items = params.items.map((el) => ({
          relation_id: el.seckill_id,
          relation_name: el.activity_name,
          start_time: el.activity_start_time,
          end_time: el.activity_end_time,
          activity_type: 'seckill'
        }))
      } else {
        const { list = [] } = await this.$api.promotions.getGroups({
          approve_status: 'on',
          collection: true,
          audit_status: 'approved',
          regionauth_id: this.privacyForm.regionauth_id
        })
        params.items = list.map((el) => ({
          relation_id: el.groups_activity_id,
          relation_name: el.act_name,
          start_time: el.begin_time,
          end_time: el.end_time,
          activity_type: 'groups'
        }))
      }
      params.is_enabled = params.is_enabled ? '1' : '0'
      params.items = JSON.stringify(params.items)

      console.log(params)
      this.loading = true

      if (!this.id) {
        this.$api.promotions
          .createCollection(params)
          .then((res) => {
            this.$message.success('创建成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
            this.refresh()
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$api.promotions
          .updateCollection(params)
          .then((res) => {
            this.$message.success('更新成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
            this.refresh()
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
