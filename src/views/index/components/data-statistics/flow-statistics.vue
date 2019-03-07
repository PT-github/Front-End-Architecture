<template>
  <div class="flow-info">
    <s-title :title="'课量统计'"></s-title>
    <div style="width: calc(100% - 40px);height: 1px; background: #e8e8e8;margin: 0 auto 8px;"></div>
    <vue-scroll>
      <div class="flow-info-content">
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
              v-model="formInline.time"
              format="yyyy-MM-dd"
              type="daterange"
              @change="onSearch"
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
          <div class="el-form-right fr">
            <el-form-item>
              <el-button class="icon-button" @click="onExport" :loading="isExportLoading"><i class="iconfont icon-daochu"></i><span class="mg-l">导出</span></el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="icon-button" @click="printFlo" :loading="showPrint"><i class="iconfont icon-dayin"></i><span class="mg-l">打印</span></el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table v-loading="loading" key='flow-firstTable' :data="tableData.list" show-summary :summary-method="getSummaries" sum-text="总计" style="width: 100%" class="table-comp summer-table">
          <el-table-column width="120px" :show-overflow-tooltip="true" align="center" prop="name" label="姓名" ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="planSubjectNums" label="任教科目" >
            <template slot-scope="scope">
              <span v-if="scope.row.planSubjectNums > 0" @click="onDetail(scope.row)" class="cell-detail">{{scope.row.planSubjectNums}}</span>
              <span v-else class="cell-detail">{{scope.row.planSubjectNums}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="planClassSize" label="应上课时"></el-table-column>
          <el-table-column align="center" prop="actualClassSize" label="实上课时"></el-table-column>
          <el-table-column width="180px" align="center" prop="difference" label="调代课时">
            <template slot-scope="scope">
              <span>{{scope.row.difference}}</span>
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
      class="dialog-comp dialog-flow"
      :title="AEIntitle"
      width="600px"
      :visible.sync="seeDetailDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table vkey='flow-secondTable' v-loading="loadingT" :data="detailData" border style="width: 100%" class="table-comp">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="className" label="班级" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="subjectName" label="科目"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="classSize" label="应上课时">
          <template slot-scope="scope">
            <span>{{scope.row.classSize}}</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loadingT"></div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
        </template>
      </el-table>
    </el-dialog>
    <printFlowStatistics ref="printFlowStatisticsComp"></printFlowStatistics>
  </div>
</template>

<script>
import printFlowStatistics from '../print/print-flow-statistics';
import { mapGetters } from 'vuex'
import { getYearTermList, getClassSizeList, getClassSizeDetail, exportCourseStatistics, deleteDownLoadFile, getTerm } from '@/views/index/store/api'
import { formatDate, autoDownloadUrl } from '@/utils/index'
export default {
  name: 'FlowStatistics',
  components: {
    printFlowStatistics
  },
  data () {
    return {
      showPrint:false,
      timer: null,
      isExportLoading: false,
      loading: true,
      loadingT: true,
      formInline: {
        schoolId: 9, // 学校ID
        schoolYearId: '',
        termId: '',
        teacherName: '',
        time: []
      },
      tableData: {},
      detailData: [],
      seeDetailDialog: false,
      AEIntitle: null,
      yearTermList: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        order: null,
        orderBy: null
      },
      currentPage: 1,
      termList: []
    }
  },
  mounted () {
    // this.$_showLoading()
    this.formInline.schoolId = this.$store.state.user.currentSchool ? this.$store.state.user.currentSchool.uid : null
    getTerm({schoolId: this.formInline.schoolId}).then(res => {
      this.termList = res.data;
      this.getYearTerm().then(() => {
        this.$_hideLoading()
        if (this.yearTermList.length > 0) {
          this.getClassSize().then(() => {
          }).catch(() => {
            this.$_hideLoading()
            this.loading = false
          })
        } else {
          this.$message.error('请维护年级信息')
          this.loading = false
        }
      })
      .catch(() => { this.$_hideLoading() })
    })
    
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  methods: {
    // 导出
    onExport () {
      let _this = this;
      const data = {
        'where.termId': this.formInline.termId,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.teacherName': this.formInline.teacherName,
        'where.viewType': 3
      };
      _this.isExportLoading = true;
      exportCourseStatistics(data)
        .then(res => {
          if (res.code === '00000000') {
            autoDownloadUrl(res.data.fileUrl);
            const filePath = res.data.filePath;
            _this.isExportLoading = false;
            if (filePath) {
              // 下载成功后删除动态模板
                _this.timer = setTimeout(() => {
                deleteDownLoadFile(filePath)
                .then(res => {
                  console.log('res', res)
                });
              }, 30000)
            }
          }
        })
        .catch(() => {
          _this.isExportLoading = false;
        })
    },
    printFlo () {
      this.$refs['printFlowStatisticsComp'].print()
    },
    getClassSize () {
      let obj = Object.assign({}, this.pagination, {
        'where.termId': this.formInline.termId ? this.formInline.termId : null,
        // 'where.termId': 32,
        'where.teacherName': this.formInline.teacherName ? this.formInline.teacherName.replace(/\s+/g,"") : null,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.source': 'pc'
      })
      return getClassSizeList(obj).then(res => {
        if (res.data) {
          this.tableData = res.data
          this.loading = false
        } else {
          this.loading = false
        }
      })
      .catch(() => { this.loading = false })
    },
    onSearch () {
      this.getClassSize()
    },
    getSummaries() {
      let sums = ["总计", null, 0, 0, 0];
      this.tableData.list && this.tableData.list.length > 0 ? this.tableData.list.forEach(item => {
        sums[2] += item.planClassSize ? item.planClassSize : 0
        sums[3] += item.actualClassSize ? item.actualClassSize : 0
        sums[4] += item.difference ? item.difference : 0
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
      this.getClassSize()
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
                let ac = new Date().getFullYear() === new Date(parseInt(myobj.upStartTime)).getFullYear() && new Date().getMonth() === new Date(parseInt(myobj.upStartTime)).getMonth() && new Date().getDate() === new Date(parseInt(myobj.upStartTime)).getDate()
                if (new Date().getTime() < parseInt(myobj.upStartTime) || ac) {
                  this.$set(this.formInline.time, 1, formatDate(myobj.upStartTime, 'yyyy-MM-dd'))
                } else {
                  this.$set(this.formInline.time, 1, formatDate(new Date().getTime(), 'yyyy-MM-dd'))
                }
              }
              if (item.schoolTerm === 2) {
                this.$set(this.formInline.time, 0, formatDate(myobj.startTime, 'yyyy-MM-dd'))
                // this.$set(this.formInline.time, 1, formatDate(myobj.endTime, 'yyyy-MM-dd'))
                let ac = new Date().getFullYear() === new Date(parseInt(myobj.startTime)).getFullYear() && new Date().getMonth() === new Date(parseInt(myobj.startTime)).getMonth() && new Date().getDate() === new Date(parseInt(myobj.startTime)).getDate()
                if (new Date().getTime() < parseInt(myobj.startTime) || ac) {
                  this.$set(this.formInline.time, 1, formatDate(myobj.startTime, 'yyyy-MM-dd'))
                } else {
                  this.$set(this.formInline.time, 1, formatDate(new Date().getTime(), 'yyyy-MM-dd'))
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
              let ac = new Date().getFullYear() === new Date(parseInt(this.termList[0].upStartTime)).getFullYear() && new Date().getMonth() === new Date(parseInt(this.termList[0].upStartTime)).getMonth() && new Date().getDate() === new Date(parseInt(this.termList[0].upStartTime)).getDate()
              if (new Date().getTime() < parseInt(this.termList[0].upStartTime) || ac) {
                this.$set(this.formInline.time, 1, formatDate(this.termList[0].upStartTime, 'yyyy-MM-dd'))
              } else {
                this.$set(this.formInline.time, 1, formatDate(new Date().getTime(), 'yyyy-MM-dd'))
              }
            }
            if (res.data[0].schoolTerm === 2) {
              this.$set(this.formInline.time, 0, formatDate(this.termList[0].startTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(this.termList[0].endTime, 'yyyy-MM-dd'))
              // this.$set(this.formInline.time, 1, formatDate(new Date().getTime() - 86400000, 'yyyy-MM-dd'))
              let ac = new Date().getFullYear() === new Date(parseInt(this.termList[0].startTime)).getFullYear() && new Date().getMonth() === new Date(parseInt(this.termList[0].startTime)).getMonth() && new Date().getDate() === new Date(parseInt(this.termList[0].startTime)).getDate()
              if (new Date().getTime() < parseInt(this.termList[0].startTime) || ac) {
                this.$set(this.formInline.time, 1, formatDate(this.termList[0].startTime, 'yyyy-MM-dd'))
              } else {
                this.$set(this.formInline.time, 1, formatDate(new Date().getTime(), 'yyyy-MM-dd'))
              }
            }
          }
        } else {
          this.loading = false
        }
      })
      .catch(() => {
        this.loading = false
      })
    },
    onDetail (obj) {
      let o = {
        termId: this.formInline.termId ? this.formInline.termId : null,
        // termId: 32,
        teacherId: obj.teacherId ? obj.teacherId : null,
        startDate: this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        endDate: this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null
      }
      this.AEIntitle = `计划科目详情（${obj.name}）`
      getClassSizeDetail(o).then(res => {
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
    /**
     * 每页显示条数改变
     */
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getClassSize()
    },
    /**
     * 当前页改变
     */
    handleCurrentChange(val) { 
      this.pagination.pageNum = val
      this.getClassSize()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.flow-info {
  height: 100%;
  .flow-info-content {
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
</style>

<style lang="scss">
@import '@/assets/css/_variable.scss';
.flow-info {
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
.dialog-flow {
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
</style>
