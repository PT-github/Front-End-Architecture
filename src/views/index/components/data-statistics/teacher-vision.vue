<template>
  <div class="teacher-vision">
    <div class="teacher-info-content">
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
            @change="onSearch"
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
        <div class="el-form-right fr">
          <el-form-item>
            <el-button class="icon-button" @click="onExport" :loading="isExportLoading"><i class="iconfont icon-daochu"></i><span class="mg-l">导出</span></el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="icon-button" @click="printTeacherVisions" :loading="showPrint"><i class="iconfont icon-dayin"></i><span class="mg-l">打印</span></el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table v-loading="loading" key='flow-firstTable' :data="tableData.list" show-summary :summary-method="getSummaries" sum-text="总计" style="width: 100%" class="table-comp summer-table">
        <el-table-column width="120px" :show-overflow-tooltip="true" align="center" prop="teacherName" label="姓名" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="totalAdjustNums" label="申请调课课时" >
          <template slot-scope="scope">
            <span v-if="scope.row.totalAdjustNums > 0" @click="onDetail(scope.row)" class="cell-detail">{{scope.row.totalAdjustNums}}</span>
            <span v-else class="cell-detail">{{scope.row.totalAdjustNums}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stayAdjustNums" label="待批课时"></el-table-column>
        <el-table-column align="center" prop="rejectAdjustNums" label="驳回课时"></el-table-column>
        <el-table-column width="180px" align="center" prop="alreadyAdjustNums" label="实调课时">
          <template slot-scope="scope">
            <span>{{scope.row.alreadyAdjustNums}}</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loading"></div>
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
    <el-dialog
      class="dialog-comp dialog-teacher-vision"
      :title="AEIntitle"
      width="920px"
      :visible.sync="seeDetailDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table vkey='flow-secondTable' :data="detailData.list" v-loading="loadingTeacher" border style="width: 100%" class="table-comp">
        <el-table-column :show-overflow-tooltip="true" align="center" prop="startTime" label="日期" >
          <template slot-scope="scope">
            <span>{{scope.row.startTime | moment('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="className" label="调课班级" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="initiativeWeekDay" label="需调课时">
          <template slot-scope="scope">
            <p class="top-p">周{{scope.row.initiativeWeekDay}}第{{scope.row.initiativeClassIndex}}节课</p>
            <p class="top-b">{{scope.row.initiativeTeacherName}}（{{scope.row.initiativeSubjectName}}）</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="passiveWeekDay" label="被调课时">
          <template slot-scope="scope">
            <p class="top-p">周{{scope.row.passiveWeekDay}}第{{scope.row.passiveClassIndex}}节课</p>
            <p class="top-b">{{scope.row.passiveTeacherName}}（{{scope.row.passiveSubjectName}}）</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="applyTime" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="approvalTime" label="最后审批时间">
          <template slot-scope="scope">
            <span>{{scope.row.approvalTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="status" label="审批状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">审批中</span>
            <span class="class-pending" v-if="scope.row.status === 2">通过</span>
            <span class="class-return" v-if="scope.row.status === 3">驳回</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loadingTeacher"></div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <div v-if="detailData.total > 0" class="pagination-comp pagination-dialog-th clearfix">
        <el-pagination
          background
          @size-change="handleSizeChangeDialog"
          @current-change="handleCurrentChangeDialog"
          :current-page="currentPageDialog"
          :page-sizes="[3, 6, 9]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailData.total">
        </el-pagination>
      </div>
    </el-dialog>
    <printTeacherVision ref="printTeacherVisioncom" :printname="isshowPrint"></printTeacherVision>
  </div>
</template>

<script>
import printTeacherVision from '../print/print-teacher-vision';
import { mapGetters } from 'vuex'
import { getYearTermList, getAdjustSizeList, getAdjustSizeDetail, exportCourseStatistics, deleteDownLoadFile, getTerm } from '@/views/index/store/api'
import { formatDate, autoDownloadUrl } from '@/utils/index'
export default {
  name: 'TeacherVision',
  components: {
    printTeacherVision
  },
  data () {
    return {
      isshowPrint: false,
      showPrint: false,
      timer: null,
      isExportLoading: false,
      tableHeight: 'calc(100% - 150px)',
      formInline: {
        schoolId: 9, // 学校ID
        schoolYearId: '',
        termId: '',
        teacherName: '',
        time: []
      },
      tableData: {},
      detailData: {},
      seeDetail: {cenList: []},
      seeDetailDialog: false,
      AEIntitle: null,
      yearTermList: [],
      loading: true,
      loadingTeacher: true,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        order: null,
        orderBy: null
      },
      currentPage: 1,
      paginationDialog: {
        pageNum: 1,
        pageSize: 3,
        order: null,
        orderBy: null
      },
      currentPageDialog: 1,
      detailObj: {},
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
          this.getAdjustSize().then(() => {}).catch(() => {
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
    printTeacherVisions () {
      this.isshowPrint = true
      this.$refs['printTeacherVisioncom'].print()
    },
    // 导出
    onExport () {
      let _this = this;
      const data = {
        'where.termId': this.formInline.termId,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.teacherName': this.formInline.teacherName,
        'where.viewType': 1
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
    getAdjustSize () {
      let obj = Object.assign({}, this.pagination, {
        'where.termId': this.formInline.termId ? this.formInline.termId : null,
        // 'where.termId': 32,
        'where.viewType': 1,
        'where.teacherName': this.formInline.teacherName ? this.formInline.teacherName.replace(/\s+/g,"") : null,
        'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
        'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null,
        'where.source': 'pc'
      })
      return getAdjustSizeList(obj).then(res => {
        if (res.data) {
          this.tableData = res.data
          this.loading = false
        }
      })
      .catch(() => { this.loading = false })
    },
    onSearch () {
      this.getAdjustSize()
    },
    getSummaries() {
      let sums = ["总计", 0, 0, 0, 0];
      this.tableData.list && this.tableData.list.length > 0 ? this.tableData.list.forEach(item => {
        sums[1] += item.totalAdjustNums ? item.totalAdjustNums : 0
        sums[2] += item.stayAdjustNums ? item.stayAdjustNums : 0
        sums[3] += item.rejectAdjustNums ? item.rejectAdjustNums : 0
        sums[4] += item.alreadyAdjustNums ? item.alreadyAdjustNums : 0
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
      this.getAdjustSize()
    },
    /**
     * 初始化学年学期信息
     */
    getYearTerm () { // 获取学年学期数据
      // this.$_showLoading()
      return getYearTermList({schoolId: this.formInline.schoolId}).then(res => {
        if (res) {
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
      this.$nextTick(() => {
        this.detailObj = JSON.parse(JSON.stringify({}))
        this.detailObj = JSON.parse(JSON.stringify(obj))
        this.AEIntitle = `调课详情（${obj.teacherName}）`
        let o = Object.assign({}, this.paginationDialog, {
          'where.termId': this.formInline.termId ? this.formInline.termId : null,
          // 'where.termId': 32,
          'where.viewType': 1,
          'where.teacherId': obj.teacherId ? obj.teacherId : null,
          'where.startDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[0], 'yyyy-MM-dd') : null,
          'where.endDate': this.formInline.time && this.formInline.time.length > 0 ? formatDate(this.formInline.time[1], 'yyyy-MM-dd') : null
        })
        getAdjustSizeDetail(o).then(res => {
          if (res.data) {
            this.detailData = res.data
            this.seeDetailDialog = true
            this.loadingTeacher = false
          }
        })
        .catch(() => {
          this.loadingTeacher = false
        })
      })
    },
    /**
     * 每页显示条数改变
     */
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getAdjustSize().then(() => {})
    },
    /**
     * 当前页改变
     */
    handleCurrentChange(val) { 
      this.pagination.pageNum = val
      this.getAdjustSize().then(() => {})
    },
    /**
     * 弹框每页显示条数改变
     */
    handleSizeChangeDialog(val) {
      this.paginationDialog.pageSize = val
      this.onDetail(this.detailObj)
    },
    /**
     * 弹框当前页改变
     */
    handleCurrentChangeDialog(val) { 
      this.paginationDialog.pageNum = val
      this.onDetail(this.detailObj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.teacher-vision {
  height: 100%;
  .teacher-info-content {
    height: 100%;
    padding: 12px 20px 14px 20px;
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
  .dialog-teacher-vision {
    .top-p {
      color: $color-font2;
      font-size: 14px;
    }
    .top-b {
      color: $color-font4;
      font-size: 12px;
    }
    .class-pending {
      color: $statistics-color2;
    }
    .class-return {
      color: $statistics-color3;
    }
  }
}
</style>

<style lang="scss">
@import '@/assets/css/_variable.scss';
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
.dialog-teacher-vision {
  .el-table__header {
    th > .cell {
      font-weight: 400;
      color: #333;
    }
  }
  .el-dialog__body {
    padding: 15px 40px 30px 40px;
  }
}
.pagination-dialog-th {
  padding: 20px 0 0 0;
}
</style>
