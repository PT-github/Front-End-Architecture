<template>
  <div class="my-wantsupply-list">
    <vue-scroll>
      <div class="wantsupply-info">
        <!-- <el-form
        :inline="true"
        size="small"
        :model="formInline"
        ref="formInline"
        class="form-inline clearfix"
      >
        <el-form-item label-width="78px" prop="applyDate" label="添加时段:">
          <el-date-picker
            v-model="formInline.applyDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="78px" label="教师姓名:" prop="applyTeacher" class="apply-teacher">
          <el-input v-model="formInline.applyTeacher" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="icon-button" @click="getMyWantsupplyList">查询</el-button>
        </el-form-item>
        </el-form>-->
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
              <span class="warning-icon" v-if="scope.row.invalid && !scope.row.delFlag">
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
            </template>
          </el-table-column>
          <el-table-column align="center" style="color: red;" label="请假教师">
            <template slot-scope="scope">{{ scope.row.teacherName + '(我)' }}</template>
          </el-table-column>
          <el-table-column align="center" label="开始时间">
            <template slot-scope="scope">{{ scope.row.startTime | moment('yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column align="center" label="结束时间">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEndClass">{{scope.row.endTime | moment('yyyy-MM-dd')}}</span>
              <span v-else>学期末</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加时间">
            <template slot-scope="scope">{{ scope.row.addTime | moment('yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column align="center" label="添加人">
            <template slot-scope="scope">{{ scope.row.addUserName }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                class="opera"
                :to="{ path: '/main-common/view-supply-common', query: { supplyUid: scope.row.uid } }"
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
import { getExchangeList } from "../../store/api";
// import { formatDate } from "../../../../utils/index.js";

export default {
  name: "MyWantsupplyList",
  data() {
    return {
      currentSchool: {}, // 当前学校信息
      userInfo: {}, // 用户信息
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      formInline: {
        // 查询表单
        applyDate: "",
        applyTeacher: ""
      },
      tableData: [],
      tableLoading: false // 表格加载效果
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    this.userInfo = this.$store.state.user.userInfo; // 用户信息
    this.getMyWantsupplyList(); // 获取到请假列表
  },
  methods: {
    //查询教师列表
    getMyWantsupplyList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.delFlag": 0,
        "where.schoolId": this.currentSchool.uid,
        "where.type": 1,
        "where.userId": this.userInfo.uid
      };
      this.tableLoading = true; // 表格加载效果打开
      getExchangeList(queryParams)
        .then(res => {
          this.tableData = res.data.list;
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
      this.getMyWantsupplyList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getMyWantsupplyList();
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.my-wantsupply-list {
  height: calc(100% - 100px);
  position: relative;
  .wantsupply-info {
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
      .apply-teacher {
        .el-input {
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
  }
}
</style>
<style lang="scss">
.my-wantsupply-list {
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