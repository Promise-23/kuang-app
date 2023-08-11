const db = wx.cloud.database()
class Plublic{
	constructor(){}
	
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
	  wx.showLoading()
	  const base64 = await new Promise(resolve => {
	    //获取全局唯一的文件管理器
	    wx.getFileSystemManager()
	      .readFile({ //读取本地文件内容
	        filePath: tempFilePath, // 文件路径
	        encoding: 'base64', // 返回格式
	        success: ({data}) => {
	          return resolve('data:image/png;base64,' + data);
	        },
	        fail(res) {
	          console.log('fail', res)
	        }
	      });
	  });
	
	  wx.hideLoading()
	  console.log('base64', base64)
	  // return base64.replace(/[\r\n]/g, '')
	  return base64
	}
	
	// 登陆
	login(userInfo){
		return new Promise(async (resolve,reject)=>{
			try{
				// 存储数据库查询数据库是否存在用户信息，不存在则提交
				const query_openid = await db.collection('user_infor').get()
				console.log('query_openid', query_openid)
				if(query_openid.data.length > 0){
					// 存在用户信息
					const user = query_openid.data[0]
					console.log('user', user)
					wx.setStorageSync('user_infor', {avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
				}else{
					console.log('userInfo', userInfo)
					await db.collection('user_infor').add({data:{avatarUrl:userInfo.avatarUrl,nickName:userInfo.nickName,watch_num:1,pay:true}})
					const query = await db.collection('user_infor').get()
					const user = query.data[0]
					wx.setStorageSync('user_infor', {avatarUrl:user.avatarUrl,nickName:user.nickName,openid:user._openid})
				}
				resolve('success')
			}catch(err){
				//TODO handle the exception
				reject(err)
			}
		})
	}
	
	// 消息提示框
	toast(title,icon='none'){
		wx.showToast({
		  title,
		  icon,
		  mask:true,
		  duration: 800
		})
	}
	
	
	// 上传本地图片
	image(count = 1, type = 'image'){
		return new Promise((resolve,reject)=>{
			wx.chooseMedia({
			  count,
			  mediaType: [type],
			  sourceType: ['album']
			})
			.then(res=>{
				resolve(res.tempFiles)
			})
			.catch(err=>{
				reject(err)
			})
		})
	}
	
	// 上传图片或者视频到云存储
	async cloud(route){
		let imgion = route.lastIndexOf('.')
		let eximg = route.slice(imgion)
		let cloudpath = `${Date.now()}-${Math.floor(Math.random(0,1) * 10000000)}${eximg}`
		return new Promise((resolve,reject)=>{
			wx.cloud.uploadFile({
			  cloudPath: 'media/' + cloudpath,
			  filePath: route, // 文件路径
			  success: async(res) => {
				const res_url = await wx.cloud.getTempFileURL({fileList:[res.fileID]})
				resolve(res_url.fileList[0].tempFileURL)
			  },
			  fail: err => {
				reject(err)
			  }
			})
		})
	}
	
	
	// 多图上传
	multi(uploads,key){
		let storage = []
		return new Promise((resolve,reject)=>{
			uploads.forEach(async item=>{
				let nm = await this.cloud(item.image)
				storage.push({[key]:nm})
				if(storage.length == uploads.length){
					resolve(storage)
				}
			})
		})
	}
	
	// 预览图片
	preview(image,arr){
		wx.previewImage({
		  current: image, // 当前显示图片的http链接
		  urls: arr // 需要预览的图片http链接列表['htt.xxx.jpg','htt.xxx.jpg']
		})
	}
	
	
	
	
}

export {Plublic}