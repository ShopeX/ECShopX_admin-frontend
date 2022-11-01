<template>
  <div v-if="loaded">
    <div v-if="currentApp">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="概况"
          name="survey"
        >
          <survey :wxapp="currentApp" />
        </el-tab-pane>
        <el-tab-pane
          label="用户画像"
          name="user"
        >
          <user :wxapp="currentApp" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <div class="section section-white">
        <div class="section-body content-center no-bind">
          <div>
            <i
              class="iconfont icon-info-circle"
              style="font-size: 70px"
            />
          </div>
          <div class="content-padded">
            未绑定小程序
          </div>
          <div>
            <el-button
              type="primary"
              @click="toBind"
            >
              去绑定
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import survey from './survey.vue'
import user from './user.vue'

export default {
  components: {
    survey,
    user
  },
  data () {
    return {
      wxapp_id: '',
      activeName: 'survey',
      currentApp: '',
      loaded: false,
      wxapps: []
    }
  },
  mounted () {
    if (this.$route.query && this.$route.query.app_id) {
      this.wxapp_id = this.$route.query.app_id
      this.currentApp = this.$route.query.app_id
    }
    if (this.wxapps) {
      this.currentApp = this.wxapp_id
      this.loaded = true
    }
  },
  methods: {
    wxaHandle (val) {
      this.currentApp = val
    },
    handleClick (tab, event) {},
    toBind () {
      this.$router.push({ path: this.matchInternalRoute('editauthorize') })
    }
  }
}
</script>

<style>
.no-bind {
  color: #ccc;
}
</style>
