<template>
	<view class="sort-Header sort-position" v-if="data.seckill_goods.length > 0">
		<text>封面图</text>
		<text>标题</text>
		<text>操作</text>
	</view>
	<view style="height: 90rpx;"></view>
	<view class="sort-Header sort-table" v-for="(item,index) in data.seckill_goods" :key="index">
		<image :src="item.cover" mode="aspectFill"></image>
		<text>{{item.title}}</text>
		<text class="sort-but" @click="deLete(item._id,index)">删除</text>
	</view>
	<!-- 没有数据的提示 -->
	<view class="Tips" v-if="data.seckill_goods.length == 0">你还没有秒杀数据</view>
	<!-- 底部 -->
	<view style="300rpx"></view>
	<view class="newly-added-view">
		<view class="newly-added" @click="show = true">创建秒杀</view>
	</view>
	<!-- 弹窗 -->
	<page-container :show="show" position="bottom" bindenter="onEnter">
		<view class="space-view">
			<view class="modify-sub modify-padding">
				<image src="/static/detail/guanbi.svg" mode="widthFix" @click="show = false"></image>
				<text>创建秒杀</text>
				<text @click="subMit">提交</text>
			</view>
			<view class="upload-cover">
				<image src="/static/detail/miaosha-img.jpg" mode="aspectFill" v-if="Time.se_cover == ''" @click="upImage"></image>
				<image :src="Time.se_cover" mode="aspectFill"></image>
				<image src="../../static/detail/shanchu-goods.svg" mode="widthFix" v-if="Time.se_cover != ''" @click="Time.se_cover = ''"></image>
			</view>
			<view class="seckill-input">
				<input type="text" v-model="Time.se_title" placeholder="请输入标题" placeholder-class="input-color" cursor-spacing="50">
				<input type="number" v-model="Time.se_price" placeholder="请输入秒杀价" placeholder-class="input-color" cursor-spacing="50">
			</view>
			<!-- 设置时间 -->
			<view class="pick-Outer">
				<view class="pick-view Underline">
					<view>
						<text>设置开始时间</text>
						<picker class="flex-left" mode="multiSelector" :range="Time.start_arr" :value="Time.multiIndex_a"
						range-key="name" @columnchange="colStart" @change="changeStart"
						>
							<view>
								<text class="pick-time">{{Time.start}}</text>
								<image src="/static/detail/xiangyou-jiantou.svg" mode="widthFix"></image>
							</view>
						</picker>
					</view>
				</view>
				<!-- 结束时间 -->
				<view class="pick-view">
					<view>
						<text>设置结束时间</text>
						<picker class="flex-left" mode="multiSelector" :range="Time.end_arr" :value="Time.multiIndex_b"
						range-key="name" @columnchange="colEnd" @change="changeEnd"
						>
							<view>
								<text class="pick-time">{{Time.end}}</text>
								<image src="/static/detail/xiangyou-jiantou.svg" mode="widthFix"></image>
							</view>
						</picker>
					</view>
				</view>
			</view>
			<!-- 关联商品 -->
			<view class="relation relation-back" @click="addTo">
				<text>关联商品</text>
				<text class="over-text">{{Time.re_goods.title == '' ? '添加' : Time.re_goods.title}}</text>
			</view>
			<view style="height: 200rpx;"></view>
		</view>
	</page-container>

</template>

