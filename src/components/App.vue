<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  created () {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
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
