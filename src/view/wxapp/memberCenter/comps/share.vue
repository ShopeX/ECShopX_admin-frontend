<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /app/src/view/base/setting/memberCenter/redirect.vue
 * @Date: 2020-11-19 15:44:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-28 10:04:01
-->
<template>
  <div>
    <el-form ref="form" :model="form.data" label-position="left" label-width="100px" :rules="rules">
      <div class="section-body">
        <el-form-item label="分享信息" class="title" />
        <el-form-item label="分享标题" prop="title">
          <el-input
            v-model="form.data.title"
            :maxlength="15"
            placeholder="字数上限为15个汉字"
            style="width: 300px"
          />&nbsp;<span class="frm-tips">{{ form.data.title.length }}/{{ gift_max }}</span>
        </el-form-item>
        <el-form-item label="分享描述" prop="description">
          <el-input
            v-model="form.data.description"
            :maxlength="30"
            type="textarea"
            :rows="2"
            style="width: 300px"
            placeholder="字数上限为30个汉字"
          />&nbsp;
          <div class="frm-tips2" style="">
            {{ form.data.description.length }}/{{ description_max }}
          </div>
        </el-form-item>
        <el-form-item label="分享图片" class="inline-label paddingleft9">
          <div class="inline">
            <imgBox
              :img-url="form.data.pic"
              inline
              bottom-info="小程序"
              @click="handleImgChange('pic')"
            />
            <p>建议尺寸5:4</p>
          </div>
        </el-form-item>
        <el-form-item label="预览效果" class="inline-label paddingleft9">
          <el-button size="small" type="primary" style="margin-bottom: 20px"> 小程序 </el-button>
          <wechatShare :title="form.data.title" :content-img-src="form.data.pic" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="saveConfig"> 保存 </el-button>
      </div>
    </el-form>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import wechatShare from '@/components/wechatshare'
import { savePageParams, getParamByTempName, setShareInfo, getShareInfo } from '@/api/wxa'
import { getDistributorInfo } from '@/api/marketing'
import imgBox from '@/components/element/imgBox'
export default {
  components: {
    imgBox,
    imgPicker,
    wechatShare
  },
  data() {
    var titleChecked = (rule, value, callback) => {
      if (value == '' || !value) {
        callback(new Error('分享标题不能为空'))
      } else {
        callback()
      }
    }
    var descriptionChecked = (rule, value, callback) => {
      if (value == '' || !value) {
        callback(new Error('分享描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'redirect',
      loading: false,
      form: {
        name: 'base',
        data: {
          title: '震惊！这店绝了！',
          description: '我发现了一家特别好的店，一起来看看吧？',
          pic: ''
        }
      },
      remnant: 0,
      fileList: [],
      isGetImage: false,
      pickerImgType: 'no_login',
      gift_max: 15,
      description_max: 30,
      rules: {
        title: [{ required: true, validator: titleChecked, trigger: 'blur' }],
        description: [{ required: true, validator: descriptionChecked, trigger: 'blur' }]
      },
      imgDialog: false,
      isGetImage: false,
      pickerImgType: 'no_login'
    }
  },
  computed: {
    ...mapGetters(['wheight', 'wwidth', 'app_type', 'template_name', 'ali_template_name'])
  },
  mounted() {
    getDistributorInfo({ distributor_id: 0 }).then(({ data: { data } }) => {
      if (!this.form.data.pic) {
        this.form.data.pic = data && data.logo ? data.logo : ''
      }
    })
    // let params = {type: this.app_type === 'wechat' ? this.template_name : this.ali_template_name}
    // getShareInfo(params).then(({ data: { data }, status }) => {
    //   if (!Array.isArray(data) && data) {
    //     Object.assign(this.form.data, {
    //       title: data.share_title,
    //       description: data.share_description,
    //       pic: data.share_pic_wechatapp ? data.share_pic_wechatapp : ''
    //     })
    //   }
    // })
    getShareInfo().then(({ data: { data }, status }) => {
      if (!Array.isArray(data) && data) {
        Object.assign(this.form.data, {
          title: data.share_title,
          description: data.share_description,
          pic: data.share_pic_wechatapp ? data.share_pic_wechatapp : ''
        })
      }
    })
  },
  methods: {
    handleClick(tab, event) {},
    //门店LOGO
    handleImgChange(pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.pickerImgType == 'pic') {
        this.form.data.pic = data.url
      }
      this.imgDialog = false
    },
    // 保存设置
    saveConfig() {
      const { title, description, pic } = this.form.data
      let info = {
        share_title: title,
        share_description: description,
        share_pic_wechatapp: pic,
        type: this.template_name
        // type: this.app_type === 'wechat' ? this.template_name : this.ali_template_name
      }
      setShareInfo(info).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>

<style lang="scss">
.title {
  .el-form-item__label {
    font-size: 16px !important;
    font-weight: bold !important;
  }
}
.inline-label {
  .inline {
    display: inline-block;
  }
  p {
    color: grey;
    text-align: center;
    line-height: 2;
  }
}
.paddingleft9 {
  .el-form-item__label {
    padding-left: 9px;
  }
}
.frm-tips2 {
  display: inline-block;
  padding: 18px 0;
  color: #8d8d8d;
  line-height: 1.5;
  font-size: 12px;
  position: relative;
  left: -5px;
}
</style>
