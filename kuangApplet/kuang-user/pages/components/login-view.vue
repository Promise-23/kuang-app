<template>
	<!-- 公用的登陆弹窗 -->
	<view class="login-view" v-if="login_user.show">
		<view class="overlay" @click="cancel"></view>
		<view class="content">
			<view class="avatar">
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				  <image :src="userInfo.avatarUrl"></image>
				</button>
			</view>
			<input ref="inputRef" v-model="userInfo.nickName" class="input" type="nickname" placeholder="请输入昵称"/>
			<view class="opitions">
				<button type="primary" @click="login">确定</button>
				<button type="default" @click="login_user.show = false">取消</button>
			</view>	
		</view>
	</view>
</template>

<script setup>
	import {login_user} from '../../Acc-config/answer.js'
	import {Plublic} from '../../Acc-config/public.js'
	import {reactive} from 'vue'
	
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
	
	const userInfo = reactive({avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', nickName: ''})
	
	async function onChooseAvatar(e) {
		console.log('e', e)
		const { avatarUrl } = e.detail 
		console.log('avatarUrl',new Plublic().getImageBase64_readFile(avatarUrl))
		userInfo.avatarUrl = await new Plublic().getImageBase64_readFile(avatarUrl)
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
	width: 100%;
	padding: 50rpx 10rpx;
	z-index: 999;
	background-color: #FFFFFF;
}
@keyframes post-list-row {
	0% {bottom:-100%}
	100%{bottom:0}
}

.avatar,
.input,
.opitions{
	padding: 20rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.avatar button{
	width: 100rpx;
	height: 100rpx;
	padding: 0;
}

.avatar image{
	width: 100rpx;
	height: 100rpx;
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
	margin-right: 20rpx;
}
</style>