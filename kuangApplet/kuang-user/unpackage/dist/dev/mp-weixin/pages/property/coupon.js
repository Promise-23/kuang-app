"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../Acc-config/public.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Coupon();
}
const Coupon = () => "../Common-component/UI/Coupon.js";
const _sfc_main = {
  __name: "coupon",
  setup(__props) {
    common_vendor.wx$1.cloud.database();
    const data = common_vendor.reactive({ user_infor: common_vendor.wx$1.getStorageSync("user_infor") || {} });
    common_vendor.toRefs(data);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(AccConfig_answer.myCoupons).data.length || 0),
        b: common_vendor.f(common_vendor.unref(AccConfig_answer.myCoupons).data, (item, index, i0) => {
          return {
            a: index,
            b: "7e6ee5ac-0-" + i0,
            c: common_vendor.p({
              coupon: item
            })
          };
        }),
        c: common_vendor.unref(AccConfig_answer.myCoupons).data.length > 0,
        d: common_vendor.unref(AccConfig_answer.myCoupons).data.length == 0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7e6ee5ac"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/property/coupon.vue"]]);
wx.createPage(MiniProgramPage);
