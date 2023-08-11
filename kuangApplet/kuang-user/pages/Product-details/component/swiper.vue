<template>
	<!-- 轮播 -->
	<view class="swiper-view">
		<swiper :duration="1000" :circular="true" @change="changeCurrent">
			<block v-for="(item,index) in goods.goods_banner" :key="index">
				<swiper-item>
					<view class="swiper-item">
						<image class="imageurl" :src="item.image" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<!-- 自定义指示点 -->
		<view class="point">{{current}}/{{ban_length}}</view>
	</view>
	<!-- 秒杀 -->
	<view class="seckill" v-if="seckill_display">
		<view class="seckill-top seckill-flex">
			<text>秒杀中</text>
			<text class="seckill-Center">已售 {{goods.sold}}</text>
			<text>距离结束还有:</text>
		</view>
		<view class="seckill-flex">
			<text class="price-spike">¥{{seckill[0].price_spike}}</text>
			<text class="seckill-Center ori-price">¥{{seckill[0].ori_price}}</text>
			<view class="se-time">
				<text v-if="day != '00'">{{day}}</text>
				<text v-if="day != '00'">天</text>
				<text>{{hour}}</text>
				<text>:</text>
				<text>{{minute}}</text>
				<text>:</text>
				<text>{{second}}</text>
			</view>
		</view>
	</view>
	<!-- 普通价格 -->
	<view class="price-view" v-else>
		<view>¥{{goods.goods_price}}</view>
		<view>已售 {{goods.sold}}</view>
	</view>
	<!-- 标题 -->
	<view class="detail-title">{{goods.goods_title}}</view>
</template>

<script setup>
	import {defineProps,watch,ref,reactive,toRefs,onBeforeUnmount} from 'vue'
	const props = defineProps({goods:Object,seckill:Array})
	import {ORDER} from '../../../Acc-config/place-order.js'
	
	// 轮播图片数量
	const ban_length = ref(0)
	const current = ref(1)
	function changeCurrent(e){
		current.value = e.detail.current + 1
	}
	
	const seckill_display = ref(false)
	// 获取接收父组件传来的值
	watch(props,(newVla_a,oldVal)=>{
		const newVla = JSON.parse(JSON.stringify(newVla_a))//深拷贝
		// console.log('newVla.goods.goods_banner', newVla)
		ban_length.value = newVla?.goods?.goods_banner?.length ?? 0
		if(newVla.seckill.length === 0){
			// 没有秒杀
			seckill_display.value = false
			ORDER.order.goods_price = newVla.goods.goods_price
			ORDER.exist = false
		}else{
			// 有秒杀，判断是否开始
			// 判断服务器返回的开始时间是否大于当前时间，如果大于：秒杀还没开始
				// 服务器返回的开始时间
			let start_Time = newVla.seckill[0].seckill_time.start_Time
				// 服务器返回的结束时间
			let end_Time = newVla.seckill[0].seckill_time.end_Time
			if(start_Time > currentTime()){
				console.log('有秒杀未开始')
				seckill_display.value = false
				ORDER.order.goods_price = newVla.goods.goods_price
				ORDER.exist = false
			}else{
				console.log('有秒杀已开始')
				counTdown(newVla.seckill[0],end_Time)
			}
		}
	})
	
	// 当前时间的时间戳
	function currentTime(){//new Date().getTime():毫秒；Math.round：四舍五入
		return Math.round(new Date().getTime()/1000)
	}

	// 计算倒计时
	const result = reactive({day:'00',hour:'00',minute:'00',second:'00'})
	const {day,hour,minute,second} = toRefs(result)
	function counTdown(seckill_pri,end_Time){
		let timer = setInterval(()=>{
			let sur = end_Time - currentTime()//剩余的毫秒数
			let DD = parseInt(sur / 60 / 60 / 24, 10)//剩余的天数
			let HH = parseInt(sur / 60 / 60 % 24, 10)//剩余的小时
			let MM = parseInt(sur / 60 % 60, 10)//剩余的分钟数
			let SS = parseInt(sur % 60, 10)//剩余的秒数
			DD = checkTime(DD)
			HH = checkTime(HH)
			MM = checkTime(MM)
			SS = checkTime(SS)
			if(sur > 0){
				seckill_display.value = true
				ORDER.order.goods_price = seckill_pri.price_spike
				ORDER.exist = true
				result.day = DD
				result.hour = HH
				result.minute = MM
				result.second = SS
			}else{
				// 秒杀结束
				console.log('秒杀结束')
				seckill_display.value = false
				ORDER.order.goods_price = seckill_pri.ori_price
				ORDER.exist = false
				// 销毁定时器
				clearInterval(timer)
			}
		},1000)
		clear_time.value = timer
		function checkTime(i){
			if(i < 10){
				i = '0' + i
			}
			return i
		}
	}
	
	// 销毁：返回上一页面停止定时器
	let clear_time = ref('')
	onBeforeUnmount(()=>{
		clearInterval(clear_time.value)
	})
	
	
	
	
</script>

<style scoped>
.imageurl {
	width: 100%;
	height: 700rpx !important;
}

.swiper-view {
	height: 700rpx !important;
	position: relative;
}
swiper{
	height: 700rpx !important;
}
.point{
	position: absolute;
	bottom: 10rpx;
	right: 20rpx;
	background-color: #333333;
	opacity: 0.5;
	color: #FFFFFF;
	font-size: 25rpx;
	width: 100rpx;
	height: 50rpx;
	border-radius: 50rpx;
	line-height: 50rpx;
	text-align: center;
}
/* 价格 */
.price-view{
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	height: 100rpx;
}
.price-view view:nth-child(1){
	color: #e9445a;
	font-size: 40rpx;
	font-weight: bold;
}
.price-view view:nth-child(2){
	color: #b1b2b5;
}
/* 秒杀 */
.seckill{
	background-color: #e74e64;
	padding: 10rpx 20rpx;
	color: #ffffff;
}
.seckill-flex{
	display: flex;
	align-items: center;
}
.seckill-Center{
	flex: 1;
	padding: 0 20rpx;
}
.seckill-top{
	padding-bottom: 10rpx;
	font-size: 25rpx;
}
.seckill-top text:nth-child(1){
	background-color: #f6d3db;
	padding: 5rpx 15rpx;
	color: #ea4163;
	border-radius: 5rpx;
}
.price-spike{
	font-size: 35rpx;
	font-weight: bold;
}
.ori-price{
	text-decoration: line-through;
	color: #f1b0be;
}
.se-time{
	display: flex;
	align-items: center;
}
.se-time text{
	margin-left: 10rpx;
}
.se-time text:nth-child(odd){
	background-color: #eb6578;
	padding: 2rpx 10rpx;
	border-radius: 10rpx;
}
/* 标题 */
.detail-title{
	padding: 20rpx;
	line-height: 1.5;
	background-color: #FFFFFF;
	margin: 20rpx 0;
}
</style>