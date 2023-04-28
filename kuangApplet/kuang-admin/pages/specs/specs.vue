<template>
	<!-- 顶部 -->
	<view class="attribute">
		<view class="edit">
			<text>请给商品规格设置合适的属性</text>
			<text @click="show = true">编辑</text>
		</view>
		<view class="checkbox">
			<checkbox-group style="display: flex;" @change="chEchange">
				<label v-for="(item,index) in attribute.selected" :key="index" @click="fInd(item.att,item.checked)">
					<checkbox :value="item.att" :checked="item.checked" color="#e96c56"/>{{item.name}}
				</label>
			</checkbox-group>
		</view>
	</view>
	<!-- 规格生成 -->
	<view class="attribute gener" v-for="(item,index) in sku_data.sku" :key="index">
		<view class="edit specs-delete">
			<text>规格{{item.title}}</text>
			<text v-if="sku_data.sku.length > 1" @click="deleteSku(index)">删除</text>
		</view>
		<view class="edit entry" v-if="item.att_data.length > 0" v-for="(item_add,index_add) in item.att_data" :key="index_add">
			<text>{{item_add.att_name}}</text>
			<input type="text" v-model="item_add.att_val" :placeholder=" '请输入' + item_add.att_name " placeholder-class="I-style" cursor-spacing="50">
		</view>
		<view class="edit entry">
			<text>价格</text>
			<input type="number" v-model="item.price" placeholder="请输入价格" placeholder-class="I-style" cursor-spacing="50">
			<text>元</text>
		</view>
		<view class="edit entry">
			<text>库存</text>
			<input type="number" v-model="item.stock" placeholder="请输入库存" placeholder-class="I-style" cursor-spacing="50">
			<text>件</text>
		</view>
		<!-- 上传图片 -->
		<view class="specs-image">
			<image src="/static/detail/shuxing-img.png" mode="aspectFill" v-if="item.image == '' " @click="upLoad(index)"></image>
			<image :src="item.image" mode="aspectFill" v-else @click="preView(item.image)"></image>
			<image src="/static/detail/shanchu.svg" class="delete-img" mode="widthFix" v-if="item.image != '' " @click="dePicture(index)"></image>
		</view>
	</view>
	<!-- 添加规格 -->
	<view class="attribute gener new-specs" @click="newSpecs">
		<image src="/static/detail/jiahao.svg" mode="widthFix"></image>
		<text>规格</text>
	</view>
	<!-- 弹窗弹出设置属性 -->
	<page-container :show='show' bindenter="onEnter">
		<view class="space-view">
			<view class="modify-sub">
				<image src="/static/detail/guanbi.svg" mode="widthFix" @click="show = false"></image>
				<text>修改属性</text>
				<text @click="subMit">提交</text>
			</view>
			<view class="att-input" v-for="(item,index) in Sto_att.attobj" :key="index">
				<text>属性{{item.title}}</text>
				<input type="text" v-model="item.att" placeholder="输入属性" placeholder-class="I-style" cursor-spacing="50">
			</view>
		</view>
	</page-container>
	<!-- 底部按钮 -->
	<view style="height: 300rpx;"></view>
	<view class="newly-added-view">
		<view class="Submit">
			<text @click="cancel">取消</text>
			<text @click="preserve">保存</text>
		</view>
	</view>
</template>

