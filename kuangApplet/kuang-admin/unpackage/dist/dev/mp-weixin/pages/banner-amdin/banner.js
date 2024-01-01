"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_init = require("../../Acc-config/init.js");
const AccConfig_media = require("../../Acc-config/media.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const _sfc_main = {
  __name: "banner",
  setup(__props) {
    const show = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      getBanner();
    });
    const data = common_vendor.reactive({
      banner_data: [],
      banner_cover: "",
      re_goods: {
        title: "",
        goods_id: "",
        video_url: ""
      }
    });
    const { banner_data, banner_cover, re_goods } = common_vendor.toRefs(data);
    async function getBanner() {
      let DB = await AccConfig_init.inIt();
      let res = await DB.database().collection("banner").get();
      data.banner_data = res.data;
    }
    async function upImage() {
      const local = await new AccConfig_media.Upload().image();
      common_vendor.wx$1.showLoading({ title: "正在上传", mask: true });
      const res = await new AccConfig_media.Upload().cloud(local[0].tempFilePath);
      data.banner_cover = res;
      common_vendor.wx$1.hideLoading();
    }
    function addTo() {
      const rel_id = data.banner_data.map((item) => item.goods_id);
      const str_id = JSON.stringify(rel_id);
      common_vendor.wx$1.navigateTo({
        url: "/pages/goods-list/list?ref_id=" + str_id
      });
    }
    common_vendor.watch(AccConfig_answer.select_goods, (newVal, oldVal) => {
      data.re_goods.title = newVal.goods_title;
      data.re_goods.goods_id = newVal.goods_id;
      data.re_goods.video_url = newVal.video_url;
    });
    function subMit() {
      switch (true) {
        case data.banner_cover == "":
          new AccConfig_media.Feedback("请上传封面图").toast();
          break;
        case data.re_goods.title == "":
          new AccConfig_media.Feedback("请关联一个商品").toast();
          break;
        default:
          database();
      }
    }
    async function database() {
      common_vendor.wx$1.showLoading({ title: "正在提交", mask: true });
      let obj = { banner_cover: data.banner_cover, goods_id: data.re_goods.goods_id, video_url: data.re_goods.video_url };
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("banner").add({ data: obj });
        show.value = false;
        data.banner_cover = "";
        data.re_goods.title = "";
        common_vendor.wx$1.hideLoading();
        getBanner();
      } catch (e) {
        new AccConfig_media.Feedback("提交失败").toast();
      }
    }
    async function deLete(id, index) {
      try {
        let DB = await AccConfig_init.inIt();
        await DB.database().collection("banner").doc(id).remove();
        data.banner_data.splice(index, 1);
        new AccConfig_media.Feedback("删除成功", "success").toast();
      } catch (e) {
        new AccConfig_media.Feedback("删除失败").toast();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(banner_data).length > 0
      }, common_vendor.unref(banner_data).length > 0 ? {} : {}, {
        b: common_vendor.f(common_vendor.unref(banner_data), (item, index, i0) => {
          return {
            a: item.banner_cover,
            b: common_vendor.o(($event) => deLete(item._id, index), index),
            c: index
          };
        }),
        c: common_vendor.unref(banner_data).length === 0
      }, common_vendor.unref(banner_data).length === 0 ? {} : {}, {
        d: common_vendor.o(($event) => show.value = true),
        e: common_vendor.o(($event) => show.value = false),
        f: common_vendor.o(subMit),
        g: common_vendor.unref(banner_cover) == ""
      }, common_vendor.unref(banner_cover) == "" ? {
        h: common_vendor.o(upImage)
      } : {}, {
        i: common_vendor.unref(banner_cover),
        j: common_vendor.unref(banner_cover) != ""
      }, common_vendor.unref(banner_cover) != "" ? {
        k: common_vendor.o(($event) => banner_cover.value = "")
      } : {}, {
        l: common_vendor.t(common_vendor.unref(re_goods).title == "" ? "添加" : common_vendor.unref(re_goods).title),
        m: common_vendor.o(addTo),
        n: show.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-16be800f"], ["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-admin/pages/banner-amdin/banner.vue"]]);
wx.createPage(MiniProgramPage);
