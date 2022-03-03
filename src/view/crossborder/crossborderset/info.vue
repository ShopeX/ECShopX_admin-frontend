<template>
  <div>
    <el-card>
      <div style="width: 70%;">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item label="跨境显示">
            <el-radio-group v-model="form.crossborder_show">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <br />
            <span class="tip">说明：用户端是否展示跨境购物车</span>
          </el-form-item>
          <el-form-item label="全局税率">
            <!--          <el-input type="number" min="0" max="10" :precision="2" @keydown="handleInput2" v-model="form.tax_rate" placeholder="请输入整数">
                        <template slot="append">%</template>
                      </el-input>-->
            <el-input-number
              controls-position="right"
              v-model="form.tax_rate"
              :controls="false"
              :precision="2"
              :step="0.1"
              :min="0"
              :max="100"
            >
            </el-input-number>
            <span style="margin-left: 5px;">%</span>
            <br />
            <span class="tip"
              >说明：跨境商品税率设置权重按 商品 -> 类目 ->
              全局，当商品及类目未设置时，按全局计算，以此类推
              <a href="/entity/goodsbase/goodsmaincategory">类目税率设置</a></span
            >
          </el-form-item>
          <el-form-item label="个人额度提醒">
            <vue-html5-editor
              :content="form.quota_tip"
              ref="editor"
              @change="updateContent"
              :height="360"
            ></vue-html5-editor>
            <!-- <span class="tip">依据《关于跨境电子商务零售进口税收政策的通知》个人单次跨境购物消费限额未5000元。跨境消费年度交易限额未2万6千元。超过限额将会无法清关。</span> -->
          </el-form-item>

          <el-form-item label="跨境物流编码">
            <el-input type="text" v-model="form.logistics"> </el-input>
          </el-form-item>

          <el-form-item size="large">
            <el-button>取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
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
    updateContent: function(data) {
      this.form.quota_tip = data
    },
    // 保存数据
    save() {
      saveCrossborderSet(this.form).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
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