<script setup>
	import {inIt} from '@/Acc-config/init.js'
	import {ref,onMounted,reactive,toRefs,watch,toRaw } from 'vue'
	import {start_date,end_date} from '@/Acc-config/date.js'
	import {current,months,codays} from '@/Acc-config/ca-time.js'
	function onEnter(){}
	current()
	
	const show = ref(false)
	const data = reactive({seckill_goods:[]})
	onMounted(()=>{
		getSeckill()
	})
	// 获取数据
	async function getSeckill(){
		let DB = await inIt()
		let res = await DB.database().collection('seckill').get()
		console.log(res)
		data.seckill_goods = res.data
	}
	
	const Time = reactive({
		start_arr:start_date,
		end_arr:end_date,
		multiIndex_a:[0,0,0,0,0],//开始时间value 每一项的值
		multiIndex_b:[0,0,0,0,0],//结束时间value 每一项的值
		se_cover:'',//封面图
		se_title:'',//标题
		se_price:'',//秒杀价格
		start:'',//开始时间
		end:'',//结束时间
		re_goods:{
			title:'',//关联的商品标题
			goods_id:'',//关联的商品id
			video_url:'',//关联的商品短视频
			ori_price:''//关联的商品原价
		},
		years:[{'year':start_date[0][0].time,'month':start_date[1][0].time}],
		ban:false//判断设置的秒杀时间是否正确
	})
	
	// 上传封面图
	import {Feedback,Upload} from '@/Acc-config/media.js'
	async function upImage(){
		const local = await new Upload().image()
		wx.showLoading({title: '正在上传',mask:true})
		const res = await new Upload().cloud(local[0].tempFilePath)
		Time.se_cover = res
		wx.hideLoading()
	}
	
	// 开始时间：滚动时触发
	function colStart(event){
		const RES = event.detail
		shAre(RES,Time.start_arr,Time.multiIndex_a,'start')
	}
	// 结束时间：滚动时触发
	function colEnd(event){
		const RES = event.detail
		shAre(RES,Time.end_arr,Time.multiIndex_b,'end')
	}
	
	// 开始时间和结束时间滚动时触发公用方法：从新计算某年某月的天数
	function shAre(RES,to_date,mult,val){
		console.log('修改的列为：' + RES.column + '，值为：' + RES.value)
		mult[RES.column] = RES.value
		switch(RES.column){
			case 0: //拖动第1列:年
				switch (mult[0]){
					case 0://第一列的第一个值：当前年
					to_date[1] = months(to_date[0][0].time)
					to_date[2] = codays({year:to_date[0][0].time,month:to_date[1][0].time})
					break;
					case 1://第一列的第二个值：明年
					to_date[1] = months(to_date[0][1].time)
					to_date[2] = codays({year:to_date[0][1].time,month:-1})
					break;
				}
				mult.splice(1,1,0)
				mult.splice(2,1,0)
				mult.splice(3,1,0)
				mult.splice(4,1,0)
			break;
			case 1://拖动第二列：月
			let MO = mult
			to_date[2] = codays({year:to_date[0][MO[0]].time,month:to_date[1][MO[1]].time})
			mult.splice(2,1,0)
			mult.splice(3,1,0)
			mult.splice(4,1,0)
			break;
		}
	}
	
	
	// 开始时间：确定
	function changeStart(e){
		const RES = e.detail.value
		conFirm(RES,'start',Time.start_arr)
	}
	// 结束时间：确定
	function changeEnd(e){
		const RES = e.detail.value
		conFirm(RES,'end',Time.end_arr)
	}
	// 开始时间和结束时间：确定=》公用
	function conFirm(RES,val,date){
		const year = date[0][RES[0]].time
		const month = date[1][RES[1]].time
		const day = date[2][RES[2]].time
		const time = date[3][RES[3]].time
		const minute = date[4][RES[4]].time
		const sele_res = year + '/' + month + '/' + day + ' ' + time + ':' + minute + ':' + '00'

		if(val == 'start'){
			// 开始时间
			Time.start = sele_res
			Time.multiIndex_a = RES
		}else{
			// 结束时间
			Time.end = sele_res
			Time.multiIndex_b = RES
		}
		
	}	
	
	// 监听结束时间是否小于开始时间
	import moment from 'moment'
	moment.locale('zh-cn');
	watch([()=>Time.start,()=>Time.end],(newVal,oldVal)=>{
		if(newVal[0] != '' && newVal[1] != ''){
			const start = moment(newVal[0],'YYYY/MM/DD hh:mm:ss').unix()//开始时间
			const end = moment(newVal[1],'YYYY/MM/DD hh:mm:ss').unix()//结束时间
			if(start >= end){
				Time.end = '结束时间早已开始时间'
				Time.ban = false
			}else if(start < end){
				Time.ban = true
			}
		}
	})
	
	// 去选择关联商品
	function addTo(){
		const rel_id = data.seckill_goods.map(item=>item.goods_id)
		const str_id = JSON.stringify(rel_id)
		wx.navigateTo({
			url:'/pages/goods-list/list?ref_id=' + str_id
		})
	}
	
	// 监听关联的商品
	import {select_goods} from '@/Acc-config/answer.js'
	watch(select_goods,(newVal,oldVal)=>{
		Time.re_goods.title = newVal.goods_title
		Time.re_goods.goods_id = newVal.goods_id
		Time.re_goods.video_url = newVal.video_url
		Time.re_goods.ori_price = newVal.goods_price
	})
	
	// 提交
	function subMit(){
		switch(true){
			case Time.se_cover == '': new Feedback('请上传封面图','none').toast();
			break;
			case Time.se_title == '': new Feedback('请输入标题','none').toast();
			break;
			case Time.se_price == '': new Feedback('请输入秒杀价','none').toast();
			break;
			case Time.start == '' || Time.end == '' : new Feedback('请设置秒杀时间','none').toast();
			break;
			case Time.ban == false : new Feedback('结束时间早已开始时间','none').toast();
			break;
			case Time.re_goods.goods_id == '' : new Feedback('请关联一个商品','none').toast();
			break;
			default:database()
		}
	}
	
	async function database(){
		wx.showLoading({title: '正在提交',mask:true})
		const start_Time = moment(Time.start,'YYYY/MM/DD hh:mm:ss').unix()
		const end_Time = moment(Time.end,'YYYY/MM/DD hh:mm:ss').unix()
		let obj = {
			cover:Time.se_cover,
			title:Time.se_title,
			ori_price:Time.re_goods.ori_price,
			price_spike:Number(Time.se_price),
			seckill_time:{start_Time,end_Time},
			goods_id:Time.re_goods.goods_id,
			video_url:Time.re_goods.video_url
		}
		try{
			let DB = await inIt()
			await DB.database().collection('seckill').add({data:obj})
			// 查询该商品将秒杀字段改为true
			await DB.database().collection('goods').doc(Time.re_goods.goods_id).update({data:{seckill:true}})
			show.value = false
			getSeckill()
			new Feedback('提交成功','success').toast()
			Time.se_cover = '';Time.se_title;
			Time.se_price = '';Time.start = '';
			Time.end = '';Time.re_goods.title = ''
		}catch(e){
			new Feedback('提交失败').toast()
		}
	}
	
	
	// 删除
	async function deLete(id,index){
		try{
			let DB = await inIt()
			await DB.database().collection('seckill').doc(id).remove()
			data.seckill_goods.splice(index,1)
			new Feedback('删除成功','success').toast()
		}catch(e){
			new Feedback('删除失败').toast()
		}
	}
	
	
