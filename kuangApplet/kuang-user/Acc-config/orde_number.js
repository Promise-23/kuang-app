
// 商户订单号
let outTradeno = function(){
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let maxPos = chars.length;
  let  res = '';
  for(let i = 0; i< 32; i++){
     res += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return res
}

// 订单编号
let coDe = function(){
	let code = ''
	for (let i = 0; i < 6; i++){
		code += Math.floor(Math.random() * 10)
	}
	code = new Date().getTime() + code
	return code
}

export {outTradeno,coDe}