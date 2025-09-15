<template>
  <div>
    <el-alert
      class="alert-warning"
      title="从上到下权重由大到小，拖拽可进行优先级排序"
      type="warning"
      show-icon
      :closable="false"
    />
    <draggable :list="list" group="easyview" class="rules-list">
      <div v-for="(item, index) in list" :key="`wgt-render-item__${index}`" class="rule-item">
        <div class="drag-handle">
          <SpIcon class="cursor-pointer" name="align-text-both" size="14" />
        </div>

        <template v-if="item.key === 'distributor_code'">
          <div class="rule-content">
            <el-switch v-model="item.status" />
            <div class="content-wrapper">
              <div>店铺码进店</div>
              <div class="description">
                <p>通过带门店参小程序码扫码进入对应店铺</p>
                <p>通过分享小程序卡片进入对应店铺</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant'">
          <div class="rule-content">
            <el-switch v-model="item.status" />
            <div class="content-wrapper">
              <div>导购物料进店（需开通导购应用）</div>
              <div class="description">
                <p>通过扫企微码添加导购加好友的欢迎语推送的小程序卡片进店</p>
                <p>通过导购商城分享的小程序海报、小程序卡片进店</p>
              </div>
              <div class="time-setting">
                导购参数保留时长
                <el-input
                  v-model="item.express_time"
                  type="number"
                  size="small"
                  controls-position="right"
                  :min="0"
                  style="width: 100px; margin: 0 8px"
                />
                ×24小时
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_white'">
          <div class="rule-content">
            <el-switch v-model="item.status" />
            <div class="content-wrapper">
              <div>进入白名单店铺（需开启店铺白名单）</div>
              <div class="description">
                <p>进入用户绑定白名单的店铺</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant_pro'">
          <div class="rule-content">
            <el-switch v-model="item.status" />
            <div class="content-wrapper">
              <div>进入专属导购所属店（需开通导购应用）</div>
              <div class="description">
                <p>进入用户专属导购的归属店铺</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </draggable>
    <div class="rule-item">
      <div class="holder"></div>
      <div class="flex leading-normal p-3">
        <el-switch v-model="shop_lbs" />
        <div class="ml-4">
          <div>LBS就近进店</div>
          <div class="text-sm text-[#999] mt-2">
            <p>根据用户LBS定位，进入附近店铺</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: this.value.list,
      shop_lbs: this.value.shop_lbs
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.$emit('change', {
          list: newVal,
          shop_lbs: this.shop_lbs
        })
      },
      deep: true
    },
    shop_lbs: {
      handler(newVal) {
        this.$emit('change', {
          list: this.list,
          shop_lbs: newVal
        })
      }
    },
    value: {
      handler(newVal) {
        this.list = newVal.list
        this.shop_lbs = newVal.shop_lbs
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-warning {
  line-height: normal;
  margin-bottom: 10px;
}

.rule-item {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin-bottom: 10px;
  min-height: 84px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 24px 1fr;
}

.drag-handle {
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.rule-content {
  display: flex;
  line-height: normal;
  padding: 12px;
}

.content-wrapper {
  margin-left: 16px;
}

.description {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.time-setting {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-top: 10px;
}
</style>
