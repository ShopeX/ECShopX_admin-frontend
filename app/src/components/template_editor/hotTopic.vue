<template>
  <section v-if="name === 'hotTopic' || name === 'banner'" class="section">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item label="标题">
            <el-input v-model="base.title"></el-input>
          </el-form-item>

          <el-form-item label="组件间距">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef">
            </el-switch>
          </el-form-item>
        </template>

        <div class="setting-item slider" v-for="(item, index) in data" :key="index">
          <div class="setting-remove" @click="removeItem(index)">
            <i class="iconfont icon-trash-alt"></i>
          </div>
          <template v-if="type === 'wxapp'">
            <div class="uploader-setting">
              <el-form-item :label="'话题' + (index + 1)">
                <el-input v-model="item.topic"></el-input>
              </el-form-item>

              <el-form-item>
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div class="link-content" v-if="item.id">
                    <template v-if="item.linkPage === 'goods'">商品：</template>
                    <template v-if="item.linkPage === 'category'">分类：</template>
                    <template v-if="item.linkPage === 'article'">文章：</template>
                    <template v-if="item.linkPage === 'planting'">软文：</template>
                    <template v-if="item.linkPage === 'link'">页面：</template>
                    <template v-if="item.linkPage === 'marketing'">营销：</template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)"></i>设置路径
                  </div>
                </div>
              </el-form-item>
            </div>
          </template>
        </div>
      </el-form>
      <div class="content-center">
        <el-button
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加话题</el-button
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    type: {
      type: String, // pc 传'pc'即可
      default: 'wxapp'
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
  data() {
    return {
      name: '',
      base: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    addItem() {
      let item = {
        imgUrl: '',
        title: '',
        id: ''
      }
      this.data.push(item)
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>
