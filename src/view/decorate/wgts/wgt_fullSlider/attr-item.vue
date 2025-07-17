<style lang="scss" scoped>
.attr_slider {
  width: 100%;
  // width: 340px;
  // margin-left: -90px;

  .slider-item {
    display: flex;
    border-top: 1px solid #fff;
    padding-top: 10px;
    justify-content: space-between;
    width: 100%;

    .slider-item-img {
      display: flex;
    }

    .slider-item-info {
      flex: 1;
      margin-left: 10px;
      .slider-item-type {
        display: flex;
        align-items: center;
        margin-bottom: 6px;

        .el-radio-group {
          margin-top: 0px;
        }

        .label {
          width: 50px;
        }
      }
    }

    .slider-item-link {
      // display: flex;

      .label {
        width: 50px;
        flex-shrink: 0;
      }

      .zone-item {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.attr_slider {
  .drag-list {
    // background-color: #c2d2f5;
    padding: 10px;
    border: 1px dashed #e6e6e6;
  }

  .btn-todo {
    width: 100%;
  }

  .slider-item-link {
    .zone-item-link-no {
      height: 30px;
      line-height: 30px;
      border: 1px solid #e6e6e6;
      border-radius: 2px;
      padding: 0px 5px;
      margin-top: 10px;
      width: 100%;
      text-align: center;
    }
    .zone-item {
      .zone-item-link {
        margin-top: 10px;
        // .btn-linkpath {
        //   border: none;
        //   background-color: rgba($color: #000000, $alpha: 0);
        //   line-height: 24px;
        //   height: 24px;
        //   padding: 0px 3px 0 0;
        //   .text {
        //     padding: 0px;
        //   }
        // }
      }
    }
  }
}

.attr_slider_dialog {
  .el-dialog__body {
    max-height: 72vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
<template>
  <div class="attr_slider" v-if="refresh">
    <CompTodoList v-model="localValue" @onAddItem="handleClickAdd" type="text" btnText="添加轮播项" :show-title="true"
      title="轮播项" @move="handleMove">
      <template slot="body" slot-scope="scope">
        <div class="slider-item">
          <div class="slider-item-img">
            <sp-image v-if="scope.data.media_type == 'img'" :src="scope.data.imgUrl" width="70" height="70"
              @click.native="onSetHotZone(scope.data, scope.index)" />
              <video v-else :src="scope.data.videoUrl" width="64" height="64" @click="onSetHotZone(scope.data, scope.index)"></video>
            <!-- <SpVideoPicker v-else v-model="scope.data.videoUrl" size='small' /> -->
          </div>
          <div class="slider-item-info">
            <div class="slider-item-type">
              <!-- <p class="label">
                模式
              </p> -->
              <div>{{ scope.data.media_type == 'video' ? '视频' : '图片' }}</div>
              <!-- <el-radio-group size="mini" v-model="scope.data.media_type"
                @change="handleChangeType(scope.index, $event)">
                <el-radio-button label="img">图片</el-radio-button>
                <el-radio-button label="video">视频</el-radio-button>
              </el-radio-group> -->
            </div>
            <div class="slider-item-link">
              <!-- <p class="label">
                链接
              </p> -->
              <div
                v-if="scope.data.hotData.length == 0 && scope.data.overlayHotData.length == 0"
                class="zone-item-link-no"
                @click="onSetHotZone(scope.data, scope.index)"
              >
                选择路径
              </div>
              <div class="zone-item" v-if="scope.data.media_type === 'img'">
                <span v-for="(item, index) in scope.data.hotData" :key="`copy-zone-item__${index}`"
                  class="zone-item-link">
                  <CompPickerLink :isShowH5Link="false" :value="item" wgtType="hotzone"
                    @change="(e) => onChangeLocalhotDate(e, scope.index, index)" />
                </span>
              </div>
              <div class="zone-item">
                <span v-for="(item, index) in scope.data.overlayHotData" :key="`copy-zone-item__${index}`"
                  class="zone-item-link">
                  <CompPickerLink :isShowH5Link="false" :value="item" wgtType="hotzone"
                    @change="(e) => onChangeLocaloverhotDate(e, scope.index, index)" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import CompTodoList from '../../comps/comp-todoList'
import CompButton from '../../comps/comp-button'
import CompPickerLink from '../../comps/comp-pickerLink'
import SliderDialog from './sliderDialog.vue'
import { getImageAttribute, getVideoAttribute } from "./utils";
import { useDialog } from '@shopex/finder'

export default {
  name: 'AttrItem',
  components: {
    CompButton,
    CompTodoList,
    CompPickerLink,
    // CompHotPicker,
    SliderDialog
  },
  props: {
    value: {
      type: Array
    },
    direction: {
      type: String
    },
    uuid: {
      type: String
    },
    // proportion: Number,
    height: Number,
  },
  data() {
    return {
      localValue: [],
      dialog: false,
      currentIndex: 0,
      sliderForm: null,
      refresh: true
    }
  },
  watch: {
    localValue: {
      deep: true,
      handler: function (nVal, oVal) {
        this.$emit('input', nVal)
      }
    },
    uuid: {
      handler(nVal, oVal) {
        this.localValue = cloneDeep(this.value)
      },
      deep: true
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async onSetHotZone(item, index) {
      useDialog(null, {
        title: `轮播项${index + 1}`,
        width: '860px',
        top: '4vh',
        class: 'attr_slider_dialog',
        sliderItem: item,
        // proportion: this.proportion,
        defaultValue: this.localValue[0],
        index: index,
        height: this.height,
        component: () => import('./sliderDialog.vue'),
        actions: [
          {
            label: '关闭',
            key: 'close',
            type: 'default',
            size: 'small'
          },
          { label: '确定', key: 'save', type: 'primary', size: 'small' }
        ]
      }).then(async (args) => {
        if (!args) return
        const { sliderForm, h } = args
        this.refresh = false
        this.$set(this.localValue, index, sliderForm)
        if (index == 0) {
          this.$emit('changeheight', h)
        }
        this.$nextTick(()=>{
          this.refresh = true
        })
      })
    },
    async handleClickAdd() {
      this.localValue = await this.localValue.concat({
        media_type: 'img',
        videoUrl: '',
        autoplay: false,
        // loop: false,
        interact: 'reset',
        overlay: '',
        overlayWidth: 100,
        overlaybuttom: 0,
        overlayLeft: 0,
        slidercolor: '#000000',
        blockColor: '#000000',
        imgUrl: '',
        mainTitle: '',
        hotData: [],
        overlayHotData: [],
        idx: this.localValue.length + 1
      })
    },
    async handleMove() {
      if (this.localValue[0].media_type == "video" && this.localValue[0].videoUrl) {
        getVideoAttribute(this.localValue[0].videoUrl, (h) => {
          this.$emit('changeheight', h)
        })
      } else {
        getImageAttribute(this.localValue[0].imgUrl, (h) => {
          this.$emit('changeheight', h)
        })
      }
    },
    async onChangeLocalData(e, pid, index) {
      this.$set(this.localValue[pid], 'data', e)
    },
    async onChangeLocalhotDate(e, pid, index) {
      let ele = cloneDeep(this.localValue[pid].hotData[index])
      Object.assign(ele, e)
      this.$set(this.localValue[pid].hotData, index, ele)
    },
    async onChangeLocaloverhotDate(e, pid, index) {
      let ele = cloneDeep(this.localValue[pid].overlayHotData[index])
      Object.assign(ele, e)
      this.$set(this.localValue[pid].overlayHotData, index, ele)
    },
    handleChangeType(index, e) {
      this.$set(this.localValue, index, {
        media_type: e,
        videoUrl: null,
        autoplay: false,
        // loop: false,
        interact: 'reset',
        overlay: '',
        overlayWidth: 100,
        overlaybuttom: 0,
        overlayLeft: 0,
        slidercolor: '#000000',
        blockColor: '#000000',
        imgUrl: '',
        mainTitle: '',
        hotData: [],
        overlayHotData: [],
      })
    }
  }
}
</script>
