
<template>
  <div
  :class="{
    'wgt-headline': true,
    'padded': value.padded
  }"
>
  <div
    class="wgt-bd"
    :class="{
      'spaced': value.spaced
    }"
    >
    <div :class="{
        'wgt-contnet': true,
        'center': value.float === 'center',
        'left': value.float === 'left'
      }">
      <span> {{ value.title }} </span>
    </div>
  </div>
</div>
</template>
<script>
import config from './config'
export default {
name: 'Headline',
wgtName: '文字轮播',
wgtDesc: '',
wgtIcon: 'wgt-headline',
config: config,
props: {
  value: [Object, Array]
},
}
</script>
<style lang="scss" scoped>
.wgt-headline {
  .wgt-contnet{
    height: 50px;
    line-height: 50px;
  }
  .left {
      text-align: left;
  }
  .center {
    text-align: center;
  }
}
</style>
