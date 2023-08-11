"use strict";
let outTradeno = function() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let maxPos = chars.length;
  let res = "";
  for (let i = 0; i < 32; i++) {
    res += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return res;
};
let coDe = function() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  code = (/* @__PURE__ */ new Date()).getTime() + code;
  return code;
};
exports.coDe = coDe;
exports.outTradeno = outTradeno;
