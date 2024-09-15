<template>
  <view>
    <tabbar @click="redirectToHome" :current="currentTab">
      <tabbar-item index="0"></tabbar-item>
      <tabbar-item index="1"></tabbar-item>
      <tabbar-item index="2"></tabbar-item>
    </tabbar>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
    };
  },
  methods: {
    redirectToHome(e) {
      const { index } = e.currentTarget.dataset;
      console.log("xx");
      if (index === 2) {
        console.log('点击首页');
        // 执行跳转逻辑
        uni.switchTab({
          url: '/pages/home/home',
        });
      }
    },
  },
  onTabSwitch(e) {
    this.currentTab = e.index;
  },
};
</script>