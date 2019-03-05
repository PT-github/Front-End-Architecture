<template>
  <div class="approval-form">
    <vue-scroll>
      <s-title :titleArr="titleArr" :haveBorder="true"></s-title>
      <div class="form-tips">
        <i class="el-icon-warning"></i>
        <span>1、选择意向课程前请务必事先和当事人沟通好；2、主动和被调课不能超过一个星期；3、如果有多个课时需求、请分批申请（一次只能申请一节课）。</span>
      </div>
      <!-- 左边表单样式 -->
      <div class="in-body-left fl">
        <el-form :model="classForm" :rules="classRules" ref="classForm" label-width="0px">
          <el-form-item label-width="85px" label="调课日期:" prop="classdate" class="width340">
            <el-date-picker
              class="width260"
              v-model="classForm.classdate"
              @change="classdateChange"
              type="date"
              :picker-options="upStartDateOpt"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label-width="85px"
            label="需调课时:"
            prop="needChangeClass"
            class="classFormItem width340"
          >
            <el-input
              class="width260"
              :readonly="true"
              v-model="classForm.needChangeClass"
              placeholder="请选择"
              :disabled="!classForm.classdate"
              @focus="popoverShow = !popoverShow"
            ></el-input>
            <!-- 清空需调课时 -->
            <div
              class="del-icon"
              title="删除需调课时"
              @click="delNeedChangeClass()"
              v-if="classForm.needChangeClass"
            >
              <i class="el-icon-close"></i>
            </div>
            <!-- 遮罩 -->
            <div class="classTab-comp" @click="popoverShow = false" v-if="popoverShow"></div>
            <!-- 课时tab选项卡 -->
            <div class="classTab clearfix" v-if="popoverShow">
              <ul class="tab-left">
                <li
                  :class="{ selectTab: index === needChangeSelectIndex }"
                  v-for="(item, index) in selectNeedChangeClasslist"
                  :key="'tab' + index"
                  @click="needChangeSelectIndex = index"
                >
                  <p>{{item.week}}</p>
                  <p>{{item.date}}</p>
                </li>
              </ul>
              <ul class="tab-right">
                <li
                  v-for="(item, index2) in selectNeedChangeClasslist[needChangeSelectIndex].childList"
                  :key="'childList' + index2"
                  @click="selectNeedChangeClass(item)"
                  :class="{ canNotSelect: item.isSelect }"
                >{{ '第' + item.classIndex + '节课' + '(' + (item.className || '未知班级') + '/' + (item.subjectName || '未知科目') + ')' }}</li>
                <div
                  class="no-class"
                  v-if="!selectNeedChangeClasslist[needChangeSelectIndex].haveClass"
                >当日该教师无课</div>
              </ul>
            </div>
          </el-form-item>
          <el-form-item
            label-width="85px"
            label="被调课时:"
            prop="sufferClass"
            class="classFormItem width340"
          >
            <el-input
              class="width260"
              :readonly="true"
              v-model="classForm.sufferClass"
              placeholder="请选择"
              :disabled="!classForm.classdate || !classForm.needChangeClass"
              @focus="popoverShowTwo = !popoverShowTwo"
            ></el-input>
            <!-- 清空被调课时 -->
            <div
              class="del-icon"
              title="删除被调课时"
              @click="delSufferClass()"
              v-if="classForm.sufferClass"
            >
              <i class="el-icon-close"></i>
            </div>
            <!-- 遮罩 -->
            <div class="classTab-comp" @click="popoverShowTwo = false" v-if="popoverShowTwo"></div>
            <!-- 课时tab选项卡 -->
            <div class="classTab clearfix" v-if="popoverShowTwo">
              <ul class="tab-left">
                <li
                  :class="{ selectTab: index === sufferClassIndex }"
                  v-for="(item, index) in selectSufferClasslist"
                  :key="'tab' + index"
                  @click="sufferClassIndex = index"
                >
                  <p>{{item.week}}</p>
                  <p>{{item.date}}</p>
                </li>
              </ul>
              <ul class="tab-right" v-if="selectSufferClasslist">
                <li
                  v-for="(item, index2) in selectSufferClasslist[sufferClassIndex].childList"
                  :key="'childList' + index2"
                  :class="{ canNotSelect: (item.isSelect || item.teacherHaveClass) }"
                  @click="selectSufferClass(item, sufferClassIndex)"
                >{{ '第' + item.classIndex + '节课' + '(' + (item.subjectName || '未知科目') + '/' + (item.teacherName || '未知教师') + ')'}}</li>
                <div
                  class="no-class"
                  v-if="!selectSufferClasslist[sufferClassIndex].childList.length"
                >当日该教师无课</div>
              </ul>
            </div>
          </el-form-item>
          <el-form-item prop="enterRemark" class="width346">
            <el-input
              type="textarea"
              :rows="4"
              v-model="classForm.enterRemark"
              placeholder="请输入需要调课原因，如果没有和其它老师带先沟通，请备注自己被调课时的大致时间。"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSupply" class="def-button">提交申请</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 右边课表样式 -->
      <div class="in-body-right fl">
        <div class="class-table">
          <h2 class="in-title">调课班级课表{{ '(' + currentClass.name + ')'}}</h2>
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
                  v-if="scope.row[item.label].uid && scope.row[item.label].subjectName"
                  :class="{ colorblue: scope.row[item.label].teacherId === userTeacherId, coloryellow: selectSufferClassObj.teacherId === scope.row[item.label].teacherId }"
                >
                  <!-- 是否被选中 -->
                  <div
                    class="selectClass"
                    :class="{selectClassShow: scope.row[item.label].uid === selectSufferClassObj.uid  || scope.row[item.label].uid === selectNeedChangeObj.uid}"
                  ></div>
                  <span>{{ scope.row[item.label].subjectName }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="approval-people">
            <div class="people">
              <div class="people-button"></div>
              <div class="people-name">{{selectNeedChangeObj.teacherName || '某某'}}的任课表（需调课人）</div>
            </div>
            <div class="people">
              <div class="people-button"></div>
              <div class="people-name">{{selectSufferClassObj.teacherName || '某某'}}的任课表（被调课人）</div>
            </div>
          </div>
        </div>
      </div>
    </vue-scroll>
    <!-- 通知提交成功模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'提交成功'"
      width="360px"
      :visible.sync="successDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="success-form">
        <p class="icon">
          <i class="iconfont icon-tijiaochenggongduihao"></i>
        </p>
        <p class="text">提交成功</p>
        <div class="button-wrap">
          <el-button class="def-button" type="defult" @click="continueApply">继续申请</el-button>
          <el-button
            class="def-button"
            type="primary"
            @click=" $router.push( { path: '/main-common/my-apply-list' } ) "
          >返回申请列表</el-button>
          <el-button
            type="primary"
            @click="$router.push( { path: '/main-common/view-approval-common', query: { approvalUid: approvalUid } } )"
          >查看详情</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCoursesByTeacherId, // 获取教师课表
  getCurrentTerm,
  canExchangeClass,
  getCoursesByClassId, // 获取到班级课表
  addApplyClass // 申请调课
} from "../../store/api";
import { formatDate, weekArrs } from "../../../../utils/index.js";
export default {
  name: "ApprovalForm",
  data() {
    return {
      approvalUid: "", // 跳转到查看详情的UID
      userInfo: {}, // 用户信息
      currentTerm: null, // 当前的学期信息
      currentSchool: {}, // 当前学校信息
      userTeacherId: "", // 当前用户的teacherId
      currentClass: {
        // 当前的班级信息
        uid: "",
        name: ""
      },
      isHaveTeacher: false, // 是否有被调课人
      popoverShow: false, // 选项卡是否显示
      popoverShowTwo: false, // 选项卡二是否显示
      successDialog: false, // 申请调课成功模态框是否打开
      classForm: {
        // 审核表单提交
        classdate: "",
        needChangeClass: "", // 需调课时
        sufferClass: "", // 被调课时
        enterRemark: "" // 备注
      },
      classRules: {
        classdate: [
          { required: true, message: "调课日期不能为空", trigger: "blur" }
        ],
        needChangeClass: [
          { required: true, message: "需调课时不能为空", trigger: "change" }
        ],
        enterRemark: [
          { min: 0, max: 100, message: "长度在0-100字符", trigger: "blur" }
        ]
      },
      upStartDateOpt: {
        // 调课时间限定
        disabledDate: time => {
          const hours = new Date().getHours();
          const mins = new Date().getMinutes();
          const seconds = new Date().getSeconds();
          const delTime =
            hours * 3600000 + mins * 60000 + seconds * 1000 + 1000;
          const nowTime = new Date().getTime() - delTime;
          return (
            time.getTime() <= nowTime ||
            time.getTime() > nowTime + (6 * 24 * 60 * 60 * 1000 + delTime)
          );
        }
      },
      titleArr: [
        {
          path: "/main-common/approval-info-common",
          name: "调课管理"
        },
        {
          path: "/main-common/approval-form",
          name: "申请调课"
        }
      ],
      classlist: [
        // 课时信息列表
        {
          class: "一年级二班",
          classTime: "本周二第4节课",
          classTimeTwo: "本周二第4节课"
        },
        {
          class: "一年级二班",
          classTime: "本周二第4节课",
          classTimeTwo: "本周二第4节课"
        }
      ],
      teacherClassTable: [], // 当前申请教师课表
      needChangeSelectIndex: 0,
      sufferClassIndex: 0,
      passiveStartTime: "", // 被调课时的时间
      selectNeedChangeClasslist: [],
      selectNeedChangeObj: {}, // 选中的需调课时
      selectSufferClasslist: null,
      selectSufferClassObj: {
        // 选中的被调课时
        teacherId: ""
      },
      classTableData: [], // 课表数组
      sufferClassWeekArr: [], // 被调课时星期数组
      nextWeekOr: "", // 是本周还是下周
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
    this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
    this.currentSchool = this.$store.state.user.currentSchool;
    let teacherArr;
    if (this.userInfo.teacherInfoList) {
      teacherArr = this.userInfo.teacherInfoList.filter(item => {
        return item.schoolId === this.currentSchool.uid;
      });
      if (teacherArr.length) {
        this.userTeacherId = teacherArr[0].teacherId; // 取到登录用户的teacherId
      }
    }
    // 获取当前学期信息
    getCurrentTerm({ schoolId: this.currentSchool.uid }).then(res => {
      this.currentTerm = res.data;
    });
  },
  methods: {
    // 继续申请
    continueApply() {
      this.successDialog = false; // 关闭模态框
      this.classForm.classdate = ""; // 清空调课日期
      this.classForm.needChangeClass = ""; // 清空需调课时展示
      this.classForm.sufferClass = ""; // 清空被调课时展示
      this.classForm.enterRemark = ""; // 清空被调课时展示

      this.selectSufferClasslist = null; // 清空被调课时数组
      this.classTableData = []; // 清空右边的课表数据
      this.selectNeedChangeObj = {};
      this.selectSufferClassObj = {
        // 清空选中的课时对象信息
        teacherId: ""
      };
    },
    // 调课日期change事件
    classdateChange(date) {
      this.classForm.needChangeClass = ""; // 清空需调课时展示
      this.classForm.sufferClass = ""; // 清空被调课时展示
      this.selectSufferClasslist = null; // 清空被调课时数组
      this.classTableData = []; // 清空右边的课表数据
      this.selectNeedChangeObj = {};
      // 清空选中的课时对象信息
      this.selectSufferClassObj = {
        teacherId: ""
      };
      // 如果日期为空方法终止
      if (!date) {
        return;
      }
      if (this.currentTerm) {
        // 如果有当前的学期信息
        if (
          date.getTime() > this.currentTerm.termEndtime ||
          date.getTime() < this.currentTerm.termStarttime
        ) {
          this.classForm.classdate = ""; // 清空调课日期
          this.$message.warning("您选择的日期不在当前学年学期");
          return;
        }
      } else {
        this.$message.warning("暂时没有学年学期信息");
        return;
      }
      this.computedWeekName(date); // 计算周的数组
      const weeks = date.getDay() === 0 ? 7 : date.getDay();
      const queryParam = {
        termId: this.currentTerm.uid,
        teacherId: this.userTeacherId,
        startDate: formatDate(date, "yyyy-MM-dd")
      };
      this.$_showLoading({
        text: "加载中..."
      });
      let needChangeArr = [
        {
          date: "(" + formatDate(date, "MM-dd") + ")",
          week: this.nextWeekOr + weekArrs[weeks],
          childList: []
        }
      ];
      this.selectNeedChangeClasslist = needChangeArr;
      getCoursesByTeacherId(queryParam)
        .then(res => {
          // 拼装出数据
          this.teacherClassTable = res.data; // 接收到当前教师的课表
          const childList = res.data
            .filter(item => {
              return item.weekDay === weeks && item.subjectName !== "";
            })
            .sort((a, b) => {
              // 根据课节顺序排序
              return a.classIndex - b.classIndex;
            });
          if (childList.length) {
            this.selectNeedChangeClasslist[0]["childList"] = childList;
            this.selectNeedChangeClasslist[0]["haveClass"] = true;
          } else {
            this.selectNeedChangeClasslist[0]["childList"] = [];
            this.selectNeedChangeClasslist[0]["haveClass"] = false;
          }
          this.$_hideLoading();
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    // 删除需调课时
    delNeedChangeClass() {
      this.classForm.needChangeClass = ""; // 清空需调课时展示
      this.classForm.sufferClass = ""; // 清空被调课时展示
      this.selectSufferClasslist = null; // 清空被调课时数组
      this.classTableData = []; // 清空右边的课表数据
      this.selectNeedChangeObj = {};
      this.selectSufferClassObj = {
        // 清空选中的课时对象信息
        teacherId: ""
      };
    },
    // 选择需调课时
    selectNeedChangeClass(item) {
      if (item.isSelect) {
        this.$message.warning("您选的课节在请假阶段中");
        return;
      }
      // 打开生成被调课时加载效果
      this.$_showLoading({
        text: "加载中..."
      });
      this.selectNeedChangeObj = item; // 记录选中的需调课时信息
      // 清除被调课时的选中信息
      this.selectSufferClassObj = {
        teacherId: ""
      };
      this.classForm.sufferClass = "";
      // 记录当前的班级信息(展示在右边的课表表头)
      this.currentClass = {
        uid: item.classId,
        name: item.className
      };
      // 查询选择的课时是否在请假的时段中
      const queryParam = {
        startTime: formatDate(this.classForm.classdate, "yyyy-MM-dd"),
        endTime: formatDate(this.classForm.classdate, "yyyy-MM-dd"),
        startClassIndex: item.classIndex,
        endClassIndex: item.classIndex,
        teacherId: this.userTeacherId
      };
      canExchangeClass(queryParam)
        .then(res => {
          if (res.data) {
            this.classForm.needChangeClass =
              this.nextWeekOr +
              weekArrs[item.weekDay] +
              "第" +
              item.classIndex +
              "节课" +
              "(" +
              item.className +
              item.subjectName +
              ")";
          } else {
            this.$message.warning("您选的课节在请假阶段中");
            this.$_hideLoading(); // 关闭生成被调课时加载效果
            return;
          }
          // 同时将此人的班级课表和此人的课表查询出来
          const queryParamTwo = {
            termId: this.currentTerm.uid,
            classId: item.classId,
            gradeId: item.gradeId,
            startDate: formatDate(this.classForm.classdate, "yyyy-MM-dd"),
            weekDay: item.weekDay,
            classIndex: item.classIndex,
            teacherId: this.userTeacherId
          };
          getCoursesByClassId(queryParamTwo)
            .then(res => {
              this.handleClassTable(res); // 处理班级课表和被调课时的方法
            })
            .catch(() => {
              this.$_hideLoading(); // 关闭生成被调课时加载效果
            });
        })
        .catch(() => {
          this.$_hideLoading(); // 关闭生成被调课时加载效果
        });

      this.popoverShow = false; // 关闭选项卡
    },
    // 删除被调课时
    delSufferClass() {
      this.classForm.sufferClass = ""; // 清空被调课时展示
      this.selectSufferClassObj = {
        // 清空选中的课时对象信息
        teacherId: ""
      };
    },
    selectSufferClass(item, index) {
      // 选择被调课时的回调方法
      if (item.teacherHaveClass) {
        this.$message.warning("被调课时存在调课信息或者课时冲突");
        return;
      }
      if (item.isSelect) {
        this.$message.warning("被调课时存在调课信息或者课时冲突");
        return;
      }
      this.selectSufferClassObj = item; // 记录被调课时
      this.passiveStartTime = this.selectSufferClasslist[index].submitDate; // 记录被调课时的日期时间
      this.classForm.sufferClass =
        this.selectSufferClasslist[index].week +
        "第" +
        item.classIndex +
        "节课" +
        "(" +
        item.subjectName +
        "/" +
        item.teacherName +
        ")";
      this.popoverShowTwo = false; // 关闭选项卡
    },
    // 处理班级课表和被调课时的方法
    handleClassTable(res) {
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
      let classArr = data.courses.map(item => {
        return item;
      });
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

      // 申请教师本人的课节不能调【置灰显示】
      for (let j = 0; j < classArr.length; j++) {
        let coursesItem = classArr[j];
        coursesItem["teacherHaveClass"] = false;
        for (let i = 0; i < this.teacherClassTable.length; i++) {
          let teacherClassItem = this.teacherClassTable[i];
          if (
            teacherClassItem["weekDay"] === coursesItem["weekDay"] &&
            teacherClassItem["classIndex"] === coursesItem["classIndex"]
          ) {
            coursesItem["teacherHaveClass"] = true;
            break;
          }
        }
      }
      this.selectSufferClasslist = this.sufferClassWeekArr.map(item => {
        item["childList"] = classArr
          .filter(sonItem => {
            return sonItem.weekDay === item.index;
          })
          .sort((a, b) => {
            // 根据课节顺序排序
            return a.classIndex - b.classIndex;
          });
        return item;
      });
      this.$_hideLoading(); // 关闭生成被调课时加载效果
    },
    submitSupply() {
      this.$refs["classForm"].validate(valid => {
        if (valid) {
          this.$_showLoading({
            text: "申请中..."
          });
          const submitData = {
            classId: this.selectNeedChangeObj.classId,
            flowType: 1,
            initiativeCourseId: this.selectNeedChangeObj.uid,
            passiveCourseId: this.selectSufferClassObj.uid,
            schoolId: this.currentSchool.uid,
            startTime: formatDate(this.classForm.classdate, "yyyy-MM-dd"),
            termId: this.currentTerm.uid,
            applyReason: this.classForm.enterRemark,
            passiveStartTime: this.passiveStartTime // 被调课时日期
          };
          addApplyClass(submitData)
            .then(res => {
              this.approvalUid = res.data;
              this.successDialog = true; // 打开成功模态框
              this.$_hideLoading();
            })
            .catch(() => {
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetClassForm() {
      // 清空表单
      if (this.$refs.classForm) {
        this.$refs.classForm.resetFields();
      }
    },
    computedWeekName(date) {
      // 计算选择的日期是本周还是下周
      const selectWeeks = date.getDay() === 0 ? 7 : date.getDay();
      const nowWeeks = new Date().getDay() === 0 ? 7 : new Date().getDay();
      const betweenWeek = Math.abs(selectWeeks - nowWeeks);
      const betweenDays = Math.ceil(
        (date.getTime() - new Date().getTime()) / 86400000
      );
      if (betweenDays === betweenWeek) {
        this.nextWeekOr = "本";
      } else {
        this.nextWeekOr = "下";
      }
      // 生成一个被调课时的星期数组
      const nowWeeksCounts = 8 - nowWeeks; // 本周天数
      const nextWeeksCounts = 7 - nowWeeksCounts; // 下周天数
      this.sufferClassWeekArr = []; // 清空此数组
      for (let i = 0; i < nowWeeksCounts; i++) {
        // 本周
        const num = new Date().getTime() + 86400000 * i;
        this.sufferClassWeekArr = [
          ...this.sufferClassWeekArr,
          {
            date: "(" + formatDate(new Date(num), "MM-dd") + ")",
            submitDate: formatDate(new Date(num), "yyyy-MM-dd"),
            week: "本" + weekArrs[i + nowWeeks],
            index: i + nowWeeks
          }
        ];
      }
      if (nextWeeksCounts > 0) {
        for (let j = 0; j < nextWeeksCounts; j++) {
          const num = new Date().getTime() + 86400000 * (j + nowWeeksCounts);
          this.sufferClassWeekArr = [
            ...this.sufferClassWeekArr,
            {
              date: "(" + formatDate(new Date(num), "MM-dd") + ")",
              submitDate: formatDate(new Date(num), "yyyy-MM-dd"),
              week: "下" + weekArrs[j + 1],
              index: j + 1
            }
          ];
        }
      }
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.approval-form {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  position: relative;
  .form-tips {
    padding: 18px 20px;
    color: $approval-color27;
    background: $approval-color26;
    i {
      // color: $approval-color26;
      padding-right: 10px;
    }
  }
  .in-title {
    font-weight: bold;
    color: $approval-color16;
    background: $approval-color17;
    line-height: 50px;
    border-bottom: 1px solid $approval-color25;
    text-align: center;
  }
  .classTab-comp {
    // 选项卡遮罩
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: 0;
    z-index: 99;
  }
  .classTab {
    // 选项卡样式
    position: absolute;
    width: 260px;
    min-height: 80px;
    background: white;
    border-radius: 4px;
    border: 1px solid $approval-color28;
    z-index: 100;
    top: 50px;
    left: 0px;
    line-height: 1;
    .tab-left {
      float: left;
      width: 80px;
      > li {
        cursor: pointer;
        padding: 6px 12px;
        color: $approval-color2;
        line-height: 18px;
        background: $approval-color21;
        text-align: center;
      }
      .selectTab {
        background: white;
        color: $approval-color3;
      }
    }
    .tab-right {
      float: left;
      width: 178px;
      padding: 26px 0;
      li {
        cursor: pointer;
        padding-bottom: 20px;
        text-align: left;
        text-indent: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 178px;
        &:hover {
          color: $approval-color3;
        }
      }
      .no-class {
        // 教师无课样式
        font-size: 15px;
        color: $approval-color11;
        text-align: center;
      }
      .canNotSelect {
        color: $approval-color33;
        // 不能选择课节的样式
        cursor: not-allowed;
        &:hover {
          color: $approval-color11;
        }
      }
      li:nth-last-of-type(1) {
        padding-bottom: 0;
      }
    }
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
    // 页面左边样式
    padding: 20px 0px 50px 20px;
    width: 40%;
    font-size: 14px;
    position: relative;
    .width340 {
      position: relative;
      width: 340px;
    }
    .width346 {
      position: relative;
      width: 346px;
    }
    .width260 {
      width: 260px;
    }
    &::before {
      content: "";
      position: absolute;
      right: 0;
      top: 20px;
      height: 392px;
      background: $approval-color25;
      width: 1px;
    }
  }
  .in-body-right {
    // 页面右边样式
    padding: 20px 0px 50px 20px;
    width: 60%;
    position: relative;
    .in-title {
      background: $approval-color18;
    }
    .class-table {
      width: 488px;
      margin: 0 auto;
      border: 1px solid $approval-color25;
      border-top: none;
    }
    .sub {
      position: relative;
      padding: 14px 0;
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
  .success-form {
    // 页面模态框样式
    text-align: center;
    .icon {
      color: $approval-color7;
      i {
        font-size: 50px;
      }
    }
    .text {
      padding-top: 20px;
      font-size: 16px;
      color: $approval-color1;
    }
    .button-wrap {
      padding: 36px 0 16px 0;
      width: 258px;
      margin: 0 auto;
      .el-button:nth-of-type(1) {
        width: 258px;
      }
      .el-button:nth-of-type(2),
      .el-button:nth-of-type(3) {
        width: 119px;
        padding: 8px 0;
        border: none;
      }
      .el-button:nth-of-type(2) {
        margin: 14px 20px 0px 0px;
      }
      .el-button:nth-of-type(3) {
        margin: 14px 0px 0px 0px;
        background: $approval-color27;
      }
    }
  }
}
</style>
<style lang="scss">
.in-body-left {
  // 选择课时的样式
  .classFormItem {
    position: relative;
    cursor: pointer;
    .del-icon {
      // 删除课节的样式
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: $approval-color5;
      position: absolute;
      top: 14px;
      right: 6px;
      font-size: 12px;
      text-align: center;
      line-height: 14px;
      opacity: 0;
      z-index: 20;
      i {
        color: $approval-color6;
      }
    }
    &:hover .del-icon {
      opacity: 1;
    }
  }
}

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
</style>
