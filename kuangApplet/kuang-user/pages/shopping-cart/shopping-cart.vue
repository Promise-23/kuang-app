<template>
	<view class="Manage" @click="manAge">{{manage}}</view>
	<view v-if="exist" class="SH-view" v-for="(item,index) in cart_data" :key="index">
		<view class="SH-icon">
			<icon type="success" color="#ea445a" v-if="item.select" @click="seLect(index,item.select)"></icon>
			<icon type="circle" v-else @click="seLect(index,item.select)"></icon>
		</view>
		<view class="SH-img">
			<image :src="item.goods_image" mode="aspectFill"></image>
		</view>
		<view class="SH-right">
			<view class="overflow">{{item.goods_title}}</view>
			<view class="SH-zhankai" v-if="item.specs.length > 0">
				<text v-for="(item_a,index_a) in item.specs" :key="index_a">{{item_a.att_val}}</text>
			</view>
			<view v-else class="SH-zhankai" style="background-color: initial;"></view>
			<view class="SH-price">
				<view>¥{{item.goods_price}}</view>
				<view class="SH-amount">
					<image src="/static/detail/jianshao.png" mode="aspectFit" @click="reDuce(index,item._id)" :class="[item.buy_amount == 1 ? 'prevent_style' : '']"></image>
					<text>{{item.buy_amount}}</text>
					<image src="/static/detail/tianjia.png" mode="aspectFit" @click="plUs(index,item._id)"></image>
				</view>
			</view>
		</view>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="!exist || cart_data.length == 0">购物车竟然是空的</view>
	<view style="height: 200rpx;"></view>
	<!-- 底部 -->
	<view class="SH-bottom">
		<!-- 取消全选 -->
		<block v-if="totalPrice.sele">
			<icon type="success" color="#ea445a" @click="cancelSelect"></icon>
			<text class="space" @click="cancelSelect">全选</text>
		</block>
		<!-- 全选 -->
		<block v-else>
			<icon type="circle" color="#ea445a" @click="selectAll"></icon>
			<text class="space" @click="selectAll">全选</text>
		</block>
		<text class="cut-apart"></text>
		<text class="space">合计: </text>
		<text class="SH-total">¥{{totalPrice.price}}</text>
		<text class="SH-settle"
		:class="[totalPrice.price <= 0 ? 'prevent_btn' : '']"
		@click="getInfo(manage)"
		>{{manage == '管理' ? '结算' : '删除'}}</text>
	</view>
</template>

<script setup>
	import {ref,reactive,toRefs,computed} from 'vue'
	import {onShow} from '@dcloudio/uni-app'
	const db = wx.cloud.database()
	
	onShow(()=>{
		staTus()
	})
	
	const user = reactive({user_infor:{},exist:false})
	const {user_infor,exist} = toRefs(user)
	function staTus(){
		const user_data = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(user_data){
			user.exist = true
			getCart()
		}else{
			user.exist = false
		}
	}
	
	const data = reactive({cart_data:[]})
	const {cart_data} = toRefs(data)
	async function getCart(){
		const res = await db.collection('sh_cart').get()
		console.log(res)
		data.cart_data = res.data
	}
	
	// 点击管理
	const manage = ref('管理')
	function manAge(){
		manage.value = manage.value == '管理' ? '完成' : '管理'
	}
	
	// 减少
	function reDuce(index,_id){
		data.cart_data[index].buy_amount--
		data.cart_data[index].subtotal = parseFloat((data.cart_data[index].goods_price * data.cart_data[index].buy_amount).toFixed(10))
		db.collection('sh_cart').doc(_id).update({data:{buy_amount:data.cart_data[index].buy_amount,subtotal:data.cart_data[index].subtotal}})
	}
	// 加
	function plUs(index,_id){
		data.cart_data[index].buy_amount++
		data.cart_data[index].subtotal = parseFloat((data.cart_data[index].goods_price * data.cart_data[index].buy_amount).toFixed(10))
		db.collection('sh_cart').doc(_id).update({data:{buy_amount:data.cart_data[index].buy_amount,subtotal:data.cart_data[index].subtotal}})
	}
	
	// 单个商品的选中或者取消选中
	function seLect(index,select){
		data.cart_data[index].select = data.cart_data[index].select ? false : true
	}
	
	// 监听全选或者取消全选
	const totalPrice = computed(()=>{
		let sum = 0
		let all = []
		data.cart_data.forEach(item=>{
			if(item.select){
				sum += item.subtotal
				all.push(item.select)
			}
		})
		return {
			price:parseFloat((sum).toFixed(10)),
			sele:all.length == data.cart_data.length ? true : false
		}
	})
	
	// 取消全选
	function cancelSelect(){
		data.cart_data.forEach(item=>item.select = false)
	}
	// 去选
	function selectAll(){
		data.cart_data.forEach(item=>item.select = true)
	}
	
	// 结算和删除
	function getInfo(val){
		if(val == '管理'){//结算
			console.log('结算')
			const res = data.cart_data.filter(item=>item.select)
			const STR = JSON.stringify(res)
			wx.navigateTo({//direct单个商品下单
				url:`/pages/Pay-view/pay?order=${STR}&type=cart`
			})
		}else{//删除
			data.cart_data.forEach(async(item,index)=>{
				if(item.select){
					await db.collection('sh_cart').doc(item._id).remove()
					data.cart_data.splice(data.cart_data.findIndex(item_a => item_a._id == item._id),1)
				}
			})
		}
	}
	
</script>

<style>
page{background-color: #fafafa;}
.Manage{
	padding: 20rpx 20rpx 0 0;
	text-align: right;
}
.SH-view{
	background-color: #FFFFFF;
	display: flex;
	padding: 40rpx 20rpx;
	margin: 20rpx 0;
}
.SH-icon{
	height: 150rpx;
	display: flex;
	align-items: center;
}
.SH-img{
	width: 150rpx;
	height: 150rpx;
	padding: 0 20rpx;
}
.SH-img image{
	width: 150rpx;
	height: 150rpx;
	border-radius: 7rpx;
}
.SH-right{
	flex: 1;
}
.SH-zhankai{
	background-color: #fafafa;
	color: #bdbdbd;
	display: inline-block;
	margin: 10rpx 0 20rpx 0;
	padding: 5rpx 10rpx;
	font-size: 26rpx;
}
.SH-zhankai image{
	width: 20rpx;
	height: 20rpx;
	padding-left: 10rpx;
}
.SH-price{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.SH-price view:nth-child(1){
	color: #ff4b70;
	font-weight: bold;
}
.SH-amount{
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
}
.SH-amount image{
	width: 50rpx;
	height: 50rpx;
}
.SH-amount text{
	padding: 0 30rpx;
}
/* 底部购物车 */
.SH-bottom{
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	padding: 0 20rpx;
	display: flex;
	align-items: center;
}
.SH-bottom text{
	display: block;
}
.space{
	padding: 0 15rpx;
}
.SH-total{
	flex: 1;
	color: #dd4055;
	font-weight: bold;
}
.SH-settle{
	background-color: #ea445a;
	padding: 20rpx 90rpx;
	border-radius: 10rpx;
	color: #FFFFFF;
}
.cut-apart{
	width: 7rpx;
	height: 30rpx;
	background-color: #dadada;
}
.prevent_btn{
	opacity: 0.4;
	pointer-events: none;
}
</style>