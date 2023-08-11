"use strict";
const common_vendor = require("../common/vendor.js");
let inIt = function() {
  return new Promise(async (resolve, reject) => {
    var res = new common_vendor.wx$1.cloud.Cloud({
      // 用户端 AppID
      resourceAppid: "wxf627a4c6489c75f5",
      // 用户端环境 ID
      resourceEnv: "kuang-user-6g2o2xcc9991491f"
    });
    await res.init();
    await res.callFunction({
      name: "cloudbase_auth",
      data: {}
    });
    resolve(res);
  });
};
exports.inIt = inIt;
