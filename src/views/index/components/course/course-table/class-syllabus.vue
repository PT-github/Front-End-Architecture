<template>
  <div class="course-class-table view-class-table">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.grade" placeholder="年级" @change="getClassData">
               <el-option v-for="item in gradeOptions" :key="item.uid"
                     :label="item.gradeFullName"
                     :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.class" placeholder="班级" @change="changeClass">
            <el-option v-for="item in classOptions" :key="item.classId"
                     :label="item.classFullName"
                     :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getCourseTableList" class="icon-button pr-10 mgt-2">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="formInline.checkList" @change="onChange">
            <el-checkbox label="0">科目简称</el-checkbox>
            <el-checkbox label="1">显示教师</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="fr course-options-right">
        <el-button size="small" class="icon-button pr-14" @click="onExport">
          <i class="iconfont icon-daochu"></i>
          <span class="mg-l">导出</span></el-button>
        <el-button size="small"
                   @click="printClass"
                   v-loading.fullscreen.lock="showprint"
                   element-loading-text="努力打印中..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.1)"
                   class="icon-button pr-14">
          <i class="iconfont icon-dayin"></i>
          <span class="mg-l">打印</span>
        </el-button>
      </div>
    </div>
    <div class="course-class-content" ref="table">
      <div class="table-left">
        <el-table :data="tableData3" style="width: 100%;" height="100%" v-loading="loading">
          <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.classIndex }}节</p>
              <p class="name">{{ scope.row.time }}</p>
            </template>
          </el-table-column>
          <el-table-column 
            :label="weekFormatter[index]"
            min-width="120" 
            align="center" 
            v-for="(item, index) in maxCourseWeekDay" 
            :key="index + '_maxCourseWeekDay'"
            >
              <template slot-scope="scope" v-if="scope.row['week' + (index + 1)]">
                <p class="sub" v-if="!showShortSubject">{{ scope.row['week' + (index + 1)].subjectName }}</p>
                <p class="sub" v-if="showShortSubject">{{ scope.row['week' + (index + 1)].subjectShortName }}</p>
                <p class="name" v-if="showTeacher">{{ scope.row['week' + (index + 1)].teacherName }}</p>
                <a class="replace-orange-icon" v-if="scope.row['week' + (index + 1)].replaceCourseDto" @click="onView(scope.row['week' + (index + 1)])"><span>代</span></a>
                <a class="adjust-blue-icon" v-if="scope.row['week' + (index + 1)].adjustCourseDto && !scope.row['week' + (index + 1)].replaceCourseDto" @click="onViewAdjust(scope.row['week' + (index + 1)])"><span>调</span></a>
                <a class="adjust-blue-icon top25" v-if="scope.row['week' + (index + 1)].adjustCourseDto && scope.row['week' + (index + 1)].replaceCourseDto" @click="onViewAdjust(scope.row['week' + (index + 1)])"><span>调</span></a>
                <!-- <a class="replace-orange-icon top25" v-if="scope.row['week' + (index + 1)].adjustCourseDto && scope.row['week' + (index + 1)].replaceCourseDto" @click="onView(scope.row['week' + (index + 1)])"><span>代</span></a> -->
              </template>
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
      <div class="table-right">
        <el-table :data="tableData" height="100%" :span-method="arraySpanMethod" v-loading="loadingLeft">
              <el-table-column label="任教老师" align="center" min-width="80">
                <template slot-scope="scope">
                  <span v-if="scope.$index === tableData.length-1 ">{{scope.row.teacherName}}</span>
                  <a @click="linkToCourse(scope.row)" class="blue" v-else>{{scope.row.teacherName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="subjectName" label="任教科目" align="center"></el-table-column>
              <el-table-column prop="total" label="周课时数" align="center"></el-table-column>
              <template slot="empty">
                <div v-if="loadingLeft">
                </div>
                <div v-else>
                    <img src="../../../../../assets/img/no-data.png">
                    <p>暂无课表数据</p>
                </div>
            </template>
          </el-table>
      </div>
    </div>
    <replace-dialog ref="replaceDialogComp" :replaceCourseObj="replaceCourseObj"></replace-dialog>
    <adjust-dialog ref="adjustDialogComp" :adjustCourseObj="adjustCourseObj"></adjust-dialog>
    <printClassSyllabus ref="printClassSyllabuscom"></printClassSyllabus>
  </div>
</template>
<script>
import printClassSyllabus from '../../print/print-class-syllabus';
import { getCourseTable, getCurrentTerm, getGradeAndClass, exportCourse } from '../../../store/api';
export default {
  name: 'ClassSyllabus',
  components: {
    printClassSyllabus
  },
  data () {
    return {
      schoolId: null,  //学校id
      currentSchool: null,
      classes: null,
      formInline: {
        grade: '',
        class: '',
        checkList: ['1']
      },
      configData: [],
      tableData3: [],
      tableData: [],     //任课数课表
      gradeOptions: [],   //年级
      schoolYearId: null,      //学年
      classOptions: [],
      showTeacher: true,
      showShortSubject: false,
      replaceCourseObj: {},     //代课详情
      adjustCourseObj: {},      //调课详情
      showprint: false,
      printContent: {},
      loading: false,
      loadingLeft: false,
      maxCourseWeekDay: 5, // 每周上课天数
      maxCourse: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      gradeObj:{},
    }
  },
  mounted(){  //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    let grade = +this.$route.query.grade || null
    this.classes = +this.$route.query.classes || null
    this.formInline['grade'] = grade;
    this.formInline['class'] = this.classes;
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getCurrentTermData();
    } 
  },
  methods: {
    // 导出课表
    onExport () {
      let subjectNo, teacherNo, showType;
      subjectNo = this.showShortSubject ? 1 : '';
      teacherNo = this.showTeacher ? 2 : '';
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
        schoolId: this.schoolId,
        showType: showType,
        viewType: 3,
        uid: this.formInline.class
      }
      exportCourse(data)
        .then( res => {
          console.log(res)
        })
    },
    printClass () {
      this.$refs['printClassSyllabuscom'].print()
    },
    //获取当前学期
    getCurrentTermData() {
      this.$_showLoading();
      this.loading = true;
      this.loadingLeft = true
       let queryParams = {
        schoolId: this.schoolId,
      }
      getCurrentTerm(queryParams).then(res =>{
        if(res.data) {
          this.printContent = res.data
          console.log(this.printContent)
          this.schoolYearId = res.data.schoolYearid
          this.getGrade();
        }else {
          this.$nextTick(() => {
             this.$_hideLoading()
             this.loading = false;
             this.loadingLeft = false
          })
        }
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading()
         this.loading = false;
         this.loadingLeft = false
      }) 
    },
    //获取年级
    getGrade(){
      this.$_showLoading();
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId,
      }
      this.gradeOptions.splice(0, this.gradeOptions.length)
      this.classOptions.splice(0, this.classOptions.length)
      getGradeAndClass(queryParams).then(res =>{
        if(res.data && res.data.length > 0){
          this.gradeOptions.push(...res.data)
          for(let item of res.data) {
            this.gradeObj[item.uid] = item.classList
          }
          if(!this.formInline.grade){
            this.formInline.grade = this.gradeOptions[0].uid;
          }
          this.classOptions.push(...this.gradeObj[this.formInline.grade])
          if(!this.classes){
            this.formInline.class = this.classOptions[0].classId;
          }
          console.log("1111111111111",this.formInline.grade,this.classOptions)
          this.$nextTick(() => {
             this.getParam();
             this.getCourseTableList();
          })
        }else {
          this.$nextTick(() => {
             this.loading = false;
             this.loadingLeft = false
          })
        }
        this.$nextTick(() => {
           this.$_hideLoading()
        })      
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading();
         this.loading = false;
         this.loadingLeft = false
      }) 
    },
    //change年级
    getClassData(value) {
      this.formInline.class = '';
      this.classes = '';
      this.classOptions.splice(0, this.classOptions.length)
      if(this.formInline.grade) {
        this.classOptions.push(...this.gradeObj[value])
        if(!this.classes){
            this.formInline.class = this.classOptions[0].classId;
        }
        this.$nextTick(() => {
          this.getParam();
          this.getCourseTableList();
        })
      }
    },
    //change班级
    changeClass() {
      if(this.formInline.grade && this.formInline.class) {
        this.getParam();
        this.getCourseTableList();
      }  
    },
    //页面参数
    getParam() {
      this.$router.push({  //核心语句
            path:'/course/class-syllabus',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              grade: this.formInline.grade,  
              classes: this.formInline.class,
          }
      })
    },
    //路径跳转
    linkToCourse(value){
      this.$router.push({  //核心语句
        path:'/course/teacher-syllabus',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          teacher: value.teacherId,  
        }
      })
    },
    //展示
    onChange(value) {
      this.showShortSubject = value.some(data => data === "0");
      this.showTeacher = value.some(data => data === "1");
      this.printClasses()
      console.log("value",this.showShortSubject,this.showTeacher);
    },
    //班级课表
    getCourseTableList() {
        this.loading = true;
        this.loadingLeft = true;
        this.tableData = []
        this.tableData3 = []
        let queryParams = {
          schoolId: this.schoolId,
          uid: this.formInline.class,
          viewType: 3,
        }
        getCourseTable(queryParams).then(res =>{
          console.log("11111111111111111",res.data);
          if(res.data) {
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
                  let classTimetable = data.classTimetableDtos[j].classTimetableItemDtoList;
                  let classCourseCountDtos = data.classTimetableDtos[j].classCourseCountDtos
                  if (classTimetable && classTimetable.length > 0) {
                    for (let k = 0; k < classTimetable.length; k++) {
                      let classIndex = classTimetable[k].classIndex
                      let weekDay = classTimetable[k].weekDay
                      let key = classIndex + '_' + weekDay
                      tableConfig[key] = classTimetable[k]
                    }
                  }
                  if (classCourseCountDtos && classCourseCountDtos.length > 0) {
                    let count = 0
                    for (let n = 0; n < classCourseCountDtos.length; n++) {
                      this.tableData.push(classCourseCountDtos[n])
                      count += classCourseCountDtos[n].total
                    }
                    this.tableData.push({
                      teacherName: '合计周课时',
                      total: count,
                      subjectName: ''
                    })
                  }
                }
              }

              for (let m = 1; m <= this.maxCourse; m++) {
                let obj = {}
                obj.classIndex = m
                obj.time = configData[m] ? '(' + configData[m].classStarttime + '-' + configData[m].classEndtime + ')': ''
                for (let prop in tableConfig) {
                  if (prop.indexOf(m + '_') === 0) {
                    obj['week' + tableConfig[prop].weekDay] = tableConfig[prop]
                  }
                }
                this.tableData3.push(obj)
              }
            } else {
              this.maxCourseWeekDay = 5
              this.maxCourse = 6
            }
          }else {
            this.tableData3 = [];
            this.tableData = [];
          }
          
          this.$nextTick(() => {
             this.loading = false;
             this.loadingLeft = false
          })
      }).catch(e =>{
         console.log(e);
         this.loading = false;
         this.loadingLeft = false
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
    },
    //合并行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex)
        if (rowIndex === this.tableData.length - 1) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
    },
  }
}
</script>
<style lang="scss" scoped>
.course-class-table {
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
  .course-class-content {
    width: 100%;
    height: calc(100% - 76px);
    display: flex;
    .table-left {
      width: 75%;
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
        z-index: 999;
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
      width: 25%;
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
.course-class-table {
  .el-table__header {
    th {
      padding: 24px 0;
      background: #FAFAFA;
    }
  }
  .el-table__body {
    td {
      height: 68px;
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
  .el-table__empty-block {
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
  }
  .table-left, .table-right {
    .el-table::before {
      height: 0;
    }
  }
}
.view-class-table {
  .el-table__header-wrapper {
    border-top: 1px solid $preview-class-table-color1 !important;
    border-right: 1px solid $preview-class-table-color1 !important;
    border-left: 1px solid $preview-class-table-color1 !important;
  }
}
.course-options-right {
      .el-button+.el-button {
         margin-left: 16px;
      }
 }
</style>
