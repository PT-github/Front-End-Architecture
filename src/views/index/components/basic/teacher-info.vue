<template>
<div class="teacher-scroll">
  <vue-scroll>
  <div class="teacher-info">
    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
      <el-form-item>
        <el-select v-model="schoolYearId" placeholder="请选择学年" @change="getTeacherData">
          <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="defaultSchoolYearId">
      <el-form-item>
        <el-input v-model="teacherName" placeholder="请输入教师姓名" @keyup.enter.native="getTeacherData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getTeacherData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAdd" class="def-button mgt-2">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="multipleSelection.length === 0" class="btn-bg-DB def-button mgt-2">删除</el-button>
        <el-button v-else class="def-button mgt-2" @click="onBatchDeleteData">删除</el-button>
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
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" class="table-comp">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
      <el-table-column align="center" prop="teacherName" label="教师姓名" ></el-table-column>
      <el-table-column align="center" prop="teacherNo" label="编号"></el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope" v-if="scope.row.userSex">
          {{ dicFormater('SYS_USER_INFO_SEX', scope.row.userSex) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="userMobile" label="手机号码" width="120"></el-table-column>
      <el-table-column align="center" label="职位" prop="positionName"></el-table-column>
      <el-table-column align="center" label="录入时间">
        <template slot-scope="scope">
          <p >{{ scope.row.addTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="离校时间">
        <template slot-scope="scope">
          <p >{{ scope.row.leaveTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isLeave" label="状态">
        <template slot-scope="scope">{{ scope.row.isLeave  ? '已离校' : '正常在校' }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.positionType === 'CJGLY'">
            <span class="grayt">修改</span>
            <span class="grayt">离校</span>
            <span class="grayt">删除</span>
          </template>
          <template v-else>
            <template v-if="scope.row.isLeave">
              <span class="grayt">修改</span>
              <span class="opera" @click="onEnterSchool(scope.row)">入校</span>
            </template>
            <template v-else>
              <span class="opera" @click="onEdit(scope.row)" >修改</span>
              <span class="opera" @click="onLeaveSchool(scope.row)">离校</span>
            </template>
            <span class="delete" @click="onDelete(scope.row)">删除</span>
            <!-- <i class="iconfont icon-xiugai"></i>
            <i class="iconfont icon-shanchu"></i> -->
        </template>
        </template>
      </el-table-column>
      <template slot="empty">
          <div v-if="loading">
          </div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p v-if="defaultSchoolYearId">暂无数据</p>
              <p v-else>请先新建当前学年学期</p>
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
    <!-- 添加/修改教师 -->
      <el-dialog
        class="dialog-comp"
        :title="AEIntitle"
        width="460px"
        :visible.sync="addEditInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          :rules="rules"
          :label-position="labelPosition"
          ref="form"
          label-width="80px"
          size="small">
         <template  v-if ="!postAddInData.uid">
           <div class="alert-msg">
             <p>备注：</p>
             <p>新增后将为用户创建账号，并给用户发送短信通知，若有教师同名，请作区分，如张三1，张三2</p>
           </div> 
         </template>

          <el-form-item label="学年" prop="schoolYearId">
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
          <el-form-item label="教师姓名" prop="teacherName">
            <el-input
              v-model="postAddInData.teacherName"
              placeholder="请输入教师姓名" />
          </el-form-item>
          <!-- <el-form-item label="教师编号" prop="teacherNo">
            <el-input :disabled="true"
              v-model="postAddInData.teacherNo"
              placeholder="请输入教师编号"/>
          </el-form-item> -->
          <el-form-item label="性别" prop="userSex">
            <el-radio-group v-model="postAddInData.userSex">
              <el-radio v-for="(item,index) of sexObj" :label="item.enumValue" :key="index">{{item.enumField}}</el-radio>
              <!-- <el-radio :label="2">女</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码" prop="userMobile">
            <template v-if = "!postAddInData.uid">
              <el-input 
                v-model="postAddInData.userMobile"
                placeholder="请输入手机号码"/>
            </template>
            <template v-else>
              <el-input :disabled="true"
                v-model="postAddInData.userMobile"
                placeholder="请输入手机号码"/>
            </template>
          </el-form-item>
          <el-form-item label="选择职位" prop="userPosition">
             <el-select v-model="postAddInData.userPosition" placeholder="请选择职位">
               <el-option-group
                v-for="group in userPositionList"
                :key="group.roleName"
                :label="group.roleName">
                <el-option
                  v-for="item in group.positionList"
                  :key="item.uid"
                  :label="item.positionName"
                  :value="item.positionType">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="班主任" prop="isHeadMaster">
            <el-radio-group v-model="postAddInData.isHeadMaster">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="addEditInDialog = false">取 消</el-button>
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
             <p>导入后将为用户创建账号，并给用户发送短信通知</p>
           </div> 
         </template>
          <div class="import-col">
            <label class="col-left">1</label>
            <div class="col-right">
              <p>下载导入模板</p>
              <div class="import-btn" @click="exportFile(0, true)">
                  <a href="javascript:void(0)"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
                </div>
              <!-- <div class="import-btn">
                <a download="导入模板" target="_self" :href="baseUrl + '/batch/batchDownOrOut?modelType=5&downType=0'"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
              </div> -->
            </div>
          </div>
          <div class="import-col">
            <label class="col-left">2</label>
            <div class="col-right">
              <p>上传教师列表</p>
              <div class="upload-btn">
                <el-upload
                  ref="teacherInfoUpload"
                  class="upload-demo"
                  :action="requestUrl"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-success="handSuccess"
                  :on-change="handleChange"
                  :auto-upload="false"
                  :file-list="fileList"
                  :limit="1"
                  with-credentials
                  accept=".xls,.xlsx"
                  :on-exceed="handleExceed"
                  >
                  <el-button size="small"><i class="iconfont icon-wenjianjia-1-copy"></i>浏览</el-button>
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
        title="删除教师"
        width="360px"
        :visible.sync="deleteDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <!-- <p class="message-title"><i class="iconfont icon-zanwushuju"></i>确定要删除吗？</p>
          <p class="message-content">删除该教师，将影响相关数据</p> -->
          <p>删除该教师，将影响相关数据，是否确认删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmDelete">确 定</el-button>
          <el-button @click="deleteDialog = false">取 消</el-button>
        </span>
      </el-dialog>

    <!-- 批量删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="批量删除教师"
        width="360px"
        :visible.sync="deleteBatchDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>删除教师，将影响相关数据，是否确认批量删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onBatchDelete">确 定</el-button>
          <el-button @click="deleteBatchDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 离校弹框 -->
      <el-dialog
        class="dialog-comp"
        title="离校确认"
        width="360px"
        :visible.sync="leaveSchoolDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>该教师离校，将影响相关数据，是否确定进行离校操作？</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmLeaveSchool">确 定</el-button>
          <el-button @click="leaveSchoolDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 入校弹框 -->
      <el-dialog
        class="dialog-comp"
        title="入校确认"
        width="360px"
        :visible.sync="enterSchoolDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postEnterInData"
          :rules="editRules"
          :label-position="labelPosition"
          ref="enterForm"
          label-width="80px"
          size="small">
          <el-form-item label="选择职位" prop="userPosition">
             <el-select v-model="postEnterInData.userPosition" placeholder="请选择职位">
               <el-option-group
                v-for="group in userPositionList"
                :key="group.roleName"
                :label="group.roleName">
                <el-option
                  v-for="item in group.positionList"
                  :key="item.uid"
                  :label="item.positionName"
                  :value="item.positionType">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmEnterSchool" >确 定</el-button>
          <el-button @click="enterSchoolDialog = false">取 消</el-button>
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
  </vue-scroll>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import envConfig from '@/config'
import { autoDownloadUrl } from '@/utils'
import { deleteDownLoadFile, getYear, addTeacher, updateTeacher, getTeacher, deleteTeacher, putDimission, deleteBatchTeacher, getRolePosition, putEnterSchool, downloadModel } from '../../store/api';
import { checkTel } from '@/utils/validator'
export default {
  name: 'TeacherInfo',
  data () {
    return {
      isExportLoading: false,
      requestUrl: envConfig.baseUrl, // 导入请求地址处理
      showFailFile: false,
      importFinishDialog: false,
      successNumber: 0,
      failNumber: 0,
      fileList: [],
      baseUrl: envConfig.baseUrl, // 下载模板地址
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: 9,  //学校id
      schoolYearId: null,  //选择学年
      defaultSchoolYearId: null,   //默认学年
      teacherName: null,   //教师名字
      yearOptions: [],
      value: '1',
      formInline: {},
      tableData: [],
      multipleSelection: [],
      sexObj: [],
      postAddInData: {
        schoolYearId: '',
        teacherName: '',
        userSex: '',
        userMobile: '',
        userPosition: '',
      },
      postAddInDataDouble: {
        schoolYearId: '',
        teacherName: '',
        userSex: '',
        userMobile: '',
        userPosition: '',
      },
      postEnterInData: {
        userPosition: '',
      },
      userPositionList: [],   //职位列表
      addEditInDialog: false, // 编辑添加教师
      AEIntitle: '新增教师',
      rules: {
        teacherName: [{ required: true, message: '该项内容不可为空', trigger: 'blur'},
                      { min: 1, max: 10, message: '教师姓名限制10个字', trigger: 'blur' }],
        userMobile: [{ required: true, message: '该项内容不可为空', trigger: 'blur'},
                     { validator: checkTel, trigger: 'blur' }],
        userPosition: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
      },
      editRules: {
        userPosition: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
      },
      deleteDialog: false,
      timer: null,
      deleteBatchDialog: false,   //批量删除
      importDialog: false,   //导入
      leaveSchoolDialog: false,   //离校
      enterSchoolDialog: false,    //入校
      enterItem: {},    //入校
      deleteItem: {},    //删除
      dimissionItem: {},   //离校
      confirmLoading: false, // 按钮loading状态
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      loading: false,
      delErrorFile: null,
      timerError: null,
      errorFile: null // 错误文件路径
    }
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  mounted () {
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.sexObj = this.dicFormater("SYS_USER_INFO_SEX");
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId,this.sexObj)
      this.getSchoolYear();
      this.getRolePositionList();
    }
  },
  methods: {
     //查询学年
    getYearData () {
      getYear().then(res =>{
         if(res.data && res.data.length > 0){
           this.yearOptions = res.data;
           for (let item of this.yearOptions) {
             if(item.isDefault){
               this.schoolYearId = item.uid;
               this.defaultSchoolYearId = item.uid;
               this.postAddInDataDouble['schoolYearId'] = item.uid;
               break;
             }
           } 
           this.getTeacherData();
         }
      }).catch(e =>{
         console.log(e);
      }) 
    },
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
               this.schoolYearId = item.uid;
               this.defaultSchoolYearId = item.uid;
               this.getTeacherData();
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
               this.schoolYearId = item.uid;
               this.defaultSchoolYearId = item.uid;
               this.getTeacherData();
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
    //查询教师列表
    getTeacherData () {
      this.loading = true;
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolId': this.schoolId,
        'where.schoolYearId': this.schoolYearId,
      };
      this.teacherName && (queryParams['where.teacherName'] = this.teacherName.trim())
      getTeacher(queryParams).then(res =>{
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
    //获取学校角色以及对应职务
    getRolePositionList() {
      getRolePosition().then(res => {
        let userPositionList = res.data;
        if(userPositionList && userPositionList.length > 0) {
          this.userPositionList = userPositionList.filter(res => res.roleType !== 'CJADMIN');
        }else {
          this.userPositionList = null;
        }
        console.log("this.userPositionList",this.userPositionList)
      }).catch(e =>{
         console.log(e);
      }) 
    },
     getRoleFu(value) {
      let role;
      for(let item of this.userPositionList){
        for(let key of item.positionList) {
          if(value === key.positionType){
            role = item;
            break;
          }
        }
      }
      return role;
    },
    onAdd () { // 新增教师
      this.AEIntitle = '新增教师';
      if(this.$refs.form){
          this.$refs.form.resetFields();
      }
      /* this.postAddInData = this.postAddInDataDouble; */
      this.postAddInData = {
        schoolYearId: this.defaultSchoolYearId,
        teacherName: '',
        userSex: '',
        userMobile: '',
        userPosition: '',
      }
      this.addEditInDialog = true
      this.$nextTick(() => {
        if(this.$refs.form){
          this.$refs.form.clearValidate();
        }
      })
    },
    onEdit (obj) { // 编辑教师
      this.AEIntitle = '编辑教师';
      this.postAddInData = {};
      obj['userPosition'] = obj.positionType;
      this.postAddInData = Object.assign({}, obj);
      this.postAddInData['schoolYearId'] = this.schoolYearId;
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    //确定新增或者编辑
    onConfirmAddEditIn () {
      console.log("1111111111111111",this.postAddInData);
      this.$_showLoading()
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let role = this.getRoleFu(this.postAddInData.userPosition);
            let queryParams = {
              schoolId: this.schoolId,
              teacherName: this.postAddInData.teacherName.trim(),
              userSex: this.postAddInData.userSex,
              userMobile: this.postAddInData.userMobile.trim(),
              schoolYearId: this.defaultSchoolYearId,
              positionType: this.postAddInData.userPosition,
              roleType: role.roleType,
            };
            if (this.postAddInData.uid) {
              queryParams['uid'] = this.postAddInData.uid;
              updateTeacher(queryParams).then(res => {
                console.log(res);
                this.$message.success('修改成功');
                this.addEditInDialog = false;
                this.getTeacherData();
                this.$nextTick(() => {
                   this.$_hideLoading()
                })
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              }) 
              
            } else {
              addTeacher(queryParams).then(res => {
                console.log(res);
                this.$message.success('新增成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                   this.$_hideLoading()
                })
                this.getTeacherData();
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
    // 下载模板---导出
    exportFile (downType, val) {
      let _this = this;
      if (downType === 1) {
        this.schoolYearId = null;
      }
      const value = {
        'schoolId': this.schoolId,
        'schoolYearId': this.schoolYearId
      }
      const params = {
        modelType: 5,
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
    //确定上传
    onConfirmImport () {
      const value = {
        'schoolId': this.schoolId
      }
      this.requestUrl = this.baseUrl + '/batch/batchIn?modelType=5&bussinessParam=' + encodeURI(JSON.stringify(value));
      if (this.fileList.length > 0) {
        this.$_showLoading()
        this.$nextTick(() => {
          this.$refs.teacherInfoUpload.submit();
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
    handSuccess (res) {
      this.$_hideLoading()
      this.importDialog = false;
      if (res.code === '00000000') {
        if (res.data.code === 0 || res.data.code === 1) {
          this.fileList.splice(0, this.fileList.length)
          this.importFinishDialog = true;
          this.getTeacherData();
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
    //删除
    onDelete (obj) {
      this.deleteItem = Object.assign({}, obj)
      this.deleteDialog = true
    },
    //确定删除
    onConfirmDelete () {
      this.$_showLoading()
      deleteTeacher(this.deleteItem.uid).then(res => {
        console.log(res);
        this.deleteDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        }) 
        this.$message.success('删除成功');
        this.getTeacherData();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      }) 
    },
    //批量多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("multipleSelection",this.multipleSelection)
    },
    // 批量删除
    onBatchDeleteData (){
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].positionType === 'CJGLY') {
          this.$message.error('超级管理员暂时不支持删除操作')
          return
        }
      }
      this.deleteBatchDialog = true;
    },
    // 批量删除确定
    onBatchDelete () { 
      this.$_showLoading()
      let uids = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.map(item => { uids.push(item.uid) })
      }
      console.log(uids)
      let queryParams = {
        uids: uids.join(),
        schoolId: this.schoolId,
      }
      deleteBatchTeacher(queryParams).then(res => {
        console.log(res);
        this.$message.success('批量删除成功');
        this.deleteBatchDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        }) 
        this.getTeacherData();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      })
      
    },
    //离校
    onLeaveSchool( obj ) {
      this.leaveSchoolDialog = true;
      this.dimissionItem = Object.assign({}, obj);
    },
    //离校确定
    onConfirmLeaveSchool() {
      this.leaveSchoolDialog = false;
      this.$_showLoading()
      putDimission(this.dimissionItem.uid).then(res => {
        console.log(res);
        this.leaveSchoolDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        }) 
        this.$message.success('离校设置成功');
        this.getTeacherData();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      }) 
    },
    //入校
    onEnterSchool(obj) {
      this.enterSchoolDialog = true;
      this.enterItem = Object.assign({}, obj); 
      this.postEnterInData = {};
      this.$nextTick(() => {
        this.$refs.enterForm.clearValidate();
      })
    },
    //入校确定
    onConfirmEnterSchool() {
       console.log("enterItem",this.postEnterInData)
       this.$nextTick(() => {
        this.$refs.enterForm.validate((valid) => {
          if (valid) {
            this.$_showLoading()
            let role = this.getRoleFu(this.postEnterInData.userPosition);
            let queryParams = {
              schoolId: this.schoolId,
              teacherName: this.enterItem.teacherName,
              userSex: this.enterItem.userSex,
              userMobile: this.enterItem.userMobile,
              schoolYearId: this.defaultSchoolYearId,
              positionType: this.postEnterInData.userPosition,
              roleType: role.roleType,
              uid: this.enterItem.uid
            };
            putEnterSchool(queryParams).then(res => {
              console.log(res);
              this.enterSchoolDialog = false;
              this.$nextTick(() => {
                  this.$_hideLoading()
              }) 
              this.$message.success('入校设置成功');
              this.getTeacherData();
            }).catch(e => {
              console.log(e);
              this.$_hideLoading()
            })
          }
        })
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
    handleRemove(file, fileList) {
       console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.teacher-scroll{
   width: 100%;
   height: calc(100% - 50px);
  .teacher-info {
    padding: 14px 20px 0;
    border-top: 1px solid $border-color;
    height: 100%;
    .btn-bg-DB {
      background-color: $button-color4;
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
.teacher-scroll {
  .__view {
    width: 100% !important;
  }
}
</style>
