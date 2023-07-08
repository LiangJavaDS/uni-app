<template>
    <view>
        <NavBar />
        <navigationBar :opacity="1" titleText="个人信息编辑" />
        <fui-loading v-if="submitLoading" text="提交中. . ." :srcCol="commonBase64.loading"></fui-loading>
        <view class="container" :style="'margin-top:' + allHeight" v-if="userInfo">
            <view class="avatar">
                <image class="avatarimg" :src="avatarUrl" />
                <image class="editimg" src="@/static/edit.png" @click="selectImg" mode="aspectFit" />
            </view>
            <view class="contentitem">
                <view class="title">昵称</view>
                <input class="value" v-model="userInfo.nickName" />
            </view>
            <view class="contentitem">
                <view class="title">性别</view>
                <picker @change="changeGender" :range="sexes">
                    <view class="value">{{ getGender(userInfo.gender) }}</view>
                </picker>
            </view>
            <fui-button class="submitBtn" width="80%" background="#000000" color="#FFFFFF" @click="submit">确定</fui-button>
        </view>
    </view>
</template>

<script>
import NavBar from "@/components/navBar.vue";
import navigationBar from "@/components/navigationBar.vue"
import { commonBase64 } from "@/base64/index.js";
import { uploadFile, uniRequest, jumpTo } from "@/utils/tool.js"
export default {
    components: { NavBar, navigationBar },
    data() {
        return {
            commonBase64,
            avatarUrl: null,
            allHeight: null,
            userInfo: null,
            form: {},
            submitLoading: false,
            sexes: ["男生", "女生"],
        }
    },
    onLoad() {

    },
    onShow() {
        this.allHeight = uni.getStorageSync("menuInfo").allHeight;
        this.userInfo = uni.getStorageSync("userInfo");
        this.avatarUrl = this.userInfo.avatarUrl;
    },
    methods: {
        selectImg() {
            uni.chooseImage({
                count: 1,
                success: async ({ tempFilePaths, tempFiles }) => {
                    // 更新页面
                    this.avatarUrl = tempFilePaths[0]
                    // 更新至sdk
                    const cloudPhotoPath = await uploadFile({
                        filePath: this.avatarUrl,
                        folder: "userAvatar/",
                    });
                    // 更新至数据库
                    await uniRequest("userInfo/update", "POST", {
                        searchParams: { openid: this.userInfo.openid },
                        updateParams: {
                            avatarUrl: cloudPhotoPath
                        }
                    });
                    uni.setStorageSync('userInfo', {
                        ...this.userInfo,
                        avatarUrl: cloudPhotoPath
                    })
                },
                fail: (error) => { }
            })
        },
        getGender(value) {
            const config = {
                "1": "男生",
                "2": "女生",
                "0": "未知"
            }
            return config[value]
        },
        changeGender(e) {
            if (e.detail.value === "0") {
                this.userInfo.gender = "1";
            }
            if (e.detail.value === "1") {
                this.userInfo.gender = "2";
            }
        },
        async submit() {
            this.submitLoading = true
            await uniRequest("userInfo/update", "POST", {
                searchParams: { openid: this.userInfo.openid },
                updateParams: {
                    gender: this.userInfo.gender,
                    nickName: this.userInfo.nickName,
                },
            });
            const userData = (await uniRequest("userInfo/search", "POST", {
                openid: this.userInfo.openid,
            })).data;
            this.userInfo = userData;
            this.avatarUrl = userData.avatarUrl;
            uni.setStorageSync("userInfo", userData);
            this.submitLoading = false;
            jumpTo("/pages/result/index", { title: "修改成功！" });
        }
    }
};
</script>

<style lang="scss">
.container {
    padding: 50rpx 20rpx 20rpx 20rpx;
}

.avatar {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.avatarimg {
    width: 180rpx;
    height: 180rpx;
    border-radius: 90rpx;
    border: 5rpx solid #ffffff;
}

.editimg {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    margin-left: 30rpx;
}

.contentitem {
    margin: 100rpx 0;
}

.title {
    margin: 30rpx 0;
    color: #a3a2a2;
}

.value {
    font-weight: 600;
    font-size: 35rpx;
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #a3a2a2;
}

.submitBtn {
    display: flex;
    justify-content: center;
    margin: 50rpx 0;
}
</style>

