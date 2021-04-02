<template>
	<view class="nearby">
		<u-modal v-model="show" @confirm="longPressConfirm" :content="content" show-cancel-button></u-modal>
		<!-- 
			list 图片数据列表
			vertical 是否竖屏切换（默认false横屏）
			@uploadIndex 切换图片后返回来的图片位置（下标）
			@longPress 长按事件
		 -->
		<preview-image ref="previewImage" @longPress="() => {show = true}" @uploadIndex="uploadIndex" :list="list" :vertical="false"></preview-image>
	</view>
</template>

<script>
	import previewImage from '../../components/previewImage/previewImage.vue'
	export default {
		components: {
			previewImage
		},
		mounted() {
			this.$refs.previewImage.open(0) // 传入当前选中的图片地址或序号
		},
		data() {
			return {
				list: [
					{
						img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2724794965,3454133930&fm=26&gp=0.jpg',
						id: 1,
						pictureDescription: '这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述'
					},
					{
						img: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2985749150,2139066177&fm=26&gp=0.jpg',
						id: 2,
						pictureDescription: '这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述2'
					}, {
						img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2467621717,794133693&fm=26&gp=0.jpg',
						id: 3,
						pictureDescription: '这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述这里是图片描述3'
					}
				],
				show: false,
				content: '这里是长按事件，可以放你想放的方法'
			};
		},
		methods: {
			// 图片切换后拿到的图片位置
			uploadIndex (index) {
				console.log('当前图片', this.list[index]);
			},
			longPressConfirm () {
				console.log('长按事件点击确定');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nearby {
		width: 100%;
		height: 100%;
		background-color: #000000;
		z-index: 1;
	}
</style>
