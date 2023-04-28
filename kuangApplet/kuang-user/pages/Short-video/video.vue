<template>
	<view class="video-return">
		<view :style=" 'height:' + S_top + 'px;' "></view>
		<view :style=" 'height:' + S_height + 'px;' " class="video-return-img">
			<view><image src="/static/detail/video-fanhui.svg" mode="aspectFit" @click="getInfo"></image></view>
		</view>
	</view>
	<view :style=" 'height:' + winheight + 'px;' " class="trim-video">
		<!-- 短视频 -->
		<video
		id="myVideo"
		:style=" 'height:' + winheight + 'px;' "
		:src="video_data.video_url"
		:controls='false'
		:loop='true'
		:show-center-play-btn="false"
		:autoplay="true"
		object-fit="cover"
		picture-in-picture-mode="{{['push', 'pop']}}"
		bindenterpictureinpicture="bindenter"
		@play="playFun"
		@pause="pauseFun"
		></video>
		<view class="all-round" @click="allRound"></view>
		<!-- 自定义播放按钮 -->
		<view class="video-img" @click="videoPlay" v-show="startVideo">
			<image src="/static/detail/video-bofang.svg" mode="aspectFit"></image>
		</view>
		<!-- 底部的操作按钮 -->
		<view class="advert-left">
			<view class="goods-det" @click="deTail">
				<image :src="video_data.goods_cover" mode="aspectFill"></image>
				<view class="goods-price">
					<text>￥{{video_data.goods_price}}</text>
					<text>抢</text>
				</view>
			</view>
			<view class="goods-title overflow">{{video_data.goods_title}}</view>
		</view>
		<!-- 右边的评论等等 -->
		<view class="user-right">
			<view class="give-thethu" @click="pull">
				<view><image src='/static/detail/video-pinglun.svg' mode="aspectFit"></image></view>
				<view>{{total === 0 ? '评论' : total}}</view>
			</view>
			<view class="give-thethu comment">
				<view v-if="collection <= 0" @click="toCollect"><image src="/static/detail/video-shoucang.svg" mode="aspectFit"></image></view>
				<view v-else @click="canCollect"><image src="/static/detail/video-yishoucang.svg" mode="aspectFit"></image></view>
				<view>{{collection > 0 ? '已收藏' : '收藏'}}</view>
			</view>
			<view class="give-thethu">
				<button open-type="share" :plain='true'>
					<view><image src="/static/detail/video-fenxiang.svg" mode="aspectFit"></image></view>
					<view>分享</view>
				</button>
			</view>
		</view>
	</view>
	<!-- 评论组件 -->
	<Comment />
	<!-- 登陆界面 -->
	<Login />
</template>

