<template>
  <div class="grade-man">
    <s-title :title="'年级班级'"></s-title>
    <div class="grade-scroll">
    <vue-scroll>
    <div class="grade-info">
    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix select-input-comp">
      <el-form-item>
        <el-select v-model="schoolYearId" placeholder="请选择学年" @change="onChangeYear" value-key="uid">
          <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
    <template v-if="defaultSchoolYearId">
     <el-form-item>
        <el-select v-model="gradeId" placeholder="请选择年级" @change="changeGrade">
         <el-option v-for="item in gradeOptions" :key="item.uid"
                     :label="item.gradeFullName"
                     :value="item.uid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="classId" placeholder="请选择班级" @change="getClassGradeData">
          <el-option v-for="item in classOptions" :key="item.classId"
                     :label="item.classFullName"
                     :value="item.classId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getClassGradeData">查询</el-button>
      </el-form-item>
      <el-form-item v-if="tableData && tableData.length > 0 && !loading">
        <el-button type="primary" @click="onSimpleAdd" class="def-button mgt-2" v-if="yearAfter">新增</el-button>
        <el-button class="def-button mgt-2" v-else>新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="multipleSelection.length === 0" class="btn-bg-DB def-button mgt-2">删除</el-button>
        <el-button v-else class="def-button mgt-2" @click="onBatchDeleteData">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onEditClass" class="def-button mgt-2">班级格式设置</el-button>
      </el-form-item>
      <div class="el-form-right fr">
        <el-form-item>
          <el-button @click="onImport" class="icon-button mgt-2"><i class="iconfont icon-daoru"></i><span class="mg-l">导入</span></el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="icon-button mgt-2" :loading="isExportLoading" @click="exportFile(-1, true)"><i class="iconfont icon-daochu"></i><span class="mg-l">导出</span></el-button>
        </el-form-item>
      </div>
    </template>
    </el-form>
    <el-table :data="tableData" ref="table" class="table-comp" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column align="center" prop="gradeFullName" width="120" label="年级名称"></el-table-column>
      <el-table-column align="center" prop="classFullName" label="班级名称" ></el-table-column>
      <el-table-column align="center" prop="classShortName" label="班级简称"></el-table-column>
      <el-table-column align="center" prop="headMaster" label="班主任"></el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <template v-if="yearAfter">
            <span class="opera" @click="onEdit(scope.row)">修改</span>
            <span class="delete" @click="onDelete(scope.row)">删除</span>
          </template>
          <template v-else>
            <span class="opera gray-color">修改</span>
            <span class="delete gray-color">删除</span>
        </template>
        </template>
      </el-table-column>
      <template slot="empty">
          <div v-if="loading">
          </div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <template v-if="defaultSchoolYearId">
                <p>您尚未新建年级班级，请点击“批量新增”按钮新建</p>
                <div class="add-button">
                  <el-button type="primary" @click="onAdd" class="def-button mgt-2" v-if="yearAfter">批量新增</el-button>
                  <el-button class="def-button mgt-2" v-else>批量新增</el-button>
                </div>
              </template>
              <template v-else>
                <p>请先新建当前学年学期</p>
              </template>
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
    <!-- 添加班级 -->
      <el-dialog
        class="dialog-comp"
        title="批量新增班级"
        width="600px"
        :visible.sync="addInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          ref="addForm"
          label-width="80px"
          size="small"
          class="class-dialog">
          <div class="alert-msg">
             <p>备注：</p>
             <p>请输入对应年级需批量新增的班级数</p>
           </div>
          <el-form-item label-width="40px" label="学期" class="school-year">
            <el-select
              v-model="defaultSchoolYearId"
              disabled 
              placeholder="请选择学期"
              clearable>
              <!-- <el-option v-for="item in allOperatorList" :key="item.uid" :label="item.operatorName" :value="item"></el-option> -->
              <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <div v-for="item in initData" :key="item.value">
              <div class="term-title">
                <span class="fl-title">{{item.name}}</span>
              </div>
             <!--  <el-checkbox-group v-model="checkList"> -->
              <div v-for="key in item.baseGradeList" :key="key.value" class="checkbox-dialog">
                  <!-- <el-checkbox :label="key.gradeName" v-model="key.checked" @change="handleChange"></el-checkbox> -->
                  <span class="grade-left" :class="{active: key.checked}">{{key.gradeName}}</span>
                  <el-input-number v-model="key.num" controls-position="right" @change="handleChange" :min="0"></el-input-number>
                  <!-- <el-input-number v-model="key.num" controls-position="right" :min="0" @change="handleChange"></el-input-number> -->
              </div>
              <!-- </el-checkbox-group> -->
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddIn">确 定</el-button>
          <el-button @click="addInDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 单个新增/修改班级 -->
      <el-dialog
        class="dialog-comp"
        :title="AEtitle"
        width="460px"
        :visible.sync="editInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postEditInData"
          :rules="rules"
          :label-position="labelPosition"
          ref="form"
          label-width="80px"
          size="small">
          <template>
            <div class="alert-msg">
             <p>备注：</p>
             <p>若未找到班主任，请在教师信息中添加教师，并将其设置为班主任</p>
           </div> 
            <!-- <el-alert
                title="若未找到班主任，请在教师信息中添加教师，并将其设置为班主任"
                type="warning"
                show-icon
                :closable="false">
             </el-alert> -->
         </template>
          <el-form-item label="学年" >
            <el-select
              v-model="defaultSchoolYearId"
              disabled 
              placeholder="请选择学年"
              clearable>
              <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在年级" prop="gradeFullName">
            <el-input
              v-model="postEditInData.gradeFullName"
              :disabled="true"
              placeholder="请输入所在年级" 
              v-if="postEditInData.classId"/>
            <el-select v-model="postEditInData.gradeFullName" placeholder="请选择年级" v-else>
              <el-option v-for="item in allGradeList" :key="item.uid"
                          :label="item.gradeName"
                          :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="classFullName">
            <el-input
              v-model="postEditInData.classFullName"
              placeholder="请输入班级名称"/>
          </el-form-item>
          <el-form-item label="班级简称" prop="classShortName">
            <el-input
              v-model="postEditInData.classShortName"
              placeholder="请输入班级简称"/>
          </el-form-item>
          <el-form-item label="班主任" prop="headMasterId">
            <el-select
              v-model="postEditInData.headMasterId"
              placeholder="请选择班主任"
              no-match-text=""
              filterable
              clearable
              >
              <div class="select-input">
                <el-input v-model="selectName" placeholder="请输入教师姓名"></el-input>
              </div> 
              <el-option v-for="item in currentHeadList" :key="item.uid"
                     :label="item.teacherInfo"
                     :value="item.uid"
                     :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmEditIn">确 定</el-button>
          <el-button @click="editInDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 班级格式设置 -->
      <el-dialog
        class="dialog-comp"
        title="班级格式设置"
        width="360px"
        :visible.sync="editClassNameDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postEditClassNameData"
          :label-position="labelPosition"
          ref="classForm"
          label-width="66px"
          size="small"
          class="edit-class-name">
          <el-form-item label="班级格式" prop="textFormat" class="text-format">
            <el-select
              v-model="postEditClassNameData.textFormat"
              placeholder="请选择班级格式">
              <!-- <el-option v-for="item in allOperatorList" :key="item.uid" :label="item.operatorName" :value="item"></el-option> -->
              <el-option v-for="item in format" :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bracketsFormat" label-width="0px" class="brackets-format">
            <el-checkbox v-model="postEditClassNameData.bracketsFormat">带括号</el-checkbox>
          </el-form-item>
          <el-form-item label="预览">
             <template v-if="postEditClassNameData.textFormat === 1">
               <template v-if="postEditClassNameData.bracketsFormat">
                 <p class="preview-format">一年级(1)班</p>
               </template>
               <template v-else>
                 <p class="preview-format">一年级1班</p>
               </template>
             </template>
             <template v-else-if="postEditClassNameData.textFormat === 2">
               <template v-if="postEditClassNameData.bracketsFormat">
                 <p class="preview-format">一年级(一)班</p>
               </template>
               <template v-else>
                 <p class="preview-format">一年级一班</p>
               </template>
             </template>
          </el-form-item>
          <el-form-item label="预览">
             <template v-if="postEditClassNameData.textFormat === 1">
               <template v-if="postEditClassNameData.bracketsFormat">
                 <p class="preview-format">一(1)班</p>
               </template>
               <template v-else>
                 <p class="preview-format">一1班</p>
               </template>
             </template>
             <template v-else-if="postEditClassNameData.textFormat === 2">
               <template v-if="postEditClassNameData.bracketsFormat">
                 <p class="preview-format">一(一)班</p>
               </template>
               <template v-else>
                 <p class="preview-format">一一班</p>
               </template>
             </template>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmClassIn">确 定</el-button>
          <!-- <el-button @click="editClassFormatDialog = true;editClassNameDialog = false" >确 定</el-button> -->
          <el-button @click="editClassNameDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 确认修改班级名称弹框 -->
      <el-dialog
        class="dialog-comp"
        title="确认修改班级名称"
        width="400px"
        :visible.sync="editClassFormatDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>修改后会覆盖原来所有班级名称，确定要修改吗？</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmClassIn">确 定</el-button>
          <el-button @click="editClassFormatDialog = false">取 消</el-button>
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
            <div class="alert-msg">
             <p>备注：</p>
             <p>年级名称、班级名称、简称为必填项；请勿修改年级名称，确保与系统中一致；班主任可不填，如需填写请确保在系统中教师信息中为班主任</p>
           </div> 
            <!-- <el-alert
                title="年级名称、班级名称、简称为必填项；请勿修改年级名称，确保与系统中一致；班主任可不填，如需填写请确保在系统中教师信息中为班主任"
                type="warning"
                show-icon
                :closable="false">
             </el-alert> -->
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
              <p>上传年级班级列表</p>
              <div class="upload-btn">
                <el-upload
                  ref="gradeInfo"
                  class="upload-demo"
                  :action="requestUrl"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-change="handleChangeUpload"
                  accept=".xls,.xlsx"
                  with-credentials
                  :file-list="fileList"
                  :auto-upload="false"
                  :limit="1"
                  :on-success="handSuccess"
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
      <!-- 删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="删除班级"
        width="392px"
        :visible.sync="deleteDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>是否确认删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmDelete">确 定</el-button>
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
      <!-- 批量删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="批量删除年级班级"
        width="360px"
        :visible.sync="deleteBatchDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>删除年级班级，将影响相关数据，是否确认批量删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onBatchDelete">确 定</el-button>
          <el-button @click="deleteBatchDialog = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import envConfig from '@/config'
