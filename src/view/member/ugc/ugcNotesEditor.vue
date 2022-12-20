<template>
  <div>
    <div class="form-title">
      编辑品牌笔记
    </div>
    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="ugc-form"
      label-width="120px"
    >
      <el-form-item
        label="笔记排序"
        prop="p_order"
        class="notMBot"
      >
        <el-row>
          <el-col :span="4">
            <el-checkbox
              v-model="is_top"
              @change="serialChanges"
            >
              置项
            </el-checkbox>
          </el-col>
          <el-col :span="20">
            <span class="text text-ml">
              最多置顶两篇笔记，置顶后将自动排序最优。
            </span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-input
              v-model="ruleForm.p_order"
              :disabled="is_top"
              type="number"
              class="mipt"
              min="0"
              max="50"
            />
          </el-col>
          <el-col :span="20">
            <span class="text text-ml">
              默认为0，排序数字越小优先级越高；相同优先级下
            </span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="笔记角标"
        prop="badges"
        class="bottom-bor"
      >
        <el-row>
          <el-col :span="16">
            <div
              v-if="ruleForm.badges"
              class="badgebar"
            >
              <span class="text">
                已选：{{ relFlag.badge_name }}
              </span>
              <span
                class="el-icon el-icon-close"
                @click="removeFlag"
              />
            </div>
            <span
              v-else
              class="text"
            >请选择</span>
          </el-col>
          <el-col
            :span="8"
            class="row-fright"
          >
            <el-button
              size="small"
              type="primary"
              plain
              @click="flagModalHide(true)"
            >
              打角标
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="笔记标题"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          maxlength="30"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item
        label="笔记描述"
        prop="content"
      >
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          :rows="5"
          maxlength="900"
          :show-word-limit="true"
        />
      </el-form-item>

      <el-form-item
        label="关联话题"
        prop="topics"
      >
        <el-row>
          <el-col :span="16">
            <span class="text">可多选，话题可在<b @click="pageTo('/marketing/ugc/ugctopic')">笔记话题配置</b>菜单中新建/修改</span>
          </el-col>
          <el-col
            :span="8"
            class="row-fright"
          >
            <el-button
              size="small"
              type="primary"
              plain
              @click="topicModalHide(true)"
            >
              选择话题
            </el-button>
          </el-col>
        </el-row>
        <el-row
          v-if="relTopics && relTopics.length"
          class="bgbar"
        >
          <el-col
            v-for="(item,index) in relTopics"
            :key="index"
            class="baritem"
          >
            <div @click="removeTopic(index)" :class="{'gray':item.status=='4'}">
              <span>{{ item.topic_name }}</span>
              <span class="el-icon el-icon-close" />
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="笔记图片"
        prop="images"
      >
        <el-row>
          <el-col :span="16">
            <span class="text">最多可选 {{ itemVideo&&itemVideo.media_id?8:9 }} 张图片</span>
          </el-col>
          <el-col
            :span="8"
            class="row-fright"
          >
            <el-button
              size="small"
              :type="picdanger?'danger':'primary'"
              plain
              @click="handlePicsChange"
            >
              选择图片
            </el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <div class="goodsimages-bd pics-box">
              <ul class="goodspic-wrap">
                <li
                  v-if="relImages.length<9"
                  class="goodspic livideo"
                >
                  <videoPicker
                    class="video-picker"
                    :data="itemVideo"
                    @change="pickVideo"
                    @videoloaded="getVideoCover"
                  />
                  <div
                    v-if="ruleForm.video"
                    class="goodspic-mask"
                  >
                    <div
                      class="iconfont icon-trash-alt"
                      @click="deleteVideo"
                    />
                  </div>
                </li>
                <draggable
                  v-model="relImages"
                  class="goodspic-drag"
                  :options="dragIssuesOptions"
                  style="position:'relative'"
                >
                  <li
                    v-for="(item, index) in relImages"
                    :key="index"
                    class="goodspic"
                  >
                    <div class="img-wrap">
                      <el-image
                        style="width: 100%; height: 100%"
                        :src="item.url"
                        @load="getImagesInfo($event,index)"
                      />
                      <div class="goodspic-mask">
                        <div
                          class="iconfont icon-trash-alt"
                          @click="removePicsImg(index)"
                        />
                        <div class="iconfont icon-arrows-alt" />
                      </div>
                    </div>
                  </li>
                </draggable>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="推荐商品"
        prop="goods"
      >
        <el-row>
          <el-col :span="16">
            <span class="text">最多可选 {{goodslimit}} 件商品</span>
          </el-col>
          <el-col
            :span="8"
            class="row-fright"
          >
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleAddItems"
            >
              选择商品
            </el-button>
          </el-col>
        </el-row>
        <SkuSelector
          ref="itemsSku"
          class="itemsSku"
          :limit="goodslimit"
          :data="relItems"
          @change="getItems"
        />
      </el-form-item>

      <el-form-item
        v-if="post_info?post_info.status:false"
        label="当前状态"
      >
        <span class="text">
          {{ post_info.status_text }}
        </span>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="!ruleForm.post_id"
          type="primary"
          @click="confirmHandle('ruleForm')"
        >
          创建并发布
        </el-button>

        <el-button
          v-if="ruleForm.post_id"
          type="primary"
          @click="confirmHandle('ruleForm')"
        >
          确定
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </el-form-item>
    </el-form>

    <div
      v-if="videoloadingshow"
      v-loading="videoloading"
      class="videoing"
    />

    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="multiple"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />

    <flagModal
      v-if="flagModalShow"
      :dialog-is-show="flagModalShow"
      :duf-check-flag="relFlag"
      @cancelLabelsDialog="flagModalHide"
      @modalHandle="flagModalHandle"
    />

    <topicModal
      v-if="topicModalShow"
      :dialog-is-show="topicModalShow"
      :duf-check-topic="relTopics"
      @cancelLabelsDialog="topicModalHide"
      @modalHandle="topicModalHandle"
    />
  </div>
