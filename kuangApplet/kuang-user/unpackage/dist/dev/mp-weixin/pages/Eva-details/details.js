"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  Loading();
}
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    let _id = common_vendor.ref("68426679627806c7015548f1732ab115");
    common_vendor.onLoad((event) => {
      _id.value = event.goods_id;
      getEva();
    });
    const data = common_vendor.reactive({ eva_data: [] });
    const { eva_data } = common_vendor.toRefs(data);
    async function getEva(sk = 0) {
      const res = await db.collection("goods_eva").where({ goods_id: _id.value }).limit(10).skip(sk).get();
      console.log(res);
      data.eva_data = [...data.eva_data, ...res.data];
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await getEva(sk);
      loading.value = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(eva_data), (item, index, i0) => {
          return common_vendor.e({
            a: item.avatarurl,
            b: common_vendor.t(item.nickname),
            c: item.specs.length > 0
          }, item.specs.length > 0 ? {
            d: common_vendor.f(item.specs, (item_a, index_a, i1) => {
              return {
                a: common_vendor.t(item_a.att_val),
                b: index_a
              };
            })
          } : {}, {
            e: common_vendor.t(item.time),
            f: common_vendor.t(item.eav_text),
            g: item.eav_image.length > 0
          }, item.eav_image.length > 0 ? {
            h: common_vendor.f(item.eav_image, (item_a, index_a, i1) => {
              return {
                a: item_a.image,
                b: index_a
              };
            })
          } : {}, {
            i: index
          });
        }),
        b: common_vendor.unref(eva_data).length == 0
      }, common_vendor.unref(eva_data).length == 0 ? {} : {}, {
        c: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-212075d4"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-user/pages/Eva-details/details.vue"]]);
wx.createPage(MiniProgramPage);
