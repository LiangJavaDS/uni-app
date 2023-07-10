<template>
  <view class="order">
    <view v-if="userInfo && userInfo.type === '2'">
      <Tourist />
    </view>
    <view class="lhy" v-if="userInfo && userInfo.type === '1'">
      <SegmentedControl :texts="texts" @tabChange="tabChange" :currentTab="currentTab">
        <view class="typeChange" v-if="currentTab === 1 || currentTab === 3">
          <view class="box" @click="changeType">
            <image :class="isChanging ? 'typechangeing' : 'loadingimg'" src="@/static/loadingSearch.png" />
            <view class="typetext">{{ typeText[typeIndex] }}</view>
          </view>
        </view>
      </SegmentedControl>
    </view>
    订单页11
  </view>
</template>

<script>

import { uniRequest } from "@/utils/tool.js";
// import NewOrder from "./newOrder.vue";
import OrderSelf from "./orderSelf.vue";
import OrderIng from "./orderIng.vue";
import OrderEd from "./orderEd.vue";
import Tourist from "./tourist.vue";
import { orderBase64 } from "@/base64/index.js";
import SegmentedControl from "@/components/segmentedControl.vue";

export default {
  components: {
    // NewOrder,
    OrderIng,
    OrderEd,
    Tourist,
    SegmentedControl,
    OrderSelf,
  },
  data() {
    return {
      orderBase64,
      texts: ["去下单", "进行中", "我发出", "已完成"],
      currentTab: 1,
      userInfo: null,

      orderDataIng: [],
      orderDataSelf: [],
      orderDataEd: [],

      typeIndex: 0,
      typeText: ["全部", "我发出的", "我接受的"],
      isChanging: false
    }
  },
  onLoad() {

  },
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo")
    if (this.currentTab === 0) return
    this.getOrderData()
  },
  methods: {
    async tabChange(value) {
      this.currentTab = value
      if (value !== 0) {
        await this.getOrderData()
      }
    },
    changeType() {
      this.isChanging = true;
      if (this.typeIndex === 2) {
        this.typeIndex = 0;
      } else {
        this.typeIndex++;
      }
      this.getOrderData();
    },
    async getOrderData() {
      let param;
      if (this.currentTab === 1) {
        if (this.typeIndex == 0) {
          param = {
            status: 2,
            $or: [
              { publisherOpenid: this.userInfo.openid },
              { runnerOpenid: this.userInfo.openid },
            ],
          };
        }
        if (this.typeIndex == 1) {
          param = {
            status: 2,
            publisherOpenid: this.userInfo.openid,
          };
        }
        if (this.typeIndex == 2) {
          param = {
            status: 2,
            runnerOpenid: this.userInfo.openid,
          };
        }
      }
      if (this.currentTab === 2) {
        param = {
          status: 1,
          publisherOpenid: this.userInfo.openid,
        };
      }
      if (this.currentTab === 3) {
        if (this.typeIndex == 0) {
          param = {
            status: {
              $or: [3, 4],
            },
            $or: [
              { publisherOpenid: this.userInfo.openid },
              { runnerOpenid: this.userInfo.openid },
            ],
          };
        }
        if (this.typeIndex == 1) {
          param = {
            status: {
              $or: [3, 4],
            },
            publisherOpenid: this.userInfo.openid,
          };
        }
        if (this.typeIndex == 2) {
          param = {
            status: {
              $or: [3, 4],
            },
            runnerOpenid: this.userInfo.openid,
          };
        }
      }
      let resData = await uniRequest("order/search", "POST", {
        type: "orderPageList",
        dbTable: this.userInfo.campus,
        param,
      });
      for (const item of resData.data) {
        if (item.chatLogs) {
          let arrChats = JSON.parse(item.chatLogs.content)
          if (arrChats.length > 0) {
            item.lastChat = arrChats[arrChats.length - 1]
          } else {
            item.lastChat = null
          }
        }
      }
      if (this.currentTab === 1) {
        this.orderDataIng = resData.data;
      }
      if (this.currentTab === 2) {
        this.orderDataSelf = resData.data;
      }
      if (this.currentTab === 3) {
        this.orderDataEd = resData.data;
      }
      this.isChanging = false;
    },
  }
};
</script>

<style lang="scss">
.order {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
