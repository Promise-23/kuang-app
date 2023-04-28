"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "swiper",
  props: { banner: Array },
  setup(__props) {
    const num = common_vendor.ref(0);
    function swiperFun(e) {
      num.value = e.detail.current;
    }
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
        a: common_vendor.f(__props.banner, (item, index, i0) => {
          return {
            a: item.banner_cover,
            b: common_vendor.o(($event) => juMp(item.goods_id, item.video_url), index),
            c: index
          };
        }),
        b: common_vendor.o(swiperFun),
        c: common_vendor.f(__props.banner, (item, index, i0) => {
          return {
            a: index == num.value ? 1 : "",
            b: index
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e785d8dd"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-user/pages/index/component/swiper.vue"]]);
wx.createComponent(Component);
