<template>
  <div class="attr-data">
    <!-- 销售分类 -->
    <CompButton
      v-if="type === 'category'"
      :placeholder="value?.info?.title || $t('40718fc5.8a28fe')"
      :view-btn="false"
      @click="handleSelectCategory"
    />

    <!-- 管理分类 -->
    <CompButton
      v-if="type === 'main_category'"
      :placeholder="value?.info?.title || $t('40718fc5.c50637')"
      :view-btn="false"
      @click="handleSelectMainCategory"
    />

    <!-- 限时特惠活动 -->
    <CompButton
      v-if="type === 'seckill'"
      :placeholder="value?.info?.title || $t('40718fc5.21d2a0')"
      :view-btn="false"
      @click="handleSelectSeckill"
    />

    <!-- 指定商品 -->
    <div v-if="type === 'items'" class="attr-data-specified" @click="handleSelectGoods">
      <span class="specified-text">{{ itemsDisplayText }}</span>
      <i class="el-icon-arrow-right" />
    </div>

    <!-- 积分商品 -->
    <div
      v-if="type === 'pointsmall_items'"
      class="attr-data-specified"
      @click="handleSelectPointGoods"
    >
      <span class="specified-text">{{ pointGoodsDisplayText }}</span>
      <i class="el-icon-arrow-right" />
    </div>

    <!-- 品类热销榜单 -->
    <CompButton
      v-if="type === 'category_ranking'"
      :placeholder="value?.info?.title || $t('40718fc5.74143d')"
      :view-btn="false"
      :clear-btn="false"
      @click="handleSelectRanking"
    />

    <!-- 平台品类榜单 -->
    <CompButton
      v-if="type === 'platform_ranking'"
      :placeholder="value?.info?.title || $t('40718fc5.257944')"
      :view-btn="false"
      :clear-btn="false"
      @click="handleSelectPlatformRanking"
    />

    <!-- 价格区间 -->
    <div v-if="type === 'price'" class="price-range-container">
      <el-input-number
        v-model="minPrice"
        :min="0"
        :precision="0"
        size="small"
        :max="maxPrice || 999999"
        :placeholder="$t('40718fc5.3d3297')"
        controls-position="right"
        @change="handleChangePrice"
      />
      <span class="separator">{{ $t('40718fc5.981cbe') }}</span>
      <el-input-number
        v-model="maxPrice"
        :min="minPrice || 0"
        :precision="0"
        size="small"
        :placeholder="$t('40718fc5.dab19a')"
        controls-position="right"
        @change="handleChangePrice"
      />
    </div>

    <!-- 活动集合页-秒杀 -->
    <CompButton
      v-if="type === 'promotion'"
      :placeholder="value?.info?.name || $t('40718fc5.312bbb')"
      :view-btn="false"
      @click="handleChangePromotion"
    />

    <!-- 活动集合页-拼团 -->
    <CompButton
      v-if="type === 'group'"
      :placeholder="value?.info?.name || $t('40718fc5.fde84d')"
      :view-btn="false"
      @click="handleSelectGroup"
    />
  </div>
</template>

