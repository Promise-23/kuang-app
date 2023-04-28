"use strict";
const common_vendor = require("../common/vendor.js");
let inIt = function() {
  return new Promise(async (resolve, reject) => {
    var res = new common_vendor.wx$1.cloud.Cloud({
      // 用户端 AppID
      resourceAppid: "wx72a2b830a0d427a8",
      // 用户端环境 ID
      resourceEnv: "kuang-user-3gwx0hw999ca1b62"
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
