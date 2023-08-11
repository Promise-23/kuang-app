<template>
	<!-- 搜索框 -->
	<view class="search-back" :style=" 'height:' + Custom_height + 'px;' ">
		<view :style=" 'height:' + S_top + 'px;' "></view>
		<view class="search-input" :style="['height:' + S_height + 'px;', 'width:' + S_left + 'px;' ]">
			<image src="/static/sousuo.png" mode="widthFix"></image>
			<input @focus="inputHandler" type="text" :style=" 'height:' + S_height + 'px;' " placeholder="请输入搜索的商品">
		</view>
	</view>
	<view :style=" 'height:' + Custom_height + 'px;' "></view>
	<!-- 轮播--横幅 -->
	<Swiper style="height: 740rpx;" :banner="banner" />
	<!-- 秒杀 -->
	<Flash :seckill="seckill"/>
	<!-- 商品列表 -->
	<Card :card="card"/>
	<!-- 上拉加载的提示 -->
	<view class="loading-hei">
		<Loading v-if="loading"></Loading>
	</view>
</template>

<script setup>
	import {onMounted,reactive,toRefs,ref} from 'vue'
	import Swiper from './component/swiper.vue'
	import Flash from './component/flash-sale.vue'
	import Card from '../Common-component/Card-goods.vue'
	import Loading from '../public-view/loading.vue'
	const db = wx.cloud.database()
	
	
	// 获取胶囊按钮的坐标数据
	const search_data = reactive({
		S_height:0,
		S_top:0,
		S_left:0,
		Custom_height:0
	})
	const {S_height,S_top,S_left,Custom_height} = toRefs(search_data)
	onMounted(()=>{
		const but_data = wx.getMenuButtonBoundingClientRect()
		search_data.S_height = but_data.height
		search_data.S_top = but_data.top
		search_data.S_left = but_data.left - 30
		search_data.Custom_height = but_data.height + but_data.top + 5
		goods()
	})
	
	// 请求数据
	const result = reactive({banner:[],seckill:[],card:[]})
	const {banner,seckill,card} = toRefs(result)
	async function goods(){
		// 轮播
		const banner = await db.collection('banner').get()
		// 秒杀
		const seckill = await db.collection('seckill').field({seckill_time:false}).get()
		// 商品数据
		const card = await db.collection('goods').where({shelves:true}).limit(10).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
		Promise.all([banner,seckill,card])
		.then(res=>{
			result.banner = res[0].data
			result.seckill = res[1].data
			result.card = res[2].data
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
		const res_goods = await db.collection('goods').where({shelves:true}).limit(10).skip(sk).field({goods_cover:true,goods_price:true,goods_title:true,sold:true,video_url:true}).orderBy('sold','desc').get()
		result.card = [...result.card,...res_goods.data]
		loading.value = false
	})
	
	function inputHandler(e){
		wx.navigateTo({
			url:'/pages/Search-view/search?query=' + e.detail.value
		})
	}
	
	
	
</script>

<style>
page{background-color: #f4f4f4;}
/* 首页自定义搜索框 */
.search-back{
	/* background-color: #4CD964; */
	background-color: #a0c179;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.search-input{
	background: #FFFFFF;
	border-radius: 50upx;
	margin-left: 20rpx;
	display: flex;
	flex-direction: row;
	flex: 1;
	position: relative;
}
.search-input input{
	width: 100%;
	font-size: 30upx;
	color: #b2b2b2;
	padding-left: 80upx;
}
.search-input image{
	width: 35upx;
	height: 35upx;
	position: absolute;
	left: 30upx;
	align-self: center;
}
</style>
