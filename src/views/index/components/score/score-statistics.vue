<template>
  <div class="ss-main">
    <s-title :title="'成绩统计'" :showBack="false"></s-title>
    <div class="ss-box">
      <div class="ss-tab">
        <div class="ss-tab-main">
          <span :class="{'active': curTab === 0}" @click="curTab = 0">年级视角</span>
          <span :class="{'active': curTab === 1}" @click="curTab = 1">班级视角</span>
          <span :class="{'active': curTab === 2}" @click="curTab = 2">学生视角</span>
        </div>
        <div class="ss-tab-operation" @click="operationDialog = true">转换操作指南</div>
      </div>
      <div class="ss-search">
        <!--年级视角-->
        <div v-show="curTab === 0">
          <div class="ss-search-item">
            学年学期：
            <el-select  style="width: 170px;"  @change="selectYear"  size="small" v-model="searchData.curYear" placeholder="请选择">
              <el-option
                v-for="item in yearList"
                :key="item.uid"
                :label="item.cname"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            年级：
            <el-select style="width: 100px;" size="small" v-model="searchData.curGrader" placeholder="请选择">
              <el-option
                v-for="item in searchData.graderList"
                :key="item.uid"
                :label="item.gradeName"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--班级视角-->
        <div v-show="curTab === 1">
          <div class="ss-search-item">
            学年学期：
            <el-select  style="width: 170px;"  @change="selectYear1"  size="small" v-model="searchData1.curYear" placeholder="请选择">
              <el-option
                v-for="item in yearList"
                :key="item.uid"
                :label="item.cname"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            年级：
            <el-select style="width: 100px;" @change="selectGrade" size="small" v-model="searchData1.curGrader" placeholder="请选择">
              <el-option
                v-for="item in searchData1.graderList"
                :key="item.uid"
                :label="item.gradeName"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            班级：
            <el-select  style="width: 100px;"  size="small" v-model="searchData1.curClass" placeholder="请选择">
              <el-option
              :value="null"
              label="全部">
              </el-option>
              <el-option
                v-for="item in searchData1.classList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--学生视角-->
        <div v-show="curTab === 2">
          <div class="ss-search-item">
            学年学期：
            <el-select  style="width: 170px;"  @change="selectYear2"  size="small" v-model="searchData2.curYear" placeholder="请选择">
              <el-option
                v-for="item in yearList"
                :key="item.uid"
                :label="item.cname"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            年级：
            <el-select style="width: 100px;" @change="selectGrade2" size="small" v-model="searchData2.curGrader" placeholder="请选择">
              <el-option
                v-for="item in searchData2.graderList"
                :key="item.uid"
                :label="item.gradeName"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            班级：
            <el-select  style="width: 100px;"  size="small" v-model="searchData2.curClass" placeholder="请选择">
              <el-option
                :value="null"
                label="全部">
              </el-option>
              <el-option
                v-for="item in searchData2.classList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="ss-search-item">
            姓名：
            <el-input v-model="searchData2.name"  style="width: 100px;"  size="small"></el-input>
          </div>
        </div>
        <div class="ss-search-item">
          <el-button :disabled="!searchData.curGrader"  @click="getScoreList(true)" size="small" icon="el-icon-search" class="icon-button">查询</el-button>
        </div>
        <div class="ss-search-item"  style="float: right;">
          <el-button @click="showSwitch" size="small" type="primary">转换</el-button>
        </div>
        <div class="ss-search-item" style="float: right;">
          <el-button @click="showImport"  size="small" class="icon-button"><i class="iconfont icon-daoru"></i><span class="mg-l">导入</span></el-button>
        </div>
      </div>
      <!--tabel1-->
      <el-table v-show="curTab === 0" v-loading="loading" :key="23" :data="tableData1" class="table-comp score-table">
        <el-table-column
          type="index"
          align="center"
          :index="indexMethod"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="className"
          align="center"
          label="年级"
          min-width="80">
          <template slot-scope="scope">
          {{scope.row.className ? scope.row.className : '--'}}
        </template>
        </el-table-column>
        <el-table-column align="center" v-for="_item in subjectNameList" :key="_item.id" :label="_item">
          <el-table-column :show-overflow-tooltip="true" align="center" label="科人平">
            <template slot-scope="scope">
              {{scope.row[_item].personAverage ? scope.row[_item].personAverage : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="合格率%">
            <template slot-scope="scope">
              {{scope.row[_item].passRate ? scope.row[_item].passRate : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="优秀率%">
            <template slot-scope="scope">
              {{scope.row[_item].excellentRate ? scope.row[_item].excellentRate : '--'}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"
          prop="totalScore"
          label="班平总分"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.totalScore ? scope.row.totalScore : '--'}}
          </template>
        </el-table-column>
        <el-table-column align="center"  label="全科">
          <el-table-column :show-overflow-tooltip="true" align="center" label="合格率%" prop="allPass">
            <template slot-scope="scope">
              {{scope.row.allPass ? scope.row.allPass : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="优秀率%" prop="allExcellent">
            <template slot-scope="scope">
              {{scope.row.allExcellent ? scope.row.allExcellent : '--'}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="passRank"
          :show-overflow-tooltip="true"
          align="center"
          label="合格率排名"
          min-width="120">
          <template slot-scope="scope">
            {{scope.row.passRank ? scope.row.passRank : '--'}}
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
      <!--tabel2-->
      <el-table v-show="curTab === 1" v-loading="loading1" :key="22" :data="tableData2" class="table-comp score-table" style="width:100%">
        <el-table-column
          type="index"
          align="center"
          :index="indexMethod1"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="gradeName"
          align="center"
          :show-overflow-tooltip="true"
          label="年级"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.gradeName ? scope.row.gradeName : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="className"
          align="center"
          :show-overflow-tooltip="true"
          label="班级"
          min-width="100">
          <template slot-scope="scope">
            {{scope.row.className ? scope.row.className : '--'}}
          </template>
        </el-table-column>
        <el-table-column align="center" v-for="_item in subjectNameList1" :key="_item.id" :label="_item">
          <el-table-column :show-overflow-tooltip="true" align="center" label="科人平">
            <template slot-scope="scope">
              {{scope.row[_item].personAverage ? scope.row[_item].personAverage : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="科人平差">
            <template slot-scope="scope">
              {{scope.row[_item].personAdjustmen ? scope.row[_item].personAdjustmen : '--'}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="合格率%">
            <template slot-scope="scope">
              {{scope.row[_item].passRate ? scope.row[_item].passRate : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="110" align="center" label="合格率差%">
            <template slot-scope="scope">
              {{scope.row[_item].poorPass ? scope.row[_item].poorPass : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="优秀率%">
            <template slot-scope="scope">
              {{scope.row[_item].excellentRate ? scope.row[_item].excellentRate : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="110" align="center" label="优秀率差%">
            <template slot-scope="scope">
              {{scope.row[_item].poorExcellent ? scope.row[_item].poorExcellent : '--'}}
            </template>
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" label="任课老师">
            <template slot-scope="scope">
              {{scope.row[_item].teacherName ? scope.row[_item].teacherName : '--'}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="totalScore"
          align="center"
          :show-overflow-tooltip="true"
          min-width="80"
          label="班平总分">
          <template slot-scope="scope">
            {{scope.row.totalScore ? scope.row.totalScore : '--'}}
          </template>
        </el-table-column>
        <el-table-column align="center"  label="全科">
          <el-table-column :show-overflow-tooltip="true" align="center" label="合格率%" prop="allPass">
            <template slot-scope="scope">
              {{scope.row.allPass ? scope.row.allPass : '--'}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="优秀率%" prop="allExcellent">
            <template slot-scope="scope">
              {{scope.row.allExcellent ? scope.row.allExcellent : '--'}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="passRank"
          align="center"
          label="合格率排名"
          :show-overflow-tooltip="true"
          min-width="120">
          <template slot-scope="scope">
            {{scope.row.passRank ? scope.row.passRank : '--'}}
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loading1">
          </div>
          <div v-else>
            <img src="../../../../assets/img/no-data.png">
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <!--tabel3-->
      <el-table v-show="curTab === 2" border v-loading="loading2" :key="24" :data="tableData3"  class="table-comp ss-table">
        <el-table-column
          type="index"
          align="center"
          :index="indexMethod2"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="studentNumber"
          align="center"
          :show-overflow-tooltip="true"
          label="学号"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.studentNumber ? scope.row.studentNumber : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="candidateNumber"
          align="center"
          :show-overflow-tooltip="true"
          label="考号"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.candidateNumber ? scope.row.candidateNumber : '--'}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" min-width="70" align="center" label="学籍号">
          <template slot-scope="scope">
            {{scope.row.studentCode ? scope.row.studentCode : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          :show-overflow-tooltip="true"
          align="center"
          label="姓名"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.userName ? scope.row.userName : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="gradeName"
          align="center"
          :show-overflow-tooltip="true"
          label="年级"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.gradeName ? scope.row.gradeName : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="className"
          label="班别"
          :show-overflow-tooltip="true"
          align="center"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.className ? scope.row.className : '--'}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" min-width="80" align="center" v-for="(_item, index) in subjectNameList2" :key="index + '_subjectNameListdd'" :label="_item">
          <template slot-scope="scope">
            {{scope.row[_item].score ? scope.row[_item].score : '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="allScore"
          align="center"
          :show-overflow-tooltip="true"
          label="总分"
          min-width="80">
          <template slot-scope="scope">
            {{scope.row.allScore ? scope.row.allScore : '--'}}
          </template>
        </el-table-column>
        <template slot="empty">
          <div v-if="loading2">
          </div>
          <div v-else>
            <img src="../../../../assets/img/no-data.png">
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <template v-if="pagination.pageTotal > 10 && curTab === 0">
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
      <template v-if="pagination1.pageTotal > 10 && curTab === 1">
        <div class="pagination-comp clearfix">
          <el-pagination
            background
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pagination1.pageNum"
            :page-size="pagination1.pageSize"
            :page-sizes="[10, 20]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="pagination1.pageTotal">
          </el-pagination>
        </div>
      </template>
      <template v-if="pagination2.pageTotal > 10 && curTab === 2">
        <div class="pagination-comp clearfix">
          <el-pagination
            background
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pagination2.pageNum"
            :page-size="pagination2.pageSize"
            :page-sizes="[10, 20]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="pagination2.pageTotal">
          </el-pagination>
        </div>
      </template>
    </div>
    <!--导入弹窗-->
    <el-dialog
      class="dialog-comp"
      title="导入"
      width="400px"
      :visible.sync="importDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-body">
        <div class="import-item">
          <span>学年学期</span>
          <el-select  style="width: 255px;"  @change="selectAllYear"  size="small" v-model="dialogSearch.year" placeholder="请选择">
            <el-option
              v-for="item in yearList"
              :key="item.uid"
              :label="item.cname"
              :value="item.uid">
            </el-option>
          </el-select>
        </div>
        <div class="import-item">
          <span>年级</span>
          <el-select style="width: 255px;" size="small" v-model="dialogSearch.grader" placeholder="请选择">
            <el-option
              v-for="item in dialogSearch.gradeList"
              :key="item.uid"
              :label="item.gradeName"
              :value="item.uid">
            </el-option>
          </el-select>
        </div>
        <div class="import-item">
          <p v-if="dialogSearch.year === '' || dialogSearch.grader === ''" style="color: #c0c4cc;">选择学年学期跟年级之后下载模板</p>
          <el-button v-else type="text" @click="downMXls" >下载导入模板</el-button>
        </div>
        <div class="import-item">
          <span style="vertical-align: top;">上传文件</span>
          <el-upload
            ref="gradeInfo"
            style="width: 255px;"
            class="upload-demo"
            accept=".xls,.xlsx"
            with-credentials
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            :on-success="handSuccess"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleChangeUpload"
            :on-error="haddleError"
            drag
            :action="requestUrl">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__text" style="color: #BBBBBB;">支持5MB以内的xls/xlsx格式文件</div>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="dialogSearch.year === '' || dialogSearch.grader === ''" :loading="importing" @click="onConfirmImport">开始导入</el-button>
        <el-button @click="importDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--转换弹窗-->
    <el-dialog
      class="dialog-comp"
      title="选择您要转换数据"
      width="400px"
      :visible.sync="switchDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-body">
        <div class="import-item">
          <span>学年学期</span>
          <el-select  style="width: 255px;" @change="selectYear" size="small" v-model="dialogSearch.year" placeholder="请选择">
            <el-option
              v-for="item in yearList"
              :key="item.uid"
              :label="item.cname"
              :value="item.uid">
            </el-option>
          </el-select>
        </div>
        <div class="import-list">
          <div class="import-list-item" @click="onConfirmSwitch(_item)" v-for="_item in switchTable" :key="_item.id">{{_item.gradeName}}</div>
        </div>
      </div>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button :disabled="multipleSelection.length === 0" @click="onConfirmSwitch">开始转换</el-button>-->
        <!--<el-button @click="switchDialog = false">取 消</el-button>-->
      <!--</span>-->
    </el-dialog>
    <!--导入完成弹窗-->
    <el-dialog
      class="dialog-comp"
      title="提示"
      width="360px"
      :visible.sync="tipDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-body">
        <div class="import-item">
          导入成功
        </div>
      </div>
      <div class="import-body">
        <div class="import-item">
          导入失败，失败原因：<em style="color: #2878FF;">下载查看</em>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <!--操作指南-->
    <el-dialog
      class="dialog-comp"
      title="操作指南"
      width="800px"
      :visible.sync="operationDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-body">
        <img src="../../../../assets/img/operation.jpg" alt="">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import envConfig from '@/config'
import { getScoreYear, getAllYear, getScoreStudentResults, getScoreGradeResults, getScoreGrade, getScoreExportResults, getScoreClassResults, getScoreClass } from '../../store/api.js';
export default {
  data () {
    return {
      pagination: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      pagination1: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      pagination2: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      tableHeight: 'calc(100% - 100px)',
      operationDialog: false,
      loading: false,
      loading1: false,
      loading2: false,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      requestUrl: '',
      curTab: 0,
      yearList: [],
      searchData: {
        curYear: null,
        graderList: [], // 年级
        curGrader: null
      },
      searchData1: {
        curYear: null,
        graderList: [], // 年级
        curGrader: null,
        classList: [], // 班级
        curClass: null
      },
      searchData2: {
        curYear: null,
        graderList: [], // 年级
        curGrader: null,
        classList: [], // 班级
        curClass: null,
        name: ''
      },
      importDialog: false,
      switchDialog: false,
      dialogSearch: {
        year: '',
        grader: '',
        gradeList: []
      }, // 弹窗里的搜索选项
      fData: [],
      fileList: [],
      showFailFile: false,
      schoolId: null,
      importing: false,
      tipDialog: false,
      previewDialog: false,
      multipleSelection: [],
      switchTable: [],
      hasChanged: false,
      downLoadPath: '',
      downLoadUrl: '',
      isFirst: true,
      isFirst1: true,
      isFirst2: true,
      // 表格数据
      subjectNameList: [],
      subjectNameList1: [],
      subjectNameList2: []
    }
  },
  mounted () {
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId, this.currentSchool)
    }
    getScoreYear().then(res => {
      if (res) {
        this.yearList = res.data;
        if (res.data.length) {
          this.searchData.curYear = res.data[0].uid;
          this.searchData1.curYear = res.data[0].uid;
          this.searchData2.curYear = res.data[0].uid;
          this.selectYear(res.data[0].uid);
          this.selectYear1(res.data[0].uid);
          this.selectYear2(res.data[0].uid);
        }
      }
    }).catch(e => {
      console.log(e);
    })
  },
  methods: {
    onPageSizeChange (size) {
      if (this.curTab === 0 ) {
        this.pagination.pageSize = size;
      } else if (this.curTab === 1) {
        this.pagination1.pageSize = size;
      } else {
        this.pagination2.pageSize = size;
      }
      this.getScoreList();
    },
    onPageChange (page) {
      if (this.curTab === 0 ) {
        this.pagination.pageNum = page;
      } else if (this.curTab === 1) {
        this.pagination1.pageNum = page;
      } else {
        this.pagination2.pageNum = page;
      }
      this.getScoreList();
    },
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    indexMethod1 (index) {
      return index + 1 + this.pagination1.pageSize * (this.pagination1.pageNum - 1);
    },
    indexMethod2 (index) {
      return index + 1 + this.pagination2.pageSize * (this.pagination2.pageNum - 1);
    },
    selectAllYear () {
      getAllYear().then(res => {
        if (res) {
          this.dialogSearch.gradeList = res.data;
          console.log(this.dialogSearch.gradeList)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    selectYear (e, type) {
      console.log(e);
      let params = {
        yearUid: this.searchData.curYear,
        schoolUid: this.schoolId
      }
      getScoreGrade(params).then(res => {
        if (res) {
          this.searchData.graderList = res.data;
          if (this.switchDialog) {
            this.switchTable = res.data;
            // this.dialogSearch.grader = res.data[0].uid;
          } else {
            if (type) {
              this.searchData.curYear = this.dialogSearch.year;
              this.searchData.curGrader = this.dialogSearch.grader;
              this.getScoreList(true);
            } else {
              this.searchData.curGrader = res.data[0] ? res.data[0].uid : '';
            }
          }
          if (this.isFirst) {
            this.getScoreList(true);
            this.isFirst = false;
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },
    selectYear1 (e, type) {
      console.log(e);
      let params = {
        yearUid: this.searchData1.curYear,
        schoolUid: this.schoolId
      }
      getScoreGrade(params).then(res => {
        if (res) {
          this.searchData1.graderList = res.data;
          if (res.data[0]) {
            if (type) {
              this.searchData1.curYear = this.dialogSearch.year;
              this.searchData1.curGrader = this.dialogSearch.grader;
              this.getScoreList(true);
            } else {
              this.searchData1.curGrader = res.data[0].uid;
            }
            this.selectGrade(this.searchData1.curGrader)
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },
    selectYear2 (e, type) {
      console.log(e);
      let params = {
        yearUid: this.searchData2.curYear,
        schoolUid: this.schoolId
      }
      getScoreGrade(params).then(res => {
        if (res) {
          this.searchData2.graderList = res.data;
          if (res.data[0]) {
            if (type) {
              this.searchData2.curYear = this.dialogSearch.year;
              this.searchData2.curGrader = this.dialogSearch.grader;
              this.getScoreList(true);
            } else {
              this.searchData2.curGrader = res.data[0].uid;
            }
            this.selectGrade2(this.searchData2.curGrader)
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },
    selectGrade (e) {
      let params = {
        uid: e,
        schoolUid: this.schoolId
      }
      this.searchData1.curClass = '';
      getScoreClass(params).then(res => {
        if (res) {
          this.searchData1.classList = res.data;
        }
      }).catch(e => {
        console.log(e)
      })
    },
    selectGrade2 (e) {
      let params = {
        uid: e,
        schoolUid: this.schoolId
      }
      this.searchData2.curClass = '';
      getScoreClass(params).then(res => {
        if (res) {
          this.searchData2.classList = res.data;
        }
      }).catch(e => {
        console.log(e)
      })
    },
    getScoreList (type) {
      let params = {
        'where.schoolUid': this.schoolId
      }
      switch (this.curTab) {
        case 0:
          if (this.searchData.curGrader) {
            this.loading = true;
            if (type) {
              params.pageNum = 1;
              params.pageSize = this.pagination.pageSize;
            } else {
              params.pageNum = this.pagination.pageNum;
              params.pageSize = this.pagination.pageSize;
            }
            params['where.yearUid'] = this.searchData.curYear;
            params['where.gradeId'] = this.searchData.curGrader;
            getScoreGradeResults(params).then(res1 => {
              let _obj = [];
              if (res1) {
                res1.data.list.forEach(x => {
                  x.subjectStatisticsDTOList.forEach(y => {
                    x[y.subjectName] = y;
                  })
                })
                if (res1.data.list.length) {
                  res1.data.list[0].subjectStatisticsDTOList.forEach(y => {
                    _obj.push(y.subjectName);
                  })
                }
                // this.subjectNameList = _obj;
                let self = this;
                this.subjectNameList = [];
                this.tableData1 = res1.data.list;
                setTimeout(() => {
                  self.subjectNameList = _obj;
                  self.loading = false;
                }, 200)
                console.log(this.tableData1, this.subjectNameList);
                this.pagination.pageNum = res1.data.pageNum;
                this.pagination.pageTotal = res1.data.total;
                this.pagination.pageSize = res1.data.pageSize;
              }
            }).catch(err => {
              console.log(err)
            })
          }
          break;
        case 1:
          if (this.searchData1.curGrader) {
            this.loading1 = true;
            if (type) {
              params.pageNum = 1;
              params.pageSize = this.pagination1.pageSize;
            } else {
              params.pageNum = this.pagination1.pageNum;
              params.pageSize = this.pagination1.pageSize;
            }
            params['where.yearUid'] = this.searchData1.curYear;
            params['where.gradeId'] = this.searchData1.curGrader;
            if (this.searchData1.curClass) {
              params['where.className'] = this.searchData1.curClass;
            }
            getScoreClassResults(params).then(res2 => {
              let _obj = [];
              if (res2) {
                console.log(res2.data, 1);
                res2.data.list.forEach(x => {
                  x.subjectStatisticsDTOList.forEach(y => {
                    x[y.subjectName] = y;
                  })
                })
                if (res2.data.list.length) {
                  res2.data.list[0].subjectStatisticsDTOList.forEach(y => {
                    _obj.push(y.subjectName);
                  })
                }
                let self = this;
                this.subjectNameList1 = [];
                this.tableData2 = res2.data.list;
                setTimeout(() => {
                  self.subjectNameList1 = _obj;
                  self.loading1 = false;
                }, 200)
                this.pagination1.pageNum = res2.data.pageNum;
                this.pagination1.pageTotal = res2.data.total;
                this.pagination1.pageSize = res2.data.pageSize;
              }
            }).catch(err => {
              console.log(err)
            })
          }
          break;
        case 2:
          if (this.searchData2.curGrader) {
            this.loading2 = true;
            if (type) {
              params.pageNum = 1;
              params.pageSize = this.pagination2.pageSize;
            } else {
              params.pageNum = this.pagination2.pageNum;
              params.pageSize = this.pagination2.pageSize;
            }
            params['where.yearUid'] = this.searchData2.curYear;
            params['where.gradeId'] = this.searchData2.curGrader;
            if (this.searchData2.curClass) {
              params['where.className'] = this.searchData2.curClass;
            }
            if (this.searchData2.name) {
              params['where.studentName'] = this.searchData2.name;
            }
            getScoreStudentResults(params).then(res3 => {
              let _obj = [];
              if (res3) {
                console.log(res3.data, 2)
                res3.data.list.forEach(x => {
                  x.subjectScoreList.forEach(y => {
                    x[y.subjectName] = y;
                  })
                })
                if (res3.data.list.length) {
                  res3.data.list[0].subjectScoreList.forEach(y => {
                    _obj.push(y.subjectName);
                  })
                }
                let self = this;
                this.subjectNameList2 = [];
                this.tableData3 = res3.data.list;
                setTimeout(() => {
                  self.subjectNameList2 = _obj;
                  self.loading2 = false;
                }, 200)
                this.pagination2.pageNum = res3.data.pageNum;
                this.pagination2.pageTotal = res3.data.total;
                this.pagination2.pageSize = res3.data.pageSize;
              }
            }).catch(err => {
              console.log(err)
            })
          }
          break;
      }
    },
    showImport () {
      this.importing = false;
      this.importDialog = true;
      this.dialogSearch.year = '';
      this.dialogSearch.grader = '';
      this.dialogSearch.greadeList = [];
    },
    showSwitch () {
      this.switchDialog = true;
      this.dialogSearch.year = '';
      this.dialogSearch.grader = '';
      this.switchTable = [];
    },
    downMXls () {
      let params = {
        yearUid: this.dialogSearch.year,
        schoolUid: this.schoolId,
        schoolName: this.currentSchool.fullName,
        gradeName: this.dialogSearch.gradeList.find(x => x.uid === this.dialogSearch.grader).gradeName,
        gradeId: this.dialogSearch.grader,
        downType: 1
      };
      getScoreExportResults(params).then(res => {
        if (res) {
          this.downLoadXl(res.data.fileUrl)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onConfirmImport () {
      this.requestUrl = envConfig.SCORE_MANAGE + 'score/importResults?';
      console.log(this.dialogSearch.year)
      let s = 'schoolUid=' + this.schoolId + '&yearUid=' + this.dialogSearch.year + '&gradeId' + '=' + this.dialogSearch.grader + '&schoolName=' + encodeURIComponent(this.currentSchool.fullName) + '&gradeName=' + encodeURIComponent(this.dialogSearch.gradeList.find(x => x.uid === this.dialogSearch.grader).gradeName);
      this.requestUrl += s;
      console.log(this.requestUrl)
      if (this.fileList.length > 0) {
        this.importing = true;
        this.$nextTick(() => {
          this.$refs.gradeInfo.submit();
        })
      } else {
        this.$message.warning('请先选择要导入的文件');
      }
    },
    onConfirmSwitch (data) {
      let params = {
        yearUid: this.dialogSearch.year,
        schoolUid: this.schoolId,
        schoolName: this.currentSchool.fullName,
        gradeName: data.gradeName,
        gradeId: data.uid,
        downType: 2
      };
      getScoreExportResults(params).then(res => {
        if (res) {
          window.localStorage.setItem('previewDown', JSON.stringify(res.data));
          // this.previewDialog = true;
          window.open(envConfig.ADDPREFIX + '/score-preview?yearUid=' + this.dialogSearch.year + '&schoolUid=' + this.schoolId + '&gradeId=' + data.uid)
          // window.open('/#/score-preview?yearUid=' + this.dialogSearch.year + '&schoolUid=' + this.schoolId + '&gradeId=' + data.uid)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    downLoadXl (path) {
      console.log(path)
      let linkElement = document.createElement('a');
      console.log(linkElement)
      linkElement.setAttribute('href', path);
      linkElement.setAttribute('download', '成绩数据');
      try {
        console.log('google')
        let clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);
      } catch (err) {
        console.log(err, 'ie')
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        linkElement.dispatchEvent(mouseEvent)
      }
    },
    //上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handSuccess (res) {
      this.importDialog = false;
      // this.getScoreList();
      console.log('fsfds', res)
      this.$refs.gradeInfo.clearFiles();
      if (res.code === '00000000') {
        this.$message.success(res.data);
        this.fileList.splice(0, this.fileList.length)
        if (this.curTab === 0) {
          this.selectYear(this.dialogSearch.year, true)
        } else if (this.curTab === 1) {
          this.selectYear1(this.dialogSearch.year, true)
        } else {
          this.selectYear2(this.dialogSearch.year, true)
        }
      } else {
        this.$message.error(res.viewMsg);
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleChangeUpload (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    haddleError () {
      this.importing = false;
      this.$message.error('无法连接到远程，请联系管理员')
    },
    goPreview () {
      this.previewDialog = false;
      window.open(envConfig.ADDPREFIX + '/score-preview?yearUid=' + this.dialogSearch.year + '&schoolUid=' + this.schoolId + '&gradeId=' + this.multipleSelection[0].uid)
    }
  },
  watch: {
    curTab (e) {
      if (this.isFirst2 && e === 2) {
        console.log('2f')
        this.getScoreList(true);
        this.isFirst2 = false;
      }
      if (this.isFirst1 && e === 1) {
        console.log('1f')
        this.getScoreList(true);
        this.isFirst1 = false;
      }
      if (e === 0) {
        this.selectYear()
      } else if (e === 1) {
        this.selectYear1()
      } else {
        this.selectYear2()
      }
    },
    importDialog (e) {
      if (!e) {
        if (this.fileList.length) {
          this.$refs.gradeInfo.clearFiles();
        }
      }
    }
  }
}
</script>
<style scoped="scoped" lang="scss">
  .ss-main{
    .ss-box{
      padding: 0 20px 50px 20px;
      .ss-tab{
        width: 100%;
        height: 50px;
        padding-bottom: 14px;
        border-bottom: 1px solid #e8e8e8;
        .ss-tab-main{
          display: inline-block;
          >span{
            display: block;
            float: left;
            width: 100px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            cursor: pointer;
            &:first-child{
              -webkit-border-radius: 4px 0 0 4px;
              -moz-border-radius: 4px 0 0 4px;
              border-radius: 4px 0 0 4px;
              border-left: 1px solid #E8E8E8;
              border-top: 1px solid #E8E8E8;
              border-bottom: 1px solid #E8E8E8;
            }
            &:last-child{
              -webkit-border-radius: 0 4px 4px 0;
              -moz-border-radius: 0 4px 4px 0;
              border-radius: 0 4px 4px 0;
              border-right: 1px solid #E8E8E8;
              border-top: 1px solid #E8E8E8;
              border-bottom: 1px solid #E8E8E8;
            }
            &:nth-child(2){
              border: 1px solid #E8E8E8;
            }
          }
          .active{
            background: #2878FF;
            color: #FFFFFF;
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
        }
        .ss-tab-operation{
          display: inline-block;
          vertical-align: top;
          line-height: 40px;
          color: #409eff;
          margin-left: 30px;
          cursor: pointer;
        }
      }
      .ss-search{
        width: 100%;
        height: 60px;
        line-height: 60px;
        .ss-search-item{
          float: left;
          margin-right: 20px;
        }
      }
    }
    .import-body{
      .import-item{
        width: 100%;
        margin-bottom: 20px;
        >span{
          width: 64px;
          display: inline-block;
          text-align: center;
        }
        .upload-demo{
          width: 255px;
          display: inline-block;
          /deep/.el-upload-dragger{
            width: 255px!important;
          }
        }
      }
      .import-list{
        width: 100%;
        height: auto;
        text-align: center;
        .import-list-item{
          display: inline-block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #E8E8E8;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding: 0 10px;
          margin: 0 10px 10px 10px;
          cursor: pointer;
          &:hover{
            background: #ecf5ff;
          }
        }
      }
      >img{
        width: 100%;
        height: auto;
      }
    }
  }
</style>
<style lang="scss">
  .multipTable{
    .el-table__header{
      .el-checkbox{
        display: none;
      }
    }
  }
  .score-table {
    border-left: none;
    border-right: none;
    &:before {
      height: 0px;
    }
    &:after{
      height: 0px;
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
  .ss-table{
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
      th{
        background: #F2F2F2!important;
        border-color: #E8E8E8!important;
        border-left: 1px solid #E8E8E8;
        &:first-child{
          border-left: none;
        }
      }
    }
  }
</style>