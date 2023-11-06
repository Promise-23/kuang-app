"use strict";
const common_vendor = require("../common/vendor.js");
common_vendor.hooks.locale("zh-cn");
const db = common_vendor.wx$1.cloud.database();
class Plublic {
  constructor() {
  }
  // 登陆
  // login(){
  // 	return new Promise((resolve,reject)=>{
  // 		wx.getUserProfile({
  // 			desc: '获取用户信息',
  // 			success:async(res)=>{
  // 				// 存储数据库查询数据库是否存在用户信息，不存在则提交
  // 				const query_openid = await db.collection('user_infor').get()
  // 				if(query_openid.data.length > 0){
  // 					// 存在用户信息
  // 					const user = query_openid.data[0]
  // 					wx.setStorageSync('user_infor', {avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
  // 				}else{
  // 					await db.collection('user_infor').add({data:{avatarUrl:res.userInfo.avatarUrl,nickName:res.userInfo.nickName,watch_num:1,pay:true}})
  // 					const query = await db.collection('user_infor').get()
  // 					const user = query.data[0]
  // 					wx.setStorageSync('user_infor', {avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
  // 				}
  // 				resolve('success')
  // 			},
  // 			fail:(err)=>{
  // 				reject(err)
  // 			}
  // 		})
  // 	})
  // }
  async getImageBase64_readFile(tempFilePath) {
    common_vendor.wx$1.showLoading();
    const base64 = await new Promise((resolve) => {
      common_vendor.wx$1.getFileSystemManager().readFile({
        //读取本地文件内容
        filePath: tempFilePath,
        // 文件路径
        encoding: "base64",
        // 返回格式
        success: ({ data }) => {
          return resolve("data:image/png;base64," + data);
        },
        fail(res) {
          console.log("fail", res);
        }
      });
    });
    common_vendor.wx$1.hideLoading();
    console.log("base64", base64);
    return base64;
  }
  // 登陆
  login(userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const query_openid = await db.collection("user_infor").get();
        console.log("query_openid", query_openid);
        if (query_openid.data.length > 0) {
          const user = query_openid.data[0];
          console.log("更新user", user);
          console.log("更新userInfo", userInfo);
          await db.collection("user_infor").where({ _openid: user._openid }).update({ data: { avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, phone: userInfo.phone } });
          common_vendor.wx$1.setStorageSync("user_infor", { avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, _openid: user._openid, phone: userInfo.phone, integral: user.integral, coupon: user.coupon, kcoin: user.kcoin });
          common_vendor.wx$1.showToast({
            title: "欢迎回来!"
          });
        } else {
          await db.collection("user_infor").add({ data: { avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, phone: userInfo.phone, integral: 100, coupon: 0, kcoin: 0, watch_num: 1, pay: true } });
          const query = await db.collection("user_infor").get();
          const user = query.data[0];
          console.log("新增user", user);
          console.log("新增userInfo", userInfo);
          common_vendor.wx$1.setStorageSync("user_infor", { avatarUrl: user.avatarUrl, nickName: user.nickName, _openid: user._openid, phone: user.phone, integral: user.integral, coupon: user.coupon, kcoin: user.kcoin });
          let time = common_vendor.hooks().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
          await db.collection("integral_detail").add({ data: { type: "add", num: 100, desc: "注册用户成功!", time } });
          common_vendor.wx$1.showToast({
            title: "注册成功!"
          });
        }
        resolve("success");
      } catch (err) {
        reject(err);
      }
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
function getAccessToken() {
  const APPID = "wxf627a4c6489c75f5";
  const APPSECRET = "adf0c27ab3ba4a517c76d95b588eec6b";
  const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      url: URL,
      //仅为示例，并非真实的接口地址
      method: "GET",
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
function getPhoneNumberByToken(code, token) {
  const URL = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${token}`;
  const requestOptions = {
    code
  };
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      url: URL,
      //仅为示例，并非真实的接口地址
      method: "POST",
      data: requestOptions,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
function currentTime() {
  const date = common_vendor.hooks().format("YYYY-MM-DD");
  return transferTime(date);
}
function transferTime(time) {
  return Math.round(common_vendor.hooks(time, "YYYY-MM-DD").valueOf() / 1e3);
}
function hasSameElement(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) {
        return true;
      }
    }
  }
  return false;
}
exports.Plublic = Plublic;
exports.currentTime = currentTime;
exports.getAccessToken = getAccessToken;
exports.getPhoneNumberByToken = getPhoneNumberByToken;
exports.hasSameElement = hasSameElement;
exports.transferTime = transferTime;
