<template>
  <div class="layout-left-comp">
    <div class="layout-left-comp_top" @click="toggleFolderMenu">
      <i class="iconfont" :class="{'icon-zhankai': !isCollapse, 'icon-shouqi': isCollapse}"></i>
    </div>
    <!-- 超级管理员和管理员 -->
    <div class="layout-left-comp_content" >
      <vue-scroll style="height: auto;">
        <el-menu  :unique-opened="true" :collapse="isCollapse" :default-active="defaultActive" :router="true" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-m iconfont icon-jichushuju "></i>
              <span>成绩管理</span>
            </template>
            <el-menu-item index="/score-statistics">成绩统计</el-menu-item>
          </el-submenu>
        </el-menu>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
  import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui';
  export default {
    name: 'LayoutLeft',
    data () {
      return {
        isCollapse: false,
        roleInfoList: [],
        currentRole: {}
      }
    },
    computed: {
      defaultActive () {
        return this.$route.matched && this.$route.matched.length > 2 ? this.$route.matched[1].path : this.$route.path
      }
    },
    mounted () {
      // 获取到角色权限的字典数组
      if (this.$store.state.user.currentRole) {
        this.currentRole = this.$store.state.user.currentRole;
      }
      else {
        // this.$router.push({ path: '/' });
      }
    },
    methods: {
      toggleFolderMenu () {
        this.isCollapse = !this.isCollapse
        this.$nextTick(() => {
          this.$store.commit('SET_COLLAPSE', this.isCollapse)
        })
      }
    },
    components: {
      [Menu.name]: Menu,
      [Submenu.name]: Submenu,
      [MenuItem.name]: MenuItem,
      [MenuItemGroup.name]: MenuItemGroup
    }
  }
</script>
<style lang="scss" scoped>
  .layout-left-comp {
    width: 100%;
    height: 100%;
    .layout-left-comp_top {
      cursor: pointer;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background-color: $layout-color8;
      color: $layout-color9;
    }
    .layout-left-comp_content {
      height: calc(100% - 50px);
      width: 100%;
      .appo-enter{
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-top: 30px;
        background: #F8F8F8;
        display: block;
        text-align: center;
      }
    }
    .el-menu {
      border-right: 0;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 100%;
    }
    .el-menu--collapse {
      width: 64px;
    }
  }
</style>
<style lang="scss">
  .layout-left-comp {
    border-right: 1px solid #e8e8e8;
    .el-submenu__title {
      height: 50px;
      line-height: 50px;
      background: $layout-color14;
    }
    .el-submenu {
      .el-menu-item {
        min-width: 0;
        padding: 0 0 0 48px !important;
      }
    }
    .el-submenu__icon-arrow {
      margin-top: -6px;
    }
    .el-icon-arrow-down:before {
      content: '\E60E';
    }
    .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(90deg);
    }
    .el-menu-item {
      background-color: $layout-color10;
      &.is-active {
        background: $layout-color11;
        color: $layout-color13;
        border-left: 3px solid $layout-color12;
        padding-left: 45px !important;
      }
    }
  }

</style>