<template>
  <view class="container">
    <view v-for="(item,index) in texts" :key="index" class="tabitem" @click="changeTab(index)">
      <view :class="currentTab===index?'currenttext':'bartext'">{{item}}</view>
      <view class="bar" v-if="currentTab===index"></view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    texts: {
      type: Array,
      default: [],
    },
    currentTab: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    changeTab(value) {
      this.$emit("tabChange",value)
    },
  },
};
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 7vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .tabitem {
    margin: 20rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .bar {
      width: 30rpx;
      height: 6rpx;
      border-radius: 5rpx;
      margin-top: 5rpx;
      background-color: #000000;
    }
  }
}
.currenttext {
  color: #000000;
  font-weight: 600;
}
.bartext {
  color: #a3a2a2;
}
</style>
