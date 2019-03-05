<template>
  <div class="all-approval">
    <vue-scroll>
      <div class="approval-info">
        <el-form
          :inline="true"
          size="small"
          :model="formInline"
          ref="formInline"
          class="form-inline clearfix"
        >
          <el-form-item label-width="78px" label="申请时间:">
            <el-date-picker
              v-model="formInline.applyDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <!--调课班级  -->
          <el-form-item label-width="78px" label="调课班级:" prop="period" class="change-class">
            <el-select
              v-model="formInline.period"
              value-key="value"
              @change="periodChange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in periodArr"
                :key="index + '_stageTyps'"
                :label="item.key"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="grade" class="change-class">
            <el-select
              v-model="formInline.grade"
              value-key="value"
              @change="gradeChange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in gradeArr"
                :key="index + '_gradeArr'"
                :label="item.key"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="class" class="change-class">
            <el-select
              v-model="formInline.class"
              value-key="value"
              @change="classChange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in classArr"
                :key="index + '_classArr'"
                :label="item.key"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 最终审批状态 -->
          <el-form-item
            label-width="100px"
            label="最终审批状态:"
            prop="approvalStatus"
            class="change-class"
          >
            <el-select v-model="formInline.approvalStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approvalStatusArr"
                :key="'approvalStatusArr' + index"
                :label="item.enumField"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 申请教师 -->
          <el-form-item label-width="78px" label="申请教师:" prop="applyTeacher" class="apply-teacher">
            <el-input v-model="formInline.applyTeacher" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button icon="el-icon-search" class="icon-button" @click="getApprovalList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          class="table-comp"
          v-loading="tableLoading"
        >
          <el-table-column align="center" label="编号">
            <template slot-scope="scope">
              <span>{{ scope.row.exchangeNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="applyUserName" style="color: red;" label="申请人"></el-table-column>
          <el-table-column align="center" label="调课日期">
            <template slot-scope="scope">{{ scope.row.startTime | moment('yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column align="center" label="调课班级">
            <template slot-scope="scope">{{scope.row.className }}</template>
          </el-table-column>
          <el-table-column align="center" prop="showInitiativeCourse" label="需调课时"></el-table-column>
          <el-table-column align="center" label="被调课时" prop="showPassiveCourse"></el-table-column>
          <el-table-column align="center" label="申请时间">
            <template slot-scope="scope">{{ scope.row.applyTime | moment('yyyy-MM-dd HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align="center" label="审批状态">
            <template slot-scope="scope">
              <!-- 是否已经失效 -->
              <span class="warning-icon" v-if="scope.row.finalApprovalState === 4">
                <el-tooltip
                  popper-class="sub-warning-style"
                  class="sub-warning-tooltip-up"
                  effect="light"
                  content="异常：该时段内课表有调整过"
                  placement="right"
                >
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <div>
                <span
                  class="yellow"
                  v-if="scope.row.myApprovalState === 2 && scope.row.finalApprovalState === 1"
                >待他人审批</span>
                <span
                  :class="{ yellow: scope.row.finalApprovalState === 1, gray: scope.row.finalApprovalState === 2, red: scope.row.finalApprovalState === 3 || scope.row.finalApprovalState === 4}"
                  v-else
                >{{ dicFormater("BASE_SCHOOL_INFO_APPROVAL_STATE", scope.row.finalApprovalState) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{ path: '/approval-management/view-approval', query: { approvalUid: scope.row.uid } }"
                class="opera"
              >查看</router-link>
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
        <div v-if="total > 10" class="pagination-comp clearfix">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import {
  getApplyClassList,
  getCurrentTerm,
  getStageGradeClass
} from "../../store/api";
import { formatDate, weekArrs } from "../../../../utils/index.js";

export default {
  name: "AllApproval",
  data() {
    return {
      currentSchool: {}, // 当前学校信息
      labelPosition: "right", //表单label对齐方式
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      periodArr: [{ key: "全部学段", value: "" }], // 学段数组
      gradeArr: [{ key: "全部年级", value: "" }], // 年级数组
      classArr: [{ key: "全部班级", value: "" }], // 班级数组
      formInline: {
        // 查询表单
        applyDate: "",
        period: { key: "全部学段", value: "" },
        grade: { key: "全部年级", value: "" },
        class: { key: "全部班级", value: "" },
        approvalStatus: "",
        applyTeacher: ""
      },
      tableData: [],
      tableLoading: false, // 表格加载效果
      approvalStatusArr: []
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    this.approvalStatusArr = this.dicFormater(
      "BASE_SCHOOL_INFO_APPROVAL_STATE"
    ); // 获取到审批状态数组
    this.getApprovalList();
    // 获取当前学期信息
    getCurrentTerm({ schoolId: this.currentSchool.uid }).then(res => {
      if (!res.data) {
        return
      }
      const params = {
        schoolId: this.currentSchool.uid,
        schoolYearId: res.data.schoolYearid
      };
      // 获取学段年级班级三级联动数据
      getStageGradeClass(params).then(res => {
        // 查询学段年级班级
        this.periodArr = res.data.map(item => {
          return {
            key: item.name,
            value: item.stageType,
            child: item.gradeList
          };
        });
        this.periodArr = [{ key: "全部学段", value: "" }].concat(
          this.periodArr
        );
      });
    });
  },
  methods: {
    // 选择学段
    periodChange(period) {
      this.formInline.grade = { key: "全部年级", value: "" };
      this.formInline.class = { key: "全部班级", value: "" };
      if (period.child) {
        this.gradeArr = [{ key: "全部年级", value: "" }].concat(
          period.child.map(item => {
            return {
              key: item.gradeFullName,
              value: item.uid,
              child: item.classList
            };
          })
        );
      }
      this.getApprovalList();
    },
    // 选择年级
    gradeChange(cla) {
      this.formInline.class = { key: "全部班级", value: "" };
      if (cla.child) {
        this.classArr = [{ key: "全部班级", value: "" }].concat(
          cla.child.map(item => {
            return {
              key: item.classFullName,
              value: item.classId
            };
          })
        );
      }
      this.getApprovalList();
    },
    // 选择班级
    classChange() {
      this.getApprovalList();
    },
    //查询代课审批列表
    getApprovalList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.schoolId": this.currentSchool.uid
      };
      if (this.formInline.applyDate) {
        queryParams["where.startTime"] = formatDate(
          this.formInline.applyDate[0],
          "yyyy-MM-dd"
        );
        queryParams["where.endTime"] = formatDate(
          this.formInline.applyDate[1],
          "yyyy-MM-dd"
        );
      }
      if (this.formInline.applyTeacher) {
        queryParams["where.applyUserName"] = this.formInline.applyTeacher;
      }
      if (this.formInline.approvalStatus) {
        queryParams["where.flowState"] = this.formInline.approvalStatus;
      }
      if (this.formInline.period.value !== "") {
        // 学段
        queryParams["where.stageGradeId"] = this.formInline.period.value;
      }
      if (this.formInline.grade.value !== "") {
        // 年级
        queryParams["where.gradeId"] = this.formInline.grade.value;
      }
      if (this.formInline.class.value !== "") {
        // 班级
        queryParams["where.classId"] = this.formInline.class.value;
      }
      this.tableLoading = true; // 打开表格加载效果
      getApplyClassList(queryParams)
        .then(res => {
          this.tableData = res.data.list.map(item => {
            if (item.initiativeCourse) {
              const number =
                item.initiativeCourse.weekDay == 0
                  ? 7
                  : item.initiativeCourse.weekDay;
              item["showInitiativeCourse"] =
                weekArrs[number] +
                "(" +
                formatDate(item.startTime, "MM-dd") +
                ")" +
                item.initiativeCourse.className +
                "第" +
                item.initiativeCourse.classIndex +
                "节课" +
                item.initiativeCourse.teacherName +
                "(" +
                item.initiativeCourse.subjectName +
                ")";
            }
            if (item.passiveCourse) {
              const number =
                item.passiveCourse.weekDay == 0
                  ? 7
                  : item.passiveCourse.weekDay;
              item["showPassiveCourse"] =
                weekArrs[number] +
                "(" +
                formatDate(item.passiveStartTime, "MM-dd") +
                ")" +
                item.passiveCourse.className +
                "第" +
                item.passiveCourse.classIndex +
                "节课" +
                item.passiveCourse.teacherName +
                "(" +
                item.passiveCourse.subjectName +
                ")";
            }
            return item;
          });
          this.total = res.data.total;
          this.tableLoading = false; // 关闭表格加载效果
        })
        .catch(() => {
          this.tableLoading = false; // 关闭表格加载效果
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getApprovalList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getApprovalList();
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.all-approval {
  height: calc(100% - 100px);
  position: relative;
  .approval-info {
    padding: 14px 20px;
    .warning-icon {
      padding-left: 4px;
      i {
        color: $approval-color9;
      }
    }
    .form-inline {
      .change-class {
        .el-select {
          width: 76px;
        }
      }
      .apply-teacher {
        .el-input {
          width: 92px;
        }
      }
      .icon-button {
        margin-left: 10px;
      }
    }
    .operate-top-btn {
      border: 1px solid #e8e8e8;
      background-color: #fff;
    }
    .btn-bg-DB {
      background-color: #f4f4f4;
    }
    // 审批状态字体颜色
    .yellow {
      color: $approval-color10;
    }
    .blue {
      color: $approval-color8;
    }
    .gray {
      color: $approval-color11;
    }
    .red {
      color: $approval-color9;
    }
  }
}
</style>
<style lang="scss">
.all-approval {
  .el-range-editor--small .el-range-separator {
    // 日历组件样式
    z-index: 100;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 240px;
  }
}
.sub-warning-style {
  // 警告样式
  font-size: 14px;
  padding: 18px 25px;
  border: 1px solid $border-color !important;
  color: $approval-color22;
  background: $approval-color23 !important;
  opacity: 0.53;
  .popper__arrow {
    color: $approval-color23;
    opacity: 0.53;
  }
}
</style>