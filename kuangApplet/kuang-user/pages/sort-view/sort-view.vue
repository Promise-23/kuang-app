<template>
	<view class="sort-view">
		<!-- 左边 -->
		<view class="sort-left">
			<text v-for="(item,index) in sort_list" :key="index"
			@click="seLect(index,item.sort_name)"
			:class="[select == index ? 'Select-style' : '']"
			>{{item.sort_name}}</text>
		</view>
		<!-- 右边 -->
		<view class="sort-right">
			<view class="Title" v-if="sort_list.length > 0">{{sort_list[select]?.sort_name}}</view>
			<view class="Commodity" v-for="(item,index) in sotr_goods" :key="index" @click="juMp(item._id)">
				<view class="Com-image">
					<image :src="item.goods_cover" mode="aspectFill"></image>
				</view>
				<view class="Com-price">
					<text class="overflow">{{item.goods_title}}</text>
					<text>¥{{item.goods_price}}</text>
				</view>
			</view>
			<!-- 上拉加载 -->
			<view class="loading-hei">
				<Loading v-if="loading"></Loading>
			</view>
		</view>
	</view>
</template>

<script setup>
	import Loading from '../public-view/loading.vue'
	import {ref,onMounted,reactive,toRefs} from 'vue'
	const db = wx.cloud.database()
	const _ = db.command
	
	onMounted(()=>{
		getSort()
	})
	
	const data = reactive({sort_list:[],sotr_goods:[]})
	const {sort_list,sotr_goods} = toRefs(data)
	let OBJ = {goods_cover:true,goods_price:true,goods_title:true}
	async function getSort(){
		const res_sort = await db.collection('goods_sort').where({quantity:_.gt(0)}).get()
		const res_goods= await db.collection('goods').where({category:res_sort.data[0]?.sort_name}).field(OBJ).limit(10).get()
		data.sort_list = res_sort.data
		data.sotr_goods = res_goods.data
	}
	
	const select = ref(0)
	// 切换
	async function seLect(index,sort_name){
		page_n.value = 0
		select.value = index
		const res_goods= await db.collection('goods').where({category:sort_name}).field(OBJ).limit(10).get()
		data.sotr_goods = res_goods.data
	}
	
	// 上拉加载
	import {onReachBottom} from '@dcloudio/uni-app'
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{//onReachBottom只能在父组件才能触底
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		const res_goods = await db.collection('goods').where({category:data.sort_list[select.value]?.sort_name}).field(OBJ).limit(10).skip(sk).get()
		data.sotr_goods = [...data.sotr_goods,...res_goods.data]
		loading.value = false
	})
	
	// 跳转详情页
	function juMp(_id){
		wx.navigateTo({
			url:`/pages/Product-details/details?goods_id=${_id}`
		})
	}
	
	
	
	
	
	
</script>

<style scoped>
.sort-view{
	display: flex;
}
.sort-left{
	width: 200rpx;
	text-align: center;
	background-color: #f6f6f6;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
}

.sort-left text{
	display: block;
	color: #5f5f5f;
	padding: 20rpx 0;
	border-bottom: 1px solid #FFFFFF;
	font-size: 28rpx;
}
/* 左边选中*/
.Select-style{
	background-color: #FFFFFF !important;
}
/* 右边 */
.sort-right{
	margin: 0 20rpx 0 220rpx;
	flex: 1;
}
.Title{
	padding: 20rpx 0;
	font-size: 28rpx;
	font-weight: bold;
}
.Commodity{
	display: flex;
	height: 150rpx;
	margin-bottom: 20rpx;
}
.Com-image{
	width: 150rpx;
	height: 150rpx;
}
.Commodity image{
	width: 150rpx;
	height: 150rpx;
	border-radius: 10rpx;
}
.Com-price{
	flex: 1;
	position: relative;
	padding-left: 20rpx;
	font-weight: bold;
}
.Com-price text:nth-child(2){
	position: absolute;
	bottom: 0;
	color: #f36825;
}
</style>