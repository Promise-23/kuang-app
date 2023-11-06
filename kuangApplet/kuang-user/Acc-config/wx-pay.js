


// 需要提交到数据库的订单数据
import {reactive} from 'vue'
const db = wx.cloud.database()
const _ = db.command

let order_data = reactive({
	address:[],
	order_time:'',
	query_time:'',
	pay_success:'not_pay',
	deliver:'stay',
	evaluate:false,
	waybill_No:'',
	payment:{},
	Re_reason:'',
	out_trade_no:'',
	out_refund_no:''
})



class Wxpay{
	
	// 请求云函数：获取统一下单返回的数据
	async pLace(price,outTradeno){
		try{
			const res = await wx.cloud.callFunction({name:'wx-pay',data:{price,outTradeno}})
			return res
		}catch(err){
			return {msg:'请求统一下单云函数出错',err}
		}
	}
	
	// 提交订单到数据库
	suBmit(order,payment,address,time,query_time,out_trade_no){
		order_data.payment = payment
		order_data.address = address
		order_data.order_time = time
		order_data.query_time = query_time
		order_data.out_trade_no = out_trade_no
		// *需要考虑购物车的数据
		var new_order = order.map(item=>{
			return {...item,...order_data}
		})
		return new Promise((resolve,reject)=>{
			new_order.forEach((item,index)=>{
				try{
					db.collection('order_data').add({data:item})
					if(index == new_order.length - 1){
						resolve('success')
					}
				}catch(err){
					reject(err)
				}
			})
		})
	}
	
	// 发起支付
	payMent(payment){
		return new Promise((resolve,reject)=>{
			wx.requestPayment({
				...payment,
				success(res){
					resolve(res)
				},
				fail(err){
					reject(err)
				}
			})
		})
	}

	// 支付成功或者取消支付更改订单字段为成功
	async staTe(value,out_trade_no){
		const user = wx.getStorageSync('user_infor')//取出本地缓存的用户信息
		if(value == 'success'){
			await db.collection('order_data').where({_openid:user._openid,out_trade_no}).update({
				data:{pay_success:'success'}
			})
			return 'success'
		}else{
			await db.collection('order_data').where({_openid:user._openid,out_trade_no}).update({
				data:{pay_success:'not_pay'}
			})
			return 'success'
		}
	}

	// 支付成功：库存自减，售出自增
	resTock(order){
		return new Promise((resolve,reject)=>{
			order.forEach(async(item,index)=>{
				try{
					await db.collection('goods').doc(item.goods_id).update({data:{stock:_.inc(-item.buy_amount),sold:_.inc(item.buy_amount)}})
					// 如果有规格：库存自减
					await db.collection('sku_data').where({sku_id:item.goods_id,'sku.att_data':_.eq(item.specs)}).update({data:{'sku.$.stock':_.inc(item.buy_amount)}})
					if(index == order.length - 1){
						resolve('success')
					}
				}catch(err){
					reject(err)
				}
			})
		})
	}
	
	//删除购物车的下单商品数据
	deleteCart(order){
		return new Promise((resolve,reject)=>{
			order.forEach(async(item,index)=>{
				try{
					await db.collection('sh_cart').doc(item._id).remove()
					if(index == order.length - 1){
						resolve('success')
					}
				}catch(err){
					reject(err)
				}
			})
		})
	}

}

export {Wxpay}