<template>
	<!-- 公用的登陆弹窗 -->
	<page-container @clickoverlay="login_user.show = false" v-if="login_user.show" :show="login_user.show" position="bottom" bindenter="onEnter">
		<view class="login-view">
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
	</page-container>
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
	
	// function getUserProfile(e) {
	//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
	//     // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
	// 	console.log('res', res)
	//     wx.getUserProfile({
	//       desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
	//       success: (res) => {
	//         con
	//       }
	//     })
	// }
	
	const userInfo = reactive({avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', nickName: ''})
	
	async function onChooseAvatar(e) {
		console.log('e', e)
		const { avatarUrl } = e.detail 
		console.log('avatarUrl',new Plublic().getImageBase64_readFile(avatarUrl))
		userInfo.avatarUrl = await new Plublic().getImageBase64_readFile(avatarUrl)
	}
	  
</script>

<style scoped>
.login-view{
	height: max-content;
	width: 100%;
	animation: post-list-row .3s;
	padding: 50rpx 10rpx;
}
@keyframes post-list-row {
	0% {top:100%}
	100%{top:0}
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