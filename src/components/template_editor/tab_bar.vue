<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-header with-border">{{ $t('13f63c15.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('13f63c15.2f97db')">
          <el-color-picker v-model="config.backgroundColor" />
        </el-form-item>
        <el-form-item :label="$t('13f63c15.8d2317')">
          <el-color-picker v-model="config.color" />
        </el-form-item>
        <el-form-item :label="$t('13f63c15.076d83')">
          <el-color-picker v-model="config.selectedColor" />
        </el-form-item>
        <el-form-item :label="$t('13f63c15.300cfd')">
          <div v-for="(item, index) in data" :key="index" class="setting-item">
            <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <img
              v-if="item.iconPath"
              :src="item.iconPath"
              class="icon-setter"
              @click="handleIconChange(index)"
            />
            <div v-else class="icon-setter" @click="handleIconChange(index)">
              <i class="el-icon-picture muted" />
            </div>
            <img
              v-if="item.selectedIconPath"
              :src="item.selectedIconPath"
              class="icon-setter"
              @click="handleSelectedIconChange(index)"
            />
            <div v-else class="icon-setter" @click="handleSelectedIconChange(index)">
              <i class="el-icon-picture muted" />
            </div>
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
          <div class="frm-tips">{{ $t('13f63c15.ebf932') }}</div>
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            {{ $t('13f63c15.648c5e') }}
          </el-button>
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
        { value: '/pages/recommend/list', name: 'article', label: t('13f63c15.e8f87a') },
        { value: '/pages/liveroom/index', name: 'liveroom', label: t('13f63c15.7bbe8e') },
        { value: '/pages/item/list?isTabBar=true', name: 'allGoods', label: t('13f63c15.794a4e') }
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
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleClick(index) {
      this.current = index
    },
    handleChange(value) {
      let n = this.pathOptions.find((item) => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
    },
    handleIconChange(index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange(index) {
      this.$emit('bindImgs', index, 'selected')
    }
  }
}
</script>

<style scoped lang="scss"></style>
