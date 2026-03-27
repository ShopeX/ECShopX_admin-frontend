<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'marquees'" class="section">
    <div class="section-header with-border">{{ $t('ed2221ab.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('ed2221ab.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('ed2221ab.2d711b')">
          <el-radio-group v-model="config.direction" @change="handleChange">
            <el-radio label="vertical"> {{ $t('ed2221ab.e8f87a') }} </el-radio>
            <el-radio label="horizontal"> {{ $t('ed2221ab.97d076') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('ed2221ab.2f97db')">
          <el-color-picker v-model="config.bgcolor" />
        </el-form-item>
        <el-form-item :label="$t('ed2221ab.690660')">
          <el-color-picker v-model="config.fontcolor" />
        </el-form-item>
        <el-form-item :label="$t('ed2221ab.14d342')">
          <div>
            <el-input
              v-model="config.label"
              maxlength="4"
              style="width: 300px; vertical-align: middle"
              :placeholder="$t('ed2221ab.89ad88')"
            />
            <el-color-picker v-model="config.labelcolor" style="vertical-align: middle" />
          </div>
          <div class="frm-tips">{{ $t('ed2221ab.a882fc') }}</div>
        </el-form-item>
        <el-form-item v-if="config.direction === 'vertical'" :label="$t('ed2221ab.e8f87a')">
          <draggable v-model="list" class="article" :options="dragItemsOptions" @end="onEnd">
            <div v-for="(item, index) in data" :key="index" class="article-item">
              <i class="iconfont icon-stream drag-handler" />
              <span>
                {{ item.title }}
                <div class="el-icon-delete btn-remove" @click="handleRemove(index)" />
              </span>
            </div>
          </draggable>
          <el-button type="primary" plain round @click="showArticle">
            {{ $t('ed2221ab.8f5d8d') }}
          </el-button>
          <div class="frm-tips">{{ $t('ed2221ab.8f69e8') }}</div>
        </el-form-item>
        <el-form-item v-if="config.direction === 'horizontal'" :label="$t('ed2221ab.97d076')">
          <draggable v-model="list" class="article" :options="dragItemsOptions" @end="onEnd">
            <div v-for="(item, index) in data" :key="index" class="article-item">
              <i class="iconfont icon-stream drag-handler" />
              <span>
                <el-input v-model="item.title" size="small" />
                <div class="el-icon-delete btn-remove" @click="handleRemove(index)" />
              </span>
            </div>
          </draggable>
          <el-button type="primary" plain round @click="handleTextAdd">
            {{ $t('ed2221ab.b63688') }}
          </el-button>
          <div class="frm-tips">{{ $t('ed2221ab.8f69e8') }}</div>
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
      this.$confirm(this.$t('ed2221ab.e00fb2'), this.$t('ed2221ab.02d981'), {
        confirmButtonText: this.$t('ed2221ab.38cf16'),
        cancelButtonText: this.$t('ed2221ab.625fb2'),
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
      this.$confirm(this.$t('ed2221ab.d05716'), this.$t('ed2221ab.02d981'), {
        confirmButtonText: this.$t('ed2221ab.38cf16'),
        cancelButtonText: this.$t('ed2221ab.625fb2'),
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
        data.forEach((item) => {
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
