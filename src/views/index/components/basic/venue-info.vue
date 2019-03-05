<template>
  <div class="venue-info">
    <s-title :title="'场地信息'"></s-title>
    <s-menu :menuList="menuList"></s-menu>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'VenueInfo',
  data () {
    return {
      menuList: [
        {
          title: '场地列表',
          path: '/basic/venue-list'
        },
        {
          title: '分类设置',
          path: '/basic/venue-setting'
        }
      ]
    }
  },
}
</script>
<style lang="scss" scoped>
.venue-info {
  width: 100%;
  height: 100%;
}
</style>
