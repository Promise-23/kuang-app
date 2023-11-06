<template>
	<view style="height: 20rpx;"></view>
	<view class="coupons">
		<Coupon class="coupon" v-for="(item, index) in coupons" :key="index" :index="index" :coupon="item" @delete="deLete"/>
		<!-- 没有数据的提示 -->
		<view class="Tips" v-if="coupons.length === 0">你还没有优惠券数据</view>
	</view>
	<!-- 弹窗 -->
	<page-container :show="show" position="bottom" bindenter="onEnter" bindclickoverlay="clickoverlay">
		<view class="space-view">
			<view class="modify-sub modify-padding">
				<image src="/static/detail/guanbi.svg" mode="widthFix" @click="show = false"></image>
				<text>创建优惠券</text>
				<!-- <text @click="subMit">提交</text> -->
			</view> 
			<view class="att-input">
				<input type="text" v-model="formData.desc" @blur="validateDesc" placeholder="输入优惠券描述" placeholder-class="I-style" cursor-spacing="50"/>
			</view>
			<view class="att-input">
				<input type="number" v-model="formData.price" @blur="validatePrice" placeholder="输入优惠券金额" placeholder-class="I-style" cursor-spacing="50"/>
			</view>
			<view class="att-input" v-show="formData.type == 'full'">
				<input type="number" v-model="formData.full" @blur="validateFull" placeholder="满多少金额可用" placeholder-class="I-style" cursor-spacing="50"/>
			</view>
			<view class="att-input">
				<input type="number" v-model="formData.num" @blur="validateNum" placeholder="输入可领取数量" placeholder-class="I-style" cursor-spacing="50"/>
			</view>
			<view class="att-input specs-view" v-show="formData.type == 'limit'">
				<picker mode="selector" :range="sortArray" range-key="sort_name" @change="changeSort">
				<view class="sort-title specs-title">
					<text>限制商品分类</text>
					<text>{{sort_value}}</text>
					<image src="/static/detail/xiangyou-jiantou.svg" mode="widthFix"></image>
				</view>
				</picker>
			</view>
			<view class="att-input">
				<radio-group @change="radioTypeChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in couponTypes" :key="item.value">
						<view>
							<radio :value="item.value" :checked="item.value === formData.type" />
						</view>
						<view>{{item.label}}</view>
					</label>
				</radio-group>
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
			<view class="att-input">
				<input type="text" v-model="formData.remark" placeholder="输入备注" placeholder-class="I-style" cursor-spacing="50"/>
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
		<view class="newly-added" @click="show = true">创建优惠券</view>
	</view>
</template>