</template>
<script>
import { Message } from 'element-ui'
import draggable from 'vuedraggable'
import imgPicker from '@/components/imageselect'
import videoPicker from '@/components/videoselect'
import SkuSelector from '@/components/function/skuSelector'
import UploadUtil from '@/utils/uploadUtil'
import {uploadQiniuPic} from '@/api/qiniu'
import { getNotesDetail,notesCreate } from '@/api/ugc'
import flagModal from './comps/flagModal'
import topicModal from './comps/topicModal'
export default {
  provide () {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    imgPicker,
    videoPicker,
    draggable,
    SkuSelector,
    flagModal,
    topicModal
  },
  data () {
    const valEmoJi = (rule, value, callback) =>{
      let emoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      let isEmoji = emoji.test(value);
     // console.log('valEmoJi',rule)
      if(isEmoji){
        return callback(new Error(rule.message));
      }else{
        callback();
      }
    }
    const valPic = (rule, value, callback) =>{
      const {ruleForm} = this.$data;
     // console.log('valPic',rule, value)
      if(value.length<1){
        this.$data.picdanger = true;
        return callback(new Error('请选择图片'));
      }else{
        callback();
      }
    }
    return {
      ruleForm: {
        p_order:0,
        badges:null,
        topics:[],
        title:null,
        content:null,
        video:null,
        goods:[],
        cover:'',
        images:[],
        image_path:[],
        image_tag:[]
      },
      rules:{
        title:[
          { required: true, message: '请填写标题', trigger: 'blur' },
          { validator:valEmoJi, message: '标题仅支持汉字、英文、数字，不支持emoji',trigger: 'blur' }
        ],
        content:[
          { required: true, message: '请填写笔记描述', trigger: 'blur' }
        ],
        images:[
          {required: true,  validator:valPic, trigger: 'blur' }
        ]
      },
      post_info:{},
      is_top:false,
      formLoad:false,
      videoloading:false,
      videoloadingshow:false,
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
        draggable: '.goodspic'
      },
      picsDialog: false,
      isGetPics: false,
      multiple: false,
      itemVideo:{},
      relItems: [],
      relImages:[],
      relTopics:[],
      relFlag:{},
      goodslimit:9,
      topiclist:[],
      flagModalShow:false,
      topicModalShow:false,
      picdanger:false
    }
  },
  mounted () {
    if(this.$route.query.id){
      //console.log('mounted getDetail')
      this.getDetail()
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: this.$route.matched[1].path
      })
    },
    getDetail (){
      const that = this;
      var query = this.$route.query
      var params = {post_id:query.id}
      getNotesDetail(params).then(res=>{
        var info = res.data.data.post_info;
        //console.log('res',info)
        that.$data.post_info = info;
        if(info){
          that.serializeFrom(info);
        }else{
          this.$confirm('笔记不存在,可能已删除', '提示', {
            confirmButtonText: '返回',
            type: 'warning'
          }).then(() => {
            that.back();
          })
        }

      },err=>{
        //console.log('err',err);
        that.$data.ruleForm = {};
      })
    },
    serializeFrom (info){
      //console.log('info',info);
      var relItems= [];
      var itemVideo = {};
      var images = [];
      var ruleForm = {
        post_id:info.post_id,
        is_top:info.is_top,
        p_order:info.p_order,
        title:info.title,
        content:info.content,
        video:info.video_origin,
        video_ratio:info.video_ratio
      }

      if(info.goods && info.goods.length){
        info.goods.forEach(item=>{
          item.spec_items = [];
          relItems.push(item);
        })
      }

      if(info.video){
        itemVideo = {
          image_url:info.video_origin,
          media_id:info.video,
          url:info.video,
          check:true,
          cover:info.cover_origin
        }
      }

      if(info.topics){
        this.$data.relTopics = info.topics;
      }

      if(info.badges){
        this.$data.relFlag = info.badges[0];
        ruleForm.badges = [info.badges[0].badge_id];
      }

      if(info.images){
        this.mergePics(info);
      }
      //console.log('serializeFrom ruleForm',ruleForm);
      this.$data.is_top = info.is_top>0;
      this.$data.relItems = relItems;
      this.$data.itemVideo = itemVideo;
      this.$data.ruleForm = ruleForm;
    },
    mergePics (info){
      var relImages = [];
      var {image_path_origin,images,images_origin} = info;
      //console.log('mergePics ruleForm',info)
      images.forEach((item,index)=>{
        var image_id = images_origin[index];
        var image_url = image_path_origin[index];
        var img = {
            ...item,
            image_url,
            image_id
          }
        relImages.push(img);
        //console.log('img',item)
      })
      //console.log('mergePics relImages',relImages)
      this.$data.relImages = relImages;
    },
    pageTo (url){
       this.$router.push({ path: url })
    },
    serialChanges (){
      const {ruleForm,is_top} = this.$data;
      ruleForm.p_order = 0;
      //console.log('serialChanges',is_top,ruleForm.p_order,ruleForm.p_order>=0)
    },
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
      this.$data.picdanger = false;
    },
    pickPics (data) {
      const {itemVideo} = this.$data;
      var maxNum = 9;
      var tips = '最多上传'+maxNum+'图片!'
      if(itemVideo && itemVideo.media_id){
        maxNum = 8;
        tips = '视频已添加，最多上传'+maxNum+'图片!'
      }
      //console.log('relImages',this.relImages.length,this.relImages)
      if (this.relImages.length>=maxNum) {
          this.$message.error(tips)
          return false
      }else {
          if (data.length != 0) {
            data.forEach((item,index) => {
              if(this.relImages.length<maxNum){
                this.relImages.push(item)
              }
              //console.log('in',index,data.length,data)
            })
            this.resetPics();
          }
        }
      this.picsDialog = false
    },
    closePicsDialog () {
      this.picsDialog = false
    },
    getImagesInfo (e,index){
      const {relImages} = this.$data;
      var item = relImages[index];
      item.width = e.target.clientWidth;
      item.height = e.target.offsetHeight;
      // console.log('getImagesInfo',e)
       //console.log('getImagesInfo',e.target)
       //console.log('getImagesInfo',e.target.clientWidth,e.target.offsetHeight)
    },
    removePicsImg (index) {
      this.relImages.splice(index, 1);
      this.resetPics();
    },
    getVideoCover (){
      const that = this;
      const {itemVideo,videoloading} = this.$data;
      //console.log('getVideoCover',videoloading,itemVideo)
      if(videoloading || itemVideo.cover && itemVideo.cover!=''){
        console.log('!!ruleForm.cover')
        return false;
      }
      let video = document.querySelector('.video-box .vjs-tech');
      //console.log('getVideoCover querySelector',video)
      video.addEventListener('canplay', function (e) {
          let v_width = e.target.videoWidth*2;
          let v_height = e.target.videoHeight*2;
          let video_ratio = v_height/v_width;
              video_ratio = video_ratio.toFixed(2);
          let canvas = document.createElement('canvas');
           canvas.width = v_width;
           canvas.height = v_height;
           canvas.getContext('2d').drawImage(video, 0, 0, v_width, v_height);
           //document.querySelector('.goodsimages-bd').appendChild(canvas);
           let dataURL = canvas.toDataURL('image/png');
           let vinfo = {width:canvas.width,height:canvas.height,video_ratio,...itemVideo}
           that.$data.videoloading = true;
           that.imageUP(vinfo,dataURL)
           //console.log('getVideoCover dataURL')
      })
    },
    transblob (base64){
      let arr = base64.split(',');
      let array = arr[0].match(/:(.*?);/);
      let mime = (array && array.length > 1 ? array[1] : type) || type;
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1]);
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
          type: mime
      });
    },
    imageUP (video,base64){
       const that = this;
       const upload = new UploadUtil();
       var filename = 'videocover_' + new Date().getTime()+'.png';
       this.$data.itemVideo = video;
       var file = this.transblob(base64);
       //console.log('imageUP video',video)
       //return false;
       // 上传
       upload
         .uploadImg(file, filename)
         .then(
           (res) => {
             let uploadParams = {
               image_cat_id: 2, //图片分类必填,必须为整数
               image_name: filename, //图片名称必填,不能超过50个字符
               image_url: res.key, //图片链接必填
               // image_full_url: res.height,   //图片完整链接必填
               image_type: 'image/png', //图片分类长度不能超过20个字符
               storage: 'image' //图片id必填
             }
             // if (res.key) {
             uploadQiniuPic(uploadParams).then((uploadres) => {
               let {data} = uploadres.data;
               //console.log('uploadres',uploadres);
               that.itemVideo.cover = data.image_url;
               that.itemVideo.cover_url = data.url;
               that.$data.videoloading = false;
               that.$data.videoloadingshow = false;
               this.$message({
                 message: '视频封面上传成功',
                 type: 'success'
               })
             })
           },
           (err) => {console.log('err',err)}
         )
       //console.log('imageUP',video)
    },
    pickVideo (val) {
      this.$data.picdanger = false;
      this.$data.itemVideo = val;
      this.ruleForm.video = val.image_url;
      this.$data.videoloadingshow = true;
      //console.log('pickVideo')
    },
    deleteVideo () {
      this.ruleForm.video = null;
      this.ruleForm.video_ratio = null;
      this.itemVideo = {};
      this.$forceUpdate();
    },
    handleAddItems (){
      //console.log('this.$itemsSku.child',this.$refs.itemsSku)
      this.$refs.itemsSku.handleGoodsDialogShow();
    },
    getItems (data) {
      //console.log('data',data)
      let goods = []
      data.forEach((item, index) => {
        goods.push(item.goods_id)
      })
      //console.log('getItems goods',goods)
      this.ruleForm.goods = goods;
      this.$forceUpdate();
    },
    flagModalHide (show){
      this.$data.flagModalShow = show;
    },
    flagModalHandle (flag){
     //console.log('flagModalHandle',flag)
      this.ruleForm.badges = [flag.badge_id];
      this.relFlag = flag;
      this.flagModalHide(false)
    },
    removeFlag (){
      this.ruleForm.badges = null;
      this.relFlag = {};
    },
    topicModalHide (show){
      this.$data.topicModalShow = show;
    },
    topicModalHandle (topic){
      //console.log('topicModalHandle',topic)
      this.relTopics = topic;
      this.topicModalHide(false)
    },
    removeTopic (index){
      const {relTopics} = this.$data;
      //console.log('removeTopic',index,relTopics)
      relTopics.splice(index, 1)
    },
    resetPics (){
      //提交前的图片数据拆分
      const {relImages,itemVideo,relTopics,ruleForm} = this.$data;
      var cover = '';
      var images = [];
      var image_path = [];
      var image_tag = [];
      var topics_id = [];
      var video_ratio = null;
      //console.log('resetPics relImages',relImages)
      if(relImages.length){
        relImages.forEach(item=>{
          var proportion = {
            image_id:item.image_id,
            proportion:(item.height/item.width).toFixed(2),
            ugcwidth:null,
            tags:[]
          }
          images.push(item.image_id);
          image_path.push(item.image_url);
          image_tag.push(proportion);
        })
        cover = image_path[0];
      }
      if(itemVideo.cover){
        cover = itemVideo.cover;
        video_ratio = itemVideo.video_ratio;
      }

      if(relTopics.length){
        relTopics.forEach(item=>{
          topics_id.push(item.topic_id)
        })
      }else{
        topics_id = null
      }
      //console.log('resetPics',itemVideo)
      this.ruleForm.images = images;
      this.ruleForm.image_path = image_path;
      this.ruleForm.cover = cover;
      this.ruleForm.image_tag = image_tag;
      this.ruleForm.video_ratio = video_ratio;
      this.ruleForm.topics = topics_id;
    },
    confirmHandle (){
      const that = this;
      that.resetPics();
      // console.log('confirmHandle ',this.ruleForm);
      // return false;
      this.$refs['dataForm'].validate((valid) => {
        const { ruleForm,is_top } = this.$data;
        if (valid) {
          if(ruleForm.goods && ruleForm.goods.length<1){
            ruleForm.goods = null;
          }
           ruleForm.is_top = is_top?1:0;
          //console.log('confirmHandle parmas!!',ruleForm);
          //return false;
          notesCreate(ruleForm).then(res=>{
            //console.log('notesCreate res',res);
            this.$message({
              type: 'success',
              message: res.data.data.message,
              duration:1500,
              onClose (){
                that.back();
              }
            })
          },err=>{
            console.log('notesCreate err',err);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="css">
.form-title{margin-bottom: 20px; margin-left: 24px; font-size: 14px; color:#333;}
.ugc-form{width: 600px; }
.ugc-form .text-ml{margin-left: 10px;}
.ugc-form .notMBot .el-row{margin-bottom: 0!important;}
.ugc-form .text{line-height: 1.5;font-size: 12px; color:#999;}
.ugc-form .text b{font-weight: bold; color:#02A7F0; cursor:pointer}
.ugc-form .text.underline{text-decoration: underline;}
.ugc-form .row-fright{text-align: right;}
.ugc-form .bottom-bor{padding-bottom: 10px; border-bottom: 1px solid #eee;}
.ugc-form .bgbar{ padding:5px; background-color: #f3f3f3;}
.ugc-form .bgbar .baritem{display: inline-block; width: auto; padding:0 5px ; margin:5px; line-height: 2; border-radius: 5px; border:1px solid #ccc; text-align: center;cursor:pointer; font-size: 12px;;}
.ugc-form .bgbar .baritem:hover{background:#ecf5ff; color:#409EFF; border-color: #b3d8ff;}
.ugc-form .bgbar .baritem .el-icon {margin-left: 5px;}
.ugc-form .bgbar .baritem .gray{color: #ccc;}
.videoing{position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 3; }
.badgebar{cursor: pointer;}
.badgebar:hover .el-icon {color: #1480e3;}
.goodspic{margin: 0 10px 10px 0; position: relative;  float: left;  text-align: center;}
.goodspic .img-wrap{width: 86px;height: 86px; border: 1px solid #ddd; position: relative;}
.goodspic .goodspic-mask{position: absolute;top: 0;right: 0;bottom: 0;left: 0;background: rgba(0, 0, 0, 0.2);cursor: pointer;display: none;}
.goodspic .goodspic-mask .icon-trash-alt{font-size: 18px;color: #fff;float: left;margin-top: 25px;margin-left: 15px;}
.goodspic .goodspic-mask .icon-arrows-alt{font-size: 18px;color: #fff;float: left;margin-top: 25px;margin-left: 15px;}
.goodspic .img-wrap:hover .goodspic-mask,.ugc-form  .goodspic:hover .goodspic-mask{display: block;}
.ugc-form .livideo .goodspic-mask .icon-trash-alt{margin-left: 35px;}
.ugc-form /deep/ .el-image__inner{height:auto; }
.ugc-form /deep/ .upload-box{margin:auto; width: 86px; height: 86px; line-height: 86px;}
.ugc-form /deep/ .goodsdialogshow{display: none;}
.ugc-form /deep/ .itemsSku .el-col{width: 50%;}
.ugc-form /deep/ .el-form-item__label{padding-right: 40px;}
.ugc-form /deep/ .video-box{margin:auto; width: 84px; height:84px; background:#444}
.ugc-form /deep/ .video-box~.upload-box{display: none;}
.ugc-form /deep/ .video-box .vjs-big-play-button{display: none;}
.ugc-form /deep/ .mipt input[type="number"]::-webkit-inner-spin-button{appearance: none;}
</style>
