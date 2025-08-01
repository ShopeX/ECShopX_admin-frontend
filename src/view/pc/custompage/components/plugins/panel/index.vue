<template>
  <div>
    <slot />
    <div class="activity-panel">
      <ul class="box">
        <li v-for="(item, i) in t_data" :key="i" class="content">
          <img v-if="item.imgUrl" class="i" :src="item.imgUrl">
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
  data() {
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
  margin-bottom: 40px;
  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 25px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  }
  .content {
    float: left;
    position: relative;
    box-sizing: border-box;
    width: 25%;
    height: 200px;
    text-align: center;
  }
  .content ::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border-left: 1px solid #f2f2f2;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    content: '';
    pointer-events: none;
  }
  .i {
    // width: 305px;
    width: 100%;
    height: 200px;
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
