<style lang="scss" scoped>
.tag-wrapper {
  margin-top: 10px;
}
.tag {
  margin: 10px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    color: #1480e3;
  }
}

.el-icon-close {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 50%;
  cursor: pointer;
}
.el-icon-close:before {
  transform: translateY(1px);
  display: inline-block;
}
.el-icon-close:hover {
  background-color: #c0c4cc;
  color: #fff;
}
.upload-box {
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    width: 100%;
  }
}
.hotzone {
  max-width: 500px;
  margin-bottom: 10px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}
.uploader-setting {
  padding: 0;
}
</style>

<template>
  <div class="attr-category">
    <CompButton
      placeholder="选择店铺签"
      format="{0}个店铺签"
      :value="value.length"
      :view-btn="false"
      @click="onAddLabel"
      @remove="onRemoveLabel"
    />
    <!-- <el-button
      type="default"
      class="iconfont icon-plus-circle banner-button-uploader"
      size="mini"
      @click="tagSelectVisibleHandle"
    >
      添加标签
    </el-button>
    <p class="tag-wrapper">
      <draggable
        v-if="localTagList.length > 0"
        v-model="localTagList"
        :options="dragItemsOptions"
        @end="onEnd"
      >
        <span v-for="(item, index) in localTagList" :key="item.tag_id" class="tag"
          >{{ item.tag_name }} <span class="el-icon-close" @click="deleteTag(index)"
        /></span>
      </draggable>
    </p>

    <TagSelect
      :visible="tagSelectVisible"
      type="nearby_shop"
      :seleted-tags="localTagList"
      @visibleHandle="tagSelectVisibleHandle"
      @seletedTagsHandle="seletedTagsHandle"
    /> -->
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
    console.log(this.value)
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
      const { data } = await this.$picker.shopTag({
        data: ids
      })
      this.$emit('input', data)
    },
    onRemoveLabel() {
      this.$emit('input', [])
    }
  }
}
</script>
