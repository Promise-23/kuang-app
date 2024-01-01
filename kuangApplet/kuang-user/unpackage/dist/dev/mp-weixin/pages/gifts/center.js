"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  (Card + BackTop)();
}
const Card = () => "../Common-component/Card-goods.js";
const BackTop = () => "../Common-component/UI/BackTop.js";
const _sfc_main = {
  __name: "center",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    common_vendor.onMounted(() => {
      goods();
    });
    const result = common_vendor.reactive({ sort: [], card: [] });
    const { sort, seckill, card } = common_vendor.toRefs(result);
    const active = common_vendor.ref(0);
    async function goods() {
      const sort2 = await db.collection("gifts_sort").get();
      const card2 = await db.collection("gifts").where({ shelves: true }).limit(10).field({ goods_cover: true, goods_price: true, goods_title: true, sold: true, video_url: true }).orderBy("sold", "desc").get();
      Promise.all([sort2, card2]).then((res) => {
        result.sort = res[0].data;
        result.card = res[1].data;
      }).catch((err) => {
        console.log(err);
      });
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      const res_goods = await db.collection("gifts").where({ shelves: true }).limit(10).skip(sk).field({ goods_cover: true, goods_price: true, goods_title: true, sold: true, video_url: true }).orderBy("sold", "desc").get();
      result.card = [...result.card, ...res_goods.data];
      loading.value = false;
    });
    function goDetail(type) {
      const url = `/pages/property/integral`;
      console.log("goDetail", url);
      common_vendor.wx$1.navigateTo({
        url
      });
    }
    function handleChangeTab(index) {
      active.value = index;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(AccConfig_answer.myIntegral).count || 0),
        b: common_vendor.o(($event) => goDetail()),
        c: common_vendor.f(common_vendor.unref(sort), (item, index, i0) => {
          return {
            a: common_vendor.t(item.sort_name),
            b: index == active.value ? 1 : "",
            c: common_vendor.o(($event) => handleChangeTab(index), index),
            d: index
          };
        }),
        d: common_vendor.f(common_vendor.unref(card), (item, index, i0) => {
          return {
            a: "78ff92d2-0-" + i0,
            b: common_vendor.o(($event) => _ctx.juMp(item.goods_id, item.video_url), index),
            c: index
          };
        }),
        e: common_vendor.p({
          card: common_vendor.unref(card)
        }),
        f: common_vendor.o((...args) => _ctx.swiperFun && _ctx.swiperFun(...args))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/gifts/center.vue"]]);
wx.createPage(MiniProgramPage);
