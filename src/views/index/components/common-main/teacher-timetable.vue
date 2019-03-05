<template>
  <div class="teacher-timetable">
    <s-title :title="'任课表'" :haveBorder="true"></s-title>
    <!-- 教师任课表 -->
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item label="教师姓名">
          <el-select v-model="formInline.teacher" placeholder="请选择教师" @change="changeTeacher">
            <el-option
              v-for="item in teacherOptions"
              :key="'teacherList' + item.uid"
              :label="item.teacherName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getTableTeachersList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showClass" @change="onChangeClass">显示班级</el-checkbox>
          <el-checkbox v-model="showShortClass" @change="onChangeClassShort">显示班级简称</el-checkbox>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="fr course-options-right">
        <el-button
          size="small"
          class="operate-top-btn has-btn-border"
          @click="onExport"
          :loading="isExportLoading"
        >
          <i class="iconfont icon-daochu"></i>
          <span>导出</span>
        </el-button>
        <el-button size="small" :loading="showprint" @click="printsmallTeach">打印</el-button>
      </div>
    </div>

    <div class="course-class-content" ref="table">
      <div class="table-left">
        <el-table :data="tableData3" style="width: 100%;" height="100%" v-loading="tableLoading">
          <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.week1.classIndex }}节</p>
              <p class="name">{{ scope.row.week1.time }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.label"
            :label="item.name"
            min-width="120"
            align="center"
            v-for="(item, index) in configData"
            :key="index + 'table'"
          >
            <template slot-scope="scope">
              <p class="sub" v-if="!showShortSubject">{{ scope.row[item.label].subjectName }}</p>
              <p class="sub" v-if="showShortSubject">{{ scope.row[item.label].subjectShortName }}</p>
              <p class="name" v-if="showClass">{{ scope.row[item.label].className }}</p>
              <p class="name" v-if="showShortClass">{{ scope.row[item.label].classShortName }}</p>
              <a
                class="adjust-blue-icon"
                v-if="scope.row[item.label].adjustCourseDto"
                @click="onViewAdjust(scope.row[item.label])"
              >
                <span>调</span>
              </a>
              <a
                class="replace-orange-icon"
                v-if="!scope.row[item.label].adjustCourseDto && scope.row[item.label].replaceCourseDto"
                @click="onView(scope.row[item.label])"
              >
                <span>代</span>
              </a>
              <a
                class="replace-orange-icon top25"
                v-if="scope.row[item.label].adjustCourseDto && scope.row[item.label].replaceCourseDto"
                @click="onView(scope.row[item.label])"
              >
                <span>代</span>
              </a>
            </template>
          </el-table-column>
          <template slot="empty">
            <div v-if="tableLoading"></div>
            <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
      </div>
      <div class="table-right">
        <el-table
          :data="tableData"
          height="100%"
          :span-method="arraySpanMethod"
          v-loading="tableLoading"
        >
          <el-table-column label="任教班级" align="center">
            <template slot-scope="scope">
              <span v-if="scope.$index === tableData.length-1 ">{{scope.row.className}}</span>
              <a @click="linkToCourse(scope.row)" class="blue" v-else>{{scope.row.className}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="subjectName" label="任教科目" align="center"></el-table-column>
          <el-table-column prop="total" label="周课时数" align="center"></el-table-column>
          <template slot="empty">
            <div v-if="tableLoading"></div>
            <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
      </div>
    </div>

    <replace-dialog ref="replaceDialogComp" :replaceCourseObj="replaceCourseObj"></replace-dialog>
    <adjust-dialog ref="adjustDialogComp" :adjustCourseObj="adjustCourseObj"></adjust-dialog>
    <printTeacherTimetable ref="printTeacherTimetablecom"></printTeacherTimetable>
  </div>
</template>
<script>
import { autoDownloadUrl } from "@/utils";
import printTeacherTimetable from "../print/print-teacher-timetable";
import {
  getTableTeachers,
  exportCourse,
  getTeacherGrade,
  getCurrentTerm,
  deleteDownLoadFile
} from "../../store/api";
export default {
  name: "TeacherTimetable",
  components: {
    printTeacherTimetable
  },
  data() {
    return {
      tableLoading: false, // 表格加载
      schoolId: "", //学校id
      currentSchool: null,
      userTeacherId: "", // 当前用户的教师UID
      formInline: {
        teacher: ""
      },
      configData: [
        {
          label: "week1",
          name: "星期一"
        },
        {
          label: "week2",
          name: "星期二"
        },
        {
          label: "week3",
          name: "星期三"
        },
        {
          label: "week4",
          name: "星期四"
        }
      ],
      tableData3: [],
      tableData: [], //任课数课表
      teacherOptions: [], //教师
      showClass: true,
      showShortClass: false, //是否展示班级简称
      showSubject: true,
      showShortSubject: false,
      replaceCourseObj: {}, //代课详情
      adjustCourseObj: {}, //调课详情
      userInfo: null,
      timer: null,
      isExportLoading: false,
      showprint: false,
      printContent: {},
      maxCourseWeekDay: 4
    };
  },
  mounted() {
    //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.userInfo = this.$store.state.user.userInfo; // 获取当前用户的信息
    let teacherArr;
    if (this.userInfo.teacherInfoList) {
      teacherArr = this.userInfo.teacherInfoList.filter(item => {
        return item.schoolId === this.currentSchool.uid;
      });
      if (teacherArr.length) {
        this.userTeacherId = teacherArr[0].teacherId; // 取到登录用户的teacherId
      }
    }
    this.schoolId = this.currentSchool.uid; // 获取到当前学校的UID
    if (this.$route.query.teacher) {
      // 如果存在页面参数
      this.formInline["teacher"] = this.$route.query.teacher;
    } else {
      this.formInline.teacher = this.userTeacherId; // 还原当前的教师信息
    }
    this.getCourseTeachersList(); // 查询下拉框教师列表
    this.changeTeacher(); // 手动触发教师change方法
  },
  methods: {
    printsmallTeach() {
      this.$refs["printTeacherTimetablecom"].print();
    },
    // 导出课表
    onExport() {
      let subjectNo,
        classNo,
        showType,
        _this = this;
      subjectNo = this.showShortSubject ? 1 : "";
      classNo = this.showShortClass ? 4 : this.showClass ? 3 : "";
      if (!subjectNo && !classNo) {
        showType = "";
      } else if (!subjectNo && classNo) {
        showType = classNo;
      } else if (subjectNo && !classNo) {
        showType = subjectNo;
      } else {
        showType = subjectNo + "," + classNo;
      }
      const data = {
        schoolId: this.schoolId,
        showType: showType,
        viewType: 4,
        uid: this.formInline.teacher
      };
      _this.isExportLoading = true;
      exportCourse(data)
        .then(res => {
          if (res.code === "00000000") {
            _this.isExportLoading = false;
            console.log(res);
            autoDownloadUrl(res.data.fileUrl);
            const filePath = res.data.filePath;
            if (filePath) {
              // 下载成功后删除动态模板
              _this.timer = setTimeout(() => {
                deleteDownLoadFile(filePath).then(res => {
                  console.log("res", res);
                });
              }, 30000);
            }
          }
        })
        .catch(() => {
          _this.isExportLoading = false;
        });
    },
    //获取教师
    //获取教师列表
    getCourseTeachersList() {
      getCurrentTerm({ schoolId: this.schoolId }).then(res => {
        // 获取当前学期的信息
        this.printContent = res.data;
        const queryParams = {
          teacherId: this.userTeacherId,
          termId: res.data.uid
        };
        getTeacherGrade(queryParams)
          .then(res => {
            // 获取教师列表
            this.teacherOptions = res.data;
            if (!this.teacherOptions.length) {
              this.formInline.teacher = "";
            }
            // else {
            //   if (this.$route.query.teacher) {
            //     // 如果存在页面参数
            //     this.formInline.teacher = this.$route.query.teacher;
            //   } else {
            //     this.formInline.teacher = this.userTeacherId; // 还原当前的教师信息
            //   }
            //   this.changeTeacher(); // 手动触发教师change方法
            // }
          })
          .catch(() => {
            this.formInline.teacher = "";
          });
      });
    },
    //显示班级
    onChangeClass(value) {
      if (value) {
        this.showShortClass = false;
      }
    },
    //显示班级简称
    onChangeClassShort(value) {
      if (value) {
        this.showClass = false;
      }
    },
    //教师课表
    getTableTeachersList() {
      let queryParams = {
        schoolId: this.schoolId,
        uid: this.formInline.teacher,
        viewType: 4
      };
      this.tableLoading = true; // 打开表格加载效果
      getTableTeachers(queryParams)
        .then(res => {
          if (res.data) {
            this.tableLoading = false; // 关闭表格加载效果
            let data = res.data;

            if (data.maxCourseWeekDay === null) {
              this.maxCourseWeekDay = 4;
              this.tableData3 = [];
              this.tableData = [];
              return;
            } else {
              this.maxCourseWeekDay = data.maxCourseWeekDay;
            }
            // 固定的礼拜数-常量
            const Week = [
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六",
              "星期天"
            ];
            let maxCourseAm = +data.maxCourseAm || 0;
            let maxCoursePm = +data.maxCoursePm || 0;
            let maxCourse = maxCourseAm + maxCoursePm;
            let teacherTimetable =
              data.teacherTimetableDtos[0].teacherTimetableItemDtoList;
            let baseSchoolGradeTimes = data.baseSchoolGradeTimes;
            let tableData = data.teacherTimetableDtos[0].courseCountDtos;
            let weekItem = [];
            let teacherItem = [];
            for (let c = 0; c < maxCourse; c++) {
              let week = [];
              let teacher = [];
              for (let i = 0; i < this.maxCourseWeekDay; i++) {
                week.push({ label: "week" + (i + 1), name: Week[i] });
                teacher.push({
                  className: "",
                  classShortName: "",
                  subjectName: "",
                  uid: null,
                  classIndex: c + 1,
                  weekDay: i + 1,
                  time: "",
                  subjectShortName: "",
                  adjustCourseDto: null,
                  replaceCourseDto: null
                });
              }
              teacherItem.push(teacher);
              weekItem = [...week];
            }
            this.configData = [...weekItem];
            for (let t = 0; t < teacherTimetable.length; t++) {
              if (teacherTimetable[t].uid) {
                let weekDay = teacherTimetable[t].weekDay - 1;
                let classIndex = teacherTimetable[t].classIndex - 1;
                teacherItem[classIndex][weekDay].subjectName =
                  teacherTimetable[t].subjectName;
                teacherItem[classIndex][weekDay].className =
                  teacherTimetable[t].className;
                teacherItem[classIndex][weekDay].classShortName =
                  teacherTimetable[t].classShortName;
                teacherItem[classIndex][weekDay].subjectShortName =
                  teacherTimetable[t].subjectShortName;
                teacherItem[classIndex][weekDay].replaceCourseDto =
                  teacherTimetable[t].replaceCourseDto;
                teacherItem[classIndex][weekDay].adjustCourseDto =
                  teacherTimetable[t].adjustCourseDto;
                teacherItem[classIndex][weekDay].uid = teacherTimetable[t].uid;
              }
            }
            for (let key of baseSchoolGradeTimes) {
              let classIndex = key.classIndex - 1;
              teacherItem[classIndex][0].time =
                "(" + key.classStarttime + "-" + key.classEndtime + ")";
            }
            let json = [];
            teacherItem.forEach(item => {
              var temp = {};
              item.forEach((value, index) => {
                temp["week" + (index + 1)] = value;
              });
              json.push(temp);
            });
            this.tableData3 = [...json];
            //右边课表数据
            let totalAll = null;
            if (tableData && tableData.length) {
              for (let item of tableData) {
                totalAll += item.total;
              }
              tableData.push({
                className: "合计周课时",
                subjectName: "",
                total: totalAll
              });
            }
            this.tableData = [...tableData];
          } else {
            this.tableData3 = [];
            this.tableLoading = false; // 关闭表格加载效果
          }
        })
        .catch(() => {
          this.tableLoading = false; // 关闭表格加载效果
          this.tableData3 = [];
        });
    },
    //路径跳转
    linkToCourse(value) {
      this.$router.push({
        //核心语句
        path: "/main-common/class-timetable", //跳转的路径
        query: {
          //路由传参时push和query搭配使用，作用时传递参数
          grade: value.gradeId,
          classes: value.classId
        }
      });
    },
    changeTeacher() {
      this.getTableTeachersList();
    },
    //查看代课详情
    onView(item) {
      this.replaceCourseObj = item.replaceCourseDto;
      this.$refs["replaceDialogComp"].toogleVisiable(true);
    },
    //查看调课详情
    onViewAdjust(item) {
      this.adjustCourseObj = item;
      this.$refs["adjustDialogComp"].toogleVisiable(true);
    },
    //合并行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 1000) {
        console.log(row, column, rowIndex, columnIndex);
      }
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-timetable {
  width: 100%;
  height: calc(100% - 50px);
  background: $course-view-color1;
  .course-class-top {
    width: 100%;
    height: 60px;
    padding: 10px 20px 0;
    background-color: #fff;
    .demo-form-inline {
      float: left;
      height: 34px;
      overflow: hidden;
    }
    .course-options-right {
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
        span {
          padding: 0 2px;
        }
      }
      .adjust-blue-icon {
        top: 0;
        background: url("../../../../assets/img/blue-icon.png") no-repeat;
        @include icon-style;
      }
      .replace-orange-icon {
        top: 0;
        background: url("../../../../assets/img/orange-icon.png") no-repeat;
        @include icon-style;
      }
      .top25 {
        top: 25px !important;
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
.teacher-timetable {
  .el-table__header {
    th {
      padding: 24px 0;
      background: #fafafa;
    }
  }
  .el-table__body {
    td {
      height: 68px;
      border-left: 1px solid #eaeaea;
      &:last-child {
        border-right: 1px solid #eaeaea;
      }
      &:first-child {
        background: #fafafa;
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
  .table-left,
  .table-right {
    .el-table::before {
      height: 0;
    }
  }
}
</style>