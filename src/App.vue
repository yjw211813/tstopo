<template>
  <el-config-provider :locale="locale">
    <el-watermark style="height: 100%" :font="font" :content="appStore.watermarking ? 'ZHOUYI' : ''" :zIndex="9999">
      <HomePage />
    </el-watermark>
  </el-config-provider>
</template>

<script setup>
import { reactive } from 'vue'
import { useAppStore } from "@/stores/AppSetting.js"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import HomePage from './components/HomePage.vue'

const appStore = useAppStore()
appStore.initThemeColor()

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})

const locale = zhCn
</script>

<style scoped>
@import './assets/styles/font.css';
</style>

