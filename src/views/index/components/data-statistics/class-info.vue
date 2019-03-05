<template>
  <div class="class-info">
    <s-title :title="'调课统计'"></s-title>   
    <s-menu :menuList="menuList"></s-menu>
    <vue-scroll>
      <router-view></router-view>
    </vue-scroll>
  </div>
</template>
<script>
export default {
  name: 'ClassInfo',
  data () {
    return {
      menuList: [
        {
          title: '教师视角',
          path: '/data-statistics/teacher-vision'
        },
        {
          title: '班级视角',
          path: '/data-statistics/class-vision'
        }
      ]
    }
  },
}
</script>
<style lang="scss" scoped>
.class-info {
  width: 100%;
  height: 100%;
  .__vuescroll {
    height: calc(100% - 100px) !important;
  }
  .__view {
    width: 100% !important;
  }
}
</style>
<style lang="scss">
.class-info {
  .__vuescroll {
    height: calc(100% - 100px) !important;
  }
  .__view {
    width: 100% !important;
  }
}
</style>
