import {inIt} from '@/Acc-config/init.js'
// 及时反馈
class Feedback{
	constructor(title,icon="error"){
		this.title = title
		this.icon = icon
	}
	
	// 消息提示框
	toast(){
		wx.showToast({
		  title: this.title,
		  icon:this.icon,
		  mask:true,
		  duration: 800
		})
	}
}

// 媒体处理
class Upload{
	constructor(){}
	
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
		let DB = await inIt()
		return new Promise((resolve,reject)=>{
			DB.uploadFile({
			  cloudPath: 'media/' + cloudpath,
			  filePath: route, // 文件路径
			  success: async(res) => {
				const res_url = await DB.getTempFileURL({fileList:[res.fileID]})
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

export {Feedback,Upload}