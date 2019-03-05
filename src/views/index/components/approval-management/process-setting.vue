<template>
  <div class="process-setting">
    <!-- 1、默认为超级管理员（超级管理员有角色和职位两个身份）
     2、可选审批环节上限10个
    3、一个审批环节中，一个职位只能出现一次（选择的时候就做限制），在调课流程中，有个特殊的可选项（非岗位）－被调课人-->
    <s-title :title="'审批流程设置'"></s-title>
    <div class="process-scroll">
      <vue-scroll>
        <div class="process-info">
          <el-form
            :inline="true"
            size="small"
            :model="formInline"
            class="demo-form-inline clearfix"
          >
            <el-form-item label-width="100px" label=" 审批业务名称:">
              <el-input
                v-model="formInline.settingName"
                placeholder="请输入名称"
                @keyup.enter.native="getProcessSettingList"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" class="icon-button" @click="getProcessSettingList">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            class="table-comp"
            v-loading="tableLoading"
          >
            <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" prop="flowName" label="审批业务名称"></el-table-column>
            <el-table-column align="center" prop="flowDesc" label="说明"></el-table-column>
            <el-table-column align="center" label="上次修改时间">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | moment('yyyy-MM-dd HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
              <template slot-scope="scope">
                <span class="opera" @click="viewProcessSetting(scope.row)">查看流程</span>
                <span class="opera" @click="settingProcess(scope.row)">设置流程</span>
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
    <!-- 审批流程设置模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'审批流程设置'"
      width="460px"
      :visible.sync="processSettingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="settingDialog">
        <h3 class="title">审批人:</h3>
        <ul class="role-list clearfix">
          <li v-for="(item, index) in selectRoleListTwo" :key="index + 'selectedRoleList'">
            <img src="../../../../assets/img/processlogo.png" alt>
            <p>{{item.nodeName}}</p>
            <div class="icon-show" :class="{ isShow: index > 1 }" @click="delRole(index)">
              <i class="el-icon-close"></i>
            </div>
          </li>
          <li>
            <div class="add-icon" @click="addRoles">+&nbsp;添加</div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveProcessSetting">保存</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'添加'"
      width="460px"
      :visible.sync="addRoleDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="settingDialogAdd">
        <h3 class="title">选择角色:</h3>
        <ul class="role-list clearfix">
          <li
            v-for="(item, index) in selectRoleList"
            @click="selectRole(index)"
            :key="index + 'roleList'"
          >
            <img src="../../../../assets/img/processlogo.png" alt>
            <p>{{item.nodeName}}</p>
            <div class="icon-show" :class="{ isShow: item.iconShow }">
              <i class="el-icon-check"></i>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAddRoles">确定</el-button>
        <el-button type="primary" @click="addRoleDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看流程模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'查看流程'"
      width="460px"
      :visible.sync="viewRoleDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="settingDialog">
        <h3 class="title">审批人:</h3>
        <ul class="role-list clearfix">
          <li v-for="(item, index) in viewProcessSettingArr" :key="index + 'selectedRoleList'">
            <img src="../../../../assets/img/processlogo.png" alt>
            <p>{{item.nodeName}}</p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewRoleDialog = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSchoolFlowList,
  getSchoolFlow,
  getPositions,
  updateSchoolFlow,
  flowEditable
} from "../../store/api";
import { arrayWeightRemoval } from "../../../../utils/index.js";

