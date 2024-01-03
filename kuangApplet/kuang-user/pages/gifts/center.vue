<template>
	<view class="card">
		<view class="integral">
			<view class="label">
				<image src="/static/img/integral.png" mode="aspectFit"></image>
				<text>积分余额</text>
			</view>
			<view class="num">
				<text>{{ myIntegral.count || 0}}</text>
			</view>
		</view>
		<view class="desc">
			<text>框架甄选，积分乐购</text>
			<view class="bill" @click="goDetail('integral')">
				<text>积分账单</text>
			</view>
		</view>
	</view>
	<!-- 自定义的指示点 -->
	<view class="instruct-view">
		<block v-for="(item,index) in sort" :key="index">
			<view class="instruct" :class="{active:index == active}" @click="handleChangeTab(index)">
				<text>{{ item.sort_name}}</text>
			</view>
		</block>
	</view>
	<view class="swiper-panel">
		<swiper class="swiper" :current='active' :autoplay='false' duration="500" @change="swiperFun">
			<block v-for="(card, i) in cards" :key="i">
				<swiper-item class="swiper-item " :item-id="i">
					<view class="card-view">
						<view class="Card-stream" v-for="(item,index) in card" :key="index" @click="juMp(item._id,item.video_url)">
							<view class="Card-image">
								<image :src="item.goods_cover" mode="aspectFill"></image>
							</view>
							<brand-icon :style="{fontSize: '60rpx', position: 'absolute',top: '20rpx', right: '20rpx'}"/>
							<view class="Card-title overflow">{{item.goods_title}}</view>
							<view class="Card-price">
								<view class="price">
									<text>{{item.goods_price}}</text>
									<image src="/static/img/integral.png" mode="aspectFit"></image>
								</view>
								<text>已售{{item.sold}}</text>
							</view>
						</view>
					</view>
					<view class="Tips" v-if="card.length == 0">暂无商品</view>
				</swiper-item>				
			</block>
		</swiper>
	</view>
	
	<back-top />

</template>

<script setup>
	import {onMounted,reactive,toRefs,ref} from 'vue'
	import Card from '../Common-component/Card-goods.vue'
	import Loading from '../public-view/loading.vue'
	import privacy from '../components/privacy-view.vue'
	import BackTop from '../Common-component/UI/BackTop.vue'
	import {search_data} from '@/Acc-config/answer.js'
	import { myIntegral } from '../../Acc-config/answer.js'
	const db = wx.cloud.database()
	const _ = db.command
	
	onMounted(()=>{
		goods()
	})
	
	// 请求数据
	const result = reactive({sort:[],cards:[[]]})
	const {sort,cards} = toRefs(result)
	const active = ref(0)
	async function goods(){
		wx.showLoading()
		// 分类  gifts_sort
		const sort = await db.collection('goods_sort').where({quantity: _.gt(0)}).get()
		result.sort = sort.data
		const resArr = []
		result.sort.forEach((item) => {
			const card = db.collection('goods').where({shelves:true, category: item.sort_name}).limit(10).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
			resArr.push(card)
		})
		console.log('resArr', resArr)
		// 商品数据 gifts
		// const card = await db.collection('goods').where({shelves:true}).limit(10).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
		Promise.all(resArr)
		.then(res=>{
			wx.hideLoading()
			result.cards = res.map((r) => r.data)
			console.log('result', result)
		})
		.catch(err=>{
			console.log(err)
		})
	}
	
	// 上拉加载
	import {onReachBottom} from '@dcloudio/uni-app'
	let loading = ref(false)
	let page_n = ref(0)
	// onReachBottom(async()=>{//onReachBottom只能在父组件才能触底
	// 	loading.value = true
	// 	page_n.value++
	// 	let sk = page_n.value * 10
		
	// 	// gifts
	// 	const res_goods = await db.collection('goods').where({shelves:true}).limit(10).skip(sk).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
	// 	result.card = [...result.card,...res_goods.data]
	// 	loading.value = false
	// })
	
	// 跳转积分账单
	function goDetail(type){
		const url = `/pages/property/integral`
		console.log('goDetail', url)
		wx.navigateTo({
			url: url
		})
	}
	
	function handleChangeTab(index){
		active.value = index
	}
	
	// 跳转详情页
	function juMp(goods_id,video_url){
		if(video_url == ''){
			console.log('跳转详情页')
			wx.navigateTo({
				url:`/pages/Product-details/details?goods_id=${goods_id}&type=gift`
			})
		}else{
			wx.navigateTo({
				url:`/pages/Short-video/video?goods_id=${goods_id}&type=gift`
			})
		}
	}
	
	// 滑块滑动时触发
	function swiperFun(e){
		active.value = e.detail.current
		console.log('active', active.value)
	}
	
