<template>
	<view>
			<view class="" style="display: flex;flex-direction: column;justify-content: center;margin-top: 20rpx;align-items: center;margin-bottom: 10rpx;">
				<view class="" @click="openFileSelector"><img :src="formModel.avatar" alt="选择头像" style="width: 150rpx;height: 150rpx;border-radius: 50%;margin-bottom: 10rpx;"></view>
					<view class=""><button size="mini" style="background-color: #5cd375;color: white;"  @click="openFileSelector">修改头像</button></view>
				</view>
		<view style="display: flex;flex-direction: column;align-items: center;">
			<view>
				<view class=".update-form"><span style="margin-right: 5px;font-size: 16px;">姓名:</span><input class="form-item"   v-model="formModel.name"></view>
				<view class=".update-form"><span style="margin-right: 5px;font-size: 16px;">学院:</span><input class="form-item"   v-model="formModel.college"></view>
				<view class=".update-form"><span style="margin-right: 5px;font-size: 16px;">性别:</span>	<uni-data-select
				      v-model="formModel.sex"
				      :localdata="range"
				      @change="change"></uni-data-select></view>
				<button type="primary" @click="onSubmit">提交</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/common/request.js'
import {useUserStore} from '@/store/user.js'

 const range = ref(
 [
        { value: 0, text: "男" },
        { value: 1, text: "女" },
        { value: 2, text: "保密" },
      ],) 
const formModel = ref({
  account: '',
  name: '',
  avatar: ''
})
let account = ref('')
const userStore = useUserStore()
const { user } = userStore
formModel.value = user
//提交
 const onSubmit = () => {
		request.put('/user/update',formModel.value).then(
		result=>{
			if(result.data.code === 1){
				uni.showToast({
					title:'修改成功'
				})
			}
		}
		)
}
//选择头像
const openFileSelector = () =>{
    uni.chooseImage({
          success: (res) => {
            const tempFilePaths = res.tempFilePaths // 获取选择的文件路径
            const fs = uni.getFileSystemManager()
            fs.readFile({
              filePath: tempFilePaths[0],
              encoding: 'base64',
              success: (data) => {
                const base64 = 'data:image/png;base64,' + data.data // 获取图片对应的 base64 字符串
				formModel.value.avatar=base64
              }
            })
          }
        })
  }
	
</script>

<style>

.form-item{
	margin-bottom: 5rpx;
	padding: 5rpx;
	line-height: 80rpx;
	height: 80rpx;
	border: 1px #f4f4f4 solid;
}
.update-form{
	display: flex;
	align-items: center;
	line-height: 80rpx;
	margin-bottom: 10rpx;
	height: 80rpx;
	padding: 5rpx;
}
</style>