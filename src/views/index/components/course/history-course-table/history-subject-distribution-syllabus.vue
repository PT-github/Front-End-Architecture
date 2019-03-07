<template>
  <div class="course-all-table border-comp">
     <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.subject" placeholder="科目" @change="getHistoryCourseTableList">
               <el-option v-for="item in subjectOptions" :key="item.uid"
                     :label="item.subjectFullname"
                     :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getHistoryCourseTableList" class="icon-button pr-10">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
          <el-checkbox v-model="showTeacher">显示教师</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
     <div
      class="course-all-table_content"
      ref="table"
      :class="'col-'+maxCourse"
    >
      <el-table :data="tableData3" style="width: 100%" height="100%" v-loading="loading">
        <el-table-column fixed prop="classes" label="年级班级" width="90" align="center"></el-table-column>
        <el-table-column v-for="(item, index) in maxCourseWeekDay" :label="Week[index]" align="center" :key="index + '_maxCourseWeekDay'">
            <el-table-column v-for="(it, idx) in maxCourse" :label="(idx + 1) + ''" width="60" align="center" :key="idx + '_maxClassIndex_' + index">
              <template slot-scope="scope">
                <div class="lattice" v-if="scope.row['sub_' + index + '_' + idx]">
                    <p class="sub" v-if="!showShortSubject">{{ scope.row['sub_' + index + '_' + idx].subjectName }}</p>
                    <p class="sub" v-if="showShortSubject">{{ scope.row['sub_' + index + '_' + idx].subjectShortName }}</p>
                    <p class="name" v-if="showTeacher">{{ scope.row['sub_' + index + '_' + idx].teacherName }}</p>
                  </div>
                </template>
              </el-table-column>
          </el-table-column>
          <template slot="empty">
                <div v-if="loading">
                </div>
                <div v-else>
                    <img src="../../../../../assets/img/no-data.png">
                    <p>暂无课表数据</p>
                </div>
            </template>
      </el-table>
     </div>
    
  </div>
</template>
<script>
import { getHistoryCourseTable, getSubjectsCourse } from '../../../store/api';
export default {
  name: 'HistorySubjectDistributionSyllabus',
  data () {
    return {
      formInline: {
        subject: '',
      },
      list: [],
      checkList: ['0','1'],
      tableData3: [],
      showTeacher: true,       //显示教师
      showShortSubject: false,    //科目简称
      repalceDialog: false,
      subjectOptions: null,     //科目
      replaceCourseObj: {},     //代课详情
      adjustCourseObj: {},      //调课详情 
      currentSchool: null,     //当前学校
      term: null,    //学期id
      schoolYearId: null,      //学年
      Week: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],     // 固定的礼拜数-常量
      maxCourse: 6,
      maxCourseWeekDay: 5,
      loading: false
    }
  },
  mounted(){  //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.schoolYearId = +this.$route.query.schoolYearId || null
    this.term = +this.$route.query.term || null
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getSubjectsCourseList();
    } 
  },
  methods: {
     //获取科目
    getSubjectsCourseList() {
      this.$_showLoading();
      this.loading = true;
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId
      }
      getSubjectsCourse(queryParams).then(res =>{
        if(res.data && res.data.length > 0) {
          this.subjectOptions = res.data;
          this.formInline.subject = this.subjectOptions[0].uid;
          this.getHistoryCourseTableList();
        }else {
          this.$nextTick(() => {
              this.loading = false
          })
        }
        this.$nextTick(() => {
              this.$_hideLoading()
          })
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading()
         this.loading = false
      }) 
    },
    //学科分布课表
    getHistoryCourseTableList() {
      this.loading = true;
      this.tableData3 = [];
        let queryParams = {
          termId: this.term,
          viewType: 6,
          uid: this.formInline.subject
        }
        getHistoryCourseTable(queryParams).then(res =>{
          if (res.data) {
            let data = res.data;
            let maxCourse = (data.maxCourseAm || 0) + (data.maxCoursePm || 0)
            if (data.maxCourseWeekDay && maxCourse) {
              this.maxCourseWeekDay = data.maxCourseWeekDay
              this.maxCourse = maxCourse
              if (data.classTimetableDtos && data.classTimetableDtos.length > 0) {
                for (let p = 0; p < data.classTimetableDtos.length; p++) {
                  let obj = {
                    classes: data.classTimetableDtos[p].className
                  }
                  let classTimetable = data.classTimetableDtos[p].classTimetableItemDtoList;
                  if (classTimetable && classTimetable.length > 0) {
                    for (let f = 0; f < classTimetable.length; f++) {
                      let weekDay = classTimetable[f].weekDay - 1;
                      let classIndex = classTimetable[f].classIndex - 1;
                      let index = "sub_" + weekDay + "_" + classIndex;
                      obj[index] = classTimetable[f]
                    }
                  }
                  this.tableData3.push(obj)
                }
              }
            }
          }else {
            this.tableData3 = [];
          }
          this.$nextTick(() => {
              this.loading = false
          })
      }).catch(e =>{
         console.log(e);
         this.loading = false;
         this.tableData3 = [];
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.course-all-table {
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
.course-all-table {
  .el-table__header {
    tr {
      &:first-child {
        th + th {
           border-right: 6px solid $course-view-color3;
        }
      }
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
.course-options-right {
      .el-button+.el-button {
         margin-left: 16px;
      }
 }
</style>
