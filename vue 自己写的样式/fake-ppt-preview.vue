<template>
	<!-- 
		轮播生效的两个要点：
			1、父容器给定宽高
			2、在父容器DOM节点存在后再调用初始化轮播方法
	 -->
	<div class="h-[100vh]">
		<button class="preview-button" @click="showMask" />
		<!-- 外层列表展示 -->
		<ul class="h-full" :style="{ overflow: overflow }">
			<li v-for="itm in imgArr" :key="itm.alt" class="mb-[4px]">
				<img :data-original="itm.do" :src="itm.src" :alt="itm.alt" />
			</li>
		</ul>
		<!-- 蒙层实现预览，bg-clip-content真好用 -->
		<div v-if="showMaskBool" class="fixed inset-0 z-10 flex bg-white">
			<div class="flex h-full w-[calc(100%-44px)] flex-1 flex-col">
				<div class="h-[185px]">
					<div dir="rtl" class="swiper my-swiper bg-[rgba(0,0,0,0.60)]">
						<div class="swiper-wrapper h-[130px]">
							<div
								v-for="(item, idx) in imgArr"
								:key="item.alt"
								class="swiper-slide relative bg-white bg-clip-content pt-[43px] pb-[12px]"
							>
								<img
									:alt="item.alt"
									:src="item.src"
									style="transform: rotate(90deg) scale(1.65)"
								/>
								<!-- 果然还得是数据驱动！ -->
								<div :class="idx !== activeIndex ? 'img-mask' : ''"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex-1 bg-[rgba(0,0,0,0.60)]">
					<div
						id="big-pic-container"
						ref="bigPic"
						class="h-[calc(100vh-185px-43px)] overflow-hidden bg-clip-content"
					>
						<img
							:src="flippedImageUrl"
							:alt="imgArr[activeIndex].alt"
							:width="picWidth"
						/>
					</div>
				</div>
			</div>

			<div class="flex basis-[44px] flex-col justify-center bg-black">
				<button
					class="h-4 w-full shrink-0 text-white"
					@click="showMaskBool = false"
				>
					<nui-icon color="white" name="arrow-up" size="32" />
				</button>
				<div
					style="writing-mode: vertical-lr; text-orientation: mixed"
					class="swiper-title flex flex-1 items-center justify-center text-white"
				>
					<span
						v-for="(txt, idx) in titleArr('张三先生的企划书')"
						:key="idx"
						class="rotate-90"
					>
						{{ txt }}
					</span>
				</div>
			</div>
		</div>
	</div>
	<!-- this.rotateImage(imgArr[0].src) -->
</template>

<script>
/* eslint-disable global-require */
import { icon } from 'nui'
import Swiper from 'swiper'
import 'swiper/swiper.css'

const imgArr = [
	{
		do: require('../assets/1.jpg'),
		src: require('../assets/1.jpg'),
		alt: '1'
	},
	{
		do: require('../assets/2.jpg'),
		src: require('../assets/2.jpg'),
		alt: '2'
	},
	{
		do: require('../assets/3.jpg'),
		src: require('../assets/3.jpg'),
		alt: '3'
	},
	{
		do: require('../assets/4.jpg'),
		src: require('../assets/4.jpg'),
		alt: '4'
	},
	{
		do: require('../assets/5.jpg'),
		src: require('../assets/5.jpg'),
		alt: '5'
	},
	{
		do: require('../assets/6.jpg'),
		src: require('../assets/6.jpg'),
		alt: '6'
	},
	{
		do: require('../assets/7.jpg'),
		src: require('../assets/7.jpg'),
		alt: '7'
	},
	{
		do: require('../assets/8.jpg'),
		src: require('../assets/8.jpg'),
		alt: '8'
	},
	{
		do: require('../assets/9.jpg'),
		src: require('../assets/9.jpg'),
		alt: '9'
	},
	{
		do: require('../assets/10.jpg'),
		src: require('../assets/10.jpg'),
		alt: '10'
	},
	{
		do: require('../assets/11.jpg'),
		src: require('../assets/11.jpg'),
		alt: '11'
	},
	{
		do: require('../assets/12.jpg'),
		src: require('../assets/12.jpg'),
		alt: '12'
	},
	{
		do: require('../assets/13.jpg'),
		src: require('../assets/13.jpg'),
		alt: '13'
	},
	{
		do: require('../assets/14.jpg'),
		src: require('../assets/14.jpg'),
		alt: '14'
	},
	{
		do: require('../assets/15.jpg'),
		src: require('../assets/15.jpg'),
		alt: '15'
	},
	{
		do: require('../assets/16.jpg'),
		src: require('../assets/16.jpg'),
		alt: '16'
	},
	{
		do: require('../assets/17.jpg'),
		src: require('../assets/17.jpg'),
		alt: '17'
	}
]

