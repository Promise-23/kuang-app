"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  common_vendor.unref(BrandIcon)();
}
const BrandIcon = () => "./UI/BrandIcon.js";
const _sfc_main = {
  __name: "Card-goods",
  props: { card: Array },
  setup(__props) {
    function juMp(goods_id, video_url) {
      if (video_url == "") {
        console.log("跳转详情页");
        common_vendor.wx$1.navigateTo({
          url: `/pages/Product-details/details?goods_id=${goods_id}`
        });
      } else {
        common_vendor.wx$1.navigateTo({
          url: `/pages/Short-video/video?goods_id=${goods_id}`
        });
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.card, (item, index, i0) => {
          return {
            a: item.goods_cover,
            b: "f18c2880-0-" + i0,
            c: common_vendor.t(item.goods_title),
            d: common_vendor.t(item.goods_price),
            e: common_vendor.t(item.sold),
            f: index,
            g: common_vendor.o(($event) => juMp(item._id, item.video_url), index)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f18c2880"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Common-component/Card-goods.vue"]]);
wx.createComponent(Component);
