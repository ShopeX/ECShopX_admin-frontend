<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-form
        v-model="form"
        label-width="200px"
      >
        <el-row :gutter="20">
          <el-col
            v-for="(item, index) in form"
            :key="index"
            :span="10"
          >
            <el-form-item label="收货人">
              <el-input
                v-model="item.username"
                placeholder="姓名"
                style="width: 55%"
              />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input
                v-model="item.telephone"
                placeholder="11位手机号"
                style="width: 55%"
              />
            </el-form-item>
            <el-form-item label="地区信息">
              <el-cascader
                v-model="item.regions_id"
                :options="regions"
                @visible-change="changeClick(index)"
                @change="handleRegionChange"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input
                v-model="item.adrdetail"
                placeholder="详细地址"
              />
            </el-form-item>
            <el-form-item label="邮政编码">
              <el-input
                v-model="item.postalCode"
                placeholder="邮政编码"
              />
            </el-form-item>
            <el-form-item v-if="index === 1">
              <el-button
                type="text"
                @click="delAddress(index)"
              >
                删除
              </el-button>
            </el-form-item>
          </el-col>
          <el-col
            v-if="isShow"
            :span="2"
          >
            <div>
              <i
                class="el-icon-plus avatar-uploader-icon"
                @click="addAddress"
              />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        @click="saveAddress"
      >
        确认保存
      </el-button>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSelfDeliveryAddress, setSelfDeliveryAddress } from '@/api/company'
import district from '../../../common/district.json'

// 取选中地区的值
function getCascaderObj (val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  data () {
    return {
      form: [
        {
          username: '',
          telephone: '',
          regions_id: [],
          adrdetail: '',
          adrdetail: '',
          postalCode: '',
          provinceName: '',
          cityName: '',
          countyName: ''
        }
      ],
      detailDialog: false,
      regions: district,
      isShow: true,
      regionsIndex: 0
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getList()
  },
  methods: {
    editAddress (item) {
      this.params.page = 1
      this.getList()
    },
    addAddress () {
      let form = {
        username: '',
        telephone: '',
        regions_id: [],
        adrdetail: '',
        adrdetail: '',
        postalCode: ''
      }
      this.form.push(form)
      if (this.form.length >= 2) {
        this.isShow = false
      }
    },
    delAddress (index) {
      this.form.splice(index, 1)
      if (this.form.length < 2) {
        this.isShow = true
      }
    },
    saveAddress () {
      let params = { addreeList: this.form }
      setSelfDeliveryAddress(params).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    getList () {
      getSelfDeliveryAddress().then((res) => {
        if (res.data.data) {
          this.form = res.data.data
          if (this.form.length >= 2) {
            this.isShow = false
          }
        }
      })
    },
    handleRegionChange: function (value) {
      let index = this.regionsIndex
      var vals = getCascaderObj(value, this.regions)
      this.form[index].regions_id = []
      this.form[index].regions = []
      if (vals.length == 2) {
        this.form[index].provinceName = vals[0].label
        this.form[index].cityName = vals[1].label
        this.form[index].countyName = ''
      } else if (vals.length == 3) {
        this.form[index].provinceName = vals[0].label
        this.form[index].cityName = vals[1].label
        this.form[index].countyName = vals[2].label
      }
      for (var i = 0; i < vals.length; i++) {
        this.form[index].regions_id[i] = vals[i].value
        this.form[index].regions[i] = vals[i].label
      }
    },
    changeClick (index) {
      this.regionsIndex = index
    }
  }
}
</script>
