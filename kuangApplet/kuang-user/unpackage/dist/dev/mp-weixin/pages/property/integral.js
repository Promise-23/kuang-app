"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const _sfc_main = {
  __name: "integral",
  setup(__props) {
    const { data, count } = common_vendor.toRefs(AccConfig_answer.myIntegral);
    function goGiftsCenter() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/gifts/center"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(count) || 0),
        b: common_vendor.o(goGiftsCenter),
        c: common_vendor.f(common_vendor.unref(data), (item, index, i0) => {
          return {
            a: common_vendor.t(item.desc),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.type == "add" ? "+" : "-"),
            d: common_vendor.t(item.num),
            e: index
          };
        }),
        d: common_vendor.unref(data).length > 0,
        e: common_vendor.unref(data).length == 0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1726e80"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/property/integral.vue"]]);
wx.createPage(MiniProgramPage);
