<template>
  <div class="history-list-man">
    <s-title :title="'历史课表'"></s-title>
    <div class="history-list-scroll">
    <vue-scroll>
    <div class="history-list-info">
    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
      <el-form-item>
        <el-select v-model="schoolYearId" placeholder="请选择学年" @change="getHistoryCourse">
          <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="icon-button" @click="getHistoryCourse">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" ref="table" stripe class="table-comp" v-loading="loading">
      <el-table-column align="center" type="index" width="140" label="序号"></el-table-column>
      <el-table-column align="center" prop="courseName" label="课表名称" ></el-table-column>
      <el-table-column align="center" prop="addTime" label="创建时间">
        <template slot-scope="scope">
          <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="发布时间">
        <template slot-scope="scope">
          <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <span class="opera" @click="linkToHistoryCourse(scope.row)">查看课表</span>
          <span class="opera" @click="onView(scope.row)">排课规则</span>
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

    <!-- 排课规则 -->
      <el-dialog
        class="dialog-comp rule-comp"
        title="规则总览"
        width="701px"
        :visible.sync="ruleViewDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="rule-dialog">
          <div class="rule-menu">
            <el-radio-group v-model="selectMenu" size="medium" @change="changeMenu">
              <el-radio-button v-for="item in menuList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
          </div>
          <template v-if="selectMenu === 1">
            <div v-for="(item,index) in fixedRules" :key="index+'fixed'" class="rule-col">
              <div class="term-title">
                <span class="fl-title">{{ item.objType === 1  ? '科目' : item.objType === 2  ? '老师' : item.objType === 3  ? '教研组' : '' }}固排</span>
              </div>
              <div v-for="(key,idx) in item.preScheduleInfoDetailDtoList" :key="idx" class="rule-details">
                <p><span>预设节次：</span><span>{{week[(key.weekDay-1)]}}第{{key.classIndex}}节</span></p>
                <p><span>科目：</span><span>{{key.name}}</span></p>
                <p><span>班级：</span><span>{{key.className}}</span></p>
              </div>
            </div>
          </template>
          <template v-else-if="selectMenu === 2">
            <div v-for="(item,index) in forbidRules" :key="index+'fixed'" class="rule-col">
              <div class="term-title">
                <span class="fl-title">{{ item.objType === 1  ? '科目' : item.objType === 2  ? '老师' : item.objType === 3  ? '教研组' : '' }}禁排</span>
              </div>
              <div v-for="(key,idx) in item.preScheduleInfoDetailDtoList" :key="idx" class="rule-details">
                <p><span>预设节次：</span><span>{{week[(key.weekDay-1)]}}第{{key.classIndex}}节</span></p>
                <p><span>科目：</span><span>{{key.name}}</span></p>
                <p><span>班级：</span><span>{{key.className}}</span></p>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-for="(item,index) in basisRules" :key="index+'basis'" class="rule-col">
              <div class="term-title">
                <span class="fl-title">{{item.ruleName}}</span>
              </div>
              <div class="rule-details">
                <p><span>{{item.gradeNames}}</span></p>
              </div>
            </div>
            <!-- <div v-for="(item,index) in basisRules" :key="index+'fixed'" class="rule-basis">
              <p><span>{{item.ruleName}}</span></p>
            </div> -->
          </template>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ruleViewDialog = false;">关 闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getHistoryCourseList, getRulesByTermId, getCourseRules } from '../../store/api';
