<template>
    <view>
        <tui-toast ref="toast" position="center"></tui-toast>
        <uni-transition mode-class="fade" :show="userInfo && listType === 'mainList'">
            <scroll-view class="mainScrollView" refresh-default-style="none" enable-back-to-top lower-threshold="0"
                @scrolltolower="scrolltolower" refresher-enabled :refresher-triggered="topRefresh"
                @refresherrefresh="scrollTop" scroll-y>
                <view>
                    <swiper class="card-swiper" previous-margin="70rpx" next-margin="70rpx" autoplay circular>
                        <swiper-item v-for="(item, index) in list" :key="index" :class="cardCur === index ? 'cur' : ''">
                            <image :src="item" class="swiper-item swiperVip shadow-blur" />
                        </swiper-item>
                    </swiper>
                    <view class="search">
                        <view class="searchText hiddenText" @click="changeDropdownShow">
                            {{ userCampus }}
                        </view>
                        <text style="font-weight: bold">></text>
                        <view class="searchInput" @click="toSearchList">
                            <input placeholder="搜索" confirm-type="search" disabled />
                        </view>
                    </view>
                    <view class="list">
                        <view class="listItem" v-for="(item, index) in     data    " :key="index" @click="selectItem(item)">
                            <view class="itemTop">
                                <view class="topLeft">
                                    <view class="avatar">
                                        <image class="avatarImg" :src="item[userInfo.campus + 'publisherInfo'].avatarUrl"
                                            mode=" aspectFit" />
                                        <image v-if="item[userInfo.campus + 'publisherInfo'].gender === '1'"
                                            class="genderImg" src="@/static/man.png" mode="aspectFit" />
                                        <image v-if="item[userInfo.campus + 'publisherInfo'].gender === '2'"
                                            class="genderImg" src="@/static/woman.png" mode="aspectFit" />
                                    </view>
                                    <view class="nickName">{{ item[userInfo.campus + 'publisherInfo'].nickName }}</view>
                                </view>
                                <view class="topRight">
                                    <view class="followin">关注</view>
                                    <view class="more">
                                        <view></view>
                                        <view></view>
                                        <view></view>
                                    </view>
                                </view>
                            </view>
                            <view class="itemMiddle">
                                <view class="middleMainInfo">
                                    <view class="mainInfo">
                                        <image src="@/static/goods.png" mode="aspectFit" />
                                        <view class="hiddenText">{{ item.goodsName }}</view>
                                    </view>
                                    <view class="mainInfo">
                                        <image src="@/static/store.png" mode="aspectFit" />
                                        <view class="hiddenText">{{ item.goodsAddress }}</view>
                                    </view>
                                    <view class="mainInfo">
                                        <image src="@/static/wallet.png" mode="aspectFit" />
                                        <view>{{ item.price }}元</view>
                                    </view>
                                    <view v-if="item.desc" class="mainInfo">
                                        <image src="@/static/chat.png" mode="aspectFit" />
                                        <view> * * * * * * </view>
                                    </view>
                                </view>
                                <image class="desimg" v-if="item.photos" :src="item.photos" mode="widthFix"
                                    @click.stop="previewImage(item.photos)" />
                                <view style="color: #a3a2a2;text-align: right;margin-top: 15rpx">
                                    <uni-dateformat :date="item.createdAt" :threshold="[300000, 18000000]"></uni-dateformat>
                                </view>
                            </view>
                            <view class="operationbar" @click.stop>
                                <view class="operationbaritem" style="overflow: hidden;" @click.stop="award(item.id)">
                                    <image :class="'operationimg' + (clickCoinId === item.id ? ' coinAnimation' : '')"
                                        src="@/static/coin.png" />
                                    <view>打赏</view>
                                </view>
                                <view class="operationbaritem" @click.stop="comment(item.id)">
                                    <image class="operationimg" src="@/static/comment.png" />
                                    <view>{{ item.chatLength === 0 ? "写评论" : item.chatLength }}</view>
                                </view>
                                <view class="operationbaritem" @click.stop="support(item)">
                                    <image v-if="item.likesMap.get(userInfo.openid)" class="operationimg heartAnimation"
                                        src="@/static/heart.png" />
                                    <image v-else class="operationimg heartAnimation" src="@/static/like.png" />
                                    <view>{{ item.orderLikesLength }}</view>
                                </view>
                            </view>
                            <ChatList v-if="showChatBoxId === item.id" :orderid="item.orderid" :userInfo="userInfo"
                                @addChat="addChat(item)" />
                        </view>
                    </view>
                </view>
                <view class="nosearch" v-if="userInfo.type === '2'">
                    游客模式下暂时无法查看更多
                </view>
                <view class="bottomloading" v-show="bottomLoadingShow">
                    <image src="@/static/loadingBottom.png" />
                    <view>
                        正在加载···
                    </view>
                </view>
                <view class="nomore" v-show="noMore">
                    没有更多了
                </view>
            </scroll-view>
        </uni-transition>
        <!-- 搜索list页面 -->
        <uni-transition mode-class="fade" :show="this.userInfo && listType === 'searchList'">
            <view class="searchbar">
                <uni-search-bar @confirm="searchConfirm" @cancel="searchCancel" v-model="searchValue"
                    :focus="searchFocus"></uni-search-bar>
            </view>
            <scroll-view class="searchScrollView" scroll-y>
                <button @click="testSearch">查询</button>
                <view>
                    <view class="test" v-for="item in arr" :key="item">test</view>
                </view>
            </scroll-view>
        </uni-transition>
    </view>
