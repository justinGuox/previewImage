import http from "@/library/http.js"
import store from "@/store/index.js"

function getComId() {
	//获取公司id
	return store.state.companyId;
}

function getUserId() {
	//获取公司id
	return store.state.userId;
}


export default {
	// 解析code获得openId
	decodeUserInfo (params) {
		return http.get("/app/decodeUserInfo", params)
	},
	
	// 用户授权注册
	register(params) {
		return http.post("/app/register", params)
	},

	// 查询用户信息
	searchUser (params) {
		return http.post("/app/searchUser", params)
	},
	
	// 查询公司信息
	homePage (uid) {
		let params = {
			companyId: getComId()
		}
		if(params.companyId == null){
			params = {}
		}
		if(uid){
			params.userId = uid;
		}
		return http.get("/app/homePage", params)
	},
	
	// 查询用户信息
	getPhoneNumber (params) {
		return http.post("/app/getPhoneNumber", params)
	},
}