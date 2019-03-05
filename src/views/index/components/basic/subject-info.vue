<template>
  <div class="subject-info">
    <s-title :title="'科目信息'"></s-title>
    <div class="tooltip">
      <i class="el-icon-warning"></i>
      <span>当前科目信息为国家课程计划安排，学校可根据实际情况进行调整，自习、劳动、班会等也需在此录入。</span>
    </div>
    <div class="subject-content">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item label="学年:">
          <el-select v-model="formInline.yearId" placeholder="请选择学年" @change="onYearIdChange">
            <el-option v-for="item in subTermList" :key="item.uid" :label="item.schoolYear" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="th-form-operate">
          <el-button :disabled="!operateBtn || isCreate" class="operate-top-color" @click="onAdd">新增</el-button>
        </el-form-item>
        <div class="el-form-right th-form-operate fr">
          <el-form-item>
            <el-button :disabled="!operateBtn" class="operate-top-btn has-btn-border" @click="onImport"><i class="iconfont icon-daoru"></i><span>导入</span></el-button>
            <el-button class="operate-top-btn has-btn-border" :loading="isExportLoading" @click="exportFile(-1, true)"><i class="iconfont icon-daochu"></i><span>导出</span></el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table :data="tableData3" v-loading="loading" :span-method="arraySpanMethod" :row-class-name="changeStyle" style="width: 100%" :height="tableHeight" class="table-comp">
        <el-table-column align="center" type="index" width="50" :fixed="true" label="序号"></el-table-column>
        <el-table-column align="center" prop="subjectFullname" :fixed="true" label="科目名称">
          <template slot-scope="scope">
            <span>{{scope.row.subjectFullname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="subjectShortname" :fixed="true" label="简称"></el-table-column>
        <el-table-column align="center" prop="subjectType" :fixed="true" label="科目类型">
          <template slot-scope="scope">
            <span v-if="scope.row.subjectType === 1">主课</span>
            <span v-if="scope.row.subjectType === 2">副课</span>
            <span v-if="scope.row.subjectType === 3">非文化课</span>
            <span v-if="scope.row.subjectType === 4">班会</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="年级">
          <el-table-column  v-for="(item, index) in tableConfig" :key="index" align="center" :prop="item.prop" :label="item.label">
            <template slot-scope="scope">
              <div v-if="scope.row.gradeCourseTotalList[item.prop] !== 0 && scope.row.gradeCourseTotalList[item.prop] > tableData3[tableData3.length - 1].gradeCourseTotalList[item.prop]" class="sub-warning">
                <span>{{scope.row.gradeCourseTotalList[item.prop]}}</span>
                <el-tooltip v-if="scope.row.subjectFullname === '节数合计'" popper-class="sub-warning-style" class="sub-warning-tooltip-up" effect="light" content="科目节数超出课表课时容量，会造成排课错误，请及时调整" placement="right">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </div>
              <div v-else-if="scope.row.gradeCourseTotalList[item.prop] !== 0 && scope.row.gradeCourseTotalList[item.prop] <  tableData3[tableData3.length - 1].gradeCourseTotalList[item.prop]" class="sub-warning">
                <span>{{scope.row.gradeCourseTotalList[item.prop]}}</span>
                <el-tooltip v-if="scope.row.subjectFullname === '节数合计'" popper-class="sub-warning-style" class="sub-warning-tooltip-down" effect="light" content="科目节数低于课表课时容量，排课效果会受影响，请及时调整。" placement="right">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </div>
              <div v-else>
                <span>{{scope.row.gradeCourseTotalList[item.prop] === 0 ? '-' : scope.row.gradeCourseTotalList[item.prop]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" width="140px" label="场地">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.subjectFullname !== '节数合计' && scope.row.subjectFullname !== '课时容量'"
              v-model="scope.row.placeId"
              size="small"
              class="no-border--sub-select"
              placeholder="请选择"
              clearable
              @change="onPlaceChange($event, scope.row, scope.$index)">
              <el-option :class="{'palceActive': item.placeType === 1}" v-for="item in venueList" :key="item.placeId + '_ssss'" :label="item.name" :value="item.placeId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150px" label="操作">
          <template slot-scope="scope">
            <div v-show="scope.row.subjectFullname !== '节数合计' && scope.row.subjectFullname !== '课时容量'">
              <span v-if="operateBtn" class="opera" @click.stop="onEdit(scope.row, scope.$index)">编辑</span>
              <span v-if="operateBtn" class="delete" @click.stop="onDelete(scope.row, scope.$index)">删除</span>
              <span v-if="!operateBtn" class="opera" style="color: #e8e8e8">编辑</span>
              <span v-if="!operateBtn" class="delete" style="color: #e8e8e8">删除</span>
            </div>
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
    </div>
    <!-- 新增编辑科目 -->
    <el-dialog
      class="dialog-comp"
      :title="AEIntitle"
      width="600px"
      :visible.sync="addEditInDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        class="sub-info"
        :model="postAddInData"
        :rules="rules"
        ref="form"
        label-width="80px">
        <!-- <div class="dialog-tooltip">
          <i class="el-icon-warning"></i>
          <span>备注：班会、队会等科目请选择班会课类型</span>
        </div> -->
        <div class="line">
          <el-form-item label="学期" prop="yearId">
            <el-select
              v-model="postAddInData.yearId"
              placeholder="请选择学期"
              disabled>
              <el-option v-for="item in subTermList" :key="item.uid + '_s'" :label="item.schoolYear" :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科目名称" prop="subjectFullname">
            <el-input
              v-model="postAddInData.subjectFullname"
              placeholder="请输入科目名称"
              @change="onSubFullnameChange"
              maxlength="20"/>
          </el-form-item>
        </div>
        <div class="line">
          <el-form-item label="科目简称" prop="subjectShortname">
            <el-input
              v-model="postAddInData.subjectShortname"
              placeholder="请输入科目简称"
              maxlength="2"/>
          </el-form-item>
          <el-form-item label="科目类型" prop="subjectType">
            <el-select
              v-model="postAddInData.subjectType"
              placeholder="请选择类型"
              clearable>
              <!-- <el-option v-for="item in allOperatorList" :key="item.uid" :label="item.operatorName" :value="item"></el-option> -->
              <el-option label="主课" :value="1"></el-option>
              <el-option label="副课" :value="2"></el-option>
              <el-option label="非文化课" :value="3"></el-option>
              <!-- <el-option label="班会课" :value="4"></el-option> -->
            </el-select>
          </el-form-item>
        </div>
        <div class="sub-number">
          <p><span>课节数</span></p>
          <div class="n-line">
            <div :class="{'n-line-active': (index + 1) % 3 === 0}" v-for="(item, index) in postAddInData.courseGradeList" :key="index + 'a'"><span>{{item.gradeFullName}}</span>
            <!-- <el-input v-model.number="postAddInData.tlist[item.prop]">
              <template slot="append">
                <div class="operate">
                  <i class="el-icon-arrow-up" @click="onJiajia(item.prop)"></i>
                  <i class="el-icon-arrow-down" @click="onJianjian(item.prop)"></i>
                </div>
              </template>
            </el-input> -->
              <el-input-number v-model="item.courseTotal" controls-position="right" :min="0" :max="20"></el-input-number>
            </div>
          </div>
        </div>
        <div class="line">
          <el-form-item label="场地" prop="placeId">
            <el-select
              v-model="postAddInData.placeId"
              placeholder="请选择"
              clearable>
              <el-option :class="{'palceActive': item.placeType === 1}" v-for="item in venueList" :key="item.placeId + '_dw'" :label="item.name" :value="item.placeId"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="onConfirmAddEditIn">确 定</el-button>
        <el-button @click="addEditInDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      class="dialog-comp"
      title="删除提示"
      width="392px"
      :visible.sync="deleteDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="dialog-box">
        <p>是否确认删除该科目？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="onConfirmDelete">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
      class="dialog-comp"
      title="导入"
      width="460px"
      :visible.sync="importDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-body">
        <!-- <template>
          <el-alert
              title="科目名称、科目类型为必填项；请勿修改模板中科目类型、年级，确保与系统中一致"
              type="warning"
              show-icon
              :closable="false">
          </el-alert>
      </template> -->
        <div class="alert-msg">
          <p>备注：</p>
          <p>科目名称、科目类型为必填项；请勿修改模板中科目类型、年级，确保与系统中一致</p>
        </div> 
        <div class="import-col">
          <label class="col-left">1</label>
          <div class="col-right">
            <p>下载导入模板</p>
            <div class="import-btn" @click="exportFile(0, true)">
              <a href="javascript:void(0)"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
            </div>
            <!-- <div class="import-btn" @click="downloadModel">
              <a href="javascript:void(0)"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
            </div> -->
          </div>
        </div>
        <div class="import-col">
          <label class="col-left">2</label>
          <div class="col-right">
            <p>上传科目列表</p>
            <div class="upload-btn">
              <el-upload
                ref="subjectInfo"
                class="upload-demo"
                :action="requestUrl"
                :on-success="handSuccess"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :file-list="fileList"
                accept=".xls,.xlsx"
                with-credentials
                :auto-upload="false"
                :limit="1"
                :on-exceed="handleExceed"
                >
                <el-button size="small"><i class="icon iconfont">&#xe7f9;</i>浏览</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onConfirmImport">开始导入</el-button>
        <el-button @click="importDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入完成弹框 -->
    <el-dialog
      class="dialog-comp"
      title="导入完成"
      width="392px"
      height="235px"
      :visible.sync="importFinishDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="import-box">
        <p>本次成功导入：<span style="color: #2888FF">{{successNumber}}</span>条数据</p>
        <p>本次失败导入：<span style="color: #DC4C4F">{{failNumber}}</span>条数据</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div v-show="showFailFile" class="down-fail-btn" @click="downloadErrorFile">下载失败列表</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSubInfoList, subInfoAdd, subInfoUpdate, subInfoDelete, getYear, getSubClassListGAI, getSubPlaceTreeList, downloadModel, deleteDownLoadFile } from '@/views/index/store/api'
import envConfig from '@/config'
import { autoDownloadUrl } from '@/utils'
export default {
  data () {
    return {
      isExportLoading: false,
      errorFile: null, // 错误文件路径
      requestUrl: envConfig.baseUrl,
      successNumber: 0, // 导入成功条数
      failNumber: 0, // 导入失败条数
      importFinishDialog: false, // 导入成功弹框
      showFailFile: false, // 是否显示下载失败列表
      fileList: [],
      baseUrl: envConfig.baseUrl, // 下载模板地址
      tableHeight: 'calc(100% - 52px)',
      subTermList: [], // 下拉学期数据
      subClassList: [], // 有几个年级
      venueList: [], // 场地列表
      loading: true,
      btnLoading: false,
      operateBtn: true,
      formInline: {
        yearId: null
      },
      schoolId: null,
      tableConfig: [],
      tableData3: [],
      weedDaysList: {},
      postAddInData: {
        tlist: {
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          six: 0
        }
      },
      AEIntitle: '新增科目',
      addEditInDialog: false,
      deleteDialog: false,
      deleteItem: {},
      importDialog: false, // 导入
      rules: {
        subjectFullname: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        subjectShortname: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        subjectType: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}]
      },
      editIndex: null,
      deleteIndex: null,
      isCreate: false,
      timerError: null,
      delErrorFile: null
    }
  },
  created () {
    this.schoolId = this.$store.state.user.currentSchool ? this.$store.state.user.currentSchool.uid : null
    this.getSubTerm().then(() => {
      if (this.subTermList.length > 0) {
        this.getList(this.formInline.yearId)
      } else {
        this.$message.error('请维护年级信息')
        this.loading = false;
        this.isCreate = true;
      }
    })
    this.getSubPlaceTree()
  },
  methods: {
    // 下载失败列表
    downloadErrorFile () {
      if (this.errorFile) {
        autoDownloadUrl(this.errorFile);
        if (this.delErrorFile) {
          // 下载成功后删除动态模板
          this.timerError = setTimeout(() => {
            deleteDownLoadFile(this.delErrorFile)
            .then(res => {
              console.log('res', res)
            });
          }, 30000)
        }
      }
    },
    // 下载模板 --- 导出
    exportFile (downType, val) {
      let _this = this;
      const value = {
        'schoolId': this.schoolId
      }
      const params = {
        modelType: 1,
        downType: downType,
        bussinessParam: JSON.stringify(value)
      };
      if (downType === -1) {
        _this.isExportLoading = true;
      }
      downloadModel(params)
        .then(res => {
          if (res.code === '00000000') {
            autoDownloadUrl(res.data.fileUrl);
            const filePath = res.data.filePath;
            _this.isExportLoading = false;
            if (val) {
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
            }
        })
        .catch(() => {
          _this.isExportLoading = false;
        })
    },
    //导入
    onImport () {
      this.fileList = [];
      this.importDialog = true;
    },
    //确定导入
    onConfirmImport () {
      const value = {
        'schoolId': this.schoolId
      }
      this.requestUrl = this.baseUrl + '/batch/batchIn?modelType=1&bussinessParam=' + encodeURI(JSON.stringify(value));
      if (this.fileList.length > 0) {
        this.$_showLoading();
        this.$nextTick(() => {
          this.$refs.subjectInfo.submit();
        })
      } else {
        this.$message.warning('请先选择要导入的文件');
      }
    },
    handleChange (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handSuccess (res) {
      this.$_hideLoading();
      this.importDialog = false;
      if (res.code === '00000000') {
        if (res.data.code === 0 || res.data.code === 1 ) {
          this.fileList.splice(0, this.fileList.length)
          this.getList(this.formInline.yearId);
          this.importFinishDialog = true;
          this.successNumber = res.data.result.successSize;
          this.failNumber = res.data.result.failSize;
          if (res.data.code === 1) {
            this.showFailFile = true;
            if (res.data.result.errorFileUrl) {
              this.errorFile = res.data.result.errorFileUrl;
            }
            if (res.data.result.errorFilePath) {
              this.delErrorFile = res.data.result.errorFilePath;
            }
          } else {
            this.showFailFile = false;
          }
        }
        if (res.data.code) {
          if (res.data.code === 2 || res.data.code === 3) {
            this.$message.error(res.data.msg);
          }
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
    getList (id) {
      this.formInline.yearId = id
      console.log('yearId', this.formInline.yearId)
      this.getSubClass(id)
        .then(() => {
          console.log('11111111111111111111')
          if (this.subClassList.length > 0) {
            getSubInfoList({schoolId: this.schoolId, yearId: id})
              .then(res => {
                this.tableData3.length = 0
                res.data.baseSchoolSubjectInfoList.forEach(item => {
                  if (item.placeType === 1) {
                    item.placeId = item.placeId ? '_' + item.placeId : null
                  }
                  this.subClassList.forEach(x => {
                    if (!item.gradeCourseTotalList[x.uid.toString()]) {
                      item.gradeCourseTotalList[x.uid.toString()] = 0
                    }
                  })
                })
                this.tableData3 = res.data.baseSchoolSubjectInfoList
                this.weedDaysList = res.data.courseTimeDayCount ? res.data.courseTimeDayCount : {}
                console.log(this.tableData3)
                let obj = {
                  subjectFullname: '节数合计',
                  gradeCourseTotalList: res.data.courseCountMap ? res.data.courseCountMap : null
                }
                let obj2 = {
                  subjectFullname: '课时容量',
                  gradeCourseTotalList: res.data && res.data.courseTimeCountMap ? res.data.courseTimeCountMap : res.data.courseCountMap
                }
                this.tableData3.splice(this.tableData3.length, 0, obj)
                this.tableData3.splice(this.tableData3.length, 0, obj2)
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.tableData3 = JSON.parse(JSON.stringify([]))
            this.loading = false
          }
          // this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getSubTerm (id) { // 科目查询学期下拉框
      console.log('id', id)
      return getYear({
        schoolId: this.schoolId
      })
        .then(res => {
          if (id) {
            this.formInline.yearId = id
          } else {
            res.data.forEach(item => {
              if (item.isDefault) {
                this.formInline.yearId = item.uid
              }
            })
          }
          this.subTermList = res.data
        })
        .catch(() => {})
    },
    getSubClass (id = 1) { // 科目查询年级班级
      return getSubClassListGAI({schoolId: this.schoolId, schoolYearId: id})
        .then(res => {
          this.subClassList = res.data
          this.tableConfig.length = 0
          this.subClassList.forEach(item => {
            this.tableConfig.push({
              label: item.gradeFullName,
              prop: item.uid.toString()
            })
          })
        })
        .catch(() => {})
    },
    getSubPlaceTree () {
      getSubPlaceTreeList({schoolId: this.schoolId, pageSize: 0})
        .then(res => {
          let arr = []
          res.data.forEach(item => {
            arr.splice(arr.length, 0, {
              placeType: item.placeType,
              placeId: item.placeTypeId,
              name: item.placeTypename
            })
            if (item.placeInfoDtoList && item.placeInfoDtoList.length > 0) {
              item.placeInfoDtoList.forEach(x => {
                arr.splice(arr.length, 0, {
                  placeType: x.placeType,
                  placeId: x.placeId ? '_' + x.placeId : null,
                  name: x.placeName
                })
              })
            }
          })
          this.venueList = arr
          console.log(arr)
        })
    },
    onYearIdChange (val) {
      let b = this.subTermList.find(item => { return item.uid === val})
      if (b && (b.isDefault || b.yearAfter)) {
        this.operateBtn = true
      } else {
        this.operateBtn = false
      }
      this.getSubTerm(val)
    },
    onSubFullnameChange (val) { // 科目名称改变赋值简称
      this.postAddInData.subjectShortname = val.slice(0, 1)
    },
    /**
     * 修改 新增 删除
     * 重选计算节数合计数量
     */
    onSummerTotal () {
      for(let o in this.tableData3[this.tableData3.length - 2].gradeCourseTotalList) {
        this.tableData3[this.tableData3.length - 2].gradeCourseTotalList[o] = 0
      }
      for(let i = 0; i < this.tableData3.length - 2; i++) {
        for(let o in this.tableData3[this.tableData3.length - 2].gradeCourseTotalList) {
          this.tableData3[this.tableData3.length - 2].gradeCourseTotalList[o] += parseInt(this.tableData3[i].gradeCourseTotalList[o])
        }
      }
    },
    onAdd () { // 新增科目
      console.log(this.tableData3)
      this.AEIntitle = '新增科目'
      this.postAddInData = {
        schoolId: this.schoolId,
        yearId: this.formInline.yearId,
        subjectFullname: null,
        subjectShortname: null,
        subjectType: null,
        placeId: null,
        courseGradeList: []
      }
      this.subClassList.forEach(item => {
        this.postAddInData.courseGradeList.push({
          gradeFullName: item.gradeFullName,
          gradeId: item.uid,
          courseTotal: 0
        })
      })
      this.addEditInDialog = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onSearchClass (id) {
      let obj = this.subClassList.find(item => { 
        return parseInt(item.uid) === parseInt(id) 
      })
      return obj.gradeFullName
    },
    onEdit (obj, index) { // 编辑科目
      console.log(obj)
      this.editIndex = index
      this.AEIntitle = '编辑科目';
      this.postAddInData = {
        uid: obj.uid,
        schoolId: this.schoolId,
        yearId: this.formInline.yearId,
        subjectFullname: obj.subjectFullname,
        subjectShortname: obj.subjectShortname,
        subjectType: obj.subjectType,
        placeId: obj.placeId,
        placeFullname: obj.placeFullname,
        courseGradeList: []
      }
      for(let key in obj.gradeCourseTotalList) {
        this.postAddInData.courseGradeList.push({
          courseTotal: obj.gradeCourseTotalList[key],
          gradeId: key,
          gradeFullName: this.onSearchClass(key)
        })
      }
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onConfirmAddEditIn () { // 确认新增或者编辑科目
      if (this.postAddInData.courseGradeList.every(item => {return item.courseTotal === 0 })) {
        this.$message.warning('课节数不能都为0')
        return false
      }
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            let mObj = this.venueList.find(x => { return x.placeId === this.postAddInData.placeId })
            this.postAddInData.placeType = mObj ? mObj.placeType : null
            if (typeof(this.postAddInData.placeId) === 'string')
              this.postAddInData.placeId = parseInt(this.postAddInData.placeId.slice(1, this.postAddInData.placeId.length))
            if (this.postAddInData.uid) {
              subInfoUpdate(this.postAddInData)
                .then(res => {
                  if (res) {
                    this.postAddInData.gradeCourseTotalList = {}
                    if (this.postAddInData.placeType && this.postAddInData.placeType === 1) {
                      this.postAddInData.placeId = '_' + this.postAddInData.placeId
                    }
                    this.postAddInData.courseGradeList.forEach(item => {
                      this.postAddInData.gradeCourseTotalList[item.gradeId] = item.courseTotal
                    })
                    this.$set(this.tableData3, this.editIndex, this.postAddInData)
                    this.onSummerTotal()
                    this.$message.success('修改成功')
                    this.addEditInDialog = false
                    this.btnLoading = false
                  }
                })
                .catch(() => {
                  this.btnLoading = false
                })
            } else {
              subInfoAdd(this.postAddInData)
                .then(res => {
                  if (res) {
                    this.postAddInData.gradeCourseTotalList = {}
                    if (this.postAddInData.placeType && this.postAddInData.placeType === 1) {
                      this.postAddInData.placeId = '_' + this.postAddInData.placeId
                    }
                    this.postAddInData.courseGradeList.forEach(item => {
                      this.postAddInData.gradeCourseTotalList[item.gradeId] = item.courseTotal
                    })
                    this.postAddInData.uid = res.data
                    this.tableData3.splice(this.tableData3.length - 2, 0, this.postAddInData)
                    this.onSummerTotal()
                    this.$message.success('新增成功')
                    this.addEditInDialog = false
                    this.btnLoading = false
                  }
                })
                .catch(() => {
                  this.btnLoading = false
                })       
            }
          }
        })
      })
    },
    onPlaceChange ($event, obj, index) {
      console.log(index)
      let postObj = {}
      let mObj = this.venueList.find(x => { return x.placeId === $event })
      if (typeof($event) === 'string') {
        postObj = {
          uid: obj.uid,
          schoolId: this.schoolId,
          placeType: mObj ? mObj.placeType : null,
          yearId: this.formInline.yearId,
          placeId: $event ? parseInt($event.slice(1, $event.length)) : null
        }
      } else {
        postObj = {
          uid: obj.uid,
          schoolId: this.schoolId,
          placeType: mObj ? mObj.placeType : null,
          yearId: this.formInline.yearId,
          placeId: $event ? $event : null
        }
      }
      subInfoUpdate(postObj)
        .then(res => {
          if (res) {
            console.log(obj)
            if (typeof($event) === 'string') {
              obj.placeId = $event ? $event : null
            } else {
              obj.placeId = $event ? $event : null
            }
            this.$set(this.tableData3, index, obj)
            console.log(this.tableData3)
            // this.getList(this.formInline.yearId)
          }
        })
        .catch(() => {})
    },
    onDelete (obj, index) { // 删除弹框
      this.deleteIndex = index
      this.deleteItem = obj
      this.deleteDialog = true
    },
    onConfirmDelete () { // 确认删除弹框
      this.btnLoading = true
      subInfoDelete(this.deleteItem.uid)
        .then(res => {
          if (res) {
            // this.getList(this.formInline.yearId)
            this.tableData3.splice(this.deleteIndex, 1)
            this.onSummerTotal()
            this.$message.success('删除成功')
            this.deleteDialog = false;
            this.btnLoading = false
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    arraySpanMethod({ rowIndex, columnIndex }) { // 最后两行合并单元格
      if (rowIndex === this.tableData3.length - 1 || rowIndex === this.tableData3.length - 2) {
        if (columnIndex === 0 || columnIndex === 2 || columnIndex === 3) {
          return [0, 0];
        } else if (columnIndex === 1) {
          return [1, 4];
        }
      }
    },
    changeStyle ({rowIndex}) { // 最后两行添加类
      if (rowIndex === this.tableData3.length - 1) {
        return 'sub-last-row';
      } else if (rowIndex === this.tableData3.length - 2) {
        return 'sub-second-row';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.subject-info {
  height: 100%;
  .subject-content {
    height: calc(100% - 108px);
    padding: 0 20px 14px 20px;
  }
  .tooltip {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: $teaching-division-color1;
    padding-left: 15px;
    margin-bottom: 8px;
    > i, span {
      color: $teaching-division-color2;
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
.down-fail-btn {
  cursor: pointer;
  margin: 0 auto;
  background-color: $dialog-color2;
  color: #fff;
  width: 110px;
  height: 32px;
  line-height: 32px;
  border-radius: 5px;
  a {
    color: #fff;
  }
}
</style>

<style lang="scss">
@import '@/assets/css/_variable.scss';
.sub-last-row {
  > td:first-child {
    background: $subject-info-color1 !important;
    font-weight: 600;
    color: $subject-info-color2;
  }
  > td:not(:first-child ){
    background: $subject-info-color3 !important;
    font-weight: 600;
    color: $color-font2;
  }
}
.sub-second-row {
  > td:first-child {
    background: $subject-info-color4 !important;
    font-weight: 600;
    color: $subject-info-color5;
  }
  > td:not(:first-child ){
    background: $subject-info-color6 !important;
    font-weight: 600;
    color: $color-font2;
  }
}
.sub-warning {
  position: relative;
  .sub-warning-tooltip-up {
    position: absolute;
    top: 5px;
    margin-left: 3px;
    color: $subject-info-color7;
  }
  .sub-warning-tooltip-down {
    position: absolute;
    top: 5px;
    margin-left: 3px;
    color: $subject-info-color8;
  }
}
.sub-warning-style {
  width: 230px;
  line-height: 2;
  font-size: 14px;
  padding: 15px 20px;
  border: 1px solid $subject-info-color12 !important;
  color: $subject-info-color5;
  .popper__arrow {
    border-color: $subject-info-color12 !important;
  }
}
.th-form-operate {
  .el-button {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
  }
  .el-button.is-disabled:hover {
    background-color: $subject-info-color5;
    color: #fff;
  }
  .has-btn-border:hover {
    border-color: $button-blue-color !important;
  }
  .operate-top-color {
    background-color: $subject-info-color5;
    color: #fff;
    border: none;
  }
  .operate-top-btn {
    border: 1px solid $subject-info-color11;
    background-color: #fff;
    span {
      margin-left: 4px;
    }
  }
}
// 科目信息
.sub-info {
  .dialog-tooltip {
    width: 100%;
    height: 40px;
    line-height: 40px;
    // background: $subject-info-color9;
    // padding-left: 15px;
    margin-bottom: 18px;
    > i, span {
      color: $subject-info-color10;
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .el-form-item {
      width: 49%;
    }
  }
  .sub-number {
    > p {
      border-left: 4px solid $subject-info-color5;
      padding-left: 8px;
      font-size: 14px;
      color: $font-color;
      margin-bottom: 15px;
    }
    .n-line {
      display: flex;
      flex-wrap: wrap;
      padding-left: 37px;
      > div {
        width: 29%;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        margin-right: 20px;
        span {
          display: inline-block;
          width: 70px;
        }
        .el-input {
          position: relative;
          .el-input-group__append {
            padding: 0;
          }
          .operate {
            width: 20px;height: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            i {
              width: 20px; height: 15px;
              line-height: 15px;
              text-align: center;
              font-size: 8px;
              cursor: pointer;
              &:first-child {
                border-bottom: 1px solid $subject-info-color11;
              }
            }
          }
        }
        .el-input__inner {height: 32px;}
      }
      .n-line-active {
        margin-right: 0;
      }
      .el-input-number {
        width: 160px;
        line-height: 28px;
        &.is-controls-right .el-input-number__decrease, &.is-controls-right .el-input-number__increase {
          line-height: 15px;
        }
        .el-input-number__decrease, .el-input-number__increase {
          width: 20px;
        }
      }
    }
  }
  .el-input__inner {
    height: 32px;
  }
}
.no-border--sub-select {
  .el-input__inner {
    border: none;
    background: none;
    padding: 0 0 0 30px;
  }
}
.palceActive {
  padding-left: 35px;
}
</style>
