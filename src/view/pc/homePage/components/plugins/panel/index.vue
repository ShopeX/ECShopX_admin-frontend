<template>
  <div>
    <slot />
    <div class="activity-panel">
      <ul
        v-if="t_data.length > 0"
        class="box"
      >
        <li
          v-for="(item, i) in t_data"
          :key="i"
          class="content"
        >
          <img
            class="i"
            :src="item.imgUrl || 'https://fakeimg.pl/250x250/F8F8F8/CCC/?text=Image&font=helvetica'"
          >
          <!-- <a class="cover-link"></a> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Panel',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      t_data: this.data.data
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-panel {
  // width: 1220px;
  width: 100%;
  margin: 0 auto;
  .box {
    display: flex;
    overflow: hidden;
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    background: #fff;
  }
  .content {
    flex: 1;
    position: relative;
    box-sizing: border-box;
    width: 1%;
    text-align: center;
  }
  .content ::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border-left: 1px solid #efefef;
    width: 100%;
    height: 100%;
    content: '';
    pointer-events: none;
  }
  .i {
    display: block;
    width: 100%;
    height: auto;
  }
  .cover-link {
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
      repeat;
  }
  a {
    color: #5079d9;
    cursor: pointer;
    transition: all 0.15s ease-out;
    text-decoration: none;
  }
  a:hover {
    box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
    transition: all 0.15s ease;
  }
}
</style>
