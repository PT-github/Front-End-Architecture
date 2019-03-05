<template>
  <div class="supply-view-info" >
    <!--代课查询  -->
    <s-title :title="'代课查询'"></s-title>
    <div class="s-menu clearfix">
      <router-link
        class="s-menu_a"
        :class="{'router-link-active': item.path === $route.path}"
        v-for="(item, index) in menuList"
        :key="'s-menu_' + index"
        :to="item.path"
      >
      {{ item.title }}
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "SupplyViewInfo",
  data() {
    return {
      menuList: [
        {
          title: "我代课的",
          path: "/main-common/my-supply-list"
        },
        {
          title: "我请假的",
          path: "/main-common/my-wantsupply-list"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.supply-view-info {
  width: 100%;
  height: 100%;
  position: relative;
  .s-menu {
    height: 50px;
    padding-bottom: 14px;
    padding: 0 20px;
    position: relative;
    border-bottom: 1px solid $menu-color5;
    background: $menu-color6;
    .s-menu_a {
      position: relative;
      height: 36px;
      line-height: 36px;
      color: $font-color;
      float: left;
      padding: 0 25px;
      background: $menu-color1;
      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: $menu-color2;
      &.router-link-active,
      &:hover {
        color: $menu-color4;
        background: $menu-color3;
        border-color: $menu-color3;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-of-type {
        border-right-width: 1px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
}
</style>
