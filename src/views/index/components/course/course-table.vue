<template>
  <div class="course-table">
    <s-title :title="'查看课表'"></s-title>
    <s-menu :menuList="menuList"></s-menu>
    <div class="course-table-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CourseTable',
  data () {
    return {
      menuList: [
        {
          title: '总课程表',
          path: '/course/total-syllabus'
        },
        {
          title: '总任课表',
          path: '/course/total-teach-syllabus'
        },
        {
          title: '班级课表',
          path: '/course/class-syllabus'
        },
        {
          title: '教师课表',
          path: '/course/teacher-syllabus'
        },
        {
          title: '场地课表',
          path: '/course/field-syllabus'
        },
        {
          title: '学科分布表',
          path: '/course/subject-distribution-syllabus'
        }
      ]
    }
  },
  watch: {
    '$route': function (v) {
      if (v.path === '/course/course-table') {
        history.back()
      }
    }
  },
  mounted () {
    let path = this.$route.path
    for (let i = 0; i < this.menuList.length; i++) {
      if (this.menuList[i].path === path) {
        break;
      }
      if (i === this.menuList.length - 1) {
        this.$router.push({ path: '/course/total-syllabus' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.course-table {
  width: 100%;
  height: 100%;
  background: $course-table-color1;
  .course-table-content {
    height: calc(100% - 100px);
  }
}
</style>
