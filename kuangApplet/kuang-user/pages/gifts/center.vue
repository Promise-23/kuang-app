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
	<view class="panel">
		<!-- 自定义的指示点 -->
		<view class="instruct-view">
			<block v-for="(item,index) in sort" :key="index">
				<view class="instruct" :class="{active:index == active}" @click="handleChangeTab(index)">
					<text>{{ item.sort_name}}</text>
				</view>
			</block>
		</view>
		<swiper class="swiper" :autoplay='true' :circular="true" interval="3000" duration="1000" @change="swiperFun">
			<block v-for="(item,index) in card" :key="index">
				<swiper-item class="swiper-item" @click="juMp(item.goods_id,item.video_url)">
					<Card :card="card"/>
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
	
	onMounted(()=>{
		goods()
	})
	
	// 请求数据
	const result = reactive({sort:[],card:[]})
	const {sort,seckill,card} = toRefs(result)
	const active = ref(0)
	async function goods(){
		// 分类
		const sort = await db.collection('gifts_sort').get()
		// 商品数据
		const card = await db.collection('gifts').where({shelves:true}).limit(10).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
		Promise.all([sort,card])
		.then(res=>{
			result.sort = res[0].data
			result.card = res[1].data
		})
		.catch(err=>{
			console.log(err)
		})
	}
	
	// 上拉加载
	import {onReachBottom} from '@dcloudio/uni-app'
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{//onReachBottom只能在父组件才能触底
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		const res_goods = await db.collection('gifts').where({shelves:true}).limit(10).skip(sk).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
		result.card = [...result.card,...res_goods.data]
		loading.value = false
	})
	
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

.panel{
	width: calc(100% - 60rpx);
	margin: 0 auto;
	margin-top: 20rpx;
	font-size: 12px;
	font-weight: bold;
}

.instruct-view {
	display: flex;
	width: 100%;
	overflow-x: auto;
}

.instruct{
	margin-right: 30rpx;
}

.instruct{
	position: relative;
	padding-bottom: 16rpx;
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
</style>
