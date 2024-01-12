<template>
	<!-- 收货地址 -->
	<view class="pay-address card" v-for="(item,index) in address" :key="index" @click="choIce">
		<view class="pay-address-left">
			<image src="/static/detail/dingdan-dizhi.svg" mode="aspectFit"></image>
		</view>
		<view class="pay-address-name">
			<view>
				<text>{{item.name}}</text>
				<text>{{item.mobile}}</text>
			</view>
			<text>{{item.district + item.address}}</text>
		</view>
		<view class="pay-address-right">
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
		</view>
	</view>
	<view class="pay-address card" v-if="address.length == 0" @click="choIce">
		<view class="pay-address-left">
			<image src="/static/detail/dingdan-dizhi.svg" mode="aspectFit"></image>
		</view>
		<view class="pay-address-name placeholder-tip">请选择收货地址</view>
		<view class="pay-address-right">
			<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
		</view>
	</view>
	<!-- 商品详情 -->
	<view class="pay-goods card" v-for="(item,index) in order" :key="index">
		<view>
			<image :src="item.goods_image" mode="aspectFill"></image>
		</view>
		<view>
			<text class="pay-goods-title">{{item.goods_title}}</text>
			<text class="pay-goods-specs" v-if="item.specs.length > 0" v-for="(item_a,index_a) in item.specs" :key="index_a">{{item_a.att_val}}</text>
			<view class="pay-goods-price">
				<text>{{orderType == 'gift' ? `${item.goods_price}积分` : `¥${item.goods_price}`}}</text>
				<text v-if="type != 'direct'">x{{item.buy_amount}}</text>
				<view v-else>
					<image src="/static/detail/jianshao.png" mode="aspectFit" @click="reDuce" :class="[item.buy_amount == 1 ? 'prevent_style' : '']"></image>
					<text>{{item.buy_amount}}</text>
					<image src="/static/detail/tianjia.png" mode="aspectFit" @click="plUs"></image>
				</view>
			</view>
		</view>
	</view>
	<!-- 优惠券、K币 可用于抵扣金额-->
	<view class="card propertys">
		<view v-if="orderType == 'gift'" class="line">
			<text>剩余积分</text>
			<view class="right">
				<text>{{ myIntegral.count || 0}}</text>
			</view>
		</view>
		<view v-else class="line">
			<text>优惠券</text>
			<view class="right" @click="showCoupon">
				<view v-show='!selectedCoupon && couponsInfo.enable.length > 0'>
					<text class="hascount" >{{ couponsInfo.enable.length }}</text>
					<text>张可用</text>
				</view>
				<text v-show='!selectedCoupon && couponsInfo.enable.length == 0'>无可用</text>
				<view v-show='selectedCoupon'>
					<text>享店铺优惠</text>
					<text class="hascount" >{{`-￥${selectedCoupon?.price ?? 0}`}}</text>
				</view>
				<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
			</view>
		</view>
		<!-- <view class="line">
			<text>K币</text>
			<view class="right">
				<text>无可用</text>
				<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
			</view>
		</view> -->
	</view>
	<!-- 支付按钮 -->
	<view style="300rpx"></view>
	<view class="set-accounts">
		<view>{{ orderType == 'gift' ? `${total_price}积分` : `¥${total_price}` }}</view>
		<view @click="subMit" class="common-button">提交订单</view>
	</view>
	<coupon-view :show="showCouponModal" :enableCoupons="couponsInfo.enable" :disableCoupons="couponsInfo.disable" @close="cancelCoupon" @setSelectedCoupon="setSelectedCoupon"/>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import {onMounted,reactive,toRefs,watch,onBeforeUnmount} from 'vue'
	import couponView from '../components/coupon-view.vue'
	import moment from 'moment'
	import { myIntegral } from '../../Acc-config/answer.js'
	moment.locale('zh-cn');
	const db = wx.cloud.database()
	
	
	const re_data = reactive({address:[]})
	const {address} = toRefs(re_data)
	onMounted(async()=>{
		const res = await db.collection('re_address').where({tacitly:true}).get()
		re_data.address = res.data
		// 获取优惠券信息
		getCoupons()
	})
	
	// 跳转收货地址
	import {new_address} from '../../Acc-config/answer.js'
	function choIce(){
		wx.navigateTo({
			url:'/pages/Re-address/address'
		})
	}
	watch(new_address,(newVal,oldVal)=>{
		re_data.address = [newVal.data]
	})
	
	// 接收上个页面传来的值
	import {onLoad} from '@dcloudio/uni-app'
	const or_data = reactive({order:[],type:'',total_price:0, orderType: ''})
	const {order,type,total_price, orderType} = toRefs(or_data)
	onLoad((event)=>{
		const data = JSON.parse(event.order)
		// console.log(data)
		or_data.order = data
		or_data.type = event.type
		or_data.orderType = event.orderType
		calcPrice()
	})
	
	// 计算待支付的价格
	function calcPrice(){
		// 计算待支付的价格
		let sum = 0
		or_data.order.forEach((item=>sum += item.subtotal))
		or_data.total_price = parseFloat((sum).toFixed(10))
	}
	
	// 减数量
	function reDuce(){
		console.log('or_data.order', or_data.order)
		or_data.order[0].buy_amount--
		or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10))
		or_data.total_price = or_data.order[0].subtotal
		if(selectedCoupon.value){
			const final = or_data.total_price - (selectedCoupon.value?.price || 0)
			const sum = final > 0 ? final : 0
			or_data.total_price = parseFloat(sum.toFixed(10))
		}
	}
	// 加数量
	function plUs(){
		or_data.order[0].buy_amount++
		or_data.order[0].subtotal = parseFloat((or_data.order[0].buy_amount * or_data.order[0].goods_price).toFixed(10))
		or_data.total_price = or_data.order[0].subtotal
		if(selectedCoupon.value){
			const final = or_data.total_price - (selectedCoupon.value?.price || 0)
			const sum = final > 0 ? final : 0
			or_data.total_price = parseFloat(sum.toFixed(10))
		}
	}
	
	// 提交订单
	import {outTradeno,coDe} from '../../Acc-config/orde_number.js'
	import {Wxpay} from '../../Acc-config/wx-pay.js'
	import {Plublic} from '@/Acc-config/public.js'
	async function subMit(){
		if(re_data.address.length == 0){
			// 地址未填
			new Plublic().toast('请填写收货地址！')
			return false
		}
		wx.showLoading({title: '正在下单',mask:true})
		// 当前时间:年月日，时分秒
		let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
		// 当前时间：年月日
		let query_time = moment().utcOffset(8).format('YYYY-MM-DD')
		// 对每个商品生成订单编号
		or_data.order.forEach(item=>item.order_number = coDe())
		let out_trade_no = outTradeno()
		if(orderType.value == 'gift'){
			console.log('积分兑换生成订单')
		}else{
			try{
				// 1.统一下单
				var payment = await new Wxpay().pLace(or_data.total_price,out_trade_no)
				// console.log(payment)
				// 2.提交订单到数据库
				const can_res = await new Wxpay().suBmit(or_data.order,payment.result,re_data.address,time,query_time,out_trade_no)
				// console.log(can_res)
				result.out_trade_no = out_trade_no
				result.or_data = or_data.order
				// 3.发起支付
				console.log('payment.result', payment.result)
				const pay = await new Wxpay().payMent(payment.result)
				// console.log(pay)
			}catch(err){
				if(err && err.errMsg == "requestPayment:fail cancel"){
					// 取消支付
					if(or_data.type == 'cart'){
						let cart = await new Wxpay().deleteCart(or_data.order)
					}
					// 跳转订单界面
					wx.hideLoading()
					wx.redirectTo({url:'/pages/All-orders/order'})
				}else{
					// 支付发生错误
					new Plublic().toast('支付发生错误')
					await db.collection('order_data').where({out_trade_no}).remove()
				}
			}
		}
		
	}
	
	onBeforeUnmount(()=>{watcher.close()})
	// 用户支付成功，该侦听器会做出响应
	let result = reactive({out_trade_no:'',or_data:[]})
	const watcher = db.collection('user_infor').watch({
	  onChange: async(res)=> {
	    // console.log('snapshot', res)
		if(res.docChanges[0].dataType == 'update'){
			// 1.支付成功更改订单字段为成功，跳转订单页面
			await new Wxpay().staTe('success',result.out_trade_no)
			// 2.支付成功：库存自减，售出自增
			await new Wxpay().resTock(result.or_data)
			// 3.如果购物车的下单商品数据要删除
			if(or_data.type == 'cart'){
				let cart = await new Wxpay().deleteCart(result.or_data)
			}
			// 4.如果使用了优惠券则需要更改优惠券状态
			handleCouponPayMent()
			handleIntegralAftePay()
			// 跳转订单界面
			 wx.hideLoading()
			wx.redirectTo({url:'/pages/All-orders/order'})
		}
	  },
	  onError: (err)=> {
	    // console.error('the watch closed because of error', err)
	  }
	})
	
	const showCouponModal = ref(false)
	// 展示优惠券弹窗
	function showCoupon(){
		showCouponModal.value = true
	}
	function cancelCoupon(){
		showCouponModal.value = false
	}
	
	import { myCoupons } from '../../Acc-config/answer.js'
	import { currentTime, transferTime, hasSameElement } from '../../Acc-config/public.js'
	
	const couponsInfo = reactive({
		enable: [], //可用
		disable: [] // 不可用原因：1、当前商品不支持 2、满减券，金额不够
	})
	
	// 获取优惠券信息
	async function getCoupons(){
		const res = await db.collection('coupon_detail').where({used: false}).get()
		const rightTimeList = res?.data?.filter((item) => (transferTime(item.time[0]) <= currentTime()) && (transferTime(item.time[1]) >= currentTime()))
		console.log('rightTimeList', rightTimeList)
		myCoupons.data = rightTimeList
		const filterCoupons = filterCoupon(rightTimeList)
		couponsInfo.enable = filterCoupons.enable
		couponsInfo.disable = filterCoupons.disable
	}
	
	const orderTypeList = computed(() => {
		return or_data.order.map(order => order.category)
	})
	
	// 优惠券区分可用不可用
	function filterCoupon(couponList){
		const res = {enable:[], disable: []}
		couponList.forEach(item => {
			if(item.type == 'full' && or_data.total_price < item.full || (item.type == 'limit' && hasSameElement(orderTypeList, item.limit))){
				res.disable.push(item)
			}else {
				res.enable.push(item)
			}
		})
		return res
	}
	
	// 已选择的优惠券
	const selectedCoupon = ref()
	function setSelectedCoupon(coupon){
		selectedCoupon.value = coupon
	}
	
	// 使用了优惠券支付则需要更改优惠券状态
	async function handleCouponPayMent(){
		const id = selectedCoupon.value._id || ''
		await db.collection('coupon_detail').doc(id).update({data:{used:true}})
	}
	
	const _ = db.command
	// 下单支付成功后送积分活动 满10元得1积分
	async function handleIntegralAftePay(){
		const integral = Math.floor(or_data.total_price % 10)
		console.log('handleIntegralAftePay', integral)
		// 更新积分明细表
		let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')  // 当前时间:年月日，时分秒
		await db.collection('integral_detail').add({data:{_openid:user._openid, type: 'add', num: integral, desc: '消费送积分活动！', time: time}})
		// 用户表做积分合计
		const user_data = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		await db.collection('user_infor').doc(user_data?._id).update({data: {
			// 表示指示数据库将字段自增
			integral: _.inc(integral)
		}})
	}
	
	watch(() => selectedCoupon.value?.price, (newVal) => {
		if(newVal > 0){
			const final = or_data.total_price - newVal
			const sum = final > 0 ? final : 0
			or_data.total_price = parseFloat(sum.toFixed(10))
		}else {
			calcPrice()
		}
	})
	
	// 处理领取优惠券刷新
	watch(() => myCoupons.hasCouponId, () => {
		getCoupons()
	})
