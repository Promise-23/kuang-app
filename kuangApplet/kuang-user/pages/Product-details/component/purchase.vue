<template>
	<view class="purchase">
		<view class="flex-left">
			<button plain="true" open-type="share">
				<image src="/static/detail/fenxiang.svg" mode="aspectFit"></image>
				<text>分享</text>
			</button>
		</view>
		<view class="flex-left shopping-amount" @click="goCart">
			<image src="/static/detail/gouwuche.svg" mode="aspectFit"></image>
			<text>购物车</text>
			<text class="amount" v-if="ORDER.nu_sh_cart > 0">{{ORDER.nu_sh_cart}}</text>
		</view>
		<view class="flex-left" @click="toCollect(COLL)">
			<image src="/static/detail/shoucang.svg" mode="aspectFit" v-if="COLL <= 0"></image>
			<image src="/static/detail/yishoucang.svg" mode="aspectFit" v-else></image>
			<text>{{COLL > 0 ? '已收藏' : '收藏'}}</text>
		</view>
		<view v-if="whether" class="flex-right shopping-cart" @click="purChase('j_sho',sku_data)">加入购物车</view>
		<view v-if="whether" class="flex-right buy" @click="purChase('j_pur',sku_data)">立即购买</view>
		<!-- 库存不足 商品已下架 -->
		<view v-else class="flex-right buy">{{tips}}</view>
	</view>
</template>

<script setup>
	import {defineProps,watch,reactive,toRefs,ref} from 'vue'
	import {ORDER,SHCART} from '../../../Acc-config/place-order.js'
	let props = defineProps({goods_id:String,collection:Number,sku_data:Array,goods:Object})

	const result = reactive({goods_id:'',whether:true,tips:'',goods:{}})
	const {whether,tips} = toRefs(result)
	watch(props,(newVal,oldVal)=>{
		let {goods_id,goods} = JSON.parse(JSON.stringify(newVal))
		result.goods_id = goods_id
		result.goods = goods;
		// 判断商品是否已下架，有无库存
		if(goods.shelves == false){
			if(goods.stock <= 0){//商品下架以及库存不足
				result.whether = false
				result.tips = '该商品已下架'
			}else{//只是商品下架
				result.whether = false
				result.tips = '该商品已下架'
			}
		}else if(goods.stock <= 0){
			console.log('进来')
			if(!goods.shelves){//库存不足以及商品下架
				result.whether = false
				result.tips = '该商品已下架'
			}else{
				result.whether = false
				result.tips = '该商品已售完'
			}
		}
	})
	
	// 接收父组件传来的收藏数据
	let COLL = ref(0)
	watch(()=>props.collection,(newVal,oldVal)=>{
		COLL.value = newVal
	})
	// 收藏和取消收藏
	import {login_user} from '@/Acc-config/answer.js'
	const db = wx.cloud.database()
	import {Plublic} from '@/Acc-config/public.js'
	async function toCollect(n){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(!user){login_user.show = true;return false}
		if(n === 0){//收藏
			try{
				await db.collection('collect_goods').add({data:{goods_id:result.goods_id}})
				COLL.value++
			}catch(e){
				new Plublic().toast('收藏失败')
			}
		}else{//取消收藏
			try{
				await db.collection('collect_goods').where({goods_id:result.goods_id}).remove()
				COLL.value = 0
			}catch(e){
				new Plublic().toast('取消收藏失败')
			}
		}
	}

	
	// 加购或立即购买
	import {sku_popup} from '@/Acc-config/answer.js'
	async function purChase(judge,sku){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(!user){login_user.show = true;return false}
		if(sku.length > 0){//有规格
			sku_popup.show = true
			sku_popup.judge = judge
		}else{//没有规格
			ORDER.order.buy_amount = 1
			if(judge == 'j_sho'){
				// 加入购物车
				try{
					let res = await SHCART()
					new Plublic().toast(res)
				}catch(err){
					new Plublic().toast(err)
				}
			}else{
				/* 立即购买 */
				// 计算总价
				ORDER.order.subtotal = parseFloat((ORDER.order.goods_price * ORDER.order.buy_amount).toFixed(10))
				sku_popup.show = false
				const STR = JSON.stringify([ORDER.order])
				wx.navigateTo({//direct单个商品下单
					url:`/pages/Pay-view/pay?order=${STR}&type=direct`
				})
			}
		}
	}

	// 跳转购物车
	function goCart(){
		wx.switchTab({
			url:'/pages/shopping-cart/shopping-cart'
		})
	}


</script>

<style scoped>
.purchase{
	height: 100rpx;
	background-color: #fefefe;
	border-top: 1rpx solid #e3e3e4;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom:68rpx;
}
.purchase image{
	width: 40rpx;
	height: 40rpx;
	display: block;
	padding-bottom: 8rpx;
}
.flex-left{
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 25rpx;
	color: #8a8b90;
}
.flex-left button{
	border: navajowhite;
	padding: inherit !important;
	margin: 0 !important;
	font-size: 25rpx !important;
	line-height: inherit !important;
	color: #8a8b90 !important;
}
.flex-right{
	flex: 2;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
}
.shopping-cart{
	background-color: #fdf5f7;
	color: #ec697f;
	font-weight: bold;
}
.buy{
	background-color: #e9445a;
	color: #fefefe;
	font-weight: bold;
}
.shopping-amount{
	position: relative;
}
.amount{
	position: absolute;
	right: 0;
	top: -4rpx;
	background-color: #e9445a;
	color: #FFFFFF;
	width: 40rpx;
	height: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	border-radius: 50rpx;
}
</style>