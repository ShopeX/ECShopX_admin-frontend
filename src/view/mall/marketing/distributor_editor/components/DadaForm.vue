<template>
  <el-card v-if="show">
    <div slot="header">
      <div style="display: flex; align-items: center">
        <div>同城配</div>
        <div class="frm-tips">
          (需先选择店铺地理位置，系统根据店铺位置判断该地区是否支持同城配)
        </div>
      </div>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-width="110px"
    >
      <el-row>
        <el-col :span="16">
          <div class="flexDada">
            <el-form-item label="达达同城配">
              <el-switch
                v-model="form.is_dada"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
            <el-alert
              type="info"
              :closable="false"
            >
              <div slot="title">
                开启后有店铺订单时需要改店铺人员手动接单，接单后系统会自动在达达平台下单
              </div>
            </el-alert>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="isOpen">
        <el-col :span="8">
          <el-form-item
            label="业务类型"
            :rules="rules.dada_type"
          >
            <el-select
              v-model="form.business"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { getDadaInfo } from '@/api/mall/dada'
export default {
  props: ['rules', 'externalForm'],
  data () {
    return {
      form: {
        is_dada: '0',
        business: ''
      },
      typeList: [],
      isOpen: false,
      show: false
    }
  },
  watch: {
    form: {
      handler (val) {
        if (val.is_dada === '1') {
          this.isOpen = true
        } else {
          this.isOpen = false
          this.form.business = ''
        }
      },
      deep: true
    },
    show: {
      handler (val) {
        if (val === false) {
          this.form = {
            is_dada: '0',
            business: ''
          }
        }
      }
    },
    externalForm: {
      handler (val) {
        if (val.is_dada) {
          this.form.is_dada = val.is_dada === true ? '1' : '0'
        }
        if (val.business) {
          this.form.business = val.business
        }
      },
      deep: true
    }
  },

  mounted () {
    getDadaInfo().then((res) => {
      const {
        data: {
          data: { business_list, is_open }
        }
      } = res

      this.typeList = Object.keys(business_list).reduce((total, current, index) => {
        return total.concat({
          value: Number(current),
          label: business_list[current]
        })
      }, [])
      console.log('typeList', this.typeList)
      this.show = is_open === '1'
      this.$emit('onChangeData', 'dadaShow', is_open === '1')
    })
  }
}
</script>

<style lang="scss">
.flexDada {
  display: flex;
  align-items: center;

  .el-form-item {
    margin-bottom: 0px;
    margin-right: 10px;
  }
}
</style>