import { autoDownloadUrl } from '@/utils'
import { getGradeAndClass, getBaseGrade, addGradeClass, getClassGrade, updateClassGrade, addSimpleClass, deleteClassGrade, getHeadMasterList, rename, downloadModel, deleteDownLoadFile, deleteBatchClass } from '../../store/api';
export default {
  name: 'GradeInfo',
  data () {
    return {
      delErrorFile: null,
      timer: null,
      timerError: null,
      isExportLoading: false,
      errorFile: null, // 错误文件路径
      requestUrl: envConfig.baseUrl,
      fileList: [],
      showFailFile: false,
      successNumber: 0, // 导入成功条数
      failNumber: 0, // 导入失败条数
      importFinishDialog: false, // 导入成功弹框
      baseUrl: envConfig.baseUrl, // 下载模板地址
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: null,  //学校id
      schoolYearId: null,   //选择学年
      defaultSchoolYearId: null,   //默认学年
      gradeId: null,   //选择年级
      classId: null,    //选择班级
      formInline: {},
      yearOptions: [],
      gradeOptions: [{gradeFullName: '全部年级',uid: null}],
      classOptions: [{classId: null, classFullName: '全部班级'}],
      gradeSimpleOptions: [],
      tableData: [],
      initData: [],
      allGradeList: [],
      headmasterOptions: [],
      format: [{
        label: '数字',
        value: 1,
      },{
        label: '汉字',
        value: 2,
      }],
      multipleSelection: [],
      deleteBatchDialog: false,   //批量删除
      AEtitle: '新增班级',
      postAddInData: {},
      postEditInData: {
        schoolYear: '',
        gradeFullName: '',
        classFullName: '',
        classShortName: '',
        headMasterId: '',
      },
      postEditClassNameData: {
        textFormat: 1,
        bracketsFormat: false,
      },
      rules: {
        gradeFullName: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        classFullName: [{ required: true, message: '该项内容不可为空', trigger: 'blur'},
                        { min: 1, max: 10, message: '班级名称限制10个字', trigger: 'blur' }],
        classShortName: [{ required: true, message: '该项内容不可为空', trigger: 'blur'},
                         { min: 1, max: 10, message: '简称限制10个字', trigger: 'blur' }],
      },
      addInDialog: false, // 新增班级
      editInDialog: false, //编辑班级
      deleteDialog: false,
      importDialog: false,   //导入
      editClassNameDialog: false, // 修改班级格式
      deleteItem: {},
      checkList: [],
      confirmLoading: false, // 按钮loading状态
      editClassFormatDialog: false,   //确认修改班级名称
      schoolInfoList: null,   // 学校信息
      currentSchool: null,   //当前学校
      yearAfter: true,       //当前学年之后的学年
      loading: false,
      allClassList: [{classId: null, classFullName: '全部班级'}],
      gradeObj: {},
      oldUid: '',
      selectName: '',
      currentHeadList: [],      //当前班主任列表
      num8: ''
    }
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  mounted () {
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId)
      this.getSchoolYear();
      this.getBaseGradeData();
    }
  },
  watch: {
    selectName (value) {
      this.filterFun(value)
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
          this.yearOptions = this.schoolYear;
           for (let item of this.yearOptions) {
             if(item.isDefault){
               this.schoolYearId = item;
               this.yearAfter = item.yearAfter;
               this.defaultSchoolYearId = item.uid;
               this.getGrade();
               this.getHeadMasterListData();
               break;
             }
           }
           let isLoading = this.yearOptions.some(data => data.isDefault);
           if(!isLoading) {
             this.$nextTick(() => {
                this.loading = false
             }) 
           }
           this.$nextTick(() => {
              this.$_hideLoading()
           }) 
          resolve()
        } else {
          this.$store.dispatch('SetSchoolYear').then(() =>{
            this.yearOptions = this.schoolYear;
           for (let item of this.yearOptions) {
             if(item.isDefault){
               this.schoolYearId = item;
               this.yearAfter = item.yearAfter;
               this.defaultSchoolYearId = item.uid;
               this.getGrade();
               this.getHeadMasterListData();
               break;
             }
           }
           let isLoading = this.yearOptions.some(data => data.isDefault);
           if(!isLoading) {
             this.$nextTick(() => {
                this.loading = false
             }) 
           }
           this.$nextTick(() => {
              this.$_hideLoading()
           }) 
            resolve()
          }).catch(() => {
            this.$_hideLoading()
            this.loading = false;
          })
        }
      })
    },
     //选择学年
    onChangeYear(value) {
      console.log(value);
      this.yearAfter = value.yearAfter;
      this.getGrade();
    },
    //获取年级
    getGrade(){
      this.$_showLoading();
      this.gradeOptions.splice(1, this.gradeOptions.length)
      this.classOptions.splice(1, this.classOptions.length)
      this.allClassList.splice(1, this.allClassList.length)
      this.gradeSimpleOptions.splice(0, this.gradeSimpleOptions.length)
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId.uid,
      }
      getGradeAndClass(queryParams).then(res =>{
        if(res.data && res.data.length > 0){
          this.gradeOptions.push(...res.data)
          this.gradeSimpleOptions.push(...res.data)
          for(let item of res.data) {
            this.gradeObj[item.uid] = item.classList
            this.classOptions.push(...item.classList)
            this.allClassList.push(...item.classList)
          }
        }
        this.gradeId = this.gradeOptions[0].uid;
        this.classId = this.classOptions[0].classId;
        this.$nextTick(() => {
            this.getClassGradeData();
            this.$_hideLoading()
        })
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading();
         this.loading = false;
      }) 
    },
    //获取班级
    changeGrade(value) {
      this.classOptions.splice(1, this.classOptions.length)
      if(value) {
        this.classOptions.push(...this.gradeObj[value])
      }else {
        this.classOptions.push(this.allClassList)
      }
      this.$nextTick(() => {
        this.classId = this.classOptions[0].classId;
        this.getClassGradeData();
      })
    },
    //查询年级初始化数据
    getBaseGradeData () {
      let queryParams = {
        schoolId: this.schoolId,
      }
      this.allGradeList = [];
      getBaseGrade(queryParams).then(res =>{
        if(res.data && res.data.length > 0) {
          for (let item of res.data) {
            if(item.baseGradeList && item.baseGradeList.length > 0) {
              for (let key of item.baseGradeList){
                key['num'] = 0;
                key['checked'] = false;
              }
            }
            this.allGradeList.push(...item.baseGradeList)
          }
          this.initData = Object.assign([], res.data);   
          console.log("this.allGradeList",this.allGradeList)
        }
        
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //查询班级数据
    getClassGradeData() {
      this.loading = true;
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
        'where.schoolYearId': this.schoolYearId.uid,
        'where.classId': this.classId,
        'where.gradeId': this.gradeId,
      };
      getClassGrade(queryParams).then(res =>{
         this.tableData = res.data.list;
         this.total = res.data.total;
         this.$nextTick(() => {
            this.loading = false;
         })
      }).catch(e =>{
         console.log(e);
         this.loading = false;
      }) 
    },
    onAdd () { // 新增班级
      this.addInDialog = true
      this.$nextTick(() => {
        if(this.$refs.addForm){
          this.$refs.addForm.clearValidate();
        }
      })
    },
    onSimpleAdd() {
      this.AEtitle = "新增班级"
      this.editInDialog = true
      this.postEditInData = {};
      this.selectName = '';
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
        let trueHeadmaster = this.headmasterOptions.filter(res => res.disabled)     //不能点击
        let falseHeadmaster = this.headmasterOptions.filter(res => !res.disabled)
        this.headmasterOptions = [...falseHeadmaster,...trueHeadmaster]
      }
      this.currentHeadList = [...this.headmasterOptions]
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onEdit (obj) { // 编辑班级
      this.AEtitle = "修改班级"
      this.postEditInData = {};
      this.oldUid = obj.headMasterId;
      this.selectName = '';
      this.postEditInData = Object.assign({}, obj);
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
        let trueHeadmaster = this.headmasterOptions.filter(res => res.disabled)     //不能点击
        let falseHeadmaster = this.headmasterOptions.filter(res => !res.disabled)
        this.headmasterOptions = [...falseHeadmaster,...trueHeadmaster]
      }
      this.currentHeadList = [...this.headmasterOptions]
      this.editInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
      /* this.getHeadMasterListData(); */
    },
    //查询班主任
    getHeadMasterListData() {
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.defaultSchoolYearId,
      }
      this.headmasterOptions.splice(0, this.headmasterOptions.length)
      getHeadMasterList(queryParams).then(res =>{
        if(res.data && res.data.length > 0){
           for (let item of res.data) {
            if(item.classFullName){
              item['disabled'] = true;
              item['teacherInfo'] = item.teacherName + '(' + item.classFullName + ')';
            }else {
              item['disabled'] = false;
              item['teacherInfo'] = item.teacherName
            }
          }
          this.headmasterOptions = [...res.data]; 
          console.log("99999",this.headmasterOptions)
        }
         
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //改变新增班级数
    handleChange(value) {
      console.log(value)
      for(let item of this.initData){
         for (let key of item.baseGradeList) {
            key['checked'] = false;
            if(key.num && key.num > 0) {
              key['checked'] = true;
            } 
        }
     }
    },
    //确认批量新增
    onConfirmAddIn () {
      this.$_showLoading()
      this.$nextTick(() => {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let gradeList = [];
            console.log("1111111111111111",this.initData, typeof this.initData)
            for(let item of this.initData){
              for (let key of item.baseGradeList) {
                if(key.num > 0) {
                  gradeList.push({gradeFullName: key.gradeName, classCount: key.num, stageType: key.stageType, stageGradeId: key.uid})
                }
              }
            }
            console.log("gradeList",gradeList)
            if(!gradeList|| gradeList.length <= 0){
              this.$message.error('请输入对应年级需批量新增的班级数');
              this.$nextTick(() => {
                  this.$_hideLoading()
              })
              return false;
            }
            let queryParams = {
              schoolYearId: this.defaultSchoolYearId,
              schoolId: this.schoolId,
              gradeList: [...gradeList],
            }
            addGradeClass(queryParams).then(res => {
                console.log(res);
                this.$message.success('新增成功');
                this.addInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.getGrade();
                /* this.getClassGradeData(); */
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
      })
    },
    //确定单个新增/修改
    onConfirmEditIn () {
      console.log("onConfirmEditIn",this.postEditInData);
      this.$_showLoading()
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let queryParams = {
              schoolYearId: this.defaultSchoolYearId,
              schoolId: this.schoolId,
              classShortName: this.postEditInData.classShortName,
              classFullName: this.postEditInData.classFullName,
              headMasterId: this.postEditInData.headMasterId,
            }
            if(this.postEditInData.classId) {
              queryParams['classId'] = this.postEditInData.classId
              console.log("edit",queryParams)
              updateClassGrade(queryParams).then(res => {
                console.log(res);
                this.$message.success('修改成功');
                this.editInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.updateHeadMasterList(this.postEditInData.headMasterId,this.postEditInData.classFullName,this.oldUid)
                this.getClassGradeData();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              }) 
            }else {
              queryParams['gradeId'] = this.postEditInData.gradeFullName
              console.log("add",queryParams)
              addSimpleClass(queryParams).then(res => {
                console.log(res);
                this.$message.success('新增班级成功');
                this.editInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                if(this.postEditInData.headMasterId) {
                   this.addHeadMasterList(this.postEditInData.headMasterId,this.postEditInData.classFullName)
                }
                this.getGrade();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              }) 
            }
          }else {
            this.$nextTick(() => {
                this.$_hideLoading()
            })
          }
        })
      })
    },
    //更新班主任列表
    updateHeadMasterList(uid,classFullName,oldUid) {
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
       for(let item of this.headmasterOptions) {
         if(uid) {
           if(oldUid === item.uid) {
             item['disabled'] = false;
             item['teacherInfo'] = item.teacherName;
           }
           if(item.uid === uid) {
              item['disabled'] = true;
              item['teacherInfo'] = item.teacherName + '(' + classFullName + ')';
           }
         }else {
           if(oldUid === item.uid) {
             item['disabled'] = false;
             item['teacherInfo'] = item.teacherName;
             break
           }
         }  
       } 
      }
    },
    //添加班主任列表
    addHeadMasterList(uid,classFullName) {
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
       for(let item of this.headmasterOptions) {
         if(item.uid === uid) {
            item['disabled'] = true;
            item['teacherInfo'] = item.teacherName + '(' + classFullName + ')';
            break;
          }
       }
      }
    },
    //修改班级格式
    onEditClass () {
      this.editClassNameDialog = true;
    },
    //确定修改班级格式
    onConfirmClassIn () {
      console.log("onConfirmClassIn",this.postEditClassNameData);
      this.$_showLoading()
      let bracketsFormat = null;
      if(this.postEditClassNameData.bracketsFormat){
        bracketsFormat = 1;
      }else {
        bracketsFormat = 0;
      }
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId : this.defaultSchoolYearId,
        format: this.postEditClassNameData.textFormat,
        buckets: bracketsFormat,
      }
      rename(queryParams).then(res => {
        console.log(res);
        this.$message.success('修改班级格式成功');
        this.editClassNameDialog = false;
        this.$nextTick(() => {
           this.$_hideLoading()
        })
        this.getGrade();
      }).catch(e =>{
        console.log(e);
        this.$_hideLoading()
      }) 
    },
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
    // 下载模板 -- 导出
    exportFile (downType, val) {
      const _this = this;
      if (downType === 1) {
        this.schoolYearId.uid = null;
      }
      const value = {
        'schoolId': this.schoolId,
        'schoolYearId': this.schoolYearId.uid
      }
      const params = {
        modelType: 4,
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
      this.requestUrl = this.baseUrl + '/batch/batchIn?modelType=4&bussinessParam=' + encodeURI(JSON.stringify(value));
      if (this.fileList.length > 0) {
        this.$_showLoading();
        this.$nextTick(() => {
          this.$refs.gradeInfo.submit();
        })
      } else {
        this.$message.warning('请先选择要导入的文件');
      }
    },
    handleChangeUpload (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    //删除
    onDelete (obj) {
      this.deleteItem =  Object.assign({}, obj);
      this.deleteDialog = true
    },
    //确定删除
    onConfirmDelete () {
      this.$_showLoading()
      deleteClassGrade(this.deleteItem.classId).then(res => {
        console.log(res);
        this.deleteDialog = false;
        this.$nextTick(() => {
           this.$_hideLoading()
        })
        this.$message.success('删除成功');
        if(this.deleteItem.headMasterId) {
          this.deleteHeadMasterList(this.deleteItem.headMasterId)
        }
        this.getGrade();
        /* this.getClassGradeData(); */
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      }) 
    },
    //删除班主任列表
    deleteHeadMasterList(uid) {
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
        for(let item of this.headmasterOptions) {
            if(item.uid === uid) {
              item['disabled'] = false;
              item['teacherInfo'] = item.teacherName;
              break
            }
        }
      }
    },
    //批量多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("multipleSelection",this.multipleSelection)
    },
    // 批量删除
    onBatchDeleteData (){
      this.deleteBatchDialog = true;
    },
    // 批量删除确定
    onBatchDelete () { 
      this.$_showLoading()
      let uids = [],headMasterIds = [];
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.map(item => { uids.push(item.classId) })
        this.multipleSelection.map(item => { 
          if(item.headMasterId) {
            headMasterIds.push(item.headMasterId) 
          }
        })
      }
      console.log(uids,"======",headMasterIds)
      let queryParams = uids.join()
      deleteBatchClass(queryParams).then(res => {
        console.log(res);
        this.$message.success('批量删除成功');
        this.deleteBatchDialog = false;
        if(headMasterIds.length > 0) {
          this.deleteBatchHeadMasterList(headMasterIds)
        }
        this.$nextTick(() => {
            this.$_hideLoading()
        }) 
        this.getGrade();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      })
      
    },
    //批量删除班主任列表
    deleteBatchHeadMasterList(headMasterIds) {
      console.log("---------headMasterIds---------",headMasterIds)
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
        for(let item of this.headmasterOptions) {
          for(let key of headMasterIds) {
            if(item.uid === key) {
              item['disabled'] = false;
              item['teacherInfo'] = item.teacherName;
              break
            }
          }
        }
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getClassGradeData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getClassGradeData();
    },
    //上传
    handleRemove(file, fileList) {
       console.log(file, fileList);
    },
    handSuccess (res) {
      this.$_hideLoading();
      this.importDialog = false;
      if (res.code === '00000000') {
        if (res.data.code === 0 || res.data.code === 1 ) {
          this.fileList.splice(0, this.fileList.length)
          this.getSchoolYear();
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
    //搜索过滤
    filterFun (name) {
      this.currentHeadList.splice(0, this.currentHeadList.length)
      if(this.headmasterOptions && this.headmasterOptions.length > 0) {
        if(name) {
          for (let i = 0; i < this.headmasterOptions.length; i++) {
            if (this.headmasterOptions[i].teacherName.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
              this.currentHeadList.push(this.headmasterOptions[i])
            }
          }
          if(!this.currentHeadList || this.currentHeadList.length <= 0) {
            this.currentHeadList.push({teacherInfo: '无数据', uid: 'no-data',disabled: true})
          }
        }else {
          this.currentHeadList = [...this.headmasterOptions]
        }
      } 
    }
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.grade-man {
  width: 100%;
  height: 100%;
  .grade-scroll {
    width: 100%;
    height: calc(100% - 50px);
    .grade-info {
      height: 100%;
      padding: 14px 20px 0;
      border-top: 1px solid $border-color;
      .add-button {
        margin-top: 20px
      }
      .btn-bg-DB {
        background-color: $button-color4;
      }
    }
  }  
}
.loading-height {
  height: 348px;
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
.grade-scroll {
  .__view {
    width: 100% !important;
  }
  .select-input-comp {
    .el-select {
      width: 168px;
    }
  }
}
.select-input {
  width: 168px;
  margin: 12px 20px 8px 20px;
}
</style>
  