"use strict";
const common_vendor = require("../../common/vendor.js");
const AccConfig_answer = require("../../Acc-config/answer.js");
const AccConfig_public = require("../../Acc-config/public.js");
if (!Math) {
  Address();
}
const Address = () => "./component/new-address.js";
const _sfc_main = {
  __name: "address",
  setup(__props) {
    const db = common_vendor.wx$1.cloud.database();
    common_vendor.onMounted(() => {
      getAdd();
    });
    const data = common_vendor.reactive({ address: [] });
    const { address } = common_vendor.toRefs(data);
    async function getAdd() {
      const res = await db.collection("re_address").get();
      data.address = res.data;
    }
    function upLoad() {
      getAdd();
    }
    function deleTe(_id, index) {
      common_vendor.wx$1.showModal({ content: "确认删除吗" }).then(async (res) => {
        if (res.confirm) {
          try {
            await db.collection("re_address").doc(_id).remove();
            data.address.splice(index, 1);
          } catch (e) {
            new AccConfig_public.Plublic().toast("删除失败");
          }
        }
      });
    }
    function modIfy(item, id) {
      AccConfig_answer.modify.data = item;
      AccConfig_answer.modify.id = id;
      AccConfig_answer.address_show.show = true;
      AccConfig_answer.deci.value = "001";
    }
    function newAddress() {
      AccConfig_answer.address_show.show = true;
      AccConfig_answer.deci.value = "002";
    }
    async function setUp(id, index) {
      let sto = [];
      data.address.forEach((item, index_a) => {
        if (item.tacitly) {
          sto.push({ index: index_a, id: item._id });
        }
      });
      try {
        await db.collection("re_address").doc(id).update({ data: { tacitly: true } });
        data.address[index].tacitly = true;
        if (sto.length > 0) {
          await db.collection("re_address").doc(sto[0].id).update({ data: { tacitly: false } });
          data.address[sto[0].index].tacitly = false;
        }
      } catch (e) {
        new AccConfig_public.Plublic().toast("设置失败");
      }
    }
    function choIce(value) {
      AccConfig_answer.new_address.data = value;
      common_vendor.wx$1.navigateBack({
        delta: 1
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(address), (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.mobile),
            c: common_vendor.t(item.district + item.address),
            d: item.tacitly
          }, item.tacitly ? {} : {}, {
            e: common_vendor.o(($event) => choIce(item), index),
            f: item.tacitly
          }, item.tacitly ? {} : {}, {
            g: common_vendor.t(item.tacitly ? "已设为默认" : "设为默认"),
            h: common_vendor.n(item.tacitly ? "Disable" : ""),
            i: common_vendor.o(($event) => setUp(item._id, index), index),
            j: common_vendor.o(($event) => deleTe(item._id, index), index),
            k: common_vendor.o(($event) => modIfy(item, item._id), index),
            l: index
          });
        }),
        b: common_vendor.unref(address).length == 0
      }, common_vendor.unref(address).length == 0 ? {} : {}, {
        c: common_vendor.o(newAddress),
        d: common_vendor.o(upLoad)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/hujie/Applet-new/kuang-app/kuangApplet/kuang-user/pages/Re-address/address.vue"]]);
wx.createPage(MiniProgramPage);
