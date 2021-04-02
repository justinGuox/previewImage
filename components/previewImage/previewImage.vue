<!-- uniapp 微信小程序 图片预览+放大缩小+图片描述 -- 昔年在干嘛呢 于 2021年3月31日14点25分 -->
<template>
	<view class="previewImage" v-if="show" @click="doubleClick"
		@touchmove.stop.prevent>
		<swiper class="swiper" :vertical="vertical" :current="current" @change="swiperChange" :disable-touch="swiper">
			<swiper-item @touchmove.stop="isMove" v-for="(item, i) in list" :key="i" :id="i">
				<image class="bgImg0" :src="item.img" mode="aspectFill"/>
				<movable-area class="marea" scale-area>
					<movable-view :id="'movable-view-'+i" :key="'movable-view-'+i" class="mview" direction="all"
						:out-of-bounds="isScale == 1 ? false : true" :inertia="true" damping="20" friction="2" scale="true" scale-min="1"
						scale-max="4" :scale-value="scale" @scale="onScale" @change="movableChange"
						@touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
						<image :id="'image-'+i" :key="'movable-view'+i" class="image" :src="item.img" :data-index="i" :data-src="item.img"
							mode="widthFix" />
					</movable-view>
				</movable-area>
			</swiper-item>
		</swiper>

		<view class="page" v-if="list.length > 0">
			<text class="text">{{ index + 1 }} / {{ list.length }}</text>
		</view>
		<view @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend" class="desc" v-if="list.length > 0">
			{{ list[index].pictureDescription }}
		</view>
	</view>
</template>

