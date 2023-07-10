<template>
    <view>
        <uni-transition mode-class="fade" :show="this.userInfo && listType === 'mainList'" />
        list页
    </view>
</template>

<script>
export default {
    data() {

        return {
            userInfo: null,
            listType: "mainList"
        }
    },
    onLoad() {

    },
    onShow() {
        this.userInfo = uni.getStorageSync("userInfo");
    },
    methods: {

    }
};
</script>

<style lang="scss"></style>
