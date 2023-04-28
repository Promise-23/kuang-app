<template>
	<page-container :show="show" position="bottom" bindenter="onEnter">
		<view class="space-view">
			<view class="address-title">
				<text>新建收货地址</text>
				<icon class="icon-small" type="cancel" size="23" @click="show = false"></icon>
			</view>
			<view class="address-input">
				<text>收货人</text>
				<input type="text" v-model="result.name">
			</view>
			<view class="address-input">
				<text>手机号码</text>
				<input type="number" v-model="result.mobile">
			</view>
			<view class="address-input">
				<text>选择地址</text>
				<picker class="flex-left" mode="region" @change="regionFun">
					<view>
						<text>{{result.district}}</text>
						<image src="/static/detail/xiangyou-jiantou.svg" mode="aspectFit"></image>
					</view>
				</picker>
			</view>
			<view class="address-input">
				<text>详细地址</text>
				<input type="text" v-model="result.address">
			</view>
			<view class="New-address" @click="subMit(_id)">
				{{_id == '' ? '保存' : '修改'}}
			</view>
		</view>
	</page-container>
</template>

<script setup>
	function onEnter(){}
	import {show,modify,deci} from '@/Acc-config/answer.js'
	import {onMounted,reactive,toRefs,defineEmits,watch} from 'vue'
	const db = wx.cloud.database()
	import {Plublic} from '@/Acc-config/public.js'
	
	// 输入框的值
	const data = reactive({
		result:{
			name:'',
			mobile:'',
			district:'',
			address:'',
			tacitly:false
		},
		_id:''//用于判断是提交新数据还是修改数据
	})
	const {result,_id} = toRefs(data)
	
	// 获取省市区数据
	let str = ''
	function regionFun(event){
		str = ''
		event.detail.value.forEach(item=>str += item)
		data.result.district = str
	}
	
	// 校验
	function subMit(_id){
		let phone = /^[1][3,4,5,7,8,9][0-9]{9}$/
		switch(true){
			case data.result.name == '':
				new Plublic().toast('请填写姓名')
				break;
			case data.result.mobile == '':
				new Plublic().toast('请填写手机号码')
				break;
			case !phone.test(data.result.mobile):
				new Plublic().toast('手机号码格式不正确')
				break;
			case data.result.district == '':
				new Plublic().toast('请选择地址')
				break;
			case data.result.address == '':
				new Plublic().toast('请填写详细地址')
				break;
			default:database(_id)
		}
	}
	
	let emits = defineEmits(['upLoad'])
	// 提交到数据库
	async function database(_id){
		try{
			if(_id == ''){//提交新地址
				await db.collection('re_address').add({data:data.result})
			}else{//修改地址
				await db.collection('re_address').doc(_id).update({data:data.result})
			}
			show.value = false
			emits('upLoad')
			emPty()
		}catch(e){
			new Plublic().toast('提交失败')
		}
	}
	
	// 清空输入框里的值
	function emPty(){
		data.result.name = '',
		data.result.mobile = '',
		data.result.district = '',
		data.result.address = '',
		data.result.tacitly = false
		data._id = ''
	}
	
	// 监听用户修改地址
	watch(modify,(newVal,oldVal)=>{
		let {name,mobile,district,address,tacitly,_id} = newVal.data
		data.result.name = name,
		data.result.mobile = mobile,
		data.result.district = district,
		data.result.address = address,
		data.result.tacitly = tacitly
		data._id = _id
	})
	
	// 判断用户是新建地址还是修改地址
	watch(deci,(newVal,oldVal)=>{
		if(newVal == '002'){
			emPty()
		}
	})
	
	
	
	
	
	
</script>

<style scoped>
.address-title{
	display: flex;
}
.address-title text{
	flex: 1;
	text-align: center;
	font-weight: bold;
}
.address-title icon{
	margin-left: auto;
}
/* 输入部分 */
.address-input{
	display: flex;
	align-items: center;
	margin: 40rpx 0;
	padding-bottom: 40rpx;
	color: #b4b4b4;
	border-bottom: 1rpx solid #e2e2e2;
}
.address-input image{
	width: 40rpx;
	height: 40rpx;
	display: block;
}
.address-input input{
	flex: 1;
	padding: 0 20rpx;
	color: #000000;
}
.flex-left{
	flex: 1;
}
.flex-left view{
	display: flex;
	justify-content: space-between;
}
.flex-left text{
	padding: 0 20rpx;
	color: #000000;
}

</style>