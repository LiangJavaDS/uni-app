<template>
  <view class="container" @click.stop>
    <view class="loading" v-if="loading">
      <image :src="base64Img.loadingChatList" />
    </view>
    <uni-transition :mode-class="['fade','zoom-in']" :show="!loading">
      <view class="chatBox">
        <scroll-view scroll-y :scroll-into-view="showid" class="chatList">
          <view :class="selectItemId===item.id?'chatitem selectitem':'chatitem'" v-for="(item,index) in data" :key="index" :id="'showid'+index" @click="selectItem(item)">
            <view v-if="item.toOpenid" class="name">{{item.fromName}}<text style="color: #747474">回复</text>{{item.toName}}:</view>
            <view class="name" v-else>{{item.fromName}}:</view>
            <view class="content">{{item.content}}</view>
          </view>
        </scroll-view>
        <view class="chatinput">
          <input :placeholder="inputPlaceholder" v-model="inputValue" confirm-type="send" :cursor-spacing="20" @confirm="sendChat" :focus="inputFocus" @keyboardheightchange="keyboardheightchange" />
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
import base64Img from "@/base64/common.json";
import { uniRequest } from "@/utils/tool.js";
export default {
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    orderid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      base64Img,
      loading: true,
      inputValue: "",
      data: [],
      showid: null,
      inputFocus: false,
      inputPlaceholder: "评论",
      speakType: "main",
      toObj: null,
      selectItemId: null,
    };
  },
  async created() {
    await this.getData("start");
    this.loading = false;
  },
  methods: {
    change(e) {
      this.show = e.show;
    },
    async getData(mark) {
      let data = (
        await uniRequest("orderOpration/search", "POST", {
          dbTable: this.userInfo.campus + "_orderchats",
          param: {
            orderid: this.orderid,
          },
        })
      ).data;
      this.data = data;
      if (mark === "add") {
        this.showid = "showid" + (data.length - 1);
      }
    },
    async sendChat() {
      if (this.inputValue !== "") {
        if (this.speakType === "main") {
          await uniRequest("orderOpration/add", "POST", {
            dbTable: this.userInfo.campus + "_orderchats",
            param: {
              orderid: this.orderid,
              fromOpenid: this.userInfo.openid,
              fromName: this.userInfo.nickName,
              content: this.inputValue,
            },
          });
        } else {
          await uniRequest("orderOpration/add", "POST", {
            dbTable: this.userInfo.campus + "_orderchats",
            param: {
              orderid: this.orderid,
              fromOpenid: this.userInfo.openid,
              fromName: this.userInfo.nickName,
              toOpenid: this.toObj.toOpenid,
              toName: this.toObj.toName,
              content: this.inputValue,
            },
          });
        }
      }
      this.inputValue = "";
      this.inputPlaceholder = "评论";
      this.speakType = "main";
      this.inputFocus = false;
      await this.getData("add");
      this.$emit("addChat");
    },
    selectItem(item) {
      if (this.inputFocus) {
        console.log("9898什么也不干");
        this.inputPlaceholder = "评论";
        this.speakType = "main";
        this.inputFocus = false;
        this.inputValue = "";
      } else {
        if (item.fromOpenid === this.userInfo.openid) {
          console.log("9898删除评论", item);
          this.selectItemId = item.id;
          uni.showActionSheet({
            alertText: "删除我的评论",
            itemList: ["删除"],
            itemColor: "#ff0000",
            success: async (res) => {
              await uniRequest("orderOpration/delete", "POST", {
                dbTable: this.userInfo.campus + "_orderchats",
                param: { id: item.id },
              });
              this.selectItemId = null
              this.getData("delete");
            },
            fail: () => {
              this.selectItemId = null
            },
          });
        } else {
          console.log("9898回复");
          this.speakType = "back";
          this.inputPlaceholder = "回复" + item.fromName;
          this.inputFocus = true;
          this.toObj = { toOpenid: item.fromOpenid, toName: item.fromName };
        }
      }
    },
    keyboardheightchange(e) {
      this.inputFocus = e.detail.height === 0 ? false : true;
    },
  },
};
</script>

<style lang="scss">
.container {
  padding: 20rpx 0;
}
.loading {
  text-align: center;
  image {
    width: 30rpx;
    height: 30rpx;
    animation: loading 1s linear infinite;
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.selectitem {
  background-color: #f8f8f8;
}
.chatBox {
  .chatList {
    max-height: 500rpx;
    color: #a3a2a2;
    overflow: auto;
    margin-bottom: 25rpx;
    .chatitem {
      margin: 15rpx 0;
      display: flex;
      .name {
        white-space: nowrap;
        color: #6f83bf;
        font-weight: bold;
        margin-right: 20rpx;
      }
      .content {
        // max-width: 75%;
      }
    }
  }
  .chatinput {
    height: 80rpx;
    border-radius: 30rpx;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    input {
      width: 100%;
    }
  }
}
</style>
