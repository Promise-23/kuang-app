"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "image",
  props: { goods_details: Array },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.goods_details, (item, index, i0) => {
          return {
            a: item.image,
            b: index
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-359d0f06"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Product-details/component/image.vue"]]);
wx.createComponent(Component);
