<template>
  <div class="preview-course">
    <div class="layout-top">
      <LayoutHeader></LayoutHeader>
    </div>
    <div class="layout-content">
      <div class="title">【课表预览】</div>
      <s-menu :menuList="menuList"></s-menu>
      <div class="course-table-content">
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
import LayoutFooter from '@/components/LayoutFooter';
export default {
  name: 'PreviewCourse',
  data () {
    return {
      menuList: [],
      params: {
        schoolId: '',
        gradeIds: '',
        termId: ''
      }
    }
  },
  watch: {
    '$route': function (v) {
      if (v.path === '/course/preview-course') {
        history.back()
      }
    }
  },
  created(){
    this.params.termId = this.$route.query.termId || ''
    this.params.gradeIds = this.$route.query.gradeIds || ''
    this.params.schoolId = this.$route.query.schoolId || ''
    this.menuList = [
      {
        title: '总课程表',
        path: '/course/preview-total-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      },
      {
        title: '总任课表',
        path: '/course/preview-total-teach-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      },
      {
        title: '班级课表',
        path: '/course/preview-class-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      },
      {
        title: '教师课表',
        path: '/course/preview-teacher-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      },
      {
        title: '场地课表',
        path: '/course/preview-field-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      },
      {
        title: '学科分布表',
        path: '/course/preview-subject-distribution-syllabus?termId=' + this.params.termId + '&gradeIds=' + this.params.gradeIds + '&schoolId=' + this.params.schoolId
      }
    ]
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
        this.$router.push(this.menuList[0])
      }
    }
  },
  components: {
    LayoutHeader,
    LayoutFooter
  }
}
</script>
<style lang="scss" scoped>
.preview-course {
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
    .title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
    }
    .course-table-content {
      height: calc(100% - 100px);
    }
  }
  .layout-bottom {
    height: 40px;
  }
}
</style>
