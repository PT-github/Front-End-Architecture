<template>
<div class="user-manage">
    <s-title :title="'用户管理'" :haveBorder="true"></s-title>
    <!-- <div class="user-menu">
      <el-radio-group v-model="selectMenu" size="medium" @change="changeMenu">
        <el-radio-button v-for="item in menuList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div> -->
    
    <div class="user-manage-scroll">
      <vue-scroll>
    <div class="user-manage-info" ref="multipleTable" >
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item label="入驻时间:" prop="enterTime" class="enter-time">
          <el-date-picker
            v-model="formInline.enterTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getUserInfosAdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名:" prop="userName">
            <el-input v-model="formInline.userName" placeholder="请输入教师姓名" @keyup.enter.native="getUserInfosAdd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getUserInfosAdd">查询</el-button>
        </el-form-item>
        <div class="el-form-right fr">
          <el-form-item>
            <el-button type="primary" @click="onAdd" class="def-button mgt-2">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="multipleSelection.length === 0" class="btn-bg-DB def-button mgt-2">删除</el-button>
            <el-button v-else class="def-button mgt-2" @click="deleteBatchFun">删除</el-button>
          </el-form-item>
        </div>
      </el-form>

  <template v-if="selectMenu === 1">
      <el-table :data="tableData" key="selectMenu1" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp" v-loading="loading">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="userName" label="姓名" ></el-table-column>
        <el-table-column align="center" prop="userMobile" label="手机号"></el-table-column>
        <el-table-column align="center" label="角色" prop="roleName"></el-table-column>
        <el-table-column align="center" label="职位" prop="positionName"></el-table-column>
        <el-table-column align="center" label="入校方式">
          <template slot-scope="scope">{{ scope.row.approvalSource === 1 ? '门户' : scope.row.approvalSource === 2 ? '公众号' : scope.row.approvalSource === 3 ? 'APP' : '系统' }}</template>
        </el-table-column>
        <el-table-column align="center" label="入校时间">
          <template slot-scope="scope">
            <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.positionType === 'CJGLY'">
              <span class="opera color-gray">编辑</span>
              <span class="delete color-gray">删除</span>
            </template>
            <template v-else>
              <span class="opera" @click="onEdit(scope.row)">编辑</span>
              <span class="delete" @click="onDelete(scope.row)">删除</span>
            </template>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loading">
          </div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
      </template>
    </el-table>
  </template>
   <template v-else>
     <el-table :data="tableData"  key="selectMenu2" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp" v-loading="loading">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="userName" label="姓名" ></el-table-column>
        <el-table-column align="center" prop="userMobile" label="手机号"></el-table-column>
        <el-table-column align="center" label="角色" prop="roleName"></el-table-column>
        <el-table-column align="center" label="职位" prop="positionName"></el-table-column>
        <el-table-column align="center" prop="connectionUser" label="关联学生"></el-table-column>
        <el-table-column align="center" label="入校方式">
          <template slot-scope="scope">{{ scope.row.approvalSource === 1 ? '门户' : scope.row.approvalSource === 2 ? '公众号' : scope.row.approvalSource === 3 ? 'APP' : '系统' }}</template>
        </el-table-column>
        <el-table-column align="center" label="入校时间">
          <template slot-scope="scope">
            <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.positionType === 'CJGLY'">
              <span class="opera color-gray">编辑</span>
              <span class="opera color-gray">删除</span>
            </template>
            <template v-else>
              <span class="opera" @click="onEdit(scope.row)">编辑</span>
              <span class="opera" @click="onDelete(scope.row)">删除</span>
            </template>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loading">
          </div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
      </template>
    </el-table>
   </template>
    <template v-if="total > 10">
       <div class="pagination-comp clearfix">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
          </div>     
    </template>

    </div>
    </vue-scroll>
    </div>

      <!-- 添加/编辑用户 -->
      <el-dialog
        class="dialog-comp"
        :title="AEIntitle"
        width="400px"
        :visible.sync="addEditInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          :rules="rules"
          :label-position="labelPosition"
          ref="form"
          label-width="92px"
          size="small"
          class="teaching-group-dialog">
        <template  v-if ="!postAddInData.userId">
          <div class="alert-msg">
             <p>备注：</p>
             <p>添加后将给用户发送短信通知</p>
          </div> 
        </template>
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model="postAddInData.userName"
              placeholder="请输入教师姓名" />
          </el-form-item>
          <el-form-item label="手机号码" prop="userMobile"  v-if ="!postAddInData.userId">
            <el-input
              v-model="postAddInData.userMobile"
              placeholder="请输入手机号码" />
          </el-form-item>
           <el-form-item label="手机号码" prop="userMobile"  v-if ="postAddInData.userId">
            <el-input
              v-model="postAddInData.userMobile"
              disabled
              placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="选择职位" prop="userPosition">
             <el-select v-model="postAddInData.userPosition" placeholder="请选择职位">
               <el-option-group
                v-for="group in userPositionList"
                :key="group.roleName"
                :label="group.roleName">
                <el-option
                  v-for="item in group.positionList"
                  :key="item.uid"
                  :label="item.positionName"
                  :value="item.positionType">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="addEditInDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="删除用户"
        width="360px"
        :visible.sync="deleteDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>删除该用户，用户与学校解除关联，将影响相关数据，确定要删除吗？</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onBatchDelete">确 定</el-button>
          <el-button @click="deleteDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 批量删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="批量删除用户"
        width="360px"
        :visible.sync="deleteBatchDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>删除用户，用户与学校解除关联，将影响相关数据，确定要批量删除吗？</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onBatchDelete">确 定</el-button>
          <el-button @click="deleteBatchDialog = false">取 消</el-button>
        </span>
      </el-dialog>
