const base64 = require('./base64.js'); //Base64,hmac,sha1,crypto相关算法
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

import conf from '../config.js'
import api from '../api.js'
import store from '../../store/index.js'
import util from '../utils.js'
//需替换为实际地址
const ossHost = conf.uploadFilePath // <oss bucket 地址>
let fileName = null
/**
 * 获取oss临时授权信息
 */
let getUploadParams = async () => {
	const date = new Date();
	date.setHours(date.getHours() + 1);
	const res = await api.getGalleryToken(fileName ? fileName : store.getters.getFileName)
	// console.log('获取到动态oss', res);
	const policy = getPolicyBase64();
	const signature = getSignature(policy, res.data.result.credentials.accessKeySecret); //获取签名
	return {
		OSSAccessKeyId: res.data.result.credentials.accessKeyId,
		signature,
		policy,
		'x-oss-security-token': res.data.result.credentials.securityToken,
		basePath: res.data.bucket
	}
}
const getPolicyBase64 = function() {
	let date = new Date();
	date.setHours(date.getHours() + 87600); //这个是上传文件时Policy的失效时间
	let srcT = date.toISOString();
	const policyText = {
		"expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
		"conditions": [
			["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
		]
	};

	const policyBase64 = base64.encode(JSON.stringify(policyText));
	return policyBase64;
}

const getSignature = function(policyBase64, accessKeySecret) {
	const accesskey = accessKeySecret

	const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
		asBytes: true
	});
	const signature = Crypto.util.bytesToBase64(bytes);

	return signature;
}

/**
 * 上传一个文件
 * @param {object} param 授权信息
 * @param {string} localFilePath 本地图片路径
 * @param {string} dir 远程目录
 */
let uploadOne = (param, localFilePath, dir) => {
	return new Promise((resolve) => {
		let remotePath = `${dir}/${new Date().getTime()}`.replace(/[\/]+/g, '\/');
		console.log('发送的数据', {
			url: ossHost,
			filePath: localFilePath,
			name: 'file',
			formData: {
				key: remotePath,
				...param
			}
		});
		uni.uploadFile({
			url: ossHost,
			filePath: localFilePath,
			name: 'file',
			formData: {
				key: remotePath,
				...param
			},
			success: (res) => {
				console.log('上传结果 ' + localFilePath, res);
				//阿里云上传成功放回状态码为204
				if (res.statusCode === 204) {
					resolve(remotePath);
				} else {
					console.log('报错了', res);
					util.showModel(res.data)
					resolve("");
				}
			},
			fail: err => {
				console.log('上传失败 ' + localFilePath, err);
				// util.toast(err)
				util.showModel(res.data)
				resolve("");
			}
		});
	});
}

/**
 * 批量上传图片
 * @param {array} localFilePathList 本地图片地址列表
 * @param {string} uploadDir 远程上传目录
 */
let upload = async (localFilePathList, uploadDir) => {
	let param = await getUploadParams();
	let urlList = [];
	if (localFilePathList.length <= 0) {
		return urlList;
	}
	for (let i = 0; i < localFilePathList.length; i++) {
		if (!localFilePathList[i]) {
			continue;
		}
		//上传到oss的文件路径地址
		let aliurl = await uploadOne(param, localFilePathList[i], uploadDir);
		if (!!aliurl) {
			urlList.push(`${aliurl}`);
		}
	}
	//上传的多个oss文件路径地址
	return urlList;
}
/**
 * 选择图片并上传，返回上传后的最终图片数组
 * @param count 每次最多能选择几张图
 * @param {*} oraList 原图片数组可为[]
 * @param {*} ossSubPath 图片上传oss路径
 * @param {*} isReal 是否返回真实图片路径
 */
const chooseImage = (count, oraList, ossSubPath, isReal = false, name = null) => {
	if (name) {
		fileName = name
	}
	return new Promise((resolve) => {
		uni.chooseImage({
			count: count - (oraList || []).length,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				console.log('图片数据', res);
				let list = []
				let flag = false
				res.tempFiles.forEach(item => {
					if (item.size / 1024 / 1024 < 5) {
						list.push(item.path)
					} else {
						flag = true
					}
				})
				if (flag) {
					util.showModel('您选择的图片中有超过5MB大小的图，不支持上传，已自动帮您过滤')
				}
				let uploadRes = await upload(list, ossSubPath);
				console.log(`upload result:${JSON.stringify(uploadRes)}`);
				let uploaderList = (oraList || []).concat(uploadRes);
				if (isReal) {
					let imgList = []
					uploaderList.map(ele => {
						imgList.push(ele)
					})
					let imgUrl = await api.getRealUrls(imgList)
					uploaderList = imgUrl.data
				}
				resolve(uploaderList);
			},
			fail: error => {
				console.log(`upload error:${JSON.stringify(error)}`);
				util.toast(`${JSON.stringify(error)}`)
				resolve(oraList);
			}
		})
	});
}

export default {
	upload,
	chooseImage
}
