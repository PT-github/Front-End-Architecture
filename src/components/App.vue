<template>
  <div id="app">
    <img src="@/assets/img/add.png" alt="">
    <router-link :to="'/'" tag="a">首页</router-link>
    <router-link :to="'/login'" tag="a">登录</router-link>
    <button @click="save">Save name</button>
    <router-view></router-view>
  </div>
</template>
<script>
import { testApiService } from '@/services'
export default {
  name: 'app',
  created () {
    console.log('11111', this.$config)
    
  },
  methods: {
    save () {
      this.$store.dispatch('SetName', 'pengtao')
    }
  }
}
</script>
<style>
@import '../assets/css/common.css';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow-x: auto;
}
</style>
