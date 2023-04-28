// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lingshi-user-7gkobalb5f401248'
})
const {noncestr} = require('./config/public')

// 云函数入口函数
exports.main = async (event, context) => {
  // 统一下单
//  event：接收前端传来的数据
    const res = await cloud.cloudPay.unifiedOrder({
        "functionName":"pay_cb",//接收异步通知的云函数
        "envId":'lingshi-user-7gkobalb5f401248',
        "subMchId":'1523993881',
        "nonceStr":noncestr(),//随机字符串
        "body":'零食商城下单',
        "outTradeNo":event.outTradeno,//商户订单号=》小程序端传来
        "totalFee":event.price * 100,//单位为分:要支付的价格=》小程序端传来
        "spbillCreateIp":'127.0.0.1',
        "tradeType":'JSAPI'
    })
    return res.payment
}