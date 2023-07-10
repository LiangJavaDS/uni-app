<template>
    <view class="container">
        <view class="info">
            <view v-if="userInfo" class="infoTop" :style="'top:' + allHeight">
                <view class="avatar">
                    <image class="genderImg" src="@/static/man.png" v-if="userInfo.gender === '1'" mode="aspectFit" />
                    <image class="genderImg" src="@/static/woman.png" v-if="userInfo.gender === '2'" mode="aspectFit" />
                    <image class="avatarImg" :src="userInfo.avatarUrl" />
                </view>
                <text>{{ userInfo.nickName }}</text>
            </view>
            <view v-if="userInfo" class="infoBottom">
                <view class="socialContact">
                    <view class="socialContactItem">
                        <text>0</text>
                        <text>关注</text>
                    </view>
                    <view class="socialContactItem">
                        <text>0</text>
                        <text>粉丝</text>
                    </view>
                    <view class="socialContactItem">
                        <text>0</text>
                        <text>获赞</text>
                    </view>
                </view>
                <view class="operation">
                    <view class="operationinfo" @click="editInfo">
                        <text>编辑资料</text>
                    </view>
                    <view class="setting">
                        <view></view>
                        <view></view>
                        <view></view>
                    </view>
                </view>
            </view>
            <img class="backgroundImage" src="@/static/test5.jpg" />
        </view>
        <view class="content">
            <SegmentedControl :texts="texts" @tabChange="tabChange" :currentTab="currentTab" />
        </view>
    </view>
</template>

<script>
import SegmentedControl from "@/components/segmentedControl.vue";
import { jumpTo } from "@/utils/tool.js"
export default {
    components: { SegmentedControl },
    data() {
        return {
            userInfo: null,
            allHeight: null,
            texts: ["关注", "赞赏", "模版", "地址"],
            currentTab: 0
        }
    },
    onLoad() {

    },
    onShow() {
        this.allHeight = uni.getStorageSync("menuInfo").allHeight;
        this.userInfo = uni.getStorageSync("userInfo")
        console.log('7878userInfo', this.userInfo)
    },
    methods: {
        editInfo() {
            jumpTo("/pages/self/editInfo");
        },
        tabChange(value) {
            this.currentTab = value;
        },
    }
};
</script>


<style lang="scss">
.container {
    height: 100vh;
    position: relative;
}

.info {
    width: 100%;
    height: 50%;
    position: relative;
}

.backgroundImage {
    width: 100%;
    height: 100%;
}

.infoTop {
    position: absolute;
    padding: 35rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
        position: relative;

        .avatarImg {
            width: 140rpx;
            height: 140rpx;
            border-radius: 70rpx;
            border: 5rpx solid #fff;
        }

        .genderImg {
            position: absolute;
            top: 0;
            right: -15rpx;
            width: 50rpx;
            height: 50rpx;
            border-radius: 25rpx;
            background-color: #ffffff;
        }
    }
}

.infoBottom {
    position: absolute;
    bottom: 5vh;
    padding: 20rpx 0;
    color: #ffffff;
    font-weight: 700;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .socialContact {
        margin-left: 20rpx;
        display: flex;

        .socialContactItem {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 50rpx;
        }
    }

    .operation {
        margin-right: 20rpx;
        display: flex;
        align-items: center;

        .operationInfo {
            display: flex;
            width: 180rpx;
            height: 55rpx;
            justify-content: center;
            align-items: center;
            border-radius: 30rpx;
            margin-right: 30rpx;
            border: 2rpx solid #ffffff;
        }

        .setting {
            display: flex;
            flex-direction: column;
            height: 55rpx;
            width: 75rpx;
            border-radius: 25rpx;
            border: 2rpx solid #ffffff;
            justify-content: center;
            align-items: center;

            view {
                width: 40rpx;
                height: 5rpx;
                border-radius: 3rpx;
                margin: 5rpx 0;
                background-color: #ffffff;
            }
        }
    }
}

.content {
    position: absolute;
    bottom: 0;
    height: 55%;
    width: 100%;
    border-top-left-radius: 60rpx;
    border-top-right-radius: 60rpx;
    background-color: #ffffff;
}
</style>