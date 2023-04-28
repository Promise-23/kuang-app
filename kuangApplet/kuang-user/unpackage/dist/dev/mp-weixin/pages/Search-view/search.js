"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (Card + Loading)();
}
const Card = () => "../Common-component/Card-goods.js";
const Loading = () => "../public-view/loading.js";
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const keyword = common_vendor.ref("");
    function seArch() {
      if (keyword.value.split(" ").join("").length != 0) {
        let sear_array = common_vendor.wx$1.getStorageSync("search_key") || [];
        sear_array.unshift(keyword.value);
        common_vendor.wx$1.setStorageSync("search_key", sear_array);
        card.value = [];
        page_n.value = 0;
        searchQuery();
      }
    }
    const db = common_vendor.wx$1.cloud.database();
    const _ = db.command;
    const card = common_vendor.ref([]);
    const show = common_vendor.ref(true);
    async function searchQuery(sk = 0) {
      let query = _.or([
        {
          category: db.RegExp({
            regexp: keyword.value,
            options: "i"
          })
        },
        {
          goods_title: db.RegExp({
            regexp: keyword.value,
            options: "i"
          })
        }
      ]);
      const res = await db.collection("goods").where(query).limit(10).skip(sk).get();
      console.log(res);
      show.value = false;
      card.value = [...card.value, ...res.data];
    }
    let loading = common_vendor.ref(false);
    let page_n = common_vendor.ref(0);
    common_vendor.onReachBottom(async () => {
      loading.value = true;
      page_n.value++;
      let sk = page_n.value * 10;
      await searchQuery(sk);
      loading.value = false;
    });
    const history = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      let key = common_vendor.wx$1.getStorageSync("search_key");
      let res = Array.from(new Set(key));
      history.value = res;
    });
    function hiSearch(key) {
      keyword.value = key;
      card.value = [];
      page_n.value = 0;
      searchQuery();
    }
    function deLete() {
      common_vendor.wx$1.removeStorageSync("search_key");
      history.value = [];
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(seArch),
        b: keyword.value,
        c: common_vendor.o(($event) => keyword.value = $event.detail.value),
        d: common_vendor.o(seArch),
        e: history.value.length > 0 && show.value
      }, history.value.length > 0 && show.value ? {
        f: common_vendor.o(deLete),
        g: common_vendor.f(history.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => hiSearch(item), index)
          };
        })
      } : {}, {
        h: common_vendor.p({
          card: card.value
        }),
        i: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        j: card.value.length == 0 && show.value === false
      }, card.value.length == 0 && show.value === false ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-547c4fd1"], ["__file", "D:/hujie/Applet/kuangApplet/kuang-user/pages/Search-view/search.vue"]]);
wx.createPage(MiniProgramPage);
