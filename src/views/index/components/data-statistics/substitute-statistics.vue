<template>
  <div class="substitute-info">
    <s-title :title="'代课统计'"></s-title>
    <div style="width: calc(100% - 40px);height: 1px; background: #e8e8e8;margin: 0 auto 8px;"></div>
    <vue-scroll>
      <div class="substitute-info-content">
        <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline statistics-header-label clearfix">
          <el-form-item label="学年学期:">
            <el-select v-model="formInline.termId" placeholder="请选择学年" @change="onChangeYear">
              <template v-if="yearTermList && yearTermList.length > 0">
                <el-option v-for="item in yearTermList" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="时段:">
            <el-date-picker
              @change="onSearch"
              v-model="formInline.time"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">er
            </el-date-picker>
          </el-form-item>
          <el-form-item label="教师姓名:">
            <el-input v-model="formInline.teacherName" placeholder="请输入教师姓名"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="onSearch" class="icon-button">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" key='flow-firstTable' :data="tableData.list" show-summary :summary-method="getSummaries" sum-text="总计" style="width: 100%" class="table-comp summer-table">
          <el-table-column width="120px" :show-overflow-tooltip="true" align="center" prop="teacherName" label="姓名" ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="leaveNums" label="请假课时" >
            <template slot-scope="scope">
              <span v-if="scope.row.leaveNums > 0" @click="onDetail(scope.row)" class="cell-detail">{{scope.row.leaveNums}}</span>
              <span v-else class="cell-detail">{{scope.row.leaveNums}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="exchangeNums" label="代课课时" >
            <template slot-scope="scope">
              <span v-if="scope.row.exchangeNums > 0" @click="onDetailT(scope.row)" class="cell-detail">{{scope.row.exchangeNums}}</span>
              <span v-else class="cell-detail">{{scope.row.exchangeNums}}</span>
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
        <div v-if="tableData.total > 0" class="pagination-comp clearfix">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total">
          </el-pagination>
        </div>
      </div>
    </vue-scroll>
    <el-dialog
      class="dialog-comp dialog-substitute"
      title="请假课时信息"
      width="900px"
      :visible.sync="seeDetailDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table vkey='flow-secondTable' :data="detailData.list" v-loading="loadingT" key='dialog-one-firstTable' border style="width: 100%" class="table-comp">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="holidayRange" label="请假期限" >
          <template slot-scope="scope">
            <p>开始：{{scope.row.startTime}}</p>
            <p v-if="!scope.row.isEndClass">结束：{{scope.row.endTime}}</p>
            <p v-if="scope.row.isEndClass">结束：学期末</p>
          </template>
        </el-table-column>
        <el-table-column width="100px" :show-overflow-tooltip="true" align="center" prop="leaveTeacherName" label="请假人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="agentInfosList" label="代课信息" >
          <template v-if="scope.row.agentInfosList && scope.row.agentInfosList.length > 0" slot-scope="scope">
            <div style="padding-left: 10px;" v-for="(item, index) in scope.row.agentInfosList" :key="index + '_classinfo'">
              <p style="text-align: left;">{{item.className}}{{item.subjectName}}（{{item.teacherName}}）</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="agentInfosList" label="实际已请假课时/预计请假课时">
          <template v-if="scope.row.agentInfosList && scope.row.agentInfosList.length > 0" slot-scope="scope">
            <div v-for="(item, index) in scope.row.agentInfosList" :key="index + '_begRange'">
              <p>{{item.actualNums}}/<span class="gray-num">{{item.totalNums}}</span></p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-comp pagination-dialog-th clearfix">
        <el-pagination
          background
          @size-change="handleSizeChangeDialogO"
          @current-change="handleCurrentChangeDialogO"
          :current-page="currentPageDialogO"
          :page-sizes="[3, 6, 9]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailData.total">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog-comp dialog-substitute"
      title="代课课时信息"
      width="900px"
      :visible.sync="seeDetailDialogWho"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table vkey='flow-secondTable' :data="detailDataT.list" v-loading="loadingD" key='dialog-one-firstTable' border style="width: 100%" class="table-comp">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="holidayRange" label="代课期限" >
          <template slot-scope="scope">
            <p>开始：{{scope.row.startTime}}</p>
            <p v-if="!scope.row.isEndClass">结束：{{scope.row.endTime}}</p>
            <p v-if="scope.row.isEndClass">结束：学期末</p>
          </template>
        </el-table-column>
        <el-table-column width="100px" :show-overflow-tooltip="true" align="center" prop="leaveTeacherName" label="请假人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="agentInfosList" label="代课信息" >
          <template v-if="scope.row.agentInfosList && scope.row.agentInfosList.length > 0" slot-scope="scope">
            <div style="padding-left: 10px;" v-for="(item, index) in scope.row.agentInfosList" :key="index + '_classinfo'">
              <p style="text-align: left;">{{item.className}}{{item.subjectName}}（{{item.teacherName}}）</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="agentInfosList" label="实际已代课课时/预计代课课时">
         <template v-if="scope.row.agentInfosList && scope.row.agentInfosList.length > 0" slot-scope="scope">
            <div v-for="(item, index) in scope.row.agentInfosList" :key="index + '_begRange'">
              <p>{{item.actualNums}}/<span class="gray-num">{{item.totalNums}}</span></p>
            </div>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loadingD"></div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <div class="pagination-comp pagination-dialog-th clearfix">
        <el-pagination
          background
          @size-change="handleSizeChangeDialogT"
          @current-change="handleCurrentChangeDialogT"
          :current-page="currentPageDialogT"
          :page-sizes="[3, 6, 9]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailDataT.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getYearTermList, getAgentSizeList, getAgentSizeDetail, getTerm } from '@/views/index/store/api'
import { formatDate } from '@/utils/index'
export default {
  name: 'SubstituteStatistics',
  data () {
    return {
      formInline: {
        schoolId: 9, // 学校ID 
        schoolYearId: '',
        termId: '',
        teacherName: '',
        time: []
      },
      tableData: {},
      detailData: {},
      detailDataT: {},
      seeDetailDialog: false,
      seeDetailDialogWho: false,
      yearTermList: [],
      loading: true,
      loadingT: true,
      loadingD: true,
      detailObj1: {},
      detailObj2: {},
      pagination: {
        pageNum: 1,
        pageSize: 10,
        order: null,
        orderBy: null
      },
      currentPage: 1,
      paginationDialogO: {
        pageNum: 1,
        pageSize: 3,
        order: null,
        orderBy: null
      },
      currentPageDialogO: 1,
      paginationDialogT: {
        pageNum: 1,
        pageSize: 3,
        order: null,
        orderBy: null
      },
      currentPageDialogT: 1,
      termList: []
    }
  },
  created () {
    // this.$_showLoading()
    this.formInline.schoolId = this.$store.state.user.currentSchool ? this.$store.state.user.currentSchool.uid : null
    getTerm({schoolId: this.formInline.schoolId}).then(res => {
      this.termList = res.data;
      this.getYearTerm().then(() => {
        this.$_hideLoading()
        if (this.yearTermList.length > 0) {
          this.getAgentSize().then(() => {}).catch(() => {
            this.$_hideLoading()
            this.loading = false
          })
        } else {
          this.$message.error('请维护年级信息')
          this.loading = false
        }
      })
      .catch(() => {
        this.$_hideLoading()
        this.loading = false;
      })
    })
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  methods: {
    getAgentSize () {
      let obj = Object.assign({}, this.pagination, {
        'where.termId': this.formInline.termId ? this.formInline.termId : null,
        // 'where.termId': 32,
        'where.teacherName': this.formInline.teacherName ? this.formInline.teacherName.replace(/\s+/g,"") : null,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.source': 'pc'
      })
      return getAgentSizeList(obj).then(res => {
        if (res.data) {
          this.tableData = res.data
          this.loading = false
        }
      })
      .catch(() => { this.loading = false })
    },
    onSearch () {
      this.getAgentSize()
    },
    getSummaries() {
      let sums = ["总计", 0, 0];
      this.tableData.list && this.tableData.list.length > 0 ? this.tableData.list.forEach(item => {
        sums[1] += item.leaveNums ? item.leaveNums : 0
        sums[2] += item.exchangeNums ? item.exchangeNums : 0
      }) : null
      return sums;
    },
    /**
     * 学年学期信息改变
     */
    onChangeYear(value) {
      console.log(value);
      // this.yearAfter = value.yearAfter;
      // this.getTermData();
      this.yearTermList.forEach(item => {
        if (item.uid === value) {
          console.log(this.termList.find(x => {return item.name.indexOf(x.schoolYear) !== -1}))
          let myobj = this.termList.find(x => {return item.name.indexOf(x.schoolYear) !== -1})
          this.formInline.schoolYearId =  item.schoolYearid
          this.formInline.termId = item.uid
          if (item.schoolTerm === 1) {
            this.$set(this.formInline.time, 0, formatDate(myobj.upStartTime, 'yyyy-MM-dd'))
            this.$set(this.formInline.time, 1, formatDate(myobj.upEndTime, 'yyyy-MM-dd'))
          }
          if (item.schoolTerm === 2) {
            this.$set(this.formInline.time, 0, formatDate(myobj.startTime, 'yyyy-MM-dd'))
            this.$set(this.formInline.time, 1, formatDate(myobj.endTime, 'yyyy-MM-dd'))
          }
        }
      })
      this.getAgentSize()
    },
    /**
     * 初始化学年学期信息
     */
    getYearTerm () { // 获取学年学期数据
      // this.$_showLoading()
      return getYearTermList({schoolId: this.formInline.schoolId}).then(res => {
        if (res.data.length > 0) {
          this.yearTermList = res.data
          res.data.forEach(item => {
            if (item.isSelected) {
              console.log(this.termList.find(x => {return item.name.indexOf(x.schoolYear) !== -1}))
              let myobj = this.termList.find(x => {return item.name.indexOf(x.schoolYear) !== -1})
              this.formInline.schoolYearId =  item.schoolYearid
              this.formInline.termId = item.uid
              if (item.schoolTerm === 1) {
                this.$set(this.formInline.time, 0, formatDate(myobj.upStartTime, 'yyyy-MM-dd'))
                // this.$set(this.formInline.time, 1, formatDate(myobj.upEndTime, 'yyyy-MM-dd'))
                // this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
                if (new Date().getTime() < parseInt(myobj.upStartTime)) {
                  this.$set(this.formInline.time, 1, formatDate(myobj.upStartTime, 'yyyy-MM-dd'))
                } else {
                  this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
                }
              }
              if (item.schoolTerm === 2) {
                this.$set(this.formInline.time, 0, formatDate(myobj.startTime, 'yyyy-MM-dd'))
                // this.$set(this.formInline.time, 1, formatDate(myobj.endTime, 'yyyy-MM-dd'))
                // this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
                if (new Date().getTime() < parseInt(myobj.startTime)) {
                  this.$set(this.formInline.time, 1, formatDate(myobj.startTime, 'yyyy-MM-dd'))
                } else {
                  this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
                }
              }
            }
          })
          if (!this.formInline.schoolYearId && !this.formInline.termId) {
            this.formInline.schoolYearId = res.data && res.data.length > 0 ? res.data[0].schoolYearid : null
            this.formInline.termId = res.data && res.data.length > 0 ? res.data[0].uid : null
            if (res.data[0].schoolTerm === 1) {
              this.$set(this.formInline.time, 0, formatDate(this.termList[0].upStartTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(this.termList[0].upEndTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
              if (new Date().getTime() < parseInt(this.termList[0].upStartTime)) {
                this.$set(this.formInline.time, 1, formatDate(this.termList[0].upStartTime, 'yyyy-MM-dd'))
              } else {
                this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
              }
            }
            if (res.data[0].schoolTerm === 2) {
              this.$set(this.formInline.time, 0, formatDate(this.termList[0].startTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(this.termList[0].endTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
              if (new Date().getTime() < parseInt(this.termList[0].startTime)) {
                this.$set(this.formInline.time, 1, formatDate(this.termList[0].startTime, 'yyyy-MM-dd'))
              } else {
                this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
              }
            }
          }
        } else {
          this.loading = false;
        }
      })
      .catch(() => {
        this.loading = false;
      })
    },
    onDetail (obj) {
      this.detailObj1 = JSON.parse(JSON.stringify({}))
      this.detailObj1 = JSON.parse(JSON.stringify(obj))
      let o = Object.assign({}, this.paginationDialogO, {
        'where.termId': this.formInline.termId ? this.formInline.termId : null,
        // 'where.termId': 32,
        'where.teacherId': obj.teacherId ? obj.teacherId : null,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.viewType': 1
      })
      getAgentSizeDetail(o).then(res => {
        if (res.data) {
          this.detailData = res.data
          this.seeDetailDialog = true
          this.loadingT = false
        }
      })
      .catch(() => {
        this.loadingT = false
      })
    },
    onDetailT (obj) {
      this.detailObj2 = JSON.parse(JSON.stringify({}))
      this.detailObj2 = JSON.parse(JSON.stringify(obj))
      let o = Object.assign({}, this.paginationDialogT, {
        'where.termId': this.formInline.termId ? this.formInline.termId : null,
        // 'where.termId': 32,
        'where.teacherId': obj.teacherId ? obj.teacherId : null,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.viewType': 2
      })
      getAgentSizeDetail(o).then(res => {
        if (res.data) {
          this.detailDataT = res.data
          this.seeDetailDialogWho = true
          this.loadingD = false
        }
      })
      .catch(() => {
        this.loadingD = false
      })
    },
    /**
     * 每页显示条数改变
     */
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getAgentSize().then(() => {})
    },
    /**
     * 当前页改变
     */
    handleCurrentChange(val) { 
      this.pagination.pageNum = val
      this.getAgentSize().then(() => {})
    },
    /**
     * 弹框1每页显示条数改变
     */
    handleSizeChangeDialogO(val) {
      this.paginationDialogO.pageSize = val
      this.onDetail(this.detailObj1)
    },
    /**
     * 弹框1当前页改变
     */
    handleCurrentChangeDialogO(val) { 
      this.paginationDialogO.pageNum = val
      this.onDetail(this.detailObj1)
    },
    /**
     * 弹框2每页显示条数改变
     */
    handleSizeChangeDialogT(val) {
      this.paginationDialogT.pageSize = val
      this.onDetailT(this.detailObj2)
    },
    /**
     * 弹框2当前页改变
     */
    handleCurrentChangeDialogT(val) { 
      this.paginationDialogT.pageNum = val
      this.onDetailT(this.detailObj2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.substitute-info {
  height: 100%;
  .substitute-info-content {
    height: 100%;
    padding: 0 20px 14px 20px;
    .demo-form-inline {
      .el-select,
      .el-input {
        width: 185px;
      }
    }
  }
  .cell-detail {
    display: inline-block;
    width: 100%;
    color: $statistics-color1;
    text-decoration: underline;
    cursor: pointer;
  }
}
.dialog-substitute {
  .gray-num {
    color: $color-font4;
  }
}
</style>

<style lang="scss">
@import '@/assets/css/_variable.scss';
.substitute-info {
  .__vuescroll {
    height: calc(100% - 50px) !important;
  }
  .__view {
    width: 100% !important;
  }
}
.statistics-header-label {
  .el-form-item__label {
    color: $color-font1;
  }
  .el-date-editor {
    width: 250px;
    .el-range-separator {
      width: 10%;
    }
  }
}
.summer-table {
  .el-table__footer {
    color: $color-font2;
    font-weight:600;
  }
}
.dialog-substitute {
  .el-table__header {
    th > .cell {
      font-weight: 400;
      color: #333;
    }
  }
  .el-table__header {
    th > .cell {
      font-weight: 400;
      color: $color-font1;
    }
  }
  .el-dialog__body {
    padding: 20px 40px 30px 40px;
  }
}
.pagination-dialog-th {
  padding: 20px 0 0 0;
}
</style>
