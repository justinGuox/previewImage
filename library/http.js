import conf from './config.js';
const http = function(){
	return http.post(...arguments);
}
http.post = function(url,data,method="POST",haveBaseUrl=false){
	let murl = ""
	if(haveBaseUrl){
		murl = url;
	}else{
		murl = conf.apiUrl+url;
	}
	return new Promise((resolve,reject)=>{
		uni.request({
		    url:murl,
			data,
			method,
		    complete:(res)=>{
				// console.log(res)
				if(res.statusCode == 200){
					resolve(res.data);
				}else{
					// reject(res);
				}
			}
		});
	})
}
http.aliOss = function(url,data,method="POST",haveBaseUrl=false){
	let murl = ""
	if(haveBaseUrl){
		murl = url;
	}else{
		murl = conf.aliOssUrl+url;
	}
	return new Promise((resolve,reject)=>{
		uni.request({
		    url:murl,
			data,
			method,
		    complete:(res)=>{
				// console.log(res)
				if(res.statusCode == 200){
					resolve(res.data);
				}else{
					// reject(res);
				}
			}
		});
	})
}
http.get = function(url,data){
	return http.post(url,data,"GET");
};
export default http;