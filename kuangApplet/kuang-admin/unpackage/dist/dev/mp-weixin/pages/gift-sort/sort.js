"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_media = require("../../Acc-config/media.js");
if (!Math) {
  Loading();
}
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "sort",
  setup(__props) {
    const show = common_vendor.ref(false);
    const data = common_vendor.reactive({ sort: [], sort_name: "" });
    const { sort, sort_name } = common_vendor.toRefs(data);
    common_vendor.onMounted(() => {
      getsort();
    });
    async function getsort() {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("gifts_sort").limit(10).field({ _openid: false }).get();
      console.log(res);
      data.sort = res.data;
    }
    async function subMit() {
      if (data.sort_name == "") {
        new AccConfig_media.Feedback("请输入分类", "none").toast();
        return false;
      }
      let DB = await AccConfig_init.inIt();
      const query_data = await DB.database().collection("gifts_sort").where({ sort_name: data.sort_name }).get();
      if (query_data.data.length > 0) {
        new AccConfig_media.Feedback("该分类已经存在", "none").toast();
      } else {
        let res = await DB.database().collection("gifts_sort").add({ data: { sort_name: data.sort_name, quantity: 0 } });
        data.sort.push({ quantity: 0, sort_name: data.sort_name, _id: res._id });
        data.sort_name = "";
        show.value = false;
      }
    }
    let page_n = common_vendor.ref(0);
    let loading = common_vendor.ref(false);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("gifts_sort").limit(10).skip(sk).field({ _openid: false }).get();
      let merge = [...data.sort, ...res.data];
      let obj = {};
      let new_data = merge.reduce((prev, item) => {
        if (!obj[item._id]) {
          prev.push(item);
          obj[item._id] = true;
        }
        return prev;
      }, []);
      data.sort = new_data;
      loading.value = false;
    });
    async function deLete(id, index, quantity) {
      if (quantity > 0) {
        new AccConfig_media.Feedback("请先删除该分类下的商品", "none").toast();
        return false;
      }
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("gifts_sort").doc(id).remove();
        data.sort.splice(index, 1);
      } catch (e) {
        new AccConfig_media.Feedback("删除失败").toast();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(sort).length > 0
      }, common_vendor.unref(sort).length > 0 ? {} : {}, {
        b: common_vendor.f(common_vendor.unref(sort), (item, index, i0) => {
          return {
            a: common_vendor.t(item.sort_name),
            b: common_vendor.o(($event) => deLete(item._id, index, item.quantity), index),
            c: index
          };
        }),
        c: common_vendor.unref(sort).length === 0
      }, common_vendor.unref(sort).length === 0 ? {} : {}, {
        d: common_vendor.o(($event) => show.value = false),
        e: common_vendor.unref(sort_name),
        f: common_vendor.o(($event) => common_vendor.isRef(sort_name) ? sort_name.value = $event.detail.value : null),
        g: common_vendor.o(subMit),
        h: show.value,
        i: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        j: common_vendor.o(($event) => show.value = true)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd2dbe52"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-admin/pages/gift-sort/sort.vue"]]);
wx.createPage(MiniProgramPage);
