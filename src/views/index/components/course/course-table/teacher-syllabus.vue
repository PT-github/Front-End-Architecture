<template>
  <div class="course-class-table view-teacher-table">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.teacher" placeholder="教师" @change="changeTeacher" filterable @visible-change="changeValue" no-match-text="">
            <div class="select-input">
                <el-input v-model="selectName" placeholder="请输入教师姓名"></el-input>
            </div>
            <el-option v-for="item in currentTeacherList" :key="item.uid"
                     :label="item.teacherName"
                     :value="item.uid"
                     :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getTableTeachersList" class="icon-button pr-10 mgt-2">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showClass" @change="onChangeClass">显示班级</el-checkbox>
          <el-checkbox v-model="showShortClass" @change="onChangeClassShort">显示班级简称</el-checkbox>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
          <!-- <el-checkbox-group v-model="formInline.checkList" @change="onChange">
            <el-checkbox :label="item.label" v-for="(item,index) in showList" :key="index">{{item.value}}</el-checkbox>
          </el-checkbox-group> -->
        </el-form-item>
      </el-form>
      <div class="fr course-options-right">
        <el-button size="small" class="icon-button pr-14" :loading="isExportLoading" @click="onExport">
          <i class="iconfont icon-daochu"></i>
          <span class="mg-l">导出</span></el-button>
        <el-button size="small"
                   @click="printsmallTeach"
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
                <p class="sub"  v-if="!showShortSubject">{{ scope.row['week' + (index + 1)].subjectName }}</p>
                <p class="sub"  v-if="showShortSubject">{{ scope.row['week' + (index + 1)].subjectShortName }}</p>
                <p class="name"  v-if="showClass">{{ scope.row['week' + (index + 1)].className }}</p>
                <p class="name" v-if="showShortClass">{{ scope.row['week' + (index + 1)].classShortName }}</p>
                <a class="replace-orange-icon" v-if="scope.row['week' + (index + 1)].replaceCourseDto" @click="onView(scope.row['week' + (index + 1)])"><span>代</span></a>
                <a class="adjust-blue-icon" v-if="scope.row['week' + (index + 1)].adjustCourseDto && !scope.row['week' + (index + 1)].replaceCourseDto" @click="onViewAdjust(scope.row['week' + (index + 1)])"><span>调</span></a>
                <a class="adjust-blue-icon top25" v-if="scope.row['week' + (index + 1)].adjustCourseDto && scope.row['week' + (index + 1)].replaceCourseDto" @click="onViewAdjust(scope.row['week' + (index + 1)])"><span>调</span></a>
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
        <el-table :data="tableData" height="100%" :span-method="arraySpanMethod" v-loading="loading">
              <el-table-column label="任教班级" align="center" min-width="80">
                <template slot-scope="scope">
                  <span v-if="scope.$index === tableData.length-1 ">{{scope.row.className}}</span>
                  <a @click="linkToCourse(scope.row)" class="blue" v-else>{{scope.row.className}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="subjectName" label="任教科目" align="center"></el-table-column>
              <el-table-column prop="total" label="周课时数" align="center"></el-table-column>
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
    <!-- <div class="no-data-comp">
       <div class="no-data-content">
          <img src="../../../../../assets/img/no-data.png"/>
          <p>暂无课表数据</p>
       </div>
     </div> -->

    <replace-dialog ref="replaceDialogComp" :replaceCourseObj="replaceCourseObj"></replace-dialog>
    <adjust-dialog ref="adjustDialogComp" :adjustCourseObj="adjustCourseObj"></adjust-dialog>
    <printteacherSyllabus ref="printteacherSyllabuscomp"></printteacherSyllabus>
  </div>
</template>
<script>
import printteacherSyllabus from '../../print/print-teacher-syllabus';
import { autoDownloadUrl } from "@/utils";
import { getCourseTeachers, getTableTeachers, exportCourse, deleteDownLoadFile } from '../../../store/api';
export default {
  name: 'TeacherSyllabus',
  components: {
    printteacherSyllabus
  },
  data () {
    return {
      schoolId: null,  //学校id
      isExportLoading: false,
      currentSchool: null,
      teacher: null,
      formInline: {
        teacher: '',
        checkList: ['0','2']
      },
      list:[],
      configData: [],
      tableData3: [],
      tableData: [],     //任课数课表
      teacherOptions: null,   //教师
      showList: [{
        label: '0',
        value: '显示班级'
      },{
        label: '1',
        value: '显示班级简称'
      },{
        label: '2',
        value: '显示科目'
      },{
        label: '3',
        value: '科目简称'
      }],
      showClass: true,
      showShortClass: false,      //是否展示班级简称
      showSubject: true,
      showShortSubject: false,
      replaceCourseObj: {},     //代课详情
      adjustCourseObj: {},      //调课详情
      timer: null,
      showprint: false,
      loading: false,
      maxCourseWeekDay: 5, // 每周上课天数
      maxCourse: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      selectName: '',
      currentTeacherList: [],
    }
  },
  created(){  //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.teacher = +this.$route.query.teacher || null;
    this.formInline['teacher'] = this.teacher;
    console.log("111111",this.formInline['teacher'],typeof this.formInline['teacher'])
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getCourseTeachersList();
    }
  },
  watch: {
    selectName (value) {
      this.filterFun(value)
    }
  },
  methods: {
    // 导出课表
    onExport () {
      let _this = this;
      let subjectNo, classNo, showType;
      subjectNo = _this.showShortSubject ? 1 : '';
      classNo = _this.showShortClass ? 4 : _this.showClass ? 3 : '';
      if (!subjectNo && !classNo) {
        showType = '';
      } else if (!subjectNo && classNo) {
        showType = classNo;
      } else if ( subjectNo && !classNo) {
        showType = subjectNo;
      } else {
        showType = subjectNo + ',' + classNo;
      }
      const data = {
        schoolId: _this.schoolId,
        showType: showType,
        viewType: 4,
        uid: _this.formInline.teacher
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
    printsmallTeach () {
      this.$refs['printteacherSyllabuscomp'].print()
    },
    //获取教师
    getCourseTeachersList() {
      this.$_showLoading();
      this.loading = true;
      getCourseTeachers(this.schoolId).then(res =>{
        if(res.data && res.data.length > 0) {
          this.teacherOptions = res.data;
          this.currentTeacherList = [...res.data]
          if(!this.teacher){
            this.formInline.teacher = this.teacherOptions[0].uid;
          }
          this.getTableTeachersList();
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
         this.loading = false;
      })
    },
    //显示班级
    onChangeClass(value) {
       if(value) {
         this.showShortClass = false;
       }
    },
    //显示班级简称
    onChangeClassShort(value) {
       if(value) {
         this.showClass = false;
       }
    },
    /* onChange(value) {
      this.showClass = value.some(data => data === "0");
      this.showShortClass = value.some(data => data === "1");
      this.showSubject = value.some(data => data === "2");
      this.showShortSubject = value.some(data => data === "3");
      console.log("value",this.showClass,this.showShortClass,this.showSubject,this.showShortSubject);
    }, */
    //教师课表
    getTableTeachersList() {
        this.loading = true;
        this.tableData = []
        this.tableData3 = []
        let queryParams = {
          schoolId: this.schoolId,
          uid: this.formInline.teacher,
          viewType: 4,
        }
        getTableTeachers(queryParams).then(res =>{
          console.log("11111111111111111",res.data);
          if(res.data){
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
                  let teacherTimetable = data.teacherTimetableDtos[j].teacherTimetableItemDtoList
                  let courseCountDtos = data.teacherTimetableDtos[j].courseCountDtos
                  if (teacherTimetable && teacherTimetable.length > 0) {
                    for (let k = 0; k < teacherTimetable.length; k++) {
                      let classIndex = teacherTimetable[k].classIndex
                      let weekDay = teacherTimetable[k].weekDay
                      let key = classIndex + '_' + weekDay
                      tableConfig[key] = teacherTimetable[k]
                    }
                  }
                  if (courseCountDtos && courseCountDtos.length > 0) {
                    let count = 0
                    for (let n = 0; n < courseCountDtos.length; n++) {
                      this.tableData.push(courseCountDtos[n])
                      count += courseCountDtos[n].total
                    }
                    this.tableData.push({
                      className: '合计周课时',
                      total: count,
                      subjectName: '',
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
          })
      }).catch(e =>{
         console.log(e);
         this.loading = false;
         this.tableData3 = [];
      })
    },
    //页面参数
    getParam() {
      this.$router.push({  //核心语句
        path:'/course/teacher-syllabus',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          teacher: this.formInline.teacher,
        }
      })
    },
    //路径跳转
    linkToCourse(value){
      this.$router.push({  //核心语句
        path:'/course/class-syllabus',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          grade: value.gradeId,
          classes: value.classId,
        }
      })
    },
    changeTeacher() {
      this.getParam();
      this.getTableTeachersList();
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
.course-class-table {
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
.view-teacher-table {
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
 .select-input {
   width: 168px;
   margin: 12px 20px 8px 20px;
 }
</style>
