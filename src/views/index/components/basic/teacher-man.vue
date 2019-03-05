<template>
  <div class="teacher-man">
    <s-title :title="'教师信息'"></s-title>
    <!-- <s-menu :menuList="menuList"></s-menu> -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'TeacherMan',
  data () {
    return {
      /* menuList: [
        {
          title: '教师信息',
          path: '/basic/teacher-info'
        },
        {
          title: '教师组信息',
          path: '/basic/teacher-group-info'
        }
      ] */
    }
  },
}
</script>
<style lang="scss" scoped>
.teacher-man {
  width: 100%;
  height: 100%;
}
</style>
