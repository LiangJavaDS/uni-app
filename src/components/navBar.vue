<template>
  <view>
    <view v-if="mark==='all'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight, border: '1rpx solid #ddd',borderRadius:menuBorderRadius, backgroundColor: '#ffffff'}">
      <uni-icons @click="goToBack" class="arrowleft" type="arrowleft" :color="'#000'" size="20" />
      <text class="text_box"></text>
      <tui-icon @click="goToHome" class="home" :color="'#000'" size="20" name="home-fill"></tui-icon>
    </view>
    <view v-if="mark==='back'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight }">
      <uni-icons @click="goToBack" class="arrowleft" type="arrowleft" :color="'#000'" size="25" />
      <!-- <text class="text_box"></text> -->
      <!-- <uni-icons @click="goToHome" class="home" type="home" :color="'#000'" size="20" /> -->
    </view>
    <view v-if="mark==='home'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight }">
      <tui-icon @click="goToHome" class="arrowleft" :color="'#000'" size="25" name="home-fill"></tui-icon>
    </view>
    <view v-if="mark==='chat'" class="menu_btn" :style="{ position: 'fixed',top:menuTop,left:menuRight,width:menuWidth,height:menuHeight }"> 
      <tui-icon @click="goToChatRoom" class="arrowleft" :color="'#000'" size="25" name="community-fill"></tui-icon>
    </view>
  </view>
</template>
<script>
import { jumpTo } from "@/utils/tool.js";
export default {
  props: {
    mark: {
      type: String,
      default: "all",
    },
    orderInfo: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      statusBarHeight: uni.getStorageSync("menuInfo").statusBarHeight, //状态栏的高度（可以设置为顶部导航条的padding-top）
      menuWidth: uni.getStorageSync("menuInfo").menuWidth,
      menuHeight: uni.getStorageSync("menuInfo").menuHeight,
      menuBorderRadius: uni.getStorageSync("menuInfo").menuBorderRadius,
      menuRight: uni.getStorageSync("menuInfo").menuRight,
      menuTop: uni.getStorageSync("menuInfo").menuTop,
      contentTop: uni.getStorageSync("menuInfo").contentTop,
    };
  },
  methods: {
    goToBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    goToHome() {
      uni.switchTab({
        url: "/pages/list/index",
      });
    },
    goToChatRoom() {
      jumpTo("/pages/chatRoom/index",{ orderInfo: this.orderInfo});
    }
  },
};
</script>

<style lang="scss" scope>
.menu_btn {
  // background-color: #ffffff; //这个是小程序默认的标题栏背景色
  overflow: hidden;
  z-index: 999;
  // position: fixed;//行内式写了固定定位--目的是去掉下划页面一起滚动问题
  .arrowleft {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-160%, -50%) !important;
    -webkit-transform: translate(-160%, -50%) !important;
  }
  .text_box {
    width: 1rpx;
    height: 20px;
    background-color: #ddd;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) !important;
    -webkit-transform: translate(-50%, -50%) !important;
  }
  .home {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(60%, -50%) !important;
    -webkit-transform: translate(60%, -50%) !important;
  }
}
</style>

