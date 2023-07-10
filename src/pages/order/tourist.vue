<template>
  <view class="tourist">
    <view class="text">游客模式暂不支持操作订单，您需要先选择社区。</view>
    <fui-button class="submitBtn" width="80%" background="#000000" color="#FFFFFF" @click="go">GO!</fui-button>
  </view>
</template>

<script>
import { jumpTo } from "@/utils/tool.js";
export default {
  data() {},
  methods: {
    go() {
        jumpTo("/pages/chooseCampus/index");
    },
  },
};
</script>

<style lang="scss" >
.tourist {
  height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  .text {
    margin-top: 50rpx;
    color: #a3a2a2;
    text-align: center;
    margin: 100rpx 0;
  }
}
.submitBtn {
  display: flex;
  justify-content: center;
  margin: 50rpx 0;
}
</style>
