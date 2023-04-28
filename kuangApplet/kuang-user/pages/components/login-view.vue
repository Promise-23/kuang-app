<template>
	<!-- 公用的登陆弹窗 -->
	<view class="login-view" v-if="login_user.show">
		<view class="login-button">
			<button type="primary" @click="login">登陆</button>
			<button type="default" @click="login_user.show = false">取消</button>
		</view>
	</view>
</template>

<script setup>
	import {login_user} from '../../Acc-config/answer.js'
	import {Plublic} from '../../Acc-config/public.js'
	//登陆
	async function login(){
		try{
			await new Plublic().login()
			login_user.show = false
			login_user.response = 'success'
		}catch(e){
			new Plublic().toast('登录失败,重试')
		}
		
		
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
	z-index: 999;
	animation: post-list-row .3s;
}
@keyframes post-list-row {
	0% {top:100%}
	100%{top:0}
}

.login-button{
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.login-view button{
	margin: 70rpx;
	width: 400rpx;
}
</style>