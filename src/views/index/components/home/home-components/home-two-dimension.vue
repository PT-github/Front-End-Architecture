<template>
<!--二维码组件 -->
  <ul class="home-two-dimension clearfix">
      <li v-for="(item, index) in twoDimensionArr" :key="index + 'dimension'">
          <img src="../../../../../assets/img/wait.png">
          <p>{{item.name}}</p>
      </li>
  </ul>
</template>
<script>
export default {
  name: "HomeTwoDimension",
  props: {
    twoDimensionArr: {
      type: Array,
      required: true,
      default: () => 0
    }
  },
  data() {
    return {
    };
  }
};
</script>
<style lang="scss" scoped>
.home-two-dimension {
  padding: 8px 12px 22px 12px;
  li {
    width: 80px;
    margin: 16px 13px 0 13px;
    float: left;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      text-align: center;
      padding-top: 15px;
      color: #333;
      font-size: 12px;
    }
  }
}
</style>