<script setup>
	import {onMounted,reactive,toRefs,watch,onBeforeUnmount} from 'vue'
	import Comment from './component/comment.vue'
	import Login from '../components/login-view.vue'
	
	function bindenter(){}
	
	const search_data = reactive({
		S_height:0,
		S_top:0,
		winheight:0,
		videoplay:{},
		startVideo:true
	})
	const {S_height,S_top,winheight,startVideo} = toRefs(search_data)
	onMounted(()=>{
		const but_data = wx.getMenuButtonBoundingClientRect()
		search_data.S_height = but_data.height
		search_data.S_top = but_data.top
		// 获取屏幕宽高
		search_data.winheight = wx.getSystemInfoSync().screenHeight
		// 获取视频的上下文
		search_data.videoplay = wx.createVideoContext('myVideo')
	})
	
	// 继续播放触发
	function playFun(){
		search_data.startVideo = false
	}
	// 暂停播放触发
	function pauseFun(){
		search_data.startVideo = true
	}
	
	// 触发播放
	function videoPlay(){
		search_data.videoplay.play()
	}
	// 暂停播放或者继续播放
	function allRound(){
		search_data.startVideo = search_data.startVideo ? false : true
		if(search_data.startVideo){
			// 暂停播放
			search_data.videoplay.pause()
		}else{
			// 继续播放
			search_data.videoplay.play()
		}
	}
	
	import {onLoad,onShareAppMessage} from '@dcloudio/uni-app'
	const db = wx.cloud.database()
	// 请求短视频的数据
	const result = reactive({goods_id:'',video_data:{},total:0,collection:0,
	succ_login:0
	})
	const {video_data,total,collection} = toRefs(result)
	onLoad(async(event)=>{
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		result.goods_id = event.goods_id
		const card = await db.collection('goods').doc(event.goods_id).field({video_url:true,goods_cover:true,goods_title:true,goods_price:true,seckill:true}).get()
		// 获取评论条数
		const count = await db.collection('video_comment').where({goods_id:event.goods_id}).count()
		const collect = await db.collection('collect_goods').where({goods_id:event.goods_id}).get()
		Promise.all([card,count,collect])
		.then(async res=>{
			result.video_data = res[0].data//短视频数据
			result.total = res[1].total//评论的条数
			result.collection = user ? res[2].data.length : 0//收藏的数据
			result.succ_login = res[2].data.length//如果登陆成功就取这里的收藏数据
			// 该商品是否参与秒杀，如果有，就展示秒杀的价格
			if(res[0].data.seckill){
				const seckill = await db.collection('seckill').where({goods_id:event.goods_id}).field({price_spike:true}).get()
				result.video_data.goods_price = seckill.data[0].price_spike
			}
		})
		.catch(err=>{
			console.log(err)
		})
	})
	
	import {login_user} from '../../Acc-config/answer.js'
	import {Plublic} from '../../Acc-config/public.js'
	// 收藏
	async function toCollect(){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(!user){login_user.show = true;return false}
		try{
			await db.collection('collect_goods').add({data:{goods_id:result.goods_id}})
			result.collection++
		}catch(e){
			new Plublic().toast('收藏失败')
		}
	}
	// 取消收藏
	async function canCollect(){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(!user){login_user.show = true;return false}
		try{
			await db.collection('collect_goods').where({goods_id:result.goods_id}).remove()
			result.collection = 0
		}catch(e){
			new Plublic().toast('取消收藏失败')
		}
		
	}
	
	// 监听用户登陆成功
	watch(()=>login_user.response,(newVal,oldVal)=>{
		result.collection = result.succ_login
	})
	
	// 拉出评论框
	import {comment_show} from '../../Acc-config/answer.js'
	// 卸载页面
	onBeforeUnmount(()=>{
		comment_show.num = 1
	})
	function pull(){
		comment_show.show = true
		comment_show.num++
		comment_show.goods_id = result.goods_id
	}
	
	// 分享-转发给好友
	onShareAppMessage(()=>{
		return{
			title:result.video_data.goods_title,
			path:`/pages/Short-video/video?goods_id=${result.goods_id}`,
			imageUrl:result.video_data.goods_cover
		}
	})
	
	// 返回上一页
	function getInfo(){
		search_data.videoplay.play()
		wx.navigateBack({
			delta:1
		})
	}
	
	function deTail(){
		wx.navigateTo({
			url:`/pages/Product-details/details?goods_id=${result.goods_id}`
		})
	}
	
</script>

<style scoped>
.video-return{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.video-return-img view{
	width: 50rpx;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
}
.video-return-img image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
/* 视频 */
.trim-video{
	width: 100%;
	position: relative;
	overflow: hidden;
}
.trim-video video{
	width: 100%;
}
/* 透明覆盖 */
.all-round{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.01);
}
/* 自定义按钮 */
.video-img image{
	width: 110rpx;
	height: 110rpx;
	z-index: 999;
	/* border: 2px solid #FFFFFF;
	border-radius: 50%; */
}
.video-img{
	width: 110rpx;
	height: 110rpx;
	position: absolute;
	bottom: 0;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
}
/* 详情页和标题 */
.advert-left{
	position: absolute;
	left: 20rpx;
	bottom: 85rpx;
}
.goods-det{
	/* height: 170rpx; */
	width: 300rpx;
	background-color: red;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
}
.goods-det image{
	height: 120rpx;
	width: 300rpx;
	display: block;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
}
.goods-price text{display: block;}
.goods-price{
	display: flex;
	/* align-items: center; */
	justify-content: space-between;
	padding: 9rpx 10rpx;
	font-size: 27rpx;
	color: #FFFFFF;
	font-weight: bold;
}
.goods-title{
	width: 500rpx;
	line-height: 1.5;
	font-size: 30rpx;
	color: #FFFFFF;
}
/* 右边用户操作 */
.user-right{
	position: absolute;
	right: 20rpx;
	bottom: 85rpx;
	width: 100rpx;
	font-size: 25rpx;
	color: #FFFFFF;
}
.user-right image{
	width: 55rpx;
	height: 55rpx !important;
}
.give-thethu{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.give-thethu button{
	border: navajowhite;
	padding: inherit !important;
	margin: 0 !important;
	font-size: 25rpx !important;
	line-height: inherit !important;
	color: #FFFFFF !important;
}
.comment{margin: 60rpx 0;}
</style>