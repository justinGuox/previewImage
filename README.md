# previewImage

## uni-app 微信小程序 图片放大预览带有图片描述

## 示例
[![previewImage.md.gif](https://www.z4a.net/images/2021/04/02/previewImage.md.gif)](https://www.z4a.net/image/gmWL5L)




###### 跟微信小程序的wx.prevImage基本类似，体验上稍微有一点点差距吧，但是好在可以显示图片描述

这里实现了如下功能和细节：

+ 支持左右滑动
+ 图片双指缩放
+ 显示图片描述
+ 双击放大缩小
+ 图片放大后还能够左右滑动

# 使用方法

+ 将components中的previewImage复制到您的项目中
+ 具体可以参照项目目录index中的用法

``` js
<!-- 
	list 图片数据列表
	vertical 是否竖屏切换（默认false横屏）
	@uploadIndex 切换图片后返回来的图片位置（下标）
	@longPress 长按事件
 -->
<preview-image ref="previewImage" @longPress="() => {show = true}" @uploadIndex="uploadIndex"
	:list="list" :vertical="false"></preview-image>
```

# 如果对你有帮助，动动小手给个star，谢谢~
