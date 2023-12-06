<template>
	<view v-show="showArrowTopBtn" class="arrow-top" @click="backTop">
		<image src="/static/svg/arrow-top.svg" mode="widthFix"></image>
	</view>
</template>

<script setup>
	import {defineProps, ref} from 'vue'
	defineProps({style:Object})
	
	import { onPageScroll } from '@dcloudio/uni-app'
	const showArrowTopBtn = ref(false)
	
	onPageScroll((e) => {
		if(e.scrollTop>=200){
			showArrowTopBtn.value=true
		}else{
			showArrowTopBtn.value = false
		}
	})
	
	function backTop(){
		uni.pageScrollTo({
			scrollTop:0,   // 滚动到页面的目标位置  这个是滚动到顶部, 0 
			duration:300  // 滚动动画的时长
		})
	}
</script>

<style scoped>
.arrow-top{
	position: fixed;
	bottom: 24%;
	right: calc(20rpx + 8px);
	
}
.arrow-top image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	padding: 15rpx;
	background-color: #000;
	opacity: 0.5;
	box-shadow: 2px 1px 1px rgba(0, 0, 0, 0.2);
}
</style>