import envConfig from "@/config"; // base请求地址
export default {
  name: 'HistoryList',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: null,  //学校id
      schoolYearId: null,   //选择学年
      defaultSchoolYearId: null,   //默认学年
      formInline: {},
      tableData: [],
      currentSchool: null,   //当前学校
      yearOptions: [
        {
          schoolYear: '全部学年',
          uid: null,
        }
      ],
      ruleViewDialog: false,    //规则总览弹窗
      menuList: [{
        label: '固排',
        value: 1
      },{
        label: '禁排',
        value: 2
      },{
        label: '基础规则',
        value: 3
      }],
      selectMenu: 1,
      fixedRules: null,       //固排
      forbidRules: null,        //禁排
      basisRules: null,         //基础规则
      week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  mounted () {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId)
      this.getSchoolYear();
    }
  },
  methods: {
    /**
     * 初始化学年学期信息
     */
    getSchoolYear () {
      return new Promise(resolve => {
        this.$_showLoading();
        this.loading = true;
        if (this.schoolYear && this.schoolYear.length > 0) {
          this.yearOptions = [...this.yearOptions, ...this.schoolYear]; 
          this.$nextTick(() => {
             this.$_hideLoading()
          })
          this.getHistoryCourse();
          resolve()
        } else {
          this.$store.dispatch('SetSchoolYear').then(() =>{
            this.yearOptions = [...this.yearOptions, ...this.schoolYear]; 
            this.$nextTick(() => {
              this.$_hideLoading()
            })
            this.getHistoryCourse();
            resolve()
          }).catch(() => {
            this.$_hideLoading()
            this.loading = false;
          })
        }
      })
    },
    //查询历史课表
    getHistoryCourse() {
      this.loading = true
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
        'where.schoolYearId': this.schoolYearId,
      };
      getHistoryCourseList(queryParams).then(res =>{
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
      this.pageSize = val;
      this.getTeacherData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTeacherData();
    },
    //查看课表
    linkToHistoryCourse(value) {  
      let url = envConfig.ADDPREFIX + '/course/history-course-table?schoolId=' + this.schoolId + '&termId=' + value.termId + '&schoolYearId=' + value.schoolYearId
      console.log(url)
      /* window.open(url, '_blank') */
      this.$router.push({  //核心语句
        path:'/course/history-course-table',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          term: value.termId,  
          schoolYearId: value.schoolYearId
        }
      })
    },
    //排课规则
    onView(value){
       console.log("value",value);
       this.ruleViewDialog = true;
       this.getCourseRulesList(value.termId);
       this.getBaseRulesList(value.termId);
    },
    //改变menu
    changeMenu(value) {
      this.selectMenu = value;
    },
    //获取固排禁排规则
    getCourseRulesList(value) {
      getCourseRules(value).then(res =>{
        let fixedRules = [], forbidRules = [];
        if(res.data && res.data.length > 0) {
          for(let item of res.data) {
              if(item.preScheduleType === 1) {
                fixedRules.push(item);
              }else if(item.preScheduleType === 2) {
                forbidRules.push(item);
              }
          } 
        }
        this.fixedRules = [...fixedRules];
        this.forbidRules = [...forbidRules];
        console.log("fixedRules",this.fixedRules);
        console.log("forbidRules",this.forbidRules);
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //获取基础规则
    getBaseRulesList(value) {
      getRulesByTermId(value).then(res =>{
        let basisRules = [];
        if(res.data && res.data.length > 0) {
          basisRules = res.data;
        }
        this.basisRules = [...basisRules];
      }).catch(e =>{
         console.log(e);
      }) 
    },
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.history-list-man {
  width: 100%;
  height: 100%;
  .history-list-scroll {
    width: 100%;
    height: calc(100% - 50px);
    .history-list-info {
     height: 100%;
     padding: 14px 20px 0;
     border-top: 1px solid $border-color;
    }
  }  
}
.rule-dialog {
    .rule-menu {
      padding-bottom: 30px;
      text-align: center;
    }
    .rule-col {
      padding-bottom: 30px;
      &:last-child {
        padding-bottom: 0;
      }
      .rule-details {
          padding-bottom: 20px;
          line-height: 24px;
          font-size: 14px;
          &:last-child {
          padding-bottom: 0;
        }
      }
    }
    .rule-basis {
      line-height: 24px;
      font-size: 14px;
    }
  }
</style>
<style lang="scss">
.history-list-scroll {
  .__view {
    width: 100% !important;
  }
}
.rule-comp {
  .el-dialog__body {
    height: 500px;
    overflow-y: scroll;
    .rule-dialog {
      .el-radio-button--medium .el-radio-button__inner {
        padding: 10px 0;
        width: 120px;
      }
    }
  }
  .el-dialog__footer {
    padding: 12px 0;
    margin: 0 20px;
    border-top: 1px solid $border-color;
  }
}

</style>
  