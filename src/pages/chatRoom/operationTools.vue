<template>
  <view class="container">
    <view class="tool">
      <view class="toolback" @click="chooseMedia">
        <image src="@/static/media.png" />
      </view>
      <view class="title">照片</view>
    </view>
    <view class="tool">
      <view class="toolback" @click="showOrderInfo">
        <image src="@/static/orderInfo.png" />
      </view>
      <view class="title">订单详情</view>
    </view>
    <view class="tool" v-if="userInfo.openid===orderInfo.runnerOpenid">
      <view class="toolback" @click="addMoney">
        <image src="@/static/money.png" />
      </view>
      <view class="title">追加酬劳</view>
    </view>
    <view class="tool">
      <view class="toolback" @click="completeOrder">
        <image src="@/static/complete.png" />
      </view>
      <view class="title">完成订单</view>
    </view>
    <view class="tool">
      <view class="toolback" @click="cancelOrder">
        <image src="@/static/cancelOrder.png" />
      </view>
      <view class="title">取消订单</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    orderInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {
    chooseMedia() {
      this.$emit("chooseMedia");
    },
    showOrderInfo() {
      this.$emit("showOrderInfo");
    },
    addMoney() {
      uni.showActionSheet({
        alertText: "追加酬劳需要对方确认",
        itemList: ["确定"],
        itemColor: "#1a94bc",
        success: () => {
            this.$emit("addMoneyReq")
        },
        fail: () => {},
      });
    },
    completeOrder() {},
    cancelOrder() {},
  },
};
</script>

<style lang="scss">
.container {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
.tool {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .toolback {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    margin-top: 30rpx;
    image {
      width: 60rpx;
      height: 60rpx;
    }
  }
  .title {
    font-size: 25rpx;
    margin: 20rpx 0;
    color: #a09d9d;
  }
}
</style>
