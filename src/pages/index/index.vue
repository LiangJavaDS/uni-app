<template>
	<view >
		<fui-loading v-if="loading" text="加载中。。。" :srcCol="commonBase64.loading"></fui-loading>
		<tui-toast ref="toast" position="center"></tui-toast>
		<view v-if="isShowLogin" class="container">
			<view class="title">RunnersPub</view>
			<view v-if="showMark === 'go'" class="go" @click="go">GO!</view>
		<uni-transition style="z-index: 10;" :mode-class="['fade','zoom-in']" :show="showMark==='login' || showMark === 'getPhone'">
			<view class="loginBox">
				<view class="loginContent" v-if="loginType==='login'">
					<view class="title">选择社区</view>
					<view class="selectBox">
						<view class="campus" v-for="item in campuses" @click="selectCampus(item.code)" :key="item.code">
							<view>{{item.name}}</view>
							<image v-if="currentCode === item.code" src="@/static/select.png"></image>
						</view>
					</view>
					<button size="mini" @click="login">
						<view class="buttonStyle">
							<image src="@/static/weChat.png"/>
							<view class="btnText">微信登录</view>
						</view>
					</button>
				</view>
				<view class="loginContent" v-if="loginType=='getPhone'">
					<view class="title1">绑定手机号</view>
					<view class="title2">请先绑定手机号再进行此操作</view>
					<button size="mini" open-type="getPhoneNumber" @getphonenumber="getPhonenumberGo">
						<view class="buttonStyle">
							<image src="@/static/weChat.png" />
							<view class="btnText">微信用户一键绑定</view>
						</view>
					</button>
				</view>
			</view>
		</uni-transition>
		</view>
	</view>
</template>

<script>
import { commonBase64,addCampusBase64} from "@/base64/index"
import {uniRequest} from"@/utils/tool.js"
import {getOpenid} from "@/utils/login.js"
import { getFileName } from '@/utils/tool'
	export default {
		async onLoad() {
			let myCampuses = await uniRequest("campus/search", "POST");
			this.campuses = myCampuses.data
			this.loading = false
		},
		async onShow() {
			//获取是否新用户
			let loginData = await getOpenid();
			this.openid = loginData.openid;
			this.unionid = loginData.unionid;
			let userData = await uniRequest("userInfo/search", "POST", {
				unionid: this.openId,
			});
			//如果是老用户 返回用户信息，并存到本地
			uni.setStorageSync("isFirst", false);
			uni.setStorageSync("userInfo", userData.data);
			uni.setStorageSync("isRefresh", false);
			this.loading = false;
			uni.switchTab({
				url: "/pages/self/index",
			});
			return
			if (userData.data) {
				if (userData.data.openid) {
					//如果是老用户 返回用户信息，并存到本地
					uni.setStorageSync("isFirst", false);
					uni.setStorageSync("userInfo", userData.data);
					uni.setStorageSync("isRefresh", false);
					this.loading = false;
					uni.switchTab({
						url: "/pages/list/index",
					});
				} else {
					this.mark = "edit";
					this.loading = false;
					this.isShowLogin = true;
				}
			} else {
				this.mark = "add";
				this.loading = false;
				this.isShowLogin = true;
			}
		},
		data() {
			return {
				title: 'Hello',
				loading:true,
				currentCode:null,
				showMark:'go',
				isShowLogin:true,
				loginType: "login",
				campuses:[]
			}
		},
		methods: {
			login(){
				if(this.currentCode){
					// do anything
					uni.getUserProfile({
						desc:"获取信息",
						lang:"zh_CN",
						success:async(res)=>{
							console.log('7878',res)
							this.showMark = null;
							this.loading = true;
							const resData = await uniRequest("txCos/saveAvatar","POST",{
								folder:"userAvatar/",
								filePath:res.userInfo.avatarUrl,
								fileName:getFileName()
							})
							const cloudPath = resData.cloudPath;
							this.userInfo = {
								nickName:res.userInfo.nickName,
								openId:this.openId,
								uniId:this.uniId,
								gender:"1",
								avatarUrl:cloudPath,
								campus:this.currentCode
							}
							this.loading = false;
							this.loginType = "getPhone";
							this.showMark = "getPhone"
						},
						fail:(error)=>{
							console.log("debug",error)
						}
					})
				}else {
					let options = {
						title: "请先选择runner社区~",
						imgUrl: addCampusBase64.toastImg,
						icon: true,
					};
					this.$refs.toast.show(options);
				}
			},
			// 个人用户无法获取用户手机号
			async getPhonenumberGo(e) {
				console.log("7878e", e)
				// if (e.detail.code) {
				this.showMark = null;
				this.loading = true
				const phone  = '17865423035'
				// let phone = (
				// 	await uniRequest("wxApi/getPhoneNumber", "POST", {
				// 		code: '17865423035',
				// 		openid: this.openid,
				// 	})
				// ).data.phone_info.phoneNumber;
				let info = {
					...this.userInfo,
					phoneNumber: phone,
					type: "1",
				};
				if (this.mark === "add") {
					await uniRequest("userInfo/add", "POST", info);
				} else {
					await uniRequest("userInfo/update", "POST", {
						searchParams: {
							unionid: this.unionid
						},
						updateParams: info,
					});
				}
				uni.setStorageSync("isFirst", true);
				uni.setStorageSync("userInfo", info);
				this.loading = false
				uni.switchTab({
					url: "/pages/self/index",
				});
				// }
			},
			selectCampus(code){
				this.currentCode =this.currentCode=== code ? null:code
			},
			go() {
				this.showMark = "login";
			},
		}
	}
