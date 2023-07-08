<template>
  <view class="my_tab_title" :style="{paddingTop:statusBarHeight,opacity}">
    {{titleText}}
  </view>
</template>
<script>
export default {
  props: {
    opacity: {
      type: Number,
      default: 1,
    },
    titleText: {
      type: String,
      default: "标题",
    },
  },
  data() {
    return {
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight, //状态栏的高度（可以设置为顶部导航条的padding-top
    };
  },
  methods: {},
};
</script>

<style lang="scss" scope>
.my_tab_title {
  width: 100%;
  height: 44px; //这个是固定的44px（所有小程序顶部高度都是 = 44px + 手机系统状态栏高度）
  line-height: 44px;
  text-align: center;
  // background-color: #f1f;
  //   background-color: #f8f8f8;
  background-color: #FFFFFF;
  position: fixed;
  top: 0;
  z-index: 998;
  font-family: Monospaced Number, Chinese Quote, -apple-system,
    BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif !important;
  font-size: 32rpx;
  color: #000;
  font-weight: 500;
}
</style>

