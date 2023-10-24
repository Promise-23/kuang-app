<template>
	<!-- 公用的登陆弹窗 -->
	<view class="login-view" v-if="login_user.show">
		<view class="overlay" @click="cancel"></view>
		<view class="content">
			<view class="brand">
				<view class="info">
					<brand-icon :style="{fontSize: '60rpx'}"/>
					<view class="title">
						Kuang+框架
					</view>
				</view>
				<view class="tip">
					<image src="/static/img/warning-circle.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="descs">
				<view class="desc">
					申请获取您的登陆信息（头像、昵称、手机号等）
				</view>
				<view class="tip">为了更好的用户体验/推荐使用微信信息</view>
			</view>
			<view class="avatar box">
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				  <image :src="userInfo.avatarUrl"></image>
				</button>
			</view>
			<view class="box">
				<input ref="inputRef" @change="handleNickName" class="input" type="nickname" placeholder="请输入昵称" placeholder-style="color: #999"/>
			</view>
			<view class="phone box">
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :class="userInfo.phone ? 'has-phone' : ''">{{ userInfo.phone ? userInfo.phone : '点击获取手机号'}}</button>
			</view>
			<view class="opitions">
				<button type="primary" @click="login">确定</button>
				<button type="default" @click="login_user.show = false">取消</button>
			</view>	
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import {login_user} from '../../Acc-config/answer.js'
	import {Plublic, getAccessToken, getPhoneNumberByToken} from '../../Acc-config/public.js'
	import {reactive} from 'vue'
	import BrandIcon from '../Common-component/UI/BrandIcon.vue'
	//登陆
	async function login(){
		try{
			await new Plublic().login(userInfo)
			login_user.show = false
			login_user.response = 'success'
		}catch(e){
			new Plublic().toast('登录失败,重试')
		}
	}
	
	const userInfo = reactive({avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', nickName: '', phone: ''})
	
	async function onChooseAvatar(e) {
		console.log('e', e)
		const { avatarUrl } = e.detail 
		console.log('avatarUrl',new Plublic().getImageBase64_readFile(avatarUrl))
		userInfo.avatarUrl = await new Plublic().getImageBase64_readFile(avatarUrl)
	}
	
	function handleNickName(e){
		userInfo.nickName = e.detail.value 
	}
	
	function getPhoneNumber(e){
		getAccessToken().then(({access_token}) => {
			console.log(e.detail.code, access_token)
			const code = e.detail.code
			getPhoneNumberByToken(code, access_token).then(({phone_info}) => {
				console.log('getPhoneNumber', phone_info)
				userInfo.phone = phone_info.purePhoneNumber
			})
		})
	}
	function cancel(e){
		e.stopPropagation()
		login_user.show = false
	}
</script>

<style scoped>
.login-view{
	position: fixed;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 998;
	background-color: transparent;
	animation: post-list-row .3s;
}

.overlay{
	position: absolute;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
}

.content{
	position: absolute;
	bottom: 0;
	left: 0;
	height: max-content;
	width: calc(100% - 100rpx);
	padding: 50rpx 50rpx;
	z-index: 999;
	background-color: #f3f3f3;
	border-radius: 26rpx 26rpx 0 0;
}

.brand{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.brand .info{
	display: flex;
	align-items: center;
}

.brand .tip image{
	width: 40rpx;
	height: 40rpx;
}

.title{
	margin-left: 20rpx;
	font-size: 28rpx;
}

.descs{
	font-size: 30rpx;
	margin-bottom: 30rpx;
}
.tip{
	font-size: 24rpx;
	color: #999;
}
@keyframes post-list-row {
	0% {bottom:-100%}
	100%{bottom:0}
}

.box{
	width: 100%;
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	margin-bottom: 30rpx;
	border-radius: 16rpx;
	background-color: #fff;
}


.opitions{
	padding-top: 30rpx;
	text-align: center;
}

.avatar{
	background-color: transparent
}
.avatar button{
	width: 90rpx;
	height: 90rpx;
	padding: 0;
}

.phone button{
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background-color: transparent;
	font-size: 16px;
	color: #999;
	text-align: center;
}
.phone button::after{
	width: 300rpx;
	height: 90rpx;
	padding: 0;
	border: none;
}

.phone .has-phone{
	color: #000
}

.avatar image{
	width: 90rpx;
	height: 90rpx;
}

.opitions button{
	display: inline-block;
	width: max-content;
	padding: 10rpx 50rpx;
	line-height: 1.5;
	margin: 0;
	font-size: 16px;
}

.opitions button:first-child{
	margin-right: 50rpx;
}
</style>