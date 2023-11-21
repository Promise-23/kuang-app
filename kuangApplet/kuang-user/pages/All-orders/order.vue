<template>
	<!-- tab切换 -->
	<view class="order-tab">
		<view v-for="(item,index) in tab" :key="index" @click="swItch(index,item.query)">
			<text>{{item.name}}</text>
			<text :class="{order_Select: index == re}"></text>
		</view>
	</view>
	<view style="height: 60rpx;"></view>
	<!-- 订单数据 -->
	<view class="order-back" v-for="(item,index) in order_data" :key="index">
		<view class="order-card">
			<view @click="jumpGoods(item.goods_id)">
				<image :src="item.goods_image" mode="aspectFill"></image>
			</view>
			<view>
				<text @click="jumpGoods(item.goods_id)" class="order-title-padd">{{item.goods_title}}</text>
				<text class="order-specs" v-if="item.specs.length > 0" v-for="(item_a,index_a) in item.specs" :key="index_a">{{item_a.att_val}}</text>
			</view>
			<view>
				<text></text>
				<text class="order-title-padd order-num">{{item.goods_price}}</text>
				<text class="order-num">x{{item.buy_amount}}</text>
			</view>
		</view>
		<!-- 合计 -->
		<view class="order-total">
			<text class="copy-code" @click="copyCode">复制订单号</text>
			<view class="total">
				<text>合计</text>
				<text>{{item.subtotal}}</text>
			</view>
		</view>
		<!-- 支付的状态 -->
		<!-- 支付成功的状态 -->
		<view class="order-button" v-if="item.pay_success == 'success'">
			<!-- 待发货 申请退款 -->
			<block v-if="item.deliver == 'stay'">
				<text class="order-button-a">待发货</text>
				<text class="order-button-b" @click="refUnd(index,item._id)">申请退款</text>
			</block>
			<!-- 确认收货 查看物流 申请退款 -->
			<block v-if="item.deliver == 'already'">
				<text class="order-button-a" @click="confRece(index,item._id)">确认收货</text>
				<text class="order-button-b" @click="loGistics(item.waybill_No,item.goods_image,item.goods_title,item.buy_amount)">查看物流</text>
				<text class="order-button-b" @click="refUnd(index,item._id)">申请退款</text>
			</block>
			<!-- 已发货 评价 申请退款 -->
			<block v-if="item.deliver == 'rece_goods'">
				<text class="order-button-a">已发货</text>
				<text class="order-button-b" @click="eavLuate(item._id,item.goods_id,index,item.evaluate,item.specs)">{{item.evaluate ? '已评价' : '评价'}}</text>
				<text class="order-button-b" @click="refUnd(index,item._id)">申请退款</text>
			</block>
			<!-- 申请退款中 -->
			<block v-if="item.deliver == 'ref_pro'">
				<text class="order-button-b">申请退款中</text>
			</block>
			<!-- 退款成功 -->
			<block v-if="item.deliver == 'ref_succ'">
				<text class="order-button-b">退款成功</text>
			</block>
		</view>
		<!-- 待支付的状态 -->
		<view class="order-button" v-else-if="item.pay_success == 'not_pay'">
			<!-- 取消订单 -->
			<!-- 继续支付 -->
			<text class="order-button-b" @click="canOrder(item._id,index)">取消订单</text>
			<text class="order-button-b" @click="goonPay(index,item._id,item.subtotal,item)">继续支付</text>
		</view>
		<!-- 已取消订单的状态 -->
		<view class="order-button" v-else-if="item.pay_success == 'can_order'">
			<!-- 订单已取消 -->
			<text class="order-button-a">订单已取消</text>
		</view>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="order_data.length == 0">没有订单数据</view>
	<!-- 上拉加载提示 -->
	<view class="loading-hei">
		<Loading v-if="loading"></Loading>
	</view>
	<view style="height: 200rpx;"></view>
</template>

