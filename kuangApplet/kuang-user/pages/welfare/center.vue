<template>
	<view class="box promotion">
		<view class="title">
			<text>积分活动</text>
		</view>
		<view class="content">
			<!-- <text class="tag">返K币</text>
			<text class="desc">购物返K币，订单完成后最高返99K币</text> -->
			<text class="tag">返积分</text>
			<text class="desc">购物返积分，实付金额满10返1</text>
		</view>
	</view>
	<!-- 公用的优惠券弹窗 -->
	<view class="box coupon-box">
		<view class="title">
			<text>可领取优惠券</text>
		</view>
		<view class="coupons">
			<Coupon class="coupon" v-for="(item, index) in coupons" :key="index" :coupon="item" getAble @refrshData="getAlreadyCouponId"/>
			<!-- 没有数据的提示 -->
			<view class="Tips" v-show="coupons.length == 0">暂无可领取优惠券</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, toRefs, onMounted } from 'vue'
	import Coupon from '../../pages/Common-component/UI/Coupon.vue'
	import moment from 'moment'
	moment.locale('zh-cn');
	const db = wx.cloud.database()
	
	const data = reactive({coupons: []})
	const { coupons } = toRefs(data)
	// 获取可领取优惠券
	async function getCoupons(){
		const res = await db.collection('coupon_center').get()
		const rightTimeList = res?.data?.filter((item) => !myCoupons.hasCouponId.includes(item._id) && (transferTime(item.time[0]) <= currentTime()) && (transferTime(item.time[1]) >= currentTime()))
		console.log('rightTimeList', rightTimeList)
		data.coupons = rightTimeList.filter(item => !item.getNum || item.getNum <= item.num)
	}
	
	onMounted(() => {
		getAlreadyCouponId()
	})
	
	import { myCoupons } from '../../Acc-config/answer.js'
	
	const { hasCouponId } = toRefs(myCoupons)
	// 获取当前已获得的优惠券id集合
	async function getAlreadyCouponId(){
		const mc = await db.collection('coupon_detail').get()
		console.log('myCoupons', mc)
		myCoupons.hasCouponId = mc?.data?.map(item => item.couponId)
		getCoupons()
	}
	
	// 当前时间的时间戳
	function currentTime(){//new Date().getTime():毫秒；Math.round：四舍五入
		const date = moment().format('YYYY-MM-DD');
		return transferTime(date)
	}
	
	// 转换时间戳
	function transferTime(time){//new Date().getTime():毫秒；Math.round：四舍五入
		return Math.round(moment(time, 'YYYY-MM-DD').valueOf() /1000 );
	}
	
</script>

<style scoped>
.box{
	padding: 30rpx;
}
.box .title{
	font-size: 14px;
	color: #bfbfbf;
	margin-bottom: 30rpx;
}

.box .content{
	display: flex;
	align-items: center;
}

.content .tag{
	padding: 3rpx 10rpx;
	background-color: pink;
	color: #FF5500;
	font-size: 10px;
	border-radius: 14rpx;
	margin-right: 20rpx;
}

.content .desc{
	font-size: 12px;
}
</style>