</template>

<script>
import { uniRequest, jumpTo } from "@/utils/tool.js";
import RefreshLoading from "./refreshLoading.vue";
import ChatList from "./chatList.vue";
export default {
    components: { RefreshLoading, ChatList },
    data() {
        return {
            cardCur: 0,
            list: [
                "/static/swiper1.jpeg",
                "/static/swiper2.jpeg",
                "/static/swiper3.jpeg",
            ],
            data: [],
            topRefresh: false,
            bottomRefresh: false,
            userCampus: null,
            userInfo: null,
            bottomLoadingShow: false,
            noMore: false,
            listType: "mainList",
            searchValue: "",
            searchFocus: false,
            arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            clickCoinId: null,
            showChatBoxId: null, userInfo: null,
            listType: "mainList",
            campuses: []
        }
    },
    async onShow() {
        this.userInfo = uni.getStorageSync("userInfo");
        clearTimeout();
        if (uni.getStorageSync("isRefresh")) {
            await this.getData("start");
            uni.setStorageSync("isRefresh", false);
        }
        this.campuses = await uniRequest("campus/search", "POST");
    },
    watch: {
        "userInfo.campus"() {
            this.changeCampus();
            this.getData("start");
        },
    },
    methods: {
        changeCampus() {
            for (const item of this.campuses) {
                if (this.userInfo.campus === item.code) {
                    this.userCampus = item.name;
                    break;
                }
            }
        },
        award(id) {
            this.clickCoinId = id;
            setTimeout(() => {
                this.clickCoinId = null;
            }, 300);
        },
        comment(id) {
            console.log('8989id', id)
            this.showChatBoxId = id;
        },
        async support(item) {
            let flag = item.likesMap.get(this.userInfo.openid);
            console.log("9898flag", flag);
            if (flag === true || flag === false) {
                await uniRequest("orderOpration/update", "POST", {
                    dbTable: this.userInfo.campus + "_orderlikes",
                    searchParams: {
                        orderid: item.orderid,
                        openid: this.userInfo.openid,
                    },
                    updateParams: {
                        status: !flag,
                    },
                });
                item.likesMap.set(this.userInfo.openid, !flag);
                if (flag === true) {
                    item.orderLikesLength = item.orderLikesLength - 1;
                } else {
                    item.orderLikesLength = item.orderLikesLength + 1;
                }
            } else {
                await uniRequest("orderOpration/changeLikes", "POST", {
                    dbTable: this.userInfo.campus + "_orderlikes",
                    param: {
                        orderid: item.orderid,
                        openid: this.userInfo.openid,
                    },
                });
                item.likesMap.set(this.userInfo.openid, true);
                item.orderLikesLength = item.orderLikesLength + 1;
            }
        },
        async getData(mark) {
            this.showChatBoxId = null;
            let resData = await uniRequest("order/search", "POST", {
                dbTable: this.userInfo.campus,
                param: { status: 1 },
                type: "orderMainList",
                otherParam:
                    mark === "bottom"
                        ? { limit: 10, offset: this.data.length }
                        : { limit: 10 },
            });
            for (const item of resData.data) {
                item.chatLength = item.chatList.length;
                item.orderLikesLength = item.orderlikes.length;
                let likesMap = new Map();
                for (const item1 of item.orderlikes) {
                    likesMap.set(item1.openid, item1.status);
                }
                item.likesMap = likesMap;
            }
            if (mark === "bottom") {
                this.data.push(...resData.data);
            } else {
                this.data = resData.data;
            }
            if (resData.data.length === 0) {
                this.noMore = true;
            }
            this.bottomLoadingShow = false;
        },
        changeCampus() {
            for (const item of this.campuses) {
                if (this.userInfo.campus === item.code) {
                    this.userCampus = item.name;
                    break;
                }
            }
        },
        swiperChange(e) {
            this.cardCur = e.target.current;
        },
        async scrollTop(e) {
            if (this.topRefresh === false) {
                this.topRefresh = true;
                await this.getData("top");
                this.topRefresh = false;
            } else {
                return;
            }
        },
        async scrolltolower() {
            if (this.userInfo.type === "2" || this.noMore) {
                return;
            } else {
                this.bottomLoadingShow = true;
                await this.getData("bottom");
            }
        },
        changeDropdownShow() {
            jumpTo("/pages/chooseCampus/index");
        },
        selectItem(item) {
            if (this.userInfo.type === "1") {
                console.log("9898item", item);
                jumpTo("/pages/list/moreInfo", { orderInfo: JSON.stringify(item) });
            } else {
                let options = {
                    title: "游客模式下暂时无法查看更多",
                };
                this.$refs.toast.show(options);
            }
        },
        previewImage(src) {
            uni.previewImage({ urls: [src], indicator: "none" });
        },
        toSearchList() {
            console.log("9898去搜索了");
            this.listType = "searchList";
            setTimeout(() => {
                this.searchFocus = true;
            }, 301);
        },
        searchConfirm(e) {
            console.log("9898000", this.searchValue);
        },
        searchCancel() {
            this.listType = "mainList";
            this.searchFocus = false;
        },
        addChat(item) {
            item.chatLength = item.chatLength + 1;
        },
    }
};
</script>

