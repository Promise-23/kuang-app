<template>
	<view class="details-img">
		<view class="img-box" v-for="(item,index) in goods_details" :key="index">
			<image :src="item.image" mode="widthFix"></image>
		</view>
	</view>
</template>

<script setup>
	import {defineProps} from 'vue'
	defineProps({goods_details:Array})
</script>

<style scoped>
.details-img{
	background-color: #FFFFFF;
	margin: 20rpx 0;
	padding-bottom: 200rpx;
}
.details-img .img-box{
	display: flex;
	justify-content: center;
	align-items: center;
	width: calc(100% - 40rpx);
	height: max-content;
	margin: 0 auto;
	margin-top: 20rpx;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.img-box image{
	width: 100%;
}
</style>