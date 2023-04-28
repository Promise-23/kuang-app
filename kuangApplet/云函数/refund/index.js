// 云函数入口文件：部署在商户端
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'lingshi-admin-6gvot3wh7e4ac9b5'
  }
)

var {nonceStr,ouTrefundno} = require('./public.js')

// 云函数入口函数:申请退款
exports.main = async (event, context) => {
  
  const res = await cloud.cloudPay.refund({
    functionName:'paycallback',
    envId:'lingshi-admin-6gvot3wh7e4ac9b5',
    sub_mch_id:'1523993881',
    nonce_str:nonceStr(),
    out_trade_no:event.out_trade_no,//前端传来的商户订单号
    out_refund_no:ouTrefundno(),//商户退款单号
    total_fee:event.total_fee * 100,//订单金额
    refund_fee:event.refund_fee * 100,//申请退款金额
  })

  if(res.returnCode == 'SUCCESS' && res.resultCode == 'SUCCESS'){
    // 申请退款成功
    return{code:200,msg:'退款申请成功',out_refund_no:res.outRefundNo}
  }else{
    // 申请退款失败
    return{code:4001,msg:'退款申请失败',errCodeDes:res}
  }

}