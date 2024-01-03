"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_media = require("../../Acc-config/media.js");
const AccConfig_init = require("../../Acc-config/init.js");
const _sfc_main = {
  __name: "goods",
  setup(__props) {
    const id = common_vendor.ref();
    common_vendor.onLoad((event) => {
      id.value = event.id;
    });
    const isEdit = common_vendor.computed(() => {
      return id.value && id.value !== "undefined";
    });
    const priceinv = common_vendor.reactive({ price: "", stock: "" });
    const { price, stock } = common_vendor.toRefs(priceinv);
    function juMp() {
      let arr = JSON.stringify(specs.specs_data);
      common_vendor.wx$1.navigateTo({
        url: "/pages/specs/specs?sku=" + arr
      });
    }
    const specs = common_vendor.reactive({ specs_data: [] });
    common_vendor.watch(AccConfig_answer.sku_val, (newVal, oldVal) => {
      specs.specs_data = newVal;
      let SORT = newVal;
      let min_price = SORT.sort((A, B) => {
        return A.price - B.price;
      });
      priceinv.price = min_price[0].price;
      let STOCK = 0;
      newVal.forEach((item) => STOCK += item.stock);
      priceinv.stock = STOCK;
    });
    const cover = common_vendor.reactive({ goods_title: "", sto_image: [] });
    async function upImage() {
      const local = await new AccConfig_media.Upload().image(9);
      local.forEach((item) => {
        cover.sto_image.push({ image: item.tempFilePath });
      });
    }
    function deleteImg(index) {
      cover.sto_image.splice(index, 1);
    }
    function preView(image) {
      let arr = [];
      cover.sto_image.forEach((item) => {
        arr.push(item.image);
      });
      new AccConfig_media.Upload().preview(image, arr);
    }
    const video = common_vendor.reactive({ sto_video: "" });
    async function upVideo() {
      const local = await new AccConfig_media.Upload().image(1, "video");
      video.sto_video = local[0].tempFilePath;
    }
    common_vendor.onMounted(async () => {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("goods_sort").field({ _openid: false }).get();
      sortdata.sortArray = res.data;
      if (isEdit.value) {
        queryEditGood(id.value);
      }
    });
    async function queryEditGood(id2) {
      let DB = await AccConfig_init.inIt();
      const res = await DB.database().collection("goods").where({ _id: id2 }).get();
      console.log("queryEditGood", res.data[0]);
      const currGood = res.data[0] || {};
      const { goods_title, goods_banner, goods_cover, video_url, category, goods_price, stock: stock2, sku, goods_details } = currGood;
      cover.goods_title = goods_title;
      cover.sto_image = goods_banner;
      cover.sto_image[0].image = goods_cover;
      video.sto_video = video_url;
      sortdata.sort_value = category;
      priceinv.price = goods_price;
      priceinv.stock = stock2;
      detail.sto_detail = goods_details;
      if (sku) {
        const sku_data = await DB.database().collection("sku_data").where({ sku_id: id2 }).get();
        console.log("当前商品sku", sku_data.data);
        specs.specs_data = sku_data.data[0].sku ?? [];
      }
    }
    const sortdata = common_vendor.reactive({
      sortArray: [],
      sort_value: "",
      sort_id: ""
      //分类的id，用于提交数据时对选中的分类下的quantity++
    });
    const { sortArray, sort_value } = common_vendor.toRefs(sortdata);
    function changeEnd(e) {
      var _a, _b;
      sortdata.sort_value = (_a = sortdata.sortArray[e.detail.value]) == null ? void 0 : _a.sort_name;
      sortdata.sort_id = (_b = sortdata.sortArray[e.detail.value]) == null ? void 0 : _b._id;
    }
    const detail = common_vendor.reactive({ sto_detail: [] });
    async function upDetail() {
      const local = await new AccConfig_media.Upload().image(9);
      local.forEach((item) => {
        detail.sto_detail.push({ image: item.tempFilePath });
      });
    }
    function deleteDeta(index) {
      detail.sto_detail.splice(index, 1);
    }
    function previewDeta(image) {
      let arr = [];
      detail.sto_detail.forEach((item) => {
        arr.push(item.image);
      });
      new AccConfig_media.Upload().preview(image, arr);
    }
    function subMit() {
      switch (true) {
        case cover.goods_title == "":
          new AccConfig_media.Feedback("请填写标题").toast();
          break;
        case cover.sto_image.length == 0:
          new AccConfig_media.Feedback("请上传图片").toast();
          break;
        case sortdata.sort_value == "":
          new AccConfig_media.Feedback("请选择分类").toast();
          break;
        case priceinv.price == "":
          new AccConfig_media.Feedback("请输入价格").toast();
          break;
        case priceinv.stock == "":
          new AccConfig_media.Feedback("请输入库存").toast();
          break;
        case detail.sto_detail.length == 0:
          new AccConfig_media.Feedback("请上传详情图").toast();
          break;
        default:
          database();
      }
    }
    async function database() {
      var _a;
      common_vendor.wx$1.showLoading({ title: "上传中", mask: true });
      let res_banner = await new AccConfig_media.Upload().multi(cover.sto_image, "image");
      let res_detail = await new AccConfig_media.Upload().multi(detail.sto_detail, "image");
      console.log("短视频，存在短视频再上传", video.sto_video);
      let res_video = video.sto_video == "" ? "" : await new AccConfig_media.Upload().cloud(video.sto_video);
      let obj = {
        goods_title: cover.goods_title,
        goods_banner: res_banner,
        goods_cover: res_banner[0].image,
        video_url: res_video,
        category: sortdata.sort_value,
        goods_price: Number(priceinv.price),
        stock: Number(priceinv.stock),
        sku: specs.specs_data.length == 0 ? false : true,
        goods_details: res_detail,
        sold: 0,
        shelves: true,
        seckill: false
      };
      try {
        let DB = await AccConfig_init.inIt();
        if (isEdit.value) {
          const res = await DB.database().collection("goods").doc(id.value).update({ data: obj });
          const sku_res = await DB.database().collection("sku_data").where({ sku_id: id.value }).get();
          console.log("查询是否存在sku", sku_res);
          if (((_a = specs.specs_data) == null ? void 0 : _a.length) > 0) {
            if (sku_res.data.length > 0) {
              await DB.database().collection("sku_data").where({ sku_id: id.value }).update({ data: { sku: specs.specs_data } });
            } else {
              await DB.database().collection("sku_data").add({ data: { sku_id: id.value, sku: specs.specs_data } });
            }
          }
          new AccConfig_media.Feedback("编辑成功", "success").toast();
        } else {
          const res = await DB.database().collection("goods").add({ data: obj });
          if (specs.specs_data.length > 0) {
            await DB.database().collection("sku_data").add({ data: { sku_id: res._id, sku: specs.specs_data } });
          }
          const _ = DB.database().command;
          console.log("对选择的分类下的数量", sortdata.sort_id);
          await DB.database().collection("goods_sort").doc(sortdata.sort_id).update({ data: { quantity: _.inc(1) } });
          new AccConfig_media.Feedback("上传成功", "success").toast();
        }
        common_vendor.wx$1.navigateBack({
          delta: 1
        });
      } catch (e) {
        console.log(e);
        new AccConfig_media.Feedback("提交失败").toast();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: cover.goods_title,
        b: common_vendor.o(($event) => cover.goods_title = $event.detail.value),
        c: cover.sto_image.length > 0
      }, cover.sto_image.length > 0 ? {
        d: common_vendor.f(cover.sto_image, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => preView(item.image), index),
            c: common_vendor.o(($event) => deleteImg(index), index),
            d: index
          };
        })
      } : {}, {
        e: common_vendor.o(upImage),
        f: video.sto_video != ""
      }, video.sto_video != "" ? {
        g: common_vendor.o(($event) => video.sto_video = "")
      } : {}, {
        h: video.sto_video == ""
      }, video.sto_video == "" ? {
        i: common_vendor.o(upVideo)
      } : {}, {
        j: video.sto_video != ""
      }, video.sto_video != "" ? {
        k: video.sto_video
      } : {}, {
        l: common_vendor.t(common_vendor.unref(sort_value)),
        m: common_vendor.unref(sortArray),
        n: common_vendor.o(changeEnd),
        o: specs.specs_data.length > 0 ? true : false,
        p: common_vendor.unref(price),
        q: common_vendor.o(($event) => common_vendor.isRef(price) ? price.value = $event.detail.value : null),
        r: specs.specs_data.length > 0 ? true : false,
        s: common_vendor.unref(stock),
        t: common_vendor.o(($event) => common_vendor.isRef(stock) ? stock.value = $event.detail.value : null),
        v: specs.specs_data.length == 0
      }, specs.specs_data.length == 0 ? {} : {}, {
        w: specs.specs_data.length > 0
      }, specs.specs_data.length > 0 ? {
        x: common_vendor.f(specs.specs_data, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.f(item.att_data, (item_S, index_S, i1) => {
              return {
                a: common_vendor.t(item_S.att_val),
                b: index_S
              };
            }),
            c: common_vendor.t(item.stock),
            d: common_vendor.t(item.price),
            e: index
          };
        })
      } : {}, {
        y: common_vendor.o(juMp),
        z: detail.sto_detail.length > 0
      }, detail.sto_detail.length > 0 ? {
        A: common_vendor.f(detail.sto_detail, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => previewDeta(item.image), index),
            c: common_vendor.o(($event) => deleteDeta(index), index),
            d: index
          };
        })
      } : {}, {
        B: common_vendor.o(upDetail),
        C: common_vendor.o(subMit)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Project/kuang-app/kuangApplet/kuang-admin/pages/goods-admin/goods.vue"]]);
wx.createPage(MiniProgramPage);