<script setup>
	function onEnter(){}
	import {ref,reactive} from 'vue'
	// 控制弹窗框显示
	const show = ref(false)
	/* 存储sku数据 */
	const sku_data = reactive({//{att_name:'颜色',att_val:''}
		sku:[{title:1,att_data:[],price:'',stock:'',image:''}]
	})
	/* 创建的属性 */
	const Sto_att = reactive({attobj:[{att:'',title:1},{att:'',title:2},{att:'',title:3}]})
	/* 多选框的值 */
	const attribute = reactive({selected:[]})
	// 提交属性
	function subMit(){
		// 如果用户重新设置属性，那么就要让规格归位，清空
		sku_data.sku = [{title:1,att_data:[],price:'',stock:'',image:''}]
		// 过滤填写的规格
		const filter = Sto_att.attobj.filter(item=>item.att != '')
		const new_arr = []
		filter.forEach(item=>{
			new_arr.push({att:item.att,name:item.att,checked:true})
		})
		attribute.selected = new_arr
		show.value = false
		// 计算生成动态规格
		calsku()
	}
	
	// 计算生成动态规格
	function calsku(){
		let filter_arr = attribute.selected.filter(item=>item.checked)
		let new_att = filter_arr.map(item=>{return{att_name:item.att,att_val:''}})
		sku_data.sku.forEach(item=>{
			item.att_data = JSON.parse(JSON.stringify(new_att))
		})
	}
	
	// 新增规格
	function newSpecs(){
		let num = sku_data.sku[sku_data.sku.length - 1].title
		num++
		const new_sku = {title:num,att_data:[],price:'',stock:'',image:''}
		sku_data.sku.push(new_sku)
		// 向att_data添加属性
		let filter_arr = attribute.selected.filter(item=>item.checked)
		let new_att = filter_arr.map(item=>{return{att_name:item.att,att_val:''}})
		sku_data.sku[sku_data.sku.length - 1].att_data = JSON.parse(JSON.stringify(new_att))
	}
	
	// 删除规格
	function deleteSku(index){
		sku_data.sku.splice(index,1)
		sku_data.sku.forEach((item,index)=>{item.title = index + 1})
	}
	
	// 更改多选框的checked选中和取消选中
	function chEchange(e){
		let value = e.detail.value//只留下已选中的
		attribute.selected.forEach((iteming,index)=>{
			let item = attribute.selected[index]
			if(value.includes(iteming.att)){
				item.checked = true
			}else{
				item.checked = false
			}
		})
	}
	
	// 选中和取消选中重新计算规格数组
	function fInd(att,checked){
		if(checked){//选中
			sku_data.sku.forEach(item=>{
				item.att_data.push({att_name:att,att_val:''})
			})
		}else{//未选中
			sku_data.sku.forEach((item_a,index_a)=>{
				item_a.att_data.forEach((item_b,index_b)=>{
					if(item_b.att_name == att){
						sku_data.sku[index_a].att_data.splice(index_b,1)
					}
				})
			})
		}
	}
	
	// 上传图片
	import {Upload,Feedback} from '@/Acc-config/media.js'
	async function upLoad(index){
		try{
			let local = await new Upload().image()
			wx.showLoading({title: '正在上传',mask:true})
			let res = await new Upload().cloud(local[0].tempFilePath)
			sku_data.sku[index].image = res
			wx.hideLoading()
		}catch(e){
			new Feedback('上传失败').toast()
		}
	}
	
	// 删除图片
	function dePicture(index){
		sku_data.sku[index].image = ''
	}
	
	// 预览图片
	function preView(image){
		new Upload().preview(image,[image])
	}
	
	// 提交
	import {sku_val} from '@/Acc-config/answer.js'
	function preserve(){
		// 1.属性未选
		if(attribute.selected.length == 0){
			new Feedback('规格设置不完善').toast()
			return false
		}else if(attribute.selected.length > 0){//2.属性已有，但没有勾选
			const checked = attribute.selected.filter(item=>item.checked)
			if(checked.length == 0){
				new Feedback('规格设置不完善').toast()
				return false
			}else{//3.规格未填写
				const price = sku_data.sku.filter(item=>item.price == '')
				if(price.length > 0){
					new Feedback('规格设置不完善').toast()
					return false
				}
				const stock = sku_data.sku.filter(item=>item.stock == '')
				if(stock.length > 0){
					new Feedback('规格设置不完善').toast()
					return false
				}
				const image = sku_data.sku.filter(item=>item.image == '')
				if(image.length > 0){
					new Feedback('规格设置不完善').toast()
					return false
				}
				let array = []
				sku_data.sku.forEach(item=>{
					const filter = item.att_data.filter(iteming=>iteming.att_val == '')
					array.push(...filter)
				})
				if(array.length > 0){
					new Feedback('规格设置不完善').toast()
					return false
				}
			}
		}
		sku_data.sku.forEach(item=>{
			item.price = Number(item.price)
			item.stock = Number(item.stock)
		})
		// console.log(sku_data.sku)
		sku_val.value = sku_data.sku
		wx.navigateBack({delta: 1})
	}
	
	// 取消
	function cancel(){
		wx.navigateBack({delta: 1})
	}
	
	import {onLoad} from '@dcloudio/uni-app'
	onLoad((event)=>{
		let Arr = JSON.parse(event.sku)
		if(Arr.length <= 0)return false
		// 把数据传给弹窗里的属性
		const new_arr = Arr[0].att_data.map((item,index)=>{
			return{att:item.att_name,title:index + 1}
		})
		Sto_att.attobj = new_arr
		if(Arr[0].att_data.length == 1){
			Sto_att.attobj.push({att:'',title:2},{att:'',title:3})
		}else if(Arr[0].att_data.length == 2){
			Sto_att.attobj.push({att:'',title:3})
		}
		subMit()
		sku_data.sku = Arr
	})
	
</script>

<style>
page{
	background-color: #ededed;
}
.attribute{
	background-color: #f7f7f7;
	margin: 20rpx;
	padding: 20rpx 20rpx 0 20rpx;
	border-radius: 8rpx;
}
.edit{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.edit text:nth-child(1){
	color: #a8a8a8;
}
.edit text:nth-child(2){
	color: #616990;
}
.checkbox{
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding-top: 20rpx;
}
.checkbox label{
	padding: 0 40rpx 20rpx 0;
}
/* 规格生成*/
.gener{
	background-color: #FFFFFF !important;
}
.specs-delete text:nth-child(1){
	color: #333333 !important;
	font-weight: bold;
}
.specs-delete{
	padding-bottom: 20rpx;
}
.entry{
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f1f1f1;
}
.entry text{
	color: #333333 !important;
}
.entry text:nth-child(1){
	flex: 1;
}
.entry input{
	padding: 0 20rpx;
	text-align: right;
}
.I-style{
	color: #a8a8a8;
}
.specs-image{
	display: flex;
	justify-content: space-between;
}
.specs-image image{
	display: block;
	width: 150rpx;
	height: 150rpx;
	border-radius: 8rpx;
	padding: 20rpx 0;
}
.delete-img{
	width: 40rpx !important;
	height: 40rpx !important;
}
/* 新增规格 */
.new-specs image{
	width: 50rpx;
	height: 50rpx;
	margin-right: 20rpx;
}
.new-specs{
	display: flex;
	align-items: center;
	color: #5f698c;
	padding: 30rpx !important;
}
/* 修改属性 */
.att-input{
	display: flex;
	align-items: center;
	padding: 40rpx 0;
	border-bottom: 1rpx solid #e7e7e7;
}
.att-input text{
	flex: 1;
}
.att-input input{
	text-align: right;
}
/* 底部提交 */
.Submit{
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 10rpx 20rpx 68rpx 20rpx;
}
.Submit text{
	padding: 15rpx 60rpx;
	border-radius: 10rpx;
}
.Submit text:nth-child(1){
	background-color: #f7f7f7;
	color: #ce6b4e;
	margin-right: 30rpx;
}
.Submit text:nth-child(2){
	background-color: #ed6b51;
	color: #FFFFFF;
}
</style>