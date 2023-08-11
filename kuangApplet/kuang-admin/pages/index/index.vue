<template>
	<!-- 自定义的顶部导航栏 -->
	<view class="Top-view">
		<view :style=" 'height:' + Custom_height + 'px;' ">
			<view :style=" 'height:' + S_top + 'px;' "></view>
			<view :style="['height:' + S_height + 'px;', 'line-height:' + S_height + 'px;', 'padding-left:' + '10px']">框架高端女装</view>
		</view>
		<!-- 定位的订单收益板块 -->
		<view class="profit-view" :style=" 'top:' + pro_hei + 'px;' ">
			<view class="profit-num">
				<text>累计收益(元)</text>
				<text>{{profit}}</text>
			</view>
			<view class="profit-sale">
				<view>
					<text>今日销售额</text>
					<text>{{sales}}</text>
				</view>
				<view>
					<text>今日订单数</text>
					<text>{{orders}}</text>
				</view>
				<view>
					<text>累计订单数</text>
					<text>{{com_order}}</text>
				</view>
			</view>
		</view>
	</view>
	<!-- 九宫格 -->
	<view class="Gong-ge" :style=" 'top:' + profit_top + 'px;' ">
		<view v-for="(item,index) in plate" :key="index" @click="jump(index)">
			<image :src="item.image" mode="aspectFit"></image>
			<text>{{item.name}}</text>
		</view>
	</view>
</template>

<script setup>
	import {onMounted,reactive,toRefs} from 'vue'
	
	// 存储胶囊按钮的位置数据
	const search_data = reactive({
		S_height:0,//胶囊按钮的高度
		S_top:0,//胶囊按钮距离顶部的高度
		Custom_height:0,//上两个的和
		pro_hei:0,//订单收益板块距离手机顶部的高度
		profit_top:0,//九宫格距离手机顶部的高度
		// 九宫格的数据
		plate:[
			{
				image:'/static/detail/hengfu.svg',
				name:'横幅管理'
			},
			{
				image:'/static/detail/miaosha.svg',
				name:'秒杀管理'
			},
			{
				image:'/static/detail/shangpin.svg',
				name:'商品管理'
			},
			{
				image:'/static/detail/dingdan.svg',
				name:'订单管理'
			},
			{
				image:'/static/detail/fenlei.svg',
				name:'分类管理'
			}
		]
	})
	const {S_height,S_top,Custom_height,pro_hei,profit_top,plate} = toRefs(search_data)
	onMounted(()=>{
		capSule()
		proFit()
		coUnt()
	})
	
	// 获取胶囊按钮的位置数据
	function capSule(){
		const but_data = wx.getMenuButtonBoundingClientRect()
		// console.log(but_data)
		search_data.S_top = but_data.top
		search_data.S_height = but_data.height
		search_data.Custom_height = but_data.top + but_data.height
		search_data.pro_hei = but_data.top + but_data.height + 20
	}
	
	// 计算收益板块的高度
	function proFit(){
		const query = wx.createSelectorQuery()
		query.select('.profit-view').boundingClientRect()
		query.exec((res)=>{
			// console.log(res)
			search_data.profit_top = res[0].height + search_data.pro_hei + 10
		})
	}
	// 页面跳转
	function jump(index){
		switch(index){
			case 0:
			wx.navigateTo({
				url:'/pages/banner-amdin/banner'
			})
			break;
			case 1:
			wx.navigateTo({
				url:'/pages/seckill-admin/seckill'
			})
			break;
			case 2:
			wx.switchTab({
				url:'/pages/commodity/commodity'
			})
			break;
			case 3:
			wx.switchTab({
				url:'/pages/order/order'
			})
			break;
			case 4:
			wx.navigateTo({
				url:'/pages/sort-admin/sort'
			})
		}
	}
	
	// 计算累计收益，今日销售额，今日订单数，累计订单数
	const res = reactive({profit:'0.00',sales:'0.00',orders:0,com_order:0})
	const {profit,sales,orders,com_order} = toRefs(res)
	
	import {inIt} from '@/Acc-config/init.js'
	import moment from 'moment'
	moment.locale('zh-cn');
	async function coUnt(){
		let DB = await inIt()
		const BASE = DB.database()
		const $ = BASE.command.aggregate
		let query_time = moment().utcOffset(8).format('YYYY-MM-DD')
		// 计算累计收益
		const profit = await BASE.collection('order_data').aggregate().group({_id: null,totalPrice: $.sum('$subtotal')}).end()
		// console.log('计算累计收益', (profit.list[0]?.totalPrice ?? 0) === 0 ? '0.00' : profit.list[0]?.totalPrice)
		res.profit = (profit.list[0]?.totalPrice ?? 0) === 0 ? '0.00' : profit.list[0]?.totalPrice
		// 今日销售额
		const sales = await BASE.collection('order_data').aggregate().match({query_time}).group({_id: null,totalPrice: $.sum('$subtotal')}).end()
		// console.log('今日销售额', sales.list[0]?.totalPrice ?? 0 === 0 ? '0.00' : sales.list[0]?.totalPrice)
		res.sales = (sales.list[0]?.totalPrice ?? 0) === 0 ? '0.00' : sales.list[0]?.totalPrice
		// 今日订单数
		const orders = await BASE.collection('order_data').where({query_time}).count()
		res.orders = orders.total
		// 累计订单数
		const com_order = await BASE.collection('order_data').count()
		res.com_order = com_order.total
		wx.stopPullDownRefresh()
	}
	
	import {onPullDownRefresh} from '@dcloudio/uni-app'
	onPullDownRefresh(()=>{
		coUnt()
	})
	
</script>

<style>
page{background-color: #f4f4f4;}
.Top-view{
	height: 330rpx;
	position: relative;
	background-image: linear-gradient(to top, #9be15d 0%, #00e3ae 100%);
}
.profit-view{
	background-color: #FFFFFF;
	position: absolute;
	left: 20rpx;
	right: 20rpx;
	border-radius: 10rpx;
	padding: 20rpx;
}
.profit-num{
	display: flex;
	flex-direction: column;
	padding-bottom: 10rpx;
}
.profit-num text:nth-child(2){
	font-size: 40rpx;
	padding-top: 10rpx;
}
.profit-sale{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.profit-sale view{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.profit-sale view text:nth-child(1){
	color: #a7a7a7;
	padding-bottom: 10rpx;
}
.profit-sale view text:nth-child(2){
	font-weight: bold;
}
.Gong-ge{
	background-color: #FFFFFF;
	margin: 0 20rpx 20rpx 20rpx;
	border-radius: 10rpx;
	display: flex;
	flex-wrap: wrap;
	position: absolute;
	left: 0;
	right: 0;
	color: #555555;
}
.Gong-ge image{
	width: 55rpx;
	height: 55rpx;
	display: block;
	margin-bottom: 20rpx;
}
.Gong-ge view{
	width: calc(25% - 10rpx*2);
	margin: 20rpx 10rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

</style>
