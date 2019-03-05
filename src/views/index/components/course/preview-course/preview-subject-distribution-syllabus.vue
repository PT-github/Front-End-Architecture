<template>
  <div class="preview-subject-distribution-syllabus border-comp">
     <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.uid" placeholder="科目" @change="getClassTable">
            <el-option v-for="item in subjectOptions" :key="item.uid"
              :label="item.subjectFullname"
              :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button icon="el-icon-search" @click="getHistoryCourseTableList">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
          <el-checkbox v-model="showTeacher">显示教师</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
     <div class="course-all-table_content" ref="table">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" height="100%">
        <el-table-column fixed prop="className" label="年级班级" width="110" align="center"></el-table-column>
          <el-table-column v-for="(item, index) in maxCourseWeekDay" :class-name="index !== maxCourseWeekDay - 1 ? 'column-last' : ''" :label="weekFormatter[index]" align="center" :key="'maxCourseWeekDay_' + index">
            <el-table-column v-for="(item2, idx) in maxCourse" :class-name="(idx === maxCourse - 1 && index !== maxCourseWeekDay - 1) ? 'column-last' : ''" :label="(idx + 1) + ''" width="60" align="center" :key="'table2_' + idx">
              <template slot-scope="scope">
                <div class="lattice" v-if="scope.row[(idx + 1) + '_' + (index + 1)]">
                  <p class="sub" v-if="!showShortSubject">{{ scope.row[(idx + 1) + '_' + (index + 1)].subjectName }}</p>
                  <p class="sub" v-if="showShortSubject">{{ scope.row[(idx + 1) + '_' + (index + 1)].subjectShortName }}</p>
                  <p class="name" v-if="showTeacher">{{ scope.row[(idx + 1) + '_' + (index + 1)].teacherName }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
      </el-table>
     </div>
  </div>
</template>
<script>
import { previewClassCourse, getSubjectAndTeacher } from '../../../store/api';
export default {
  name: 'PreviewSubjectDistributionSyllabus',
  data () {
    return {
      params: {
        schoolId: '',
        gradeIds: '',
        termId: '',
        viewType: 6,
        schoolYearId: ''
      },
      maxCourseWeekDay: 5, // 每周上课天数
      maxCourse: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      tableData: [],
      showTeacherNo: false, //是否教师编号
      showTeacher: true, //显示教师
      loading: false,
      formInline: {
        uid: ''
      },
      gradeOptions: [],
      gradeObj: {},
      classOptions: [],
      configData: [],
      tableData2: [],
      subjectOptions: [],
      showClass: true,
      showShortClass: false,
      showShortSubject: false //科目简称
    }
  },
  created () {
    this.params.termId = this.$route.query.termId || "";
    this.params.gradeIds = this.$route.query.gradeIds || "";
    this.params.schoolId = this.$route.query.schoolId || "";
    this.$_showLoading()
    this.getSubjectsCourseList().then(() => {
      this.$_hideLoading()
      this.getClassTable()
    })
  },
  methods: {
    // 获取课表
    getClassTable() {
      this.loading = true
      this.tableData.splice(0, this.tableData.length)
      previewClassCourse({
        schoolId: this.params.schoolId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId,
        viewType: this.params.viewType,
        uid: this.formInline.uid,
      }).then(res => {
        let data = res.data, configData = {}
        this.maxCourse = (data.maxCourseAm || 0) + (data.maxCoursePm || 0)
        this.maxCourseWeekDay = data.maxCourseWeekDay || 0
        if (this.maxCourse && this.maxCourseWeekDay) {
          if (data.baseSchoolGradeTimes && data.baseSchoolGradeTimes.length > 0) {
            for (let i = 0; i < data.baseSchoolGradeTimes.length; i++) {
              configData[data.baseSchoolGradeTimes[i].classIndex] = data.baseSchoolGradeTimes[i]
            }
          }
          if (data.classTimetableDtos && data.classTimetableDtos.length > 0) {
            for (let j = 0; j < data.classTimetableDtos.length; j++) {
              let obj = {}
              obj.className = data.classTimetableDtos[j].className
              if (data.classTimetableDtos[j].classTimetableItemDtoList && data.classTimetableDtos[j].classTimetableItemDtoList.length > 0) {
                for (let k = 0; k < data.classTimetableDtos[j].classTimetableItemDtoList.length; k++) {
                  obj[
                    data.classTimetableDtos[j].classTimetableItemDtoList[k].classIndex + '_' + data.classTimetableDtos[j].classTimetableItemDtoList[k].weekDay
                  ] = data.classTimetableDtos[j].classTimetableItemDtoList[k]
                }
              }
              this.tableData.push(obj)
            }
          }
        } else {
          this.maxCourseWeekDay = 5
          this.maxCourse = 5
        }
        this.$nextTick(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    //获取科目
    getSubjectsCourseList() {
      let queryParams = {
        termId: this.params.termId,
        gradeIds: this.params.gradeIds
      }
      return getSubjectAndTeacher(queryParams).then(res =>{
        if(res.data && res.data.length > 0) {
          let uidList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].subjectInfoList && res.data[i].subjectInfoList.length > 0) {
              for (let j = 0; j < res.data[i].subjectInfoList.length; j++) {
                if (uidList.indexOf(res.data[i].subjectInfoList[j].uid) === -1) {
                  !this.formInline.uid && (this.formInline.uid = res.data[i].subjectInfoList[j].uid)
                  uidList.push(res.data[i].subjectInfoList[j].uid)
                  this.subjectOptions.push(res.data[i].subjectInfoList[j])
                }
              }
            }
          }





          // this.subjectOptions.push(...res.data)
          // this.formInline.uid = this.subjectOptions[0].uid;
        }
      }).catch(e =>{
         console.log(e);
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-subject-distribution-syllabus {
  width: 100%;
  height: 100%;
  background: $course-view-color1;
  .course-all-table_content {
    margin: 0 15px 13px;
    height: calc(100% - 76px);
    // background: #FFF;
  }
  .course-class-top {
    width: 100%;
    height: 60px;
    padding: 10px 20px 0;
    background-color: #FFF;
    .demo-form-inline {
      float: left;
      height: 34px;
      overflow: hidden;
    }
  }
  .lattice-tag {
    background: #EBF5FE;
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
    background: url('../../../../../assets/img/blue-icon.png') no-repeat;
    @include icon-style;
  }
  .replace-orange-icon {
    top: 0;
    background: url('../../../../../assets/img/orange-icon.png') no-repeat;
    @include icon-style;
  }
  .top25 {
    top: 25px!important;
  }
}
</style>
<style lang="scss">
.column-last {
  border-right: 8px solid $preview-class-table-color1 !important;
}
.preview-subject-distribution-syllabus {
  .el-table__header {
    tr {
      // &:first-child {
      //   th + th {
      //      border-right: 6px solid $course-view-color3;
      //   }
      // }
      /* &:last-child {
        th:nth-child(6n) {
          border-right: 1px solid #999;
        }
      } */
    }
  }
  .el-table__body {
    tr {
      td {
        position: relative;
        /* &:nth-child(6n + 7) {
          border-right: 1px solid #999;
        } */
      }
    }
  }
  .el-table__body tr.hover-row>td {
    background: none;
  }
  .el-table .cell {
      padding: 0 2px;
  }
  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding: 0px 2px;
  }
}
</style>
