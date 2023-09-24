"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "flash-sale",
  props: { seckill: Array },
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
        a: common_vendor.f(__props.seckill, (item, index, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.price_spike),
            d: common_vendor.t(item.ori_price),
            e: index,
            f: common_vendor.o(($event) => juMp(item.goods_id, item.video_url), index)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-000992ed"], ["__file", "/Users/hujie/Documents/Kuang+/kuang-app/kuangApplet/kuang-user/pages/index/component/flash-sale.vue"]]);
wx.createComponent(Component);
