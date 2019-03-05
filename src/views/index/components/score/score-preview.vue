<template>
  <div class="layout">
    <div class="layout-top">
      <LayoutHeader></LayoutHeader>
    </div>
    <div class="sp-box">
      <div class="sp-box-main">
        <p >预览<a :href="downloadUrl"><i class="iconfont icon-daoru"></i><span class="mg-l">下载</span></a></p>
        <el-table v-loading="loading" :data="tableData" class="table-comp score-table">
          <el-table-column
                  type="index"
                  align="center"
                  label="序号"
                  width="50">
          </el-table-column>
          <el-table-column
                  prop="schoolName"
                  align="center"
                  label="学校"
                  :show-overflow-tooltip="true"
                  min-width="80">
            <template slot-scope="scope">
              {{scope.row.schoolName ? scope.row.schoolName: '--'}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="className"-->
          <!--align="center"-->
          <!--label="年级"-->
          <!--min-width="80">-->
          <!--</el-table-column>-->
          <el-table-column
                  prop="className"
                  :show-overflow-tooltip="true"
                  align="center"
                  label="班级名称"
                  min-width="90">
            <template slot-scope="scope">
              {{scope.row.className ? scope.row.className: '--'}}
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="应考人数"
                  :show-overflow-tooltip="true"
                  min-width="80">
            <template slot-scope="scope">
              {{'--'}}
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  :show-overflow-tooltip="true"
                  label="实考人数"
                  min-width="80">
            <template slot-scope="scope">
              {{'--'}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--label="合格率排名"-->
          <!--min-width="80">-->
          <!--<template slot-scope="scope">-->
          <!--{{scope.row[subjectNameList[0]].passRank}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="center" v-for="_it in subjectNameList" :key="_it.id" :label="_it">
            <el-table-column :show-overflow-tooltip="true" width="90" align="center" label="人平分">
              <template slot-scope="scope">
                {{scope.row[_it].personAverage ? scope.row[_it].personAverage : '--'}}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" min-width="80" align="center" label="及格率%">
              <template slot-scope="scope">
                {{scope.row[_it].passRate ? scope.row[_it].passRate : '--'}}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" min-width="80" align="center" label="优秀率%">
              <template slot-scope="scope">
                {{scope.row[_it].excellentRate ? scope.row[_it].excellentRate : '--'}}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" min-width="80" align="center" label="任课老师">
              <template slot-scope="scope">
                {{scope.row[_it].teacherName ? scope.row[_it].teacherName : '--'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
                  align="center"
                  :show-overflow-tooltip="true"
                  label="人平总分"
                  min-width="100">
            <template slot-scope="scope">
              {{scope.row[subjectNameList[0]].totalScore ? scope.row[subjectNameList[0]].totalScore : '--'}}
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="合格率%"
                  :show-overflow-tooltip="true"
                  min-width="100">
            <template slot-scope="scope">
              {{scope.row[subjectNameList[0]].allPass ? scope.row[subjectNameList[0]].allPass : '--'}}
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="优秀率%"
                  :show-overflow-tooltip="true"
                  min-width="100">
            <template slot-scope="scope">
              {{scope.row[subjectNameList[0]].allExcellent ? scope.row[subjectNameList[0]].allExcellent : '--'}}
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="班主任"
                  :show-overflow-tooltip="true"
                  min-width="80">
            <template slot-scope="scope">
              {{'--'}}
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
        <template v-if="pagination.pageTotal > 10">
          <div class="pagination-comp clearfix">
            <el-pagination
              background
              @size-change="onPageSizeChange"
              @current-change="onPageChange"
              :current-page.sync="pagination.pageNum"
              :page-size="pagination.pageSize"
              :page-sizes="[10, 20]"
              layout="total, prev, pager, next, sizes, jumper"
              :total="pagination.pageTotal">
            </el-pagination>
          </div>
        </template>
      </div>
    </div>
    <div class="layout-bottom">
      <LayoutFooter></LayoutFooter>
    </div>
  </div>
</template>
<script>
import LayoutHeader from '@/components/LayoutHeader';
import LayoutFooter from '@/components/LayoutFooter';
import { mapGetters } from 'vuex';
import { getScoreSchoolResults } from '../../store/api.js';
  export default {
    name: 'Layout',
    computed: {
      ...mapGetters([
        'collapse'
      ])
    },
    components: {
      LayoutHeader,
      LayoutFooter
    },
    data () {
      return {
        pagination: { // 分页
          pageTotal: 0,
          pageNum: 1,
          pageSize: 10,
          pages: 1
        },
        tableHeight: 'calc(100% - 100px)',
        tableData: [],
        loading: false,
        downloadUrl: '',
        // 表格数据
        subjectNameList: []
      }
    },
    mounted () {
      this.getTabelData();
      this.downloadUrl = JSON.parse(window.localStorage.getItem('previewDown')).fileUrl;
    },

    methods: {
      onPageSizeChange (size) {
        this.pagination.pageSize = size;
        this.getTabelData();
      },
      onPageChange (page) {
        this.pagination.pageNum = page;
        this.getTabelData();
      },
      indexMethod (index) {
        return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
      },
      switchData (data) {
        // this.tableData = [];
        this.loading = false;
        this.subjectNameList = [];
        if (data.length) {
          data[0].scoreStatisticsDTOList.forEach(y => {
            this.subjectNameList.push(y.subjectName);
          })
        }
        data.forEach(x => {
          x.scoreStatisticsDTOList.forEach(y => {
            x[y.subjectName] = y;
          })
        })
        this.tableData = data;
        console.log(this.tableData)
      },
      getTabelData () {
        this.loading = true;
        let params = {
          'where.yearUid': this.$route.query.yearUid,
          'where.schoolUid': this.$route.query.schoolUid,
          'where.gradeId': this.$route.query.gradeId,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }
        getScoreSchoolResults(params).then(res => {
          if (res) {
            this.switchData(res.data.list);
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.pageTotal = res.data.total;
            this.pagination.pageSize = res.data.pageSize;
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .layout {
    width: 100%;
    height: 100%;
    min-width: 1360px;
    .layout-top {
      height: 60px;
    }
    .layout-bottom {
      height: 40px;
    }
    .sp-box{
      height: calc(100% - 100px);
      padding: 0 20px;
      overflow: auto;
      .sp-box-main{
        >p{
          width: 100%;
          height: 60px;
          line-height: 60px;
          color: #333333;
          font-weight: bold;
          text-align: center;
          font-size: 16px;
          >a{
            float: right;
            display: block;
            width: 80px;
            color: #FFFFFF;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #409eff;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            font-size: 14px;
            margin-top: 20px;
            margin-right: 20px;
            i{
              font-size: 12px;
            }
            &:hover{
              background: #6FA8FF;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .score-table {
    &:before {
      height: 0px;
    }
    &:after{
      height: 0px;
    }
    .el-table__header-wrapper{
      border-left: 1px solid #E8E8E8;
    }
    .el-table__body-wrapper{
      min-height: 70px;
      .el-table__body{
        border-left: 1px solid #E8E8E8;
      }
    }
    .el-table__header {
      th {
        padding: 0;
        background: #F2F2F2!important;
        border-color: #E8E8E8;
      }
    }
  }
</style>