<template>
	<view class="card">
		<view class="integral">
			<view class="label">
				<image src="/static/img/coupon.png" mode="aspectFit"></image>
				<text>优惠券</text>
			</view>
			<view>
				<text class="num">{{ myCoupons.data.length || 0}}</text>
				<text>张可用</text>
			</view>
		</view>
		<view class="desc">
			<text>优惠券暂时仅可用于线上使用\n☆☆☆  线下门店暂不通用！！！  ☆☆☆</text>
		</view>
	</view>
	<view class="details">
		<view class="title">
			<text>优惠券明细</text>
		</view>
		<view class="boxs" v-show="myCoupons.data.length > 0">
			<Coupon class="box" v-for="(item, index) in myCoupons.data" :key="index" :coupon="item" />
		</view>
		<!-- 没有数据的提示 -->
		<view class="Tips" v-show="myCoupons.data.length == 0">暂无优惠券数据</view>
	</view>
</template>

<script setup>
	import {onMounted,reactive,toRefs} from 'vue'
	import {Plublic} from '@/Acc-config/public.js'
	import Coupon from '../Common-component/UI/Coupon.vue'
	import { myCoupons } from '../../Acc-config/answer.js'
	const db = wx.cloud.database()
	
	const data = reactive({user_infor: wx.getStorageSync('user_infor') || {}})
	const {user_infor} = toRefs(data)
</script>

<style scoped>
.card{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height:300rpx;
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

.card .integral .label{
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
	margin-right: 20rpx;
}

.card .desc{
	font-size: 12px;
	white-space: pre-line;
	letter-spacing: 1px;
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