</script>

<style>
page{background-color: #f4f4f4;}
.card{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height:200rpx;
	width: calc(100% - 140rpx);
	padding: 40rpx;
	margin: 0 auto;
	margin-top: 20rpx;
	background-image: linear-gradient(to bottom right, #000 0%, #575757 90%, #575757 100%);
	/* border: 1px solid rgba(0,0,0,0.1); */
	position: relative;
	border-radius: 16rpx;
	box-shadow: 6px 6px 5px rgba(0,0,0,0.2);
}

.card text{
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;  
}

.card .integral .label{
	display: flex;
	align-items: center;
}

.card .integral image{
	width: 50rpx;
	height: 50rpx;
	margin-right: 16rpx;
}

.card .integral .num{
	font-size: 40px;
	font-weight: 600;
}

.card .desc{
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	white-space: pre-line;
	letter-spacing: 1px;
}
.card .desc .bill{
	padding: 8rpx 16rpx;
	background: linear-gradient(to bottom right, #EEDABC 0%, #987952 100%);
	border-radius: 30rpx;
	font-size: 10px;
}
.bill text{
	color: #fff !important;
	-webkit-text-fill-color: unset !important
}

.instruct-view {
	display: flex;
	margin: 0 auto;
	margin-top: 30rpx;
	width: calc(100% - 60rpx);
	overflow-x: auto;
	font-size: 16px;
	font-weight: bold;
}

.instruct{
	white-space: nowrap;
	margin-right: 40rpx;
}

.instruct{
	position: relative;
	padding-bottom: 10rpx;
}
.instruct.active::after{
	position: absolute;
	bottom: 0;
	content: '';
	display: block;
	height: 2px;
	width: 80%;
	margin: 0 10%;
	background-color: red;
	transition: all 1s;
}

.swiper-top {
	height: 700rpx;
	position: relative;
}

.swiper {
	width: 100%;
	height: 100vh !important;
	border-radius: 20rpx;
	overflow: hidden;
	transform: translateY(0);
	margin-left: 30rpx;
	margin-top: 10rpx;
}

.swiper-item{
	height: max-content;
}

.card-view{
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
	width: calc(100% - 60rpx) !important;
	margin-right: 30rpx !important;
	height: max-content;
	object-position: top;
}
.Card-stream{
	position: relative;
	width: calc(50% - 10rpx);
	margin-top: 10rpx;
	margin-bottom: 10rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
}
.Card-stream:nth-child(odd){
	margin-right: 10rpx;
}
.Card-stream:nth-child(even){
	margin-left: 10rpx;
}
.Card-image{
	height: 400rpx;
/* 	padding: 20px 10px 10px 10px;
	background-color: #80d1c8; */
}
.Card-stream image{
	width: 100%; 
	height: 400rpx;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}
.brand-icon{
	position: absolute;
	top: 20rpx;
	height: 60rpx;
	width: 60rpx;
	right: 20rpx;
	background-color: #fff;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
}

.brand-icon image{
	width: 100%;
	height: 100%;
}
.Card-title{
	font-size: 28rpx;
	height: 80rpx;
	line-height: 40rpx;
	margin: 10rpx 15rpx;
}
.Card-price{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15rpx 15rpx 15rpx;
}

.Card-price .price{
	display: flex;
	align-items: center;
}
.Card-price .price text{
	color: #d0000f;
	font-weight: bold;
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.Card-price .price image{
	width: 40rpx;
	height: 40rpx;
	margin-left: 10rpx;
}
.Card-price > text{
	color: #b0b1b4;
	font-size: 25rpx;
}
</style>
