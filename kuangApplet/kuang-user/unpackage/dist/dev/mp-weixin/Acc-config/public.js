"use strict";
const common_vendor = require("../common/vendor.js");
const db = common_vendor.wx$1.cloud.database();
class Plublic {
  constructor() {
  }
  // 登陆
  login() {
    return new Promise((resolve, reject) => {
      common_vendor.wx$1.getUserProfile({
        desc: "获取用户信息",
        success: async (res) => {
          const query_openid = await db.collection("user_infor").get();
          if (query_openid.data.length > 0) {
            const user = query_openid.data[0];
            common_vendor.wx$1.setStorageSync("user_infor", { avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user._openid });
          } else {
            await db.collection("user_infor").add({ data: { avatarUrl: res.userInfo.avatarUrl, nickName: res.userInfo.nickName, watch_num: 1, pay: true } });
            const query = await db.collection("user_infor").get();
            const user = query.data[0];
            common_vendor.wx$1.setStorageSync("user_infor", { avatarUrl: user.avatarUrl, nickName: user.nickName, openid: user._openid });
          }
          resolve("success");
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  // 消息提示框
  toast(title, icon = "none") {
    common_vendor.wx$1.showToast({
      title,
      icon,
      mask: true,
      duration: 800
    });
  }
  // 上传本地图片
  image(count = 1, type = "image") {
    return new Promise((resolve, reject) => {
      common_vendor.wx$1.chooseMedia({
        count,
        mediaType: [type],
        sourceType: ["album"]
      }).then((res) => {
        resolve(res.tempFiles);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  // 上传图片或者视频到云存储
  async cloud(route) {
    let imgion = route.lastIndexOf(".");
    let eximg = route.slice(imgion);
    let cloudpath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 1e7)}${eximg}`;
    return new Promise((resolve, reject) => {
      common_vendor.wx$1.cloud.uploadFile({
        cloudPath: "media/" + cloudpath,
        filePath: route,
        // 文件路径
        success: async (res) => {
          const res_url = await common_vendor.wx$1.cloud.getTempFileURL({ fileList: [res.fileID] });
          resolve(res_url.fileList[0].tempFileURL);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  // 多图上传
  multi(uploads, key) {
    let storage = [];
    return new Promise((resolve, reject) => {
      uploads.forEach(async (item) => {
        let nm = await this.cloud(item.image);
        storage.push({ [key]: nm });
        if (storage.length == uploads.length) {
          resolve(storage);
        }
      });
    });
  }
  // 预览图片
  preview(image, arr) {
    common_vendor.wx$1.previewImage({
      current: image,
      // 当前显示图片的http链接
      urls: arr
      // 需要预览的图片http链接列表['htt.xxx.jpg','htt.xxx.jpg']
    });
  }
}
exports.Plublic = Plublic;
