<template>
  <div style="padding-bottom: 58px">
    <div class="title">
列表页设置
</div>
    <el-card v-if="!isMicorMall">
      <div class="card">
        <div class="card_title">
          <div class="card_title_tip title">
PC端Banner轮播图
</div>
          <div class="card_title_desc">
            建议尺寸700px*450px；最多四张图，前后拖动排序；无图片则不展示该模块。
          </div>
        </div>
        <div class="card_content">
          <img-picker :max="4" :value.sync="form.pc_banner" />
        </div>
      </div>
    </el-card>

    <!-- <el-card>
      <div class="card">
        <div class="card_title">
          <div class="card_title_tip title">
            积分商品筛选条件
          </div>
        </div>
        <div class="card_content2">
          <div class="brand_item content_item">
            <div class="title">
              按品牌筛选
            </div>
            <div class="com">
              <el-switch
                v-model="form.brand_openstatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </div>
            <div class="desc">
              开启后，将显示所有积分商品的品牌。
            </div>
          </div>
          <div class="brand_item content_item">
            <div class="title">
              按分类筛选
            </div>
            <div class="com">
              <el-switch
                v-model="form.cat_openstatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </div>
            <div class="desc">
              开启后，将显示所有带有商品的商品分类。
            </div>
          </div>
          <div class="brand_item content_item">
            <div class="title">
              按积分筛选
            </div>
            <div class="com">
              <el-switch
                v-model="form.point_openstatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </div>
            <div class="desc">
              开启后，用户可按您配置好的积分区间挑选商品。
            </div>
          </div>
          <Table
            v-if="form.point_openstatus"
            :value.sync="form.point_section"
          />
        </div>
      </div>
    </el-card> -->
    <GlobalFooter>
      <el-button type="primary" @click="save">
保存
</el-button>
    </GlobalFooter>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTemplateSetting, saveTemplateSetting } from '../../../api/pointsmall'
import ImgPicker from '@/components/img_picker'
import GlobalFooter from '@/components/global_footer'
import Table from './table'

export default {
  components: {
    ImgPicker,
    Table,
    GlobalFooter
  },
  data () {
    return {
      loading: false,
      form: {
        pc_banner: [],
        brand_openstatus: false,
        cat_openstatus: false,
        point_openstatus: false,
        point_section: []
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    deteleObject (obj) {
      var uniques = []
      var stringify = {}
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i])
        keys.sort(function (a, b) {
          return Number(a) - Number(b)
        })
        var str = ''
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j])
          str += JSON.stringify(obj[i][keys[j]])
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i])
          stringify[str] = true
        }
      }
      uniques = uniques
      return uniques
    },
    // 输入限制小数点两位
    handleInput2 (e) {
      // 通过正则过滤小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null
    },
    changePics (imgList) {
      this.form.pc_banners = imgList
    },
    // 获取列表
    getInfo () {
      this.loading = true
      getTemplateSetting().then((res) => {
        const {
          pc_banner,
          screen: { brand_openstatus, cat_openstatus, point_openstatus, point_section }
        } = res.data.data
        this.form = {
          ...this.form,
          pc_banner,
          brand_openstatus,
          cat_openstatus,
          point_openstatus,
          point_section: (point_section &&
            Array.isArray(point_section) &&
            point_section.length &&
            point_section.map((item, index) => ({
              score1: Number(item[0]),
              score2: Number(item[1]),
              isHaveError: false
            }))) || [{ score1: 0, score2: 5, isHaveError: false }]
        }
      })
    },
    // 保存数据
    save () {
      const { pc_banner, brand_openstatus, cat_openstatus, point_openstatus, point_section } =
        this.form

      const isEmptyPoint = point_section.some((item, index) => item.score1 == 0 && item.score2 == 0)

      let numberList = point_section.map((item) => ({
        score1: Number(item.score1),
        score2: Number(item.score2)
      }))

      if (point_section.length !== this.deteleObject(numberList).length) {
        this.$message.error('不可提交相同的积分区间')
        return
      }

      const isNotSmallToBig = point_section.some(
        (item, index) => Number(item.score1) > Number(item.score2)
      )

      if (isNotSmallToBig) {
        this.$message.error('积分区间起始值必须小于结束值！')
        return
      }

      if (isEmptyPoint) {
        this.$message.error('积分区间起始值必填！')
        return
      }

      saveTemplateSetting({
        pc_banner,
        screen: {
          brand_openstatus,
          cat_openstatus,
          point_openstatus,
          point_section: point_section.map((item, index) => [item.score1, item.score2])
        }
      }).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight', 'isMicorMall'])
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
.card {
  &_title {
    line-height: 20px;
    height: 20px;
    display: flex;
    justify-content: space-between;

    &_desc {
      color: #909399;
    }
  }
}
.card_content {
  position: relative;
  height: 200px;
}
.card_content2 {
  .content_item {
    display: flex;
    align-items: center;
    margin: 26px 0 26px 0;

    .title {
      color: #909399;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 0;
      width: 130px;
    }
    .desc {
      color: #909399;
      font-size: 14px;
      font-weight: 400;
    }
    .com {
      line-height: 0;
      margin-right: 60px;
    }
  }
  .brand_item {
    .title {
    }
    .com {
    }
    .desc {
    }
  }
}
</style>
