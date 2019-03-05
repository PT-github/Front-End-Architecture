<template>
  <div class="layout">
    <div class="layout-top">
      <LayoutHeader></LayoutHeader>
    </div>
    <div class="layout-content">
      <div class="layout-content_left" :class="{isFolder: collapse}">
        <LayoutLeft></LayoutLeft>
      </div>
      <div class="layout-content_right">
        <router-view></router-view>
      </div>
    </div>
    <div class="layout-bottom">
      <LayoutFooter></LayoutFooter>
    </div>
  </div>
</template>
<script>
  import LayoutHeader from '@/components/LayoutHeader';
  import LayoutLeft from '@/components/LayoutLeftScore';
  import LayoutFooter from '@/components/LayoutFooter';
  import { mapGetters } from 'vuex';
  export default {
    name: 'Layout',
    computed: {
      ...mapGetters([
        'collapse'
      ])
    },
    components: {
      LayoutHeader,
      LayoutLeft,
      LayoutFooter
    }
  }
</script>
<style lang="scss" scoped>
  .layout {
    width: 100%;
    height: 100%;
    min-width: 1360px;
    .layout-top {
      height: 60px;
    }
    .layout-content {
      height: calc(100% - 100px);
      width: 100%;
      overflow: hidden;
      display: flex;
      .layout-content_left {
        width: 160px;
        height: 100%;
        transition: width .3s ease-in-out;
        &.isFolder {
          width: 65px !important;
        }
      }
      .layout-content_right {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
      }
    }
    .layout-bottom {
      height: 40px;
    }
  }
</style>