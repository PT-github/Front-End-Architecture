<template>
  <div class="teaching-group">
    <s-title :title="'教研组信息'"></s-title>
    <div class="teaching-group-scroll">
    <vue-scroll>
    <div class="teaching-group-info">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item>
          <el-select v-model="schoolYearId" placeholder="请选择学年" @change="getStageGradeData">
            <el-option v-for="item in yearOptions" :key="item.uid"
                      :label="item.schoolYear"
                      :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="isSetting">
          <template v-if="paramValue === 1">
            <el-form-item label="学段:">
            <el-select v-model="selectPeriod" placeholder="请选择学段" @change="changePeriod">
              <el-option v-for="item in periodData" :key="item.objId"
                        :label="item.label"
                        :value="item.objId"></el-option>
            </el-select>
          </el-form-item>
          </template>
        <el-form-item>
          <el-input v-model="groupName" placeholder="请输入教师组名称" @keyup.enter.native="getTeachingGroupData"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getTeachingGroupData">查询</el-button>
        </el-form-item>
        <div class="el-form-right fr">
          <el-form-item>
            <el-button type="primary" @click="onAdd" class="def-button mgt-2">新增</el-button>
          </el-form-item>
        </div>
        </template>
      </el-form>

      <template v-if="isSetting">
      <div class="content">
         <template v-if="paramValue === 2">
        <div class="tree-comp">
          <vue-scroll>
            <!-- <el-tree :data="data" :props="defaultProps" default-expand-all @node-click="handleNodeClick" class="tree-remove-icon">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                    <i :class="node.icon"></i>{{ node.label }}
                </span>              
            </span>
            </el-tree> -->
            <ul class="first-node">
              <li v-for="(item, index) in data" :key="index + 'grade'" >
                <div class="node-col-f" :class="{'first-active': item.label === parameterFirst && item.isUnfold}" @click="onChangeUnfold(item)">
                  <i class="iconfont icon-wenjianjia-dakai"></i>
                  <span>{{item.label}}</span>
                </div>
                <ul class="second-node" v-if="item.children && item.children.length > 0 && item.isUnfold">
                  <li v-for="(node, i) in item.children" :key="i + 'node'" @click.stop="onChangeIndex(item, node)">
                    <div class="node-col-s" :class="{'active': node.objId === parameter}">
                      <i class="iconfont icon-ziji"></i>
                      <span>{{node.label}}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </vue-scroll>
        </div>
         </template>
        <div class="table-right" :class="{'table-width': paramValue === 2}">
          <el-table :data="tableData" ref="table" style="width: 100%" class="table-comp" v-loading="loading">
            <el-table-column align="center" prop="groupName" width="200" label="教研组"></el-table-column>
            <el-table-column align="center" prop="name" label="学段" v-if="paramValue === 1"></el-table-column>
            <el-table-column align="center" prop="name" label="年级" v-if="paramValue === 2"></el-table-column>
            <el-table-column align="center" label="教研组成员数" >
              <template slot-scope="scope">
                <span>{{scope.row.memberList.length}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="400">
              <template slot-scope="scope">
                <span class="opera" @click="onView(scope.row)">查看</span>
                <span class="opera" @click="onEdit(scope.row)">修改</span>
                <span class="delete" @click="onDelete(scope.row)">删除</span>
                <!-- <i class="iconfont icon-xiugai"></i>
                <i class="iconfont icon-shanchu"></i> -->
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
      </div>
      </template>

      <template v-if="!defaultSchoolYearId">
        <div class="no-data-comp">
          <div>
            <img src="../../../../assets/img/no-data.png">
            <p>请先新建当前学年学期</p>
          </div>
        </div>
      </template>

      </div>
    </vue-scroll>
    </div>

      <!-- 添加/编辑教研组信息 -->
      <el-dialog
        class="dialog-comp"
        :title="AEIntitle"
        width="400px"
        :visible.sync="addEditInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          :rules="rules"
          :label-position="labelPosition"
          ref="form"
          label-width="92px"
          size="small"
          class="teaching-group-dialog">
          <el-form-item label="学年" prop="schoolYearId">
            <el-select
              v-model="postAddInData.schoolYearId"
              disabled 
              placeholder="请选择学年"
              clearable>
              <!-- <el-option v-for="item in allOperatorList" :key="item.uid" :label="item.operatorName" :value="item"></el-option> -->
              <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教研组名称" prop="groupName">
            <el-select v-model="postAddInData.groupName" filterable allow-create placeholder="请选择教研组名称">
              <el-option
                v-for="item in teachingOptions"
                :key="item.uid"
                :label="item.subjectFullname"
                :value="item.subjectFullname">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="paramValue === 1">
          <el-form-item label="学段" prop="objId">
            <el-select v-model="postAddInData.objId" placeholder="请选择学段">
              <el-option v-for="item in data" :key="item.objId"
                        :label="item.label"
                        :value="item.objId"></el-option>
            </el-select>
          </el-form-item>
          </template>
          <template v-else-if="paramValue === 2">
          <el-form-item label="年级" prop="selectedOptions">
            <!-- <el-select v-model="postAddInData.objId" filterable placeholder="请选择年级">
              <el-option v-for="item in gradeOptions" :key="item.objId"
                     :label="item.gradeFullName"
                     :value="item.objId"></el-option>
            </el-select> -->
            <el-cascader
              :options="data"
              :show-all-levels="false"
              v-model="postAddInData.selectedOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          </template>
          <el-form-item label="教研组成员" prop="teacherGroup">
            <p><a @click="onSelectTeacher" class="add-member">请选择成员</a></p>
          </el-form-item>
          <template v-if="postAddInData.memberList && postAddInData.memberList.length > 0">
            <el-form-item prop="teacherGroup">
            <div class="group-input">
               <vue-scroll>
                  <span class="tags" v-for="(item,index) in postAddInData.memberList" :key="index">
                    <span class="tags-text">{{item.teacherName}}</span>
                    <i class="el-icon-close" @click="deleteEditSimple(item)"></i>
                  </span>
               </vue-scroll>
              <!-- <span class="add-icon" @click="onSelectTeacher"><i class="el-icon-circle-plus-outline"></i></span> -->
            </div>    
          </el-form-item>
        </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="addEditInDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 查看教研组信息 -->
      <el-dialog
        class="dialog-comp"
        title="查看教研组"
        width="400px"
        :visible.sync="viewDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          :rules="rules"
          :label-position="labelPosition"
          ref="viewForm"
          label-width="92px"
          size="small"
          class="teaching-group-dialog">
          <el-form-item label="学年" prop="schoolYearId">
            <el-select
              v-model="postAddInData.schoolYearId"
              disabled 
              placeholder="请选择学年"
              clearable>
              <!-- <el-option v-for="item in allOperatorList" :key="item.uid" :label="item.operatorName" :value="item"></el-option> -->
              <el-option v-for="item in yearOptions" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教研组名称" prop="groupName">
            <el-select v-model="postAddInData.groupName" filterable allow-create placeholder="请选择教研组名称" disabled>
              <el-option
                v-for="item in teachingOptions"
                :key="item.uid"
                :label="item.subjectFullname"
                :value="item.subjectFullname">
              </el-option>
            </el-select>
          </el-form-item>
           <template v-if="paramValue === 1">
          <el-form-item label="学段" prop="objId">
            <el-select v-model="postAddInData.objId" disabled placeholder="请选择学段">
              <el-option v-for="item in data" :key="item.objId"
                        :label="item.label"
                        :value="item.objId"></el-option>
            </el-select>
          </el-form-item>
          </template>
           <template v-else-if="paramValue === 2">
            <el-form-item label="年级" prop="selectedOptions">
            <!-- <el-select v-model="postAddInData.objId" filterable placeholder="请选择年级">
              <el-option v-for="item in gradeOptions" :key="item.objId"
                     :label="item.gradeFullName"
                     :value="item.objId"></el-option>
            </el-select> -->
              <el-cascader
                :options="data"
                :show-all-levels="false"
                disabled
                v-model="postAddInData.selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
           </template>
          <template v-if="postAddInData.memberList && postAddInData.memberList.length > 0">
            <el-form-item prop="teacherGroup" label="教研组成员">
            <div class="group-input">
               <vue-scroll>
                  <span class="tags" v-for="(item,index) in postAddInData.memberList" :key="index">
                    <span class="tags-text">{{item.teacherName}}</span>
                    <!-- <i class="el-icon-close" @click="deleteEditSimple(item)"></i> -->
                  </span>
               </vue-scroll>
              <!-- <span class="add-icon" @click="onSelectTeacher"><i class="el-icon-circle-plus-outline"></i></span> -->
            </div>    
          </el-form-item>
        </template>
        </el-form>
      </el-dialog>

      <!-- 选择成员 -->
      <el-dialog
        class="dialog-comp"
        title="选择成员"
        width="600px"
        ref="dialog"
        :visible.sync="selectDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="select-member">
          <div class="member-header">
            <el-input
              size="small"
              placeholder="请输入老师姓名"
              v-model="teacherName" @keyup.enter.native="getTeacherList">
            </el-input>
            <el-button icon="el-icon-search" size="small" @click="getTeacherList" class="icon-button pr-10">查询</el-button>
          </div>
          <div class="member-list">
            <div class="list-left">
               <ul class="th">
                  <li class="teacher-name">教师列表</li>
                  <li class="teacher-no">编号</li>
                  <li class="group-name">所在教研组</li>
                </ul>
               <div class="td">
                <vue-scroll>
                  <template v-if="teacherList && teacherList.length > 0">
                  <ul v-for="(item,index) in teacherList" :key="item.uid" @click="onSimpleSelect(item,index)" :class="{'color-gray': item.hasSelect}">
                    <li class="teacher-name">{{item.teacherName}}</li>
                    <li class="teacher-no">{{item.teacherNo}}</li>
                    <li class="group-name" v-if="item.teacherGroupLength && item.teacherGroupLength > 9">
                       <el-tooltip class="item" effect="dark" placement="right">
                          <div slot="content">
                            <p class="grade-tip">{{item.teacherGroups}}</p>
                          </div>
                          <span>{{item.shortTeacherGroup}}</span>
                        </el-tooltip>
                      </li>
                    <li class="group-name" v-else>{{item.teacherGroups}}</li>
                  </ul>
                  </template>
                </vue-scroll>
               </div>
            </div>
            <div class="list-right">
              <ul class="th">
                  <li class="select-name">已选择<span class="color-red">{{selectMemList.length}}</span></li>
                  <li class="delete-name" @click="deleteAll"><i class="iconfont icon-shanchu"></i></li>
              </ul>
              <div class="td">
                <vue-scroll>
                  <ul v-for="item in selectMemList" :key="item.uid" >
                    <li class="select-name">{{item.teacherName}}</li>
                    <li class="delete-name" @click="deleteSimple(item)"><i class="iconfont icon-shanchu"></i></li>
                  </ul>
                </vue-scroll>
              </div>
            </div>
          </div>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="onSelectMember">确 定</el-button>
          <el-button @click="selectDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="删除教研组"
        width="392px"
        :visible.sync="deleteDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>删除该教研组，将影响相关数据，是否确认删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmDelete" >确 定</el-button>
          <el-button @click="deleteDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 选择教研组弹窗 -->
      <el-dialog
        class="dialog-comp"
        title="请选择教研组类型"
        width="400px"
        :visible.sync="selectTeachingDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="select-box">
          <div class="select-setting" v-for="(item,index) in paramSetting" :key="index" :class="{active: index === selectIndex}" @click="togglePay(item,index)">
            <span class="triangle-topleft"></span>
            <i class="el-icon-check"></i>
            <p class="setting-top">{{item.paramTextTop}}</p>
            <p class="setting-bottom">{{item.paramTextBottom}}</p>
          </div>
          <!-- <div class="select-setting">
            <span class="triangle-topleft "></span>
            <i class="el-icon-check"></i>
            <p class="setting-top">按年级设置</p>
            <p class="setting-bottom">各年级可单独设置教研组</p>
          </div> -->
        </div>
        <span slot="footer" class="dialog-footer confirm-button">
          <el-button @click="onConfirmSelect">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getYear, getGradeAndClass, addTeachingGroup, getTeachingGroup, updateTeachingGroup, deleteTeachingGroup, getStageGrade, getTeachingGroupTeacher, getSubjects, getParam, setParam } from '../../store/api';
