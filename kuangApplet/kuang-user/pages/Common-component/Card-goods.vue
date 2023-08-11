<template>
	<!-- 公用的商品列表组件 -->
	<view class="card-view">
		<view class="Card-stream" v-for="(item,index) in card" :key="index" @click="juMp(item._id,item.video_url)">
			<view class="Card-image">
				<image :src="item.goods_cover" mode="aspectFill"></image>
			</view>
<!-- 			<view class="brand-icon">
				<image src="../../static/brand.png" mode="aspectFill"></image>
			</view> -->
			<brand-icon :style="{fontSize: '60rpx', position: 'absolute',top: '20rpx', right: '20rpx'}"/>
			<view class="Card-title overflow">{{item.goods_title}}</view>
			<view class="Card-price">
				<text>¥ {{item.goods_price}}</text>
				<text>已售{{item.sold}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import BrandIcon from './UI/BrandIcon'
	import Card from '../Common-component/Card-goods.vue'
	
	import {defineProps} from 'vue'
	defineProps({card:Array})
	
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
.card-view{
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 10rpx;
}
.Card-stream{
	position: relative;
	width: calc(50% - 10rpx*2);
	margin: 10rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
}
.Card-image{
	height: 400rpx;
/* 	padding: 20px 10px 10px 10px;
	background-color: #80d1c8; */
}
.Card-stream image{
	width: 100%; 
	height: 400rpx;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}
.brand-icon{
	position: absolute;
	top: 20rpx;
	height: 60rpx;
	width: 60rpx;
	right: 20rpx;
	background-color: #fff;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
}

.brand-icon image{
	width: 100%;
	height: 100%;
}
.Card-title{
	font-size: 28rpx;
	height: 80rpx;
	line-height: 40rpx;
	margin: 10rpx 15rpx;
}
.Card-price{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15rpx 15rpx 15rpx;
}
.Card-price text:nth-child(1){
	color: #d0000f;
	font-weight: bold;
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.Card-price text:nth-child(2){
	color: #b0b1b4;
	font-size: 25rpx;
}
</style>