<style lang="scss">
.coinAnimation {
    animation: coinJump 0.3s ease-in-out;
}

@keyframes coinJump {
    0% {
        transform: translateY(0rpx) rotateY(0deg);
    }

    50% {
        transform: translateY(-45rpx) rotateY(180deg);
    }

    100% {
        transform: translateY(0rpx) rotateY(360deg);
    }
}

.heartAnimation {
    animation: heart 0.4s ease-in-out;
}

@keyframes heart {
    0% {
        transform: scale(1);
    }

    25% {
        transform: scale(0.7);
    }

    50% {
        transform: scale(1);
    }

    75% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}

.mainScrollView {
    height: 100vh;
}

.searchScrollView {
    height: 90vh;
}

.searchbar {
    height: 10vh;
}

.test {
    height: 25vh;
    background-color: violet;
}

.card-swiper {
    height: 420rpx !important;
}

.card-swiper swiper-item {
    width: 610rpx !important;
    box-sizing: border-box;
    padding: 40rpx 0rpx 70rpx;
    overflow: initial;
}

.card-swiper swiper-item .swiper-item {
    width: 100%;
    display: block;
    height: 100%;
    border-radius: 10rpx;
    transform: scale(0.9);
    transition: all 0.2s ease-in 0s;
}

.card-swiper swiper-item.cur .swiper-item {
    transform: none;
    transition: all 0.2s ease-in 0s;
}