export default {
  name: 'TeachingGroupInfo',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      isSetting: null,      //是否设置教研组类型
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolId: 1,    //学校id
      schoolYearId: null,  //选择学年
      defaultSchoolYearId: null,   //默认学年
      formInline: {},
      yearOptions: [],
      groupName: null,  //教研组名称
      teachingOptions: [],
      data: [],
      periodData: [{label:'全部',objId: ''}],
      tableData: [],
      teacherList: [],
      postAddInData: {
        schoolYearId: '',
        groupName: '',
        memberList: [],
        selectedOptions: [],
        objId: '',
      },
      addEditInDialog: false, // 编辑添加教研组
      AEIntitle: '新增教研组',
      rules: {
        groupName: [{ required: true, message: '该项内容不可为空', trigger: 'change'},
                    { min: 1, max: 20, message: '教研组名称限制20个字', trigger: 'change' }],
        selectedOptions:  [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        objId:  [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
      },
      deleteDialog: false,
      selectDialog: false, //选择成员
      selectTeachingDialog: false,  //选择教研组类型
      teacherName: null,   //选择成员搜索老师姓名
      deleteItem: {},
      selectMemList: [],    //选中成员列表
      judgeUid: false,    ////选中成员uid
      parameter: null,    //当前选择的年级
      parameterFirst: null,   //当前选择的年级所属学段
      objType: null,   //当前选择的年级或者学段type
      objId: null,    //所属年级/学段/整个学校类型标识
      confirmLoading: false, // 按钮loading状态
      isRoot: false,
      isSelect: false,
      selectParam: null,
      selectIndex: null,
      paramValue: null,
      hasData: false,   //是否有数据
      paramSetting: [{
        paramTextTop: '按学段设置',
        paramTextBottom: '各学段单独设置教研组，不精确到年级',
        paramValue: 1,
        active: false,
      },{
        paramTextTop: '按年级设置',
        paramTextBottom: '各年级可单独设置教研组',
        paramValue: 2,
        active: false,
      }],
      selectPeriod: '',  //当前选中的学段
      gradeOptions: null, //年级
      viewDialog: false,
      selectedOptions: [],
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      loading: false,
    };
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
             }
           } 
           this.getParamData();
           this.getStageGradeData();
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
        if (this.schoolYear && this.schoolYear.length > 0) {
          this.yearOptions = this.schoolYear;
           for (let item of this.yearOptions) {
             if(item.isDefault){
               this.schoolYearId = item.uid;
               this.defaultSchoolYearId = item.uid;
               this.getParamData();
               break;
             }
           } 
          
          resolve()
        } else {
          this.$store.dispatch('SetSchoolYear').then(() =>{
            this.yearOptions = this.schoolYear;
            for (let item of this.yearOptions) {
              if(item.isDefault){
                this.schoolYearId = item.uid;
                this.defaultSchoolYearId = item.uid;
                this.getParamData();
                break;
              }
            }
            resolve()
          }).catch(() => {
            this.$_hideLoading()
          })
        }
      })
    },
    //获取年级
    getGrade(){
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId,
      }
      getGradeAndClass(queryParams).then(res =>{
        if(res.data && res.data.length > 0){
          for(let item of res.data){
            item['objId'] = item.uid;
          }
          this.gradeOptions = Object.assign({}, res.data);
        }else {
          this.gradeOptions = null;
        }
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //查询是否设置教研组类型
    getParamData(){
      let queryParams = {
        schoolId: this.schoolId,
        yearId: this.defaultSchoolYearId,
        paramType: 1,
      }
      getParam(queryParams).then(res => {
        console.log(res);
        if(res.data){
          this.paramValue = res.data.paramValue;
          this.getStageGradeData();
          this.hasData = res.data.hasData;
          if(this.paramValue === 1 || this.paramValue === 2){
            if(this.hasData){
              this.isSetting = true;
            }else {
              this.selectTeachingDialog = true;
              this.isSetting = false;
            }
          }else {
            this.selectTeachingDialog = true;
            this.isSetting = false;
          } 
        }else {
          this.selectTeachingDialog = true;
          this.isSetting = false;
        }
      }).catch(e =>{
         console.log(e);
      }) 
    },
    //切换教研组类型
    togglePay(item,index){	
      this.selectIndex = index;
      this.selectParam = Object.assign({}, item);
      this.paramValue = item.paramValue;
    },
    //设置教研组类型
    onConfirmSelect() {
      if(!this.selectParam){
        this.$message.error("请选择教研组类型");
        return false;
      }
      this.$_showLoading()
      let queryParams = {
        "paramType": 1,
        "paramValue": this.selectParam.paramValue,
        "schoolId": this.schoolId,
        "yearId": this.defaultSchoolYearId
      }
      setParam(queryParams).then(res => {
        console.log(res);
        this.selectTeachingDialog = false;
        this.isSetting = true;
        this.$nextTick(() => {
            this.$_hideLoading()
        })
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading()
      }) 
    },
    //查询学段年级
    getStageGradeData () {
      this.$_showLoading();
      this.loading = true;
      let queryParams = {
        schoolId: this.schoolId,
        schoolYearId: this.schoolYearId,
      }
      this.data.splice(0, this.data.length)
      this.periodData.splice(1, this.periodData.length)
      getStageGrade(queryParams).then(res =>{
         if(res.data && res.data.length > 0){
           this.data = res.data;
           this.periodData.push(...res.data)
           for (let item of this.data) {
             item['label'] = item.name;
             item['isUnfold'] = true;
             item['children'] = item.gradeList;
             item['objId'] = item.stageType;
             item['value'] = item.name;
             for (let key of item.children) {
               key['label'] = key.gradeFullName;
               key['objId'] = key.uid;
               key['value'] = key.uid;
             }
           }
           this.parameterFirst = this.data[0].label;
           if(this.paramValue === 1) {
              this.selectPeriod = this.periodData[0].objId;
              this.objId = this.selectPeriod;
              this.getTeachingGroupData(); 
           }else {
              for(let sItem of this.data) {
                if(sItem.children && sItem.children.length > 0) {
                    this.parameter = sItem.children[0].objId;
                    this.objType = sItem.children[0].objType;
                    this.objId = sItem.children[0].objId;
                    this.getTeachingGroupData(); 
                    break;
                }else {
                  this.$nextTick(() => {
                    this.tableData = [];
                    this.loading = false
                  })
                }
              }
           }
           console.log("getStageGrade",this.data,this.selectPeriod,this.parameter,this.objType,this.objId)
         }else {
           this.$nextTick(() => {
              this.loading = false;
           })
         }
         this.$nextTick(() => {
            this.$_hideLoading()
         })
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading()
         this.loading = false;
      }) 
    },
    //改变学段
    changePeriod(value) {
      console.log("changePeriod",value)
      this.selectPeriod = value;
      this.objId = this.selectPeriod;
      this.getTeachingGroupData(); 
    },
    //查询教研组列表
    getTeachingGroupData () {
      this.loading = true;
      this.tableData = [];
      if(this.paramValue === 1){
        this.objId = this.selectPeriod
      }else {
        this.objId = this.objId;
      }
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        'where.schoolYearId': this.schoolYearId,
        'where.schoolId': this.schoolId,
        'where.objId': this.objId,
        'where.objType': this.paramValue,
      };
      this.groupName && (queryParams['where.groupName'] = this.groupName.trim())
      getTeachingGroup(queryParams).then(res =>{
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
    handleNodeClick(data) {
      console.log(data);
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getTeachingGroupData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTeachingGroupData();
    },
    //展开收起
    onChangeUnfold (obj) {
      obj.isUnfold = !obj.isUnfold;
      this.data = Object.assign({}, this.data)
      this.parameterFirst = obj.label;  
    },
    //选中
    onChangeIndex (obj, item) {
      this.parameterFirst = obj.label;
      this.parameter = item.objId;
      this.objType = item.objType;
      this.objId = item.objId;
      this.getTeachingGroupData();
    },
    onAdd () { // 新增教研组
      this.AEIntitle = '新增教研组'
     this.postAddInData= {
        schoolYearId: '',
        groupName: '',
        memberList: [],
        selectedOptions: [],
        objId: '',
      },
      (this.yearOptions && this.yearOptions.length > 0) && (this.postAddInData['schoolYearId'] = this.defaultSchoolYearId);
      this.addEditInDialog = true
      this.$nextTick(() => {
        if(this.$refs.form){
          this.$refs.form.clearValidate();
        }
      })
      this.getSubjectsData();
      this.getTeacherList();
    },
    onEdit (obj) { // 编辑教研组
      this.AEIntitle = '编辑教研组';
      this.postAddInData = {};
      this.postAddInData = Object.assign({}, obj);
      let selectOption = this.getSelectOption(this.postAddInData.objId);
      this.postAddInData['selectedOptions'] = selectOption;
      console.log("44444444",this.postAddInData);
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
      this.getSubjectsData();
      this.getTeacherList();
    },
    getSelectOption(objId){
      let selectOption = [];
      for(let item of this.data){
        for(let key of item.children){
          if(objId === key.uid){
            selectOption.push(item.label,key.uid);
            console.log("0000000",selectOption);
            break;
          }
        }
      }
      return selectOption;
    },
    //查询科目
    getSubjectsData() {
      let queryParams = {
        yearId: this.postAddInData.schoolYearId,
        schoolId: this.schoolId,
      }
      getSubjects(queryParams).then(res => {
        if (res.data && res.data.length > 0 ){
          this.teachingOptions = res.data;
        }
      }).catch(e =>{
        console.log(e);
        this.$_hideLoading();
      })
    },
    //查询教师所属的教研组
    getTeacherList() {
      let queryParams = {
        schoolYearId: this.postAddInData.schoolYearId,
        schoolId: this.schoolId,
      };
      this.teacherName && (queryParams['teacherName'] = this.teacherName.trim())
       this.$_showLoading({
        /* target: this.$refs.dialog.$el, */
      });
      getTeachingGroupTeacher(queryParams).then(res => {
        console.log(res);
        this.teacherList = res.data;
        for(let item of this.teacherList) {
          if(item.teacherGroups) {
            let teacherGroups = item.teacherGroups.toString();
            item['teacherGroupLength'] = teacherGroups.length;
            if (teacherGroups.length > 9) {
              item['shortTeacherGroup'] = teacherGroups.substr(0,9) + "...";
            }
          }
        }
        this.$_hideLoading();
      }).catch(e =>{
        console.log(e);
        this.$_hideLoading();
      })
    },
    //教研组成员单个删除
    deleteEditSimple (delItem) {
      if (this.postAddInData.memberList && this.postAddInData.memberList.length > 0) {
        this.selectMemList = this.postAddInData.memberList.filter((data) => {
          return data.uid !== delItem.uid;     
        });
        this.postAddInData = Object.assign({}, this.postAddInData, {memberList: this.selectMemList});
      }
    },
    //选择成员弹窗
    onSelectTeacher () {
      this.selectDialog = true;
      /* this.getTeacherList(); */
      console.log("22222222222222222222",this.postAddInData);
      if (this.postAddInData.memberList && this.postAddInData.memberList.length > 0) {
        this.selectMemList = this.postAddInData.memberList;
        this.teacherList.forEach(res => {
          res['hasSelect'] = false
          this.selectMemList.forEach(data => {
            if(data.uid === res.uid) {
              res['hasSelect'] = true;
            }
          })
        })
      }else {
        this.selectMemList = [];
      }
    },
    //单个选择添加成员
    onSimpleSelect (item,index) {
      item['hasSelect'] = true;
      this.$set(this.teacherList, index, item)
      if(this.selectMemList && this.selectMemList.length > 0){
        this.judgeUid = this.selectMemList.some(res => res.uid === item.uid);
        if(!this.judgeUid){
          this.selectMemList.push(item);
        }
      }else {
        this.selectMemList.push(item);
      }
      console.log("3333333333333",this.selectMemList);
    },
    //选择成员删除所有
    deleteAll () {
      this.selectMemList = [];
      this.teacherList.forEach(res => res['hasSelect'] = false)
    },
    //选择成员成员单个删除
    deleteSimple (delItem) {
      for(let item of this.teacherList) {
        if(item.uid === delItem.uid) {
          item['hasSelect'] = false
          break;
        }
      }
      this.selectMemList = this.selectMemList.filter((data) => {
        return data.uid !== delItem.uid;     
      });
    },
    //确定选择成员
    onSelectMember () {
      console.log("8888888888",this.selectMemList); 
      this.$nextTick(() => {
        this.selectDialog = false;
         this.postAddInData = Object.assign({}, this.postAddInData, {memberList: this.selectMemList});
         console.log("9999999",this.postAddInData); 
      })
    },
    //确定添加或编辑教研组
    onConfirmAddEditIn () {
      console.log("1111111111111111",this.postAddInData);
      this.$_showLoading()
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let members = null;
            if(this.postAddInData.memberList && this.postAddInData.memberList.length > 0){
              members = this.postAddInData.memberList.map(item => item.uid).join();
            }
            if(this.paramValue === 1){
              this.objId = this.postAddInData.objId;
              /* this.selectPeriod = this.postAddInData.objId; */
            }else {
              this.objId = this.postAddInData.selectedOptions[1];
              this.parameter = this.postAddInData.selectedOptions[1];
              this.parameterFirst = this.postAddInData.selectedOptions[0];
            }
            let queryParams = {
              schoolId: this.schoolId,
              groupName: this.postAddInData.groupName,
              members: members,
              objType: this.paramValue,
              objId: this.objId,
            };
            if (this.postAddInData.uid) {
              queryParams['uid'] = this.postAddInData.uid;
              updateTeachingGroup(queryParams).then(res => {
                console.log(res);
                this.$message.success('修改成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.getTeachingGroupData();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              }) 

            } else {
              queryParams['schoolYearId'] = this.defaultSchoolYearId;
              addTeachingGroup(queryParams).then(res => {
                console.log(res);
                this.$message.success('新增成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                    this.$_hideLoading()
                })
                this.getTeachingGroupData();
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
    //删除弹窗
    onDelete (obj) {
      this.deleteItem = Object.assign({}, obj)
      this.deleteDialog = true
    },
    //确定删除弹窗
    onConfirmDelete () {
      this.deleteDialog = false;
      this.$_showLoading()
      deleteTeachingGroup(this.deleteItem.uid).then(res => {
        console.log(res);
        this.deleteDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        })
        this.$message.success('删除成功');
        this.getTeachingGroupData();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
      }) 
    },
    onView(obj) {
      this.postAddInData = {};
      this.postAddInData = Object.assign({}, obj);
      this.viewDialog = true;
      let selectOption = this.getSelectOption(this.postAddInData.objId);
      this.postAddInData['selectedOptions'] = selectOption;
      this.$nextTick(() => {
        this.$refs.viewForm.clearValidate();
      })
    },
    handleChange(value) {
      console.log("99999999",this.selectedOptions,value);
      /* this.parameterFirst = value[0];
      this.parameter = value[1]; */
    }
  }
}
</script>

<style lang="scss" scoped>
.teaching-group {
  width: 100%;
  height: 100%;
  .teaching-group-scroll {
    width: 100%;
    height: calc(100% - 50px);
  .teaching-group-info {
     height: 100%;
     padding: 14px 20px 0;
     border-top: 1px solid $border-color;
     .content {
       display: flex;
       height: 100%;
       .tree-comp {
         width: 210px;
         height: calc(100% - 149px);
         margin-right: 20px;
         border: 1px solid $menu-color2;
         padding-top: 10px;
         .first-node {
            margin: 0;  
            .second-node {
               margin: 0;  
               padding: 0 0 0 3.2em; 
            }  
            li {
              cursor: pointer;
              .node-col-f {
                height: 30px;
                line-height: 30px;
                color: $tree-color2;
                i {
                  padding: 0 0 0 1.2em;
                  margin-right: 8px;
                  color: $tree-color1;
                }
                span {
                  display: inline-block;
                  width: 70%;
                }
              }
              .node-col-s {
                height: 26px;
                line-height: 26px;
                color: $tree-color4;
                i {
                  margin-right: 8px;
                  color: $tree-color3;
                }
              }
              .node-col-f:hover, .first-active {
                background: $tree-color5;
              }
              .node-col-s:hover, .active {
                color: $tree-color6;
              }
            }
         }
       }
       .table-right {
         height: 100%;
         width: 100%;
       }
       .table-width {
         width: calc(100% - 210px);
       }
     }
  }
  }
  .select-member {
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.teaching-group-scroll {
  .__view {
    width: 100% !important;
  }
}
.confirm-button {
    .el-button {
      padding: 8px 23px!important;
    }
  }
.grade-tip {
    line-height: 24px;
    width:125px;
 }
 .el-tooltip__popper[x-placement^=right] .popper__arrow {
   border-right-color: $course-view-color4
 }
 .el-tooltip__popper[x-placement^=right] .popper__arrow::after {
   border-right-color: $course-view-color4
 }
 .el-tooltip__popper.is-dark {
   background: $course-view-color4
 }
</style>
