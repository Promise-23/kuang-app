"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_media = require("../../Acc-config/media.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
require("../../Acc-config/init.js");
const _sfc_main = {
  __name: "specs",
  setup(__props) {
    const show = common_vendor.ref(false);
    const sku_data = common_vendor.reactive({
      //{att_name:'颜色',att_val:''}
      sku: [{ title: 1, att_data: [], price: "", stock: "", image: "" }]
    });
    const Sto_att = common_vendor.reactive({ attobj: [{ att: "", title: 1 }, { att: "", title: 2 }, { att: "", title: 3 }] });
    const attribute = common_vendor.reactive({ selected: [] });
    function subMit() {
      sku_data.sku = [{ title: 1, att_data: [], price: "", stock: "", image: "" }];
      const filter = Sto_att.attobj.filter((item) => item.att != "");
      const new_arr = [];
      filter.forEach((item) => {
        new_arr.push({ att: item.att, name: item.att, checked: true });
      });
      attribute.selected = new_arr;
      show.value = false;
      calsku();
    }
    function calsku() {
      let filter_arr = attribute.selected.filter((item) => item.checked);
      let new_att = filter_arr.map((item) => {
        return { att_name: item.att, att_val: "" };
      });
      sku_data.sku.forEach((item) => {
        item.att_data = JSON.parse(JSON.stringify(new_att));
      });
    }
    function newSpecs() {
      let num = sku_data.sku[sku_data.sku.length - 1].title;
      num++;
      const new_sku = { title: num, att_data: [], price: "", stock: "", image: "" };
      sku_data.sku.push(new_sku);
      let filter_arr = attribute.selected.filter((item) => item.checked);
      let new_att = filter_arr.map((item) => {
        return { att_name: item.att, att_val: "" };
      });
      sku_data.sku[sku_data.sku.length - 1].att_data = JSON.parse(JSON.stringify(new_att));
    }
    function deleteSku(index) {
      sku_data.sku.splice(index, 1);
      sku_data.sku.forEach((item, index2) => {
        item.title = index2 + 1;
      });
    }
    function chEchange(e) {
      let value = e.detail.value;
      attribute.selected.forEach((iteming, index) => {
        let item = attribute.selected[index];
        if (value.includes(iteming.att)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
    function fInd(att, checked) {
      if (checked) {
        sku_data.sku.forEach((item) => {
          item.att_data.push({ att_name: att, att_val: "" });
        });
      } else {
        sku_data.sku.forEach((item_a, index_a) => {
          item_a.att_data.forEach((item_b, index_b) => {
            if (item_b.att_name == att) {
              sku_data.sku[index_a].att_data.splice(index_b, 1);
            }
          });
        });
      }
    }
    async function upLoad(index) {
      try {
        let local = await new AccConfig_media.Upload().image();
        common_vendor.wx$1.showLoading({ title: "正在上传", mask: true });
        let res = await new AccConfig_media.Upload().cloud(local[0].tempFilePath);
        sku_data.sku[index].image = res;
        common_vendor.wx$1.hideLoading();
      } catch (e) {
        new AccConfig_media.Feedback("上传失败").toast();
      }
    }
    function dePicture(index) {
      sku_data.sku[index].image = "";
    }
    function preView(image) {
      new AccConfig_media.Upload().preview(image, [image]);
    }
    function preserve() {
      if (attribute.selected.length == 0) {
        new AccConfig_media.Feedback("规格设置不完善").toast();
        return false;
      } else if (attribute.selected.length > 0) {
        const checked = attribute.selected.filter((item) => item.checked);
        if (checked.length == 0) {
          new AccConfig_media.Feedback("规格设置不完善").toast();
          return false;
        } else {
          const price = sku_data.sku.filter((item) => item.price == "");
          if (price.length > 0) {
            new AccConfig_media.Feedback("规格设置不完善").toast();
            return false;
          }
          const stock = sku_data.sku.filter((item) => item.stock == "");
          if (stock.length > 0) {
            new AccConfig_media.Feedback("规格设置不完善").toast();
            return false;
          }
          const image = sku_data.sku.filter((item) => item.image == "");
          if (image.length > 0) {
            new AccConfig_media.Feedback("规格设置不完善").toast();
            return false;
          }
          let array = [];
          sku_data.sku.forEach((item) => {
            const filter = item.att_data.filter((iteming) => iteming.att_val == "");
            array.push(...filter);
          });
          if (array.length > 0) {
            new AccConfig_media.Feedback("规格设置不完善").toast();
            return false;
          }
        }
      }
      sku_data.sku.forEach((item) => {
        item.price = Number(item.price);
        item.stock = Number(item.stock);
      });
      AccConfig_answer.sku_val.value = sku_data.sku;
      common_vendor.wx$1.navigateBack({ delta: 1 });
    }
    function cancel() {
      common_vendor.wx$1.navigateBack({ delta: 1 });
    }
    common_vendor.onLoad((event) => {
      let Arr = JSON.parse(event.sku);
      if (Arr.length <= 0)
        return false;
      const new_arr = Arr[0].att_data.map((item, index) => {
        return { att: item.att_name, title: index + 1 };
      });
      Sto_att.attobj = new_arr;
      if (Arr[0].att_data.length == 1) {
        Sto_att.attobj.push({ att: "", title: 2 }, { att: "", title: 3 });
      } else if (Arr[0].att_data.length == 2) {
        Sto_att.attobj.push({ att: "", title: 3 });
      }
      subMit();
      sku_data.sku = Arr;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => show.value = true),
        b: common_vendor.f(attribute.selected, (item, index, i0) => {
          return {
            a: item.att,
            b: item.checked,
            c: common_vendor.t(item.name),
            d: index,
            e: common_vendor.o(($event) => fInd(item.att, item.checked), index)
          };
        }),
        c: common_vendor.o(chEchange),
        d: common_vendor.f(sku_data.sku, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title)
          }, sku_data.sku.length > 1 ? {
            b: common_vendor.o(($event) => deleteSku(index), index)
          } : {}, {
            c: item.att_data.length > 0
          }, item.att_data.length > 0 ? {
            d: common_vendor.f(item.att_data, (item_add, index_add, i1) => {
              return {
                a: common_vendor.t(item_add.att_name),
                b: "请输入" + item_add.att_name,
                c: item_add.att_val,
                d: common_vendor.o(($event) => item_add.att_val = $event.detail.value, index_add),
                e: index_add
              };
            })
          } : {}, {
            e: item.price,
            f: common_vendor.o(($event) => item.price = $event.detail.value, index),
            g: item.stock,
            h: common_vendor.o(($event) => item.stock = $event.detail.value, index),
            i: item.image == ""
          }, item.image == "" ? {
            j: common_vendor.o(($event) => upLoad(index), index)
          } : {
            k: item.image,
            l: common_vendor.o(($event) => preView(item.image), index)
          }, {
            m: item.image != ""
          }, item.image != "" ? {
            n: common_vendor.o(($event) => dePicture(index), index)
          } : {}, {
            o: index
          });
        }),
        e: sku_data.sku.length > 1,
        f: common_vendor.o(newSpecs),
        g: common_vendor.o(($event) => show.value = false),
        h: common_vendor.o(subMit),
        i: common_vendor.f(Sto_att.attobj, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.att,
            c: common_vendor.o(($event) => item.att = $event.detail.value, index),
            d: index
          };
        }),
        j: show.value,
        k: common_vendor.o(cancel),
        l: common_vendor.o(preserve)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Project/kuang-app/kuangApplet/kuang-admin/pages/specs/specs.vue"]]);
wx.createPage(MiniProgramPage);
