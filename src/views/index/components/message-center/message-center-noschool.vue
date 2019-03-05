<template>
  <div class="message-center-noschool">
    <s-title :title="'系统消息'" :showBack="false"></s-title>

    <div class="message-scroll">
      <vue-scroll>
        <div class="message-center-info">
          <el-form
            :inline="true"
            size="small"
            :model="formInline"
            ref="formInline"
            class="demo-form-inline clearfix"
          >
            <el-form-item>
              <el-button class="icon-button" @click="readAllSchoolInfo">全部已读</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tableData" stripe class="table-comp">
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
                <router-link
                  :to="{ path: '/message-center-noschool/view-messge-noschool', query: { msgUid: scope.row.msgUid, uid: scope.row.uid } }"
                  class="opera"
                  :class="{ isRead: scope.row.isRead }"
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
        </div>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
import { getMsgList, updateAllMsgStatus } from "../../store/api";
export default {
  name: "MessageCenterNoschool",
  data() {
    return {
      userInfo: {}, // 用户信息
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      schoolId: 9, //学校id
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
    this.getMessageList();
  },
  methods: {
    //查询教师列表
    getMessageList() {
      const queryParam = {
        pageSize: 0,
        "where.userId": this.userInfo.uid,
        "where.isNotice": 2
      };
      getMsgList(queryParam).then(res => {
        this.tableData = res.data.list;
      });
    },
    readAllSchoolInfo() {
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
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getMessageList();
    }
  }
};
</script>
<style lang="scss" scoped>
.message-center-noschool {
  height: calc(100% - 100px);
  .message-scroll {
    height: calc(100% - 50px);
    .message-center-info {
      height: 100%;
      padding: 14px 20px;
      .isRead {
        color: $messagecenter-color8;
      }
    }
  }
}
</style>


