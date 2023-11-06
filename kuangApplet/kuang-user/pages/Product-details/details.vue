<template>
	<!-- 导航栏 -->
	<view class="search-back" :style="{opacity:styleOpacity}" v-show="being">
		<view :style=" 'height:' + S_top + 'px;' "></view>
		<view class="search-input" :style="['height:' + S_height + 'px;','padding-right:' + S_width + 'px;']">
			<view class="tab-jiantou" @click="goTo">
				<image src="/static/detail/video-fanhui.svg" mode="widthFix"></image>
			</view>
			<view class="tab-view" v-for="(item,index) in tab_name" :key="index"
			:style=" 'height:' + S_height + 'px;' "
			@click="swItch(index)"
			>
				<text>{{item}}</text>
				<text :class="{active : index == trigger}"></text>
			</view>
		</view>
	</view>
	<!-- 轮播 -->
	<Swipers v-if="goods" id="select" class="swiper" :goods="goods" :seckill="seckill"/>
	<!-- 评价 -->
	<Eva id="select" class="eva" :eav_num="eav_num" :eav_data="eav_data"/>
	<!-- 详情 -->
	<Img id="select" class="img" :goods_details="goods.goods_details"/>
	<!-- 底部操作 -->
	<Purchase :goods_id="goods_id" :collection="collection"
	:sku_data="sku_data" :goods="goods"
	></Purchase>
	<!-- 登陆弹窗 -->
	<Login />
	<!-- sku选择弹窗 -->
	<Specs :sku_data="sku_data" :goods="goods"/>
</template>

