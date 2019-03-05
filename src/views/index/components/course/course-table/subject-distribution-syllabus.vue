<template>
  <div class="course-all-table border-comp">
     <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.subject" placeholder="科目" @change="getCourseTableList">
               <el-option v-for="item in subjectOptions" :key="item.uid"
                     :label="item.subjectFullname"
                     :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getCourseTableList" class="icon-button pr-10 mgt-2">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
          <el-checkbox v-model="showTeacher">显示教师</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="fr course-options-right">
        <el-button size="small" class="icon-button pr-14" :loading="isExportLoading" @click="onExport">
          <i class="iconfont icon-daochu"></i>
          <span class="mg-l">导出</span></el-button>
        <el-button size="small"
                   @click="printSubject"
                   v-loading.fullscreen.lock="showprint"
                   element-loading-text="温馨提示：打印数据转换中，请耐心等待几分钟..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.1)"
                   class="icon-button pr-14">
          <i class="iconfont icon-dayin"></i>
          <span class="mg-l">打印</span>
        </el-button>
      </div>
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
                  <div  v-if="scope.row['sub_' + index + '_' + idx]">
                    <!-- <a class="adjust-blue-icon" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto" @click="onViewAdjust(scope.row['sub_' + index + '_' + idx])"><span>调</span></a>
                    <a class="replace-orange-icon" v-if="!scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto" @click="onView(scope.row['sub_' + index + '_' + idx])"><span>代</span></a>
                    <a class="replace-orange-icon top25" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto" @click="onView(scope.row['sub_' + index + '_' + idx])"><span>代</span></a> -->
                    <a
                      class="replace-orange-icon"
                      v-if="scope.row['sub_' + index + '_' + idx].replaceCourseDto"
                      @click="onView(scope.row['sub_' + index + '_' + idx])"
                    >
                      <span>代</span>
                    </a>
                    <a
                      class="adjust-blue-icon"
                      v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto && !scope.row['sub_' + index + '_' + idx].replaceCourseDto"
                      @click="onViewAdjust(scope.row['sub_' + index + '_' + idx])"
                    >
                      <span>调</span>
                    </a>
                    <a
                      class="adjust-blue-icon top25"
                      v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto"
                      @click="onViewAdjust(scope.row['sub_' + index + '_' + idx])"
                    >
                      <span>调</span>
                    </a>
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

     <replace-dialog ref="replaceDialogComp" :replaceCourseObj="replaceCourseObj"></replace-dialog>
     <adjust-dialog ref="adjustDialogComp" :adjustCourseObj="adjustCourseObj"></adjust-dialog>
    <!--<printSubSyllabus ref="printSubSyllabuscom"></printSubSyllabus>-->
    <printTotalSchedule v-if="printTotalScheduleBool" ref="printTotalSchedule" printName="subject"></printTotalSchedule>
  </div>
