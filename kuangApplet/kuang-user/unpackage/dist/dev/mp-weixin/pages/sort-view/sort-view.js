"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  Loading();
}
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "sort-view",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    const _ = db.command;
    common_vendor.onMounted(() => {
      getSort();
    });
    const data = common_vendor.reactive({ sort_list: [], sotr_goods: [] });
    const { sort_list, sotr_goods } = common_vendor.toRefs(data);
    let OBJ = { goods_cover: true, goods_price: true, goods_title: true };
    async function getSort() {
      const res_sort = await db.collection("goods_sort").where({ quantity: _.gt(0) }).get();
      const res_goods = await db.collection("goods").where({ category: res_sort.data[0].sort_name }).field(OBJ).limit(10).get();
      data.sort_list = res_sort.data;
      data.sotr_goods = res_goods.data;
    }
    const select = common_vendor.ref(0);
    async function seLect(index, sort_name) {
      page_n.value = 0;
      select.value = index;
      const res_goods = await db.collection("goods").where({ category: sort_name }).field(OBJ).limit(10).get();
      data.sotr_goods = res_goods.data;
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      const res_goods = await db.collection("goods").where({ category: data.sort_list[select.value].sort_name }).field(OBJ).limit(10).skip(sk).get();
      data.sotr_goods = [...data.sotr_goods, ...res_goods.data];
      loading.value = false;
    });
    function juMp(_id) {
      common_vendor.wx$1.navigateTo({
        url: `/pages/Product-details/details?goods_id=${_id}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(sort_list), (item, index, i0) => {
          return {
            a: common_vendor.t(item.sort_name),
            b: index,
            c: common_vendor.o(($event) => seLect(index, item.sort_name), index),
            d: common_vendor.n(select.value == index ? "Select-style" : "")
          };
        }),
        b: common_vendor.unref(sort_list).length > 0
      }, common_vendor.unref(sort_list).length > 0 ? {
        c: common_vendor.t(common_vendor.unref(sort_list)[select.value].sort_name)
      } : {}, {
        d: common_vendor.f(common_vendor.unref(sotr_goods), (item, index, i0) => {
          return {
            a: item.goods_cover,
            b: common_vendor.t(item.goods_title),
            c: common_vendor.t(item.goods_price),
            d: index,
            e: common_vendor.o(($event) => juMp(item._id), index)
          };
        }),
        e: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-466d4362"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/sort-view/sort-view.vue"]]);
wx.createPage(MiniProgramPage);
