// 云函数入口文件：部署在商户端
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'lingshi-admin-6gvot3wh7e4ac9b5'
  }
)

const {nonceStr} = require('./pubilc')

// 云函数入口函数:查询退款
exports.main = async (event, context) => {
  
  const res = await cloud.cloudPay.queryRefund({
    sub_mch_id:'1523993881',
    nonce_str:nonceStr(),
    out_refund_no:event.out_refund_no//商户退款单号
  })

  if(res.returnCode == 'SUCCESS'){
    if(res.resultCode == 'SUCCESS'){
      return {msg:'退款成功'}
    }else{
      return {msg:'退款处理中'}
    }
  }else{
    return {msg:'退款失败',error:res}
  }
}