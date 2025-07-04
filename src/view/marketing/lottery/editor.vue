<template>
  <div class="lottery-editor">
    <SpForm
      ref="formBase"
      v-model="form"
      class="lottery-editor-form"
      show-message
      :submit="false"
      :form-list="formList"
    />
    <div class="lottery-editor-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="onGroupFormSubmit">保存</el-button>
    </div>
    <SpDialog
      ref="hotAreasDialogRef"
      v-model="hotAreasDialogShow"
      title="抽奖区域"
      :modal="false"
      class="base-form"
      :form="hotArea"
      :form-list="lotteryAreaSchema"
      @onSubmit="onHotAreaSubmit"
    />

    <SpDialog
      ref="ruleDialogRef"
      v-model="ruleDialogShow"
      title="抽奖规则按钮"
      :modal="false"
      class="base-form"
      :form="ruleForm"
      :form-list="ruleFormList"
      @onSubmit="onRuleFormSubmit"
    />

    <SpDialog
      ref="recordDialogRef"
      v-model="recordDialogShow"
      title="抽奖记录"
      :modal="false"
      class="base-form"
      :form="recordForm"
      :form-list="recordFormList"
      @onSubmit="onRecordFormSubmit"
    />
  </div>
</template>

<script lang="js">
import { formList, lotteryAreaSchema, ruleFormSchema, recordFormSchema } from './editorSchema.js'
import { generatorParams } from "@/utils/schemaHelper.js";
import LuckyWheel from '@/components/LuckyWheel/index.vue'
import moment from 'moment'
import api from '@/api'

import { defaultItem, prize_types, defaultGameConfig } from './constants'

let index = 0

const defaultValues = {
  options: [
    {
      label: prize_types.thanks,
      value: "thanks",
    },
    {
      label: prize_types.points,
      value: "points",
    },
    {
      label: prize_types.coupon,
      value: "coupon",
    },
    {
      label: prize_types.coupons,
      value: "coupons",
    },
  ],
  prize_data: [
    { ...defaultItem, index: index++ },
    { ...defaultItem, index: index++ },
  ]
}



