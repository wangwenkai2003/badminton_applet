<template>
	<view style="background-color: #f4f4f4;width: 100vw;height: 100vh;">
			<view style="display: flex;color: #000000;background-color: #fff;border: 1px #f4f4f4 solid;padding:10px;border-radius: 5px;"><input  type="text" v-model="form.title" placeholder="标题"></view>
			<view style="display: flex;color: #000000;background-color: #fff;border: 1px #f4f4f4 solid;padding: 10px;border-radius: 5px;"><input type="digit" v-model="form.price" placeholder="价格"></view>
			<view style="background-color: #fff;border: #f4f4f4 1px solid; border-radius: 10px;padding: 10rpx;">
			<view style="width: 100%;"><textarea style="width: 97%;border: 1px #ccc solid;border-radius: 5px;padding: 5px;"   name="" id="" cols="30" rows="10"  v-model="form.descContent" placeholder="描述一下宝贝吧~"></textarea></view>
			
			<ul style="display: flex;flex-wrap: wrap;">
				<li @tap="openFileSelector(index)" style="margin: 5rpx;" v-for="(item,index) in imgList" :key="index">
					<view class="" style="position: relative;">
						<img :src="item"  alt="" style="width: 200rpx;height: 200rpx;margin-bottom: 10rpx;">
						<span v-if="index !== imgList.length-1" style="color: #ccc;position: absolute;right: 10%; top: 0;" @click="deleteImg(item)">x</span>
					</view>
					</li>
			</ul>
			<view style="margin-top: 10rpx;"><button type="primary" size="default" @click="publish">发布</button></view>
			</view>
	</view>
</template>
<script setup>
import { onMounted, ref } from "vue";
import request from "@/common/request.js"
import {useUserStore} from "@/store/user.js"
import {onReady,onLoad,onShow,onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'
import imgAdd from '@/common/addImg.js'
uni.setNavigationBarTitle({title:"发布装备"})
	
	const formModel = ref({
	  account: '',
	  password: '',
	  repassword: '',
	  name: '',
	  avatar: ''
	})
	
	const userStore = useUserStore()
	const { user } = userStore
	formModel.value = user
	console.log(user);
//随机id
let randomId = ref('')
randomId.value = Math.random().toString(36).substring(2) + Date.now().toString(36)

//装备表单
let form = ref({
  title:'',
  price:'',
  descContent: '',
  userAccount: formModel.value.account,
  imgId: ''
})	
	


const openFileSelector = (index) =>{
	if(index === imgList.value.length-1){
    uni.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths // 获取选择的文件路径
            const fs = uni.getFileSystemManager()
            fs.readFile({
              filePath: tempFilePaths[0],
              encoding: 'base64',
              success: (data) => {
                const base64 = 'data:image/png;base64,' + data.data // 获取图片对应的 base64 字符串
				imgList.value[index] = base64
				imgList.value.push(imgAdd)
              }
            })
          }
        })
		}
  }
//装备图片列表
let imgList = ref([imgAdd])
 
//预览图片
const previewImage = (item)=> {
    uni.previewImage({
      urls: [item],
      current: item
    })
  }
  
//删除动态图片
const deleteImg = (item)=>{
 imgList.value =imgList.value.filter(elem => elem !== item);
}
//发布装备
const publish =()=>{
	imgList.value.pop()
	form.value.imgId = randomId.value
	form.value.imgs = imgList.value
	form.value.userAccount =formModel.value.account
	request.post('/equiptment/save',form.value).then(
	res=>{
		if(res.data.code ===1){
			uni.showToast({
				title:"发布成功"
			})
			randomId.value =Math.random().toString(36).substring(2) + Date.now().toString(36)
			imgList.value = []
			imgList.value.push(imgAdd)
			form.value = {}
			form.value.userAccount =formModel.value.account
			setTimeout(function(){
			uni.navigateBack({
			delta: 1 
				});
			}, 2000);
		}
	})
	
}


</script>
<style></style>