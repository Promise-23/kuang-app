"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/order/order.js";
  "./pages/seckill-admin/seckill.js";
  "./pages/banner-amdin/banner.js";
  "./pages/goods-list/list.js";
  "./pages/commodity/commodity.js";
  "./pages/goods-admin/goods.js";
  "./pages/specs/specs.js";
  "./pages/sort-admin/sort.js";
  "./pages/coupon-manage/coupon.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.wx$1.cloud.init({
      env: "lingshi-admin-6gvot3wh7e4ac9b5",
      traceUser: true
    });
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-admin/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
