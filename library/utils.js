import Vue from 'vue'
const vm = new Vue()
class U {
	//挂载到vue上
	install(Vue) {
		Vue.prototype.u = this;
	}
	//预览图片
	preImgs(arr, index = 0) {
		uni.previewImage({
			current: index,
			urls: arr,
			indicator: "number"
		});
	}
	//跳转
	linkto(name, params) {
		if (!name) {
			console.log("name无效")
			return;
		}
		let url = `/pages${name}`;
		if (params) {
			let arr = [],
				tempStr = "",
				paramsStr = "";
			for (let k in params) {
				tempStr = `${k}=${params[k]}`;
				arr.push(tempStr)
			};
			paramsStr = arr.join("&");
			url = `${url}?${paramsStr}`;
		}
		console.log(url)
		uni.navigateTo({
			url
		});
	}
	//需要登录的跳转
	loginLinkto() {
		let isLogin = vm.$store.state.isLogin;
		if (!isLogin) {
			setTimeout(() => {
				this.linkto("login")
			}, 1000)
		} else {
			this.linkto(...arguments)
		}
	}
	//返回上级页面
	back(delta = 1) {
		uni.navigateBack({
			delta
		});
	}
	stBack() {
		setTimeout(() => {
			this.back();
		}, 1000)
	}
	//获取系统信息，同步
	getSysInfo(key = "none") {
		const info = uni.getSystemInfoSync();
		if (key == "none") {
			return info;
		} else {
			return info[key];
		}
	}
	//获取元素信息
	getDomInfo(that, select, type = "none") {
		return new Promise((resolve, reject) => {
			uni.createSelectorQuery().in(that).select(select).boundingClientRect().exec(res => {
				const dom = res[0];
				if (type == "none") {
					resolve(dom)
				} else {
					resolve(dom[type])
				}
			})
		})
	}
	//用户是否授权同意直接获取信息（用户个人信息)
	checkUserAuthor(key = "userInfo") {
		return new Promise((resolve,reject)=>{
			let k = "scope." + key;
			uni.getSetting({
				success(res) {
					resolve(!!res.authSetting[k]);
				},
				fail() {
					reject(false);
				}
			})
		})
	}
	//微信授权登录
	login() {
		return new Promise((resolve,reject)=>{
			uni.login({
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					this.toast('请忽频繁登录');
				}
			})
		})
	}
	//获取用户信息
	getUserInfo() {
		return new Promise((resolve,reject)=>{
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					resolve(infoRes);
				}
			});
		})
	}
	
	// uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
	authorize() {
		return new Promise((resolve,reject)=>{
			uni.authorize({
				complete(res) {
					resolve(res);
				}
			})
		})
	}
	
	// 轻提示
	toast(title, icon = "none", duration = 2000) {
		return new Promise((resolve, reject) => {
			uni.showToast({
				title,
				icon,
				duration,
				success(res) {
					resolve(true)
				},
				fail() {
					resolve(false)
				}
			});
		})
	}
	
	// 不可预知的错误可以使用这个，传入什么显示什么
	showModel(parmas) {
		uni.showModal({
			title: '提示',
			content: parmas,
			cancelText: "取消", // 取消按钮的文字  
			confirmText: "确定", // 确认按钮文字  
			showCancel: true, // 是否显示取消按钮，默认为 true
			confirmColor: '#f55850',
			cancelColor: '#39B54A',
			success: (res) => {
				return true
			},
			fail: (err) => {
				return false
			}
		})
	}
	
	// 添加加载中
	showLoading(title = "加载中", mask = false) {
		return uni.showLoading({
			title,
			mask
		})
	}
	// 隐藏加载中
	hideLoading(duration = 0) {
		setTimeout(() => {
			uni.hideLoading()
		}, duration)
	}
	
	// 分享
	getShareData({
		title,
		page,
		params,
		imgUrl
	}) {
		let query = "";
		if (params) {
			let tempArr = [],
				temp = ""
			for (let k in params) {
				temp = `${k}=${params[k]}`
				tempArr.push(temp)
			}
			query = "?" + tempArr.join("&")
		}
		let obj = {
			title,
			path: `/pages/${page}/${page}${query}`
		}
		if (imgUrl) {
			obj.imageUrl = imgUrl;
		}
		// console.log(obj)
		return obj;
	}
	// 实现一个等待
	wait(time = 1000) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true)
			}, time)
		})
	}
	
	//给列表设置真实的图片地址（或者mp3地址)
	setRealUrls(imgs, list, key = "img") {
		return new Promise(async (resolve, reject) => {
			let res = await vm.$api.getRealUrls(imgs);
			if (res.code == 200) {
				list.forEach((ele, i) => {
					ele[key] = res.data[i]
				});
				resolve(true)
			} else {
				resolve(false)
			}
		})
	}
	
	//获取上一个页面的实例
	getBeforPageVm() {
		var pages = getCurrentPages(); //当前页
		var beforePage = pages[pages.length - 2]; //上个页面
		var vm = beforePage.$vm;
		return vm;
	}
	
	//更新上一个页面，在对应的页面中要定义refresh方法，或者传入方法名
	refreshBeforPage(funkey = "refresh") {
		let bvm = this.getBeforPageVm();
		if (bvm) {
			if (typeof bvm.refresh == "function") {
				bvm[funkey]();
			}
		}
	}
	
	//打开自定义产品预览页面
	openCustomerPreviewPage(item, shareData, isMaterialId = false) {
		//传值
		getApp().setGlobalData("singleProductionItem", item);
		getApp().setGlobalData("shareData", shareData);
		//进入
		if (isMaterialId) {
			uni.navigateTo({
				url: "/pages/customerPreviewImagePage/customerPreviewImagePage?isMaterialId=true",
				animationType: "none"
			})
		} else {
			uni.navigateTo({
				url: "/pages/customerPreviewImagePage/customerPreviewImagePage",
				animationType: "none"
			})
		}
	}
}
export default new U();
