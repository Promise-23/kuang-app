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


module.exports = {nonceStr}