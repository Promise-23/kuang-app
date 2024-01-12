<template>
	<!-- 公用的sku规格选择弹窗 -->
	<page-container :custom-style="customStyle" :show="sku_popup.show" position="bottom" bindenter="onEnter" @clickoverlay="clickoverlay">
		<view class="space-view">
			<!-- 展示已选的规格：图片，价格等-->
			<view class="space-price">
				<view class="space-goods-img">
					<image :src="goods.goods_cover" mode="aspectFill"></image>
				</view>
				<view class="space-text">
					<view class="space-text-price">
						<text>{{goods.goods_price}}积分</text>
						<text v-if="ORDER.exist">秒杀价: ¥{{ORDER.order.goods_price}}</text>
					</view>
					<text class="space-text-stock">库存{{goods.stock}}</text>
					<view class="choice">
						<text>{{select.length > 0 ? '已选择' : '请选择'}}</text>
						<text v-if="select.length == 0" v-for="(item,index) in new_sku" :key="index">{{item.att_name}}</text>
						<text v-else v-for="(item,index) in select" :key="index">{{item.att_val}}</text>
					</view>
				</view>
				<view class="space-xx" @click="sku_popup.show = false">
					<image src="/static/detail/guanbi.svg" mode="aspectFit"></image>
				</view>
			</view>
			<!-- sku选择区域 :单规格-->
			<view class="space-mar" v-if="new_sku.length == 1">
				<block v-for="(item,index) in new_sku" :key="index">
				<text class="space-title">{{item.att_name}}</text>
				<view class="space-sku">
					<text v-for="(item_one,index_one) in item.sku" :key="index_one"
					:class="[item_one.stock == 0 ? 'prevent_style' : '', seleIndex[index] == index_one ? 'new_style' : '']"
					@click="choIce(item_one.att_val,item.att_name,index,index_one)"
					>
						{{item_one.att_val}}
					</text>
				</view>
				</block>
			</view>
			<!-- sku选择区域 :多规格-->
			<view class="space-mar" v-else>
				<block v-for="(item,index) in new_sku" :key="index">
				<text class="space-title">{{item.att_name}}</text>
				<view class="space-sku">
					<text v-for="(item_one,index_one) in item.sku" :key="index_one"
					:class="[item_one.act ? 'prevent_style' : '', seleIndex[index] == index_one ? 'new_style' : '']"
					@click="choIce(item_one.att_val,item.att_name,index,index_one)"
					>
					{{item_one.att_val}}
					</text>
				</view>
				</block>
			</view>
			<!-- 兑换数量 -->
			<view class="Pur-quantity">
				<view class="Pur-title">兑换数量</view>
				<view class="Pur-image">
					<image src="/static/detail/jianshao.png" mode="aspectFit" @click="reDuce" :class="[goods_amount == 1 ? 'prevent_style' : '']"></image>
					<text>{{goods_amount}}</text>
					<image src="/static/detail/tianjia.png" mode="aspectFit" @click="plUs"></image>
				</view>
			</view>
			<!-- 给一个防止超出页面的区域被按钮给盖住 -->
			<view style="height: 200rpx;"></view>
			<!-- 底部按钮 -->
			<view class="space-botton">
				<view class="common-button" @click="subMit(sku_popup.judge)">{{'立即兑换'}}</view>
			</view>
		</view>
	</page-container>
</template>

