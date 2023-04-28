<template>
	<page-container :show="comment_show.show" position="bottom" bindenter="onEnter">
		<view class="space-view">
			<view class="chacha" @click="comment_show.show = false">
				<image src="/static/detail/guanbi.svg" mode="aspectFit"></image>
			</view>
			<scroll-view :scroll-y="true" :show-scrollbar="false" class="scroll-hi" :enhanced='true' @scrolltolower="tolower">
				<block v-for="(item,index) in comment" :key="index">
					<view class="messages-views">
						<view class="messages-name">
							<image :src="item.avatarurl" mode="aspectFill"></image>
							<view class="nickname">{{item.nickname}}</view>
							<view class="times">{{item.time}}</view>
						</view>
						<view class="messages-title">{{item.content}}</view>
					</view>
				</block>
				<!-- 没有评论的提示 -->
				<view class="Tips" v-if="comment.length == 0">暂无评论</view>
				<!-- 上拉加载的提示 -->
				<view class="loading-hei">
					<Loading v-show="loading"></Loading>
				</view>
				<view style="height: 300rpx;"></view>
			</scroll-view>
			<!-- 评论框 -->
			<view class="Comment-box">
				<view class="Comment-box-input">
					<input type="text" placeholder="留下你的评论"
						confirm-type="send"
						cursor-spacing="50"
						v-model="content"
					/>
				</view>
				<view class="send-out" @click="sEnd">发送</view>
			</view>
		</view>
	</page-container>
</template>

<script setup>
	function onEnter(){}
	import {comment_show} from '../../../Acc-config/answer.js'
	import Loading from '@/pages/public-view/loading.vue'
	import {watch,reactive,toRefs,ref} from 'vue'
	import moment from 'moment'
	moment.locale('zh-cn');
	const db = wx.cloud.database()
	
	// 监听父组件传值拉起评论框，请求数据
	watch(comment_show,(newVal,oldVal)=>{
		if(newVal.show && comment_show.num == 2){
			relation.goods_id = comment_show.goods_id
			called(comment_show.goods_id)
		}
	})
	
	// 请求评论数据
	async function called(goods_id,sk=0){
		const comment = await db.collection('video_comment').where({goods_id}).field({_openid:false}).limit(10).skip(sk).get()
		if(sk == 0){
			comm_data.comment = comment.data
		}else{
			comm_data.comment = [...comm_data.comment,...comment.data]
			loading.value = false
		}
	}
	
	// 评论数据
	const comm_data = reactive({
		content:'',//input输入框的值
		comment:[],//接收评论数据
	})
	const {content,comment} = toRefs(comm_data)
	
	// 提交评论
	const relation = reactive({goods_id:''})//商品id
	import {login_user} from '@/Acc-config/answer.js'
	import {Plublic} from '../../../Acc-config/public.js'
	async function sEnd(){
		if(comm_data.content.split(" ").join("").length == 0){return false}
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(!user){login_user.show = true;return false}
		let time = moment().utcOffset(8).format('YYYY-MM-DD')
		const obj = {
			avatarurl:user.avatarUrl,
			nickname:user.nickName,
			time,
			content:comm_data.content,
			goods_id:relation.goods_id,
		}
		try{
			await db.collection('video_comment').add({data:obj})
			comm_data.content = ''
			comm_data.comment.unshift(obj)
		}catch(e){
			new Plublic().toast('评论失败')
		}
	}
	
	// 上拉加载
	const loading = ref(false)
	let page_n = ref(0)
	function tolower(e){
		if(comm_data.comment.length < 10)return false
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		called(relation.goods_id,sk)
	}
	
	
	
	
	
</script>

<style scoped>
.chacha{
	height: 30rpx;
	display: flex;
	justify-content: flex-end;
}
.chacha image{width: 30rpx; height: 30rpx;}
.scroll-hi{height: 1000rpx;}
/* 评论内容 */
.messages-views{
	margin: 20rpx 0;
}
.messages-name image{
	width: 60rpx; height: 60rpx;
	border-radius: 50%;
}
.messages-name{
	display: flex;
	align-items: center;
	height: 60rpx;
}
.nickname{
	flex: 1;
	color: #8a8b90;
	font-size: 30rpx;
	padding-left: 15rpx;
}
.times{
	color: #b0afb4;
	font-size: 25rpx;
}
.messages-title{
	font-size: 30rpx;
	padding-left: 75rpx;
	line-height: 1.4;
	margin: 20rpx 0;
}
/* 固定底部的评论框 */
.Comment-box{
	background-color: #f7f7f7;
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	padding: 10rpx;
	display: flex;
	align-items: center;
	font-size: 27rpx;
	z-index: 99;
	padding-bottom: 68rpx;
}
.Comment-box-input{
	background-color: #FFFFFF;
	border-radius: 10rpx;
	height: 80rpx;
	flex: 1;
}
.Comment-box-input input{
	padding: 0 15rpx;
	height: 80rpx;
}
.send-out{
	background-color: #07c160;
	color: #FFFFFF;
	height: 80rpx;
	line-height: 80rpx;
	width: 150rpx;
	text-align: center;
	border-radius: 10rpx;
	margin-left: 10rpx;
}
.detail-page button{
	margin: 70rpx;
	width: 400rpx;
}
.detail-page{
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>