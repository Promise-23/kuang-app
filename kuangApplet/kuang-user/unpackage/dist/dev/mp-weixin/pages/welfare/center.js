"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Coupon();
}
const Coupon = () => "../Common-component/UI/Coupon.js";
const _sfc_main = {
  __name: "center",
  setup(__props) {
    common_vendor.hooks.locale("zh-cn");
    const db = common_vendor.wx$1.cloud.database();
    const data = common_vendor.reactive({ coupons: [] });
    const { coupons } = common_vendor.toRefs(data);
    async function getCoupons() {
      var _a;
      const res = await db.collection("coupon_center").get();
      const rightTimeList = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.filter((item) => !AccConfig_answer.myCoupons.hasCouponId.includes(item._id) && transferTime(item.time[0]) <= currentTime() && transferTime(item.time[1]) >= currentTime());
      console.log("rightTimeList", rightTimeList);
      data.coupons = rightTimeList.filter((item) => !item.getNum || item.getNum <= item.num);
    }
    common_vendor.onMounted(() => {
      getAlreadyCouponId();
    });
    common_vendor.toRefs(AccConfig_answer.myCoupons);
    async function getAlreadyCouponId() {
      var _a;
      const mc = await db.collection("coupon_detail").get();
      console.log("myCoupons", mc);
      AccConfig_answer.myCoupons.hasCouponId = (_a = mc == null ? void 0 : mc.data) == null ? void 0 : _a.map((item) => item.couponId);
      getCoupons();
    }
    function currentTime() {
      const date = common_vendor.hooks().format("YYYY-MM-DD");
      return transferTime(date);
    }
    function transferTime(time) {
      return Math.round(common_vendor.hooks(time, "YYYY-MM-DD").valueOf() / 1e3);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(coupons), (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(getAlreadyCouponId, index),
            c: "43e4cd89-0-" + i0,
            d: common_vendor.p({
              coupon: item,
              getAble: true
            })
          };
        }),
        b: common_vendor.unref(coupons).length == 0
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-43e4cd89"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/welfare/center.vue"]]);
wx.createPage(MiniProgramPage);
