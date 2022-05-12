<style lang="scss">
.picker-image {
  &-hd {
    padding: 10px;
  }
  &-bd {
    display: flex;
    padding: 0 0 10px 10px;
    .lf-container {
      width: 220px;
      background: #f5f5f5;
      height: 500px;
      margin-right: 8px;
      padding: 8px;
    }
    .rg-container {
      flex: 1;
    }
  }
  .catgory-item {
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    &:hover {
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
    }
    &.active {
      color: rgb(255, 255, 255);
      background-color: var(--themeColor);
    }
  }
  .image-item {
    &-wrap {
      display: inline-block;
      position: relative;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      vertical-align: middle;
      cursor: pointer;
    }
    display: flex;
    align-items: flex-end;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    background: 50% 50% / cover no-repeat rgb(221, 221, 221);
    &:hover {
      .image-meta {
        display: block;
      }
    }
    .image-meta {
      height: 28px;
      width: 100%;
      line-height: 28px;
      text-align: center;
      color: rgb(255, 255, 255);
      background-color: rgba(0, 0, 0, 0.4);
      display: none;
    }
  }
  .image-title-wrap {
    width: 120px;
    &__title {
      @include text-overflow();
    }
  }
  .el-pagination {
    margin-top: 8px;
    text-align: right;
  }
}
</style>
<template>
  <div class="picker-image">
    <div class="picker-image-hd">
      <el-button>上传图片</el-button>
      <el-button
        @click="
          () => {
            this.groupDialog = true
          }
        "
      >
        添加分组
      </el-button>
    </div>
    <div class="picker-image-bd">
      <div class="lf-container">
        <div
          v-for="(item, index) in catgoryList"
          :key="`catgory-item__${index}`"
          class="catgory-item"
          :class="{
            active: selectCatgory == item.image_cat_id
          }"
          @click="handleClickCatgory(item)"
        >
          {{ item.image_cat_name }}
        </div>
      </div>
      <div class="rg-container">
        <div>
          <div
            v-for="(item, index) in list"
            :key="`image-item-wrap__${index}`"
            class="image-item-wrap"
          >
            <div
              class="image-item"
              :style="{ color: '#fff', backgroundImage: `url(${item.url})` }"
            >
              <span class="image-meta">800*800</span>
            </div>
            <div
              class="image-title-wrap"
              :title="item.image_name"
            >
              <p class="image-title-wrap__title">
                {{ item.image_name }}
              </p>
            </div>
          </div>
        </div>
        <el-pagination
          layout="total, prev, pager, next"
          :current-page.sync="pageCur"
          :page-size="pageSize"
          :total="pageCount"
          @current-change="goPage"
        />
      </div>
    </div>

    <!-- 添加分组 -->
    <SpDialog
      ref="groupDialogRef"
      v-model="groupDialog"
      title="添加分组"
      :modal="false"
      :form="groupForm"
      :form-list="groupFormList"
      @onSubmit="onGroupFormSubmit"
    />
  </div>
</template>

<script>
import PageMixin from '../mixins/page'
export default {
  name: 'PickerImage',
  mixins: [PageMixin],
  config: {
    title: '我的图片'
  },
  props: ['value'],
  data () {
    return {
      list: [],
      catgoryList: [],
      selectCatgory: -1,
      groupDialog: false,
      groupForm: {
        groupName: ''
      },
      groupFormList: [
        {
          label: '分组名称:',
          key: 'groupName',
          type: 'input',
          maxlength: 150,
          placeholder: '请输入分组名称',
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  created () {},
  mounted () {
    this.nextPage()
    this.getImageAllCatgory()
  },
  methods: {
    async fetch ({ page_no, page_size }) {
      let params = {
        type: 'image',
        page: page_no,
        pageSize: page_size
      }
      if (this.selectCatgory != '-1') {
        params = {
          ...params,
          image_cat_id: this.selectCatgory
        }
      }
      const { list, total_count } = await this.$api.picker.getImageList(params)
      this.list = list
      return { count: total_count }
    },
    async getImageAllCatgory () {
      const { list } = await this.$api.picker.getImageAllCatgory({ image_cat_id: 0 })
      this.catgoryList = [{ image_cat_id: -1, image_cat_name: '未分组' }, ...list.reverse()]
    },
    async onGroupFormSubmit () {
      const { groupName } = this.groupForm
      await this.$api.picker.addImageCatgory({
        image_cat_name: groupName,
        parent_id: 0
      })
      this.groupDialog = false
      this.getImageAllCatgory()
    },
    handleClickCatgory ({ image_cat_id }) {
      this.selectCatgory = image_cat_id
      this.refresh(true)
    }
  }
}
</script>
