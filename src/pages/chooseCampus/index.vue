<template>
  <view>
    <view>
      <NavBar />
      <navigationBar titleText="选择社区" />
      <view :style="'height:' + allHeight"></view>
      <view class="title" :style="'top:' + allHeight">
        <view class="current">{{ currentName }}</view>
        <view class="searchInput">
          <view class="inpuitem">
            <input placeholder="搜索" confirm-type="search" />
          </view>
        </view>
      </view>

      <view v-for="item in myCampuses" @click="selectCampus(item.code, item.name)" :key="item.code" class="campusitem">
        <view>{{ item.name }}</view>
        <image v-if="currentCode === item.code" src="@/static/select.png" />
      </view>
    </view>
    <tui-bottom-popup :zIndex="1002" :maskZIndex="1001" :show="isPopupShow" @close="closePopup">
      <view class="popupCampus">
        <view class="popuptext">确定切换到{{ popupCurrentName }}吗？</view>
        <view class="popupbtncontent">
          <fui-button class="popupbtn" width="70%" background="#FFFFFF" color="#000000"
            @click="closePopup">取消</fui-button>
          <fui-button class="popupbtn" width="70%" background="#000000" color="#FFFFFF" @click="okPopup">确定</fui-button>
        </view>
      </view>
    </tui-bottom-popup>
  </view>
</template>

<script>
import { uniRequest, reSetArr } from "@/utils/tool.js";
import NavBar from "@/components/navBar.vue";
import navigationBar from "@/components/navigationBar.vue";
export default {
  components: { navigationBar, NavBar },
  data() {
    return {
      userInfo: null,
      currentName: null,
      currentCode: null,
      popupCurrentCode: null,
      popupCurrentName: null,
      allHeight: null,
      myCampuses: [],
      isPopupShow: false,
    };
  },
  async onShow() {
    this.allHeight = uni.getStorageSync("menuInfo").allHeight;
    let myCampuses = await uniRequest("campus/search", "POST");
    this.myCampuses = myCampuses.data;
    reSetArr(this.campuses, myCampuses.data);
    let userInfo = uni.getStorageSync("userInfo");
    this.userInfo = userInfo;
    this.getCampusName(userInfo.campus);
  },
  methods: {
    getCampusName(code) {
      if (code) {
        this.myCampuses.forEach((item) => {
          if (item.code === code) {
            this.currentName = item.name;
            this.currentCode = item.code;
          }
        });
      } else {
        this.currentName = "游客模式";
      }
    },
    selectCampus(code, name) {
      if (code !== this.currentCode) {
        this.popupCurrentCode = code;
        this.popupCurrentName = name;
        this.isPopupShow = true;
      }
    },
    async okPopup() {
      this.currentName = this.popupCurrentName;
      this.currentCode = this.popupCurrentCode;
      await uniRequest("userInfo/update", "POST", {
        searchParams: { openid: this.userInfo.openid },
        updateParams: {
          campus: this.popupCurrentCode,
          type: "1",
        },
      });
      let userInfo = await uniRequest("userInfo/search", "POST", {
        openid: this.userInfo.openid,
      });
      console.log("9898修改后", userInfo);
      uni.setStorageSync("userInfo", userInfo.data)
      this.userInfo = userInfo.data
      this.isPopupShow = false;
    },
    closePopup() {
      this.isPopupShow = false;
    },
  },
};
</script>

<style lang="scss" >
.campusitem {
  height: 70rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  image {
    width: 70rpx;
    height: 70rpx;
  }
}

.title {
  position: -webkit-sticky;
  position: sticky;
  background-color: #ffffff;
  padding: 30rpx;

  .current {
    font-size: 60rpx;
    font-weight: 600;
  }
}

.searchInput {
  display: flex;
  align-items: center;
  height: 120rpx;
}

.inpuitem {
  display: flex;
  align-items: center;
  // margin: 45rpx 30rpx;
  padding-left: 40rpx;
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #f8f8f8;
}

.popupCampus {
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .popuptext {
    font-size: 45rpx;
    font-weight: 500;
  }

  .popupbtncontent {
    width: 70%;
    display: flex;
    justify-content: center;

    .popupbtn {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 50rpx 0;
    }
  }
}</style>
