<template>
  <div class="system-message">
    <!-- 入校审批  1
        离校通知  2
        学校开通  3
    后台通知  4-->
    <!-- 系统消息 -->
    <vue-scroll>
      <div class="message-center-info">
        <el-form
          :inline="true"
          size="small"
          :model="formInline"
          ref="formInline"
          v-loading="tableLoading"
          class="demo-form-inline clearfix"
        >
          <el-form-item class="button-info">
            <el-button class="icon-button" @click="readAllSystemInfo">全部已读</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          class="table-comp"
        >
          <el-table-column align="center" label="标题">
            <template slot-scope="scope">
              <span>{{scope.row.msgTitle}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="接收时间">
            <template slot-scope="scope">
              <span>{{scope.row.addTime | moment('yyyy-MM-dd HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span
                class="opera"
                @click="viewMessageDetail(scope.row)"
                :class="{ isRead: scope.row.isRead }"
              >查看</span>
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
  getMsgList,
  updateAllMsgStatus,
  updateMsgStatus
} from "../../store/api";
export default {
  name: "SystemMessage",
  data() {
    return {
      msgDetailPath: "/message-center/view-message", // 消息详情地址
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      tableLoading: false, // 表格加载
      userInfo: {}, // 当前用户信息
      currentRole: {}, // 当前用户权限
      msgTypeFromDic: [], // 系统消息的子类字典
      formInline: {
        // 查询表单
        applyDate: "",
        settingName: ""
      },
      tableData: []
    };
  },
  mounted() {
    this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
    this.currentRole = this.$store.state.user.currentRole; // 获取当前用户权限
    this.msgTypeFromDic = this.dicFormater(
      "SYS_MSG_NOTICE_INFO_MSG_TYPE_SYSTEM"
    ); // 获取到系统信息的子类字典
    this.getMsgList();
  },
  methods: {
    viewMessageDetail(item) {
      if (item.msgParam) {
        if (item.msgParam.indexOf("{") === -1) {
          this.$message.warning("参数格式错误");
          return;
        }
      }
      // 更新消息已读状态
      updateMsgStatus(item.uid).then(() => {
        this.$store.dispatch("updateUserMsgCountStatus"); // 通知store更新已读信息数量
        this.getMsgList(); // 刷新消息列表
      });
      // 查看消息详情
      const msgType = item.msgType;
      switch (msgType) {
        case 1:
          if (
            this.currentRole.roleType === "ADMIN" ||
            this.currentRole.roleType === "CJADMIN"
          ) {
            this.$router.push({ path: "/platform/user-audit" }); // 跳转到入校审核页面
          } else {
            this.$message.warning('您没有权限');
          }
          break;
        default:
          // 其他类型的消息都跳转到消息详情页面
          this.$router.push({
            path: "/message-center/view-message",
            query: { msgUid: item.msgUid, uid: item.uid }
          });
          break;
      }
    },
    //查询教师列表
    getMsgList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.userId": this.userInfo.uid,
        "where.isNotice": 2
      };
      this.tableLoading = true; // 打开加载效果
      getMsgList(queryParams)
        .then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.tableLoading = false; // 关闭加载效果
        })
        .catch(() => {
          this.tableLoading = false; // 关闭加载效果
        });
    },
    readAllSystemInfo() {
      // 标记全部已读
      this.$_showLoading({
        text: "加载中..."
      });
      const updateParams = {
        userId: this.userInfo.uid,
        isNotice: 2
      };
      updateAllMsgStatus(updateParams)
        .then(() => {
          this.$message.success("您的系统消息已经全部已读");
          this.$store.dispatch("updateUserMsgCountStatus"); // 通知store更新已读信息数量
          this.$_hideLoading();
          this.getMsgList(); // 刷新已读列表
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getMsgList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getMsgList();
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.system-message {
  height: calc(100% - 100px);
  position: relative;
  .message-center-info {
    height: 100%;
    padding: 14px 20px;
    .isRead {
      color: $messagecenter-color8;
    }
    .button-info {
      .el-button {
        color: $messagecenter-color7;
        border: 1px solid $messagecenter-color7;
      }
    }
  }
}
</style>