</template>
<script>
// import printSubSyllabus from '../../print/print-subjiect-distribution-syllabus';
import printTotalSchedule from '../../print/print-total-schedule';
import { getCourseTable, getCurrentTerm, getSubjectsCourse, exportCourse, deleteDownLoadFile } from '../../../store/api';
import { autoDownloadUrl } from '@/utils'
export default {
  name: 'SubjectDistributionSyllabus',
  components: {
    printTotalSchedule
  },
  data () {
    return {
      formInline: {
        subject: '',
      },
      list: [],
      Week: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],     // 固定的礼拜数-常量
      checkList: ['0','1'],
      tableData3: [],
      showTeacher: true,       //显示教师
      showShortSubject: false,    //科目简称
      repalceDialog: false,
      subjectOptions: null,     //科目
      replaceCourseObj: {},     //代课详情
      adjustCourseObj: {},      //调课详情
      maxCourse: 6,
      maxCourseWeekDay: 5,
      timer: null,
      isExportLoading: false,
      currentSchool: null,     //当前学校
      loading: false,
      showprint: false,
      printTotalScheduleBool: false,
      printContent: null,
    }
  },
  created(){  //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getCurrentTermData();
    }
  },
  methods: {
    // 导出课表
    onExport () {
      let subjectNo, teacherNo, showType, _this = this;
      subjectNo = _this.showShortSubject ? 1 : '';
      teacherNo = _this.showTeacher ? 2 : '';
      if (!subjectNo && !teacherNo) {
        showType = '';
      } else if (!subjectNo && teacherNo) {
        showType = teacherNo;
      } else if ( subjectNo && !teacherNo) {
        showType = subjectNo;
      } else {
        showType = subjectNo + ',' + teacherNo;
      }
      const data = {
        schoolId: _this.schoolId,
        showType: showType,
        viewType: 6,
        uid: _this.formInline.subject
      }
      _this.isExportLoading = true;
      exportCourse(data)
        .then( res => {
          if (res.code === '00000000') {
            autoDownloadUrl(res.data.fileUrl);
            const filePath = res.data.filePath;
            _this.isExportLoading = false;
            if (filePath) {
              // 下载成功后删除动态模板
                _this.timer = setTimeout(() => {
                deleteDownLoadFile(filePath)
                .then(res => {
                  console.log('res', res)
                });
              }, 30000)
            }
          }
        })
        .catch(() => {
          _this.isExportLoading = false;
        })
    },
    printSubject () {
      this.showprint = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.printTotalScheduleBool = true;
          setTimeout(() => {
            this.$refs['printTotalSchedule'].print()
          },500)
        })
      },100)
    },
    //获取当前学期
    getCurrentTermData() {
      this.$_showLoading();
      this.loading = true;
       let queryParams = {
        schoolId: this.schoolId,
      }
      getCurrentTerm(queryParams).then(res =>{
        if(res.data) {
          this.schoolYearId = res.data.schoolYearid;
          this.printContent = res.data;
          this.getSubjectsCourseList();
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
         this.$_hideLoading();
         this.loading = false;
      })
    },
     //获取教师
    getSubjectsCourseList() {
      this.$_showLoading();
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId
      }
      getSubjectsCourse(queryParams).then(res =>{
        if(res.data && res.data.length > 0) {
          this.subjectOptions = res.data;
          this.formInline.subject = this.subjectOptions[0].uid;
          this.$nextTick(() => {
              this.$_hideLoading()
          })
          this.getCourseTableList();
        }
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading();
         this.loading = false;
      })
    },
    //总课表
    getCourseTableList() {
       this.loading = true
       this.tableData3 = [];
        let queryParams = {
          schoolId: this.schoolId,
          viewType: 6,
          uid: this.formInline.subject
        }
        getCourseTable(queryParams).then(res =>{
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
           /*  this.width = maxCourse*120*data.maxCourseWeekDay +140+10
            this.$nextTick(function () {
              this.printSub()
            }) */
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
    //查看代课详情
    onView(item) {
      console.log("item",item);
      this.replaceCourseObj = item.replaceCourseDto;
      this.$refs['replaceDialogComp'].toogleVisiable(true)
    },
    //查看调课详情
    onViewAdjust(item) {
      console.log("item",item);
      this.adjustCourseObj = item;
      this.$refs['adjustDialogComp'].toogleVisiable(true)
    }
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
    .mgt-2 {
      margin-top: 1px;
    }
    .course-options-right {
      margin-top: 2px;
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
    z-index: 1;
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
    z-index: 2;
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
.print-sub{
  .el-table{
    border-bottom: 1px solid #000000 !important;
    th {
      border: 1px solid #000000;
    }
  }
  .el-table__header{
    th{
      background-color: #C1C1C1 !important;
      .cell{
        color: #000000;
        font-size: 30px !important;
        font-weight: bold !important;
        padding: 20px 0!important;
      }
    }
  }
  .el-table__body {
    td {
      &:first-child {
        font-size: 30px !important;
        font-weight: bold !important;
        background-color: #C1C1C1 !important;
      }
      border: 1px solid #000000;
      .cell{
        color: #000000;
        padding: 20px 0!important;
      }
    }
  }
}
</style>