</script>

<style lang="scss">

	.container {
		margin: 0;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgb(174, 202, 187);
		background-image: radial-gradient(closest-side,
				rgba(111, 221, 245, 1),
				rgba(235, 105, 78, 0)),
			radial-gradient(closest-side, rgba(183, 196, 189, 1), rgba(234, 11, 164, 0)),
			radial-gradient(closest-side,
				rgba(254, 234, 131, 1),
				rgba(254, 234, 131, 0)),
			radial-gradient(closest-side,
				rgba(183, 196, 189, 1),
				rgba(170, 142, 245, 0)),
			radial-gradient(closest-side,
				rgba(248, 192, 147, 1),
				rgba(248, 192, 147, 0));
		background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
			110vmax 110vmax, 90vmax 90vmax;
		background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
			-30vmax -10vmax, 50vmax 50vmax;
		background-repeat: no-repeat;
		animation: backmove 8s linear infinite;
	}

	.title {
		z-index: 10;
		font-size: 60rpx;
		font-weight: bold;
		color: transparent;
		text-shadow: 0 0 1rpx rgba(255, 255, 255, 0.8),
			0 4rpx 4rpx rgba(0, 0, 0, 0.05);
		letter-spacing: 20rpx;
	}

	.go {
		z-index: 10;
		margin-top: 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		animation: gobtn 3s linear infinite;
	}

	@keyframes backmove {
		0% {
			background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
				110vmax 110vmax, 90vmax 90vmax;
			background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
				-30vmax -10vmax, 50vmax 50vmax;
		}

		100% {
			background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
				110vmax 110vmax, 90vmax 90vmax;
			background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
				-30vmax -10vmax, 50vmax 50vmax;
		}

		25% {
			background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
				90vmax 90vmax, 60vmax 60vmax;
			background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax,
				-40vmax -20vmax, 40vmax 60vmax;
		}

		50% {
			background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
				60vmax 60vmax, 80vmax 80vmax;
			background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
				20vmax 10vmax, 30vmax 70vmax;
		}

		75% {
			background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
				90vmax 90vmax, 70vmax 70vmax;
			background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
				-10vmax 10vmax, 40vmax 60vmax;
		}
	}


	@keyframes gobtn {
		0%{
			opacity: 1;
			transform: scale(1);
		}

		25%{
			opacity: 0.75;
			transform: scale(0.85);
		}

		50%{
			opacity: 0.5;
			transform: scale(0.7);
		}

		75% {
			opacity: 0.75;
			transform: scale(0.85);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.loginBox {
		width: 550rpx;
		margin-top: 50rpx;
		padding: 30rpx 15rpx;
		border-radius: 30rpx;
		background: rgba($color: #8e8e8e, $alpha: 0.2);
		backdrop-filter: blur(10rpx);
		box-shadow: 14rpx 14rpx 20rpx rgba($color: #cbced1, $alpha: 0.3),
			-14rpx -14rpx 20rpx rgba($color: #ffffff, $alpha: 0.3);

		.loginContent {
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				color: #fff;
				font-weight: bold;
				letter-spacing: 10rpx;
				padding: 15rpx 30rpx;
				border-radius: 10rpx;
			}

			.title1 {
				color: #fff;
				font-weight: bold;
				letter-spacing: 8rpx;
			}

			.title2 {
				color: #fff;
				font-weight: bold;
				letter-spacing: 8rpx;
				margin: 30rpx 0;
			} 
		}
	}

	.selectBox {
		color: #fff;
		width: 100%;
		max-height: 50vh;
		border-radius: 20rpx;
		overflow: auto;
		box-shadow: inset 6rpx 6rpx 8rpx rgba($color: #cbced1, $alpha: 0.5),
			inset -6rpx -6rpx 8rpx rgba($color: #ffffff, $alpha: 0.5);
		margin: 20rpx 0;
	}

	.campus {
		height: 70rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		image {
			width: 70rpx;
			height: 70rpx;
		}
	}

	.home {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(60%, -50%) !important;
		-webkit-transform: translate(60%, -50%) !important;
  	}

  .buttonStyle {
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 48rpx;
			height: 48rpx;
			margin-right: 10rpx;
			animation: wxChatImg 3s linear infinite;
		}

		.btnText {
			font-size: 33rpx;
		}
	}
</style>
