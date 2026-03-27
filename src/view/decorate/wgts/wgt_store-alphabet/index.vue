<style lang="scss" src="./index.scss"></style>
<template>
  <div class="wgt-shop" :style="outerStyle">
    <div class="wgt-shop-container-alphabet">
      <div class="brand-list" :style="innerStyle">
        <!-- 品牌组A -->
        <div v-for="(item, index) in brandList" :key="index" class="brand-group">
          <div class="category-header">
            <div class="letter-index">{{ item.title }}</div>
            <span v-if="index == 0" class="all-category">{{ i18n.t('f5828e4d.93b01a') }}</span>
          </div>
          <div v-for="(brandItem, brandIndex) in item.items" :key="brandIndex" class="brand-items">
            <div class="brand-item">
              <el-image :src="brandItem?.imgUrl" alt="品牌图片" class="brand-image">
                <div slot="error" class="image-slot" />
              </el-image>
              <div class="brand-info">
                <div class="brand-info-top">
                  <div class="brand-name">{{ brandItem.name }}</div>
                  <div class="brand-tag">{{ brandItem.tag }}</div>
                </div>
                <div class="brand-meta">{{ brandItem.meta }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧字母导航 -->
      <div class="alphabet-nav">
        <div v-for="letter in letterList" :key="letter" class="letter-item">
          {{ letter }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
export default {
  name: 'StoreAlphabet',
  wgtName: i18n.t('f5828e4d.435fe2'),
  wgtDesc: '',
  wgtIcon: 'list-alphabet',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {i18n,
      defaultBrandList: [
        {
          imgUrl: '',
          name: 'AW 品牌名称',
          tag: '品牌活动标签',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品',
          isAuto: true
        },
        {
          imgUrl: '',
          name: 'ACNE STUDIOS',
          tag: '低至6.7折',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品',
          highlight: true
        },
        {
          imgUrl: '',
          name: 'ADIDAS',
          tag: '低至6.7折',
          first_letter: 'A',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'BRANDNAME',
          tag: '品牌活动标签',
          first_letter: 'B',
          meta: '品牌分类 | 在售200件商品',
          isAuto: true
        },
        {
          imgUrl: '',
          name: 'CELINE',
          tag: '品牌活动标签',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'CHAMPION',
          tag: '满300减50',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        },
        {
          imgUrl: '',
          name: 'CALVIN KLEIN',
          tag: '三件7折',
          first_letter: 'C',
          meta: '品牌分类 | 在售200件商品'
        }
      ]
    }
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    },
    innerStyle() {
      return getInnerStyle(this.value)
    },
    brandList() {
      // 按字母分组店铺数据
      let list = this.defaultBrandList
      if (this.value.dataType == 'specify') {
        list = this.value?.data || []
      }
      const letterGroups = {}
      if (list.length == 0) {
        return []
      }

      list?.forEach((shop) => {
        const letter = shop.first_letter || '#'
        if (!letterGroups[letter]) {
          letterGroups[letter] = {
            title: letter,
            key: letter,
            items: []
          }
        }

        letterGroups[letter].items.push({
          name: shop.name,
          meta: shop.online_goods_num ? `热卖中 | 在售${shop.online_goods_num}件商品` : '热卖中',
          tag: shop.tag_name && shop.tag_name.length > 0 ? shop.tag_name[0] : '',
          imgUrl: shop.logo,
          distributor_id: shop.distributor_id
        })
      })

      // 转换为数组并按字母排序
      const sortedList = Object.values(letterGroups).sort((a, b) => {
        if (a.key < b.key) return -1
        if (a.key > b.key) return 1
        return 0
      })
      return sortedList
    },
    letterList() {
      if (this.value.dataType == 'specify') {
        return this.brandList.map((item) => item.title)
      }
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('')
    }
  }
}
</script>