<script setup>
	function onEnter(){}
	// 详情页点击底部加购或购买拉起sku弹窗
	import {sku_popup} from '@/Acc-config/answer.js'
	import {defineProps,watch,reactive,toRefs,toRaw,nextTick,ref} from 'vue'
	import {ORDER,SHCART} from '../../Acc-config/place-order.js'
	
	const customStyle = ref('border-radius: 10px 10px 0 0')
	const props = defineProps({sku_data:Array,goods:Object})
	const skudata = reactive({goods:{},new_sku:[],all_sku:[],sku_length:0,
	sku_sort:{}
	})
	const {goods,new_sku} = toRefs(skudata)
	watch(props,(newVal_a,oldVal)=>{
		const newVal = JSON.parse(JSON.stringify(newVal_a))//深拷贝
		skudata.goods = newVal.goods
		if(newVal.sku_data.length === 0)return false
		const sku_data = newVal.sku_data[0]
		// 取出sku数据，给后面的开发使用
		skudata.all_sku = sku_data.sku
		skudata.sku_length = sku_data.sku[0].att_data.length
		sku_data.sku[0].att_data.forEach((item,index)=>{
			skudata.sku_sort = {...skudata.sku_sort,...{[item.att_name]:index}}
		})
		// 取出标题
		const sku_name = sku_data.sku[0].att_data.map(item=>item.att_name)
		// 重组sku展示，根据sku_name有多少条而取出：判断是单规格还是多规格
		let new_sku = []
		let att_length = sku_data.sku[0].att_data.length//判断是单规格还是多规格
		for(let i = 0; i < sku_name.length; i++){
			let res = sku_data.sku.map(item=>{
				if(att_length == 1){
					return {att_val:item.att_data[i].att_val,stock:item.stock}
				}else{
					return {att_val:item.att_data[i].att_val,act:false}
				}
			})
			// 数组对象去重
			let obj = {}
			let removal = res.reduce((prev,item)=>{
				if(!obj[item.att_val]){
					prev.push(item)
					obj[item.att_val] = true
				}
				return prev
			},[])
			new_sku.push({att_name:sku_name[i],sku:removal})
		}
		skudata.new_sku = new_sku
	})
	
	// 选中规格select:[{att_val:'微辣',att_name:'口味'}]
	const selectdata = reactive({select:[],seleIndex:[]})
	const {select,seleIndex} = toRefs(selectdata)
	function choIce(att_val,att_name,index,index_one){
		// 切换选中添加颜色
		let IN = selectdata.select.findIndex(item=>item.att_name == att_name)
		if(IN > -1){
			let MB = selectdata.select.findIndex(item=>item.att_val == att_val)
			if(MB > -1){
				selectdata.select.splice(IN,1)
				selectdata.seleIndex[index] = -1
			}else{
				selectdata.select[IN] = {att_name,att_val}
				selectdata.seleIndex[index] = index_one
			}
		}else{
			selectdata.select.push({att_name,att_val})
			selectdata.seleIndex[index] = index_one
		}
	
		// 查询选中的sku的图片，价格，库存
		if(selectdata.select.length == skudata.sku_length){
			// 对已选的sku排序
			selectdata.select.sort((p1,p2)=>{
				return skudata.sku_sort[p1.att_name] - skudata.sku_sort[p2.att_name]
			})
			let query_sku = skudata.all_sku.filter(item=>{
				return JSON.stringify(item.att_data) == JSON.stringify(selectdata.select)
			})
			skudata.goods.goods_cover = query_sku[0].image
			skudata.goods.goods_price = query_sku[0].price
			skudata.goods.stock = query_sku[0].stock
		}
		// 查询库存是否不足:主要是多规格
		if(skudata.new_sku.length == 1)return false
		let raw = toRaw(skudata)
		raw.all_sku.forEach(item=>item['custom'] = '')
		selectdata.select.forEach((item_k,index_k)=>{
			raw.all_sku.forEach((item,index)=>{
				if(item.stock === 0){
					item.att_data.forEach((item_i,index_i)=>{
						if(item_i.att_name == item_k.att_name && item_i.att_val == item_k.att_val){
							// 此处查询到库存为0的，custom就标记为不是空字符串
							raw.all_sku[index].custom += item_i.att_val
						}
					})
				}
			})
		})
		
		let STR = ''
		selectdata.select.forEach((item=>STR += item.att_val))
		if(STR == ''){
			var new_res = []//取消选中
		}else{//选中
			var new_res = raw.all_sku.filter(item=>item.custom == STR)
		}
		// 让库存为0的禁用点击，去掉背景颜色
		if(new_res.length > 0){
			for(let i = 0; i<new_res.length; i++){
				for(let m = 0; m<new_res[i].att_data.length; m++){
					for(let I = 0; I<skudata.new_sku.length; I++){
						for(let k = 0; k<skudata.new_sku[I].sku.length; k++){
							selectdata.select.forEach(async item_se=>{
								if(item_se.att_name != skudata.new_sku[I].att_name && new_res[i].att_data[m].att_val == skudata.new_sku[I].sku[k].att_val){
									await nextTick()
									skudata.new_sku[I].sku[k].act = true
									selectdata.seleIndex[I] = -1
									let DE = selectdata.select.findIndex(item=>item.att_val == skudata.new_sku[I].sku[k].att_val)
									if(DE > -1){
										selectdata.select.splice(DE,1)
									}
								}
							})
						}
					}
				}
			}
		}else{
			skudata.new_sku.forEach(async(item,index)=>{
				await nextTick()
				item.sku.forEach((item_act,index_act)=>{
					if(item_act.act){
						skudata.new_sku[index].sku[index_act].act = false
					}
				})
			})
		}
		/* 后期我会对该页面进行修复，优化 */
	}
	
	// 加减商品数量
	const goods_amount = ref(1)
	function reDuce(){
		goods_amount.value--
	}
	function plUs(){
		goods_amount.value++
	}

	// 加入购物车或者直接下单
	import {Plublic} from '../../Acc-config/public.js'
	async function subMit(judge){
		if(selectdata.select.length != skudata.new_sku.length){
			new Plublic().toast('请选择商品规格')
		}else{
			ORDER.order.buy_amount = goods_amount.value
			ORDER.order.specs = selectdata.select
			ORDER.order.goods_image = skudata.goods.goods_cover
			ORDER.order.goods_price = ORDER.exist ? ORDER.order.goods_price : skudata.goods.goods_price
			if(judge == 'j_sho'){
				// 加入购物车
				console.log('加入购物车')
				try{
					let res = await SHCART()
					new Plublic().toast(res)
					sku_popup.show = false
				}catch(err){
					new Plublic().toast(err)
				}
			}else{
				/* 立即购买 */
				// 计算总价
				ORDER.order.subtotal = parseFloat((ORDER.order.goods_price * ORDER.order.buy_amount).toFixed(10))
				sku_popup.show = false
				const STR = JSON.stringify([ORDER.order])
				wx.navigateTo({//direct单个商品下单
					url:`/pages/Pay-view/pay?order=${STR}&type=direct&orderType=gift`
				})
			}
		}
	}

	function clickoverlay(){
		sku_popup.show = false
	}