</script>

<style scoped>
	.sort-table text:nth-child(2) {
		color: #333333 !important;
		background-color: initial !important;
		border-radius: 0 !important;
		padding: 0 !important;
		font-size: 30rpx !important;
	}

	.modify-padding {
		padding-bottom: 60rpx !important;
	}

	.relation-back {
		background-color: #f7f7f7 !important;
		color: #000000 !important;
	}

	.over-text {
		color: #ed6b51 !important;
	}

	.upload-cover {
		position: relative;
	}

	.upload-cover image:nth-child(1) {
		width: 100%;
		height: 380rpx;
		display: block;
	}

	.upload-cover image:nth-child(2) {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 6rpx;
		right: 6rpx;
	}

	.seckill-input input {
		padding: 20rpx;
		background-color: #f7f7f7;
		margin-top: 30rpx;
		border-radius: 7rpx;
	}

	/deep/ .input-color {
		color: #cccccc;
	}

	.pick-Outer {
		background-color: #f7f7f7;
		margin-top: 30rpx;
		padding: 0 20rpx;
		border-radius: 7rpx;
	}

	.pick-view {
		padding: 20rpx 0;
	}

	.pick-view image {
		display: block;
		width: 30rpx;
		height: 30rpx;
		margin-left: 20rpx;
	}

	.pick-view view:nth-child(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.flex-left {
		flex: 1;
	}

	.flex-left view {
		justify-content: flex-end !important;
	}

	.Underline {
		border-bottom: 1rpx solid #ededed;
	}

	.pick-time {
		font-size: 27rpx;
	}
</style>
