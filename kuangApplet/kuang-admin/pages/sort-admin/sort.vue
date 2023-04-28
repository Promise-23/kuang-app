<template>
	<view class="sort-Header sort-position" v-if="sort.length > 0">
		<text>分类</text>
		<text>操作</text>
	</view>
	<view style="height: 90rpx;"></view>
	<view class="sort-Header sort-table" v-for="(item,index) in sort" :key="index">
		<text class="occupy">{{item.sort_name}}</text>
		<text class="sort-but" @click="deLete(item._id,index,item.quantity)">删除</text>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="sort.length === 0">你还没有分类数据</view>
	<!-- 弹窗 -->
	<page-container :show="show" position="bottom" bindenter="onEnter" bindclickoverlay="clickoverlay">
		<view class="space-view">
			<view class="modify-sub">
				<image src="/static/detail/guanbi.svg" mode="widthFix" @click="show = false"></image>
			</view>
			<view class="att-input">
				<input type="text" v-model="sort_name" placeholder="输入分类" placeholder-class="I-style" cursor-spacing="50"/>
			</view>
			<view class="newly-added classif" @click="subMit">提交</view>
		</view>
	</page-container>
	<!-- 加载提示 -->
	<view class="loading-hei">
		<Loading v-if="loading"></Loading>
	</view>
	<!-- 底部新增分类按钮 -->
	<view style="height: 300rpx;"></view>
	<view class="newly-added-view">
		<view class="newly-added" @click="show = true">新增分类</view>
	</view>
</template>

<script setup>
	function onEnter(e){
		console.log(e)
	}
	// uniapp目前还不支持该组件，所以该事件还不会触发，
	function clickoverlay(e){
		console.log(e)
	}
	
	import {ref,onMounted,reactive,toRefs} from 'vue'
	import {onReachBottom} from '@dcloudio/uni-app'
	import {inIt} from '@/Acc-config/init.js'
	import Loading from '@/pages/public-view/loading.vue'
	
	// 控制弹窗弹出
	const show = ref(false)
	const data = reactive({sort:[],sort_name:''})
	const {sort,sort_name} = toRefs(data)
	
	onMounted(()=>{
		getsort()
	})
	// 请求数据库
	async function getsort(){
		let DB = await inIt()
		const res = await DB.database().collection('goods_sort').limit(10).field({_openid:false}).get()
		console.log(res)
		data.sort = res.data
		// const res = await DB.database().collection('men').add({data: {m: '111'}})
		// console.log(res)
	}
	// 提交数据
	import {Feedback} from '@/Acc-config/media.js'
	async function subMit(){
		if(data.sort_name == ''){
			new Feedback('请输入分类','none').toast()
			return false
		}
		let DB = await inIt()
		// 查询数据库是否存在相同的分类
		const query_data = await DB.database().collection('goods_sort').where({sort_name:data.sort_name}).get()
		if(query_data.data.length > 0){
			new Feedback('该分类已经存在','none').toast()
		}else{
			let res = await DB.database().collection('goods_sort').add({data:{sort_name:data.sort_name,quantity:0}})
			data.sort.push({quantity: 0,sort_name: data.sort_name,_id: res._id})
			data.sort_name = ''
			show.value = false
		}
	}
	
	// 上拉加载
	let page_n = ref(0)
	let loading = ref(false)
	onReachBottom(async()=>{
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		let DB = await inIt()
		const res = await DB.database().collection('goods_sort').limit(10).skip(sk).field({_openid:false}).get()
		let merge = [...data.sort,...res.data]
		// 数组对象去重
		let obj = {}
		let new_data = merge.reduce((prev,item)=>{
			if(!obj[item._id]){
				prev.push(item)
				obj[item._id] = true
			}
			return prev
		},[])
		data.sort = new_data
		loading.value = false
	})
	
	// 删除分类
	async function deLete(id,index,quantity){
		if(quantity > 0){
			new Feedback('请先删除该分类下的商品','none').toast()
			return false
		}
		try{
			let DB = await inIt()
			await DB.database().collection('goods_sort').doc(id).remove()
			data.sort.splice(index,1)
		}catch(e){
			new Feedback('删除失败').toast()
		}
	}
	
	
	
	
</script>

<style scoped>
.I-style{
	color: #cccccc;
}
.att-input{
	background-color: #f7f7f7;
	padding: 20rpx;
	border-radius: 7rpx;
}
.classif{
	margin: 60rpx 0 !important;
}
.modify-sub{
	padding-bottom: 60rpx !important;
}

</style>