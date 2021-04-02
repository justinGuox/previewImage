import isDev from './isDev.js';
export default new class Config{
	constructor(){
		// this.baseUrl = "https://wxapi.gongshuokeji.com/api"
		this.baseUrl = "https://testwxapi.gongshuokeji.com"
		this.apiUrl = `${this.baseUrl}/app`
		this.aliOssUrl = `${this.baseUrl}` // 阿里传图接口不需要/app后缀
		const test_reg = /.*test.*/;
		this.uploadFilePath = test_reg.test(this.baseUrl) ? "https://gsgallerytest.oss-cn-shanghai.aliyuncs.com/" : "https://gsgallery.oss-cn-shanghai.aliyuncs.com/" // 阿里ossBucket 测试环境
		this.test_env = test_reg.test(this.baseUrl); // 是否为测试环境
	}
}
