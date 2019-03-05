<template>
  <div class="venue-info">
    <vue-scroll>
      <div class="venue-content">
        <el-form :inline="true" size="small" class="demo-form-inline th-form-operate">
          <el-form-item>
            <el-button class="operate-top-color" @click="onAdd">新增</el-button>
            <el-button v-if="multipleSelection.length === 0" class="operate-top-btn btn-bg-DB">删除</el-button>
            <el-button v-else class="operate-top-btn" @click="onBatchDelete">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="operate-top-btn has-btn-border" @click="onImport"><i class="iconfont icon-daoru"></i><span>导入</span></el-button>
            <el-button class="operate-top-btn has-btn-border" @click="exportFile(-1, true)" :loading="isExportLoading">
              <i class="iconfont icon-daochu"></i><span>导出</span>
            </el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" v-loading="loading" :data="tableData.list" style="width: 100%" class="table-comp" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="placeFullname" label="场地名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" prop="placeShortname" label="简称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="类型" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ venueTypeObj[scope.row.typeId] ? venueTypeObj[scope.row.typeId] : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="capacity" label="容量（单位：班）"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span class="opera" @click.stop="onEdit(scope.row)">编辑</span>
              <span class="delete" @click.stop="onDelete(scope.row)">删除</span>
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
        <div class="pagination-comp clearfix">
          <el-pagination
            v-if="tableData.total > 10"
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
        <!-- 添加/修改场地 -->
        <el-dialog
          class="dialog-comp"
          :title="AEIntitle"
          width="400px"
          :visible.sync="addEditInDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
          <el-form
            class="label-right add-place"
            :model="postAddInData"
            :rules="rules"
            ref="form"
            label-width="80px">
            <el-form-item label="场地名称" prop="placeFullname">
              <el-input
                v-model="postAddInData.placeFullname"
                maxlength="20"
                placeholder="请输入简称"/>
            </el-form-item>
            <el-form-item label="简称" prop="placeShortname">
              <el-input
                v-model="postAddInData.placeShortname"
                maxlength="10"
                placeholder="请输入简称"/>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
              <el-select
                v-model="postAddInData.typeId"
                placeholder="请选择分类"
                clearable>
                <el-option v-for="item in venueTypeList" :key="item.uid" :label="item.placeTypename" :value="item.uid"></el-option>
              </el-select>
              <el-tooltip popper-class="venue-warning-style" class="venue-warning-down" effect="dark" content="如计算机教室1、计算机教室2，类型均属计算机室。" placement="right">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="容量" prop="capacity">
              <el-input
                v-model.number="postAddInData.capacity"
                placeholder="容量（班）"/>
            </el-form-item>
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
            <p>是否确认删除该场地？</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button :loading="btnLoading" @click="onConfirmDelete">确 定</el-button>
            <el-button @click="deleteDialog = false">取 消</el-button>
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
        <!-- 导入 -->
        <el-dialog
          class="dialog-comp"
          title="导入"
          width="460px"
          :visible.sync="importDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
          <div class="import-body">
            <template>
              <el-alert
                  title="场地名称、简称、类型、容量均为必填项；请确保类型与系统中类型一致"
                  type="warning"
                  show-icon
                  :closable="false">
              </el-alert>
          </template>
            <div class="import-col">
              <label class="col-left">1</label>
              <div class="col-right">
                <p>下载导入模板</p>
                <div class="import-btn" @click="exportFile(0, true)">
                  <a href="javascript:void(0)"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
                </div>
              </div>
            </div>
            <div class="import-col">
              <label class="col-left">2</label>
              <div class="col-right">
                <p>上传场地列表</p>
                <div class="upload-btn">
                  <el-upload
                    ref="areaList"
                    class="upload-demo"
                    :action="requestUrl"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :before-remove="beforeRemove"
                    with-credentials
                    :file-list="fileList"
                    accept=".xls,.xlsx"
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
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import { getVenueList, venueAdd, venueUpdate, venueDelete, getVenueTypeList, downloadModel, deleteDownLoadFile } from '@/views/index/store/api'
import { checkZhengNumber } from '@/utils/validator'
import { autoDownloadUrl } from '@/utils'
import envConfig from '@/config'
export default {
  name: 'VenueInfo',
  data () {
    return {
      timer: null,
      delErrorFile: null,
      isExportLoading: false, // 导出按钮加载中
      errorFile: null, // 错误文件路径
      requestUrl: envConfig.baseUrl, // 导入请求地址处理
      fileList: [],
      showFailFile: false,
      successNumber: 0, // 导入成功条数
      failNumber: 0, // 导入失败条数
      importFinishDialog: false, // 导入成功弹框
      baseUrl: envConfig.baseUrl, // 下载模板地址
      tableData: {},
      multipleSelection: [], // 多选值容器
      postAddInData: {}, // 新增编辑数据容器
      addEditInDialog: false, // 编辑添加场地
      AEIntitle: '新增场地',
      rules: {
        placeFullname: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        placeShortname: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        typeId: [{ required: true, message: '该项内容不可为空', trigger: 'blur'}],
        capacity: [
          { required: true, message: '该项内容不可为空', trigger: 'blur'},
          { validator: checkZhengNumber, trigger: 'blur' }
        ]
      },
      schoolId: null,
      venueTypeList: [],
      venueTypeObj: {},
      deleteDialog: false,
      deleteItem: {},
      loading: true,
      btnLoading: false,
      importDialog: false, // 导入
      pagination: {
        pageNum: 1,
        pageSize: 10,
        order: null,
        orderBy: null
      },
      currentPage: 1,
      timerError: null
    }
  },
  created () {
    this.schoolId = this.$store.state.user.currentSchool ? this.$store.state.user.currentSchool.uid : null
    this.getVTList()
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
        modelType: 3,
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
          } else {
            _this.$message.error(res.viewMsg);
          }
          _this.isExportLoading = false;
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
        'schoolId': this.schoolId,
      }
      this.requestUrl = this.baseUrl + '/batch/batchIn?modelType=3&bussinessParam=' + encodeURI(JSON.stringify(value));
      if (this.fileList.length > 0) {
        this.$nextTick(() => {
          this.$_showLoading();        
          this.$refs.areaList.submit();
        })
      } else {
        this.$message.warning('请先选择要导入的文件');
      }
    },
    // 上传成功
    handleSuccess (res) {
      this.$_hideLoading();
      this.importDialog = false;
      if (res.code === '00000000') {
        if (res.data.code === 0 || res.data.code === 1 ) {
          this.fileList.splice(0, this.fileList.length)
          this.getVTList();
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
    handleChange (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    getList () {
      let obj = Object.assign({}, {'where.schoolId': this.schoolId}, this.pagination)
      getVenueList(obj)
        .then(res => {
          this.tableData = res.data
          this.loading = false
        })
    },
    getVTList () {
      getVenueTypeList({'where.schoolId': this.schoolId, pageSize: 0})
        .then(res => {
          if (res) {
            this.venueTypeList = res.data.list
            res.data.list.forEach(item => {
              this.venueTypeObj[item.uid] = item.placeTypename
            })
            this.getList()
          }
        })
    },
    onBatchDelete () { // 批量删除
      let uids = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.map(item => { uids.push(item.uid) })
      }
      let str = uids.join(',')
      venueDelete(str)
        .then(res => {
          if (res) {
            this.getList()
            this.$message.success('删除成功')
          }
        })
    },
    onAdd () { // 新增场地
      this.AEIntitle = '新增场地'
      this.postAddInData = {}
      this.addEditInDialog = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onEdit (obj) { // 编辑场地
      this.AEIntitle = '编辑场地';
      this.postAddInData = {};
      this.postAddInData = Object.assign({}, obj);
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onConfirmAddEditIn () { // 确认编辑或新增
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.postAddInData.schoolId = this.schoolId
            if (this.postAddInData.uid) {
              this.btnLoading = true
              console.log(this.postAddInData)
              venueUpdate(this.postAddInData)
                .then(res => {
                  if (res) {
                    this.getList()
                    this.$message.success('修改成功')
                    this.addEditInDialog = false
                    this.btnLoading = false
                  }
                })
                .catch(() => {
                  // this.addEditInDialog = false
                  this.btnLoading = false
                })
            } else {
              this.postAddInData.schoolId = this.schoolId
              venueAdd(this.postAddInData)
                .then(res => {
                  if (res) {
                    this.getList()
                    this.$message.success('新增成功')
                    this.addEditInDialog = false
                    this.btnLoading = false
                  }
                })
                .catch(() => {
                  // this.addEditInDialog = false
                  this.btnLoading = false
                })
            }
          }
        })
      })
    },
    onDelete (obj) { // 删除弹框
      this.deleteItem = obj
      this.deleteDialog = true
    },
    onConfirmDelete () { // 确认删除弹框
      this.btnLoading = true
      venueDelete(this.deleteItem.uid)
        .then(res => {
          if (res) {
            this.getList()
            this.$message.success('删除成功')
            this.deleteDialog = false
            this.btnLoading = false
          }
        })
        .catch(() => {
          // this.deleteDialog = false
          this.btnLoading = false
        })
    },
    handleSelectionChange(val) { // table 多选框改变赋值
      this.multipleSelection = val
    },
    handleSizeChange(val) { // 每页显示条数改变
      console.log(`每页 ${val} 条`)
      this.pagination.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) { // 当前页改变
      console.log(`当前页: ${val}`)
      this.pagination.pageNum = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.venue-info {
  height: calc(100% - 100px);
  .venue-content {
    height: calc(100% - 51px);
    padding: 12px 20px 14px 20px;
  }
  .demo-form-inline {
    display: flex;
    justify-content: space-between;
  }
}
.venue-warning-down {
  position: absolute;
  top: 14px;
  right: -4px;
  color: $venue-color4;
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
.venue-info {
  .__view {
    width: 100% !important;
  }
}
.th-form-operate {
  .el-button {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
  }
  .has-btn-border:hover {
    border-color: $button-blue-color !important;
    color: $button-blue-color !important;
  }
  .operate-top-color {
    background-color: $venue-color1;
    color: #fff;
    border: none;
  }
  .operate-top-btn {
    border: 1px solid $venue-color2;
    background-color: #fff;
    span {
      margin-left: 4px;
    }
  }
  .btn-bg-DB {
    background-color: $venue-color3;
    &:hover,
    &:focus {
      color: #666;
    }
  }
}
.add-place {
  .el-form-item {
    position: relative;
  }
  .el-input {
    width: 250px;
  }
}
.venue-warning-style {
  width: 230px;
  line-height: 2;
  font-size: 14px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, .53) !important;
  border: none !important;
  color: #fff;
  .popper__arrow {
    border-color: none !important;
  }
}
</style>
