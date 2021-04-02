export default function(){
	if(process.env.NODE_ENV === 'development'){
	    // console.log('开发环境')
		return true;
	}else{
	    // console.log('生产环境')
		return false;
	}
}