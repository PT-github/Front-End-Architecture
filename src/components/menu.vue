<template>
  <div class="s-menu clearfix">
    <template v-if="menuList.length > 0">
      <router-link class="s-menu_a" :class="{'router-link-active': item.path === $route.path}" v-for="(item, index) in menuList" :key="'s-menu_' + index" :to="item.path">
        {{ item.title }}
      </router-link>
    </template>
    <div class="s-menu_right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'sMenu',
  props: {
    menuList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      
    }
  },
  methods:{
    handleSelect () {
      console.log('....')
    }
  }
}
</script>
<style lang="scss" scoped>
.s-menu {
  height: 50px;
  // line-height: 44px;
  padding-bottom:14px;
  padding: 0 20px;
  position: relative;
  border-bottom: 1px solid $menu-color5;
  background: $menu-color6;
  .s-menu_a {
    height: 36px;
    line-height: 36px;
    color: $font-color;
    float: left;
    padding: 0 25px;
    background: $menu-color1;
    border-width: 1px 0 1px 1px;
    border-style: solid;
    border-color: $menu-color2;
    &.router-link-active, &:hover {
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
  .s-menu_right {
    float: right;
    padding-right: 15px;
    cursor: pointer;
  }
}
</style>