</script>

<style scoped>
.space-goods-img{
	width: 180rpx;
	height: 180rpx;
}
.space-goods-img image{
	width: 180rpx;
	height: 180rpx;
	border-radius: 10rpx;
}
.space-xx{
	width: 30rpx;
	height: 30rpx;
}
.space-xx image{
	width: 30rpx;
	height: 30rpx;
}
.space-price{
	display: flex;
	border-bottom: 1rpx solid #ececed;
	padding-bottom: 20rpx;
}
.space-price text{
	display: block;
}
.space-text{
	flex: 1;
	align-self: flex-end;
	padding: 0 20rpx;
	font-size: 26rpx;
}
.space-text-price{
	display: flex;
	align-items: center;
	font-weight: bold;
}
.space-text-price text:nth-child(1){
	color: #e9445a;
	font-size: 40rpx;
}
.space-text-price text:nth-child(2){
	font-size: 30rpx;
	background-color: #e9445a;
	color: #ffffff;
	border-radius: 40rpx;
	padding: 10rpx;
	margin-left: 20rpx;
}
.space-text-stock{
	padding: 8rpx 0;
	color: #8d8e92;
}
.choice{
	display: flex;
	align-items: center;
	color: #8d8e92;
	flex-wrap: wrap;
}
.choice text{
	padding-right: 10rpx;
}
.choice text:nth-child(1){
	color: #333333 !important;
}
.space-mar{
	margin: 20rpx 0;
	border-bottom: 1rpx solid #ececed;
}
.space-title{
	margin-bottom: 20rpx;
	display: block;
	font-weight: bold;
}
.space-sku{
	display: flex;
	flex-wrap: wrap;
}
.space-sku text{
	font-size: 28rpx;
	background-color: #f8f8f8;
	padding: 10rpx 20rpx;
	margin: 0 20rpx 20rpx 0;
	border-radius: 10rpx;
}
.Pur-quantity image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
.Pur-quantity{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.Pur-title{font-weight: bold;}
.Pur-image{
	display: flex;
	align-items: center;
}
.Pur-image text{
	padding: 0 40rpx;
}
.space-botton{
	background-color: #fefefe;
	height: 150rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
.space-botton view{
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	margin: 10rpx 20rpx;
	font-size: 36rpx;
}

/* 点击后加上新样式 */
.new_style{
	background-color: rgba(255, 85,0, 1) !important;
	color: #FFFFFF;
}

</style>