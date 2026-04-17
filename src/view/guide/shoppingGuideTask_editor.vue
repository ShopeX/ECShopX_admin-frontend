<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form :model="dataForm" label-width="120px">
      <el-form-item :label="$t('d8306401.78caf7')">
        <el-input v-model="dataForm.task_name" class="input-m" />
      </el-form-item>
      <el-form-item :label="$t('d8306401.b341f9')">
        <el-date-picker
          v-model="date_range"
          type="datetimerange"
          value-format="timestamp"
          style="width: 380px"
        />
      </el-form-item>
      <el-form-item :label="$t('d8306401.bb763c')">
        <el-select v-model="dataForm.task_type" :placeholder="$t('d8306401.708c9d')">
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="$t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('d8306401.54dbe3')">
        <el-input v-model="dataForm.task_quota" class="input-m" type="number" />
      </el-form-item>
      <el-form-item :label="$t('d8306401.54d363')">
        <div>
          <div class="pics-box">
            <ul class="goodspic-wrap">
              <draggable
                v-model="dataForm.pics"
                :options="dragIssuesOptions"
                class="components-view"
              >
                <li
                  v-for="(item, index) in dataForm.pics"
                  :key="index"
                  class="goodspic"
                  @mouseenter="picsEnter(index)"
                  @mouseleave="picsLeave"
                >
                  <img :src="wximageurl + item" />
                  <div class="goodspic-mask" :class="picsCurrent == index ? 'on' : ''">
                    <div class="el-icon-delete" @click="removePicsImg(index)" />
                    <div class="el-icon-rank" />
                  </div>
                </li>
              </draggable>
            </ul>
            <div v-if="dataForm.pics.length < 9" class="upload-box" @click="handlePicsChange">
              <i class="el-icon-camera" />
            </div>
          </div>
          <div class="frm-tips">
            <p>{{ $t('d8306401.96b8d8') }}</p>
            <p>{{ $t('d8306401.2eceaf') }}</p>
          </div>
        </div>
        <imgPicker
          :dialog-visible="picsDialog"
          :sc-status="isGetPics"
          :is-most="multiple"
          @chooseImg="pickPics"
          @closeImgDialog="closePicsDialog"
        />
      </el-form-item>
      <el-form-item :label="$t('d8306401.2d711b')">
        <SpRichText v-model="dataForm.task_content" />
      </el-form-item>
      <el-card :header="$t('d8306401.295713')" shadow="naver">
        <el-form-item :label="$t('d8306401.eb4307')">
          <el-radio-group v-model="dataForm.use_all_distributor" @change="shopTypeChange">
            <el-radio :label="true">{{ $t('d8306401.87e0ad') }}</el-radio>
            <el-radio :label="false">{{ $t('d8306401.3640e1') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="!zdShopHidden">
          <el-button type="primary" @click="addDistributorAction">
            {{ $t('d8306401.afa2e6') }}
          </el-button>
          <el-table
            v-if="distributor_info.length > 0"
            :data="distributor_info"
            style="line-height: normal"
          >
            <el-table-column label="ID" prop="distributor_id" width="60" />
            <el-table-column :label="$t('d8306401.d7ec2d')" prop="name" />
            <el-table-column prop="address" :label="$t('d8306401.765048')" show-overflow-tooltip />
            <el-table-column :label="$t('d8306401.2b6bc0')" width="50">
              <template slot-scope="scope">
                <i class="el-icon-delete" @click="deleteDistritutorRow(scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-form>
    <div class="content-center content-padded-b">
      <el-button type="primary" @click="handelClickSubmit">{{ $t('d8306401.be5fbb') }}</el-button>
    </div>
    <DistributorSelect
      :store-visible="distributorVisible"
      :is-valid="true"
      :rel-data-ids="distributor_info"
      :get-status="setDistributorStatus"
      return-type="selectRow"
      @chooseStore="chooseDistributorAction"
      @closeStoreDialog="closeDistributorDialogAction"
    />
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import imgPicker from '@/components/imageselect'
import { mapGetters } from 'vuex'
import { getSalesperosnTaskInfo, createSalesperosnTask, updateSalesperosnTask } from '@/api/shop'
import DistributorSelect from '@/components/storeListSelect'

export default {
  inject: ['refresh'],
  components: {
    DistributorSelect,
    draggable,
    imgPicker
  },
  data() {
    return {
      task_id: '',
      type: [
        { value: 1, labelKey: 'd8306401.22ddc3' },
        { value: 2, labelKey: 'd8306401.93ee1b' },
        { value: 3, labelKey: 'd8306401.7a13b6' },
        { value: 4, labelKey: 'd8306401.61aa3e' }
      ],
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.el-icon-rank',
        draggable: '.goodspic'
      },
      isGetThumb: false,
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0,
      multiple: false,
      currentSku: -1,
      currentPage: 1,
      distributorVisible: false,
      zdShopHidden: true,
      setDistributorStatus: false,
      distributor_info: [],
      relDistributorIds: [],
      use_all_distributor: false,
      date_range: '',
      dataForm: {
        task_name: '',
        task_type: '',
        task_quota: '',
        pics: [],
        task_content: '',
        use_all_distributor: true,
        distributor_id: []
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.task_id = this.$route.params.task_id
    if (this.task_id) {
      this.getTaskInfo()
    }
  },
  methods: {
    /**
     * 保存 || 修改
     * */
    async handelClickSubmit() {
      if (this.date_range.length > 0) {
        this.dataForm.start_time = this.date_range[0] / 1000
        this.dataForm.end_time = this.date_range[1] / 1000
      }
      let message = ''
      if (!this.task_id) {
        // 新增
        await createSalesperosnTask(this.dataForm)
        message = this.$t('d8306401.3fdaea')
      } else {
        // 修改
        await updateSalesperosnTask(this.task_id, this.dataForm)
        message = this.$t('d8306401.69be67')
      }
      this.$message({
        message,
        type: 'success'
      })
      this.refresh()
      this.$router.go(-1)
    },

    chooseDistributorAction(data) {
      this.distributorVisible = false
      if (!data || data === null || data.length <= 0) {
        this.distributor_info = []
        return
      }
      this.distributor_info = data
      this.dataForm.distributor_id = []
      for (let i = 0; i < data.length; i++) {
        const id = data[i].distributor_id
        this.dataForm.distributor_id.push(Number(id))
      }
    },

    closeDistributorDialogAction() {
      this.distributorVisible = false
    },

    addDistributorAction() {
      this.distributorVisible = true
      this.setDistributorStatus = true
      this.relDistributorIds = this.dataForm.distributor_id
    },

    shopTypeChange(val) {
      this.dataForm.use_all_distributor = true
      this.zdShopHidden = true
      if (val === false) {
        this.dataForm.use_all_distributor = false
        this.zdShopHidden = false
        this.dataForm.distributor_id = []
        this.distributor_info = []
      }
    },

    handelChangeUpdateContent(data) {
      this.dataForm.task_content = data
    },

    /**
     * 获取导购通知
     * */
    async getTaskInfo() {
      let { data } = await getSalesperosnTaskInfo(this.task_id)
      this.dataForm = data.data
      this.date_range = [data.data.start_time * 1000, data.data.end_time * 1000]
      if (!data.data.use_all_distributor) {
        this.zdShopHidden = false
      }
      this.distributor_info = data.data.distributor_info
      this.$delete(this.dataForm, 'distributor_info')
    },
    deleteDistritutorRow(index) {
      this.distributor_info.splice(index, 1)
      let shopDatas = this.distributor_info
      this.dataForm.distributor_id = []
      for (let i = 0; i < shopDatas.length; i++) {
        if (this.dataForm.distributor_id.indexOf(Number(shopDatas[i].distributor_id)) < 0) {
          this.dataForm.distributor_id.push(Number(shopDatas[i].distributor_id))
        }
      }
    },
    pickPics(data) {
      if (this.currentSku === -1) {
        if (this.picsOldLen + data.length >= 10) {
          this.$message.error(this.$t('d8306401.4352be'))
          return false
        } else {
          if (data.length != 0) {
            data.forEach((data) => {
              if (data && data.url !== '') {
                this.dataForm.pics.push(data.url)
                this.picsOldLen = this.dataForm.pics.length
              }
            })
          }
        }
      } else {
        if (this.specImages[this.currentSku].item_image_url.length + data.length > 5) {
          this.$message.error(this.$t('d8306401.5bd788'))
          return false
        }
        if (data.length > 0) {
          data.forEach((data) => {
            if (data && data.url !== '') {
              this.specImages[this.currentSku].item_image_url.push(data.url)
            }
          })
        }
        this.currentSku = -1
      }
      this.picsDialog = false
    },
    //上传商品图（9张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.dataForm.pics.splice(index, 1)
      this.picsOldLen = this.dataForm.pics.length
    }
  }
}
</script>

<style scoped lang="scss">
.components-view {
  .goodspic {
    position: relative;
    float: left;
    width: 146px;
    height: 146px;
    margin: 0 5px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
