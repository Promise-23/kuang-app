
// 随机字符串
let nonceStr = function(){
  let chars = 'ABCDEFGHIJKLMNUPQRSTUVWYZabcdefghijklmn2345678'
  let maxPos = chars.length
  let res = ''
  for(let i = 0; i < 32; i++){
    res += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return res
}

// 商户退款单号
let ouTrefundno = function(){
  let chars = 'ABCDEFGHIJKLMNUPQRSTUVWYZabcdefghijklmn2345678_-'
  let maxPos = chars.length
  let res = ''
  for(let i = 0; i < 40; i++){
    res += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return res
}

module.exports = {nonceStr,ouTrefundno}