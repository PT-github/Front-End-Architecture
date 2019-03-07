<template>
  <div class="preview-teacher-syllabus">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.teacherId" placeholder="教师姓名：" @change="getClassTable" @visible-change="changeValue" no-match-text="">
            <div class="select-input">
                <el-input v-model="selectName" placeholder="请输入教师姓名"></el-input>
            </div>
            <el-option v-for="item in currentTeacherList" :key="item.uid" :label="item.teacherName" :value="item.uid" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button icon="el-icon-search" @click="getHistoryTableTeachersList">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox v-model="showClass">显示班级</el-checkbox>
          <el-checkbox v-model="showShortClass">显示班级简称</el-checkbox>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="course-class-content" ref="table">
      <div class="table-left">
        <el-table v-loading="loading" :data="tableData" style="width: 100%;" height="100%">
          <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.classIndex }}节</p>
              <p class="name">{{ scope.row.time }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="weekFormatter[index]" min-width="168" align="center" v-for="(item, index) in maxCourseWeekDay" :key="index + 'table'">
            <template slot-scope="scope">
              <template v-if="scope.row['v' + (index + 1)]">
                <p class="sub" v-if="!showShortSubject">{{ scope.row['v' + (index + 1)].subjectName }}</p>
                <p class="sub" v-if="showShortSubject">{{ scope.row['v' + (index + 1)].subjectShortName }}</p>
                <template v-if="showClass">
                  <p class="name" v-if="!showShortClass">{{ scope.row['v' + (index + 1)].className }}</p>
                  <p class="name" v-if="showShortClass">{{ scope.row['v' + (index + 1)].classShortName }}</p>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-right">
        <el-table v-loading="loading" :data="tableData2" height="100%" :span-method="arraySpanMethod">
          <el-table-column label="任教班级" align="center">
            <template slot-scope="scope">
              <span v-if="scope.$index === tableData2.length-1 ">{{ scope.row.className }}</span>
              <a @click="linkToCourse(scope.row)" class="blue" v-else>{{ scope.row.className }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="subjectName" label="任教科目" align="center"></el-table-column>
          <el-table-column prop="total" label="周课时数" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
   
  </div>
</template>
<script>
import { getSubjectAndTeacher, previewTeacherCourse } from '../../../store/api';
export default {
  name: 'PreviewTeacherSyllabus',
  data () {
    return {
      params: {
        schoolId: '',
        gradeIds: '',
        termId: '',
        viewType: 4,
        schoolYearId: ''
      },
      maxCourseWeekDay: 5, // 每周上课天数
      maxClassIndex: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      tableData: [],
      showTeacherNo: false, //是否教师编号
      showTeacher: true, //显示教师
      loading: false,
      formInline: {
        teacherId: ''
      },
      gradeOptions: [],
      gradeObj: {},
      classOptions: [],
      configData: [],
      tableData2: [],
      teacherOptions: [],
      showClass: true,
      showShortClass: false,
      showShortSubject: false, //科目简称
      selectName: '',
      currentTeacherList: [],
    }
  },
  mounted () {
    this.params.termId = this.$route.query.termId || "";
    this.params.gradeIds = this.$route.query.gradeIds || "";
    this.params.schoolId = this.$route.query.schoolId || "";
    this.formInline.teacherId = this.$route.query.teacherId || "";
    this.$_showLoading()
    this.getCourseTeachersList().then(() => {
      this.$_hideLoading()
      this.getClassTable()
    })
  },
  watch: {
    selectName (value) {
      this.filterFun(value)
    }
  },
  methods: {
    //路径跳转
    linkToCourse(value){
      this.$router.push({
        path:'/course/preview-class-syllabus',
        query:{
          classId: value.classId,
          gradeId: value.gradeId,
          termId: this.params.termId,  
          gradeIds: this.params.gradeIds,
          schoolId: this.params.schoolId
        }
      })
    },
    //合并行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log( row, column, rowIndex, columnIndex)
      if (rowIndex === this.tableData2.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },
    // 获取课表
    getClassTable() {
      this.loading = true
      this.tableData.splice(0, this.tableData.length)
      this.tableData2.splice(0, this.tableData2.length)
      previewTeacherCourse({
        schoolId: this.params.schoolId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId,
        viewType: this.params.viewType,
        teacherId: this.formInline.teacherId,
      }).then(res => {
        let data = res.data, configData = {}
        this.maxCourse = (data.maxCourseAm || 0) + (data.maxCoursePm || 0)
        this.maxCourseWeekDay = data.maxCourseWeekDay || 0
        if (this.maxCourseWeekDay) {
          let tableConfig = {}
          if (data.baseSchoolGradeTimes && data.baseSchoolGradeTimes.length > 0) {
            for (let i = 0; i < data.baseSchoolGradeTimes.length; i++) {
              configData[data.baseSchoolGradeTimes[i].classIndex] = data.baseSchoolGradeTimes[i]
            }
          }
          if (data.teacherTimetableDtos && data.teacherTimetableDtos.length > 0) {
            for (let j = 0; j < data.teacherTimetableDtos.length; j++) {
              if (data.teacherTimetableDtos[j].teacherTimetableItemDtoList && data.teacherTimetableDtos[j].teacherTimetableItemDtoList.length > 0) {
                for (let k = 0; k < data.teacherTimetableDtos[j].teacherTimetableItemDtoList.length; k++) {
                  tableConfig[
                    data.teacherTimetableDtos[j].teacherTimetableItemDtoList[k].classIndex + '_' + data.teacherTimetableDtos[j].teacherTimetableItemDtoList[k].weekDay
                  ] = data.teacherTimetableDtos[j].teacherTimetableItemDtoList[k]
                }
              }
              if (data.teacherTimetableDtos[j].courseCountDtos && data.teacherTimetableDtos[j].courseCountDtos.length > 0) {
                let count = 0
                for (let n = 0; n < data.teacherTimetableDtos[j].courseCountDtos.length; n++) {
                  this.tableData2.push(data.teacherTimetableDtos[j].courseCountDtos[n])
                  count += data.teacherTimetableDtos[j].courseCountDtos[n].total
                }
                this.tableData2.push({
                  className: '合计周课时',
                  total: count
                })
              }
            }
          }
          for (let m = 1; m <= this.maxCourse; m++) {
            let obj = {}
            obj.classIndex = m
            obj.time = configData[m] ? configData[m].classStarttime + '-' + configData[m].classEndtime : ''
            for (let prop in tableConfig) {
              if (prop.indexOf(m + '_') === 0) {
                obj['v' + tableConfig[prop].weekDay] = tableConfig[prop]
              }
            }
            this.tableData.push(obj)
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
    //获取教师
    getCourseTeachersList() {
      return getSubjectAndTeacher({
        termId: this.params.termId,
        gradeIds: this.params.gradeIds
      }).then(res => {
        if(res && res.data.length > 0) {
          let uidList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].teacherInfoList && res.data[i].teacherInfoList.length > 0) {
              for (let j = 0; j < res.data[i].teacherInfoList.length; j++) {
                if (uidList.indexOf(res.data[i].teacherInfoList[j].uid) === -1) {
                  !this.formInline.teacherId && (this.formInline.teacherId = res.data[i].teacherInfoList[j].uid)
                  uidList.push(res.data[i].teacherInfoList[j].uid)
                  this.teacherOptions.push(res.data[i].teacherInfoList[j])
                }
              }
            }
          }
          this.currentTeacherList = [...this.teacherOptions]
        }
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //下拉框出现/隐藏时触发
    changeValue(value) {
      console.log("value",value)
      this.selectName = ''
      this.currentTeacherList = [...this.teacherOptions]
    },
    //搜索过滤
    filterFun (name) {
      this.currentTeacherList.splice(0, this.currentTeacherList.length)
      if(this.teacherOptions && this.teacherOptions.length > 0) {
        if(name) {
          for (let i = 0; i < this.teacherOptions.length; i++) {
            if (this.teacherOptions[i].teacherName.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
              this.currentTeacherList.push(this.teacherOptions[i])
            }
          }
          if(!this.currentTeacherList || this.currentTeacherList.length <= 0) {
            this.currentTeacherList.push({teacherName: '无数据', uid: 'no-data',disabled: true})
          }
        }else {
          this.currentTeacherList = [...this.teacherOptions]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-teacher-syllabus {
  width: 100%;
  height: 100%;
    background: $course-view-color1;
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
  .course-class-content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    .table-left {
      width: 78%;
      padding-left: 20px;
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
    .table-right {
      width: 22%;
      padding: 0 20px;
      .blue {
        color: $course-view-color2;
      }
    }
  }
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
  .blank-data {
    padding: 50px 0;
    text-align: center;
  }
}
</style>
<style lang="scss">
.preview-teacher-syllabus {
  .el-table__header-wrapper {
    border-top: 1px solid $preview-class-table-color1 !important;
    border-right: 1px solid $preview-class-table-color1 !important;
    border-left: 1px solid $preview-class-table-color1 !important;
  }
  .el-table__header {
    th {
      padding: 24px 0;
      background: #FAFAFA;
    }
  }
  .el-table__body {
    td {
      border-left: 1px solid #EAEAEA;
      &:last-child {
        border-right: 1px solid #EAEAEA;
      }
      &:first-child {
        background: #FAFAFA;
      }
    }
  }
  .table-right {
    .el-table__body {
      td {
        &:first-child {
          background: $course-view-color1;
        }
      }
    }
  }
}
.select-input {
   width: 168px;
   margin: 12px 20px 8px 20px;
 }
</style>
