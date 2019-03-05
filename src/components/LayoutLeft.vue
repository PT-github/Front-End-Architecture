<template>
  <div class="layout-left-comp">
    <div class="layout-left-comp_top" @click="toggleFolderMenu">
      <i class="iconfont" :class="{'icon-zhankai': !isCollapse, 'icon-shouqi': isCollapse}"></i>
    </div>
    <!-- 超级管理员和管理员 -->
    <div class="layout-left-comp_content" v-if="currentRole.roleType === 'ADMIN' || currentRole.roleType === 'CJADMIN'">
      <vue-scroll>
        <el-menu  :unique-opened="true" :collapse="isCollapse" :default-active="defaultActive" :router="true" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-m iconfont icon-jichushuju "></i>
              <span>基础数据</span>
            </template>
            <el-menu-item index="/basic/term-info">学年学期</el-menu-item>
            <el-menu-item index="/basic/teacher-man">教师信息</el-menu-item>
            <el-menu-item index="/basic/grade-info">年级班级</el-menu-item>
            <el-menu-item index="/basic/class-data">课时数据</el-menu-item>
            <el-menu-item index="/basic/subject-info">科目信息</el-menu-item>
            <el-menu-item index="/basic/venue-info">场地信息</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-m iconfont icon-jiaoxuejihua "></i>
              <span>教学计划</span>
            </template>
            <el-menu-item index="/teaching-plan/teaching-group-info">教研组信息</el-menu-item>
            <el-menu-item index="/teaching-plan/teaching-division">教学分工</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-m iconfont icon-paikexitong"></i>
              <span>排课系统</span>
            </template>
            <el-menu-item index="/course/course-list">排课管理</el-menu-item>
            <!-- <el-menu-item index="/course/course-pre-arrange">预排</el-menu-item> -->
            <el-menu-item index="/course/course-table">查看课表</el-menu-item>
            <el-menu-item index="/course/history-list">历史课表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-m iconfont icon-shenpiguanli"></i>
              <span>审批管理</span>
            </template>
            <el-menu-item index="/approval-management/process-setting">流程设置</el-menu-item>
            <el-menu-item index="/approval-management/approval-info">调课审批</el-menu-item>
            <el-menu-item index="/approval-management/supply-management">代课管理</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-m iconfont icon-shujutongji"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="/data-statistics/flow-statistics">课量统计</el-menu-item>
            <el-menu-item index="/data-statistics/class-info">调课统计</el-menu-item>
            <el-menu-item index="/data-statistics/substitute-statistics">代课统计</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-m iconfont icon-pingtaiyonghu"></i>
              <span>平台用户</span>
            </template>
            <el-menu-item index="/platform/user-manage">用户管理</el-menu-item>
            <el-menu-item index="/platform/user-audit">用户审核</el-menu-item>
            <el-menu-item index="/platform/operation-log">操作日志</el-menu-item>
          </el-submenu>
          <!--应用中心-->
          <router-link class="appo-enter" to="/appo-center"><i class="iconfont">&#xe71b;</i><span v-show="!isCollapse">应用中心</span></router-link>
        </el-menu>
      </vue-scroll>
    </div>
    <!-- 普通用户 -->
    <div v-if="currentRole.roleType === 'COMMON'" class="layout-left-comp_content" >
      <vue-scroll>
        <el-menu :unique-opened="true" :collapse="isCollapse" :default-active="defaultActive" :router="true" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-m iconfont icon-kebiao"></i>
              <span>查看课表</span>
            </template>
            <el-menu-item index="/main-common/teacher-timetable">任课表</el-menu-item>
            <el-menu-item index="/main-common/class-timetable">班级表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-m iconfont icon-shenqing"></i>
              <span>调代课管理</span>
            </template>
            <el-menu-item index="/main-common/approval-info-common">调课管理</el-menu-item>
            <el-menu-item index="/main-common/supply-view-info">代课查询</el-menu-item>
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
      if (this.$route.path === '/main-common/approval-form') {
        return '/main-common/approval-info-common'
      }
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
  overflow: hidden;
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
    .el-menu-vertical-demo{
      padding-bottom: 80px;
    }
    .appo-enter{
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #F8F8F8;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      position: absolute;
      bottom: 0;
      z-index: 1;
      >i{
        display: inline-block;
        font-size: 18px;
        margin-right: 5px;
        padding-left: 24px;
      }
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