<script>
import api from '@/api'
import { cloneDeep } from 'lodash-es'
import CompButton from '../../comps/comp-button.vue'
export default {
  components: {
    CompButton
  },
  props: ['type', 'value'],
  data() {
    return {
      localValue: null,
      props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children',
        checkStrictly: true
      },
      minPrice: 0,
      maxPrice: 0,
      localValue: null
    }
  },
  computed: {
    itemIds() {
      return this.localValue ? this.localValue.split(',') : []
    },
    itemsDisplayText() {
      const count = this.localValue?.info?.length
      return count > 0 ? this.$t('40718fc5.e1a5c2', { count }) : this.$t('40718fc5.c5c5f2')
    },
    pointGoodsDisplayText() {
      const count = this.localValue?.info?.length
      return count > 0 ? this.$t('40718fc5.e1a5c2', { count }) : this.$t('46e04a5c.5d71c6')
    }
  },
  watch: {
    type: {
      handler(newVal) {
        if (newVal === 'price') {
          const [min, max] = this.value.id.split(',')
          this.minPrice = Number(min) || 0
          this.maxPrice = Number(max) || 0
        } else if (newVal === 'items') {
          if (this.value?.info?.type === 'group_id') {
            this.localValue = cloneDeep(this.value)
          } else {
            this.localValue = {
              id: this.value?.id,
              info: {
                length: this.value?.id ? this.value?.id?.split(',')?.length : 0,
                type: ''
              }
            }
          }
        } else if (newVal === 'pointsmall_items') {
          this.localValue = {
            id: this.value?.id || '',
            info: {
              length: this.value?.id ? this.value.id.split(',').length : 0,
              type: 'pointsmall_items'
            }
          }
        } else {
          this.localValue = cloneDeep(this.value)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 选择管理分类
    async handleSelectMainCategory(v) {
      const { data } = await this.$picker.category({
        multiple: false,
        data: this.value?.id,
        regionauth_id: this.$route.query.regionauth_id
      })
      this.$emit('input', {
        id: data[0].id,
        info: { regionauth_id: this.$route.query.regionauth_id, title: data[0].title }
      })
    },
    // 选择销售分类
    async handleSelectCategory(v) {
      const { data } = await this.$picker.saleCategory({
        multiple: false,
        data: this.value?.id,
        regionauth_id: this.$route.query.regionauth_id
      })
      this.$emit('input', {
        id: data[0].id,
        info: { regionauth_id: data[0].regionauth_id, title: data[0].title }
      })
    },
    // 选择限时特惠活动
    async handleSelectSeckill() {
      const { data } = await this.$picker.seckill({
        multiple: false,
        data: this.value.id,
        regionauth_id: this.$route.query.regionauth_id
      })
      this.$emit('input', {
        id: data[0].seckill_id,
        info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id }
      })
    },
    // 选择指定商品（使用 goodsitem 弹窗，goodsCheck 在 plugin 中未注册）
    async handleSelectGoods() {
      const idStr = this.localValue?.info?.type === 'group_id' ? this.localValue?.id || '' : ''
      const list = idStr ? idStr.split(',').map((id) => ({ item_id: id, itemId: id })) : []
      const result = await this.$picker.goodsitem({
        isPointGoods: false,
        multiple: true,
        rowKey: 'item_id',
        data: list,
        regionauth_id: this.$route.query.regionauth_id,
        distributor_id: this.$route.query.distributor_id,
        distributor_name: this.$route.query.distributor_name
      })
      if (!result || !result.data) return
      const selected = result.data || []
      const ids = selected.map((item) => item.item_id || item.itemId).filter(Boolean)
      const data = ids.join(',')
      const length = ids.length
      this.localValue = {
        id: data,
        info: {
          length,
          type: 'group_id'
        }
      }
      this.$emit('input', { id: data, info: { length, type: 'group_id' } })
    },
    // 选择积分商品
    async handleSelectPointGoods() {
      const idStr = this.localValue?.info?.type === 'point' ? this.localValue?.id || '' : ''
      const list = idStr ? idStr.split(',').map((id) => ({ item_id: id, itemId: id })) : []
      const result = await this.$picker.goodsitem({
        isPointGoods: true,
        multiple: true,
        rowKey: 'item_id',
        data: list,
        regionauth_id: this.$route.query.regionauth_id,
        distributor_id: this.$route.query.distributor_id,
        distributor_name: this.$route.query.distributor_name
      })
      if (!result || !result.data) return
      const selected = result.data || []
      const ids = selected.map((item) => item.item_id || item.itemId).filter(Boolean)
      const data = ids.join(',')
      const length = ids.length
      this.localValue = {
        id: data,
        info: { length, type: 'point' }
      }
      this.$emit('input', { id: data, info: { length, type: 'point' } })
    },
    // 选择拼团活动
    async handleSelectGroup() {
      const { data } = await this.$picker.groups({
        multiple: false,
        data: [
          {
            groups_activity_id: this.value.id
          }
        ],
        regionauth_id: this.$route.query.regionauth_id,
        distributor_id: this.$route.query.distributor_id
      })
      this.groupInfo = {
        id: data[0].groups_activity_id,
        info: {
          act_name: data[0].act_name
        }
      }
      this.$emit('input', {
        id: data[0].collection_id,
        info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id }
      })
    },
    // 选择价格区间
    handleChangePrice() {
      const [min, max] = [this.minPrice, this.maxPrice]
      this.$emit('input', { id: `${min},${max}`, info: null })
    },
    // 选择品类热销榜单
    async handleSelectRanking() {
      const { data } = await this.$picker.ranking({
        multiple: false,
        data: [
          {
            id: this.value.id
          }
        ],
        regionauth_id: this.$route.query.regionauth_id,
        type: 'category_ranking'
      })
      this.$emit('input', {
        id: data[0].id,
        info: {
          title: data[0].name,
          act_name: data[0].name
        }
      })
    },
    // 选择平台品类榜单
    async handleSelectPlatformRanking() {
      const { data } = await this.$picker.ranking({
        multiple: false,
        data: [
          {
            id: this.value.id
          }
        ],
        regionauth_id: this.$route.query.regionauth_id,
        type: 'platform_ranking'
      })
      this.$emit('input', {
        id: data[0].id,
        info: {
          title: data[0].name,
          act_name: data[0].name
        }
      })
    },
    // 选择活动集合页-秒杀
    async handleChangePromotion() {
      const { data } = await this.$picker.activityCollection({
        multiple: false,
        data: this.value.id,
        regionauth_id: this.$route.query.regionauth_id
      })
      this.$emit('input', {
        id: data[0].collection_id,
        info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-data {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .seckill-select {
    width: 100%;
  }

  .attr-data-specified {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 13px;
    color: #606266;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: #c0c4cc;
    }

    .specified-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-icon-arrow-right {
      color: #c0c4cc;
      margin-left: 8px;
    }
  }

  .price-range-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-input-number {
      flex: 1;
    }

    .separator {
      color: #909399;
      font-size: 13px;
      flex-shrink: 0;
    }
  }
}
</style>
