<template>
  <div class="approval-info" >
    <s-title :title="'消息列表'"></s-title>
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
  name: "MessageCenter",
  data() {
    return {
      menuList: [
        {
          title: "学校消息",
          path: "/message-center/school-message"
        },
        {
          title: "系统消息",
          path: "/message-center/system-message"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.approval-info {
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
