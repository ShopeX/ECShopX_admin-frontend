<template>
  <SpPage>
    <div class="px-5">
      <SpIphone>
        <SpDecorate
          ref="decorateRef"
          v-model="content"
          scene="1009"
          title="导购装修"
          @change="onSaveTemplate"
        />
      </SpIphone>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCustomSalesperson, editCustomPage } from '@/api/wxa'
import shopDecoration from '@/components/function/shopDecoration'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    shopDecoration,
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      template_dialog: false,
      loading: false,
      params: {},
      pageForm: {
        id: ''
      },
      content: [],
      templteid: 0
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted() {
    this.fetchPageData()
  },
  methods: {
    async fetchPageData() {
      this.loading = true
      Object.assign(this.params, { template_name: this.template_name })
      getCustomSalesperson(this.params).then((response) => {
        this.templteid = response.data.data.id
        this.onGetTemp(this.templteid)
        this.loading = false
      })
    },
    async onGetTemp(id) {
      const resTemplate = await this.$api.wxa.getParamByTempName({
        template_name: 'yykweishop',
        page_name: `custom_${id}`,
        version: 'v1.0.1'
      })
      console.log(resTemplate?.config)
      this.content = resTemplate?.config
    },
    async onSaveTemplate(content) {
      await this.$api.wxa.savePageParams({
        template_name: 'yykweishop',
        page_name: `custom_${this.templteid}`,
        version: 'v1.0.1',
        config: JSON.stringify(content)
      })
    }
  }
}
</script>
