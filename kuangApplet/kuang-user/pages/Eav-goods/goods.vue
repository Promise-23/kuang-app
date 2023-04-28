<template>
	<textarea placeholder="请输入评价内容"
	:auto-focus='true'
	maxlength="200"
	cursor-spacing="50" 
	v-model="eav_text"
	/>
	
	<view class="goods-image">
		<view class="upload-Image" v-if="sto_image.length > 0" v-for="(item,index) in sto_image" :key="index">
			<image :src="item.image" mode="aspectFill" @click="preView(item.image)"></image>
			<image src="/static/detail/shanchu-goods.svg" mode="aspectFit" @click="deleteImg(index)"></image>
		</view>
		<view @click="upImage"><image src="/static/detail/shuxing-img.png" mode="aspectFill"></image></view>
	</view>
	<view class="newly-added-view back">
		<view class="newly-added" @click="subMit">提交</view>
	</view>
	
</template>

<script setup>
	import {onLoad,onReachBottom} from '@dcloudio/uni-app'
	import {ref,reactive,toRefs} from 'vue'
	import {Plublic} from '../../Acc-config/public.js'
	
	
	// 存储评价文本和图片
	const cover = reactive({eav_text:'',sto_image:[]})
	const {eav_text,sto_image} = toRefs(cover)
	
	// 上传图片
	async function upImage(){
		const local = await new Plublic().image(9)
		local.forEach(item=>{
			cover.sto_image.push({image:item.tempFilePath})
		})
	}
	
	// 预览图片
	function preView(image){
		let arr = []
		cover.sto_image.forEach(item=>{arr.push(item.image)})
		new Plublic().preview(image,arr)
	}
	
	// 删除图片
	function deleteImg(index){
		cover.sto_image.splice(index,1)
	}
	
	// 接收上个页面的数据
	const data = reactive({goods_id:'',goods_index:0,specs:[],image:[]})
	onLoad((event)=>{
		const res = JSON.parse(event.query)
		data.goods_id = res.goods_id
		data.goods_index = res.index
		data.specs = res.specs
	})
	
	// 提交
	import moment from 'moment'
	moment.locale('zh-cn');
	const db = wx.cloud.database()
	import {eav_index} from '../../Acc-config/answer.js'
	async function subMit(){
		if(cover.eav_text == ''){
			new Plublic().toast('请输入评价内容')
			return false
		}
		wx.showLoading({title:'提交中',mask:true})
		// 上传图片到云储存
		if(cover.sto_image.length > 0){
			let res = await new Plublic().multi(cover.sto_image,'image')
			data.image = res
		}
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		let time = moment().utcOffset(8).format('YYYY-MM-DD')
		let obj = {
			avatarurl:user.avatarUrl,
			nickname:user.nickName,
			eav_text:cover.eav_text,
			goods_id:data.goods_id,
			eav_image:data.image,
			time,
			specs:data.specs
		}
		try{
			await db.collection('goods_eva').add({data:obj})
			wx.hideLoading()
			eav_index.value = data.goods_index
			wx.navigateBack({delta:1})
		}catch(err){
			console.log(err)
			new Plublic().toast('提价失败')
		}
	}
	
	
	
	
	
	
	
	
	
	
</script>

<style>
page{
	background-color: #f2f2f2;
}
textarea{
	box-sizing: border-box;
	background-color: #FFFFFF;
	padding: 10rpx;
	width: 100%;
	height: 350rpx;
	line-height: 1.5;
	margin-bottom: 20rpx;
}
.goods-image{
	display: flex;
	flex-wrap: wrap;
}
.goods-image view{
	width: calc(33.3% - 5rpx*2);
	height: 200rpx;
	margin: 5rpx;
}
.goods-image image{
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 7rpx;
}
.upload-Image {
	position: relative;
}
.upload-Image image:nth-child(2){
	width: 30rpx !important;
	height: 30rpx !important;
	position: absolute;
	top: 0;
	right: 0;
}
.back{
	background-color: #f2f2f2 !important;
}
</style>