<script setup>
	import {reactive,toRefs,ref,onBeforeUnmount,watch} from 'vue'
	const db = wx.cloud.database()
	import {onLoad,onReachBottom} from '@dcloudio/uni-app'
	import Loading from '../public-view/loading.vue'
	
	const re = ref(0)
	const data = reactive({
		tab:[
			{
				name:'全部',
				query:{}
			},
			{
				name:'待支付',
				query:{pay_success:'not_pay'}
			},
			{
				name:'待发货',
				query:{pay_success:'success',deliver:'stay'}
			},
			{
				name:'待收货',
				query:{pay_success:'success',deliver:'already'}
			},
			{
				name:'待评价',
				query:{pay_success:'success',deliver:'rece_goods',evaluate:false}
			}
		]
	})
	const {tab} = toRefs(data)
	
	onLoad((event)=>{
		console.log(event)
		let LE = Object.keys(event).length// 判断是否传值
		let index = LE === 0 ? 0 : JSON.parse(event.obj).index
		let query = LE === 0 ? {} : JSON.parse(event.obj).query
		swItch(index,query)
	})
	
	// tab切换
	function swItch(index,query){
		re.value = index
		res_order.order_data = []
		page_n.value = 0
		getOrder(0,query)
	}
	
	// 请求数据
	const res_order = reactive({order_data:[]})
	const {order_data} = toRefs(res_order)
	async function getOrder(sk,query){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		query['_openid'] = user._openid
		const res = await db.collection('order_data').where(query).limit(10).skip(sk).orderBy('order_time','desc').get()
		console.log('order_data', res.data)
		res_order.order_data = [...res_order.order_data,...res.data]
	}
	
	
	// 上拉加载
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{//onReachBottom只能在父组件才能触底
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		await getOrder(sk,data.tab[re.value].query)
		loading.value = false
	})
	
	// 继续支付
	import {outTradeno} from '../../Acc-config/orde_number.js'
	import {Plublic} from '@/Acc-config/public.js'
	import {Wxpay} from '@/Acc-config/wx-pay.js'
	async function goonPay(index,_id,subtotal,item){
		try{
			let out_trade_no = outTradeno()
			// 1.统一下单
			var payment = await new Wxpay().pLace(subtotal,out_trade_no)
			
			result._id = _id
			result.payment = payment.result
			result.order_item = item
			result.index = index
			result.out_trade_no = out_trade_no
			
			// 拉起支付
			await new Wxpay().payMent(payment.result)
		}catch(err){
			console.log(err)
			if(err && err.errMsg == "requestPayment:fail cancel"){
				new Plublic().toast('取消支付')
			}else{
				// 支付发生错误
				new Plublic().toast('支付发生错误')
			}
		}
	}
	
	// 用户支付成功，该侦听器会做出响应
	onBeforeUnmount(()=>{watcher.close()})
	let result = reactive({_id:'',payment:{},order_item:[],index:-1,out_trade_no:''})
	const watcher = db.collection('user_infor').watch({
		onChange: async(res)=> {
			const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
			if(res.docChanges[0].dataType == 'update'){
				// 更新该条数据的某些字段
				await db.collection('order_data').where({_openid:user._openid,_id:result._id}).update({
					data:{pay_success: 'success',payment:result.payment,
					out_trade_no:result.out_trade_no
					}
				})
				// 2.支付成功：库存自减，售出自增
				await new Wxpay().resTock([result.order_item])
				// 如果tab切换在全部上，就更改状态，否则就移除掉
				if(re.value == 0){
					res_order.order_data[result.index].pay_success = 'success'
				}else{
					res_order.order_data.splice(result.index,1)
				}
			}
		},
		onError: (err)=> {
		  // console.error('the watch closed because of error', err)
		}
	})
	
	// 取消订单
	async function canOrder(_id,index){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		await db.collection('order_data').where({_openid:user._openid,_id}).update({data:{pay_success:'can_order'}})
		// 如果tab切换在全部上，就更改状态，否则就移除掉
		if(re.value == 0){
			res_order.order_data[index].pay_success = 'can_order'
		}else{
			res_order.order_data.splice(index,1)
		}
	}
	
	// 退款
	const itemList = ref(['七天无理由退换货','商品信息描述不符','质量问题','包装/商品破损/污渍'])
	function refUnd(index,_id){
		wx.showActionSheet({
			alertText:'退款原因',
			itemList: itemList.value,
			success: async(res)=> {
				const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
				await db.collection('order_data').where({_openid:user._openid,_id}).update({data:{deliver:'ref_pro',Re_reason:itemList.value[res.tapIndex]}})
				// 如果tab切换在全部上，就更改状态，否则就移除掉
				if(re.value == 0){
					res_order.order_data[index].deliver = 'ref_pro'
				}else{
					res_order.order_data.splice(index,1)
				}
			},
			fail (res) {
				console.log(res.errMsg)
			}
		})
	}
	
	// 确认收货
	async function confRece(index,_id){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		await db.collection('order_data').where({_openid:user._openid,_id}).update({data:{deliver:'rece_goods'}})
		// 如果tab切换在全部上，就更改状态，否则就移除掉
		if(re.value == 0){
			res_order.order_data[index].deliver = 'rece_goods'
		}else{
			res_order.order_data.splice(index,1)
		}
	}
	
	// 去评价
	let eav_id = ref('')
	function eavLuate(_id,goods_id,index,evaluate,specs){
		if(evaluate)return false
		eav_id.value = _id
		let query = JSON.stringify({goods_id,index,specs})
		wx.navigateTo({
			url:'/pages/Eav-goods/goods?query=' + query
		})
	}
	
	// 监听提交评价后更改当前界面某订单的状态
	import {eav_index} from '../../Acc-config/answer.js'
	watch(eav_index,(newVal,oldVal)=>{
		// 如果tab切换在全部上，就更改状态，否则就移除掉
		if(re.value == 0){
			res_order.order_data[newVal].evaluate = true
		}else{
			res_order.order_data.splice(newVal,1)
		}
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		db.collection('order_data').where({_openid:user._openid,_id:eav_id.value}).update({data:{evaluate:true}})
	})
	
	// 查看物流
	function loGistics(waybill_No,goods_image,goods_title,buy_amount){
		let obj = JSON.stringify({waybill_No,goods_image,goods_title,buy_amount})
		wx.navigateTo({
			url:'/pages/Order-tracking/tracking?value=' + obj
		})
	}
	
	// 跳转指定商品
	function jumpGoods(goods_id){
		wx.navigateTo({
			url:`/pages/Product-details/details?goods_id=${goods_id}`
		})
	}
	
