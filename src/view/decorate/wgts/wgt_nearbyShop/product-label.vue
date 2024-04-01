<template>
  <div class="attr-category">
    <CompButton
      placeholder="选择标签"
      format="{0}个标签"
      :value="value.length"
      :view-btn="false"
      @click="onAddLabel"
      @remove="onRemoveLabel"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { queryTagShop } from '@/api/marketing'
import CompButton from '../../comps/comp-button'

export default {
  components: { CompButton },
  props: ['value'],
  data() {
    return {
      tagSelectVisible: false,
      localTagList: [],
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      checked: 0
    }
  },
  watch: {
    localTagList: {
      deep: true,
      handler: function (nVal, oVal) {
        // this.getShop(nVal)
      }
    }
  },
  created() {
    this.localTagList = cloneDeep(this.value.tagList)
    
  },
  methods: {
    deleteTag(index) {
      this.localTagList.splice(index, 1)
    },
    onEnd(evt) {
      const temp = this.localTagList[evt.oldIndex]
      this.localTagList.splice(evt.oldIndex, 1)
      this.localTagList.splice(evt.newIndex, 0, temp)
    },
    seletedTagsHandle(seletedTags) {
      this.localTagList = seletedTags
    },
    async getShop(val) {
      if (val.length <= 0) {
        this.localShopList = []
        return
      }
      const tag_id = val[this.checked].tag_id
      const result = await queryTagShop({ tag_id })
      const { list } = result.data.data
      this.localShopList = list
      this.$emit('input', {
        tagList: val,
        shopList: list
      })
    },
    tagSelectVisibleHandle() {
      this.tagSelectVisible = !this.tagSelectVisible
    },
    async onAddLabel() {
      const ids = this.value.map(({ tag_id }) => tag_id)
      const { data } = await this.$picker.tag({
        data: ids,
        distributor_id:this.$route.query.distributor_id
      })
      this.$emit('input', data)
    },
    onRemoveLabel() {
      this.$emit('input', [])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
