<template>
  <div>
    <h1>oms设置</h1>
    <SpForm
      ref="formBase"
      v-model="formBase"
      show-message
      :form-list="formBaseList"
      @onSubmit="onGroupFormSubmit"
    />
  </div>
</template>

<script>
import { generatorParams, bindThisForFormSchema } from '@/utils/schemaHelper.js'
import api from '@/api'
const formBaseList = [
  {
    label: 'api_host',
    key: 'api_host',
    type: 'input',
    placeholder: '请输入',
    defaultValue: '',
    required: true,
    message: '请输入api_host'
  },
  {
    label: 'node_id',
    key: 'node_id',
    type: 'input',
    placeholder: '请输入',
    defaultValue: '',
    required: true,
    message: '请输入node_id'
  },
  {
    label: 'app_secret',
    key: 'app_secret',
    type: 'input',
    placeholder: '请输入',
    defaultValue: '',
    required: true,
    message: '请输入app_secret'
  }
]

export default {
  data() {
    return {
      formBase: {
        ...generatorParams(formBaseList)
      }
    }
  },

  computed: {
    formBaseList() {
      return bindThisForFormSchema(formBaseList, this)
    }
  },
  mounted() {
    this.getOmsSetting()
  },
  methods: {
    onGroupFormSubmit() {
      api.third.setOmsSetting({ config: JSON.stringify(this.formBase) }).then((res) => {
        this.getOmsSetting()
        this.$message.success('设置成功')
      })
    },
    getOmsSetting() {
      api.third.getOmsSetting().then((res) => {
        this.formBase = generatorParams(formBaseList, res)
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