export default {
  name: "ProcessSetting",
  data() {
    return {
      // tableHeight: "calc(100% - 149px)", // 表格高度
      labelPosition: "right", //表单label对齐方式
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      currentSchool: {},
      currentProcessSetting: {}, // 当前修改的那个流程
      formInline: {
        settingName: ""
      }, // 查询表单
      tableData: [],
      tableLoading: false, // 表格加载效果
      processSettingDialog: false, // 审批流程设置模态框是否打开
      addRoleDialog: false, // 添加角色模态框是否打开
      viewRoleDialog: false, // 查看流程模态框是否打开
      selectRoleList: [], // 添加角色数组
      temporaryList: [], // 角色暂存数组
      viewProcessSettingArr: [],
      selectRoleListTwo: []
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool;
    getPositions().then(res => {
      // 过滤教师和班主任
      this.selectRoleList = res.data
        .filter(item => {
          return item.positionType !== "BZR" && item.positionType !== "JS";
        })
        .map(item => {
          return {
            iconShow: false,
            nodeName: item.positionName,
            executorPositionType: item.positionType
          };
        });
    });
    this.getProcessSettingList();
  },
  methods: {
    //查询审批流程列表
    getProcessSettingList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.schoolId": this.currentSchool.uid
      };
      if (this.formInline.settingName) {
        queryParams["where.flowName"] = this.formInline.settingName;
      }
      this.tableLoading = true; // 打开表格加载效果
      getSchoolFlowList(queryParams)
        .then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.tableLoading = false; // 关闭表格加载效果
        })
        .catch(() => {
          this.tableLoading = false; // 关闭表格加载效果
        });
    },
    viewProcessSetting(item) {
      // 查看流程模态框
      this.$_showLoading({
        text: "加载中..."
      });
      this.viewRoleDialog = true;
      getSchoolFlow(item.uid)
        .then(res => {
          this.viewProcessSettingArr = res.data.nodeList;
          this.$_hideLoading();
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    selectRole(index) {
      // 选择角色
      this.selectRoleList[index].iconShow = !this.selectRoleList[index]
        .iconShow;
      if (this.selectRoleList[index].iconShow) {
        // 将选择的角色放入暂存区
        this.temporaryList = [
          ...this.temporaryList,
          this.selectRoleList[index]
        ];
      } else {
        // 将暂存区中的数据删除
        this.temporaryList = this.temporaryList.filter(item => {
          return (
            this.selectRoleList[index].executorPositionType !==
            item.executorPositionType
          );
        });
      }
    },
    delRole(index) {
      // 删除角色
      this.selectRoleListTwo.splice(index, 1);
    },
    addRoles() {
      // 打开添加角色模态框
      this.addRoleDialog = true;
      this.temporaryList = []; // 清空暂存区的数据
      this.selectRoleList = this.selectRoleList.map(item => {
        // 清空之前的选中状态
        item.iconShow = false;
        return item;
      });
    },
    settingProcess(item) {
      // 设置流程
      this.$_showLoading({
        text: "加载中..."
      });
      flowEditable(item.uid)
        .then(res => {
          if (!res.data) {
            this.currentProcessSetting = item; // 记录当前的审批流程
            getSchoolFlow(item.uid) // 查询这条记录的流程设置
              .then(res => {
                this.selectRoleListTwo = res.data.nodeList;
                this.processSettingDialog = true; // 打开设置模态框
                this.$_hideLoading();
              })
              .catch(() => {
                this.$_hideLoading();
              });
          } else {
            this.$message.warning("存在未处理完成的调课申请");
            this.$_hideLoading();
          }
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    confirmAddRoles() {
      // 确认添加角色
      const totalCount =
        this.selectRoleList.filter(item => {
          return item.iconShow;
        }).length + this.selectRoleListTwo.length;

      if (totalCount > 10) {
        this.$message.warning("审批节点个数不能超过10个");
        return;
      }
      const arrLen = [
        // 原本的数组长度
        ...this.selectRoleListTwo,
        ...this.temporaryList
      ].length;
      const arrLenTwo = arrayWeightRemoval(
        [
          // 去重之后的数组长度
          ...this.selectRoleListTwo,
          ...this.temporaryList
        ],
        "executorPositionType"
      ).length;

      if (arrLen !== arrLenTwo) {
        this.$message.warning("一个审批环节中，一个职位只能出现一次");
        return;
      }
      this.selectRoleListTwo = [
        ...this.selectRoleListTwo,
        ...this.temporaryList
      ];
      this.addRoleDialog = false; // 关闭模态框
    },
    saveProcessSetting() {
      // 保存审批流程
      const submitData = {
        uid: this.currentProcessSetting.uid,
        nodeList: this.selectRoleListTwo.map(item => {
          return {
            executorPositionType: item.executorPositionType,
            nodeName: item.nodeName
          };
        })
      };
      this.$_showLoading({
        text: "保存中..."
      });
      updateSchoolFlow(submitData)
        .then(() => {
          this.$message.success("审批流程设置成功");
          this.processSettingDialog = false; // 关闭设置模态框
          this.getProcessSettingList(); // 刷新列表
          this.$_hideLoading();
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getProcessSettingList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getProcessSettingList();
    }
  },
  components: {
    // [Pagination.name]: Pagination
  }
};
</script>
<style lang="scss" scoped>
.process-setting {
  width: 100%;
  height: 100%;
  .process-scroll {
    width: 100%;
    height: calc(100% - 50px);
    .process-info {
      height: 100%;
      padding: 14px 20px 0;
    }
  }
  .settingDialog,
  .settingDialogAdd {
    font-size: 14px;
    .title {
      color: $approval-color1;
    }
    .role-list {
      padding-top: 20px;
      li {
        box-sizing: content-box;
        width: 105px;
        float: left;
        height: 95px;
        padding-bottom: 22px;
        position: relative;
        &::before {
          position: absolute;
          top: 26px;
          right: 10px;
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-top: 2px solid $approval-color5;
          border-right: 2px solid $approval-color5;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }
        &::after {
          position: absolute;
          top: 30px;
          right: 10px;
          content: "";
          display: inline-block;
          width: 22px;
          height: 2px;
          background: $approval-color5;
        }
        > img {
          border-radius: 50%;
        }
        > p {
          padding-top: 12px;
          color: $approval-color2;
          width: 105px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-indent: 3px;
        }
        .icon-show {
          cursor: pointer;
          position: absolute;
          top: 0px;
          right: 36px;
          width: 20px;
          height: 20px;
          font-size: 16px;
          line-height: 20px;
          border-radius: 50%;
          background: $approval-color2;
          text-align: center;
          display: none;
          i {
            color: $approval-color6;
          }
        }
        .isShow {
          display: block;
        }
      }
      li:nth-of-type(4n),
      li:nth-last-of-type(1) {
        width: 60px;
        &::before {
          border: none;
        }
        &::after {
          width: 0;
        }
        .icon-show {
          right: -9px;
        }
      }
      li:nth-last-of-type(1) {
        width: 60px;
        .add-icon {
          cursor: pointer;
          text-align: center;
          height: 60px;
          border-radius: 50%;
          line-height: 60px;
          border: 1px dashed $approval-color5;
          color: $approval-color3;
        }
      }
    }
  }
  .settingDialogAdd {
    .role-list {
      li:nth-last-of-type(1) {
        width: 60px;
        .add-icon {
          display: none;
        }
      }
      li {
        cursor: pointer;
        &::before {
          width: 0;
          border: none;
        }
        &::after {
          width: 0;
          border: none;
        }
        .icon-show {
          background: $approval-color7;
        }
      }
    }
  }
}
</style>
