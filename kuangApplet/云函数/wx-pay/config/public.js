const crypto = require('crypto')

// 随机字符串
let noncestr = function(){
  const buf = crypto.randomBytes(16)
  return buf.toString('hex')
}



module.exports = {noncestr}