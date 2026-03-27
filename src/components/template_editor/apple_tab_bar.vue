<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-header with-border">{{ $t('13f63c15.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <!--<el-form-item label="背景色">
          <el-color-picker v-model="config.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="默认颜色">
          <el-color-picker v-model="config.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="选中颜色">
          <el-color-picker v-model="config.selectedColor"></el-color-picker>
        </el-form-item>-->
        <el-form-item :label="$t('13f63c15.300cfd')">
          <div v-for="(item, index) in data" :key="index" class="setting-item">
            <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <!--
            <img v-if="item.iconPath" :src="item.iconPath" class="icon-setter" @click="handleIconChange(index)"/>
            <div class="icon-setter" v-else @click="handleIconChange(index)">
              <i class="el-icon-picture muted"></i>
            </div>
            <img v-if="item.selectedIconPath" :src="item.selectedIconPath" class="icon-setter" @click="handleSelectedIconChange(index)"/>
            <div class="icon-setter" v-else @click="handleSelectedIconChange(index)">
              <i class="el-icon-picture muted"></i>
            </div>-->
            <div class="uploader-setting">
              <el-input v-model="item.text" :placeholder="$t('13f63c15.cf2790')" maxlength="" />
            </div>
            <div class="uploader-setting">
              <el-select
                v-model="item.pagePath"
                :placeholder="$t('13f63c15.19b17a')"
                @focus="handleClick(index)"
                @change="handleChange"
              >
                <el-option
                  v-for="item in pathOptionsTranslated"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <!--<div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>-->
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            {{ $t('13f63c15.648c5e') }}
          </el-button>
          <div class="goods-select" @click="handleGoodsChange">
            <div v-if="base.title" class="link-content">
              <template v-if="base.linkPage === 'goods'"> {{ $t('879af10c.10fe9c') }} </template>
              <template v-if="base.linkPage === 'category'"> {{ $t('879af10c.e7d2e8') }} </template>
              <template v-if="base.linkPage === 'article'"> {{ $t('879af10c.8cb9b8') }} </template>
              <template v-if="base.linkPage === 'planting'"> {{ $t('879af10c.9dcd91') }} </template>
              <template v-if="base.linkPage === 'link'"> {{ $t('879af10c.ffd741') }} </template>
              <template v-if="base.linkPage === 'marketing'">
                {{ $t('879af10c.c78a2f') }}
              </template>
              <template v-if="base.linkPage === 'custom_page'">
                {{ $t('879af10c.15ed03') }}
              </template>
              {{ base.title }}
            </div>
            <div v-else class="content-center">
              <i class="el-icon-link" @click="handleGoodsChange" />{{ $t('0d8b8376.59b2ce') }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      config: {},
      current: '',
      data: [],
      base: {},
      current_index: '',
      iconColor: '',
      selectedIconColor: ''
    }
  },
  computed: {
    pathOptionsTranslated() {
      const t = this.$t.bind(this)
      return [
        { value: '/pages/index', name: 'home', label: t('13f63c15.db1c89') },
        { value: '/pages/cart/espier-index', name: 'cart', label: t('13f63c15.c017be') },
        { value: '/pages/category/index', name: 'category', label: t('13f63c15.d0771a') },
        { value: '/pages/member/index', name: 'member', label: t('13f63c15.07b181') },
        { value: '/pages/custom/custom-page', name: 'service', label: t('0d8b8376.47d68c') }
      ]
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
      this.config = val.config
      this.data = val.data
      this.base = val.base && val.base.length > 0 ? val.base[0] : []
      this.editItem()
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        pagePath: '',
        text: '',
        name: '',
        iconPath: '',
        selectedIconPath: ''
      }
      if (this.data.length > 4) {
        this.$message({
          message: this.$t('13f63c15.1d1897'),
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    },
    editItem() {
      if (this.base && this.base.linkPage && this.base.linkPage === 'custom_page') {
        this.data.map((item) => {
          if (item.name === 'service') {
            item.id = this.base.id
          }
        })
      }
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleClick(index) {
      this.current = index
    },
    handleChange(value) {
      let n = this.pathOptionsTranslated.find((item) => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
    },
    handleIconChange(index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange(index) {
      this.$emit('bindImgs', index, 'selected')
    },
    handleGoodsChange() {
      this.$emit('bindLinks')
    }
  }
}
</script>

<style scoped lang="scss"></style>
