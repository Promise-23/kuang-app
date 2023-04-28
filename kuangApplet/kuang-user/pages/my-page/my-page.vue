<template>
	<view class="my-page">
		<view class="my-name" v-if="exist">
			<image :src="user_infor.avatarUrl" mode="aspectFit"></image>
			<text>{{user_infor.nickName}}</text>
		</view>
		<view class="my-name" v-else="!exist" @click="goLogin">
			<image src="/static/detail/weidenglu.svg" mode="aspectFit"></image>
			<text>点击登录</text>
		</view>
		<image class="shuibo-img" src="https://qita-1252107261.cos.ap-chengdu.myqcloud.com/boliang" mode="scaleToFill"></image>
	</view>
	<view class="my-order">
		<view class="my-order-title more">
			<view>我的订单</view>
			<view class="more" v-for="(item,index) in list_data.whole" :key="index" @click="viewOrder(item.index,item.query)">
				<text>{{item.name}}</text>
				<image :src="item.icon" mode="aspectFit"></image>
			</view>
		</view>
		<view class="order-state">
			<view v-for="(item,index) in list_data.list" :key="index" @click="viewOrder(item.index,item.query)">
				<image :src="item.icon" mode="aspectFit"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
	<!--  -->
	<view class="my-other">
		<view @click="myCollect">
			<image src="/static/detail/wodeshoucang.svg" mode="aspectFit"></image>
			<text>我的收藏</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
		<view @click="getInfo">
			<image src="/static/detail/shouhuodizhi.svg" mode="aspectFit" ></image>
			<text>收货地址</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
		<view>
			<image src="/static/detail/yijianfankui.svg" mode="aspectFit"></image>
			<text>意见反馈</text>
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit" class="my-other-deta"></image>
		</view>
	</view>
	<!-- 登陆弹窗 -->
	<Login />
</template>

<script setup>
	import {reactive,toRefs,watch} from 'vue'
	import {onShow} from '@dcloudio/uni-app'
	import Login from '../components/login-view.vue'
	
	const list_data = reactive({
		whole:[
			{
				index:0,
				name:'查看全部订单',
				icon:'/static/detail/xiangyou-jiantou.svg',
				query:{}
			}
		],
		list:[
			{
				index:1,
				name:'待付款',
				icon:'/static/detail/daifukuan.svg',
				query:{pay_success:'not_pay'}
			},
			{
				index:2,
				name:'待发货',
				icon:'/static/detail/daifahuo.svg',
				query:{pay_success:'success',deliver:'stay'}
			},
			{
				index:3,
				name:'待收货',
				icon:'/static/detail/daishouhuo.svg',
				query:{pay_success:'success',deliver:'already'}
			},
			{
				index:4,
				name:'待评价',
				icon:'/static/detail/daipingjia.svg',
				query:{pay_success:'success',deliver:'rece_goods',evaluate:false}
			}
		]
	})
	
	// 查询是否登陆
	onShow(()=>{
		staTus()
	})
	const user = reactive({user_infor:{},exist:false})
	const {user_infor,exist} = toRefs(user)
	function staTus(){
		const user_data = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(user_data){
			user.exist = true
			user.user_infor = user_data
		}else{
			user.exist = false
		}
	}
	import {login_user} from '@/Acc-config/answer.js'
	// 调用登陆弹窗
	function goLogin(){
		login_user.show = true
	}
	
	// 监听登陆是否成功，成功则重新取收藏和购物车的数据
	watch(()=>login_user.response,(newVal,oldVal)=>{
		staTus()
	})
	
	// 查看订单
	function viewOrder(index,query){
		if(user.exist){
			let obj = JSON.stringify({index,query})
			wx.navigateTo({
				url:`/pages/All-orders/order?obj=${obj}`
			})
		}else{
			login_user.show = true
		}
	}
	
	// 查看收货地址
	function getInfo(){
		if(user.exist){
			wx.navigateTo({
				url:'/pages/Re-address/address'
			})
		}else{
			login_user.show = true
		}
	}
	
	// 我的收藏
	function myCollect(){
		if(user.exist){
			wx.navigateTo({
				url:'/pages/My-collection/collection'
			})
		}else{
			login_user.show = true
		}
	}
	
</script>

<style scoped>
.my-page{
	height: 300rpx;
	/* background: #4CD964; */
	background: linear-gradient(to bottom, #e94b37 25%, #e59f95 100%);
	position: relative;
	padding-top: 100rpx;
}
.my-name image{
	display: block;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
}
.my-name{
	color: #FFFFFF;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 230rpx;
	font-size: 33rpx;
	z-index: 9;
	position: absolute;
	left: 0;
	right: 0;
}
.shuibo-img{
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 170rpx;
	/* z-index: 99; */
	mix-blend-mode: screen;
}
/* 我的订单 */
.my-order{
	margin-top: 20rpx;
	padding: 0 20rpx;
}
.my-order-title image{
	width: 30rpx;
	height: 30rpx;
	display: block;
	margin-left: 10rpx;
}
.my-order-title{
	display: flex;
	justify-content: space-between;
}
.my-order-title view:nth-child(1){
	font-weight: bold;
}
.my-order-title view:nth-child(2){
	font-size: 25rpx;
	color: #cfcfcf;
}
.more{
	display: flex;
	align-items: center;
}
.order-state image{
	display: block;
	width: 50rpx;
	height: 50rpx;
	margin-bottom: 10rpx;
}
.order-state{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 30rpx;
}
.order-state view{
	display: flex;
	align-items: center;
	flex-direction: column;
	color: #4f4f4f;
}
/* 其他功能 */
.my-other{
	background-color: #FFFFFF;
	margin: 50rpx 20rpx 20rpx 20rpx;
	box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	border-radius: 6rpx;
	padding: 0 10rpx;
	color: #828282;
}
.my-other image{
	display: block;
	width: 35rpx;
	height: 35rpx;
	margin-right: 20rpx;
}
.my-other view{
	display: flex;
	align-items: center;
	padding: 30rpx 0;
}
.my-other view:nth-child(2){
	border-bottom: 1rpx solid #e0e0e0;
	border-top: 1rpx solid #e0e0e0;
}
.my-other text{
	flex: 1;
}
.my-other-deta{
	width: 30rpx !important;
	height: 30rpx !important;
	margin: 0 !important;
}
</style>