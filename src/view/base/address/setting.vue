<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-form v-model="form" label-width="200px">
        <el-row :gutter="20">
          <el-col v-for="(item, index) in form" :key="index" :span="10">
            <el-form-item :label="$t('a5bbd9ef.6aea70')">
              <el-input
                v-model="item.username"
                :placeholder="$t('a5bbd9ef.60d045')"
                style="width: 55%"
              />
            </el-form-item>
            <el-form-item :label="$t('a5bbd9ef.92448a')">
              <el-input
                v-model="item.telephone"
                :placeholder="$t('a5bbd9ef.7e03bb')"
                style="width: 55%"
              />
            </el-form-item>
            <el-form-item :label="$t('a5bbd9ef.dd73ba')">
              <el-cascader
                v-model="item.regions_id"
                :options="regions"
                @visible-change="changeClick(index)"
                @change="handleRegionChange"
              />
            </el-form-item>
            <el-form-item :label="$t('a5bbd9ef.61a0ec')">
              <el-input v-model="item.adrdetail" :placeholder="$t('a5bbd9ef.61a0ec')" />
            </el-form-item>
            <el-form-item :label="$t('a5bbd9ef.b4a39e')">
              <el-input v-model="item.postalCode" :placeholder="$t('a5bbd9ef.b4a39e')" />
            </el-form-item>
            <el-form-item v-if="index === 1">
              <el-button type="text" @click="delAddress(index)">
                {{ $t('a5bbd9ef.2f4aad') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col v-if="isShow" :span="2">
            <div>
              <i class="el-icon-plus avatar-uploader-icon" @click="addAddress" />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="saveAddress"> {{ $t('a5bbd9ef.babc8f') }} </el-button>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSelfDeliveryAddress, setSelfDeliveryAddress } from '@/api/company'
import district from '../../../common/district.json'

// 取选中地区的值
function getCascaderObj(val, opt) {
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
  data() {
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
  mounted() {
    this.getList()
  },
  methods: {
    editAddress(item) {
      this.params.page = 1
      this.getList()
    },
    addAddress() {
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
    delAddress(index) {
      this.form.splice(index, 1)
      if (this.form.length < 2) {
        this.isShow = true
      }
    },
    saveAddress() {
      let params = { addreeList: this.form }
      setSelfDeliveryAddress(params).then((res) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    getList() {
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
    changeClick(index) {
      this.regionsIndex = index
    }
  }
}
</script>
