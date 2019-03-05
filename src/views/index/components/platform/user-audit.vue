<template>
<div class="user-manage">
    <s-title :title="'用户审核'"></s-title>
    <div class="user-menu">
      <el-radio-group v-model="selectMenu" size="medium" @change="changeMenu">
        <el-radio-button v-for="item in menuList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="user-manage-scroll">
    <vue-scroll>  
    <div class="teacher-manage" ref="multipleTable">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item label="申请时间:" prop="enterTime" class="enter-time">
          <el-date-picker
            v-model="formInline.enterTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getEnterSchoolAdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名:" prop="userName">
            <el-input v-model="formInline.userName" placeholder="请输入姓名" @keyup.enter.native="getEnterSchoolAdd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getEnterSchoolAdd">查询</el-button>
        </el-form-item>
        <div class="el-form-right fr">
        <template v-if="selectMenu === 1">
          <el-form-item>
            <el-button v-if="multipleSelection.length === 0" class="btn-bg-DB def-button">审核通过</el-button>
            <el-button v-else type="primary" class="def-button" @click="onBatchAudit">审核通过</el-button>
          </el-form-item>
        </template>
        </div>
      </el-form>

  <template v-if="selectMenu === 1">
      <el-table v-loading="loading" :data="tableData" key="selectMenu1" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="applyName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="userMobile" label="手机号"></el-table-column>
        <el-table-column align="center" label="申请方式">
          <template slot-scope="scope">{{ scope.row.approvalSource === 1 ? '门户' : scope.row.approvalSource === 2 ? '公众号' : scope.row.approvalSource === 3 ? 'APP' : '系统' }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="enterRemark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <span class="opera" @click="onAudit(scope.row)">审核</span>
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
   <template v-else-if="selectMenu === 2">
     <el-table v-loading="loading" :data="tableData"  key="selectMenu2" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp">
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="applyName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="userMobile" label="手机号"></el-table-column>
        <el-table-column align="center" label="申请方式">
          <template slot-scope="scope">{{ scope.row.approvalSource === 1 ? '门户' : scope.row.approvalSource === 2 ? '公众号' : scope.row.approvalSource === 3 ? 'APP' : '系统' }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核时间">
          <template slot-scope="scope">
            <p >{{ scope.row.approvalTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="enterRemark" label="备注" show-overflow-tooltip></el-table-column>
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
     <el-table v-loading="loading" :data="tableData"  key="selectMenu2" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp">
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" prop="applyName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="userMobile" label="手机号"></el-table-column>
        <el-table-column align="center" label="申请方式">
          <template slot-scope="scope">{{ scope.row.approvalSource === 1 ? '门户' : scope.row.approvalSource === 2 ? '公众号' : scope.row.approvalSource === 3 ? 'APP' : '系统' }}</template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核时间">
          <template slot-scope="scope">
            <p >{{ scope.row.approvalTime | moment('yyyy-MM-dd')}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="enterRemark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="approvalContent" label="不通过原因" show-overflow-tooltip></el-table-column>
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

      <!-- 申请入校审核 -->
      <el-dialog
        class="dialog-comp"
        title="申请入校审核"
        width="400px"
        :visible.sync="auditDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="auditFrom"
          :label-position="labelPosition"
          ref="form"
          size="small"
          class="audit-form">
          <el-form-item prop="userPosition">
             <el-radio v-model="approvalState" label="2">通过</el-radio>
             <el-select v-model="auditFrom.userPosition" placeholder="请选择职位">
                  <el-option-group
                    v-for="group in userPositionList"
                    :key="group.roleName"
                    :label="group.roleName">
                    <el-option
                      v-for="item in group.positionList"
                      :key="item.uid"
                      :label="item.positionName"
                      :value="item.uid">
                    </el-option>
                  </el-option-group>
                </el-select>
                <p class="warning-message" v-if="pass">请选择职位</p>
          </el-form-item>
          <el-form-item prop="reason" class="no-pass">
            <el-radio v-model="approvalState" label="3">不通过</el-radio>
            <el-input
              v-model="auditFrom.reason"
              placeholder="请填写不通过理由" />
            <p class="warning-message" v-if="noPass">请填写不通过理由</p>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="auditDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 批量审核通过 -->
      <el-dialog
        class="dialog-comp"
        title="批量审核通过"
        width="400px"
        :visible.sync="auditBatchDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="auditFrom"
          :label-position="labelPosition"
          ref="form"
          size="small"
          class="teaching-group-dialog">
          <!-- <el-alert
                title="批量审核选择的角色将应用于选择的所有用户"
                type="warning"
                show-icon
                :closable="false">
          </el-alert> -->
          <div class="alert-msg pdb-12">
             <p>备注：</p>
             <p>批量审核选择的角色将应用于选择的所有用户</p>
          </div> 
          <el-form-item prop="userPosition">
             <el-radio v-model="approvalState" label="2">通过</el-radio>
             <el-select v-model="auditFrom.userPosition" placeholder="请选择职位">
                  <el-option-group
                    v-for="group in userPositionList"
                    :key="group.roleName"
                    :label="group.roleName">
                    <el-option
                      v-for="item in group.positionList"
                      :key="item.uid"
                      :label="item.positionName"
                      :value="item.uid">
                    </el-option>
                  </el-option-group>
                </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="auditBatchDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      </div>
    </vue-scroll>
    </div>  
</div>
</template>

<script>
import { getEnterSchoolList, updateEnterSchoolsChecked, getRolePosition } from '../../store/api';
export default {
  name: 'UserAudit',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      selectMenu: 1,
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: null,    //学校id
      formInline: {
        enterTime: null,  //入驻时间
        userName: null,  //教师名称
      },
      approvalState: null, //审核状态
      pass: false,    //通过提示
      noPass: false,   //不通过提示
      noSelect: false, //没选择提示
      multipleSelection: [],  //批量选择
      menuList: [{
        label: '未审核',
        value: 1
      },{
        label: '已通过',
        value: 2
      },{
        label: '已驳回',
        value: 3
      }],
      tableData: [],
      auditFrom: {
        reason: '',
        userPosition: '',
      },
      userPositionList: [],
      auditDialog: false, // 审核
      auditBatchDialog: false,
      auditBatchItem: {},
      confirmLoading: false, // 按钮loading状态
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      organId: null,    //当前学校机构id
      auditItem: null,   //当前审核信息
      positionType: null,
      loading: false,
    };
  },
  created(){  //生命周期里接收参数
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.selectMenu = + this.$route.query.selectMenu || 1 ,  //接受参数关键代码
    this.currentPage = + this.$route.query.currentPage || 1,
    console.log(this.selectMenu,this.currentPage, typeof this.currentPage,this.currentSchool)  
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.organId  = this.currentSchool.organId;
      this.tableData = this.tableData1;
      this.getEnterSchool();
    }
    this.getRolePositionList(); 
  },
  methods: {
    //查询用户列表
    getEnterSchool () {
      this.loading = true;
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
        'where.userName': this.formInline.userName,
        'where.approvalState': this.selectMenu,
      };
      if(this.formInline.enterTime) {
        let startDate = this.formInline.enterTime[0].getTime();
        let endtDate = this.formInline.enterTime[1].getTime();
        queryParams['where.beginTime'] = startDate;
        queryParams['where.endTime'] = endtDate;
      } 
      console.log("formInline",queryParams,this.$refs)
      getEnterSchoolList(queryParams).then(res =>{
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
    getEnterSchoolAdd() {
      this.currentPage = 1;
      this.getEnterSchool();
    },
    //改变menu
    changeMenu(value) {
      this.selectMenu = value;
      this.formInline = { 
        enterTime: null,  //入驻时间
        userName: null,  //教师名称;
      }
      this.getEnterSchool();
      this.currentPage = 1;
      this.$router.push({  //核心语句
        path:'/platform/user-audit',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          selectMenu: this.selectMenu,  
          currentPage: this.currentPage,
        }
      })
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.$router.push({  //核心语句
        path:'/platform/user-audit',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          selectMenu: this.selectMenu,  
        }
      })
      this.getEnterSchool();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.$router.push({  //核心语句
        path:'/platform/user-audit',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          selectMenu: this.selectMenu,  
          currentPage: this.currentPage,
        }
      })
      this.getEnterSchool();
    },
    onAudit (obj) { // 审核
      /* this.getRolePositionList(); */
      this.auditFrom = {};
      this.auditItem = Object.assign({}, obj);
      this.approvalState = null;
      this.auditDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
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
          if(value === key.uid){
            role = item;
            this.positionType = key.positionType;
            break;
          }
        }
      }
      return role;
    },
    //确定审核
    onConfirmAddEditIn () {
      console.log("1111111111111111",this.auditItem);
      this.$_showLoading()
      this.$nextTick(() => {
        if(this.approvalState){
          this.$refs.form.validate((valid) => {
          if (valid) {
            if(this.approvalState === "2"){
              if(!this.auditFrom.userPosition){
                 this.$message.error('请选择职位');
                 this.$nextTick(() => {
                    this.$_hideLoading()
                 })
                 return false;
              }
            }else if (this.approvalState === "3") {
              if(!this.auditFrom.reason){
               this.$message.error('请填写不通过理由');
               this.$nextTick(() => {
                    this.$_hideLoading()
               })
               return false;
              }
            }
            
            let uids = [],uid = '' , queryParams= [];
            /* let queryParams = {
                uid: uid,
                approvalState: +this.approvalState,
                userMobile: this.auditItem.userMobile,
                userName: this.auditItem.applyName,
                organId: this.organId,
              }; */
              if(this.approvalState === "2"){
                let role = this.getRoleFu(this.auditFrom.userPosition);
                if (this.auditDialog) {
                  uid = this.auditItem.uid;
                  queryParams.push({
                    uid: uid,
                    approvalState: +this.approvalState,
                    userMobile: this.auditItem.userMobile,
                    userName: this.auditItem.applyName,
                    organId: this.organId,
                    positionId: this.auditFrom.userPosition,
                    positionType: this.positionType,
                    roleId: role.uid,
                    roleType: role.roleType,
                    schoolId: this.schoolId,
                  });
                }else if (this.auditBatchDialog) {
                  if (this.multipleSelection && this.multipleSelection.length > 0) {
                    this.multipleSelection.map(item => { uids.push(
                      {
                        uid: item.uid,
                        approvalState: +this.approvalState,
                        userMobile: item.userMobile,
                        userName: item.applyName,
                        organId: this.organId,
                        positionId: this.auditFrom.userPosition,
                        positionType: this.positionType,
                        roleId: role.uid,
                        roleType: role.roleType,
                        schoolId: this.schoolId,
                      })
                    });
                    queryParams = uids;
                  }
                }
                
                console.log("2222222222222",this.auditFrom.userPosition,role,typeof this.approvalState);
                
              }else if (this.approvalState === "3") {
                queryParams.push({
                  uid: this.auditItem.uid,
                  approvalState: +this.approvalState,
                  userMobile: this.auditItem.userMobile,
                  userName: this.auditItem.applyName,
                  organId: this.organId,
                  approvalContent: this.auditFrom.reason,
                  schoolId: this.schoolId,
                });
              }
              console.log("queryParams",queryParams);
              updateEnterSchoolsChecked(queryParams).then(res => {
                  console.log(res);
                  this.$message.success('操作成功');
                  this.auditDialog = false;
                  this.auditBatchDialog = false;
                  this.$nextTick(() => {
                    this.$_hideLoading()
                  })
                  this.getEnterSchool();
              }).catch(e =>{
                  console.log(e);
                  this.$_hideLoading()
              }) 
            }else {
              this.$nextTick(() => {
                  this.$_hideLoading()
              })
            }        
        })
        } else {
          this.$message.error('请选择审核操作');
          this.$nextTick(() => {
              this.$_hideLoading()
          })
        }
     })
    },
    //批量多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("multipleSelection",this.multipleSelection)
    },
    //批量审核
    onBatchAudit() {
        /* this.getRolePositionList(); */
        this.auditBatchDialog = true;
        this.approvalState = null;
        this.auditFrom = {};
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  .user-manage-scroll {
    width: 100%;
    height: calc(100% - 100px);
    .teacher-manage {
      height: 100%;
      padding: 14px 20px 0;
      .btn-bg-DB {
        background-color: $button-color4;
      }
    }
  }
  .user-menu {
    padding-bottom: 14px;
    border-bottom: 1px solid $border-color;
    margin: 0 20px;
  }
  .pdb-12 {
    padding-bottom: 12px
  }
}
</style>
<style lang="scss">
.user-manage-scroll {
  .__view {
    width: 100% !important;
  }
  .teacher-manage {
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
  .el-table .cell {
    white-space: nowrap;
  }
}
 .el-tooltip__popper[x-placement^=right] .popper__arrow {
   border-right-color: $course-view-color4
 }
 .el-tooltip__popper[x-placement^=right] .popper__arrow::after {
   border-right-color: $course-view-color4
 }
  .el-tooltip__popper[x-placement^=top] .popper__arrow {
   border-top-color: $course-view-color4
 }
 .el-tooltip__popper[x-placement^=top] .popper__arrow::after {
   border-top-color: $course-view-color4
 }
 .el-tooltip__popper.is-dark {
   background: $course-view-color4
 }
  
</style>