<script setup>
import { watchEffect } from 'vue';
	function onEnter(e){
		console.log(e)
	}
	// uniapp目前还不支持该组件，所以该事件还不会触发，
	function clickoverlay(e){
		console.log(e)
	}
	
	import {ref,onMounted,reactive,toRefs, watch} from 'vue'
	import {onReachBottom} from '@dcloudio/uni-app'
	import {inIt} from '@/Acc-config/init.js'
	import Loading from '@/pages/public-view/loading.vue'
	import Coupon from './components/Coupon.vue'
	import {start_date,end_date} from '@/Acc-config/date.js'
	import {current,months,codays} from '@/Acc-config/ca-time.js'
	
	current()
	
	// 控制弹窗弹出
	const show = ref(false)
	const data = reactive({coupons:[]})
	const {coupons} = toRefs(data)
	
	onMounted(()=>{
		getCoupons()
		getSortArray()
		console.log('start_date', start_date)
		console.log('end_date', end_date)
	})
	// 获取可领取优惠券
	async function getCoupons(){
		let DB = await inIt()
		const res = await DB.database().collection('coupon_center').where({active: true}).limit(10).field({_openid:false}).get()
		console.log('getCoupons', res?.data)
		data.coupons = res?.data ?? []
	}
	
	const initData = {desc: '',price: '', num: '', type: 'full', limit: [], remark: '', time: []}
	const formData = reactive(initData)
	// const {desc, price, num, type, limit, remark, time} = toRefs(formData)
	// 提交数据
	import {Feedback} from '@/Acc-config/media.js'
	async function subMit(){
		if(!validateDesc() || !validatePrice() || !validateFull() || !validateNum() || !validateTime()){
			return false
		}
		let DB = await inIt()
		let res = await DB.database().collection('coupon_center').add({data:{...formData,active:true,getNum: 0}})
		data.coupons.push({...formData,_id: res._id})
		Object.assign(formData, initData)
		console.log('formData', formData)
		show.value = false
	}
	
	// 上拉加载
	let page_n = ref(0)
	let loading = ref(false)
	onReachBottom(async()=>{
		loading.value = true
		page_n.value++
		let sk = page_n.value * 10
		let DB = await inIt()
		const res = await DB.database().collection('coupon_center').where({active: true}).limit(10).skip(sk).field({_openid:false}).get()
		let merge = [...data.coupons,...res.data]
		// 数组对象去重
		let obj = {}
		let new_data = merge.reduce((prev,item)=>{
			if(!obj[item._id]){
				prev.push(item)
				obj[item._id] = true
			}
			return prev
		},[])
		data.coupons = new_data
		loading.value = false
	})
	
	// 删除分类
	async function deLete(id,index){
		console.log('deLete', id, index)
		try{
			let DB = await inIt()
			await DB.database().collection('coupon_center').doc(id).update({data:{active:false}})
			data.coupons.splice(index,1)
			new Feedback('删除成功').toast()
		}catch(e){
			new Feedback('删除失败').toast()
		}
	}
	
	const couponTypes = [{label: '满减券', value: 'full'},{label: '支付券', value: 'pay'},{label: '商品券', value: 'limit'},]
	
	function radioTypeChange(e){
		console.log('radioChange', e)
		formData.type = e.target.value
	}
	
	// 校验描述
	function validateDesc(){
		if(formData.desc == ''){
			new Feedback('请输入优惠券描述','none').toast()
			return false
		}else{
			return true
		}
	}
	
	// 校验金额
	function validatePrice(){
		console.log('formData.price', typeof formData.price)
		if(formData.price == ''){
			new Feedback('请输入优惠券金额','none').toast()
			return false
		}else {
			return true
		}
	}
	
	// 校验满减金额
	function validateFull(){
		if(formData.type !== 'full'){
			return true
		}
		if(formData.full == ''){
			new Feedback('请输入满多少可用','none').toast()
			return false
		}else if(formData.full < formData.price * 2){
			new Feedback('当前优惠券折扣过低','none').toast()
			return false
		}else {
			return true
		}
	}
	
	// 校验可领取数量
	function validateNum(){
		if(formData.num == ''){
			new Feedback('请输入可领取数量','none').toast()
			return false
		}else{
			return true
		}
	}
	
	// 校验生效时间
	function validateTime(){
		console.log('validateTime', formData.time)
		if(formData.time.length==0 || !formData.time[0]){
			new Feedback('请输入生效开始时间','none').toast()
			return false
		}else if(!formData.time[1]){
			new Feedback('请输入生效结束时间','none').toast()
			return false
		}else {
			return true
		}
	}
	
	const sortdata = reactive({sortArray: [], sort_value:''})
	const { sortArray, sort_value } = toRefs(sortdata)
	// 查询分类数据
	async function getSortArray(){
		let DB = await inIt()
		const res = await DB.database().collection('goods_sort').field({_openid:false}).get()
		sortdata.sortArray = res.data
		console.log('sortdata.sortArray', sortdata.sortArray)
	}
	
	// 修改分类
	function changeSort(e){
		sortdata.sort_value = sortdata.sortArray[e.detail.value].sort_name
		formData.limit = [sortdata.sort_value]
		console.log('changeSort', sortdata.sort_value)
	}
	
	const Time = reactive({
		start_arr:start_date.slice(0, 3),
		end_arr:end_date.slice(0, 3),
		multiIndex_a:[0,0,0,0,0],//开始时间value 每一项的值
		multiIndex_b:[0,0,0,0,0],//结束时间value 每一项的值
		start:'',//开始时间
		end:'',//结束时间
		years:[{'year':start_date[0][0]?.time,'month':start_date[1][0]?.time}],
		ban:false//判断设置的秒杀时间是否正确
	})
	
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
		// const time = date[3][RES[3]].time
		// const minute = date[4][RES[4]].time
		// const sele_res = year + '-' + month + '-' + day + ' ' + time + ':' + minute + ':' + '00'
		const sele_res = year + '-' + month + '-' + day
	
		if(val == 'start'){
			// 开始时间
			Time.start = sele_res
			Time.multiIndex_a = RES
			formData.time[0] = sele_res
		}else{
			// 结束时间
			Time.end = sele_res
			Time.multiIndex_b = RES
			formData.time[1] = sele_res
		}	
		console.log('sele_res', sele_res)
		console.log('RES', RES)
	}	
	
	// 监听结束时间是否小于开始时间
	import moment from 'moment'
	moment.locale('zh-cn');
	watch([()=>Time.start,()=>Time.end],(newVal,oldVal)=>{
		if(newVal[0] != '' && newVal[1] != ''){
			const start = moment(newVal[0],'YYYY-MM-DD').unix()//开始时间
			const end = moment(newVal[1],'YYYY-MM-DD').unix()//结束时间
			if(start >= end){
				Time.end = '结束时间不可早于开始时间'
				Time.ban = false
			}else if(start < end){
				Time.ban = true
			}
		}
	})
	
	watchEffect(() => {
		if(formData.type == 'full' && formData.full){
			formData.remark = '消费满' + formData.full + '元可用'
		} else if(formData.type == 'limit' && formData.limit?.length>0){
			console.log('formData.limit', formData.limit.join('、'))
			formData.remark = '仅限' + formData.limit.join('、') + '类商品可用'
		} else {
			formData.remark = '仅线上购物可用'
		}
	})
	
	
</script>

<style scoped>
.I-style{
	color: #cccccc;
}
.att-input{
	background-color: #f7f7f7;
	padding: 20rpx;
	border-radius: 7rpx;
	margin-bottom: 20rpx;
}
.classif{
	margin: 60rpx 0 !important;
}
.modify-sub{
	padding-bottom: 60rpx !important;
}

.coupons{
	padding: 0 20rpx;
}

radio-group{
	display: flex;
	justify-content: space-between;
	align-items: center;
}

radio-group label{
	display: flex;
	align-items: center;
}

.specs-view{
	/* background-color: #FFFFFF; */
	margin: 40rpx 20rpx;
	border-radius: 8rpx;
}
.specs-title{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	font-weight: bold;
}
.specs-title image{
	width: 35rpx;
	height: 35rpx;
	display: block;
}
.specs-image image{
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 8rpx;
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

</style>