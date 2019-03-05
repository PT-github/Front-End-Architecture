<template>
  <div class="course-table">
    <s-title :title="'历史课表'"></s-title>
    <s-menu :menuList="menuList"></s-menu>
    <div class="course-table-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HistoryCourseTable',
  data () {
    return {
      menuList: [],
      term: null,    //学期id
      schoolYearId: null,   //学年id
    }
  },
  watch: {
    '$route': function (v) {
      if (v.path === '/course/history-course-table') {
        history.back()
      }
    }
  },
  created(){  //生命周期里接收参数
    this.term = +this.$route.query.term || null
    this.schoolYearId = +this.$route.query.schoolYearId || null
    this.menuList = [{
          title: '总课程表',
          path: '/course/history-total-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        },
        {
          title: '总任课表',
          path: '/course/history-total-teach-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        },
        {
          title: '班级课表',
          path: '/course/history-class-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        },
        {
          title: '教师课表',
          path: '/course/history-teacher-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        },
        {
          title: '场地课表',
          path: '/course/history-field-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        },
        {
          title: '学科分布表',
          path: '/course/history-subject-distribution-syllabus?term='+this.term+'&schoolYearId=' + this.schoolYearId
        }]
  },
  mounted () {
    let path = this.$route.path
    for (let i = 0; i < this.menuList.length; i++) {
      let menuParh;
      if(this.menuList[i].path.indexOf("?") != -1){
          menuParh = this.menuList[i].path.split("?")[0];
      }
      if (menuParh === path) {
        break;
      }
      if (i === this.menuList.length - 1) {
        this.$router.push({ path: '/course/history-total-syllabus' ,
                            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                              term: this.term,  
                              schoolYearId: this.schoolYearId
                            }})
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
