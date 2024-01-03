"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Array) {
  const _component_brand_icon = common_vendor.resolveComponent("brand-icon");
  _component_brand_icon();
}
if (!Math) {
  BackTop();
}
const BackTop = () => "../Common-component/UI/BackTop.js";
const _sfc_main = {
  __name: "center",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    const _ = db.command;
    common_vendor.onMounted(() => {
      goods();
    });
    const result = common_vendor.reactive({ sort: [], cards: [[]] });
    const { sort, cards } = common_vendor.toRefs(result);
    const active = common_vendor.ref(0);
    async function goods() {
      common_vendor.wx$1.showLoading();
      const sort2 = await db.collection("goods_sort").where({ quantity: _.gt(0) }).get();
      result.sort = sort2.data;
      const resArr = [];
      result.sort.forEach((item) => {
        const card = db.collection("goods").where({ shelves: true, category: item.sort_name }).limit(10).field({ goods_cover: true, goods_price: true, goods_title: true, sold: true, video_url: true }).orderBy("sold", "desc").get();
        resArr.push(card);
      });
      console.log("resArr", resArr);
      Promise.all(resArr).then((res) => {
        common_vendor.wx$1.hideLoading();
        result.cards = res.map((r) => r.data);
        console.log("result", result);
      }).catch((err) => {
        console.log(err);
      });
    }
    common_vendor.ref(false);
    common_vendor.ref(0);
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
    function juMp(goods_id, video_url) {
      if (video_url == "") {
        console.log("跳转详情页");
        common_vendor.wx$1.navigateTo({
          url: `/pages/Product-details/details?goods_id=${goods_id}&type=gift`
        });
      } else {
        common_vendor.wx$1.navigateTo({
          url: `/pages/Short-video/video?goods_id=${goods_id}&type=gift`
        });
      }
    }
    function swiperFun(e) {
      active.value = e.detail.current;
      console.log("active", active.value);
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
        d: common_vendor.f(common_vendor.unref(cards), (card, i, i0) => {
          return common_vendor.e({
            a: common_vendor.f(card, (item, index, i1) => {
              return {
                a: item.goods_cover,
                b: "21f13641-0-" + i0 + "-" + i1,
                c: common_vendor.t(item.goods_title),
                d: common_vendor.t(item.goods_price),
                e: common_vendor.t(item.sold),
                f: index,
                g: common_vendor.o(($event) => juMp(item._id, item.video_url), index)
              };
            }),
            b: card.length == 0
          }, card.length == 0 ? {} : {}, {
            c: i,
            d: i
          });
        }),
        e: active.value,
        f: common_vendor.o(swiperFun)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Project/kuang-app/kuangApplet/kuang-user/pages/gifts/center.vue"]]);
wx.createPage(MiniProgramPage);
