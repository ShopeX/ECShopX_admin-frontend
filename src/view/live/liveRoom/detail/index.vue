<template>
  <div class="live-room-detail">
    <SpForm
      ref="formBase"
      v-model="formBase"
      show-message
      :form-list="formBaseList"
      @onSubmit="onGroupFormSubmit"
    />
  </div>
</template>

<script lang="js">

import { createFormBaseList } from './schema.js'
import api from '@/api'
import moment from 'moment'
import { generatorParams, bindThisForFormSchema } from '@/utils/schemaHelper.js'
import { debounce } from 'lodash-es'


export default {
  name: 'LiveRoomDetail',
  data() {
    return {
      id: this.$route.params.id,
      formBase: {
        ...generatorParams(createFormBaseList(this))
      },
      areas: [],
      distributor: null,
    }
  },
  computed: {
    formBaseList() {
      return bindThisForFormSchema(createFormBaseList(this), this)
    }
  },
  watch: {
    '$route'(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const pros = [
        api.channel.getChannelInfo(this.$route.params.id),
        api.regionauth.getRegionauth(),
        api.marketing.getDistributorInfo({ distributor_id: this.$route.query.shopId })
      ]
      Promise.all(pros)
        .then((res) => {
          this.areas = res?.[1]?.list?.map((el) => ({
            value: el.regionauth_id,
            label: el.regionauth_name
          }))
          const result = {
            ...(res[0] || {}),
            start_time: moment(res?.[0].start_time * 1000).format('yyyy-MM-DD HH:mm:ss'),
            regionauth_id: res?.[0]?.regionauth_id,
          }
          this.formBase = {
            ...generatorParams(createFormBaseList(this), result)
          }
          this.distributor = res?.[2]
        })
    },
    async handleClick() {
      const { data } = await this.$picker.shopV2({
        data: this.distributor?.distributor_id ? [this.distributor?.distributor_id] : [],
        multiple: false
      })
      const [{ distributor_id }] = data
      this.formBase.distributor_id = distributor_id
      this.distributor = data[0]
    },
    handleRegionChange() {
      this.formBase = {
        ...this.formBase,
        distributor_id: ''
      }
      this.distributor = null
    },
    onGroupFormSubmit: debounce(
      function () {
        api.channel.dupdateChannelInfo(this.$route.params.id, this.formBase).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.$router.go(-1)
            return
          }
          this.$message({
            type: 'info',
            message: '保存失败'
          })
        }).catch(err => {
          console.log(err)
        })
      }, 1000, {
      leading: true
    }
    )
  }
}
</script>

<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