export default {
	name: 'PreviewPPT',
	components: {
		NuiIcon: icon
	},
	data() {
		return {
			activeIndex: 0,
			bigPic: {
				clientWidth: 0,
				clientHeight: 0
			},
			flippedImageUrl: null,
			imgArr,
			showMaskBool: false,
			swiper: null
		}
	},
	computed: {
		overflow() {
			if (this.showMaskBool) return 'hidden'
			return 'auto'
		},
		picWidth() {
			return this.bigPic.clientWidth
		},
		titleArr() {
			return (arr) => arr.split('')
		}
	},
	watch: {
		activeIndex(nv) {
			const activeSrc = this.imgArr[nv].src
			this.rotateImage(activeSrc)
		},
		showMaskBool(nv) {
			if (!nv) {
				this.swiper?.destroy()
				return
			}

			this.$nextTick(() => {
				this.initSwiper()
			})
		}
	},
	mounted() {},
	methods: {
		initSwiper() {
			// eslint-disable-next-line no-new
			const swiper = new Swiper('.my-swiper', {
				slidesPerView: 4,
				spaceBetween: 8,
				centeredSlides: true,
				direction: 'horizontal'
			})

			swiper.on('slideChange', (param) => {
				const { activeIndex } = param
				console.log('slideChange param', param)
				this.activeIndex = activeIndex
			})

			this.swiper = swiper
		},
		// 旋转横向图片用于展示大图
		rotateImage(imageUrl) {
			// new一个图片实例，得到原图
			const img = new Image()
			img.src = imageUrl

			// 创建一个画布
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')

			// 等图片加载
			img.onload = () => {
				const { clientWidth, clientHeight } = this.$refs.bigPic
				this.bigPic = { clientWidth, clientHeight }

				const { width, height } = img

				canvas.width = height
				canvas.height = width

				context.translate(canvas.width, 0)

				// 图片顺时针旋转90度后，宽高互换
				context.rotate((90 * Math.PI) / 180)

				// 宽高互换后，图片宽度从clientHeight/clientWidth=width/height。clientHeight要固定，算出图片的宽
				const propotionalWidth = (height * clientHeight) / clientWidth
				// 根据算到的propotionalWidth，按原图比例算出图片的高
				const propotionalHeight = (height * propotionalWidth) / width
				// 使图片居中
				const padding = (height * clientHeight) / width / 2

				context.drawImage(img, 0, padding, propotionalWidth, propotionalHeight)

				// 转画布为图片，塞给图片
				this.flippedImageUrl = canvas.toDataURL()
			}
		},
		showMask() {
			this.showMaskBool = true
			this.rotateImage(imgArr[0].src)
		}
	}
}
</script>

<style scoped lang="scss">
.preview-button {
	position: fixed;
	right: 20px;
	bottom: 78px;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background-image: url(../assets/rotate.png);
	background-size: contain;
}
.swiper {
	width: 100%;
	height: 100%;

	&-wrapper {
		height: 100%;
		/* 这里不能加这行，不然后面的图片都看不到了
			overflow: hidden;
		*/
	}

	&-slide {
		text-align: center;
		font-size: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&-title {
		font-family: PingFangSC-Medium;
		font-size: 18px;
		color: white;
		text-align: center;
		font-weight: 500;
	}
}
.img-mask {
	position: absolute;
	top: 43px;
	right: 0;
	bottom: 12px;
	left: 0;
	background-color: rgba(0, 0, 0, 0.3);
}
</style>
