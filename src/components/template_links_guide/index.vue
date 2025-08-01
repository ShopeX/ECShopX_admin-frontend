<template>
  <el-dialog
    title="设置路径内容"
    :visible="linksVisible"
    custom-class="dialog"
    append-to-body
    @close="closeDialog"
  >
    <div class="view-flex flex">
      <Tabs :showlinks="links" :type="type" @onClick="handleTabsClick" />
      <div class="link-data">
        <Finder
          v-if="
            type !== 'category' && type !== 'marketing' && type !== 'link' && type !== 'other_wxapp'
          "
          :type="type"
          @onSearch="handleSearch"
        >
          <div
            v-if="type === 'goods' || type === 'article' || type === 'planting'"
            class="store view-flex-item"
          >
            <StoreFilter :data="store" :lock="lockStore" @change="handleStoreChange" />
          </div>
        </Finder>
        <Wxalink
          v-if="type === 'other_wxapp'"
          @selectChange="selectChange"
          @onsearch="handleSearch"
        />
        <List
          :type="type"
          :store="store"
          :keywords="keywords"
          :appid="appid"
          @onClick="handleRowClick"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="setComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Finder from './comps/finder'
import Tabs from './comps/tabs'
import List from './comps/list'
import Wxalink from './comps/wxalink'
import StoreFilter from '../function/storeFilter'

export default {
  components: {
    Finder,
    Tabs,
    List,
    Wxalink,
    StoreFilter
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    usage: {
      type: String,
      default: 'wxapp' // 'wxapp'小程序端，'pc'pc端装修
    },
    links: {
      type: Array,
      default: function () {
        return []
      }
    },
    relStore: {
      type: Object
    },
    lockStore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linksVisible: false,
      type: 'goods',
      link: '',
      keywords: '',
      showStore: false,
      store: {},
      //  选择的小程序
      appid: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.linksVisible = val
        if (this.relStore) {
          this.store = this.relStore
        }
      }
    }
  },
  methods: {
    handleTabsClick(val) {
      if (this.type === val) return
      this.type = val
      this.keywords = ''
    },
    handleSearch(val) {
      this.keywords = val
    },
    handleRowClick(val) {
      this.link = val
      console.log(val)
    },
    handleStoreChange(val) {
      this.store = val
    },
    closeDialog() {
      this.linksVisible = false
      this.$emit('closeDialog', 'link')
    },
    setComfirm() {
      if (!this.link) {
        this.$message({
          message: '请选绑定内容',
          type: 'error'
        })
        return
      }
      this.$emit('setLink', this.link, this.type)
      this.linksVisible = false
    },
    selectChange(val) {
      this.appid = val
    }
  }
}
</script>

<style scoped lang="scss">
.dialog {
  min-width: 800px;
}
.store {
  margin-right: 20px;
}
.link-data {
  flex: 1;
  padding-left: 30px;
}
</style>
