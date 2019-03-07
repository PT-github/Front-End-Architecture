<template>
  <div class="preview-class-syllabus">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.gradeId" placeholder="年级" @change="getClassData">
            <el-option v-for="item in gradeOptions" :key="item.uid"
              :label="item.gradeFullName"
              :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.classId" placeholder="班级" @change="changeClass">
            <el-option v-for="item in classOptions" :key="item.classId"
              :label="item.classFullName"
              :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="formInline.checkList">
            <el-checkbox label="0">科目简称</el-checkbox>
            <el-checkbox label="1">显示教师</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="course-class-content" ref="table">
      <div class="table-left">
        <el-table v-loading="loading" :data="tableData" style="width: 100%;" height="100%" header-row-class-name="headerClassName">
          <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.classIndex }}节</p>
              <p class="name">{{ scope.row.time }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="weekFormatter[index]" min-width="168" align="center" v-for="(item, index) in maxCourseWeekDay" :key="index + '_maxCourseWeekDay'">
            <template slot-scope="scope" v-if="scope.row['v' + (index + 1)]">
              <p class="sub" v-if="formInline.checkList.indexOf('0') === -1">{{ scope.row['v' + (index + 1)].subjectName }}</p>
              <p class="sub" v-else>{{ scope.row['v' + (index + 1)].subjectShortName }}</p>
              <p class="name" v-if="formInline.checkList.indexOf('1') !== -1">{{ scope.row['v' + (index + 1)].teacherName }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-right">
        <el-table v-loading="loading" :data="tableData2" height="100%" :span-method="arraySpanMethod">
          <el-table-column label="任教老师" align="center">
            <template slot-scope="scope">
              <span v-if="scope.$index === tableData2.length-1 ">{{scope.row.teacherName}}</span>
              <a @click="linkToCourse(scope.row)" class="blue" v-else>{{scope.row.teacherName}}</a>
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
import { getGradeAndClass, getYear, previewClassCourse } from '../../../store/api';
export default {
  name: 'PreviewClassSyllabus',
  data () {
    return {
      params: {
        schoolId: '',
        gradeIds: '',
        termId: '',
        viewType: 3,
        schoolYearId: ''
      },
      maxCourseWeekDay: 5, // 每周上课天数
      maxClassIndex: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      tableData: [],
      showTeacherNo: false, //是否教师编号
      showTeacher: true, //显示教师
      showShortSubject: true, //科目简称
      loading: false,
      formInline: {
        gradeId: '',
        classId: '',
        checkList: ['1']
      },
      gradeOptions: [],
      gradeObj: {},
      classOptions: [],
      configData: [],
      tableData2: []
    }
  },
  mounted(){
    this.params.termId = this.$route.query.termId || "";
    this.params.gradeIds = this.$route.query.gradeIds || "";
    this.params.schoolId = this.$route.query.schoolId || "";
    // this.formInline.gradeId = this.$route.query.gradeId || "";
    // this.formInline.classId = this.$route.query.classId || "";
    this.$_showLoading()
    this.getYear().then(() => {
      this.getGrade().then(() => {
        this.$_hideLoading()
        this.getClassTable()
      })
    })
  },
  methods: {
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
      previewClassCourse({
        schoolId: this.params.schoolId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId,
        viewType: this.params.viewType,
        uid: this.formInline.classId,
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
          if (data.classTimetableDtos && data.classTimetableDtos.length > 0) {
            for (let j = 0; j < data.classTimetableDtos.length; j++) {
              if (data.classTimetableDtos[j].classTimetableItemDtoList && data.classTimetableDtos[j].classTimetableItemDtoList.length > 0) {
                for (let k = 0; k < data.classTimetableDtos[j].classTimetableItemDtoList.length; k++) {
                  tableConfig[
                    data.classTimetableDtos[j].classTimetableItemDtoList[k].classIndex + '_' + data.classTimetableDtos[j].classTimetableItemDtoList[k].weekDay
                  ] = data.classTimetableDtos[j].classTimetableItemDtoList[k]
                }
              }
              if (data.classTimetableDtos[j].classCourseCountDtos && data.classTimetableDtos[j].classCourseCountDtos.length > 0) {
                let count = 0
                for (let n = 0; n < data.classTimetableDtos[j].classCourseCountDtos.length; n++) {
                  this.tableData2.push(data.classTimetableDtos[j].classCourseCountDtos[n])
                  count += data.classTimetableDtos[j].classCourseCountDtos[n].total
                }
                this.tableData2.push({
                  teacherName: '合计周课时',
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
    // 获取当前学年
    getYear () {
      return new Promise((resolve, reject) => {
        getYear({
          schoolId: this.params.schoolId
        }).then(res => {
          if (res && res.data && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isDefault) {
                this.params.schoolYearId = res.data[i].uid
              }
            }
            if (this.params.schoolYearId) {
              resolve()
            } else {
              this.$message.error('没有学年信息，无法查询当前学年下的课表数据')
              reject('没有学年信息，无法查询当前学年下的课表数据')
            }
          } else {
            this.$message.error('没有学年信息，无法查询当前学年下的课表数据')
            reject('没有学年信息，无法查询当前学年下的课表数据')
          }
        })
      })
    },
    //获取年级
    getGrade(){
      let queryParams = {
        schoolId: this.params.schoolId,
        schoolYearId: this.params.schoolYearId,
      }
      return getGradeAndClass(queryParams).then(res =>{
        if(res.data && res.data.length > 0){
          let gradeList = this.params.gradeIds ? (this.params.gradeIds + '').split(',') : []
          let count = 0
          for (let i = 0; i < res.data.length; i++) {
            if (gradeList.indexOf(res.data[i].uid + '') !== -1) {
              this.gradeOptions.push(res.data[i])
              if (res.data[i].classList && res.data[i].classList.length > 0) {
                this.gradeObj[res.data[i].uid] = res.data[i].classList
              }
              if (count === 0) {
                this.formInline.gradeId = res.data[i].uid
                if (this.gradeObj[res.data[i].uid]) {
                  this.classOptions.push(...this.gradeObj[res.data[i].uid])
                  this.formInline.classId = this.gradeObj[res.data[i].uid][0].classId
                }
              }
              count++
            }
            
            
            // if (!this.$route.query.gradeId) {
            //   if (i === 0) {
            //     this.formInline.gradeId = res.data[i].uid
            //     if (this.gradeObj[res.data[i].uid]) {
            //       this.classOptions.push(...this.gradeObj[res.data[i].uid])
            //       this.formInline.classId = this.gradeObj[res.data[i].uid][0].classId
            //     }
            //   }
            // } else if (parseInt(this.$route.query.gradeId) === res.data[i].uid) {
            //   this.formInline.gradeId = this.$route.query.gradeId
            //   this.classOptions.push(...this.gradeObj[res.data[i].uid])
            //   this.formInline.classId = this.$route.query.classId
            // }
          }
        }
      })
    },
    //change年级
    getClassData(v) {
      this.classOptions.splice(0, this.classOptions.length)
      this.classOptions.push(...this.gradeObj[v])
      this.formInline.classId = this.gradeObj[v][0].classId
      this.getClassTable()
    },
    //change班级
    changeClass() {
      this.getClassTable()
    },
    //路径跳转
    linkToCourse(value){
      this.$router.push({  //核心语句
        path:'/course/preview-teacher-syllabus',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          teacherId: value.teacherId, 
          termId: this.params.termId,  
          gradeIds: this.params.gradeIds,
          schoolId: this.params.schoolId
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.preview-class-syllabus {
  width: 100%;
  height: 100%;
  background: $course-view-color1;
  .course-class-top {
    width: 100%;
    height: 60px;
    padding: 10px 20px 0;
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
.preview-class-syllabus {
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
</style>