<script>
	export default {
		name: 'previewImage',
		props: {
			list: {
				//图片列表
				type: Array,
				required: true,
				default: () => {
					return [];
				}
			},
			// 是否竖屏
			vertical: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				swiper: false, //是否禁用
				show: false, //显示状态
				current: 0, //当前页
				index: 0, //当前页
				time: 0, //定时器
				interval: 1000, //长按事件
				scale: 1, //缩放比例
				old: {
					scale: 1
				},
				// 刚触碰的时间
				startTime: 0,
				// 记录手指点击的位置）
				startData: {
					clientX: '',
					clientY: ''
				},
				isZoom: false, // 是否缩放过
				lock: false, // 允许滑动
				isTouchOutOfBounds: null,
				isOutOfBounds: null,
				lastTapTimeoutFunc:null, // 记录双击事件
				lastTapDiffTime:0,
				isScale: 1 // 真实的比例变化
			};
		},
		watch: {
			isScale: {
				handler(newVal, objVal) {
					if (newVal > 1.000001) {
						this.lock = true // 当图片缩放值大于1时，不允许滑动
					} else {
						this.lock = false
						if (objVal > 1) {
							this.isZoom = true;
						}
					}
				},
				deep: true
			}
		},
		methods: {
			//比例变化
			onScale(e) {
				this.isScale = e.target.scale
				this.old.scale = e.target.scale
			},
			// 禁止swiper自带的滚动事件
			isMove() {
				return
			},

			//长按事件相关内容---------开始-------------------
			//接触开始
			handletouchstart(e) {

				if (this.isZoom) {
					this.isZoom = false
				}
				// 获取初始时间
				this.startTime = Date.now()
				// 获取初始的位置
				this.startData.clientX = e.changedTouches[0].clientX;
				this.startData.clientY = e.changedTouches[0].clientY;

				var tchs = e.touches.length;
				if (tchs != 1) {
					return false;
				}
				this.time = setTimeout(() => {
					this.onLongPress(e);
				}, this.interval);
				return false;
			},
			//清除定时器
			handletouchend(event) {

				// 如果图片缩放过，直接跳出（图片缩放后轮播图片会导致此方法执行两次，具体原因不明[可能我笨没发现😂]）
				// 这边用isZoom拦截一下
				if (this.isZoom) {
					return
				}

				const endTime = Date.now()
				if (endTime - this.startTime > 2000) {
					// 如果手指滑动的距离超过2s 就默认不合法
					return;
				}
				let elePosition = '暂无位置'
				// 记录手指滑动的方向
				const subX = event.changedTouches[0].clientX - this.startData.clientX;
				const subY = event.changedTouches[0].clientY - this.startData.clientY;
				if (subY > 50 || subY < -50) {
					if (subY > 50) {
						console.log('下滑')
						elePosition = '下滑'
					} else if (subY < -50) {
						console.log('上滑')
						elePosition = '上滑'
					}
				} else {
					if (subX > 100 / this.isScale) {
						console.log('右滑')
						elePosition = '右滑'
					} else if (subX < -100 / this.isScale) {
						console.log('左滑')
						elePosition = '左滑'
					} else {
						console.log('无效')
					}
				}
				
				if (this.isTouchOutOfBounds && this.isOutOfBounds) {
					this.lock = false
				}
				
				if (this.vertical) { // 竖屏
					if (elePosition == '下滑' && !this.lock) {
						if (this.current == 0) {
							this.current = this.list.length - 1
						} else {
							this.current--
						}
					} else if (elePosition == '上滑' && !this.lock) {
						if (this.current == this.list.length - 1) {
							this.current = 0
						} else {
							this.current++
						}
					}
				} else { // 横屏
					if (elePosition == '右滑' && !this.lock) {
						if (this.current == 0) {
							this.current = this.list.length - 1
						} else {
							this.current--
						}
					} else if (elePosition == '左滑' && !this.lock) {
						if (this.current == this.list.length - 1) {
							this.current = 0
						} else {
							this.current++
						}
					}
				}
				

				clearTimeout(this.time);
				if (this.time != 0) {
					//处理点击时间
				}
				return false;
			},
			//清除定时器
			handletouchmove() {
				clearTimeout(this.time);
				this.time = 0;
			},
			// 处理长按事件
			onLongPress(e) {
				var src = e.currentTarget.dataset.src;
				var index = e.currentTarget.dataset.index;
				var data = {
					src: src,
					index: index
				};
				this.$emit('longPress', data);
			},
			//长按事件相关内容---------结束-------------------

			//图片改变
			swiperChange(e) {
				console.log('图片改变事件', e);
				// 图片切换后，把相关参数还原
				this.isZoom = false
				this.lock = false
				this.index = e.target.current; //更新当前图片index
				this.isScale = 1
				// this.scale = 1; //缩放比例
				// 这样写是因为组件属性设置不生效
				// 具体参考 https://uniapp.dcloud.io/vue-api?id=componentsolutions
				this.scale = this.old.scale
				this.$nextTick(function() {
					this.scale = 1
				});
				this.isTouchOutOfBounds = null
				this.isOutOfBounds = null
				this.$emit('uploadIndex', this.index)
			},

			//移动变化
			movableChange(e) {
				if (this.isScale == 1) {
					this.lock = false // 允许滑动
				} else {
					this.lock = true // 不允许滑动
				}
				
				if (this.isScale != 1) {
					if (!this.isTouchOutOfBounds && e.detail.source == 'touch-out-of-bounds') {
						this.isTouchOutOfBounds = 'touch-out-of-bounds'
					} else if (!this.isOutOfBounds && e.detail.source == 'out-of-bounds') {
						this.isOutOfBounds = 'out-of-bounds'
					}
				}
			},
			//打开
			open(e) {
				if (e === null || e === '') {
					console.log('previewImage:打开参数无效');
					return;
				}

				if (!isNaN(e)) {
					if (e >= this.list.length) {
						console.log('previewImage:打开参数无效');
					} else {
						this.index = e;
					}
				} else {
					var index = this.list.indexOf(e);
					if (index === -1) {
						this.list = [e];
						this.index = 0;
						console.log('previewImage:未在图片地址数组中找到传入的图片，已为你自动打开单张预览模式')
					} else {
						this.index = this.list.indexOf(e);
						this.current = this.list.indexOf(e);
					}
				}
				console.log('previewImage:当前预览图片序号' + this.index);
				this.lock = false
				this.show = true;
			},
			// 自定义双击事件
			doubleClick(e) {
				this.lock = true
				
				let _this = this;
				let curTime = new Date().getTime();
				let lastTime = _this.lastTapDiffTime;
				_this.lastTapDiffTime = curTime;
				//两次点击间隔小于300ms, 认为是双击
				let diff = curTime - lastTime;
				if (diff < 300) {
					console.log("双击")
					// 如果图片当前没有放大则双击放大两倍
					if (this.isScale == 1) {
						this.isScale = 2
						this.scale = 2
					} else {
						// 否则双击还原
						this.swiperChange(e)
					}
					
					clearTimeout(_this.lastTapTimeoutFunc); // 成功触发双击事件时，取消单击事件的执行
				} else {
					// 单击事件延时300毫秒执行
					_this.lastTapTimeoutFunc = setTimeout(function() {
						console.log("单击")
					}, 300);
				}
			}
		}
	}
</script>

<!--使用scss,只在本组件生效-->
<style lang="scss" scoped>
	.previewImage {
		width: 100%;
		height: 100%;
		
		.swiper {
			width: 100%;
			height: 100%;
			position: relative;

			.bgImg0 {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 1;
				filter: blur(10rpx)
			}
			
			.marea {
				height: 100%;
				width: 100%;
				position: fixed;
				overflow: hidden;
				z-index: 3;

				.mview {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: auto;
					min-height: 100%;

					.image {
						width: 100%;
					}
				}
			}
		}

		.page {
			position: absolute;
			width: 100%;
			bottom: 20rpx;
			text-align: center;

			.text {
				color: #fff;
				font-size: 26rpx;
				background-color: rgba(0, 0, 0, 0.5);
				padding: 3rpx 16rpx;
				border-radius: 20rpx;
				user-select: none;
			}
		}

		.desc {
			position: fixed;
			bottom: 40rpx;
			width: 100%;
			height: 165rpx;
			box-sizing: border-box;
			padding: 5rpx 30rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 5;
			overflow: hidden;
			color: #fff;
			font-size: 28rpx;
			letter-spacing: 3rpx;
			user-select: none;
		}
	}
</style>
