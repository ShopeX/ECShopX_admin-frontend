<template>
  <el-card header="基础信息">
    <el-form
      ref="form"
      :model="form"
      label-width="auto"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="店铺号"
            prop="shop_code"
            :rules="rules.shop_code"
          >
            <el-input
              v-model="form.shop_code"
              :maxlength="10"
              placeholder="请输入店铺号"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="店铺名称"
            :rules="rules.name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入店铺名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="联系人姓名"
            :rules="rules.contact"
          >
            <el-input
              v-model="form.contact"
              placeholder="请输入联系人姓名"
              :disabled="form.datapass_block == 1 && distributor_id > 0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="联系方式"
            :rules="rules.mobile"
          >
            <el-input
              v-model="form.mobile"
              placeholder="请输入联系人手机号"
              :disabled="form.datapass_block == 1 && distributor_id > 0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="固定座机">
            <el-input
              v-model="form.contract_phone"
              placeholder="请输入联系人座机号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经营时间">
            <el-time-select
              v-model="startTime"
              placeholder="起始时间"
              style="width: 45%"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59'
              }"
            />
            <el-time-select
              v-model="endTime"
              placeholder="结束时间"
              style="width: 45%"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59',
                minTime: startTime
              }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否支持自提">
            <el-switch
              v-if="!form.lng && !form.lat"
              v-model="form.is_ziti"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <el-switch
              v-else
              v-model="form.is_ziti"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>

        <el-col
          v-if="!distributor_type"
          :span="8"
        >
          <el-form-item label="是否快递">
            <el-switch
              v-model="form.is_delivery"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="$store.getters.login_type != 'merchant' && externalForm.distribution_type != '1'"
          :span="8"
        >
          <el-form-item label="审核商品">
            <el-switch
              v-model="form.is_audit_goods"
              inactive-color="#ff4949"
              active-color="#13ce66"
            />
            <div class="frm-tips">
              开启后，店铺添加的自有商品，需要平台审核通过后才可以上架
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            v-if="
              VERSION_STANDARD &&
                this.$store.getters.login_type != 'distributor' &&
                !distributor_type
            "
            label="商品自动上架且总部发货"
          >
            <el-switch
              v-model="form.auto_sync_goods"
              inactive-color="#ff4949"
              active-color="#13ce66"
            />
            <div class="frm-tips">
              开启后，创建店铺时自动上架所有总部商品且总部发货（同步总部库存），后续总部新上商品在店铺自动上架且总部发货；该按钮不影响已手动操作过的店铺商品。
            </div>
          </el-form-item>
        </el-col>
        <el-col
          v-if="!distributor_type"
          :span="8"
        >
          <el-form-item label="下单是否需要选择街道居委">
            <el-switch
              v-model="form.is_require_subdistrict"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="!distributor_type"
          :span="8"
        >
          <el-form-item label="下单是否需要填写楼号房号">
            <el-switch
              v-model="form.is_require_building"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8"> </el-col> -->
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
export default {
  props: ['disabled', 'distributor_type', 'externalForm'],
  data () {
    return {
      form: {
        shop_code: '',
        name: '',
        contact: '',
        mobile: '',
        contract_phone: '', //座机
        lng: '',
        lat: '',
        is_ziti: false,
        is_delivery: true,
        auto_sync_goods: false,
        is_audit_goods: true,
        datapass_block: 1,
        is_require_subdistrict: false,
        is_require_building: false,
      },
      rules: {
        shop_code: [
          {
            pattern: /^[A-Za-z0-9\-]+$/,
            message: '请输入正确格式的店铺号',
            required: true
          }
        ],
        name: [{ pattern: /^[*]*$/, message: '店铺名称必填', required: true }],
        contact: [{ message: '联系人必填', required: true }],
        mobile: [{ message: '手机必填', required: true }],
        dada_type: [{ message: '达达业务类型必填', required: true }]
      },
      startTime: '08:00',
      endTime: '21:00',
      distributor_id: null
    }
  },
  watch: {
    externalForm: {
      handler (val) {
        console.log(val, 'val')
        if (val.lng) {
          this.form.lng = val.lng
        }
        if (val.lat) {
          this.form.lat = val.lat
        }
        if (val.shop_code) {
          this.form.shop_code = val.shop_code
        }
        if (val.name) {
          this.form.name = val.name
        }
        if (val.contact) {
          this.form.contact = val.contact
        }
        if (val.mobile) {
          this.form.mobile = val.mobile
        }
        if (val.contract_phone) {
          this.form.contract_phone = val.contract_phone
        }
        if (val.hour) {
          // 处理营业时间的格式
          let open_time = val.hour.split('-')
          this.startTime = open_time[0]
          this.endTime = open_time[1]
        }
        if (val.is_require_subdistrict) {
          this.form.is_require_subdistrict = val.is_require_subdistrict
        }
        if (val.is_require_building) {
          this.form.is_require_building = val.is_require_building
        }

        if (val.is_ziti) {
          // 处理营业时间的格式
          this.form.is_ziti = val.is_ziti
        }
        if (val.is_delivery) {
          // 处理营业时间的格式
          this.form.is_delivery = val.is_delivery
        }
        if (val.auto_sync_goods) {
          this.form.auto_sync_goods = val.auto_sync_goods
        }
        this.form.datapass_block = val.datapass_block
        this.form.is_audit_goods = val.is_audit_goods
      },
      deep: true
    }
  },
  mounted () {
    this.distributor_id = this.$route.query.distributor_id
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.cunstom_required {
  &:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
