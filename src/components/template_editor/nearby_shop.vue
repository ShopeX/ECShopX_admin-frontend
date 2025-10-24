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
  <section v-if="name === 'nearbyShop'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="商家分类">
          <el-button
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            size="mini"
            @click="addTab"
          >
            添加标签
          </el-button>
          <p>
            <draggable
              v-if="data.length > 0"
              v-model="data"
              :options="dragItemsOptions"
              @end="onEnd"
            >
              <span v-for="(item, index) in data" :key="item.tag_id" class="tag"
                >{{ item.tag_name }} <span class="el-icon-close" @click="deleteTag(index)"
              /></span>
            </draggable>
          </p>
        </el-form-item>
        <el-form-item label="显示优惠券">
          <el-switch v-model="base.show_coupon" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="商家排序">
          <span>LBS定位</span>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
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
      seletedTags: [], // tab
      data: [],
      activeName: '',
      tabIndex: 0,
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
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
      console.log('================', val)
      this.name = val.name
      this.base = val.base
      this.seletedTags = val.seletedTags
      this.data = val.seletedTags
    },
    addTab() {
      this.$emit('tagSelectVisibleHandle', 'nearby_shop')
    },
    deleteTag(index) {
      this.seletedTags.splice(index, 1)
      console.log(index)
    },
    onEnd(evt) {
      const temp = this.seletedTags[evt.oldIndex]
      this.seletedTags.splice(evt.oldIndex, 1)
      this.seletedTags.splice(evt.newIndex, 0, temp)
    }
  }
}
</script>

<style scoped lang="scss">
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
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
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
