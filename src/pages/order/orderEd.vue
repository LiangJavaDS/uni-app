<template>
  <view class="container">
    <view class="contentitem" v-for="item in orderData" :key="item.id">
      <view class="title">
        <view class="info">
          <image v-if="item.status===3" :src="item.publisherOpenid===userInfo.openid?item[userInfo.campus+'runnerInfo'].avatarUrl:item[userInfo.campus+'publisherInfo'].avatarUrl" />
          <view class="titletext">{{item.goodsName}}</view>
        </view>
        <view style="color: #a19f9f">{{item.status===3?"已完成":"已取消"}}</view>
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
        <view class="allprice" v-if="item.status===3">
          <text>{{item.openid===userInfo.openid?"实付款":"收款"}}</text>
          <text class="mark"> ¥ </text>
          <text>{{(item.goodsPrice+item.price).toFixed(2)}}</text>
        </view>
        <view class="date">{{item.createdAt}}</view>
        <view class="cancelorder" v-if="item.openid===userInfo.publisherOpenid">再来一单</view>
      </view>
    </view>
  </view>
</template>

<script>
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
    return {};
  },
  methods: {
    dianji() {
      console.log("9898数据222", this.orderData);
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 88vh;
  background-color: #f6f6f6;
  overflow: auto;
  .contentitem {
    background-color: #ffffff;
    border-radius: 15rpx;
    margin: 25rpx 20rpx;
    padding: 20rpx;
    box-shadow: 0rpx 0rpx 10rpx 10rpx #d3d3d3;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info {
        display: flex;
        align-items: center;
        .titletext {
          font-size: 40rpx;
          font-weight: 500;
        }
        image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 40rpx;
          margin-right: 20rpx;
        }
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
        background-color: aqua;
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