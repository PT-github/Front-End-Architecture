<template>
  <div class="preview-total-syllabus border-comp">
    <div class="course-options">
      <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
      <el-checkbox v-model="showTeacher">显示教师</el-checkbox>
      <el-checkbox v-model="showTeacherNo">显示教师编号</el-checkbox>
    </div>
    <div class="course-all-table_content" ref="table">
      <el-table v-loading="loading" :data="tableData" style="width: 100%;" height="100%">
        <el-table-column fixed prop="classes" label="年级班级" width="110" align="center"></el-table-column>
          <el-table-column v-for="(item, index) in maxCourseWeekDay" :class-name="index !== maxCourseWeekDay - 1 ? 'column-last' : ''" :label="weekFormatter[index]" align="center" :key="index + '_maxCourseWeekDay'">
            <el-table-column v-for="(it, idx) in maxClassIndex" :class-name="(idx === maxClassIndex - 1 && index !== maxCourseWeekDay - 1) ? 'column-last' : ''" :label="(idx + 1) + ''" width="60" align="center" :key="idx + '_maxClassIndex_' + index">
              <template slot-scope="scope">
                <div class="lattice" v-if="scope.row[(index + 1) + '_' + (idx + 1)]">
                  <p class="sub" v-if="!showShortSubject">{{ scope.row[(index + 1) + '_' + (idx + 1)].subjectName }}</p>
                  <p class="sub" v-if="showShortSubject">{{ scope.row[(index + 1) + '_' + (idx + 1)].subjectShortName }}</p>
                  <p class="name" v-if="showTeacher">{{ scope.row[(index + 1) + '_' + (idx + 1)].teacherName }}</p>
                  <p class="name" v-if="showTeacherNo">{{ scope.row[(index + 1) + '_' + (idx + 1)].teacherNo }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { previewClassCourse } from "../../../store/api";
export default {
  name: "PreviewTotalSyllabus",
  data() {
    return {
      params: {
        schoolId: "",
        gradeIds: "",
        termId: "",
        viewType: 1
      },
      maxCourseWeekDay: 5, // 每周上课天数
      maxClassIndex: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      tableData: [],
      showTeacherNo: false, //是否教师编号
      showTeacher: true, //显示教师
      showShortSubject: true, //科目简称
      loading: false
    };
  },
  created() {
    this.params.termId = this.$route.query.termId || "";
    this.params.gradeIds = this.$route.query.gradeIds || "";
    this.params.schoolId = this.$route.query.schoolId || "";
    this.getHistoryCourseTableList();
  },
  methods: {
    //总课表
    getHistoryCourseTableList() {
      this.loading = true
      this.tableData.splice(0, this.tableData.length)
      previewClassCourse(this.params)
        .then(res => {
          if (res.data) {
            let data = res.data;
            let maxCourse = (data.maxCourseAm || 0) + (data.maxCoursePm || 0)
            if (data.maxCourseWeekDay && maxCourse) {
              this.maxCourseWeekDay = data.maxCourseWeekDay
              this.maxClassIndex = maxCourse;
              if (data.classTimetableDtos && data.classTimetableDtos.length > 0) {
                for (let p = 0; p < data.classTimetableDtos.length; p++) {
                  let obj = {
                    classes: data.classTimetableDtos[p].className
                  }
                  if (data.classTimetableDtos[p].classTimetableItemDtoList && data.classTimetableDtos[p].classTimetableItemDtoList.length > 0) {
                    for (let f = 0; f < data.classTimetableDtos[p].classTimetableItemDtoList.length; f++) {
                      obj[
                        data.classTimetableDtos[p].classTimetableItemDtoList[f].weekDay + '_' + data.classTimetableDtos[p].classTimetableItemDtoList[f].classIndex
                      ] = data.classTimetableDtos[p].classTimetableItemDtoList[f]
                    }
                  }
                  this.tableData.push(obj)
                }
              }
            }
          } else {
            this.tableData3 = [];
          }
          this.$nextTick(() => {
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-total-syllabus {
  width: 100%;
  height: 100%;
  background: $course-view-color1;
  .course-all-table_content {
    margin: 0 15px 13px;
    height: calc(100% - 76px);
    // background: #FFF;
  }
  .has-btn-border:hover {
    border-color: $button-blue-color !important;
  }
  .course-options {
    height: 60px;
    background: $course-table-color2;
    padding: 20px;
    .course-options-right {
      margin-top: -7px;
      .operate-top-btn {
        border: 1px solid $teaching-division-color3;
        background-color: #fff;
        span {
          margin-left: 4px;
        }
      }
    }
  }
  .lattice-tag {
    background: #ebf5fe;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .lattice {
    position: relative;
    z-index: 2;
    .sub {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: $course-view-color5;
    }
    .name {
      font-size: 12px;
      color: $course-view-color6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  @mixin icon-style {
    position: absolute;
    right: 0;
    width: 16px;
    height: 24px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    display: inline-block;
    span {
      padding: 0 2px;
    }
  }
  .adjust-blue-icon {
    top: 0;
    background: url("../../../../../assets/img/blue-icon.png") no-repeat;
    @include icon-style;
  }
  .replace-orange-icon {
    top: 0;
    background: url("../../../../../assets/img/orange-icon.png") no-repeat;
    @include icon-style;
  }
  .top25 {
    top: 25px !important;
  }
}
</style>
<style lang="scss">
.column-last {
  border-right: 8px solid $preview-class-table-color1 !important;
}
.preview-total-syllabus {
  .el-table__header {
    tr {
      // &:first-child {
      //   th + th {
      //     border-right: 6px solid $course-view-color3;
      //   }
      // }
      &:last-child {
        /*  th:nth-child(6n) {
          border-right: 1px solid #999;
        } */
      }
    }
  }
  .el-table__body {
    tr {
      td {
        position: relative;
        /* &:nth-child(6n + 1) {
          border-right: 1px solid #999;
        } */
      }
    }
  }
  .el-table__body tr.hover-row > td {
    background: none;
  }
  .el-table .cell {
    padding: 0 2px;
  }
  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding: 0px 2px;
  }
}
</style>
