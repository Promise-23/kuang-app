"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  Coupon();
}
const Coupon = () => "../Common-component/UI/Coupon.js";
const _sfc_main = {
  __name: "coupon-view",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    enableCoupons: {
      type: Array
    },
    disableCoupons: {
      type: Array
    },
    getAble: {
      type: Boolean,
      default: true
    }
  },
  emits: ["close", "setSelectedCoupon"],
  setup(__props, { emit: emits }) {
    function cancel() {
      emits("close");
    }
    const data = common_vendor.reactive({
      tab_name: ["可用优惠券", "不可用优惠券"],
      trigger: 0
    });
    const { tab_name, trigger } = common_vendor.toRefs(data);
    function swItch(index) {
      data.trigger = index;
    }
    function goCenter() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/welfare/center"
      });
    }
    const selectCoupon = common_vendor.ref();
    function handleSelect(coupon) {
      var _a;
      console.log("selectCoupon?._id == coupon._id", (selectCoupon == null ? void 0 : selectCoupon._id) == coupon._id);
      if (((_a = selectCoupon == null ? void 0 : selectCoupon.value) == null ? void 0 : _a._id) == coupon._id) {
        selectCoupon.value = null;
      } else {
        selectCoupon.value = coupon;
      }
      emits("setSelectedCoupon", selectCoupon.value);
      cancel();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.show
      }, __props.show ? {
        b: common_vendor.o(cancel),
        c: common_vendor.o(goCenter),
        d: common_vendor.o(cancel),
        e: common_vendor.f(common_vendor.unref(tab_name), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index == common_vendor.unref(trigger) ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => swItch(index), index)
          };
        }),
        f: common_vendor.f(__props.enableCoupons, (item, index, i0) => {
          var _a;
          return {
            a: "c24c50e2-0-" + i0,
            b: common_vendor.p({
              coupon: item,
              selected: ((_a = selectCoupon.value) == null ? void 0 : _a._id) == (item == null ? void 0 : item._id)
            }),
            c: index,
            d: common_vendor.o(($event) => handleSelect(item), index)
          };
        }),
        g: __props.enableCoupons.length == 0,
        h: common_vendor.unref(trigger) == 0,
        i: common_vendor.f(__props.disableCoupons, (item, index, i0) => {
          return {
            a: index,
            b: "c24c50e2-1-" + i0,
            c: common_vendor.p({
              coupon: item
            })
          };
        }),
        j: __props.disableCoupons.length == 0,
        k: common_vendor.unref(trigger) == 1
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c24c50e2"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/components/coupon-view.vue"]]);
wx.createComponent(Component);
