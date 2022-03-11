<template>
  <div class="section-white content-padded">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <div class="section-header with-border">
        <h3>{{ resourceName }}添加</h3>
      </div>
      <div class="section-body">
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :maxlength="10"
            placeholder="请输入名称"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          label="所属门店"
          prop="shopId"
        >
          <el-select
            v-if="form.resourceLevelId"
            v-model="form.shopId"
            disabled
          >
            <el-option
              v-for="item in storeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-else
            v-model="form.shopId"
          >
            <el-option
              v-for="item in storeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务项目"
          prop="materialIds"
        >
          <!-- <el-button type="info" @click="addServer">添加服务项</el-button> -->
          <div class="server-box">
            <div class="server-head clearfix">
              <span class="f_l">服务目录({{ serverList.length }}项)</span>
              <div class="f_r">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="checkAllChange"
                >
                  全选
                </el-checkbox>
              </div>
            </div>
            <el-checkbox-group
              v-model="form.materialIds"
              class="server-list"
              @change="handleCheckedChange"
            >
              <el-row>
                <el-col
                  v-for="(item, index) in serverList"
                  :key="index"
                  :span="6"
                  :title="item.label"
                >
                  <el-checkbox
                    :key="item.value"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item
          label="简介"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            resize="none"
            :maxlength="100"
            style="width: 50%"
          />&nbsp;<span class="frm-tips">{{ form.description.length }} / 100</span>
        </el-form-item>
        <!-- <el-form-item label="展示图" prop="imageUrl">
          <el-upload class="avatar-uploader" action="" :auto-upload="false" :show-file-list="false" :on-change="imgUpload" v-if="!form.imageUrl">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="upload-preview" v-if="form.imageUrl">
            <img :src="form.imageUrl ? wximageurl + form.imageUrl : ''" class="avatar" />
            <span class="icon-close" @click="removeImg"><i class="iconfont icon-times"></i></span>
          </div>
        </el-form-item> -->

        <el-form-item label="展示图">
          <div>
            <div
              class="upload-box"
              @click="handleImgChange"
            >
              <img
                v-if="form.imageUrl"
                :src="wximageurl + form.imageUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </div>
          </div>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="saveResource"
        >
          保存
        </el-button>
      </div>
    </el-form>

    <!-- <el-dialog title="添加服务项" :visible="dialogVisible" :close-on-click-modal="false" :before-close="cancelAdd">
      <div class="ceontent-padded">
        <el-form ref="addForm" :model="addForm" label-width="120px">
          <el-form-item label="服务项目：" prop="server_name">
            <el-input v-model="addForm.server_name" placeholder="服务项目名称" style="width: 240px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="saveServer">确定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { pushNewsImage } from '../../../../api/wechat'
