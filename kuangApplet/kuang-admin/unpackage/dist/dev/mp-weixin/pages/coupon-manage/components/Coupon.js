"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "Coupon",
  props: {
    coupon: {
      type: Object
    },
    // getAble: {
    // 	type: Boolean,
    // 	default: false
    // },
    // selected:{
    // 	type: Boolean,
    // 	default: false
    // },
    index: {
      type: Number
    }
  },
  emits: ["delete"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const typeObj = { pay: "支付券", full: "满减券", limit: "商品券" };
    common_vendor.wx$1.cloud.database();
    function deleteCoupon() {
      console.log("props.coupon", props.coupon);
      emits("delete", props.coupon._id, props.index);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.coupon.price),
        b: common_vendor.t(typeObj[__props.coupon.type] || "支付券"),
        c: common_vendor.t(__props.coupon.desc),
        d: common_vendor.t(__props.coupon.remark || "仅线上购物可用"),
        e: common_vendor.o(deleteCoupon)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-db08c39a"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-admin/pages/coupon-manage/components/Coupon.vue"]]);
wx.createComponent(Component);
