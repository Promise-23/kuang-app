"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "Coupon",
  props: {
    coupon: {
      type: Object
    },
    getAble: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ["refrshData"],
  setup(__props, { emit: emits }) {
    const typeObj = { pay: "支付券", full: "满减券", limit: "商品券" };
    const db = common_vendor.wx$1.cloud.database();
    const _ = db.command;
    async function getCoupon(coupon) {
      console.log("getCoupon", coupon);
      await db.collection("coupon_center").doc(coupon._id).update({ data: {
        getNum: _.inc(1)
      } });
      emits("refrshData");
      setTimeout(() => {
        common_vendor.wx$1.showToast({
          title: "领取成功!"
        });
      }, 300);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.coupon.price),
        b: common_vendor.t(typeObj[__props.coupon.type] || "支付券"),
        c: common_vendor.t(__props.coupon.desc),
        d: common_vendor.t(Array.from(__props.coupon.time).join(" - ")),
        e: common_vendor.t(__props.coupon.remark || "仅线上购物可用"),
        f: __props.getAble,
        g: common_vendor.o(($event) => getCoupon(__props.coupon)),
        h: __props.selected,
        i: common_vendor.o((...args) => _ctx.cancel && _ctx.cancel(...args))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1c43fa4"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Common-component/UI/Coupon.vue"]]);
wx.createComponent(Component);
