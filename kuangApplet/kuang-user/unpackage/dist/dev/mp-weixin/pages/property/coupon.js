"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "coupon",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    common_vendor.onMounted(() => {
      getCoupon();
    });
    const data = common_vendor.reactive({ user_infor: common_vendor.wx$1.getStorageSync("user_infor") || {}, coupon_detail: [] });
    const { user_infor, coupon_detail } = common_vendor.toRefs(data);
    async function getCoupon() {
      const res = await db.collection("coupon_detail").get();
      console.log("couponDetail", res.data);
      data.coupon_detail = res.data;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(user_infor).coupon || 0),
        b: common_vendor.f(common_vendor.unref(coupon_detail), (item, index, i0) => {
          return {
            a: common_vendor.t(item.desc),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.type == "add" ? "+" : "-"),
            d: common_vendor.t(item.num),
            e: index
          };
        }),
        c: common_vendor.unref(coupon_detail).length > 0,
        d: common_vendor.unref(coupon_detail).length == 0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7e6ee5ac"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/property/coupon.vue"]]);
wx.createPage(MiniProgramPage);
