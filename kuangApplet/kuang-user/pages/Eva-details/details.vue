<template>
	<view class="eva-content" v-for="(item,index) in eva_data" :key="index">
		<view class="eva-name">
			<view>
				<image :src="item.avatarurl" mode="aspectFill"></image>
			</view>
			<view class="eva-com">
				<text>{{item.nickname}}</text>
				<text v-if="item.specs.length > 0" v-for="(item_a,index_a) in item.specs" :key="index_a">{{item_a.att_val}}</text>
			</view>
			<view class="eva-time">{{item.time}}</view>
		</view>

		<!-- 评价内容 -->
		<view class="eva-text">{{item.eav_text}}</view>
		<view class="eva-image" v-if="item.eav_image.length > 0">
			<view v-for="(item_a,index_a) in item.eav_image" :key="index_a">
				<image :src="item_a.image" mode="aspectFill"></image>
			</view>
		</view>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="eva_data.length == 0">该商品还没有评价</view>
	<!-- 上拉加载的提示 -->
	<view class="loading-hei">
		<Loading v-if="loading"></Loading>
	</view>
</template>

<script setup>
	import {onLoad,onReachBottom} from '@dcloudio/uni-app'
	import {ref,reactive,toRefs} from 'vue'
	import Loading from '@/pages/public-view/loading.vue'
	const db = wx.cloud.database()
	
	let _id = ref('68426679627806c7015548f1732ab115')
	onLoad((event)=>{
		_id.value = event.goods_id
		getEva()
	})
	
	const data = reactive({eva_data:[]})
	const {eva_data} = toRefs(data)
	async function getEva(sk=0){
		const res = await db.collection('goods_eva').where({goods_id:_id.value}).limit(10).skip(sk).get()
		console.log(res)
		data.eva_data = [...data.eva_data,...res.data]
	}
	
	// 上拉加载
	let loading = ref(false)
	let page_n = ref(0)
	onReachBottom(async()=>{//onReachBottom只能在父组件才能触底
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		await getEva(sk)
		loading.value = false
	})
	
	
	
	
</script>

<style scoped>
.itemize view{
	background-color: #fdf4f6;
	padding: 13rpx 0;
	text-align: center;
	font-size: 26rpx;
	width: calc(33.3% - 10rpx*2);
	margin: 10rpx;
	border-radius: 10rpx;
}
.itemize{
	display: flex;
	flex-wrap: wrap;
	margin: 10rpx;
	padding-bottom: 20rpx;
	border-bottom: 1px solid #e3e3e4;
}
/* 用户评价 */
.eva-content{
	margin: 40rpx 20rpx;
}
.eva-name{
	display: flex;
	align-items: center;
	height: 80rpx;
}
.eva-name image{
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
}
.eva-name text{
	display: block;
}
.eva-com{
	flex: 1;
	padding: 0 10rpx;
	height: 70rpx;
}
.eva-com text:nth-child(2){
	font-size: 26rpx;
	color: #8a8b90;
}
.eva-time{
	align-self: flex-start;
	color: #8a8b90;
	font-size: 26rpx;
}
/* 评论内容 */
.eva-text{
	line-height: 1.3;
	margin: 20rpx 0;
}
.eva-image{
	display: flex;
	flex-wrap: wrap;
}
.eva-image image{
	width: 100%;
	height: 200rpx;
	border-radius: 5rpx;
	display: block;
}
.eva-image view{
	width: calc(33.3% - 5rpx*2);
	margin: 5rpx;
}
</style>