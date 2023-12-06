<template>
	<view class="flash-view" v-show="seckill.length > 0">
		<view class="count-down">限时优惠</view>
		<view class="flex-view">
			<view class="commodity" v-for="(item,index) in seckill" :key="index" @click="juMp(item.goods_id,item.video_url)">
				<image :src="item.cover" mode="aspectFill"></image>
				<view>
					<text class="overflow">{{item.title}}</text>
					<text class="money">¥ {{item.price_spike}}</text>
					<text class="money overflow">¥ {{item.ori_price}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineProps} from 'vue'
	
	defineProps({seckill:Array})
	
	
	
	// 跳转详情页
	function juMp(goods_id,video_url){
		if(video_url == ''){
			console.log('跳转详情页')
			wx.navigateTo({
				url:`/pages/Product-details/details?goods_id=${goods_id}`
			})
		}else{
			wx.navigateTo({
				url:`/pages/Short-video/video?goods_id=${goods_id}`
			})
		}
	}
	
</script>

<style scoped>
.flash-view{
	background: linear-gradient(to bottom, rgba(215, 0, 15, 0.5) 25%, #fff 70%);
	border-radius: 20rpx;
	padding: 20rpx 0;
	margin: 30rpx 20rpx 0 20rpx;
}
.count-down{
	color: #FFFFFF;
	padding-bottom: 15rpx;
	padding-left: 20rpx;
	font-style: oblique;
	font-weight: bold;
}
/* 宫格布局 */
.flex-view{
	display: flex;
	flex-wrap: wrap;
	margin: 0 20rpx;
}
.commodity{
	width: calc(25% - 10rpx*2);
	margin: 10rpx;
}
.commodity image{
	width: 100%;
	height: 150rpx;
	border-radius: 20rpx;
}
.commodity view{
	width: 90%;
}
.commodity view text:nth-child(1){
	margin: 10rpx 0;
}
.commodity view text:nth-child(2){
	color: #999999;
	font-weight: bold;
}
.commodity view text:nth-child(3){
	text-decoration: line-through;
	font-size: 25rpx;
	color: #bfbfbf;
	padding-left: 10rpx;
}
.overflow{
	-webkit-line-clamp: 1 !important;
}
.money{
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>