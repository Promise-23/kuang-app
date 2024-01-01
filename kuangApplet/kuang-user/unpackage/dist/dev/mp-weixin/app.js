"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/my-page/my-page.js";
  "./pages/My-collection/collection.js";
  "./pages/shopping-cart/shopping-cart.js";
  "./pages/sort-view/sort-view.js";
  "./pages/Product-details/details.js";
  "./pages/Eva-details/details.js";
  "./pages/All-orders/order.js";
  "./pages/Order-tracking/tracking.js";
  "./pages/Eav-goods/goods.js";
  "./pages/Pay-view/pay.js";
  "./pages/Re-address/address.js";
  "./pages/Short-video/video.js";
  "./pages/Search-view/search.js";
  "./pages/property/integral.js";
  "./pages/property/coupon.js";
  "./pages/property/kcoin.js";
  "./pages/welfare/center.js";
  "./pages/gifts/center.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.wx$1.cloud.init({
      env: "kuang-user-6g2o2xcc9991491f",
      traceUser: true
    });
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
