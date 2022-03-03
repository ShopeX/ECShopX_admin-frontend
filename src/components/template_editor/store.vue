<template>
  <section v-if="name === 'store'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle"></el-input>
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef">
          </el-switch>
        </el-form-item>
        <el-form-item label="推荐店铺">
          <draggable
            v-model="data"
            class="content-bottom-padded"
            :options="dragItemsOptions"
            @end="onEnd"
          >
            <div class="setting-item item-selected" v-for="(store, index) in data" :key="index">
              <div class="store-card">
                <template v-if="store.id">
                  <div class="view-flex view-flex-middle">
                    <img
                      class="store-logo"
                      :src="
                        store.logo ||
                        'https://fakeimg.pl/120x120/EFEFEF/CCC/?text=logo&font=lobster'
                      "
                      alt=""
                    />
                    <div class="store-name">{{ store.name }}</div>
                  </div>
                  <div class="store-items">
                    <div
                      v-for="item in store.items.slice(0, 4)"
                      :key="item.goodsId"
                      class="store-item"
                    >
                      <img class="store-item-thumb" :src="item.imgUrl" alt="" />
                      <div class="store-item-amount">
                        <span class="price">¥{{ item.price / 100 }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="store-placeholder">
                    <div class="view-flex view-flex-middle">
                      <div class="logo"></div>
                      <div>
                        <div class="name"></div>
                        <div class="desc"></div>
                      </div>
                    </div>
                    <div class="view-flex">
                      <div class="item">
                        <div class="thumb"></div>
                        <div class="price"></div>
                      </div>
                      <div class="item">
                        <div class="thumb"></div>
                        <div class="price"></div>
                      </div>
                      <div class="item">
                        <div class="thumb"></div>
                        <div class="price"></div>
                      </div>
                      <div class="item">
                        <div class="thumb"></div>
                        <div class="price"></div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="setting-modal">
                  <!-- <div class="iconfont icon-arrows-alt"></div> -->
                  <div class="iconfont icon-cog" @click="handleGoods(index)"></div>
                  <!-- <div class="iconfont icon-trash-alt1" @click="handleRemove(index)"></div> -->
                </div>
              </div>
            </div>
          </draggable>
        </el-form-item>
        <el-form-item label="背景色">
          <el-color-picker v-model="base.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="商品边框色">
          <el-color-picker v-model="base.borderColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="宣传图">
          <span>点击图片可更换，图片大小不能超过 2MB（建议尺寸：700px*116px）</span>
          <div class="setting-item slider">
            <div class="upload-box" v-if="base.imgUrl">
              <img
                :style="{ width: '350px', height: '50px' }"
                :src="wximageurl + base.imgUrl"
                class="banner-uploader"
                @click="handleImgChange"
              />
            </div>
            <div class="banner-uploader" v-else @click="handleImgChange">
              <i class="iconfont icon-camera"></i>上传图片
            </div>
          </div>
        </el-form-item>
        <el-form-item label="设置标签" v-if="data[0].id!=0">
          <el-button
            size="mini"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="setTag"
          >
            设置标签</el-button
          >
          <p>
            <span class="tag" v-for="(item, index) in seletedTags" :key="item.tag_id"
              >{{ item.tag_name }} <span class="el-icon-close" @click="deleteTag(index)"></span
            ></span>
          </p>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      data: [],
      seletedTags: [],
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
        draggable: '.setting-item'
      }
    }
  },
  components: {
    draggable
  },
  methods: {
    setData(val) {
      // debugger
      this.name = val.name
      this.base = val.base
      this.data = val.data
      this.seletedTags = val.seletedTags
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    handleGoods(idx) {
      this.$emit('bindGoods', idx)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    },
    handleRemove(index) {
      this.data.splice(index, 1)
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    setTag() {
      this.$emit('tagSelectVisibleHandle', 'store')
    },
    deleteTag(index) {
      this.seletedTags.splice(index, 1)
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.tag {
  margin: 10px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    color: #1480e3;
  }
}
.store-card {
  width: 300px;
  position: relative;
  margin: 10px 10px 0;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  .setting-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(31, 130, 224, 0.3);
    z-index: 10;
    opacity: 0;
    transition: all 0.3s ease;
    .iconfont {
      padding: 0 10px;
      cursor: pointer;
      font-size: 28px;
      color: #fff;
    }
    .icon-arrows-alt {
      cursor: move;
    }
  }
  &:hover {
    .setting-modal {
      opacity: 1;
    }
  }
  .store-placeholder {
    .logo {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      background: #efefef;
    }
    .name {
      margin-bottom: 5px;
      width: 100px;
      height: 10px;
      background: #ccc;
    }
    .desc {
      width: 150px;
      height: 10px;
      background: #efefef;
    }
    .item {
      padding-top: 10px;
      .thumb {
        margin-bottom: 5px;
        margin-right: 10px;
        width: 60px;
        height: 60px;
        background: #efefef;
      }
      .price {
        width: 30px;
        height: 10px;
        background: #f5f5f5;
      }
    }
  }
  .store-logo {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
  .store-name {
    font-size: 14px;
    color: #333;
  }
  .store-items {
    display: flex;
    padding-top: 10px;
    .store-item {
      margin-right: 10px;
      .store-item-thumb {
        display: block;
        width: 60px;
        height: 60px;
      }
      .store-item-amount {
        height: 28px;
        line-height: 28px;
        .price {
          font-size: 14px;
          color: #ff5000;
        }
        .market-price {
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
}
</style>