.swiperVip {
    height: 100%;
    opacity: 1;
}

.shadow-blur {
    position: relative;
}

.shadow-blur::before {
    content: "";
    display: block;
    background: inherit;
    filter: blur(10rpx);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 10rpx;
    left: 10rpx;
    z-index: -1;
    opacity: 0.4;
    transform-origin: 0 0;
    border-radius: inherit;
    transform: scale(1, 1);
}

.search {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    /* height: 80rpx; */
    display: flex;
    align-items: center;
    padding: 20rpx;
    font-weight: bold;
    z-index: 2;
}

.searchText {
    width: 150rpx;
}

.searchInput {
    display: flex;
    align-items: center;
    margin-left: 10rpx;
    padding-left: 40rpx;
    height: 80rpx;
    /* border: 1px #dbd8d8 solid; */
    border-radius: 40rpx;
    width: 100%;
    background-color: #f8f8f8;
    /* box-shadow: 5rpx 5rpx 20rpx 5rpx #cfcdcd; */
}

.list {
    padding: 10rpx;
}

.listItem {
    /* background-color: rgb(227, 162, 230); */
    padding: 20rpx;
    border-bottom: 1px dashed #e2dfdf;

    .operationbar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .operationbaritem {
            padding-top: 45rpx;
            display: flex;
            align-items: center;

            .operationimg {
                width: 45rpx;
                height: 45rpx;
                margin-right: 5rpx;
            }
        }
    }
}

.itemTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // height: 200rpx;
}

.topLeft {
    display: flex;
    align-items: center;

    .avatar {
        position: relative;
    }

    .avatarImg {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
    }

    .genderImg {
        position: absolute;
        top: 0;
        right: -15rpx;
        width: 46rpx;
        height: 46rpx;
        border-radius: 23rpx;
        background-color: #ffffff;
    }
}

.nickName {
    font-weight: bold;
    margin-left: 20rpx;
}

.topRight {
    display: flex;
    align-items: center;
}

.followin {
    width: 100rpx;
    height: 46rpx;
    line-height: 46rpx;
    margin-right: 30rpx;
    text-align: center;
    border: 1px solid #dbdada;
    color: #a3a2a2;
    border-radius: 24rpx;
    font-size: 25rpx;
    font-weight: bold;
}

.more {
    display: flex;

    view {
        width: 8rpx;
        height: 8rpx;
        border-radius: 4rpx;
        background-color: #757474;
        margin-left: 8rpx;
    }
}

.itemMiddle {
    margin-top: 30rpx;

    view image {
        width: 45rpx;
        height: 45rpx;
        margin: 0 20rpx;
    }
}

.middleMainInfo {
    margin: 20rpx 0;
}

.mainInfo {
    display: flex;
    align-content: center;
    margin: 30rpx 0;
}

.desimg {
    width: 100%;
    border-radius: 30rpx;
}

.nosearch {
    text-align: center;
    margin: 10rpx;
    color: #a3a2a2;
    height: 50px;
    line-height: 50rpx;
}

.bottomloading {
    text-align: center;
    // margin: 10rpx;
    color: #a3a2a2;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
        animation: loading 1s linear infinite;
    }
}

@-webkit-keyframes loading {
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

.nomore {
    text-align: center;
    margin: 10rpx;
    color: #a3a2a2;
    height: 50px;
    line-height: 50rpx;
}
</style>
