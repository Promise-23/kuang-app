<template>
	<view class="Rotation-view">
		<view class="swiper-top">
			<view>
				<swiper class="swiper" :autoplay='true' :circular="true" interval="3000" duration="1000" @change="swiperFun">
					<block v-for="(item,index) in banner" :key="index">
						<swiper-item class="swiper-item" @click="juMp(item.goods_id,item.video_url)">
							<image :src="item.banner_cover" mode="aspectFill"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 自定义的指示点 -->
			<view class="instruct-view">
				<block v-for="(item,index) in banner" :key="index">
					<view class="instruct" :class="{active:index == num}"></view>
				</block>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineProps,ref} from 'vue'
	defineProps({banner:Array})
	
	// 滑块滑动时触发
	const num = ref(0)
	function swiperFun(e){
		num.value = e.detail.current
	}
	
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
/* 轮播区域 */
.Rotation-view {
	height: 720rpx;
	/* background: linear-gradient(to bottom, #4CD964 25%, #c0f2c8 100%); */
	background: linear-gradient(to bottom, #a0c179 25%, #fff 100%);
	padding: 20rpx 20rpx 0 20rpx;
}

.swiper-top {
	height: 700rpx;
	position: relative;
}

.swiper {
	height: 700rpx !important;
	border-radius: 20rpx;
	overflow: hidden;
	transform: translateY(0);
}
.swiper-item {
	margin-right: 20rpx;
}
.swiper-item image {
	width: 100%;
	height: 700rpx !important;
	object-position: top;
}

/* 指示点 */
.instruct-view {
	display: flex;
	justify-content: center;
	position: absolute;
	bottom: 10rpx;
	left: 0;
	width: 100%;
}

.instruct {
	background: #a0c179;
	height: 5rpx;
	width: 30rpx;
	border-radius: 50rpx;
	margin: 0 10rpx;
}

.active {
	background: #FFFFFF !important;
}
</style>