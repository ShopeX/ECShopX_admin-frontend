
<template>
  <div
  :class="{
    'wgt-hotTopic': true,
    'padded': value.c
  }"
>
  <div
    class="wgt-bd"
    :class="{
      'spaced': value.spaced
    }"
    >
    <div class="wgt-contnet">
      <div>
        <span> {{ value.title }} </span>
      </div>
      <div class="topics">
        <div class="topic-item" v-for="(item,index) in value.data" :key="index">
          <span>{{ item.topic }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import config from './config'
export default {
name: 'HotTopic',
wgtName: '热点话题',
wgtDesc: '',
wgtIcon: 'wgt-hotTopic',
config: config,
props: {
  value: [Object, Array]
},
}
</script>
<style lang="scss" scoped>
.wgt-hotTopic {
  .wgt-contnet{
    .topics{
      display: flex;
      .topic-item{
        display: inline-block;
        padding: 10px 20px;
        background: #000;
        color: #fff;
        border: 1px solid #000;
        margin-right: 10px;
        &:nth-child(2n){
          background: #fff;
          color: #000;
        }
      }
    }
  }

}
</style>
