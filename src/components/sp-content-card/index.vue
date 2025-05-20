<template>
  <div
    class="sp-content-card bg-white rounded-lg border border-solid border-gray-200 overflow-hidden"
  >
    <div class="sp-content-card__head">
      <div class="relative w-full cursor-pointer" style="padding-bottom: 100%">
        <SpImage
          :src="data.image_url"
          class="absolute top-0 left-0 w-full h-full"
          @click="handleImageClick"
        />
      </div>
    </div>
    <div class="sp-content-card__body pt-1 pb-1">
      <div class="text-sm text-gray-600 overflow-ellipsis h-10 px-2">{{ data.title }}</div>
      <div class="text-sm text-gray-500 px-2 flex justify-end gap-2">
        <div class="flex items-center gap-1">
          <SpIcon class="text-gray-400" name="icon-eye" size="14" />
          <span class="text-xs text-gray-400">{{ data.articleFocusNum?.count || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <SpIcon class="text-gray-400" name="icon-heart" size="12" />
          <span class="text-xs text-gray-400">{{ data.articlePraiseNum?.count || 0 }}</span>
        </div>
      </div>
      <div class="text-xs text-gray-400 text-right px-2">
        更新时间：{{ data.updated | datetime('YYYY-MM-DD HH:mm:ss') }}
      </div>
    </div>
    <div class="sp-content-card__footer">
      <div
        class="text-center h-10 leading-10 border-t border-b border-l-0 border-r-0 border-solid border-gray-200"
      >
        <el-button
          v-clipboard:copy="`pages/recommend/detail?id=${data.article_id}`"
          v-clipboard:success="
            () =>
              $notify.success({
                message: '复制成功'
              })
          "
          icon="iconfont icon-copy text-xs"
          type="text-default"
          size="mini"
          class="text-gray-400"
          >
复制文章链接
</el-button
        >
      </div>
      <div class="flex h-10">
        <div class="flex-1 text-xs text-center h-full leading-10">
          <el-button
            :icon="`iconfont text-xs ${
              data.release_status ? 'icon-undo-alt' : 'icon-broadcast-tower'
            }`"
            type="text-default"
            size="mini"
            class="text-gray-400"
            @click="handlePublishOrWithdraw"
          >
            {{ data.release_status ? '撤回' : '发布' }}
          </el-button>
        </div>
        <div
          class="flex-1 text-xs text-center h-full leading-10 border-t-0 border-b-0 border-l border-r border-solid border-gray-200"
        >
          <el-popover v-model="visible" placement="top" trigger="click">
            <div class="flex items-center justify-center gap-2">
              <el-input-number
                v-model="data.sort"
                class="w-28"
                controls-position="right"
                :min="1"
              />
              <el-button type="primary" @click="handleSort"> 确定 </el-button>
            </div>
            <div slot="reference">
              <el-button
                icon="iconfont icon-sort-amount-up text-xs"
                type="text-default"
                size="mini"
                class="text-gray-400"
                >
排序
</el-button
              >
            </div>
          </el-popover>
        </div>
        <div class="flex-1 text-xs text-center h-full leading-10">
          <el-button
            icon="iconfont icon-trash-alt text-xs"
            type="text-default"
            size="mini"
            class="text-gray-400"
            @click="handleDelete"
            >
删除
</el-button
          >
        </div>
      </div>
    </div>
    <!-- <router-link :to="{ path: matchRoutePath('editor'), query: { id: item.article_id } }">
      <div
        class="thumbnail"
        :style="
          'background: url(' +
          (item.image_url || 'https://fakeimg.pl/200x180/EFEFEF/CCC/?text=image&font=lobster') +
          ') 0% 0% / cover no-repeat;'
        "
      />
      <div class="caption">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="update-time">
          {{ item.updated | datetime('YYYY-MM-DD HH:mm:ss') }}
        </div>
        <div class="view-flex">
          <div class="attention-count">
            <i class="iconfont icon-eye" />{{ item.articleFocusNum.count || 0 }}
          </div>
          <div class="attention-count">
            <i class="iconfont icon-heart" />{{ item.articlePraiseNum.count || 0 }}
          </div>
        </div>
      </div>
    </router-link> -->
    <!-- <div class="footer">
      <div
        v-clipboard:copy="item.link"
        v-clipboard:success="onCopySuccess"
        class="footer-item copy-btn"
      >
        <input v-model="item.link" class="copy-link" type="text" />
        <i class="iconfont icon-copy" /> 复制文章链接
      </div>
    </div>
    <div class="footer">
      <div class="footer-item" @click="handlePublish(item.article_id, item.release_status)">
        <template v-if="item.release_status"> <i class="iconfont icon-undo-alt" /> 撤回 </template>
        <template v-else> <i class="iconfont icon-broadcast-tower" /> 发布 </template>
      </div>
      <el-popover v-model="item.visible" class="footer-item" placement="top" width="160">
        <div class="content-bottom-padded">
          <el-input v-model="item.sort" size="mini" placeholder="请输入排序" />
        </div>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="item.visible = false"> 取消 </el-button>
          <el-button type="primary" size="mini" @click="handleSort(item.article_id)">
            确定
          </el-button>
        </div>
        <div slot="reference"><i class="iconfont icon-sort-amount-up" /> 排序</div>
      </el-popover>
      <div class="footer-item" @click="articleDelete(item.article_id)">
        <i class="iconfont icon-trash-alt" /> 删除
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'SpContentCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    handleDelete() {
      this.$emit('onDelete', this.data)
    },
    handlePublishOrWithdraw() {
      this.$emit('onChange', this.data)
    },
    handleSort() {
      this.$emit('onSort', this.data)
      this.visible = false
    },
    handleImageClick() {
      this.$emit('onClick', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-content-card {
  .thumbnail {
    width: 100%;
    height: 180px;
  }
}
</style>
