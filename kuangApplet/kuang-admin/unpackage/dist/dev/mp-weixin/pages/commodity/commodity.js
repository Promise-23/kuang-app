"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_media = require("../../Acc-config/media.js");
if (!Math) {
  Loading();
}
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "commodity",
  setup(__props) {
    common_vendor.onShow(() => {
      gooDs();
    });
    const data = common_vendor.reactive({
      sort: [],
      //分类数据
      goods: [],
      //商品数据
      num: 0,
      sort_name: "",
      sort_id: ""
    });
    const { sort, goods, num } = common_vendor.toRefs(data);
    let field_obj = { goods_title: true, goods_cover: true, goods_price: true, stock: true, shelves: true };
    async function gooDs() {
      let DB = await AccConfig_init.inIt();
      const _ = DB.database().command;
      const res_sort = await DB.database().collection("goods_sort").where({ quantity: _.gt(0) }).field({ sort_name: true }).get();
      console.log(res_sort);
      const res_goods = await DB.database().collection("goods").where({ category: res_sort.data[0].sort_name }).limit(10).field(field_obj).get();
      console.log(res_goods);
      data.sort = res_sort.data;
      data.goods = res_goods.data;
      data.sort_name = res_sort.data[0].sort_name;
      data.sort_id = res_sort.data[0]._id;
      data.num = 0;
      page_n.value = 0;
    }
    async function seLect(index, sort_name, id) {
      data.num = index;
      data.sort_name = sort_name;
      data.sort_id = id;
      let DB = await AccConfig_init.inIt();
      const res_goods = await DB.database().collection("goods").where({ category: sort_name }).limit(10).field(field_obj).get();
      console.log(res_goods);
      data.goods = res_goods.data;
    }
    async function shelf(id, index) {
      let DB = await AccConfig_init.inIt();
      try {
        await DB.database().collection("goods").doc(id).update({ data: { shelves: false } });
        data.goods[index].shelves = false;
        const _ = DB.database().command;
        await DB.database().collection("goods_sort").doc(data.sort_id).update({ data: { quantity: _.inc(-1) } });
      } catch (e) {
        new AccConfig_media.Feedback("下架失败", "none").toast();
      }
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      let DB = await AccConfig_init.inIt();
      const res_goods = await DB.database().collection("goods").where({ category: data.sort_name }).limit(10).skip(sk).field(field_obj).get();
      data.goods = [...data.goods, ...res_goods.data];
      loading.value = false;
    });
    function rootSoRt() {
      common_vendor.wx$1.navigateTo({
        url: "/pages/sort-admin/sort"
      });
    }
    function rootGoods(id) {
      common_vendor.wx$1.navigateTo({
        url: "/pages/goods-admin/goods?id=" + id
      });
    }
    async function delGoods(id, index) {
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("goods").doc(id).remove();
        data.goods.splice(index, 1);
        await DB.database().collection("sku_data").where({ sku_id: id }).remove();
        const _ = DB.database().command;
        await DB.database().collection("goods_sort").doc(data.sort_id).update({ data: { quantity: _.inc(-1) } });
        new AccConfig_media.Feedback("删除成功", "success").toast();
      } catch (e) {
        new AccConfig_media.Feedback("删除失败").toast();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(sort), (item, index, i0) => {
          return {
            a: common_vendor.t(item.sort_name),
            b: index,
            c: index == common_vendor.unref(num) ? 1 : "",
            d: common_vendor.o(($event) => seLect(index, item.sort_name, item._id), index)
          };
        }),
        b: common_vendor.f(common_vendor.unref(goods), (item, index, i0) => {
          return common_vendor.e({
            a: item.goods_cover,
            b: common_vendor.t(item.goods_title),
            c: common_vendor.t(item.stock),
            d: common_vendor.t(item.goods_price),
            e: item.shelves
          }, item.shelves ? {
            f: common_vendor.o(($event) => shelf(item._id, index), index)
          } : {}, {
            g: !item.shelves
          }, !item.shelves ? {
            h: common_vendor.o(($event) => rootGoods(item._id), index)
          } : {}, {
            i: !item.shelves
          }, !item.shelves ? {
            j: common_vendor.o(($event) => delGoods(item._id, index), index)
          } : {}, {
            k: index
          });
        }),
        c: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        d: common_vendor.o(rootSoRt),
        e: common_vendor.o(($event) => rootGoods())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f133ce92"], ["__file", "E:/Project/kuang-app/kuangApplet/kuang-admin/pages/commodity/commodity.vue"]]);
wx.createPage(MiniProgramPage);