</div>
</template>

<script>
import { checkTel } from '@/utils/validator'
import { addUser, getUserInfoList, updateUserInfos, deleteUserInfos, getRolePosition } from '../../store/api';
export default {
  name: 'UserManage',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      selectMenu: 1,
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: 1,    //学校id
      formInline: {
        enterTime: null,  //入驻时间
        userName: null,  //教师名称
      },
      teachingOptions: [],
      multipleSelection: [],  //批量选择
      menuList: [{
        label: '教师',
        value: 1
      },{
        label: '家长',
        value: 2
      }],
      tableData: [],
      userPositionList: [],
      postAddInData: {
        userName: '',
        userMobile: '',
        userPosition: '',
      },
      addEditInDialog: false, // 编辑添加用户
      AEIntitle: '添加用户',
      rules: {
        userName: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        userMobile: [{ required: true, message: '该项内容不可为空', trigger: 'blur'},
                     { validator: checkTel, trigger: 'blur' }],
        userPosition: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
      },
      deleteDialog: false,
      deleteBatchDialog: false,  //批量删除
      deleteItem: {},
      confirmLoading: false, // 按钮loading状态
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      positionId: null,
      loading: false,
    };
  },
  created(){  //生命周期里接收参数
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.selectMenu = + this.$route.query.selectMenu || 1 ,  //接受参数关键代码
    this.currentPage = + this.$route.query.currentPage || 1,
    console.log(this.selectMenu,this.currentPage, typeof this.currentPage)  
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.tableData = this.tableData1;
      this.getUserInfos();
      this.getRolePositionList();
    } 
  },
  methods: {
    deleteBatchFun () {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].positionType === 'CJGLY') {
          this.$message.error('超级管理员暂时不支持删除操作')
          return
        }
      }
      this.deleteBatchDialog = true
    },
    //查询用户列表
    getUserInfos () {
      this.loading = true;
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
        'where.userName': this.formInline.userName,
      };
      if(this.selectMenu === 1) {
        queryParams['where.roleType'] = 'JS';
      } else if(this.selectMenu === 2){
        queryParams['where.roleType'] = 'JZ';
      }
      if(this.formInline.enterTime) {
        let startDate = this.formInline.enterTime[0].getTime();
        let endtDate = this.formInline.enterTime[1].getTime();
        queryParams['where.beginTime'] = startDate;
        queryParams['where.endTime'] = endtDate;
      } 
      console.log("formInline",queryParams)
      getUserInfoList(queryParams).then(res =>{
         this.tableData = res.data.list;
         this.total = res.data.total;
         this.$nextTick(() => {
            this.loading = false
         })
      }).catch(e =>{
         console.log(e);
         this.loading = false
      })      
    },
    getUserInfosAdd() {
      this.currentPage = 1;
      this.getUserInfos();
    },
    //获取学校角色以及对应职务
    getRolePositionList() {
      getRolePosition().then(res => {
        let userPositionList = res.data;
        if(userPositionList && userPositionList.length > 0) {
          this.userPositionList = userPositionList.filter(res => res.roleType !== 'CJADMIN');
        }else {
          this.userPositionList = null;
        }
        console.log("this.userPositionList",this.userPositionList)
      }).catch(e =>{
         console.log(e);
      }) 
    },
    getRoleFu(value) {
      let role;
      for(let item of this.userPositionList){
        for(let key of item.positionList) {
          if(value === key.positionType){
            role = item;
            this.positionId = key.uid;
            break;
          }
        }
      }
      return role;
    },
    //改变menu
    changeMenu(value) {
      this.selectMenu = value;
      this.getUserInfos();
      this.currentPage = 1;
      this.$router.push({  //核心语句
        path:'/platform/user-manage',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          selectMenu: this.selectMenu,  
          currentPage: this.currentPage,
        }
      })
      this.formInline = {};
      this.multipleSelection = [];
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getUserInfos();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.$router.push({  //核心语句
        path:'/platform/user-manage',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          selectMenu: this.selectMenu,  
          currentPage: this.currentPage,
        }
      })
      this.getUserInfos();
    },
    onAdd () { // 添加用户
      this.AEIntitle = '添加用户'
      this.postAddInData = {};
      this.addEditInDialog = true
      this.$nextTick(() => {
        if(this.$refs.form){
          this.$refs.form.clearValidate();
        }
      })
    },
    onEdit (obj) { // 编辑用户
      this.AEIntitle = '编辑用户';
      this.postAddInData = {};
      obj['userPosition'] = obj.positionType;
      this.postAddInData = Object.assign({}, obj);
      console.log("44444444",this.postAddInData);
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    //确定添加或编辑用户
    onConfirmAddEditIn () {
      console.log("1111111111111111",this.postAddInData);
      this.$_showLoading()
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let role = this.getRoleFu(this.postAddInData.userPosition);
            let queryParams = {
              schoolId: this.schoolId,
              userName: this.postAddInData.userName,
              userMobile: this.postAddInData.userMobile,
              positionId: this.positionId,
              roleId: role.uid,
              positionType: this.postAddInData.userPosition,
            };
            if (this.postAddInData.userId) {
              queryParams['uid'] = this.postAddInData.userId;
              updateUserInfos(queryParams).then(res => {
                console.log(res);
                this.$message.success('修改成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.getUserInfos();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              }) 

            } else {
              addUser(queryParams).then(res => {
                console.log(res);
                this.$message.success('新增成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.getUserInfos();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              })
            }
          }else {
            this.$nextTick(() => {
                this.$_hideLoading()
            })
          }
        })
      })
    },
    //删除弹窗
    onDelete (obj) {
      this.deleteItem = Object.assign({}, obj)
      this.deleteDialog = true
    },
    //批量多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("multipleSelection",this.multipleSelection)
    },
    // 批量删除
    onBatchDelete () { 
      this.$_showLoading()
      let uids = [], userIds = '';
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.map(item => { uids.push(item.userId) });
        userIds = uids.join();
      }else if (this.deleteItem) {
        userIds = this.deleteItem.userId;
      }
      console.log(uids)
      let queryParams = {
        userIds: userIds,
        schoolId: this.schoolId,
      }
      deleteUserInfos(queryParams).then(res => {
        console.log(res);
        this.$message.success('删除成功');
        this.deleteDialog = false;
        this.deleteBatchDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        })
        this.getUserInfos();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      })
      
    },
  }
}
</script>

<style lang="scss" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  .user-menu {
    padding-bottom: 14px;
    border-bottom: 1px solid $border-color;
    margin: 0 20px;
  }
  .user-manage-scroll {
    width: 100%;
    height: calc(100% - 100px);
    .user-manage-info {
      height: 100%;
      padding: 14px 20px 0;
      .btn-bg-DB {
        background-color: $button-color4;
      }
    }
    .color-gray {
      color: $user-table-color1;
    }
  }
}
</style>
<style lang="scss">
.user-manage-scroll {
  .__view {
    width: 100% !important;
  }
  .user-manage-info {
     .el-range-editor--small .el-range-separator {
       margin-right: 12px;
     }
     .el-date-editor--daterange.el-input__inner {
       width: 240px;
     }
     .enter-time {
       .el-form-item__content {
         margin-top: 2px;
       }
     }
  }
}
</style>

