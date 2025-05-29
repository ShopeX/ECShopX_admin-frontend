<template>
  <div class="sp-iphone">
    <div class="sp-iphone__notch">
      <div class="sp-iphone__speaker" />
      <div class="sp-iphone__camera" />
    </div>
    <div class="sp-iphone__inner scrollbar-hide">
      <slot />
      <div class="sp-iphone__safe-area" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpIphone'
}
</script>

<style lang="scss">
.sp-iphone {
  width: 375px;
  height: 812px;
  border-radius: 48px;
  border: 1px solid #e5e7eb;
  // background: #222;
  // box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .sp-iphone__notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 210px;
    height: 32px;
    background: #111;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .sp-iphone__speaker {
    width: 60px;
    height: 8px;
    background: #333;
    border-radius: 4px;
    margin-right: 16px;
  }
  .sp-iphone__camera {
    width: 14px;
    height: 14px;
    background: #222;
    border-radius: 50%;
    border: 2px solid #444;
  }
  .sp-iphone__inner {
    position: absolute;
    top: 32px;
    left: 0;
    width: 100%;
    height: calc(100% - 32px);
    background: #fff;
    border-bottom-left-radius: 42px;
    border-bottom-right-radius: 42px;
    z-index: 1;
    display: flex;
    flex-direction: column;

    .sp-decorate {
      height: 100%;
      .weapp-template {
        height: 100%;
        overflow: auto; /* 允许滚动 */
        -ms-overflow-style: none; /* IE和Edge */
        scrollbar-width: none; /* Firefox */

        &::-webkit-scrollbar {
          display: none; /* Chrome, Safari和Opera */
        }
      }
    }
  }
  .sp-iphone__safe-area {
    position: absolute;
    left: 50%;
    bottom: 18px;
    transform: translateX(-50%);
    width: 120px;
    height: 5px;
    background: #d1d5db;
    border-radius: 3px;
    opacity: 0.85;
    z-index: 10;
  }
}
</style>
