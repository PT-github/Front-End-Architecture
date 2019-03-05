<template>
  <div class="class-timetable">
    <s-title :title="'班级表'" :haveBorder="true"></s-title>
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item label="年级班级">
          <el-select v-model="formInline.grade" placeholder="年级" @change="getClassData">
            <el-option
              v-for="item in gradeOptions"
              :key="item.uid"
              :label="item.gradeFullName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.class" placeholder="班级" @change="changeClass">
            <el-option
              v-for="item in classOptions"
              :key="item.classId"
              :label="item.classFullName"
              :value="item.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getCourseTableList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="formInline.checkList" @change="onChange">
            <el-checkbox label="0">科目简称</el-checkbox>
            <el-checkbox label="1">显示教师</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="fr course-options-right">
        <el-button
          size="small"
          class="operate-top-btn has-btn-border"
          :loading="isExportLoading"
          @click="onExport"
        >
          <i class="iconfont icon-daochu"></i>
          <span>导出</span>
        </el-button>
        <el-button size="small" @click="printClass" :loading="showprint">打印</el-button>
      </div>
    </div>
    <div class="course-class-content" v-if="canTableShow" ref="table">
      <div class="table-left">
        <el-table :data="tableData3" style="width: 100%;" height="100%" v-loading="tableLoading">
          <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.week1.classIndex }}节</p>
              <p class="name">{{ scope.row.week1.time }}</p>
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
              <p
                class="sub"
                v-if="!showShortSubject"
              >{{ scope.row['week' + (index + 1)].subjectName }}</p>
              <p
                class="sub"
                v-if="showShortSubject"
              >{{ scope.row['week' + (index + 1)].subjectShortName }}</p>
              <p class="name" v-if="showTeacher">{{ scope.row['week' + (index + 1)].teacherName }}</p>
              <a
                class="adjust-blue-icon"
                v-if="scope.row['week' + (index + 1)].adjustCourseDto"
                @click="onViewAdjust(scope.row['week' + (index + 1)])"
              >
                <span>调</span>
              </a>
              <a
                class="replace-orange-icon"
                v-if="!scope.row['week' + (index + 1)].adjustCourseDto && scope.row['week' + (index + 1)].replaceCourseDto"
                @click="onView(scope.row['week' + (index + 1)])"
              >
                <span>代</span>
              </a>
              <a
                class="replace-orange-icon top25"
                v-if="scope.row['week' + (index + 1)].adjustCourseDto && scope.row['week' + (index + 1)].replaceCourseDto"
                @click="onView(scope.row['week' + (index + 1)])"
              >
                <span>代</span>
              </a>
            </template>
          </el-table-column>
          <template slot="empty">
            <div v-if="tableLoading"></div>
            <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无课表数据</p>
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
          <el-table-column label="任教老师" align="center" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.$index === tableData.length-1 ">{{scope.row.teacherName}}</span>
              <a @click="linkToCourse(scope.row)" class="blue" v-else>{{scope.row.teacherName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="subjectName" label="任教科目" align="center"></el-table-column>
          <el-table-column prop="total" label="周课时数" align="center"></el-table-column>
          <template slot="empty">
            <div v-if="tableLoading"></div>
            <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无课表数据</p>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <replace-dialog ref="replaceDialogComp" :replaceCourseObj="replaceCourseObj"></replace-dialog>
    <adjust-dialog ref="adjustDialogComp" :adjustCourseObj="adjustCourseObj"></adjust-dialog>
    <printClassTimetable ref="printClassTimetablecom"></printClassTimetable>
  </div>
</template>
<script>
import { autoDownloadUrl } from "@/utils";
import printClassTimetable from "../print/print-class-timetable";
import {
  getCourseTable,
  getCurrentTerm,
  getTeacherClass,
  exportCourse,
  deleteDownLoadFile
} from "../../store/api";
export default {
  name: "ClassTimetable",
  components: {
    printClassTimetable
  },
  data() {
    return {
      changeIndex: 0,
      tableLoading: false, // 表格加载
      canTableShow: false, // 表格可以出现
      isExportLoading: false,
      timer: null,
      schoolId: null, //学校id
      currentSchool: null,
      userTeacherId: "", // 登录用户的教师UID
      userInfo: {}, // 用户信息
      formInline: {
        grade: "",
        class: "",
        checkList: ["1"]
      },
      configData: [],
      tableData3: [],
      tableData: [], //任课数课表
      gradeOptions: [], //年级
      termId: "", //学期UID
      classOptions: [],
      showTeacher: true,
      showShortSubject: false,
      replaceCourseObj: {}, //代课详情
      adjustCourseObj: {}, //调课详情
      showprint: false,
      printContent: {},
      weekFormatter: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期天"
      ],
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
    // if (this.$route.query.grade) {
    //   this.formInline["grade"] = this.$route.query.grade;
    // }
    // if (this.$route.query.classes) {
    //   this.formInline["class"] = this.$route.query.classes;
    // }
    if (this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getCurrentTermData();
    }
  },
  methods: {
    // 导出课表
    onExport() {
      let subjectNo,
        teacherNo,
        showType,
        _this = this;
      subjectNo = _this.showShortSubject ? 1 : "";
      teacherNo = _this.showTeacher ? 2 : "";
      if (!subjectNo && !teacherNo) {
        showType = "";
      } else if (!subjectNo && teacherNo) {
        showType = teacherNo;
      } else if (subjectNo && !teacherNo) {
        showType = subjectNo;
      } else {
        showType = subjectNo + "," + teacherNo;
      }
      const data = {
        schoolId: _this.schoolId,
        showType: showType,
        viewType: 3,
        uid: _this.formInline.class
      };
      _this.isExportLoading = true;
      exportCourse(data)
        .then(res => {
          if (res.code === "00000000") {
            autoDownloadUrl(res.data.fileUrl);
            const filePath = res.data.filePath;
            _this.isExportLoading = false;
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
    printClass() {
      this.$refs["printClassTimetablecom"].print();
    },
    //获取当前学期
    getCurrentTermData() {
      let queryParams = {
        schoolId: this.schoolId
      };
      getCurrentTerm(queryParams).then(res => {
        if (res.data) {
          this.printContent = res.data;
          this.termId = res.data.uid;
          this.getGrade();
        }
      });
    },
    //获取年级
    getGrade() {
      let queryParams = {
        teacherId: this.userTeacherId,
        termId: this.termId
      };
      this.$_showLoading({
        text: "加载中..."
      });
      getTeacherClass(queryParams)
        .then(res => {
          this.canTableShow = true;
          this.$_hideLoading();
          if (res.data && res.data.length > 0) {
            this.gradeOptions = [...res.data];
            if (this.gradeOptions.length) {
              if (this.$route.query.grade) { // 有页面参数
                this.formInline.grade = this.$route.query.grade;
              } else {
                this.formInline.grade = this.gradeOptions[0].uid;
              }
              this.getClassData(this.formInline.grade); // 手动触发年级change方法
            }
          } else {
            this.gradeOptions = null;
            this.$_hideLoading();
          }
        })
        .catch(() => {
          this.canTableShow = true;
          this.$_hideLoading();
        });
    },
    //change年级
    getClassData(gradeUid) {
      this.formInline.class = "";
      const arr = this.gradeOptions
        .filter(item => {
          return item.uid === gradeUid;
        })
        .map(item => {
          return item.classList;
        });
      if (arr.length) {
        this.classOptions = arr[0];
        if (this.classOptions.length) {
          if (this.$route.query.classes && this.changeIndex === 0) { // 有页面参数且是第一次进入
            this.formInline.class = this.$route.query.classes;
            this.changeIndex++;
          } else {
            this.formInline.class = this.classOptions[0].classId;
          }
          this.changeClass(); // 手动触发班级change方法
        }
      } else {
        this.classOptions = [];
      }
    },
    //change班级
    changeClass() {
      if (this.formInline.grade && this.formInline.class) {
        this.getCourseTableList();
      }
    },
    //路径跳转
    linkToCourse(value) {
      this.$router.push({
        //核心语句
        path: "/main-common/teacher-timetable", //跳转的路径
        query: {
          //路由传参时push和query搭配使用 ，作用时传递参数
          teacher: value.teacherId
        }
      });
    },
    //展示
    onChange(value) {
      this.showShortSubject = value.some(data => data === "0");
      this.showTeacher = value.some(data => data === "1");
    },
    //班级课表
    getCourseTableList() {
      let queryParams = {
        schoolId: this.schoolId,
        uid: this.formInline.class,
        viewType: 3
      };
      this.tableLoading = true; // 打开表格加载效果
      getCourseTable(queryParams)
        .then(res => {
          let data = res.data;
          this.tableLoading = false; // 关闭表格加载效果
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
          let classTimetable =
            data.classTimetableDtos[0].classTimetableItemDtoList;
          let baseSchoolGradeTimes = data.baseSchoolGradeTimes;
          let tableData = data.classTimetableDtos[0].classCourseCountDtos;
          let weekItem = [];
          let courseItem = [];
          for (let c = 0; c < maxCourse; c++) {
            let week = [];
            let course = [];
            for (let i = 0; i < this.maxCourseWeekDay; i++) {
              week.push({ label: "week" + (i + 1), name: Week[i] });
              course.push({
                subjectName: "",
                teacherName: "",
                uid: null,
                classIndex: c + 1,
                weekDay: i + 1,
                time: "",
                adjustCourseDto: null,
                replaceCourseDto: null,
                subjectShortName: ""
              });
            }
            courseItem.push(course);
            weekItem = [...week];
          }
          this.configData = [...weekItem];
          if (classTimetable && classTimetable.length > 0) {
            for (let t = 0; t < classTimetable.length; t++) {
              if (classTimetable[t].uid) {
                let weekDay = classTimetable[t].weekDay - 1;
                let classIndex = classTimetable[t].classIndex - 1;
                courseItem[classIndex][weekDay] = classTimetable[t];
              }
            }
          }
          for (let k = 0; k < baseSchoolGradeTimes.length; k++) {
            let key = baseSchoolGradeTimes[k];
            if (key <= maxCourse) {
              let classIndex = key.classIndex - 1;
              courseItem[classIndex][0].time =
                "(" + key.classStarttime + "-" + key.classEndtime + ")";
            }
          }
          let json = [];
          courseItem.forEach(item => {
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
              teacherName: "合计周课时",
              subjectName: "",
              total: totalAll
            });
          }
          this.tableData = [...tableData];
        })
        .catch(() => {
          this.tableLoading = false; // 关闭表格加载效果
          this.tableData3 = [];
        });
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
.class-timetable {
  width: 100%;
  height: calc(100% - 50px);
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
    .course-options-right {
      // margin-top: -7px;
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
.class-timetable {
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