</script>

<style>
	page{
		background-color: #f6f6f6;
	}
</style>
<style scoped>
.card{
	box-sizing: border-box;
	width: 96%;
	margin: 0 auto;
	padding: 20rpx;
	margin-top: 20rpx;
	border-radius: 12rpx;
	background-color: #FFFFFF;
}
.pay-address{
	display: flex;
	align-items: center;
}
.pay-address-left image{
	display: block;
	width: 40rpx;
	height: 40rpx;
}
.pay-address-right image{
	display: block;
	width: 30rpx;
	height: 30rpx;
}
.pay-address-name{
	flex: 1;
	padding: 0 20rpx;
}
.pay-address-name view{
	display: flex;
	align-items: center;
}
.pay-address-name view text:nth-child(1){
	padding-right: 10rpx;
	font-weight: bold;
}
.pay-address-name view text:nth-child(2){
	color: #8b8b8d;
}

.placeholder-tip{
	color: #8b8b8d;
}
/* 待支付商品 */
.pay-goods{
	display: flex;
	padding: 20rpx 20rpx 40rpx 20rpx;
}
.pay-goods text{
	display: block;
}
.pay-goods image{
	display: block;
	width: 200rpx;
	height: 200rpx;
	margin-right: 20rpx;
	border-radius: 10rpx;
}
.pay-goods-title{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.pay-goods-specs{
	background-color: #fafafa;
	padding: 10rpx;
	display: inline-block !important;
	font-size: 28rpx;
	color: #a4a4a4;
	margin-top: 20rpx;
	border-radius: 10rpx;
}
.pay-goods-price{
	padding-top: 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
}
.pay-goods-price image{
	width: 50rpx;
	height: 50rpx;
	display: block;
	margin: 0 !important;
}

.pay-goods-price>text{
	color: #fc324a;
	margin-right: 40rpx;
}

.pay-goods-price view{
	display: flex;
}

.pay-goods-price view text{
	padding: 0 20rpx;
}

/*资产*/
.line{
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	margin-bottom: 10rpx;
	color: #8b8b8d;
}
.line:last-child{
	margin-bottom: 0;
}
.line image{
	width: 30rpx;
	height: 30rpx;
	margin-left: 10rpx;
}
.line .right{
	display: flex;
	align-items: center;
}
/* 结算 */
.set-accounts{
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 20rpx 68rpx 20rpx;
}
.set-accounts view:nth-child(1){
	color: #fc324a;
	font-size: 35rpx;
	font-weight: bold;
}
.set-accounts view:nth-child(2){
	background-color: #FF5500;
	color: #FFFFFF;
	font-size: 35rpx;
	padding: 15rpx 35rpx;
}

.hascount{
	color: #FF5500;
	margin-right: 5rpx;
	font-size: 14px;
	margin-left: 20rpx;
}
.propertys .right{
	color: #FF5500;
	font-size: 14px;
	font-weight: 600;
}
</style>