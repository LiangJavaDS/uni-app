<template>
  <view class="spinner">
    <view class="rect1"></view>
    <view class="rect2"></view>
    <view class="rect3"></view>
    <view class="rect4"></view>
    <view class="rect5"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {},
};
</script>

<style>
.spinner {
  height: 5vh;
  width: 750rpx;
  padding: 5rpx;
  display: flex;
  justify-content: center;
}
.spinner view {
  height: 100%;
  width: 10rpx;
  margin: 2rpx 13rpx;
  border-radius: 7rpx;
  /* background: linear-gradient(#60b8e4, #57f0c5); */
  background: linear-gradient(#57f0c5, #60b8e4);
  animation: refresh 0.8s infinite ease-in-out;
}
.spinner .rect2 {
  animation-delay: -0.7s;
}
.spinner .rect3 {
  animation-delay: -0.6s;
}
.spinner .rect4 {
  animation-delay: -0.5s;
}
.spinner .rect5 {
  animation-delay: -0.4s;
}
@keyframes refresh {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
