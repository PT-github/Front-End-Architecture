<template>
  <div class="in-approval-common">
    <!-- 普通角色审批 -->
    <vue-scroll>
      <s-title :titleArr="titleArr" :haveBorder="true"></s-title>
      <!-- 左边审批样式 -->
      <div class="in-body-left fl">
        <h2 class="in-title">查看【编号：TDK181108004】</h2>
        <!--调课日期  -->
        <div class="in-date">
          <span class="key">调课日期:</span>
          <span class="value">{{ approvalDetail.startTime | moment('yyyy-MM-dd') }}</span>
        </div>
        <!--课时信息  -->
        <div class="in-classlist">
          <p class="key">课时信息:</p>
          <el-table :data="classlist" class="table-comp">
            <el-table-column align="center" prop="className" label="调课班级"></el-table-column>
            <el-table-column align="center" label="需调课时">
              <template slot-scope="scope">
                <div class="class-mess">
                  <p>{{scope.row.needClass}}</p>
                  <p>{{scope.row.needClassTeacher}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="被调课时">
              <template slot-scope="scope">
                <div class="class-mess">
                  <p>{{scope.row.sufferClass}}</p>
                  <p>{{scope.row.sufferClassTeacher}}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--申请原因  -->
        <div class="in-applyreason">
          <span class="key">申请原因:</span>
          <span class="value">{{approvalDetail.applyReason}}</span>
        </div>
        <!--审批表单  -->
        <div class="audit-form">
          <el-form :model="auditForm" :rules="auditRules" ref="auditForm" label-width="0px">
            <el-form-item prop="audit">
              <el-radio-group v-model="auditForm.audit" @change="auditChange">
                <el-radio :label="2">通过</el-radio>
                <el-radio :label="3">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="enterRemark">
              <el-input
                type="textarea"
                :rows="4"
                v-model="auditForm.enterRemark"
                placeholder="请输入备注信息"
                resize="none"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="submit-box">
            <el-button type="primary" @click="submitAudit" class="def-button">确认</el-button>
          </div>
        </div>
      </div>
      <!-- 右边课表样式 -->
      <div class="in-body-right fl">
        <h2 class="in-title">调课班级课表（一年级1班）</h2>
        <!--调课日期  -->
        <el-table :data="classTableData">
          <el-table-column label="节数/星期" class="table-width" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.week1.tableIndex + 1 }}节</p>
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.label"
            :label="item.name"
            align="center"
            v-for="(item, index) in tableWeekArr"
            :key="index + 'classTable'"
          >
            <template slot-scope="scope">
              <div
                class="sub"
                :class="{ colorblue: scope.row[item.label].teacherId === needTeacherId, coloryellow: scope.row[item.label].teacherId === selectTeacherId }"
              >
                <!-- 是否被选中 -->
                <div
                  class="selectClass"
                  :class="{selectClassShow: scope.row[item.label].uid === needClassUid  || scope.row[item.label].uid === selectClassUid}"
                ></div>
                <span>{{ scope.row[item.label].subjectName }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="approval-people">
          <div class="people">
            <div class="people-button"></div>
            <div class="people-name">{{needTeacherName}}任课表（需调课人）</div>
          </div>
          <div class="people">
            <div class="people-button"></div>
            <div class="people-name">{{selectTeacherName}}任课表（被调课人）</div>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import {
  getApplyClassDetail,
  applyClassApprove,
  getCoursesByClassId
} from "../../store/api";
import { formatDate, weekArrs } from "../../../../utils/index.js";

export default {
  name: "InApprovalCommon",
  data() {
    return {
      titleArr: [
        // 面包屑数组
        {
          path: "/main-common/approval-info-common",
          name: "调课审批"
        },
        {
          path: "/main-common/in-approval-common",
          name: "审批"
        }
      ],
      currentSchool: {}, // 当前学校信息
      userInfo: {}, // 用户信息
      approvalUid: "", // 调课审批UID
      approvalDetail: {}, // 调课详情信息
      needTeacherName: "", // 需调教师名字
      needTeacherId: "", // 需调教师UID
      selectTeacherName: "", // 被调教师名字
      selectTeacherId: "", // 被调教师UID
      needClassUid: "", // 需调课时UID
      selectClassUid: "", // 被调课时UID
      auditForm: {
        // 审核表单提交
        audit: "",
        enterRemark: ""
      },
      auditRules: {
        audit: [
          { required: true, message: "审核状态不能为空", trigger: "blur" }
        ],
        enterRemark: [
          { max: 100, message: "备注长度在100个字符以下", trigger: "blur" }
        ]
      },
      classlist: [], // 课时信息列表
      selectIndex: 0, // 选中的列表
      selectSufferClasslist: [], // 被调课时列表
      sufferClassWeekArr: [], // 被调课时星期列表
      classTableData: [], // 课表数组
      tableWeekArr: [
        { name: "星期一", label: "week1" },
        { name: "星期二", label: "week2" },
        { name: "星期三", label: "week3" },
        { name: "星期四", label: "week4" },
        { name: "星期五", label: "week5" }
      ] // 课表星期数组
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
    this.$_showLoading({
      // 打开页面加载效果
      text: "加载中..."
    });
    // 获取到调课审批的详情信息
    const queryParam = {
      uid: this.$route.query.approvalUid,
      opType: 1
    };
    getApplyClassDetail(queryParam)
      .then(res => {
        this.approvalDetail = res.data;
        this.classlist = [
          {
            className: this.approvalDetail.className,
            needClass: "",
            needClassTeacher: "",
            sufferClass: "",
            sufferClassTeacher: ""
          }
        ];
        // 还原需调课时信息
        if (this.approvalDetail.initiativeCourse) {
          this.classlist[0].needClass =
            this.computedWeekName(new Date(this.approvalDetail.startTime)) +
            "第" +
            this.approvalDetail.initiativeCourse.classIndex +
            "节课";
          this.classlist[0].needClassTeacher =
            this.approvalDetail.initiativeCourse.uid === this.userInfo.uid
              ? "我"
              : this.approvalDetail.initiativeCourse.teacherName +
                "(" +
                this.approvalDetail.initiativeCourse.subjectName +
                ")";

          // 处理教师名字
          this.needTeacherName = this.approvalDetail.initiativeCourse.teacherName;
          this.needTeacherId = this.approvalDetail.initiativeCourse.teacherId;
          this.needClassUid = this.approvalDetail.initiativeCourse.uid;

          // 初始化右边的课表信息
          const queryParamTwo = {
            termId: this.approvalDetail.termId,
            classId: this.approvalDetail.classId,
            gradeId: this.approvalDetail.initiativeCourse.gradeId,
            startDate: formatDate(
              new Date(this.approvalDetail.startTime),
              "yyyy-MM-dd"
            ),
            weekDay: this.approvalDetail.initiativeCourse.weekDay,
            classIndex: this.approvalDetail.initiativeCourse.classIndex,
            teacherId: this.approvalDetail.initiativeCourse.teacherId
          };
          getCoursesByClassId(queryParamTwo)
            .then(res => {
              this.handleClassTable(res); // 处理班级课表和被调课时的方法
            })
            .catch(() => {
              this.$_hideLoading(); // 关闭页面加载效果
            });
        } else {
          this.$_hideLoading(); // 关闭页面加载效果
        }
        // 还原被调课时信息
        if (this.approvalDetail.passiveCourse) {
          this.classlist[0].sufferClass =
            this.computedWeekName(
              new Date(this.approvalDetail.passiveStartTime)
            ) +
            "第" +
            this.approvalDetail.passiveCourse.classIndex +
            "节课";
          this.classlist[0].sufferClassTeacher =
            this.approvalDetail.passiveCourse.teacherName +
            "(" +
            this.approvalDetail.passiveCourse.subjectName +
            ")";
          this.selectTeacherName = this.approvalDetail.passiveCourse.teacherName;
          this.selectTeacherId = this.approvalDetail.passiveCourse.teacherId;
          this.selectClassUid = this.approvalDetail.passiveCourse.uid;
        }
      })
      .catch(() => {
        this.$_hideLoading(); // 关闭页面加载效果
      });
  },
  methods: {
    // 审批状态change方法
    auditChange(status) {
      if (status === 3) {
        this.auditRules.enterRemark = [
          { required: true, message: "请输入驳回的备注原因", trigger: "blur" },
          { max: 100, message: "备注长度在100个字符以下", trigger: "blur" }
        ];
      } else {
        this.auditRules.enterRemark = [
          { max: 100, message: "备注长度在100个字符以下", trigger: "blur" }
        ];
      }
    },
    handleClassTable(res) {
      // 处理班级课表和被调课时的方法
      let data = res.data;
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
      let maxCourse = data.classIndexAm + data.classIndexPm;
      let classTimetable = data.courses;
      let weekItem = [];
      let courseItem = [];
      for (let c = 0; c < maxCourse; c++) {
        let week = [];
        let course = [];
        for (let i = 0; i < data.weekDay; i++) {
          week.push({ label: "week" + (i + 1), name: Week[i] });
          course.push({ tableIndex: c });
        }
        courseItem.push(course);
        weekItem = [...week];
      }
      this.tableWeekArr = [...weekItem]; // 表格的星期数组
      for (let t = 0; t < classTimetable.length; t++) {
        let weekDay = classTimetable[t].weekDay - 1;
        let classIndex = classTimetable[t].classIndex - 1;
        courseItem[classIndex][weekDay] = {
          ...courseItem[classIndex][weekDay],
          ...classTimetable[t]
        };
      }
      let json = [];
      courseItem.forEach(item => {
        var temp = {};
        item.forEach((value, index) => {
          temp["week" + (index + 1)] = value;
        });
        json.push(temp);
      });
      this.classTableData = [...json];
      this.selectSufferClasslist = this.sufferClassWeekArr.map(item => {
        item["childList"] = data.courses.filter(sonItem => {
          return sonItem.weekDay === item.index;
        });
        return item;
      });
      this.$_hideLoading(); // 关闭页面加载效果
    },
    computedWeekName(date) {
      if (!date) {
        return;
      }
      // 计算选择的日期是本周还是下周
      const selectWeeks = date.getDay() === 0 ? 7 : date.getDay();
      const nowWeeks = new Date().getDay() === 0 ? 7 : new Date().getDay();
      const betweenWeek = Math.abs(selectWeeks - nowWeeks);
      const betweenDays = Math.ceil(
        (date.getTime() - new Date().getTime()) / 86400000
      );
      if (betweenDays === betweenWeek) {
        return "本" + weekArrs[selectWeeks];
      } else {
        return "下" + weekArrs[selectWeeks];
      }
    },
    submitAudit() {
      // 提交审核
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          if (
            !this.approvalDetail.instanceId ||
            !this.approvalDetail.passiveCourseId
          ) {
            this.$message.error("需调课时和被调课时不能为空");
            return;
          }
          this.$_showLoading({
            text: "加载中..."
          });
          const submitData = {
            approveState: this.auditForm.audit,
            instanceId: this.approvalDetail.instanceId,
            passiveCourseId: this.selectClassUid,
            uid: this.approvalDetail.uid,
            approveContent: this.auditForm.enterRemark,
            passiveStartTime: formatDate(
              new Date(this.approvalDetail.passiveStartTime),
              "yyyy-MM-dd"
            )
          };
          applyClassApprove(submitData)
            .then(() => {
              this.$message.success("调课审批成功");
              this.$router.push({ path: "/main-common/my-audit-list" }); // 返回列表页面
              this.$_hideLoading();
            })
            .catch(() => {
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.in-approval-common {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  position: relative;
  .in-title {
    font-weight: bold;
    color: $approval-color16;
    background: $approval-color17;
    line-height: 50px;
    border-bottom: 1px solid $approval-color25;
    text-align: center;
  }
  .key {
    color: $approval-color11;
    padding-right: 12px;
  }
  .value {
    color: $approval-color16;
  }
  .coloryellow {
    color: $approval-color10;
    background: $approval-color13;
  }
  .colorblue {
    color: $approval-color7;
    background: $approval-color12;
  }
  .selectClass {
    border: 1px solid $approval-color32;
    box-sizing: border-box;
  }
  .in-body-left {
    margin: 20px 10px 40px 20px;
    width: calc(54% - 30px);
    border: 1px solid $approval-color25;
    font-size: 14px;
    > div {
      padding: 19px 20px;
      border-bottom: 1px solid $approval-color25;
    }
    .in-classlist {
      .class-mess {
        // 已经选中的课时样式
        position: relative;
        cursor: pointer;
        line-height: 18px;
      }
      .table-comp {
        margin-top: 20px;
      }
      .selectClassForm {
        position: relative;
        color: $approval-color3;
        cursor: pointer;
        > span:nth-of-type(1) {
          color: #ef5555;
          padding-right: 4px;
        }
        > span:nth-of-type(2) {
          text-decoration: underline;
        }
      }
    }
    .audit-form {
      border: none;
      .submit-box {
        padding: 30px 0;
        .el-button {
          display: block;
          width: 70px;
          margin: 0 auto;
        }
      }
    }
  }
  .in-body-right {
    border: 1px solid $approval-color25;
    margin: 20px 20px 40px 10px;
    width: calc(46% - 30px);
    position: relative;
    .in-title {
      background: $approval-color18;
    }
    .table-width {
      width: 16.6%;
    }
    .sub {
      position: relative;
      padding: 14px 0;
      // 课节被选中的样式
      .selectClass {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        border: 1px solid $approval-color32;
        opacity: 0;
      }
      .selectClassShow {
        opacity: 1;
      }
    }
    .approval-people {
      height: 50px;
      .people {
        width: 50%;
        height: 50px;
        float: left;
        > div {
          float: left;
        }
        .people-button {
          margin: 16px 10px 16px 30px;
          width: 18px;
          height: 18px;
          border: 1px solid $approval-color19;
          background: $approval-color12;
        }
        .people-name {
          line-height: 50px;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .people:nth-of-type(2) {
        .people-button {
          border: 1px solid $approval-color20;
          background: $approval-color10;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.in-body-right {
  // 表格样式覆盖
  .el-table .cell {
    padding: 0;
  }
  .el-table__header {
    th {
      padding: 14px 0px;
      background: #fafafa;
    }
  }
  .el-table__body {
    td {
      border-left: 1px solid #eaeaea;
      // padding: 14px 0;
      padding: 0;
      &:last-child {
        border-right: 1px solid #eaeaea;
      }
      &:first-child {
        background: #fafafa;
      }
    }
  }
}
// 选项卡样式
.el-popover {
  padding: 0;
}
.classTab {
  overflow: hidden;
  .tab-left {
    float: left;
    width: 80px;
    li {
      padding: 6px 12px;
      color: $approval-color2;
      line-height: 18px;
      background: $approval-color21;
      text-align: center;
    }
    .selectTab {
      background: white;
    }
  }
  .tab-right {
    float: left;
    width: 178px;
    padding: 20px 0px;
    li {
      padding-bottom: 20px;
      text-indent: 6px;
      width: 170px;
      color: $approval-color11;
      &:hover {
        color: $approval-color3;
      }
    }
    li:nth-last-of-type(1) {
      padding-bottom: 0;
    }
    .canNotSelect {
      // 不能选的课时样式
      cursor: not-allowed;
      &:hover {
        color: $approval-color11;
      }
    }
    .no-class {
      // 教师无课样式
      font-size: 15px;
      color: $approval-color11;
      text-align: center;
    }
  }
}
</style>
