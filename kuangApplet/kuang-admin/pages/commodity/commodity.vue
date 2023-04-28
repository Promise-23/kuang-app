<template>
	<view class="sort-view">
		<!-- 左边 -->
		<view class="sort-left">
			<text v-for="(item,index) in sort" :key="index"
			:class="{addto:index == num}"
			@click="seLect(index,item.sort_name,item._id)"
			>{{item.sort_name}}</text>
		</view>
		<!-- 右边 -->
		<view class="sort-right">
			<view class="Commodity" v-for="(item,index) in goods" :key="index">
				<view class="Com-image">
					<image :src="item.goods_cover" mode="aspectFill"></image>
				</view>
				<view class="Com-price">
					<text class="Com-title over-text">{{item.goods_title}}</text>
					<text class="stock-view">库存 {{item.stock}}</text>
					<text class="Real-price">¥{{item.goods_price}}</text>
					<view class="Button-rig">
						<text class="shelf-true" v-if="item.shelves" @click="shelf(item._id,index)">下架</text>
						<text class="shelf-false" v-else>已下架</text>
					</view>
				</view>
			</view>
		<!-- 加载提示 -->
		<view class="loading-hei">
			<Loading v-if="loading"></Loading>
		</view>
		<view style="height: 100rpx;"></view>
		</view>
	</view>
	<!-- 底部 -->
	<view class="manage">
		<text @click="rootSoRt">管理分类</text>
		<text @click="rootGoods">添加商品</text>
	</view>
</template>

<script setup>
	import {reactive,toRefs,ref} from 'vue'
	import {onShow,onReachBottom} from '@dcloudio/uni-app'
	import {inIt} from '@/Acc-config/init.js'
	import Loading from '@/pages/public-view/loading.vue'
	
	onShow(()=>{
		gooDs()
	})
	
	const data = reactive({
		sort:[],//分类数据
		goods:[],//商品数据
		num:0,
		sort_name:'',
		sort_id:''
	})
	const {sort,goods,num} = toRefs(data)

	// 请求数据库数据
	let field_obj = {goods_title:true,goods_cover:true,goods_price:true,stock:true,shelves:true}
	async function gooDs(){
		// 请求分类的数据
		let DB = await inIt()
		const _ = DB.database().command
		const res_sort = await DB.database().collection('goods_sort').where({quantity:_.gt(0)}).field({sort_name:true}).get()
		console.log(res_sort)
		// 请求商品数据
		const res_goods = await DB.database().collection('goods').where({category:res_sort.data[0].sort_name}).limit(10).field(field_obj).get()
		console.log(res_goods)
		data.sort = res_sort.data
		data.goods = res_goods.data
		data.sort_name = res_sort.data[0].sort_name
		data.sort_id = res_sort.data[0]._id
		data.num = 0
		page_n.value = 0
	}
	
	// 选中分类
	async function seLect(index,sort_name,id){
		data.num = index
		data.sort_name = sort_name
		data.sort_id = id
		let DB = await inIt()
		const res_goods = await DB.database().collection('goods').where({category:sort_name}).limit(10).field(field_obj).get()
		console.log(res_goods)
		data.goods = res_goods.data
	}
	
	// 下架
	import {Feedback} from '@/Acc-config/media.js'
	async function shelf(id,index){
		let DB = await inIt()
		try{
			await DB.database().collection('goods').doc(id).update({data:{shelves:false}})
			data.goods[index].shelves = false
			// 下架之后对该分类的数量自减
			const _ = DB.database().command
			await DB.database().collection('goods_sort').doc(data.sort_id).update({data:{quantity: _.inc(-1)}})
		}catch(e){
			new Feedback('下架失败','none').toast()
		}
		
		
	}
	
	// 上拉加载
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		let DB = await inIt()
		const res_goods = await DB.database().collection('goods').where({category:data.sort_name}).limit(10).skip(sk).field(field_obj).get()
		data.goods = [...data.goods,...res_goods.data]
		loading.value = false
	})
	
	// 跳转分类
	function rootSoRt(){
		wx.navigateTo({
			url:'/pages/sort-admin/sort'
		})
	}
	// 新增商品
	function rootGoods(){
		wx.navigateTo({
			url:'/pages/goods-admin/goods'
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
.addto{
	background-color: #FFFFFF;
	font-weight: bold;
}
/* 右边 */
.sort-right{
	margin: 0 20rpx 0 220rpx;
	flex: 1;
}
.Com-image image{
	display: block;
	width: 150rpx;
	height: 150rpx;
	border-radius: 10rpx;
}
.Commodity text{
	display: block;
}
.Commodity{
	display: flex;
	margin-bottom: 50rpx;
}
.Com-price{
	flex: 1;
	padding-left: 20rpx;
}
.Com-price view{
	display: flex;
	justify-content: flex-end;
}
.Com-price view text:nth-child(2){
	margin-left: 50rpx;
}
.Com-title{
	font-weight: bold;
}
.stock-view{
	padding: 10rpx 0;
	color: #c1c1c1;
	font-size: 26rpx;
}
.Real-price{
	color: #b1865b;
	font-weight: bold;
}
.Button-rig{
	padding-top: 20rpx;
}
.Button-rig text{
	border-radius: 7rpx;
	padding: 7rpx 20rpx;
	font-size: 26rpx;
}
.shelf-true{
	color: #FFFFFF;
	background-color: #E64340;
}
.shelf-false{
	background-color: #F8F8F8;
	color: rgba(0, 0, 0, 0.2);
}
/* 底部 */
.manage{
	position: fixed;
	bottom: 0;
	right: 0;
	left: 200rpx;
	display: flex;
	justify-content: space-between;
}
.manage text{
	width: 50%;
	text-align: center;
	padding: 20rpx 0;
}
.manage text:nth-child(1){
	background-color: antiquewhite;
}
.manage text:nth-child(2){
	background-color: aliceblue;
}
</style>