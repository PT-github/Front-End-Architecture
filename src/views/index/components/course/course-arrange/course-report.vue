<template>
  <div class="course-report" v-show="vShow">
    <div class="course-report_content">
      <div class="left"><img src="../../../../../assets/img/bg.png" alt="bg"></div>
      <div class="right">
        <template v-if="finished">
          <div class="right-title">排课报告</div>
            <div class="report-table">
              <div class="table-item">
                <p class="nums">{{ report.classCount }}</p>
                <p class="names">班级数</p>
              </div>
              <div class="table-item">
                <p class="nums">{{ report.teacherCount }}</p>
                <p class="names">教师数</p>
              </div>
              <div class="table-item">
                <p class="nums">{{ report.courseCount }}</p>
                <p class="names">课节数</p>
              </div>
            </div>
            <div class="report-container">
              <vue-scroll>
                <div class="bt">整体检测</div>
                <ul class="result">
                  <li v-if="report.teacherWeekAlarmCount">教师单周课节数超出预警人数:<span class="nums">{{report.teacherWeekAlarmCount}}</span></li>
                  <li v-if="report.teacherDayAlarmCount">教师单天课节数超出预警人数:<span class="nums">{{report.teacherDayAlarmCount}}</span></li>
                  <li v-if="report.teacherSubjectAlarmCount">教师任课科目数超出预警人数:<span class="nums">{{report.teacherSubjectAlarmCount}}</span></li>
                  <li v-if="report.teacherCrossGradeAlarmCount">教师跨年级级数超出预警人数:<span class="nums">{{report.teacherCrossGradeAlarmCount}}</span></li>
                  <li v-if="report.blankCount">未排课节（空白）数:<span class="nums">{{report.blankCount}}</span></li>
                  <li v-if="report.tempStorageCount">暂存课节数:<span class="nums">{{report.tempStorageCount}}</span></li>
                </ul>
              </vue-scroll>
            </div>
            <div class="submit-box" v-if="!type">
              <el-button size="small" type="primary" @click="next">下一步</el-button>
              <el-button size="small" type="info" @click="resetCourse">重新排课</el-button>
            </div>
            <div class="close" @click="close"><i class="iconfont icon-x"></i></div>
        </template>
        <template v-else>
          <div class="loading">
            <img src="../../../../../assets/img/loading.gif" alt="">
            <div class="txt"  v-if="!type">正在排课中...</div>
            <div class="txt"  v-else>请稍等...</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CourseReport',
  props: ['schoolId','schoolYearId','termId','gradeIds', 'type'],
  data () {
    return {
      finished: false,
      vShow: false,
      report: {
        classCount: 1,
        teacherCount: 1,
        courseCount: 1,
        tempStorageCount: 1,
        blankCount: 1,
        teacherWeekAlarmCount: 1,
        teacherDayAlarmCount: 1,
        teacherSubjectAlarmCount: 1,
        teacherCrossGradeAlarmCount: 1
      }
    }
  },
  methods: {
    setData (data) {
      for (let prop in data) {
        this.$set(this.report, prop, data[prop])
      }
    },
    resetCourse () {
      this.finished = false
      this.$emit('resetArrange')
    },
    next () {
      this.$router.push({ path: '/course/course-hand-arrange', query: {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId,
        termId: this.termId,
        gradeIds: this.gradeIds
      } })
    },
    show () {
      this.vShow = true
    },
    setFinished (data) {
      this.finished = true
      this.setData(data)
    },
    close () {
      this.vShow = false
      this.finished = false
    }
  }
}
</script>
<style lang="scss" scoped>
.course-report {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: $course-report-color1;
  .course-report_content {
    position: absolute;
    width: 700px;
    height: 380px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    .right {
      background: $course-report-color3;
      flex: 1;
      .loading {
        width: 350px;
        height: 380px;
        text-align: center;
        display: table-cell;
        line-height: 380px;
        position: relative;
        .txt {
          position: absolute;
          top: 260px;
          width: 100%;
          text-align: center;
          left: 0;
          height: 25px;
          line-height: 25px;
        }
        > img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .close {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: $course-report-color10;
        cursor: pointer;
      }
      .report-container {
        height: 200px;
        width: 100%;
      }
      .submit-box {
        padding-left: 28px;
        margin-top: 15px;
        padding-right: 28px;
        text-align: center;
        .el-button {
          width: 70px;
          padding-left: 0;
          padding-right: 0;
          text-align: center;
        }
      }
      .result {
        li {
          color: $course-report-color9;
          font-size: 12px;
          padding-left: 34px;
          padding-right: 34px;
          white-space: pre-line;
          line-height: 18px;
          .nums {
            padding-left: 12px;
            font-weight: bold;
            // color: #000;
          }
        }
      }
      .bt {
        padding-top: 11px;
        padding-bottom: 7px;
        font-size: 14px;
        color: $course-report-color7;
        padding-left: 34px;
        font-weight: bold;
        &.expr {
          color: $course-report-color8;
        }
      }
      .report-table {
        height: 60px;
        text-align: center;
        margin: 0 30px;
        display: flex;
        border-top: 1px solid $course-report-color4;
        border-left: 1px solid $course-report-color4;
        .table-item {
          flex: 1;
          height: 60px;
          border-right: 1px solid $course-report-color4;
          border-bottom: 1px solid $course-report-color4;
          .nums {
            height: 38px;
            line-height: 46px;
            color: $course-report-color5;
            font-size: 24px;
            font-weight: bold;
          }
          .names {
            height: 18px;
            line-height: 18px;
            color: $course-report-color6;
            font-size: 12px;
          }
        }
      }
      .right-title {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        text-align: center;
        font-weight: bold;
        color: $course-report-color2;
      }
    }
    .left {
      img {
        display: block;
      }
    }
  }
}
</style>
