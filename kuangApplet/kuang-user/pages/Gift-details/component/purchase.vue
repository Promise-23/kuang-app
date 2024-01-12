<template>
	<!-- 导航栏 -->
	<view class="search-back" :style="{opacity:styleOpacity}" v-show="being">
		<view :style=" 'height:' + S_top + 'px;' "></view>
		<view class="search-input" :style="['height:' + S_height + 'px;','padding-right:' + S_width + 'px;']">
			<view class="tab-jiantou" @click="goTo">
				<image src="/static/detail/video-fanhui.svg" mode="widthFix"></image>
			</view>
			<view class="tab-view" v-for="(item,index) in tab_name" :key="index"
			:style=" 'height:' + S_height + 'px;' "
			@click="swItch(index)"
			>
				<text>{{item}}</text>
				<text :class="{active : index == trigger}"></text>
			</view>
		</view>
	</view>
	<view class="purchase">
		<view class="flex-left">
			<button plain="true" open-type="share">
				<image src="/static/detail/fenxiang.svg" mode="aspectFit"></image>
				<text>分享</text>
			</button>
		</view>
		<view class="flex-right buy" @click="purChase('j_pur',sku_data)">立即兑换</view>
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


</script>

<style scoped>
.purchase{
	height: 100rpx;
	background-color: #fefefe;
	/* border-top: 1rpx solid #e3e3e4; */
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding:50rpx 0;
	border-radius: 50rpx 50rpx 0 0;
	box-shadow: 6px 6px 5px rgba(0,0,0,0.2);
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
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
}
.shopping-cart{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80rpx;
	/* padding: 0 50rpx; */
	margin-left: 20rpx;
	background-color: #FF5500;
	border-radius: 50rpx;
	box-shadow: 1px 1px 1px rgba(255, 85,0, 0.2);
}
.buy{
	flex: 4;
	background-color: #FF5500;
	color: #fefefe;
	font-weight: bold;
	margin: 0 20rpx;
	border-radius: 50rpx;
	box-shadow: 2px 1px 2px rgba(255, 85, 0, 0.2);
}
.shopping-amount{
	position: relative;
}
.amount{
	position: absolute;
	right: 0;
	top: -4rpx;
	background-color: #FF5500;
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