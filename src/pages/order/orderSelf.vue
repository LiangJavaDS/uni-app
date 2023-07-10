<template>
  <view class="container">
    <view class="contentitem" v-for="item in orderData" :key="item.id">
      <view class="title">
        <view class="titleleft">{{item.goodsName}}</view>
        <view class="titleright">等待接单</view>
      </view>
      <view :class="item.photos?'middleinfo':''">
        <image class="goodsimg" v-if="item.photos" :src="item.photos" />
        <view class="priceinfo" style="margin:20rpx 0">
          <view>{{item.goodsAddress}}</view>
          <view>商品价格：{{item.goodsPrice.toFixed(2)}}</view>
          <view>报酬：{{item.price.toFixed(2)}}</view>
        </view>
      </view>
      <view class="bottominfo">
        <view class="allprice">
          <text>实付款</text>
          <text class="mark"> ¥ </text>
          <text>{{(item.goodsPrice+item.price).toFixed(2)}}</text>
        </view>
        <view class="date">{{item.createdAt}}</view>
        <view class="cancelorder" @click="cancelOrder(item)">取消订单</view>
      </view>
    </view>
  </view>
</template>

<script>
import { uniRequest, jumpTo } from "@/utils/tool.js";
export default {
  props: {
    orderData: {
      type: Array,
      default: [],
    },
    userInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    cancelOrder(item) {
      uni.showActionSheet({
        alertText: "确定取消此订单吗？",
        itemList: ["确定"],
        itemColor: "#ff0000",
        success: () => this.changeOrderType(item),
        fail: () => {},
      });
    },
    async changeOrderType(item) {
      let resData = await uniRequest("order/update", "POST", {
        dbTable: this.userInfo.campus + "_orders",
        searchParams: { id: item.id, status: 1 },
        updateParams: { status: 4 },
      });
      if (resData.code === 1) {
        uni.showToast({
          title: "订单已取消",
          icon: "none",
          duration: 1500,
        });
      } else {
        uni.showToast({
          title: "订单已被接收，您需要在“订单-进行中”与runner沟通确认后取消",
          icon: "none",
          duration: 3500,
        });
      }
      this.$emit("getOrderData");
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 93vh;
  background-color: #f6f6f6;
  overflow: auto;
  .contentitem {
    background-color: #ffffff;
    border-radius: 15rpx;
    margin: 25rpx 20rpx;
    padding: 20rpx;
    box-shadow: 0rpx 0rpx 10rpx 10rpx #dedede;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titleleft {
        font-size: 40rpx;
        font-weight: 500;
      }
      .titleright {
        color: #a19f9f;
      }
    }
    .middleinfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 25rpx 0;
      .goodsimg {
        width: 200rpx;
        height: 200rpx;
        border-radius: 15rpx;
      }
      .priceinfo {
        text-align: right;
      }
    }
    .bottominfo {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .allprice {
        font-weight: 500;
        .mark {
          font-size: 21rpx;
        }
      }
      .date {
        color: #a19f9f;
        margin: 15rpx 0;
      }
      .cancelorder {
        text-align: center;
        height: 60rpx;
        width: 180rpx;
        border-radius: 40rpx;
        line-height: 60rpx;
        border: #a19f9f 1px solid;
      }
    }
  }
}
</style>