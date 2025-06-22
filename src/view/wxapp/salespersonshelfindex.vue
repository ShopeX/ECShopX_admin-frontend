<template>
  <SpPage>
    <div v-if="$route.path.indexOf('_detail') === -1">
      <el-dialog
        :visible.sync="template_dialog"
        width="80%"
        title="编辑页面"
        fullscreen
        lock-scroll
      >
        <shopDecoration
          :id="pageForm.id"
          usage="page"
          :template_name="template_name"
        />
      </el-dialog>
    </div>
    <router-view />
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
  data () {
    return {
      imgDialog: false,
      isGetImage: false,
      template_dialog: false,
      loading: false,
      params: {},
      pageForm: {
        id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted () {
    this.fetchPageData()
  },
  methods: {
    fetchPageData () {
      this.loading = true
      Object.assign(this.params, { template_name: this.template_name })
      getCustomSalesperson(this.params).then((response) => {
        if (response.data.data.id) {
          this.pageForm.id = response.data.data.id
          this.template_dialog = true
        }
        this.loading = false
      })
    },
    //上传卡封面
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.pageForm.page_share_imageUrl = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    }
  }
}
</script>
