<template>
  <div>
    <el-form
      :model="dataForm"
      label-width="120px"
    >
      <el-form-item label="任务名称">
        <el-input
          v-model="dataForm.task_name"
          class="input-m"
        />
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="date_range"
          type="datetimerange"
          value-format="timestamp"
          style="width: 380px"
        />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select
          v-model="dataForm.task_type"
          placeholder="请选择"
        >
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务完成指标">
        <el-input
          v-model="dataForm.task_quota"
          class="input-m"
          type="number"
        />
      </el-form-item>
      <el-form-item label="素材">
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
                  <img :src="wximageurl + item">
                  <div
                    class="goodspic-mask"
                    :class="picsCurrent == index ? 'on' : ''"
                  >
                    <div
                      class="iconfont icon-trash-alt"
                      @click="removePicsImg(index)"
                    />
                    <div class="iconfont icon-arrows-alt" />
                  </div>
                </li>
              </draggable>
            </ul>
            <div
              v-if="dataForm.pics.length < 9"
              class="upload-box"
              @click="handlePicsChange"
            >
              <i class="iconfont icon-camera" />
            </div>
          </div>
          <div class="frm-tips">
            <p>1. 最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M</p>
            <p>2. 拖动图片进行可排序</p>
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
      <el-form-item label="内容">
        <vue-html5-editor
          ref="editor"
          :content="dataForm.task_content"
          :height="360"
          @change="handelChangeUpdateContent"
        />
      </el-form-item>
      <el-card
        header="店铺"
        shadow="naver"
      >
        <el-form-item label="适用店铺">
          <el-radio-group
            v-model="dataForm.use_all_distributor"
            @change="shopTypeChange"
          >
            <el-radio :label="true">
              全部店铺适用
            </el-radio>
            <el-radio :label="false">
              指定店铺适用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="!zdShopHidden">
          <el-button
            type="primary"
            @click="addDistributorAction"
          >
            选择店铺
          </el-button>
          <el-table
            v-if="distributor_info.length > 0"
            :data="distributor_info"
            style="line-height: normal"
          >
            <el-table-column
              label="ID"
              prop="distributor_id"
              width="60"
            />
            <el-table-column
              label="名称"
              prop="name"
            />
            <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              width="50"
            >
              <template slot-scope="scope">
                <i
                  class="iconfont icon-trash-alt"
                  @click="deleteDistritutorRow(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-form>
    <div class="content-center content-padded-b">
      <el-button
        type="primary"
        @click="handelClickSubmit"
      >
        保存
      </el-button>
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
  data () {
    return {
      task_id: '',
      type: [
        {
          value: 1,
          label: '转发分享'
        },
        {
          value: 2,
          label: '获取新客'
        },
        {
          value: 3,
          label: '客户下单'
        },
        {
          value: 4,
          label: '会员福利'
        }
      ],
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
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
  mounted () {
    this.task_id = this.$route.params.task_id
    if (this.task_id) {
      this.getTaskInfo()
    }
  },
  methods: {
    /**
     * 保存 || 修改
     * */
    async handelClickSubmit () {
      if (this.date_range.length > 0) {
        this.dataForm.start_time = this.date_range[0] / 1000
        this.dataForm.end_time = this.date_range[1] / 1000
      }
      let message = ''
      if (!this.task_id) {
        // 新增
        await createSalesperosnTask(this.dataForm)
        message = '添加成功'
      } else {
        // 修改
        await updateSalesperosnTask(this.task_id, this.dataForm)
        message = '修成成功'
      }
      this.$message({
        message,
        type: 'success'
      })
      this.refresh()
      this.$router.go(-1)
    },

    chooseDistributorAction (data) {
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

    closeDistributorDialogAction () {
      this.distributorVisible = false
    },

    addDistributorAction () {
      this.distributorVisible = true
      this.setDistributorStatus = true
      this.relDistributorIds = this.dataForm.distributor_id
    },

    shopTypeChange (val) {
      this.dataForm.use_all_distributor = true
      this.zdShopHidden = true
      if (val === false) {
        this.dataForm.use_all_distributor = false
        this.zdShopHidden = false
        this.dataForm.distributor_id = []
        this.distributor_info = []
      }
    },

    handelChangeUpdateContent (data) {
      this.dataForm.task_content = data
    },

    /**
     * 获取导购通知
     * */
    async getTaskInfo () {
      let { data } = await getSalesperosnTaskInfo(this.task_id)
      this.dataForm = data.data
      this.date_range = [data.data.start_time * 1000, data.data.end_time * 1000]
      if (!data.data.use_all_distributor) {
        this.zdShopHidden = false
      }
      this.distributor_info = data.data.distributor_info
      this.$delete(this.dataForm, 'distributor_info')
    },
    deleteDistritutorRow (index) {
      this.distributor_info.splice(index, 1)
      let shopDatas = this.distributor_info
      this.dataForm.distributor_id = []
      for (let i = 0; i < shopDatas.length; i++) {
        if (this.dataForm.distributor_id.indexOf(Number(shopDatas[i].distributor_id)) < 0) {
          this.dataForm.distributor_id.push(Number(shopDatas[i].distributor_id))
        }
      }
    },
    pickPics (data) {
      if (this.currentSku === -1) {
        if (this.picsOldLen + data.length >= 10) {
          this.$message.error('最多上传9张图片!')
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
          this.$message.error('最多添加5张图片!')
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
    closePicsDialog () {
      this.picsDialog = false
    },
    picsEnter (index) {
      this.picsCurrent = index
    },
    picsLeave () {
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
