<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-body">
      <el-row>
        <el-col :span="8" class="row-col">
          <span>{{ $t('13f63c15.2f97db') }}</span>
          <el-color-picker v-model="config.backgroundColor" />
        </el-col>
        <el-col :span="8" class="row-col">
          <span>{{ $t('13f63c15.8d2317') }}</span>
          <el-color-picker v-model="config.color" />
        </el-col>
        <el-col :span="8" class="row-col">
          <span>{{ $t('13f63c15.076d83') }}</span>
          <el-color-picker v-model="config.selectedColor" />
        </el-col>
      </el-row>
      <el-row>{{ $t('13f63c15.300cfd') }}</el-row>
      <el-row>
        <div v-for="(item, index) in data" :key="index" class="setting-item">
          <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
            <i class="el-icon-delete" />
          </div>
          <img
            v-if="item.iconPath"
            :src="item.iconPath"
            class="icon-setter"
            @click="handleIconChange(index)"
          >
          <div v-else class="icon-setter" @click="handleIconChange(index)">
            <i class="el-icon-picture muted" />
          </div>
          <img
            v-if="item.selectedIconPath"
            :src="item.selectedIconPath"
            class="icon-setter"
            @click="handleSelectedIconChange(index)"
          >
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
          <div v-if="item.pagePath == 'customPage'" class="uploader-setting">
            <div class="btn-linkpath" @click="() => handleCustomPageSelect(item)">
              {{ getCustomPageName(item) }}
            </div>
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
      </el-row>
      <el-row class="btn-row">
        <el-button type="primary" round @click="handleSave">
          {{ $t('6eace4b2.be5fbb') }}
        </el-button>
      </el-row>
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
        { value: '/pages/item/list?isTabBar=true', name: 'allGoods', label: t('13f63c15.794a4e') },
        { value: '/subpages/mdugc/index', name: 'ugc', label: t('6eace4b2.888af1') },
        { value: 'customPage', name: 'customPage', label: t('6eace4b2.cee6eb') }
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
      let n = this.pathOptionsTranslated.find((item) => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
      if (value != 'customPage' && this.data[this.current]?.customPage) {
        this.$delete(this.data[this.current], 'customPage')
      }
    },
    handleIconChange(index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange(index) {
      this.$emit('bindImgs', index, 'selected')
    },
    handleSave() {
      const emptyIndex = this.data.findIndex(
        (item) => item.name == 'customPage' && !item.customPage
      )
      if (emptyIndex > -1) {
        return this.$message({
          message: this.$t('6eace4b2.7727a5'),
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.$emit('saveTab')
    },
    async handleCustomPageSelect(item) {
      const { data } = await this.$picker.pages({
        multiple: false,
        data: [item?.customPage?.id]
      })
      this.$set(item, 'customPage', data[0])
    },
    getCustomPageName(item) {
      return item?.customPage?.page_name ?? this.$t('6eace4b2.7727a5')
    }
  }
}
</script>

<style scoped lang="scss">
.row-col {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.btn-row {
  text-align: center;
  .el-button {
    width: 50%;
  }
}
.btn-linkpath {
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  height: 36px;
  line-height: 36px;
  border-radius: 3px;
  max-width: 160px;
  @include text-overflow();
}
</style>
