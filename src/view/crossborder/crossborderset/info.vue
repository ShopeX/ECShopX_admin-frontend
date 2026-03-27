<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card>
      <div style="width: 70%">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item :label="$t('2d1c35f7.136cc9')">
            <el-radio-group v-model="form.crossborder_show">
              <el-radio :label="1"> {{ $t('2d1c35f7.0a60ac') }} </el-radio>
              <el-radio :label="0"> {{ $t('2d1c35f7.c9744f') }} </el-radio>
            </el-radio-group>
            <br>
            <span class="tip">{{ $t('2d1c35f7.d0c1da') }}</span>
          </el-form-item>
          <el-form-item :label="$t('2d1c35f7.0ee50e')">
            <!--          <el-input type="number" min="0" max="10" :precision="2" @keydown="handleInput2" v-model="form.tax_rate" placeholder="请输入整数">
                        <template slot="append">%</template>
                      </el-input>-->
            <el-input-number
              v-model="form.tax_rate"
              controls-position="right"
              :controls="false"
              :precision="2"
              :step="0.1"
              :min="0"
              :max="100"
            />
            <span style="margin-left: 5px">%</span>
            <br>
            <span class="tip"
              >{{ $t('2d1c35f7.a75b32') }}
              <a href="/entity/goodsbase/goodsmaincategory">{{ $t('2d1c35f7.a1a244') }}</a></span
            >
          </el-form-item>
          <el-form-item :label="$t('2d1c35f7.e4ac84')">
            <SpRichText v-model="form.quota_tip" />
            <!-- <span class="tip">依据《关于跨境电子商务零售进口税收政策的通知》个人单次跨境购物消费限额未5000元。跨境消费年度交易限额未2万6千元。超过限额将会无法清关。</span> -->
          </el-form-item>

          <el-form-item :label="$t('2d1c35f7.68fc4d')">
            <el-input v-model="form.logistics" type="text" />
          </el-form-item>

          <el-form-item size="large">
            <el-button>{{ $t('2d1c35f7.625fb2') }}</el-button>
            <el-button type="primary" @click="save"> {{ $t('2d1c35f7.be5fbb') }} </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCrossborderSet, saveCrossborderSet } from '../../../api/crossborder'

export default {
  components: {},

  data() {
    return {
      loading: false,
      form: {
        tax_rate: '',
        quota_tip: '',
        crossborder_show: 0,
        logistics: ''
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 输入限制小数点两位
    handleInput2(e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null
    },
    // 获取信息
    getInfo() {
      this.loading = true
      getCrossborderSet(this.params).then((res) => {
        this.form.tax_rate = res.data.data.tax_rate
        this.form.quota_tip = res.data.data.quota_tip
        this.form.crossborder_show = res.data.data.crossborder_show
        this.form.logistics = res.data.data.logistics
        this.loading = false
      })
    },
    // 内容更新
    updateContent: function (data) {
      this.form.quota_tip = data
    },
    // 保存数据
    save() {
      saveCrossborderSet(this.form).then((res) => {
        this.$message({ type: 'success', message: this.$t('2d1c35f7.33130f') })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: #909399;
}
</style>