export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LuckyWheel
  },
  data() {
    return {
      form: {
        ...generatorParams(formList(this)),
        cost_value: 0,
        limit_day: '',
        quantity: "",
        prize_data: defaultValues.prize_data,
        background: "",
        backgroundColor: "",
        area_id: 0
      },
      areas: [],
      options: defaultValues.options,
      //
      hotArea: generatorParams(lotteryAreaSchema(this)),
      hotAreasDialogShow: false,
      ruleDialogShow: false,
      ruleForm: generatorParams(ruleFormSchema(this)),
      recordDialogShow: false,
      recordForm: generatorParams(recordFormSchema(this)),
      hotAreaConfig: null,
      ruleFormConfig: null,
      recordFormConfig: null,
    }
  },
  computed: {
    formList() {
      return formList(this)
    },
    lotteryAreaSchema() {
      return lotteryAreaSchema(this)
    },
    ruleFormList() {
      return ruleFormSchema(this)
    },
    recordFormList() {
      return recordFormSchema(this)
    },
    lotteryConfig() {
      return {
        prizeData: this.form['prize_data'],     // 奖品配置
        background: this.form['background'],// 页面背景
        backgroundColor: this.form['backgroundColor'],// 背景颜色
        hotArea: this['hotAreaConfig'],// 抽奖区域
        // ruleBtnStyle: this['ruleFormConfig'],// 抽奖规则按钮
        recordBtnStyle: this['recordFormConfig'],// 抽奖记录按钮
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name,
          title: el.regionauth_name
        }))
      })
      if (this.$route.params.id || this.$route.query?.id) {
        api.marketing.getTurntableDetail({
          id: this.$route.params.id || this.$route.query?.id
        }).then((res) => {
          const { activity_template_config } = res
          this.form = {
            ...generatorParams(formList(this), res),
            start_time: [moment(res.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'), moment(res.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')],
            limit_day: res.limit_day,
            cost_value: res.cost_value,
            backgroundColor: activity_template_config?.backgroundColor,
            background: activity_template_config?.backgroundImage,
            area_id: res.area_id || 0
          }
          const { gameConfig: { blocks, buttons } } = activity_template_config

          this.hotArea = blocks[0]?.imgs[0]?.src ? {
            backImg: blocks[0]?.imgs[0]?.src,
            padding: blocks[0]?.padding,
            background: buttons[0]?.background,
            img: buttons[0]?.imgs[0]?.src,
          } : generatorParams(lotteryAreaSchema(this))
          this.hotAreaConfig = !!blocks[0]?.imgs[0]?.src
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 保存
    onGroupFormSubmit() {
      this.$refs.formBase.handleSubmit().then(res => {
        console.log(res);
        this.submitAfter()
      }).catch(er => {
        console.log(er);
      })
    },
    async submitAfter() {
      const params = {
        ...this.form,
        prize_data: JSON.stringify(this.form['prize_data'].map(el => {
          let _prize_value = el.prize_value
          if (el.prize_type == 'coupon') {
            _prize_value = el.prize_value.card_id
          } else if (el.prize_type == 'coupons') {
            _prize_value = el.prize_value.package_id
          } else {
            _prize_value = el.prize_value
          }
          return {
            ...el,
            prize_value: _prize_value,
            fonts: {
              "text": el.text,
              "top": "30%"
            },
            imgs: el?.img ? [{ src: el?.img, width: '50px', height: '50px', top: "60%" }] : [],
          }
        })),
        activity_template_config: JSON.stringify({
          ...defaultGameConfig,
          gameType: this.form.activity_type,
          backgroundImage: this.form.background,
          backgroundColor: this.form.backgroundColor,
          "gameConfig": {
            ...defaultGameConfig.gameConfig,
            blocks: this?.hotArea?.backImg ? [{
              padding: this?.hotArea.padding,
              imgs: [{ src: this?.hotArea?.backImg }]
            }] : [],
            buttons: this.hotArea?.img || this.hotArea?.background ? [{
              background: this.hotArea?.background,
              imgs: [{ src: this.hotArea?.img }],
              radius: '35%',
              pointer: true,
              fonts: [{ text: '开始', top: '-10px' }]
            }] : [],
          }
        })
      }
      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      const { result } = await api.marketing.editTurntableConfig(params)
      if (result) {
        this.$message.success('保存成功')
        this.$router.go(-1)
        return
      }
      this.$message.error('保存失败')
    },
    handleInput(val, row, index, key) {
      this.form = {
        ...this.form,
        prize_data: this.form['prize_data'].map((el, i) => {
          if (i == index) {
            if (key == 'prize_type') {
              el['prize_value'] = ''
              el['stock'] = ''
            }
            return { ...el, [key]: val }
          }
          return el
        })
      }

    },
    handleDateInput(val) {
      if (val?.length) {
        this.form = {
          ...this.form,
          begin_time: moment(val[0]).unix(),
          end_time: moment(val[1]).unix()
        }
      } else {
        this.form = {
          ...this.form,
          begin_time: '',
          end_time: ''
        }
      }
    },
    addHandle() {
      if (this.form['prize_data'].length >= 8) {
        this.$message.error('最多添加8项')
        return
      }
      this.form = {
        ...this.form,
        prize_data: [...this.form['prize_data'], { ...defaultItem, index: index++ }]
      }
    },
    deleteHandle(row) {
      this.form = {
        ...this.form,
        prize_data: this.form['prize_data'].filter((el, i) => i != row?.index)
      }
    },
    onHotAreaSubmit() {
      this.hotAreaConfig = this.hotArea
      this.hotAreasDialogShow = false
    },
    onRuleFormSubmit() {
      this.ruleFormConfig = this.ruleForm
      this.ruleDialogShow = false
    },
    onRecordFormSubmit() {
      this.recordFormConfig = this.recordForm
      this.recordDialogShow = false
    },
    async onCouponSubmit(row, index, key) {
      const { data } = await this.$picker.couponV2({
        multiple: false,
        params:{
          status:4
        }
      })
      this.handleInput(data[0], row, index, key)
    },
    async onCouponPackSubmit(row, index, key) {
      const { data } = await this.$picker.couponPackage({
        multiple: false
      })
      this.handleInput(data[0], row, index, key)
    }
  }
}
</script>

<style scoped>
.lottery-editor {
  position: relative;
}

.lottery-editor-footer {
  position: absolute;
  bottom: 200px;
  left: 50%;
  transform: translateX(-25%);
}

.lottery-editor-content {
  position: relative;
  bottom: 260px;
  left: 730px;
  height: 740px;
  width: 350px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
}

.inputWrap {
  width: 200px;
  border-radius: 8px;
  border: 1px solid;
  height: 40px;
  position: relative;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
}

.imgWrap {
  height: 50px;
}

.prize_data {
  width: max-content;
}

.prize_data >>> .imgWrap .image-item {
  height: 50px !important;
}
</style>
