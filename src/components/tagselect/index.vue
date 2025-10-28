<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <el-dialog
    title="请选择标签"
    :visible.sync="dialogVisible"
    width="400px"
    :before-close="dialogBeforeClose"
  >
    <div>
      <div class="tab-content selected">
        <div v-for="item in tagsList" :key="item.tag_id" class="tag-list">
          <el-tag
            :type="item.type"
            :effect="item.selected ? 'dark' : 'light'"
            @click="selectTag(item)"
          >
            {{ item.tag_name }}
          </el-tag>
        </div>
      </div>
    </div>
    <div slot="footer" class="tag-footer">
      <el-button type="primary" plain size="medium" @click="selectAll"> 选择全部 </el-button>
      <el-button type="primary" size="medium" @click="submitTags"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTagList } from '@/api/member'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'changeDialogVisible'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    const tagTypes = {
      1: 'warning',
      2: 'success',
      3: 'danger',
      4: ''
    }
    return {
      tagsList: [],
      tagTypes
    }
  },
  mounted() {
    this.initTags()
  },
  methods: {
    initTags() {
      getTagList({
        page: 1,
        page_size: 500
      }).then(response => {
        let tagsList = response.data.data.list
        tagsList.map((v, i) => {
          v.type = this.tagTypes[(i + 1) % 4]
          v.selected = false
        })
        this.tagsList = tagsList
      })
    },
    dialogBeforeClose() {
      this.$emit('changeDialogVisible', false)
    },
    selectTag(item) {
      item.selected = !item.selected
    },
    // 选择全部
    selectAll() {
      this.tagsList.map(v => {
        v.selected = true
      })
    },
    // 确定选择
    submitTags() {
      let selectTagsList = this.tagsList.filter(v => v.selected)
      this.$emit('selectTags', selectTagsList)
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-footer {
  display: flex;
  justify-content: center;
}
.tab-content {
  display: flex;
}
.tag-list {
  width: 25%;
  .el-tag {
    cursor: pointer;
  }
}
.select {
  margin-top: 20px;
}
</style>
