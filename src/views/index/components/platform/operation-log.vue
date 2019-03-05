<template>
<div class="operation-manage">
    <s-title :title="'操作日志'"></s-title>
    <div class="operation-manage-scroll">
    <vue-scroll>
    <div class="operation-manage-info">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item label="姓名:" prop="userName">
          <el-input v-model="formInline.userName" placeholder="请输入姓名" @keyup.enter.native="getBusinessLogList"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="userMobile">
          <el-input v-model="formInline.userMobile" placeholder="请输入手机号" @keyup.enter.native="getBusinessLogList"></el-input>
        </el-form-item>
        <el-form-item label="操作时间:" prop="enterTime" class="enter-time">
          <el-date-picker
            v-model="formInline.enterTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getBusinessLogList">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.type" placeholder="请选择操作模块" @change="getBusinessLogList" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getBusinessLogList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" ref="table" :data="tableData" style="width: 100%" class="table-comp">
        <el-table-column align="center" prop="userName" label="姓名" ></el-table-column>
        <el-table-column align="center" prop="userMoblie" label="手机号"></el-table-column>
        <el-table-column align="center" prop="resourceName" label="操作模块"></el-table-column>
         <el-table-column align="center" prop="requestDesc" label="操作描述"></el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <p >{{ scope.row.requestTime | moment('yyyy-MM-dd HH:mm:ss')}}</p>
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
</div>
</template>

<script>
import { getBusinessLog } from '../../store/api';
import { formatDate } from '@/utils/index'
export default {
  name: 'OperationLog',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: 1,    //学校id
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      formInline: {
        enterTime: null,  //操作时间
        userName: null,  //教师名称
        userMobile: null, //手机号
        type: null, //操作模块
      },
      tableData: [],
      options: [{
        label: '教育根节点',
        value: 101
      },{
        label: '登录',
        value: 102
      },{
        label: '学校认证',
        value: 103
      },{
        label: '个人中心',
        value: 104
      },{
        label: '账号设置',
        value: 105
      },{
        label: '基础数据',
        value: 106
      },{
        label: '教学计划',
        value: 107
      },{
        label: '排课系统',
        value: 108
      },{
        label: '审批管理',
        value: 109
      },{
        label: '数据统计',
        value: 110
      },{
        label: '平台用户',
        value: 111
      },{
        label: '学年学期',
        value: 112
      },{
        label: '教师信息',
        value: 113
      },{
        label: '年级班级',
        value: 114
      },{
        label: '课时数据',
        value: 115
      },{
        label: '科目信息',
        value: 116
      },{
        label: '场地信息',
        value: 117
      },{
        label: '教研组信息',
        value: 118
      },{
        label: '教学分工',
        value: 119
      },{
        label: '排课管理',
        value: 120
      },{
        label: '查看课表',
        value: 121
      },{
        label: '历史课表',
        value: 122
      },{
        label: '流程设置',
        value: 123
      },{
        label: '调课审批',
        value: 124
      },{
        label: '代课管理',
        value: 125
      },{
        label: '课量统计',
        value: 126
      },{
        label: '调课统计',
        value: 127
      },{
        label: '代课统计',
        value: 128
      },{
        label: '用户管理',
        value: 129
      },{
        label: '用户审核',
        value: 130
      },{
        label: '操作日志',
        value: 131
      },{
        label: '调代课管理',
        value: 132
      },{
        label: '调课管理',
        value: 133
      },{
        label: '代课查询',
        value: 134
      },{
        label: '任课表',
        value: 136
      },{
        label: '班级表',
        value: 137
      }],
      value: '',
      loading: false,
    };
  },
  mounted () { 
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId)
      this.getBusinessLogList();
    }
  },
  methods: {
    //查询操作日志
    getBusinessLogList () {
      console.log("formInline",this.formInline)
      this.loading = true
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
      };
      this.formInline.userName && (queryParams['where.userName'] = this.formInline.userName.trim())
      this.formInline.userMobile && (queryParams['where.userMoblie'] = this.formInline.userMobile.trim())
      this.formInline.enterTime && (queryParams['where.startDate'] = formatDate(this.formInline.enterTime[0], "yyyy-MM-dd"));
      this.formInline.enterTime && (queryParams['where.endDate'] = formatDate(this.formInline.enterTime[1], "yyyy-MM-dd"));
      this.formInline.type && (queryParams['where.resourceId'] = this.formInline.type)
      console.log("queryParams",queryParams)
      getBusinessLog(queryParams).then(res =>{
         this.tableData = res.data.list;
         this.total = res.data.total;
         this.$nextTick(() => {
            this.loading = false;
         })
      }).catch(e =>{
         console.log(e);
         this.loading = false
      })      
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getBusinessLogList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getBusinessLogList();
    },
  }
}
</script>

<style lang="scss" scoped>
.operation-manage {
  width: 100%;
  height: 100%;
  .operation-manage-scroll {
    height: calc(100% - 50px);
    .operation-manage-info {
      height: 100%;
      padding: 14px 0 0;
      margin: 0 20px;
      border-top: 1px solid $border-color;
    }
  }
}
</style>
<style lang="scss">
  .operation-manage-info {
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
     .el-input--small {
       width: 180px;
     }
  }
  .operation-manage-scroll {
    .__view {
      width: 100% !important;
    }
  }
</style>

