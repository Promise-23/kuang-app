"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../Acc-config/public.js");
const _sfc_main = {
  __name: "integral",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    common_vendor.onMounted(() => {
      getIntegral();
    });
    const data = common_vendor.reactive({ user_infor: common_vendor.wx$1.getStorageSync("user_infor") || {}, integral_detail: [] });
    const { user_infor, integral_detail } = common_vendor.toRefs(data);
    async function getIntegral() {
      const res = await db.collection("integral_detail").get();
      console.log("integralDetail", res.data);
      data.integral_detail = res.data;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(user_infor).integral || 0),
        b: common_vendor.f(common_vendor.unref(integral_detail), (item, index, i0) => {
          return {
            a: common_vendor.t(item.desc),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.type == "add" ? "+" : "-"),
            d: common_vendor.t(item.num),
            e: index
          };
        }),
        c: common_vendor.unref(integral_detail).length > 0,
        d: common_vendor.unref(integral_detail).length == 0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1726e80"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/property/integral.vue"]]);
wx.createPage(MiniProgramPage);