<script setup>
	import {reactive,toRefs,onMounted,ref,nextTick,watch,onBeforeUnmount} from 'vue'
	import Swipers from './component/swiper.vue'
	import Eva from './component/evaluate.vue'
	import Img from './component/image.vue'
	import Purchase from './component/purchase.vue'
	import Login from '../components/login-view.vue'
	import Specs from '../components/specs-view.vue'
	
	// 与顶部导航栏相关的
	const search_data = reactive({
		tab_name:['商品','评价','详情'],
		S_height:0,
		S_top:0,
		S_width:0,
		Custom_height:0,
		being:true,//显隐藏tab
		styleOpacity:0,//tab透明度
		trigger:0
	})
	const {tab_name,S_height,S_top,S_width,Custom_height,being,styleOpacity,trigger} = toRefs(search_data)
	onMounted(()=>{
		const but_data = wx.getMenuButtonBoundingClientRect()
		search_data.S_height = but_data.height + 5
		search_data.S_top = but_data.top
		search_data.S_width = but_data.width
		search_data.Custom_height = but_data.height + but_data.top + 5
	})
	
	// 获取轮播，评价，详情每个组件的高度
	let heightset = reactive({hei:[]})
	function viewheight(){
		const query = wx.createSelectorQuery()
		query.selectAll('#select').boundingClientRect()
		query.exec(res=>{
			heightset.hei.push(res[0][0].height - search_data.Custom_height)
			heightset.hei.push(heightset.hei[0] + res[0][1].height + 20)
			heightset.hei.push(heightset.hei[1] + res[0][2].height + 20)
		})
	}
	
	import {onLoad,onShareAppMessage,onPageScroll} from '@dcloudio/uni-app'
	// 滚动监听
	onPageScroll((e)=>{
		search_data.styleOpacity = e.scrollTop / 300
		search_data.being = e.scrollTop === 0 ? false : true
		let scrollTop = e.scrollTop
		if(scrollTop >= heightset.hei[search_data.trigger]){
			// 上拉
			search_data.trigger += 1
		}else if(scrollTop < heightset.hei[search_data.trigger - 1]){
			// 下拉
			search_data.trigger -= 1
		}
	})
	// 点击tab跳转指定组件
	function swItch(index){
		const cls = index == 0 ? '.swiper' : index == 1 ? '.eva' : '.img'
		const query = wx.createSelectorQuery()
		query.select(cls).boundingClientRect()
		query.selectViewport().scrollOffset()
		query.exec(res=>{
			wx.pageScrollTo({
			  scrollTop: res[0].top + res[1].scrollTop - search_data.Custom_height,
			  duration: 300
			})
			setTimeout(()=>{search_data.trigger = index},500)
		})
	}
	import {ORDER} from '../../Acc-config/place-order.js'
	onBeforeUnmount(()=>{
		ORDER.order.specs = []//清空之前缓存的数据
		ORDER.order.SPECE_STR = ''
	})
	
	// 请求数据，传值
	const db = wx.cloud.database()
	const result = reactive({
		goods_id:'',
		goods:[],
		collection:0,
		login_coll:0,
		sku_data:[],
		seckill:[],
		login_cart:0,
		eav_num:0,
		eav_data:[]
	})
	
	const {goods_id,goods,seckill,eav_num,eav_data,collection,sku_data} = toRefs(result)
	onLoad((event)=>{
		// console.log(event)
		result.goods_id = event.goods_id
		// 获取商品数据
		const goods = db.collection('goods').doc(event.goods_id).get()
		// 收藏的商品数据
		const collect = db.collection('collect_goods').where({goods_id:event.goods_id}).get()
		// sku的数据
		const sku_data_a = db.collection('sku_data').where({sku_id:event.goods_id}).field({sku:true}).get()
		// 秒杀数据
		const seckill = db.collection('seckill').where({goods_id:event.goods_id}).field({ori_price:true,price_spike:true,seckill_time:true}).get()
		// 购物车条数
		const nu_sh_cart = db.collection('sh_cart').count()
		// 评论总条数
		const eav_num = db.collection('goods_eva').where({goods_id:event.goods_id}).count()
		// 评价前三条数据
		const eav_data = db.collection('goods_eva').where({goods_id:event.goods_id}).limit(3).get()
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		Promise.all([goods,collect,sku_data_a,seckill,nu_sh_cart,eav_num,eav_data])
		.then(async res=>{
			await nextTick()
			console.log(res)
			result.goods = res[0].data//商品数据
			result.collection = user ? res[1].data?.length : 0//收藏
			result.login_coll = res[1].data?.length//登陆成功之后获取这里的收藏数据
			result.sku_data = res[2].data//sku
			result.seckill = res[3].data//秒杀
			ORDER.nu_sh_cart = user ? res[4].total : 0//购物车件数
			result.login_cart = res[4].total////登陆成功之后获取这里的购物车件数
			result.eav_num = res[5].total//评价总条数
			result.eav_data = res[6].data//前三条评论
			
			// 取到固定不变值
			ORDER.order.goods_id = res[0].data._id
			ORDER.order.goods_image = res[0].data.goods_cover
			ORDER.order.goods_title = res[0].data.goods_title
			// 没有秒杀，sku，取返回价格下单
			if(result.sku_data?.length === 0 && result.seckill?.length === 0){
				ORDER.order.goods_price = res[0].data.goods_price
			}
			setTimeout(()=>{viewheight()},900)
		})
		.catch(err=>{
			console.log(err)
		})
	})
	
	
	// 监听登陆是否成功，成功则重新取收藏和购物车的数据
	import {login_user} from '@/Acc-config/answer.js'
	watch(()=>login_user.response,(newVal,oldVal)=>{
		result.collection = result.login_coll
		ORDER.nu_sh_cart = result.login_cart
	})
	
	// 分享-转发给好友:最好在父组件
	onShareAppMessage(()=>{
		return{
			title:result.goods.goods_title,
			path:`/pages/Product-details/details?goods_id=${result.goods_id}`,
			imageUrl:result.goods.goods_cover
		}
	})
	// 返回上一页面
	function goTo(){
		// wx.navigateBack({
		// 	delta:1
		// })
		console.log('跳转首页')
		wx.switchTab({
			url:'/pages/index/index'
		})
	}
</script>

<style>
page{background-color: #f6f6f6;}
.search-back{
	background-color: #FFFFFF;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.search-input{
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.tab-jiantou{
	padding: 30rpx 20rpx;
	width: 50rpx;
	height: 50rpx;
}
.tab-jiantou image{
	width: 100%;
	height: 100%;
}
.tab-view{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.tab-view text:nth-child(2){
	width: 30rpx;
	height: 10rpx;
	border-radius: 10rpx;
	position: absolute;
	bottom: 0;
}
.active{
	background-color: #f67319;
}
</style>