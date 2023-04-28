<template>
	<view class="sort-Header sort-position" v-if="banner_data.length > 0">
		<text>横幅图片</text>
		<text>操作</text>
	</view>
	<view style="height: 90rpx;"></view>
	<view class="sort-Header sort-table" v-for="(item,index) in banner_data" :key="index">
		<image :src="item.banner_cover" mode="aspectFill"></image>
		<text class="sort-but" @click="deLete(item._id,index)">删除</text>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="banner_data.length === 0">你还没有横幅数据</view>
	<!-- 底部 -->
	<view style="300rpx"></view>
	<view class="newly-added-view">
		<view class="newly-added" @click="show = true">新增横幅</view>
	</view>
	<!-- 弹窗 -->
	<page-container :show="show" position="bottom" bindenter="onEnter">
		<view class="space-view">
			<view class="modify-sub modify-padding">
				<image src="/static/detail/guanbi.svg" mode="widthFix" @click="show = false"></image>
				<text>新增横幅</text>
				<text @click="subMit">提交</text>
			</view>
			<view class="upload-cover">
				<image src="/static/detail/miaosha-img.jpg" mode="aspectFill" v-if="banner_cover == ''" @click="upImage"></image>
				<image :src="banner_cover" mode="aspectFill"></image>
				<image src="../../static/detail/shanchu-goods.svg" mode="widthFix" v-if="banner_cover != ''" @click="banner_cover = ''"></image>
			</view>
			<view class="relation relation-back" @click="addTo">
				<text>关联商品</text>
				<text class="over-text">{{re_goods.title == '' ? '添加' : re_goods.title}}</text>
			</view>
		</view>
	</page-container>
</template>

<script setup>
	import {ref,onMounted,reactive,toRefs,watch} from 'vue'
	import {inIt} from '@/Acc-config/init.js'
	function onEnter(){}
	const show = ref(false)
	
	onMounted(()=>{
		getBanner()
	})
	
	const data = reactive({
		banner_data:[],
		banner_cover : '',
		re_goods:{
			title:'',
			goods_id:'',
			video_url:''
		}
	})
	const {banner_data,banner_cover,re_goods} = toRefs(data)
	// 获取数据
	async function getBanner(){
		let DB = await inIt()
		let res = await DB.database().collection('banner').get()
		data.banner_data = res.data
	}
	
	// 上传轮播图
	import {Feedback,Upload} from '@/Acc-config/media.js'
	async function upImage(){
		const local = await new Upload().image()
		wx.showLoading({title: '正在上传',mask:true})
		const res = await new Upload().cloud(local[0].tempFilePath)
		data.banner_cover = res
		wx.hideLoading()
	}
	
	// 去选择关联商品
	function addTo(){
		const rel_id = data.banner_data.map(item=>item.goods_id)
		const str_id = JSON.stringify(rel_id)
		wx.navigateTo({
			url:'/pages/goods-list/list?ref_id=' + str_id
		})
	}
	
	// 监听关联的商品
	import {select_goods} from '@/Acc-config/answer.js'
	watch(select_goods,(newVal,oldVal)=>{
		data.re_goods.title = newVal.goods_title
		data.re_goods.goods_id = newVal.goods_id
		data.re_goods.video_url = newVal.video_url
	})
	
	// 提交
	function subMit(){
		switch(true){
			case data.banner_cover == '' : new Feedback('请上传封面图').toast()
			break;
			case data.re_goods.title == '' : new Feedback('请关联一个商品').toast()
			break;
			default:database()
		}
	}
	
	// 提交数据库
	async function database(){
		wx.showLoading({title: '正在提交',mask:true})
		let obj = {banner_cover:data.banner_cover,goods_id:data.re_goods.goods_id,video_url:data.re_goods.video_url}
		try{
			let DB = await inIt()
			await DB.database().collection('banner').add({data:obj})
			show.value = false
			data.banner_cover = '';
			data.re_goods.title = ''
			wx.hideLoading()
			getBanner()
		}catch(e){
			new Feedback('提交失败').toast()
		}
	}
	
	// 删除
	async function deLete(id,index){
		try{
			let DB = await inIt()
			await DB.database().collection('banner').doc(id).remove()
			data.banner_data.splice(index,1)
			new Feedback('删除成功','success').toast()
		}catch(e){
			new Feedback('删除失败').toast()
		}
	}
	
	
	
</script>

<style scoped>
.modify-padding{
	padding-bottom: 60rpx !important;
}
.upload-cover{
	position: relative;
}
.upload-cover image:nth-child(1){
	width: 100%;
	height: 380rpx;
	display: block;
}
.upload-cover image:nth-child(2){
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	top: 6rpx;
	right: 6rpx;
}
.relation-back{
	background-color: #f7f7f7 !important;
	color: #000000 !important;
}
.over-text{
	color: #ed6b51 !important;
}
</style>