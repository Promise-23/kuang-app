"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "BackTop",
  props: { style: Object },
  setup(__props) {
    const showArrowTopBtn = common_vendor.ref(false);
    common_vendor.onPageScroll((e) => {
      if (e.scrollTop >= 200) {
        showArrowTopBtn.value = true;
      } else {
        showArrowTopBtn.value = false;
      }
    });
    function backTop() {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        // 滚动到页面的目标位置  这个是滚动到顶部, 0 
        duration: 300
        // 滚动动画的时长
      });
    }
    return (_ctx, _cache) => {
      return {
        a: showArrowTopBtn.value,
        b: common_vendor.o(backTop)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47b803c6"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/Common-component/UI/BackTop.vue"]]);
wx.createComponent(Component);
