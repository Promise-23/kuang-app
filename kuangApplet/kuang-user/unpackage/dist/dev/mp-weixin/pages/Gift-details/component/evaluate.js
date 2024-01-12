"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "evaluate",
  props: { eav_num: Number, eav_data: Array },
  setup(__props) {
    function juMp(eav_data) {
      if (eav_data.length > 0) {
        common_vendor.wx$1.navigateTo({
          url: "/pages/Eva-details/details?goods_id=" + eav_data[0].goods_id
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.eav_num),
        b: __props.eav_num > 0
      }, __props.eav_num > 0 ? {
        c: common_vendor.f(__props.eav_data, (item, index, i0) => {
          return {
            a: item.avatarurl,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(item.eav_text),
            d: common_vendor.f(item.eav_image, (item_a, index_a, i1) => {
              return {
                a: item_a.image,
                b: index_a
              };
            }),
            e: index
          };
        })
      } : {}, {
        d: common_vendor.o(($event) => juMp(__props.eav_data))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4d2fa001"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Gift-details/component/evaluate.vue"]]);
wx.createComponent(Component);
