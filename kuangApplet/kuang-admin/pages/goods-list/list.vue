<template>
	<view class="select-goods" v-for="(item,index) in data.list" :key='index'
	@click="seLect(item.goods_title,item._id,item.goods_price,item.video_url,item.relation)"
	>
		<view>
			<image :src="item.goods_cover" mode="aspectFill"></image>
		</view>
		<view>
			<text class="over-text line-clamp" :style="{color:(item.relation ? '#f2f2f2' : '')}">{{item.goods_title}}</text>
			<text :style="{color:(item.relation ? '#f2f2f2' : '')}">¥{{item.goods_price}}</text>
		</view>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="data.list.length === 0">你还没有商品数据</view>
	<!-- 上拉加载的提示 -->
	<view class="loading-hei">
		<Loading v-if="loading"></Loading>
	</view>
</template>

<script setup>
	import {onMounted,reactive,ref,watch} from 'vue'
	import {inIt} from '@/Acc-config/init.js'
	import Loading from '@/pages/public-view/loading.vue'
	import {Feedback} from '@/Acc-config/media.js'
	
	onMounted(()=>{
		goods()
	})
	const data = reactive({list:[]})
	let obj = {goods_title:true,goods_cover:true,goods_price:true,video_url:true,seckill:true}
	async function goods(){
		let DB = await inIt()
		const res = await DB.database().collection('goods').where({shelves:true}).limit(10).field(obj).get()
		data.list = res.data
	}
	// 上拉加载
	import {onReachBottom,onLoad} from '@dcloudio/uni-app'
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		let DB = await inIt()
		const res_goods = await DB.database().collection('goods').where({shelves:true}).limit(10).skip(sk).field(obj).get()
		data.list = [...data.list,...res_goods.data]
		loading.value = false
	})
	
	// 选中关联商品
	import {select_goods} from '@/Acc-config/answer.js'
	function seLect(goods_title,goods_id,goods_price,video_url,relation){
		if(relation){
			new Feedback('该商品已被关联','none').toast()
		}else{
			select_goods.value = {goods_title,goods_id,goods_price,video_url}
			wx.navigateBack({delta:1})
		}
	}
	
	// 接收上个页面传来的值
	const rel_data = reactive({data:[]})
	onLoad((event)=>{
		rel_data.data = JSON.parse(event.ref_id)
	})
	watch(()=>data.list,(newVal,oldVla)=>{
		for(let i = 0; i < rel_data.data.length; i++){
			let index = newVal.findIndex(item=>item._id == rel_data.data[i])
			if(index >= 0){
				data.list[index]['relation'] = true
			}
		}
	})
	
	
	
	
	
	
	
	
</script>

<style scoped>
.select-goods{
	display: flex;
	height: 200rpx;
	margin: 20rpx;
}
.select-goods image{
	width: 200rpx;
	height: 200rpx;
	display: block;
	border-radius: 10rpx;
}
.select-goods view:nth-child(2){
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-weight: bold;
	padding: 10rpx 0 10rpx 15rpx;
}
.select-goods view text:nth-child(2){
	color: #1AAD19;
	font-size: 35rpx;
}
.line-clamp{
	-webkit-line-clamp: 2 !important;
}
</style>