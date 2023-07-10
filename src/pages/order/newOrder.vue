<template>
  <view>
    <tui-toast ref="toast" position="center"></tui-toast>
    <fui-loading v-if="submitLoading" text="提交中. . ." :srcCol="commonBase64.loading"></fui-loading>
    <view class="content" v-if="isContentShow">
      <!-- 商品信息 -->
      <view class="card">
        <tui-card :image="card.goodsInfo.img" :title="card.goodsInfo.title">
          <template slot="body">
            <view class="tui-default">
              <fui-input v-model="form.goodsName" label="名称" required textRight placeholder="请输入商品名称" />
              <fui-input v-model="form.goodsAddress" label="地址" required textRight placeholder="请输入商品购买地址" />
              <fui-input v-model="form.goodsPrice" label="价格" type="digit" required textRight
                placeholder="商品预估价格(代取快递等输入0)" />
            </view>
          </template>
        </tui-card>
      </view>
      <!-- 个人信息 -->
      <view class="card">
        <tui-card :image="card.self.img" :title="card.self.title">
          <template slot="body">
            <view class="tui-default">
              <fui-input v-model="form.selfAddress" label="送达地址" required textRight placeholder="请输入您希望的送达地址" />
              <fui-input v-model="form.mobile" label="手机号码" type="number" textRight placeholder="请输入手机号码" />
              <fui-input v-model="form.wxAccount" label="微信账号" textRight placeholder="请输入微信账号" />
              <fui-input v-model="form.qqAccount" label="QQ账号" textRight placeholder="请输入QQ账号" />
            </view>
          </template>
        </tui-card>
      </view>
      <!-- 酬劳 -->
      <view class="card">
        <tui-card :image="card.payment.img" :title="card.payment.title">
          <template slot="body">
            <view class="tui-default">
              <fui-input foces v-model="form.price" label="酬劳" type="digit" required textRight
                placeholder="请输入您愿意支付的酬劳" />
            </view>
          </template>
        </tui-card>
      </view>
      <!-- 照片 -->
      <view class="card">
        <tui-card :image="card.photos.img" :title="card.photos.title" :tag="card.photos.tag">
          <template slot="body">
            <view class="tui-default photo">
              <uni-file-picker :image-styles="photoStyle" v-model="form.localphotos" return-type="object"
                fileMediatype="image" mode="grid" @select="select" @progress="progress" @success="success" @fail="fail"
                @delete="deletePhoto">
                <tui-icon name="camera-add"></tui-icon>
              </uni-file-picker>
            </view>
          </template>
        </tui-card>
      </view>
      <!-- 备注 -->
      <view class="card">
        <tui-card :image="card.desc.img" :title="card.desc.title">
          <template slot="body">
            <view class="tui-default">
              <fui-textarea v-model="form.desc" maxlength="250" placeholder="稍几句话呦～" isCounter />
            </view>
          </template>
        </tui-card>
      </view>
      <fui-button class="submitBtn" width="80%" background="#000000" color="#FFFFFF" @click="submit">发送</fui-button>
    </view>
  </view>
</template>

