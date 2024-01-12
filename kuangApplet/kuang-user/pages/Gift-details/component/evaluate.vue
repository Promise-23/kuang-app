<template>
	<view class="evaluate-view" @click="juMp(eav_data)">
		<view class="evaluate-title">
			<view>评论 ({{eav_num}})</view>
			<view>
				<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
			</view>
		</view>
		<block v-if="eav_num > 0" v-for="(item,index) in eav_data" :key="index">
		<view class="evaluate-user">
			<view><image :src="item.avatarurl" mode="aspectFill"></image></view>
			<view>{{item.nickname}}</view>
		</view>
		<view class="evaluate-content">
			<text>{{item.eav_text}}</text>
			<view class="eva-image">
				<view v-for="(item_a,index_a) in item.eav_image" :key="index_a">
					<image :src="item_a.image" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		</block>
	</view>
</template>

<script setup>
	import {defineProps} from 'vue'
	defineProps({eav_num:Number,eav_data:Array})
	
	// 跳转详情页
	function juMp(eav_data){
		if(eav_data.length > 0){
			wx.navigateTo({
				url:'/pages/Eva-details/details?goods_id=' + eav_data[0].goods_id
			})
		}
	}
	
</script>

<style scoped>
.evaluate-view{
	background-color: #FFFFFF;
	padding: 20rpx;
}
.evaluate-title{
	/* padding-bottom: 20rpx; */
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	/* border-bottom: 1rpx solid #f7f7f7; */
}
.evaluate-title view:nth-child(2){
	width: 35rpx;
	height: 35rpx;
}
.evaluate-title image{
	width: 35rpx;
	height: 35rpx;
}
/* 分类 */
.evaluate-sort{
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding-top: 20rpx;
}
.evaluate-sort view{
	background-color: #fbf6e9;
	color: #56504b;
	padding: 10rpx;
	font-size: 27rpx;
	margin: 0 20rpx 20rpx 0;
	border-radius: 10rpx;
}
/* 头像昵称 */
.evaluate-user{
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	color: #787878;
}
.evaluate-user view:nth-child(1){
	width: 50rpx;
	height: 50rpx;
	margin-right: 10rpx;
}
.evaluate-user image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
}
/* 评论内容 */
.evaluate-content text{
	line-height: 1.5;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
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