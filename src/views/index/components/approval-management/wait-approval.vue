<template>
  <div class="wait-approval">
    <!-- 待我审批的 -->
    <vue-scroll>
      <div class="approval-info">
        <el-form
          :inline="true"
          size="small"
          :model="formInline"
          ref="formInline"
          class="demo-form-inline clearfix"
        >
          <el-form-item label-width="72px" label="申请时间:">
            <el-date-picker
              v-model="formInline.applyDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label-width="92px" label="申请教师:" prop="settingName">
            <el-input
              v-model="formInline.settingName"
              placeholder="请输入名称"
              @keyup.enter.native="getApprovalList"
            ></el-input>
          </el-form-item>
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
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{ path: '/approval-management/in-approval', query: { approvalUid: scope.row.uid } }"
                class="opera"
              >审批</router-link>
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
  name: "WaitApproval",
  data() {
    return {
      currentSchool: {}, // 当前的学校信息
      labelPosition: "right", //表单label对齐方式
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      formInline: {
        // 查询表单
        applyDate: "",
        settingName: ""
      },
      tableData: [],
      tableLoading: false // 表格加载效果
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    this.getApprovalList();
  },
  methods: {
    //查询教师列表
    getApprovalList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.schoolId": this.currentSchool.uid,
        "where.opType": 1
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
      if (this.formInline.settingName) {
        queryParams["where.applyUserName"] = this.formInline.settingName;
      }
      this.tableLoading = true; // 打开加载效果
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
          this.$parent.setCount(res.data.total);
          this.tableLoading = false; // 关闭加载效果
        })
        .catch(() => {
          this.tableLoading = false; // 关闭加载效果
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
.wait-approval {
  height: calc(100% - 100px);
  position: relative;
  .approval-info {
    height: 100%;
    padding: 14px 20px;
    .warning-icon {
      padding-left: 4px;
      i {
        color: $approval-color9;
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
  }
}
</style>
<style lang="scss">
.wait-approval {
  .el-range-editor--small .el-range-separator {
    // 日历组件样式
    z-index: 100;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 240px;
  }
}
</style>