import {
  getSetting,
  createResourceLevel,
  updateResourceLevel,
  getResourceLevel
} from '../../../../api/reservation'
import { getWxShopsList } from '../../../../api/shop'
import { getServiceLabelsList } from '../../../../api/goods'
import imgPicker from '../../../../components/imageselect'
export default {
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data () {
    var storeChecked = (rule, value, callback) => {
      if (value == '' || value <= 0) {
        return callback(new Error('所属门店不能为空'))
      }
      return callback()
    }
    var materialChecked = (rule, value, callback) => {
      if (value.length <= 0) {
        return callback(new Error('请选择服务项目'))
      }
      return callback()
    }
    var nameChecked = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('名称不能为空'))
      }
      if (value.length > 10) {
        return callback(new Error('名称不能超过10个汉字'))
      }
      return callback()
    }
    var descriptionChecked = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('简介不能为空'))
      }
      if (value.length > 100) {
        return callback(new Error('简介不能超过100个汉字'))
      }
      return callback()
    }
    return {
      resourceName: '',
      storeData: [],
      serverList: [],
      serverCheckedList: [],
      form: {
        resourceLevelId: '',
        name: '',
        shopId: '',
        shopName: '',
        materialIds: [],
        description: '',
        imageUrl: ''
      },
      addForm: {
        server_name: ''
      },
      rules: {
        name: [{ required: true, validator: nameChecked, trigger: 'blur' }],
        shopId: [{ required: true, validator: storeChecked, trigger: 'blur' }],
        materialIds: [{ required: true, validator: materialChecked, trigger: 'blur' }],
        description: [{ required: true, validator: descriptionChecked, trigger: 'blur' }]
        // imageUrl: [
        //   { required: true, message: "展示图不能为空", trigger: 'change' }
        // ]
      },
      checkAll: false,
      isIndeterminate: false,
      dialogVisible: false,
      imgDialog: false,
      isGetImage: false
    }
  },
  mounted () {
    this.resourceId = this.$route.query.id
    this.getLabelsList()
    this.getResourceName()
    this.getStoreList()
    if (this.resourceId) {
      this.getResourceLevel()
    }
  },
  methods: {
    handleCheckedCitiesChange (val) {},
    checkAllChange (event) {
      this.form.materialIds = event ? this.serverList : []
      if (event) {
        for (var i = 0; i < this.serverList.length; i++) {
          this.serverCheckedList.push(this.serverList[i].value)
        }
        this.form.materialIds = this.serverCheckedList
      } else {
        this.form.materialIds = []
      }
      this.isIndeterminate = false
    },
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.serverList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.serverList.length
    },
    //addServer () {
    //this.dialogVisible = true
    //},
    saveServer () {
      if (this.addForm.server_name == '') {
        this.$message.error('服务名称不能为空')
        return
      }
      this.dialogVisible = false
      this.serverList.push(this.addForm.server_name)
      this.addForm.server_name = ''
    },
    // imgUpload (file, fileList) {
    //   const isJPG = file.raw.type === 'image/jpeg'
    //   const isPNG = file.raw.type === 'image/png'
    //   const isLt2M = file.raw.size / 1024 / 1024 <= 2
    //   if (!isJPG && !isPNG) {
    //     this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
    //     return
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //     return
    //   }
    //   let params = {isUploadFile: true, file: file.raw}
    //   pushNewsImage(params).then(res => {
    //     this.form.imageUrl = res.data.data.url
    //   })
    // },
    // removeImg () {
    //   this.form.imageUrl = ''
    // },
    saveResource () {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var storeList = this.storeData
          var index
          for (index in storeList) {
            if (storeList[index].value == this.form.shopId) {
              this.form.shopName = storeList[index].label
            }
          }
          if (this.form.resourceLevelId) {
            updateResourceLevel(this.form).then((res) => {
              if (res.data.data.status) {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose () {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            createResourceLevel(this.form).then((res) => {
              if (res.data.data.status) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose () {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          }
        }
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    cancelAdd () {
      this.dialogVisible = false
    },
    getStoreList () {
      let params = { page: 1, pageSize: 500, isValid: 'true' }
      getWxShopsList(params).then((response) => {
        var shopList = response.data.data.list
        for (var i = 0; i < shopList.length; i++) {
          this.storeData.push({ value: shopList[i].wxShopId, label: shopList[i].storeName })
        }
        this.loading = false
      })
    },
    getLabelsList () {
      this.loading = true
      var params = { page: 1, pageSize: 100 }
      params.service_type = 'timescard'
      getServiceLabelsList(params).then((response) => {
        var labelsList = response.data.data.list
        var index
        for (index in labelsList) {
          this.serverList.push({
            value: Number(labelsList[index].labelId),
            label: labelsList[index].labelName
          })
        }
        this.loading = false
      })
    },
    getResourceLevel () {
      getResourceLevel(this.resourceId).then((res) => {
        this.form = res.data.data
      })
    },
    getResourceName () {
      getSetting().then((res) => {
        this.resourceName = res.data.data.resourceName
      })
    },
    //展示图
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.imageUrl = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  position: relative;
  display: flex;
  align-items: center;
  img {
    width: 100%;
  }
  .avatar-uploader-icon {
    font-size: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.upload-preview {
  text-align: center;
  max-width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  &:hover {
    .icon-close {
      display: block;
    }
  }
  img {
    max-width: 200px;
    margin: 0 auto;
  }
  .icon-close {
    display: none;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #8492a6;
    top: -10px;
    right: -10px;
    cursor: pointer;
    color: #fff;
    text-align: center;
    line-height: 16px;
    i {
      font-size: 16px;
    }
    &:hover {
      background-color: #ff4949;
    }
  }
}
.server {
  &-box {
    width: 80%;
    border: 1px solid #ddd;
  }
  &-head {
    padding: 4px 10px;
    background-color: #efefef;
  }
  &-list {
    padding: 10px 15px;
    line-height: 2;
    .content-right {
      padding-right: 28px;
    }
    .el-checkbox {
      display: inline-block;
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-name {
    display: inline-block;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
