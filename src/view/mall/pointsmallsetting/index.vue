<template>
  <div>
    <div class="title">
      积分商城基础设置
    </div>
    <el-card>
      <div style="width: 90%">
        <el-form
          v-loading="loading"
          label-width="180px"
          label-position="left"
        >
          <el-form-item label="入口配置">
            <span class="desc">开启后，您的用户能在对应界面进入积分商城页面使用积分换购商品。</span>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              移动端 <br>
              (包含小程序/H5/APP）
            </span>
            <el-switch
              v-model="entrance.mobile_openstatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card>
      <div style="width: 70%">
        <el-form
          v-loading="loading"
          label-width="180px"
          :model="form"
        >
          <el-form-item label="物流费用">
            <el-radio-group v-model="form.freight_type">
              <el-radio :label="'cash'">
                按现金
              </el-radio>
              <el-radio :label="'point'">
                按积分
              </el-radio>
            </el-radio-group>
            <br>
            <span class="tip">说明：运费使用现金或积分支付</span>
          </el-form-item>
          <el-form-item
            v-if="form.freight_type == 'point'"
            label="积分商城汇率设置"
          >
            <el-input
              v-model="form.proportion"
              type="number"
              placeholder=""
              style="width: 120px"
              :min="1"
              :max="9999999"
            />积分 抵扣1元人民币
          </el-form-item>
          <el-form-item
            v-if="form.freight_type == 'point'"
            label="积分取整设置"
          >
            <el-radio-group v-model="form.rounding_mode">
              <el-radio :label="'down'">
                向下取整
              </el-radio>
              <el-radio :label="'up'">
                向上取整
              </el-radio>
            </el-radio-group>
            <br>
            <span class="tip">说明：运费使用现金或积分支付</span>
          </el-form-item>
          <!-- <el-form-item size="large">
            <el-button>取消</el-button>
            <el-button type="primary" >保存</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>

    <GlobalFooter>
      <el-button
        type="primary"
        @click="save"
      >
        保存
      </el-button>
    </GlobalFooter>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSetting, saveSetting } from '../../../api/pointsmall'
import GlobalFooter from '@/components/global_footer'

export default {
  components: {},
  components: {
    GlobalFooter
  },

  data () {
    return {
      loading: false,
      form: {
        freight_type: 'cash',
        proportion: 0,
        rounding_mode: 'down'
      },
      //移动端是否开启积分模块
      entrance: {
        mobile_openstatus: false,
        pc_openstatus: false
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 输入限制小数点两位
    handleInput2 (e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null
    },
    // 获取列表
    getInfo () {
      this.loading = true
      getSetting().then((res) => {
        this.form.freight_type = res.data.data.freight_type
        this.form.proportion = res.data.data.proportion
        this.form.rounding_mode = res.data.data.rounding_mode
        this.entrance.mobile_openstatus =
          res.data.data.entrance && res.data.data.entrance.mobile_openstatus
            ? res.data.data.entrance.mobile_openstatus
            : false
        this.loading = false
      })
    },
    // 保存数据
    save () {
      saveSetting({
        ...this.form,
        entrance: {
          mobile_openstatus: this.entrance.mobile_openstatus
        }
      }).then((res) => {
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
.desc {
  color: #909399;
}
.title {
  margin-bottom: 20px;
  font-size: 16px;
}
</style>
