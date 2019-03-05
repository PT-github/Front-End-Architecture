<template>
  <div class="my-apply-list">
    <vue-scroll>
      <div class="apply-info">
        <el-form
          :inline="true"
          size="small"
          :model="formInline"
          ref="formInline"
          class="form-inline clearfix"
        >
          <el-form-item label-width="78px" prop="applyDate" label="申请时间:">
            <el-date-picker
              v-model="formInline.applyDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <!-- 最终审批状态 -->
          <el-form-item label-width="78px" label="审批状态:" prop="approvalStatus" class="change-class">
            <el-select v-model="formInline.approvalStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in approvalStatusArr"
                :key="'approvalStatusArr' + index"
                :label="item.enumField"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button icon="el-icon-search" class="icon-button" @click="getApprovalList">查询</el-button>
          </el-form-item>
          <div class="el-form-right fr">
            <el-form-item>
              <el-button @click="applyClass" type="primary" class="def-button">申请调课</el-button>
            </el-form-item>
          </div>
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
              <span>{{ scope.row.exchangeNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="applyUserName" label="申请人"></el-table-column>
          <el-table-column align="center" label="调课日期">
            <template slot-scope="scope">{{ scope.row.startTime | moment('yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column align="center" label="调课班级">
            <template slot-scope="scope">{{ scope.row.className }}</template>
          </el-table-column>
          <el-table-column align="center" label="需调课时" prop="showInitiativeCourse"></el-table-column>
          <el-table-column align="center" label="被调课时" prop="showPassiveCourse"></el-table-column>
          <el-table-column align="center" label="申请时间">
            <template slot-scope="scope">{{ scope.row.applyTime | moment('yyyy-MM-dd HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align="center" label="最后审批时间">
            <template
              slot-scope="scope"
            >{{ scope.row.lastApprovalTime | moment('yyyy-MM-dd HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align="center" label="审批状态">
            <template slot-scope="scope">
              <!-- 是否失效 -->
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
                  :class="{ yellow: scope.row.finalApprovalState === 1, gray: scope.row.finalApprovalState === 2, red: scope.row.finalApprovalState === 3 || scope.row.finalApprovalState === 4 }"
                  v-else
                >{{ dicFormater("BASE_SCHOOL_INFO_APPROVAL_STATE", scope.row.finalApprovalState) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{ path: '/main-common/view-approval-common', query: { approvalUid: scope.row.uid } }"
                :class="{ blue: scope.row.finalApprovalState === 1, gray: scope.row.finalApprovalState !== 1 }"
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
import { getApplyClassList } from "../../store/api";
import { formatDate, weekArrs } from "../../../../utils/index.js";
export default {
  name: "MyApplyList",
  data() {
    return {
      currentSchool: {}, // 当前学校信息
      labelPosition: "right", //表单label对齐方式
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      approvalStatusArr: [], // 审批状态字典数组
      formInline: {
        // 查询表单
        applyDate: "",
        approvalStatus: ""
      },
      tableData: [],
      tableLoading: false // 表格加载效果
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    this.approvalStatusArr = this.dicFormater(
      "BASE_SCHOOL_INFO_APPROVAL_STATE"
    ); // 获取到审批状态的数组
    this.getApprovalList(); // 获取调课审批列表
    let queryParams = {
      pageNum: 1,
      pageSize: 0,
      "where.schoolId": this.currentSchool.uid,
      "where.opType": 4
    };
    getApplyClassList(queryParams).then(res => {
      // 查询代办事项数量
      this.$parent.setCount(
        res.data.list.filter(item => {
          return item.finalApprovalState === 1 && item.myApprovalState !== 2;
        }).length,
        1
      );
    });
  },
  methods: {
    applyClass() {
      this.$router.push({ path: "/main-common/approval-form" }); // 申请调课
    },
    getApprovalList() {
      // 获取到调课列表
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.schoolId": this.currentSchool.uid,
        "where.opType": 3
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
      if (this.formInline.approvalStatus) {
        queryParams["where.flowState"] = this.formInline.approvalStatus;
      }
      this.tableLoading = true; // 表格加载效果打开
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
          this.tableLoading = false; // 表格加载效果关闭
        })
        .catch(() => {
          this.tableLoading = false; // 表格加载效果关闭
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
.my-apply-list {
  height: calc(100% - 100px);
  position: relative;
  .apply-info {
    height: 100%;
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
          width: 120px;
        }
      }
      .icon-button {
        margin-left: 10px;
      }
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
.my-apply-list {
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