<script>
import {
  uniRequest,
  jumpTo,
  wxPay,
  uploadFile,
  getRandomOrderId,
} from "@/utils/tool.js";
import { commonBase64, addCampusBase64, orderBase64 } from "@/base64/index.js";
export default {
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
  },
  created() {
    this.form.mobile = this.userInfo.phoneNumber;
  },
  data() {
    return {
      orderBase64,
      addCampusBase64,
      commonBase64,
      form: {
        goodsName: null,
        goodsAddress: null,
        goodsPrice: null,
        wxAccount: null,
        qqAccount: null,
        mobile: null,
        selfAddress: null,
        price: null,
        photos: null,
        localphotos: null,
        desc: "",
      },
      tips: [
        { value: "goodsName", label: "请输入商品名称" },
        { value: "goodsAddress", label: "请输入商品购买地址" },
        { value: "goodsPrice", label: "请输入商品预估价格" },
        { value: "price", label: "请输入酬劳" },
        { value: "selfAddress", label: "请输入您希望的送达地址" },
      ],
      isContentShow: true,
      card: {
        self: {
          img: {
            url: addCampusBase64.selfInfo,
          },
          title: {
            text: "个人信息",
            color: "#000000",
            size: 34,
          },
          tag: {
            text: "（仅用做后续提供奖励联系您）",
          },
        },
        goodsInfo: {
          img: {
            url: "/static/goods.png",
          },
          title: {
            text: "商品信息",
            color: "#000000",
            size: 34,
          },
        },
        desc: {
          img: {
            url: "/static/chat.png",
          },
          title: {
            text: "备注",
            color: "#000000",
            size: 34,
          },
        },
        photos: {
          img: {
            url: "/static/camera.png",
          },
          title: {
            text: "show",
            color: "#000000",
            size: 34,
          },
          tag: {
            text: "添加图片更容易被runner注意到哦",
          },
        },
        payment: {
          img: {
            url: "/static/wallet.png",
          },
          title: {
            text: "酬劳",
            color: "#000000",
            size: 34,
          },
        },
      },
      submitLoading: false,
      photoStyle: {
        border: {
          // 如果为 Boolean 值，可以控制边框显示与否
          color: "#eee", // 边框颜色
          width: "1px", // 边框宽度
          style: "solid", // 边框样式
          radius: "10%", // 边框圆角，支持百分比
        },
      },
    };
  },
  methods: {
    // 获取上传状态
    select(e) {
      console.log("选择文件：", e);
      this.form.localphotos = e.tempFiles[0];
    },
    //
    deletePhoto(e) {
      console.log("删除文件：", e);
      this.form.localphotos = null;
    },
    // 获取上传进度
    progress(e) {
      console.log("上传进度：", e);
    },

    // 上传成功
    success(e) {
      console.log("上传成功");
    },

    // 上传失败
    fail(e) {
      console.log("上传失败：", e);
    },
    async submit() {
      let userData = await uniRequest("userInfo/search", "POST", {
        unionid: this.userInfo.unionid,
      });
      uni.setStorageSync("userInfo", userData.data);
      if (userData.data.serviceOpenid) {
        for (const item of this.tips) {
          if (!this.form[item.value]) {
            let options = {
              title: item.label,
              imgUrl: commonBase64.warn,
              icon: true,
            };
            this.$refs.toast.show(options);
            return;
          }
        }
        let orderid = this.userInfo.campus + getRandomOrderId();
        await wxPay({
          price: Number(this.form.price).toFixed(2),
          openid: this.userInfo.openid,
          orderid,
        });
        let cloudPhotoPath = null;
        if (this.form.localphotos) {
          cloudPhotoPath = await uploadFile({
            filePath: this.form.localphotos.path,
            folder: "descImg/",
          });
        }
        this.isContentShow = false;
        this.submitLoading = true;
        await uniRequest("order/add", "POST", {
          ...this.form,
          photos: cloudPhotoPath,
          goodsPrice: Number(this.form.goodsPrice).toFixed(2),
          price: Number(this.form.price).toFixed(2),
          publisherOpenid: this.userInfo.openid,
          dbTable: this.userInfo.campus + "_orders",
          campus: this.userInfo.campus,
          orderid,
          status: 1,
        });
        for (const key in this.form) {
          if (key === "desc") {
            this.form[key] = "";
          } else {
            if (key === "mobile") {
              continue;
            } else {
              this.form[key] = null;
            }
          }
        }
        this.submitLoading = false;
        this.isContentShow = true;
        uni.setStorageSync("isRefresh", true);
        jumpTo("/pages/result/index", { title: "发送成功！" });
      } else {
        uni.showActionSheet({
          alertText: "您需要先查看RunnersPub下单规则",
          itemList: ["查看"],
          itemColor: "#1a94bc",
          success: () => {
            jumpTo("/pages/servicePages/rule");
          },
          fail: () => { },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.content {
  height: 93vh;
  overflow: auto;
}

.photo {
  padding: 30rpx;
}

.card {
  margin-bottom: 20rpx;
}

.fui-input__required {
  position: absolute;
  left: 12rpx;
  /* #ifndef APP-NVUE */
  height: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1.15;
  /* #endif */

  /* #ifdef APP-NVUE */
  flex: 1;
  align-items: center;
  justify-content: center;
  line-height: 1;
  /* #endif */
}

.fui-input__placeholder {
  padding-right: 13rpx;
  /* #ifndef APP-NVUE */
  color: var(--fui-color-minor, #ccc);
  overflow: visible;
  /* #endif */
  /* #ifdef APP-NVUE */
  color: #ccc;
  font-size: 32rpx;
  /* #endif */
}

.columnFlex {
  display: flex;
  align-items: center;
}

.submitBtn {
  display: flex;
  justify-content: center;
  margin: 50rpx 0;
}</style>


