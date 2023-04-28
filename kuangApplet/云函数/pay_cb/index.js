// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lingshi-user-7gkobalb5f401248'
})

const db = cloud.database()
const _ = db.command

// 接收异步通知的云函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  let {resultCode,returnCode} = event
  // 判断该笔交易是否成功
  if(resultCode == 'SUCCESS' && returnCode == 'SUCCESS'){
      // 支付成功
      await db.collection('user_infor').where({_openid:wxContext.OPENID}).update({data:{watch_num:_.inc(1),pay:true}})
      return {errcode:0,errmsg:'支付成功'}
  }
  
}