</script>

<style>
page{
	background-color: #f8f8f8;
}
.order-tab{
	height: 60rpx;
	background-color: #FFFFFF;
	display: flex;
	justify-content: space-around;
	color: #737373;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
}
.order-tab view{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.order_Select{
	display: block;
	width: 40rpx;
	height: 10rpx;
	border-radius: 50rpx;
	background-color: #ea4050;
	position: absolute;
	bottom: 0;
}
/* 订单卡片 */
.order-back{
	background-color: #fefefe;
	padding: 20rpx;
	margin: 20rpx 0;
}
.order-card image{
	width: 150rpx;
	height: 150rpx;
	display: block;
	border-radius: 8rpx;
}
.order-card{
	display: flex;
}

.order-card view:nth-child(2){
	flex: 1;
	padding: 0 20rpx;
}
.order-title-padd{
	margin-bottom: 20rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
.order-specs{
	background-color: #fafafa;
	font-size: 27rpx;
	color: #767676;
	padding: 10rpx;
	border-radius: 9rpx;
}
.order-num{
	color: #8b8c90;
}
/* 合计 */
.order-total{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 30rpx;
	margin-top: 10rpx;
}

.order-total .total{
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.order-total .total text{
	display: block;
	padding-left: 20rpx;
}
.order-total .total text:nth-child(1){
	color: #8b8c90;
}
.order-total .total text:nth-child(2){
	font-weight: bold;
	font-size: 34rpx;
}
.copy-code{
	font-size: 22rpx;
	border: 1px solid #575757;
	height: 15px;
	line-height: 15px;
	padding: 0 20rpx;
	border-radius: 20rpx;
}
/* 按钮 */
.order-button{
	display: flex;
	justify-content: flex-end;
}
.order-button text{
	padding: 15rpx 35rpx;
	margin-left: 20rpx;
	border-radius: 10rpx;
}
.order-button-a{
	border: 1rpx solid #d7d8d8;
	color: #8b8c90;
}
.order-button-b{
	background-color: #ea4050;
	color: #FFFFFF;
}
</style>