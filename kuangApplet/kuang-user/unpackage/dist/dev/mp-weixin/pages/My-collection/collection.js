"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (Card + Loading)();
}
const Card = () => "../Common-component/Card-goods.js";
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "collection",
  setup(__props) {
    const data = common_vendor.reactive({ card: [] });
    const { card } = common_vendor.toRefs(data);
    common_vendor.onShow(() => {
      data.card = [];
      getData();
    });
    async function getData(skip = 0) {
      const res = await common_vendor.wx$1.cloud.callFunction({ name: "my-collection", data: { skip } });
      console.log("收藏", res);
      data.card = [...data.card, ...res.result];
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await getData(sk);
      loading.value = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          card: common_vendor.unref(card)
        }),
        b: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        c: common_vendor.unref(card).length == 0
      }, common_vendor.unref(card).length == 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/hujie/Documents/Kuang+/kuang-app/kuangApplet/kuang-user/pages/My-collection/collection.vue"]]);
wx.createPage(MiniProgramPage);
