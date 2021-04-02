import http from './http.js';
import Vue from 'vue';
import conf from "./config.js"
import user from "./apis/user.js"

class Api {
	install(Vue) {
		Vue.prototype.$api = this;
	}
	
	// 解析图片真实的地址
	getRealUrls(imgs){
		return http.post(`${conf.baseUrl}/login/login/getGalleryUrl`,{
			uuidStr:imgs
		},"POST",true);
	}

}
let api = new Api();
api.user = user;
export default api;
