<template>
	<!-- 公用的优惠券弹窗 -->
	<view class="login-view" v-if="show">
		<view class="overlay" @click="cancel"></view>
		<view class="content">
			<view class="title">
				<view class="left">
					<text>优惠券</text>
					<view class="go-center" @click="goCenter">
						<text>领券</text>
						<image src="/static/svg/right-btn-fill.svg" mode="aspectFit"></image>
					</view>
				</view>
				<image src="/static/detail/guanbi.svg" mode="aspectFit" @click="cancel"></image>
			</view>
			<view class="tabs">
				<view class="tab-view" v-for="(item,index) in tab_name" :key="index"
				@click="swItch(index)"
				>
					<text>{{item}}</text>
					<text :class="{active : index == trigger}"></text>
				</view>
			</view>
			<view v-show="trigger==0" class="coupons">
				<view v-for="(item, index) in enableCoupons" :key="index" @click="handleSelect(item)">
					<Coupon :coupon="item" :selected="selectCoupon?._id == item?._id"/>
				</view>
				<!-- 没有数据的提示 -->
				<view class="Tips" v-show="enableCoupons.length == 0">暂无优惠券数据</view>
			</view>
			<view v-show="trigger==1" class="coupons">
				<Coupon v-for="(item, index) in disableCoupons" :key="index" :coupon="item"/>
				<!-- 没有数据的提示 -->
				<view class="Tips" v-show="disableCoupons.length == 0">暂无优惠券数据</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, toRefs } from 'vue'
	import Coupon from '../../pages/Common-component/UI/Coupon.vue'
	
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		},
		enableCoupons: {
			type: Array
		},
		disableCoupons: {
			type: Array
		},
		getAble: {
			type: Boolean,
			default: true
		}
	})
	
	const emits = defineEmits(['close', 'setSelectedCoupon'])
	
	function cancel(){
		emits('close')
	}
	
	const data = reactive({
		tab_name: ['可用优惠券','不可用优惠券'],
		trigger:0
	})
	const { tab_name, trigger } = toRefs(data)
	
	function swItch(index){
		data.trigger = index
	}
	
	function goCenter(){
		wx.navigateTo({
			url:'/pages/welfare/center'
		})
	}
	
	const selectCoupon = ref()
	function handleSelect(coupon){
		console.log('selectCoupon?._id == coupon._id', selectCoupon?._id == coupon._id)
		if(selectCoupon?.value?._id == coupon._id){
			selectCoupon.value = null
		}else{
			selectCoupon.value = coupon
		}
		emits('setSelectedCoupon', selectCoupon.value)
		cancel()
	}
</script>

<style scoped>
.login-view{
	position: fixed;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: #FFFFFF;
	z-index: 998;
	background-color: transparent;
	animation: post-list-row .3s;
}

.overlay{
	position: absolute;
	top:0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
}

.content{
	position: absolute;
	bottom: 0;
	left: 0;
	height: max-content;
	width: calc(100% - 100rpx);
	padding: 50rpx 50rpx;
	z-index: 999;
	background-color: #f3f3f3;
	border-radius: 26rpx 26rpx 0 0;
}

.content .title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 44rpx;
	font-weight: 600px;
}

.content .title > image{
	width: 20rpx;
	height: 20rpx;
	background-color: #dbdbdb;
	padding: 10rpx;
	border-radius: 50%;
}

.tabs{
	margin-top: 30rpx;
	padding: 20rpx 60rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
}

.content .title .left{
	display: flex;
	align-items: center;
}

.go-center{
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	background-color: #FF5500;
	padding: 6rpx 8rpx 6rpx 10rpx;
	border-radius: 15rpx;
	color: #FFFFFF;
	margin-left: 20rpx;
}

.go-center image{
	padding: 0 !important;
	height: 30rpx !important;
	width: 30rpx !important;
	margin-left: 6rpx;
}


@keyframes post-list-row {
	0% {bottom:-100%}
	100%{bottom:0}
}

.tab-view{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	width: max-content;
}
.tab-view text:nth-child(2){
	width: calc(100% - 20rpx);
	height: 8rpx;
	border-radius: 10rpx;
	position: absolute;
	bottom: -20rpx;
}
.tab-view .active{
	background-color: rgba(255, 85,0, 1);
}

.coupons{
	height: 60vh;
	margin-top: 20rpx;
	padding: 20rpx 0;
	border-top: 1px solid #e6e6e6;
}

.coupon{
	box-sizing: border-box;
	display: flex;
	align-items: center;
	height: 230rpx;
	width: 100%;
	padding: 20rpx 50rpx;
	background: url('../../static/img/bg_coupon.png') no-repeat;
	background-size: 100% 100%;
}
.coupon .head{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30%;
	height: 100%;
	border-right: 2px dotted #e6e6e6;
	/* background-image: linear-gradient(to bottom right, #000 0%, #575757 90%, #575757 100%); */
}
.head .price{
	font-size: 60rpx;
	font-weight: 600;
}
.coupon .coupon-info{
	width: 70%;
	padding-left: 30rpx;
}
.coupon-info .type{
	width: max-content;
	background-color: #FF5500;
	font-size: 10px;
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
	color: #FFFFFF;
	text-align: center;
	font-weight: 600;
}
.coupon-info > view{
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	
}

.coupon-info .desc{
	font-size: 14px;
}

.coupon-info .time{
	font-size: 10px;
	margin: 6rpx 0;
}

.coupon-info .remark{
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px dotted #e6e6e6;
	padding-top: 6rpx;
	margin-top: 6rpx;
	font-size: 10px;
}

.coupon-info .remark .get{
	background-color: #FF5500;
	font-size: 10px;
	padding: 6rpx 20rpx;
	border-radius: 20rpx;
	color: #FFFFFF;
	text-align: center;
	font-weight: 600;
}
</style>