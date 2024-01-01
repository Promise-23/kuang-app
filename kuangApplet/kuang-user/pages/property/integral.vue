<template>
	<view class="card">
		<view class="integral">
			<view class="label">
				<view class="left">
					<image src="/static/img/integral.png" mode="aspectFit"></image>
					<text>积分余额</text>
				</view>
				<!-- <view class="right btn">
					<text>赚积分</text>
				</view> -->
			</view>
			<view class="num">
				<text>{{ count || 0}}</text>
			</view>
		</view>
		<view class="desc">
			<view class="text">
				<text>购物、邀请注册获取积分</text>
				<text>更多积分活动持续推送中...</text>
			</view>
			<view class="bill" @click="goGiftsCenter">
				<text>花积分</text>
			</view>
		</view>
	</view>
	<view class="details">
		<view class="title">
			<text>积分明细</text>
		</view>
		<view class="boxs" v-show="data.length > 0">
			<view class="box" v-for="(item,index) in data" :key="index">
				<view class="integral">
					<text class="desc">{{item.desc}}</text>
					<text class="time">{{item.time}}</text>
				</view>
				<view class="result">
					<text>{{item.type=='add' ? '+' : '-'}}</text>
					<text>{{item.num}}</text>
				</view>
			</view>
		</view>
		<!-- 没有数据的提示 -->
		<view class="Tips" v-show="data.length == 0">暂无积分数据</view>
	</view>
</template>

<script setup>
	import {toRefs} from 'vue'
	// import {Plublic} from '@/Acc-config/public.js'
	import { myIntegral } from '../../Acc-config/answer.js'
	// const db = wx.cloud.database()
	const {data,count} = toRefs(myIntegral)
	
	// 请求数据
	// onMounted(()=>{getIntegral()})
	// const data = reactive({user_infor: wx.getStorageSync('user_infor') || {},integral_detail:[]})
	// const {user_infor,integral_detail} = toRefs(data)
	// async function getIntegral(){
	// 	const res = await db.collection('integral_detail').get()
	// 	console.log('integralDetail', res.data)
	// 	data.integral_detail = res.data
	// }
	
	// 领券中心
	function goGiftsCenter(){
		wx.navigateTo({
			url:'/pages/gifts/center'
		})
	}
</script>

<style scoped>
.card{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height:260rpx;
	width: calc(100% - 140rpx);
	padding: 40rpx;
	margin: 0 auto;
	margin-top: 20rpx;
	background-image: linear-gradient(to bottom right, #000 0%, #575757 90%, #575757 100%);
	/* border: 1px solid rgba(0,0,0,0.1); */
	position: relative;
	border-radius: 16rpx;
	box-shadow: 6px 6px 5px rgba(0,0,0,0.2);
}

.card text{
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;  
}

.card .integral .label {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.btn{
	display: flex;
	align-items: center;
}

.label .left{
	display: flex;
	align-items: center;
}

.card .integral image{
	width: 50rpx;
	height: 50rpx;
	margin-right: 16rpx;
}

.card .integral .num{
	font-size: 40px;
	font-weight: 600;
}

.card .desc{
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	white-space: pre-line;
	letter-spacing: 1px;
}

.card .desc .text{
	display: flex;
	flex-direction: column;
}

.card .desc .bill{
	padding: 8rpx 16rpx;
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	border-radius: 30rpx;
	font-size: 10px;
}
.bill text{
	color: #fff !important;
	-webkit-text-fill-color: unset !important
}

.details{
	width: calc(100% - 60rpx);
	margin: 0 auto;
	margin-top: 40rpx;
}
.details .title{
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 30rpx;
}
.details .boxs{
	height: calc(100vh - 600rpx);
	padding-bottom: 40rpx;
	overflow-y: auto;
}
.details .box{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.details .box .integral{
	display: flex;
	flex-direction: column;
}
.details .box .desc{
	font-size: 14px;
	margin-bottom: 2px;
}
.details .box .time{
	font-size: 10px;
	color: #575757;
}
.details .box .result{
	font-size: 14px;
}
</style>