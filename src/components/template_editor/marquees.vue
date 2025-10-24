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
  <section v-if="name === 'marquees'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="内容">
          <el-radio-group v-model="config.direction" @change="handleChange">
            <el-radio label="vertical"> 软文 </el-radio>
            <el-radio label="horizontal"> 文本 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="背景色">
          <el-color-picker v-model="config.bgcolor" />
        </el-form-item>
        <el-form-item label="字体颜色">
          <el-color-picker v-model="config.fontcolor" />
        </el-form-item>
        <el-form-item label="标签">
          <div>
            <el-input
              v-model="config.label"
              maxlength="4"
              style="width: 300px; vertical-align: middle"
              placeholder="标签文本"
            />
            <el-color-picker v-model="config.labelcolor" style="vertical-align: middle" />
          </div>
          <div class="frm-tips">标签文字最多4个字符</div>
        </el-form-item>
        <el-form-item v-if="config.direction === 'vertical'" label="软文">
          <draggable v-model="list" class="article" :options="dragItemsOptions" @end="onEnd">
            <div v-for="(item, index) in data" :key="index" class="article-item">
              <i class="iconfont icon-stream drag-handler" />
              <span>
                {{ item.title }}
                <div class="iconfont icon-trash-alt btn-remove" @click="handleRemove(index)" />
              </span>
            </div>
          </draggable>
          <el-button type="primary" plain round @click="showArticle"> 选择软文 </el-button>
          <div class="frm-tips">模板中的展示效果为模拟效果，实际展示效果以客户端为准。</div>
        </el-form-item>
        <el-form-item v-if="config.direction === 'horizontal'" label="文本">
          <draggable v-model="list" class="article" :options="dragItemsOptions" @end="onEnd">
            <div v-for="(item, index) in data" :key="index" class="article-item">
              <i class="iconfont icon-stream drag-handler" />
              <span>
                <el-input v-model="item.title" size="small" />
                <div class="iconfont icon-trash-alt btn-remove" @click="handleRemove(index)" />
              </span>
            </div>
          </draggable>
          <el-button type="primary" plain round @click="handleTextAdd"> 添加文本 </el-button>
          <div class="frm-tips">模板中的展示效果为模拟效果，实际展示效果以客户端为准。</div>
        </el-form-item>
      </el-form>
    </div>
    <articleSelector
      :visible.sync="articleVisible"
      :get-status="setArticleStatus"
      :rel-items-ids="relArticles"
      @change="pickArticle"
    />
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import articleSelector from '@/components/function/articleSelector'
import { getArticleList } from '@/api/article'

export default {
  components: {
    articleSelector,
    draggable
  },
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      // 文章选择器
      articleVisible: false,
      setArticleStatus: false,
      relArticles: [],
      // 拖拽参数
      list: [],
      temp: '',
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.drag-handler'
      }
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.list = val.data
    },
    handleChange(val) {
      this.$confirm('切换内容会清空当前已编辑的数据！确定切换吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.data.splice(0)
          this.relArticles.splice(0)
        })
        .catch(() => {
          if (val == 'vertical') {
            this.config.direction = 'horizotal'
          } else {
            this.config.direction = 'vertical'
          }
        })
    },
    handleRemove(index) {
      this.$confirm('确认移除当前软文?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.data.splice(index, 1)
          this.relArticles.splice(index, 1)
        })
        .catch(() => {
          return
        })
    },
    handleTextAdd() {
      this.data.push({
        title: ''
      })
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    // 种草选择器绑定事件
    showArticle() {
      this.setArticleStatus = true
      this.articleVisible = true
    },
    pickArticle(data) {
      this.relArticles = data
      if (data.length > 0) {
        this.data.splice(0)
        data.forEach(item => {
          let obj = {
            title: item.title,
            id: item.article_id
          }
          this.data.push(obj)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.article {
  .article-item {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 40px;
    font-size: 14px;
    &:last-child {
      margin-bottom: 20px;
    }
    .drag-handler {
      padding-right: 5px;
      color: var(--primary);
      cursor: move;
    }
    span {
      position: relative;
      padding-right: 20px;
      cursor: pointer;
      &:hover {
        .btn-remove {
          display: block;
        }
      }
      .btn-remove {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        line-height: 1;
      }
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>
