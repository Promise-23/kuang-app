<template>
	<view class="Re-view" v-for="(item,index) in address" :key="index">
		<view class="Re-address Re-flex" @click="choIce(item)">
			<view>
				<view class="Re-name Re-flex">
					<text>{{item.name}}</text>
					<text>{{item.mobile}}</text>
				</view>
				<text>{{item.district + item.address}}</text>
			</view>
			<view v-if="item.tacitly">
				<icon class="icon-small" type="success_no_circle" size="23"></icon>
			</view>
		</view>
	
		<!-- 设置默认 -->
		<view class="Defa-address Re-flex">
			<view class="Re-flex" :class="[item.tacitly ? 'Disable' : '']" @click="setUp(item._id,index)">
				<icon class="icon-small" type="success" size="23" v-if="item.tacitly"></icon>
				<text class="Defa-padd">{{item.tacitly ? '已设为默认' : '设为默认'}}</text>
			</view>
			<view class="Re-flex">
				<text @click="deleTe(item._id,index)">删除</text>
				<text class="Defa-padd" @click="modIfy(item,item._id)">修改</text>
			</view>
		</view>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="address.length == 0">你还没有收货地址</view>
	<view style="height: 300rpx;"></view>
	<view class="New-address common-button" @click="newAddress">+ 新建地址</view>
	<!-- 弹窗 -->
	<Address @upLoad="upLoad"></Address>
</template>

<script setup>
	import Address from './component/new-address.vue'
	import {address_show,new_address} from '@/Acc-config/answer.js'
	import {onMounted,reactive,toRefs} from 'vue'
	import {Plublic} from '@/Acc-config/public.js'
	const db = wx.cloud.database()
	
	// 请求数据
	onMounted(()=>{getAdd()})
	const data = reactive({address:[]})
	const {address} = toRefs(data)
	async function getAdd(){
		const res = await db.collection('re_address').get()
		data.address = res.data
	}
	// 弹窗组件提交数据成功时触发
	function upLoad(){
		getAdd()
	}
	// 删除
	function deleTe(_id,index){
		wx.showModal({content: '确认删除吗'})
		.then(async(res)=>{
			if(res.confirm){
				try{
					await db.collection('re_address').doc(_id).remove()
					data.address.splice(index,1)
				}catch(e){
					new Plublic().toast('删除失败')
				}
			}
		})
	}
	
	// 修改地址
	import {modify,deci} from '@/Acc-config/answer.js'
	function modIfy(item,id){
		modify.data = item
		modify.id = id
		address_show.show = true
		deci.value = '001'//'001'是修改
	}
	// 调用弹窗新建地址
	function newAddress(){
		address_show.show = true
		deci.value = '002'
	}
	
	// 设置默认地址
	async function setUp(id,index){
		let sto = []
		data.address.forEach((item,index_a)=>{
			if(item.tacitly){
				sto.push({index:index_a,id:item._id})
			}
		})
		try{
			await db.collection('re_address').doc(id).update({data:{tacitly:true}})
			data.address[index].tacitly = true
			if(sto.length > 0){
				await db.collection('re_address').doc(sto[0].id).update({data:{tacitly:false}})
				data.address[sto[0].index].tacitly = false
			}
		}catch(e){
			new Plublic().toast('设置失败')
		}
	}
	
	// 选择地址传值返回上一页面
	function choIce(value){
		new_address.data = value
		wx.navigateBack({
			delta:1
		})
	}
	
</script>

<style>
page{
	background-color: #fafafa;
}
.Re-view{
	background-color: #FFFFFF;
	padding: 20rpx;
	margin: 20rpx 0;
}
.Re-address{
	justify-content: space-between;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #e1e1e1;
}
.Re-flex{
	display: flex;
	align-items: center;
}
.Re-name text:nth-child(1){
	font-weight: bold;
	padding-right: 20rpx;
}
.Re-name text:nth-child(2){
	color: #8c8c8c;
}
.Re-name{
	padding-bottom: 20rpx;
}
/* 默认地址 */
.Defa-address text{
	display: block;
	color: #8c8c8c;
}
.Defa-address{
	justify-content: space-between;
	padding-top: 20rpx;
}
.Defa-padd{
	padding-left: 30rpx;
}
/* 禁用点击 */
.Disable{
	pointer-events: none;
}
</style>