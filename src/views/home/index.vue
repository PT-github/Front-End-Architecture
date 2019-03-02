<template>
  <div class="home">
    <div class="color">
      <span>AAA</span>
      <span>BBB</span>
      <span class="color3">CCC</span>
    </div>
    <div class="color2">首页2</div>
  </div>
</template>
<script>
export default {
  name: 'Home'
}
</script>
<style lang="less" scoped>
@color1: red;
.color {
  @color1: black;
  color: @color1;
  display: flex;
  > span {
    flex: 1;
  }
}
.color2 {
  color: @color1;
}
.color3 {
  color: @color_1;
}
</style>
