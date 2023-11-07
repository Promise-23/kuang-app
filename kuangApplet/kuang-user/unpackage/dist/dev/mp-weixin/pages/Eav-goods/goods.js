"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_public = require("../../Acc-config/public.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const _sfc_main = {
  __name: "goods",
  setup(__props) {
    const cover = common_vendor.reactive({ eav_text: "", sto_image: [] });
    const { eav_text, sto_image } = common_vendor.toRefs(cover);
    async function upImage() {
      const local = await new AccConfig_public.Plublic().image(9);
      local.forEach((item) => {
        cover.sto_image.push({ image: item.tempFilePath });
      });
    }
    function preView(image) {
      let arr = [];
      cover.sto_image.forEach((item) => {
        arr.push(item.image);
      });
      new AccConfig_public.Plublic().preview(image, arr);
    }
    function deleteImg(index) {
      cover.sto_image.splice(index, 1);
    }
    const data = common_vendor.reactive({ goods_id: "", goods_index: 0, specs: [], image: [] });
    common_vendor.onLoad((event) => {
      const res = JSON.parse(event.query);
      data.goods_id = res.goods_id;
      data.goods_index = res.index;
      data.specs = res.specs;
    });
    common_vendor.hooks.locale("zh-cn");
    const db = common_vendor.wx$1.cloud.database();
    async function subMit() {
      if (cover.eav_text == "") {
        new AccConfig_public.Plublic().toast("请输入评价内容");
        return false;
      }
      common_vendor.wx$1.showLoading({ title: "提交中", mask: true });
      if (cover.sto_image.length > 0) {
        let res = await new AccConfig_public.Plublic().multi(cover.sto_image, "image");
        data.image = res;
      }
      const user = common_vendor.wx$1.getStorageSync("user_infor");
      let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD");
      let obj = {
        avatarurl: user.avatarUrl,
        nickname: user.nickName,
        eav_text: cover.eav_text,
        goods_id: data.goods_id,
        eav_image: data.image,
        time,
        specs: data.specs
      };
      try {
        await db.collection("goods_eva").add({ data: obj });
        common_vendor.wx$1.hideLoading();
        AccConfig_answer.eav_index.value = data.goods_index;
        common_vendor.wx$1.navigateBack({ delta: 1 });
      } catch (err) {
        console.log(err);
        new AccConfig_public.Plublic().toast("提价失败");
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(eav_text),
        b: common_vendor.o(($event) => common_vendor.isRef(eav_text) ? eav_text.value = $event.detail.value : null),
        c: common_vendor.unref(sto_image).length > 0
      }, common_vendor.unref(sto_image).length > 0 ? {
        d: common_vendor.f(common_vendor.unref(sto_image), (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => preView(item.image), index),
            c: common_vendor.o(($event) => deleteImg(index), index),
            d: index
          };
        })
      } : {}, {
        e: common_vendor.o(upImage),
        f: common_vendor.o(subMit)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/Eav-goods/goods.vue"]]);
wx.createPage(MiniProgramPage);
