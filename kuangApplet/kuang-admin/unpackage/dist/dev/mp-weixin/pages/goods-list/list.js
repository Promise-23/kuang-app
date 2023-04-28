"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_media = require("../../Acc-config/media.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
if (!Math) {
  Loading();
}
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "list",
  setup(__props) {
    common_vendor.onMounted(() => {
      goods();
    });
    const data = common_vendor.reactive({ list: [] });
    let obj = { goods_title: true, goods_cover: true, goods_price: true, video_url: true, seckill: true };
    async function goods() {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("goods").where({ shelves: true }).limit(10).field(obj).get();
      data.list = res.data;
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      let DB = await AccConfig_init.inIt();
      const res_goods = await DB.database().collection("goods").where({ shelves: true }).limit(10).skip(sk).field(obj).get();
      data.list = [...data.list, ...res_goods.data];
      loading.value = false;
    });
    function seLect(goods_title, goods_id, goods_price, video_url, relation) {
      if (relation) {
        new AccConfig_media.Feedback("该商品已被关联", "none").toast();
      } else {
        AccConfig_answer.select_goods.value = { goods_title, goods_id, goods_price, video_url };
        common_vendor.wx$1.navigateBack({ delta: 1 });
      }
    }
    const rel_data = common_vendor.reactive({ data: [] });
    common_vendor.onLoad((event) => {
      rel_data.data = JSON.parse(event.ref_id);
    });
    common_vendor.watch(() => data.list, (newVal, oldVla) => {
      for (let i = 0; i < rel_data.data.length; i++) {
        let index = newVal.findIndex((item) => item._id == rel_data.data[i]);
        if (index >= 0) {
          data.list[index]["relation"] = true;
        }
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(data.list, (item, index, i0) => {
          return {
            a: item.goods_cover,
            b: common_vendor.t(item.goods_title),
            c: item.relation ? "#f2f2f2" : "",
            d: common_vendor.t(item.goods_price),
            e: item.relation ? "#f2f2f2" : "",
            f: index,
            g: common_vendor.o(($event) => seLect(item.goods_title, item._id, item.goods_price, item.video_url, item.relation), index)
          };
        }),
        b: data.list.length === 0
      }, data.list.length === 0 ? {} : {}, {
        c: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1eee676"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-admin/pages/goods-list/list.vue"]]);
wx.createPage(MiniProgramPage);
