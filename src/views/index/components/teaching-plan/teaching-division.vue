<template>
  <div class="teaching-info">
    <s-title :title="'教学分工'"></s-title>
    <div class="tooltip">
      <i class="el-icon-warning"></i>
      <span>操作说明：点击教师可添加课程任课教师</span>
    </div>
    <div class="teaching-info-content">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
        <el-form-item>
          <el-select v-model="formInline.termId" placeholder="请选择学期" @change="onChangeSchoolYear">
            <template v-if="yearTermList && yearTermList.length > 0">
              <el-option v-for="item in yearTermList" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <div class="el-form-right the-form-operate fr">
          <el-form-item>
            <el-button v-if="!teacherVision" class="operate-top-color first-color" @click="onSeeTeacherVision">查看教师视角</el-button>
            <el-button v-if="teacherVision" class="operate-top-color first-color" @click="onCloneTeacherVision">查看任课视角</el-button>
            <el-button class="operate-top-color second-color" @click="onEarlyWarningSet">预警设置</el-button>
          </el-form-item>
          <el-form-item v-if="!teacherVision">
            <div class="operation">
              <el-button class="operate-top-btn has-btn-border" @click="onImport">
                <i class="iconfont icon-daoru"></i>
                <span>导入</span>
              </el-button>
              <el-button class="operate-top-btn has-btn-border" @click="onExport">
                <i class="iconfont icon-daochu"></i>
                <span>导出</span>
              </el-button>
              <div class="select-box" v-if="exportDialog">
                <div class="select-item account" @click="exportFile(7, -1, true)">
                  任课数据(模板1)
                </div>
                <div class="select-item" @click="exportFile(8, -1, true)">
                  任课统计(模板2)
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div v-if="!teacherVision" class="teaching-info-data">
        <div class="left">
          <vue-scroll>
            <p class="title">班级列表</p>
            <ul class="first-c">
              <li :class="{'grade-active': item.uid === gradeState && item.isUnfold}" v-for="(item, index) in subClassList" :key="index + 'grade'" @click="onChangeUnfold(item)">
                <div class="grade-first">
                  <span>{{item.gradeFullName}}</span>
                  <i v-if="item.isUnfold" class="el-icon-arrow-down"></i>
                  <i v-else class="el-icon-arrow-right"></i>
                </div>
                <ul class="second-c" v-if="item.classList && item.classList.length > 0 && item.isUnfold">
                  <li :class="{'active': a.classId === gradeIndex}" v-for="(a, i) in item.classList" :key="i + 'abc'" @click.stop="onChangeIndex(item, a)">{{a.classFullName}}</li>
                </ul>
              </li>
            </ul>
          </vue-scroll>
        </div>
        <div class="right">
          <el-table :data="tableData" v-loading="loading" key='firstTable' border style="width: 100%" :height="firstTableHeight" class="table-comp th-table-comp">
            <el-table-column align="center" prop="subjectName" label="课程" ></el-table-column>
            <el-table-column align="center" width="300px" prop="baseTeacherClassRelList" label="教师">
              <template slot-scope="scope">
                <div v-if="scope.row.baseTeacherClassRelList && scope.row.baseTeacherClassRelList.length > 0">
                  <div v-for="(item, index) in scope.row.baseTeacherClassRelList" :key="index + 'dd'">
                    <p v-if="scope.row.baseTeacherClassRelList[index].teacherName" :class="{'border-bottom': scope.row.baseTeacherClassRelList.length >= 2, 'hasborder': index === 1}">
                      {{ scope.row.baseTeacherClassRelList[index].teacherName }}                      
                      <el-popover
                        placement="right"
                        width="400"
                        popper-class="teaching-popover"
                        trigger="hover">
                        <div class="teaching-tooltip">
                          <vue-scroll>
                          <p v-if="scope.row.baseTeacherClassRelList[index].alarmTypeOne === 1">{{scope.row.baseTeacherClassRelList[index].teacherName}}单周课节数合计超过<b>{{scope.row.baseTeacherClassRelList[index].secondValueOne}}</b>节 共<b>{{scope.row.baseTeacherClassRelList[index].firstValueOne}}</b>节</p>
                          <ul v-if="scope.row.baseTeacherClassRelList[index].alarmTypeOne === 1">
                            <li v-for="(x, i) in scope.row.baseTeacherClassRelList[index].aaaList" :key="i + '_srs'">
                              <span>{{x.className}}</span>
                              <span>{{x.subjectName}}</span>
                              <span>{{x.weekCourse}}</span>
                            </li>
                          </ul>
                          <p v-if="scope.row.baseTeacherClassRelList[index].alarmTypeThree === 3">{{scope.row.baseTeacherClassRelList[index].teacherName}}任教科目数超过<b>{{scope.row.baseTeacherClassRelList[index].secondValueThree}}</b>科 共<b>{{scope.row.baseTeacherClassRelList[index].firstValueThree}}</b>科</p>
                          <ul v-if="scope.row.baseTeacherClassRelList[index].alarmTypeThree === 3">
                            <li v-for="(x, i) in scope.row.baseTeacherClassRelList[index].bbbList" :key="i + '_srs'">
                              <span>{{x.className}}</span>
                              <span>{{x.subjectName}}</span>
                              <span> </span>
                            </li>
                          </ul>
                          <p v-if="scope.row.baseTeacherClassRelList[index].alarmTypeFour === 4">{{scope.row.baseTeacherClassRelList[index].teacherName}}跨年级任教级数超过<b>{{scope.row.baseTeacherClassRelList[index].secondValueFour}}</b>个 共<b>{{scope.row.baseTeacherClassRelList[index].firstValueFour}}</b>级</p>
                          <ul v-if="scope.row.baseTeacherClassRelList[index].alarmTypeFour === 4">
                            <li v-for="(x, i) in scope.row.baseTeacherClassRelList[index].cccList" :key="i + '_srs'">
                              <span>{{x}}</span>
                              <span> </span>
                              <span> </span>
                            </li>
                          </ul>
                          </vue-scroll>
                        </div>
                        <i slot="reference" v-if="scope.row.baseTeacherClassRelList[index].showValue && !teacherVision" class="el-icon-warning teaching-warning"></i>
                      </el-popover>
                    </p>
                  </div>
                </div>
                <div v-else-if="scope.row.courseTotal !== 0" @click="onSelectTeacher(scope.row)" class="no-click">请选择</div>
                <div v-else class="no-click">无法选择</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="baseTeacherClassRelList" label="任教课时数">
              <template slot-scope="scope">
                <div v-if="scope.row.baseTeacherClassRelList && scope.row.baseTeacherClassRelList.length > 0">
                  <div v-for="(item, index) in scope.row.baseTeacherClassRelList" :key="index + 'cc'">
                    <p v-if="scope.row.baseTeacherClassRelList[index].weekCourse" :class="{'border-bottom': scope.row.baseTeacherClassRelList.length >= 2, 'hasborder': index === 1}">
                      {{ scope.row.baseTeacherClassRelList[index].weekCourse }}
                    </p>
                  </div>
                </div>
                <div v-else class="no-click">无数据</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="courseTotal" label="周课时数"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <span class="opera" @click.stop="onEditTeachPlan(scope.row, scope)">编辑</span>
                <span class="delete" @click.stop="onDelete(scope.row)">清除</span>
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
      </div>
      <!-- 教师视角 -->
      <div v-if="teacherVision" class="teaching-vision-data">
        <!-- <div class="teaching-vision-header">
          <span>教师视角</span>
          <i class="el-icon-close" @click="onCloneTeacherVision"></i>
        </div> -->
        <div class="teaching-vision-content">
          <el-table :data="teacherVisionsList" key='secondTable' :height="secondTableHeight" style="width: 100%" class="table-comp left-teacher-table">
            <el-table-column align="center" width="80px" type="index" label="序号" ></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" width="200px" prop="teacherName" label="教师姓名" ></el-table-column>
            <el-table-column prop="teacherClassDtoList" label="任课情况">
              <template slot-scope="scope">
                <p>
                  共<b style="font-weight: 600;" :class="{'week-show': scope.row.weekShow}">{{scope.row.courseTotal ? scope.row.courseTotal : 0}}</b>节;
                  <span v-for="(item, index) in scope.row.teacherClassDtoList" :key="index + '_jt'">（{{item.className}}【<span :class="{'week-show': scope.row.gradeShow}">{{item.subjectName}}</span>】{{item.weekCourse}}节）<b v-if="index !== scope.row.teacherClassDtoList.length - 1" style="font-weight: normal;">、</b></span>
                </p>
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
          <div class="right-total">
            <vue-scroll>
              <div class="title">剩余任课<span style="color: #ED5666;">{{remaindingDivisionsList.remainingCourseTotal ? remaindingDivisionsList.remainingCourseTotal : 0}}</span>节</div>
              <div class="explain">
                <span>任课</span>
                <span>剩余节数</span>
              </div>
              <el-collapse v-if="remaindingDivisionsList.remainderClassDivisionDtoList && remaindingDivisionsList.remainderClassDivisionDtoList.length > 0" v-model="activeName" accordion>
                <el-collapse-item v-for="(item, index) in remaindingDivisionsList.remainderClassDivisionDtoList" :key="index + '_ser'" :title="item.className" :name="item.className">
                  <ul v-if="item.remainderSubjectDivisionDtoList && item.remainderSubjectDivisionDtoList.length > 0" class="right-total-ul">
                    <li v-for="(a, i) in item.remainderSubjectDivisionDtoList" :key="i + 'poiu'">
                      <span>{{a.subjectName}}</span>
                      <span>{{a.remainingCourse}}</span>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改教学分工 -->
    <el-dialog
      class="dialog-comp"
      title="修改教学分工"
      width="460px"
      :visible.sync="editTeachPlanDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        class="edit-teach-plan"
        :model="postAddInData"
        :rules="rules"
        ref="form"
        label-width="40px"
        size="small">
        <el-form-item label="班级">
          <el-select v-model="postAddInData.classFullName" disabled>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="postAddInData.subjectName" disabled>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="postAddInData.baseTeacherClassRelList && postAddInData.baseTeacherClassRelList.length > 0">
          <div v-for="(item, index) in postAddInData.baseTeacherClassRelList" :key="index + 'teachers'">
            <template v-if="item.opType !== 3">
              <el-form-item class="teacher-line" label="教师">
                <el-select v-model="item.teacherId" filterable>
                  <template>
                    <el-input style="padding: 0 10px;" v-model="serchTeacherName" placeholder="请输入老师名称查询" />
                  </template>
                  <el-option-group
                    v-for="group in allTeacherList"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.childrenList"
                      :key="item.uid + '_sy'"
                      :label="item.teacherName"
                      :value="item.uid"
                      :disabled="item.disabled">
                    </el-option>
                  </el-option-group>
                </el-select>
                <!-- <el-input v-model="item.weekCourse">
                  <template slot="append">
                    <div class="operate">
                      <i class="el-icon-arrow-up" @click="onJiajia(item)"></i>
                      <i class="el-icon-arrow-down" @click="onJianjian(item)"></i>
                    </div>
                  </template>
                </el-input> -->
                <el-input-number class="teacher-division-adn" v-if="index === 0 && postAddInData.baseTeacherClassRelList.length === 1" v-model="item.weekCourse" controls-position="right" :min="0" :max="postAddInData.courseTotal"></el-input-number>
                <el-input-number class="teacher-division-adn" v-if="index === 0 && postAddInData.baseTeacherClassRelList.length === 2" v-model="item.weekCourse" controls-position="right" :min="0" :max="postAddInData.courseTotal - postAddInData.baseTeacherClassRelList[index + 1].weekCourse"></el-input-number>
                <el-input-number class="teacher-division-adn" v-if="index === 1 && postAddInData.baseTeacherClassRelList.length === 2" v-model="item.weekCourse" controls-position="right" :min="0" :max="postAddInData.courseTotal - postAddInData.baseTeacherClassRelList[index - 1].weekCourse"></el-input-number>
                <span v-if="index === 0" class="teacher-add" @click="onAddTeacherLine()">添加</span>
                <span v-if="index !== 0" class="teacher-delete" @click="onDeleteTeacherLine(index)">删除</span>
              </el-form-item>
            </template>
          </div>
        </div>
        <div class="total-class">
          <span>周总课时数</span>
          <span>{{postAddInData.courseTotal}}</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="onConfirmEditTeachPlan">确 定</el-button>
        <el-button @click="editTeachPlanDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 预警设置 -->
    <el-dialog
      class="dialog-comp single-btn"
      title="预警设置"
      width="400px"
      :visible.sync="earlyWarningSettingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="early-warning-setting">
        <div class="class-text">
          <span class="title">预警指标</span>
          <span class="title">预警值</span>
          <span class="title">是否开启</span>
        </div>
        <div v-for="(item, index) in alarmQuotasList" :key="index + '_sy'" class="class-total">
          <span v-if="item.alarmType === 1">教师单周课节数</span>
          <span v-if="item.alarmType === 2">教师单天课节数</span>
          <span v-if="item.alarmType === 3">教师任课科目数</span>
          <span v-if="item.alarmType === 4">教师跨年级级数</span>
          <div v-if="item.alarmType === 1 || item.alarmType === 2" class="second"><el-input v-model="item.alarmValue"/>节</div>
          <div v-if="item.alarmType === 3" class="second"><el-input v-model="item.alarmValue"/>科</div>
          <div v-if="item.alarmType === 4" class="second"><el-input v-model="item.alarmValue"/>级</div>
          <el-switch
            v-model="item.isOpen"
            active-color="#2878FF">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="onConfirmEarlyWarningSet">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 选择教师 -->
    <el-dialog
      class="dialog-comp"
      :title="AETitle"
      width="400px"
      :visible.sync="selectTeacherDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="select-teacher">
        <div class="select-header">
          <el-input placeholder="请输入老师名称" v-model="searchContent"/>
          <el-button size="small" icon="el-icon-search" @click="searchTeacher">查 询</el-button>
        </div>
        <table class="select-table">
          <vue-scroll>
            <!-- <tr>
              <th>所属教研组</th>
              <th>教师名称</th>
            </tr> -->
            <tr v-for="item in teacherList" :key="item.uid" @click="onSelectedTeacher(item)">
              <td v-if="item.teacherGroups"><span>{{item.teacherName}}({{item.teacherGroups ? item.teacherGroups : '无'}})</span></td>
              <td v-if="!item.teacherGroups">{{item.teacherName}}</td>
            </tr>
          </vue-scroll>
        </table>
      </div>
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
        <p>是否确认清除该教学分工？</p>
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
        <template>
          <el-alert
              title="年级、班级、课程、教师均为必填项；请勿修改模板中年级、班级、课程，确保与系统中一致；导入后教师自动任教该班级该科目所有课节，如需修改，可在系统中手动修改"
              type="warning"
              show-icon
              :closable="false">
          </el-alert>
      </template>
        <div class="import-col">
          <label class="col-left">1</label>
          <div class="col-right">
            <p>下载导入模板</p>
            <div class="import-btn" @click="exportFile(6, 0, true)">
              <a href="javascript:void(0)"><i class="icon iconfont">&#xe6f1;</i>下载模板</a>
            </div>
          </div>
        </div>
        <div class="import-col">
          <label class="col-left">2</label>
          <div class="col-right">
            <p>上传教学分工列表</p>
            <div class="upload-btn">
              <el-upload
                ref="teachDivision"
                class="upload-demo"
                :action="requestUrl"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-change="handleChange"
                accept=".xls,.xlsx"
                with-credentials
                :file-list="fileList"
                :limit="1"
                :auto-upload="false"
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
import envConfig from '@/config'
import { mapGetters } from 'vuex'
// deleteDownLoadFile
import { autoDownloadUrl } from '@/utils'
import { deleteDownLoadFile, downloadModel, getYearTermList, getSubClassList, getTeacherDivisionList, getTeachingGroupTeacher, teacherDivisionAdd, teacherDivisionUpdate, teacherDivisionDelete, getAlarmQuotasList, alarmQuotasUpdate, getTeacherVisionsList, getRemaindingDivisions } from '@/views/index/store/api'
export default {
  name: 'TeachingDivision',
  data () {
    return {
      requestUrl: envConfig.baseUrl,
      errorFile: null, // 错误文件路径
      delErrorFile: null, // 要删除的错误文件路径
      fileList: [],
      showFailFile: false,
      successNumber: 0, // 导入成功条数
      failNumber: 0, // 导入失败条数
      importFinishDialog: false, // 导入成功弹框
      baseUrl: envConfig.baseUrl, // 下载模板地址
      firstTableHeight: '100%',
      secondTableHeight: '100%',
      formInline: {
        schoolYearId: '',
        termId: '',
        state: true
      },
      schoolId: null,
      activeName: '1',
      loading: true,
      btnLoading: false,
      yearTermList: [],
      subClassList: [], // 年级班级列表
      teacherList: [], // 老师列表
      allTeacherList: [], // 所有老师列表
      teacherVisionsList: [], // 教师视角列表
      alarmQuotasList: [], // 预警设置列表
      searchContent: null,
      tableData: [],
      gradeState: '',
      gradeIndex: '',
      selectTeacherDialog: false,
      earlyWarningSettingDialog: false, // 预警
      editTeachPlanDialog: false, // 修改教学计划
      deleteDialog: false,
      deleteItem: {},
      postAddInData: {},
      rules: {},
      timer: null,
      timerError: null,
      importDialog: false, // 导入
      exportDialog: false, // 导出
      teacherVision: false, // 教师视角
      AETitle: '',
      myIndex: null,
      serchTeacherName: null
    }
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  mounted () {
    this.initData();
  },
  // destroyed () {
  //   clearTimeout(this.timer);
  // },
  watch: {
    searchContent () {
      this.searchTeacher()
    },
    serchTeacherName (val) {
      getTeachingGroupTeacher({schoolId: this.schoolId, schoolYearId: this.formInline.schoolYearId, isLeave: false, teacherName: val ? val.replace(/\s+/g,"") : null}).then(res => {
        if (res) {
          this.allTeacherList = JSON.parse(JSON.stringify([]))
          let hash = []
          res.data.forEach(item => {
            if (item.teacherGroups && !hash.includes(item.teacherGroups)) {
              hash.push(item.teacherGroups)
            }
          })
          hash.push('未分组')
          hash.forEach(a => {
            this.allTeacherList.push({label: a, childrenList: []})
          })
          res.data.forEach(x => {
            if (!x.teacherGroups) {
              this.allTeacherList.find(c => {return c.label === '未分组'}).childrenList.push(x)
            }
            if (x.teacherGroups) {
              this.allTeacherList.find(c => {return c.label === x.teacherGroups}).childrenList.push(x)
            }
          })
          this.allTeacherList.forEach((j, k) => {
            if (j.label === '未分组' && j.childrenList.length <= 0) {
              this.allTeacherList.splice(k, 1)
            }
          })
          if (this.allTeacherList.length <= 0) {
            this.allTeacherList = [{label: '未分组', childrenList: [{teacherName: '无数据', uid: null, disabled: true}]}]
          }
          console.log(this.allTeacherList)
        }
      })
    }
  },
  methods: {
    initData () {
      this.schoolId = this.$store.state.user.currentSchool ? this.$store.state.user.currentSchool.uid : null
      this.getYearTerm().then(() => {
        if (this.yearTermList.length > 0) {
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getRemainding().then(() => {})
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
                  this.$_hideLoading()
                })
              })
            })
          })
        }
      })
      .catch(() => {
        this.loading = false;
      })
    },
    searchTeacher () {
      getTeachingGroupTeacher({schoolId: this.schoolId, schoolYearId: this.formInline.schoolYearId, isLeave: false, teacherName: this.searchContent ? this.searchContent.replace(/\s+/g,"") : null}).then(res => {
        if (res) {
          this.teacherList = JSON.parse(JSON.stringify([]))
          let hash = []
          let arr = []
          res.data.forEach(item => {
            if (item.teacherGroups && item.teacherGroups.indexOf(this.selectTeacherRowObj.subjectName) >= 0) {
              hash.splice(hash.length, 0, item)
            } else {
              arr.push(item)
            }
          })
          hash.splice(arr.length, 0, ...arr)
          this.teacherList = hash
        }
      })
    },
    /**
     * 教师列表查询
     */
    getTeacherList () {
      getTeachingGroupTeacher({schoolId: this.schoolId, schoolYearId: this.formInline.schoolYearId, isLeave: false}).then(res => {
        if (res) {
          this.allTeacherList = JSON.parse(JSON.stringify([]))
          this.teacherList = res.data
          let hash = []
          res.data.forEach(item => {
            if (item.teacherGroups && !hash.includes(item.teacherGroups)) {
              hash.push(item.teacherGroups)
            }
          })
          hash.push('未分组')
          hash.forEach(a => {
            this.allTeacherList.push({label: a, childrenList: []})
          })
          res.data.forEach(x => {
            if (!x.teacherGroups) {
              this.allTeacherList.find(c => {return c.label === '未分组'}).childrenList.push(x)
            }
            if (x.teacherGroups) {
              this.allTeacherList.find(c => {return c.label === x.teacherGroups}).childrenList.push(x)
            }
          })
          // console.log(this.allTeacherList)
          // res.data && res.data.length > 0 && this.allTeacherList.push(...res.data)
        }
      })
    },
    /**
     * 切换学年学期
     * 获取年级
     * 获取年级对应的课时数据
     */
    onChangeSchoolYear () {
      let schoolId = this.yearTermList.find(item => { return item.uid === this.formInline.termId }).schoolYearid
      this.formInline.schoolYearId = schoolId
      this.getSubClass(schoolId).then(() => {
        this.getTeacherDivision()
      })
      this.getTeacherVisions().then(() => {})
    },
    /**
     * 初始化学年学期信息
     */
    getSchoolYear () {
      return new Promise(resolve => {
        if (this.schoolYear && this.schoolYear.length > 0) {
          resolve(this.schoolYear)
        } else {
          this.$store.dispatch('SetSchoolYear').then(data => {
            resolve(data)
          }).catch(() => {
            this.$_hideLoading()
          })
        }
      })
    },
    /**
     * 获取学年学期数据
     */
    getYearTerm () {
      return getYearTermList({schoolId: this.schoolId}).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (item.isSelected) {
              this.formInline.schoolYearId = item.schoolYearid
              this.formInline.termId = item.uid
            }
          })
          if (!this.formInline.schoolYearId && !this.formInline.termId) {
            this.formInline.schoolYearId = res.data[res.data.length - 1].schoolYearid
            this.formInline.termId = res.data[res.data.length - 1].uid
          }
          this.yearTermList = res.data
        } else {
          this.$message.error('请维护年级信息')
          this.loading = false
        }
      })
    },
    /**
     * 科目查询年级班级
     */
    getSubClass (id = 1) {
      return getSubClassList({schoolId: this.schoolId, schoolYearId: id})
        .then(res => {
          if (res.data) {
            if (this.$route.query.classId && this.$route.query.gradeId) {
              // this.gradeState = parseInt(this.$route.query.classId)
              // this.gradeIndex = parseInt(this.$route.query.gradeId)
              this.gradeState = parseInt(this.$route.query.gradeId)
              this.gradeIndex = parseInt(this.$route.query.classId)
              res.data.forEach((item) => {
                if (item.uid === parseInt(this.$route.query.gradeId)) {
                  item.isUnfold = true
                } else {
                  item.isUnfold = false
                }
              })
            } else {
              this.gradeState = res.data[0].uid
              this.gradeIndex = res.data[0].classList[0].classId
              res.data.forEach((item, index) => {
                if (index === 0) {
                  item.isUnfold = true
                } else {
                  item.isUnfold = false
                }
              })
            }
            this.subClassList = res.data
          }
        })
        .catch(() => {
          this.subClassList = JSON.parse(JSON.stringify([]))
        })
    },
     onChangeUnfold (obj) {
      obj.isUnfold = !obj.isUnfold
      this.gradeState = obj.uid
    },
    onChangeIndex (obj, item) {
      this.gradeState = obj.uid
      this.gradeIndex = item.classId
      this.getTeacherDivision()
    },
    /**
     * 教师分工查询
     */
    getTeacherDivision () {
      this.loading = true
      this.tableData = JSON.parse(JSON.stringify([]))
      if (this.subClassList && this.subClassList.length <= 0) {
        this.gradeState = null
        this.gradeIndex = null
      }
      return getTeacherDivisionList({
        termId: this.formInline.termId ? this.formInline.termId : null,
        gradeId: this.gradeState,
        classId: this.gradeIndex
      }).then((res) => {
        if (res) {
          this.tableData = res.data
          this.tableData.forEach(x => {
            if (x.baseTeacherClassRelList && x.baseTeacherClassRelList.length > 0) {
              x.baseTeacherClassRelList.forEach(y => {
                this.alarmQuotasList.forEach(a => {
                  if (a.isOpen && a.alarmType === 1) {
                    if (y.weekCourseTotal > a.alarmValue) {
                      y.firstValueOne = y.weekCourseTotal
                      y.secondValueOne = a.alarmValue
                      y.showValue = true
                      y.alarmTypeOne = a.alarmType
                      let aaa = this.teacherVisionsList.find(c => { return c.teacherId ===  parseInt(y.teacherId)})
                      y.aaaList = aaa ? aaa.teacherClassDtoList : null
                    }
                  }
                  if (a.isOpen && a.alarmType === 3) {
                    if (y.subjectTotal > a.alarmValue) {
                      y.firstValueThree = y.subjectTotal
                      y.secondValueThree = a.alarmValue
                      y.showValue = true
                      y.alarmTypeThree = a.alarmType
                      let bbb = this.teacherVisionsList.find(c => { return c.teacherId ===  parseInt(y.teacherId)})
                      let obj = {}
                      y.bbbList = bbb.teacherClassDtoList.reduce((cur, next) => {
                        obj[next.subjectName] ? "" : obj[next.subjectName] = true && cur.push(next)
                        return cur;
                      }, [])
                      // y.bbbList = bbb ? bbb.teacherClassDtoList : null
                    }
                  }
                  if (a.isOpen && a.alarmType === 4) {
                    if (y.gradeTotal > a.alarmValue) {
                      y.firstValueFour = y.gradeTotal
                      y.secondValueFour = a.alarmValue
                      y.showValue = true
                      y.alarmTypeFour = a.alarmType
                      let ccc = this.teacherVisionsList.find(c => { return c.teacherId ===  parseInt(y.teacherId)})
                      let obj = {}
                      let arr = []
                      arr = ccc.teacherClassDtoList.reduce((cur, next) => {
                        obj[next.classId] ? "" : obj[next.classId] = true && cur.push(next)
                        return cur;
                      }, [])
                      let newarr = []
                      this.subClassList.forEach(x => {
                        x.classList.forEach(y => {
                          arr.forEach(m => {
                            if (m.classId === y.classId) {
                              console.log(m)
                              console.log(y)
                              console.log(x)
                              if (newarr.indexOf(x.gradeFullName) === -1) {
                                newarr.push(x.gradeFullName)
                              }
                            }
                          })
                        })
                      })
                      // console.log(y.cccList)
                      y.cccList = newarr
                    }
                  }
                })
              })
            }
          })
          console.log(this.tableData)
          this.loading = false
          this.$_hideLoading()
        }
      }).catch(() => {this.loading = false})
    },
    /**
     * 教师视角列表查询
     */
    getTeacherVisions () {
      return getTeacherVisionsList({termId: this.formInline.termId}).then(res => {
        if (res.data) {
          this.teacherVisionsList = JSON.parse(JSON.stringify([]))
          res.data.forEach((item) => {
            this.alarmQuotasList.forEach(a => {
              if (a.isOpen && a.alarmType === 1) {
                if (item.courseTotal > a.alarmValue) {
                  item.weekShow = true
                } else {
                  item.weekShow = false
                }
              }
              if (a.isOpen && a.alarmType === 3 && item.teacherClassDtoList && item.teacherClassDtoList.length > 0) {
                let hash = [];
                for (var i = 0; i < item.teacherClassDtoList.length; i++) {
                  if (!hash.includes(item.teacherClassDtoList[i].subjectName)) {
                    hash.push(item.teacherClassDtoList[i].subjectName)
                  }
                }
                if (hash.length > a.alarmValue) {
                  item.gradeShow = true
                } else {
                  item.gradeShow = false
                }
              }
            })
          })
          this.teacherVisionsList = JSON.parse(JSON.stringify(res.data))
        }
      })
    },
    /**
     * 教师剩余任课节数
     */
    getRemainding () {
      return getRemaindingDivisions({termId: this.formInline.termId}).then(res => {
        if (res) {
          this.remaindingDivisionsList = JSON.parse(JSON.stringify({}))
          this.remaindingDivisionsList = JSON.parse(JSON.stringify(res.data))
          this.activeName = res.data.remainderClassDivisionDtoList[0] ? res.data.remainderClassDivisionDtoList[0].className : null
        }
      })
    },
    /**
     * 预警设置查询
     */
    getAlarmQuotas () {
      return getAlarmQuotasList({termId : this.formInline.termId}).then(res => {
        if (res) {
          this.alarmQuotasList = res.data
        }
      })
    },
    /**
     * 预警设置
     */
    onEarlyWarningSet () {
      getAlarmQuotasList({termId : this.formInline.termId}).then(res => {
        if (res) {
          this.alarmQuotasList = res.data
          this.earlyWarningSettingDialog = true
        }
      })
    },
    /**
     * 确认预警设置
     */
    onConfirmEarlyWarningSet () {
      this.btnLoading = true
      alarmQuotasUpdate(this.alarmQuotasList).then(res => {
        if (res) {
          // this.getTeacherDivision()
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
                  this.earlyWarningSettingDialog = false
                  this.btnLoading = false
                  this.$message.success('修改成功')
                })
              })
            })
          })
          // this.earlyWarningSettingDialog = false
          // this.$message.success('修改成功')
        }
      })
      .catch(() => {
        this.btnLoading = false
      })
    },
    /**
     * 请选择教师（行内）
     */
    onSelectTeacher (obj) {
      this.selectTeacherRowObj = obj
      this.AETitle = `选择教师—${obj.subjectName}`
      this.searchContent = null
      this.searchTeacher()
      this.selectTeacherDialog = true
    },
    /**
     * 确认选择教师（行内）
     */
    onSelectedTeacher (obj) {
      this.$_showLoading()
      let postObj = {
        schoolId: this.schoolId,
        termId: this.formInline.termId,
        classId: this.gradeIndex,
        subjectId: this.selectTeacherRowObj.subjectId,
        teacherId: obj.uid,
        teacherName: obj.teacherName,
        weekCourse: this.selectTeacherRowObj.courseTotal,
        opType: 1
      }
      teacherDivisionAdd(postObj).then(res => {
        if (res) {
          // this.getTeacherDivision()
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
                  this.$message.success('选择成功')
                  this.selectTeacherDialog = false
                  this.$_hideLoading()
                })
              })
            })
          })
          // this.initData()
          // this.$message.success('选择成功')
          // this.selectTeacherDialog = false
          // this.$_hideLoading()
        }
      })
      .catch(() => {
        this.selectTeacherDialog = false
      })
    },
    /**
     * 修改教学计划
     */
    onEditTeachPlan (obj, dk) {
      if (obj.baseTeacherClassRelList && obj.baseTeacherClassRelList.length === 0) {
        this.onSelectTeacher(obj)
        return false
      }
      this.myIndex = dk.$index
      console.log(this.tableData)
      this.serchTeacherName = null
      this.postAddInData = {}
      this.postAddInData = JSON.parse(JSON.stringify(obj))
      let o = this.subClassList.find(a => { return a.uid === this.gradeState})
      let c = o.classList.find(b => { return b.classId === this.gradeIndex })
      this.postAddInData.classFullName = c.classFullName
      console.log(o)
      console.log(c)
      console.log(11111)
      this.editTeachPlanDialog = true
    },
    /**
     * 修改教学计划确认
     */
    onConfirmEditTeachPlan () {
      let arr = []
      this.btnLoading = true
      this.postAddInData.baseTeacherClassRelList.forEach((item, index) => {
        if (item.opType !== 1 && item.opType !== 3) {
          item.opType = 2
        }
        item.schoolId = this.schoolId
        item.termId = this.formInline.termId
        item.classId = this.gradeIndex
        item.subjectId = this.postAddInData.subjectId
        if (item.opType === 3 && !item.uid) {
          console.log(index)
        } else {
          arr.push(item)
        }
      })
      teacherDivisionUpdate(arr).then(res => {
        if (res) {
          // this.getTeacherDivision()
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
                  this.$message.success('编辑成功')
                  this.editTeachPlanDialog = false
                  this.btnLoading = false
                })
              })
            })
          })
          // this.initData()
          // this.$message.success('编辑成功')
          // this.editTeachPlanDialog = false
          // this.btnLoading = false
        }
      })
      .catch(() => {
        // this.editTeachPlanDialog = false
        this.btnLoading = false
      })
    },
    /**
     * 添加弹框老师
    */
    onAddTeacherLine () {
      let obj = {
        teacherName: '',
        weekCourse: 0,
        teacherId: '',       
        opType: 1
      }
      if (this.postAddInData.baseTeacherClassRelList.length <= 1) { this.postAddInData.baseTeacherClassRelList.push(obj) }
    },
    /**
     * 删除弹框老师
    */
    onDeleteTeacherLine (i) {
      if (this.postAddInData.baseTeacherClassRelList && this.postAddInData.baseTeacherClassRelList.length > 0) {
        this.postAddInData.baseTeacherClassRelList[i].opType = 3
        if (this.postAddInData.baseTeacherClassRelList[i].uid) {
          this.postAddInData.baseTeacherClassRelList[i].opType = 3
        } else {
          this.postAddInData.baseTeacherClassRelList.splice(i, 1)
        }
      }
    },
    /**
     * 查看教师视角
     */
    onSeeTeacherVision () {
      this.$_showLoading({
        text: "加载中..."
      });
      this.getTeacherVisions().then(() => {
        this.getRemainding().then(() => {
          this.teacherVision = true
          this.$_hideLoading();
        })
      })
      .catch(() => {
        this.$_hideLoading();
      })
      // this.teacherVision = true
    },
    /**
     * 关闭教师视角
     */
    onCloneTeacherVision () {
      this.teacherVision = false
    },
    /**
     * 删除弹框
     */
    onDelete (obj) {
      this.deleteItem = obj
      this.deleteDialog = true
    },
    /**
     * 确认删除弹框
     */
    onConfirmDelete () {
      this.btnLoading = true
      let deleteObj = {
        termId: this.formInline.termId,
        classId: this.gradeIndex,
        subjectId: this.deleteItem.subjectId
      }
      teacherDivisionDelete(deleteObj).then(res => {
        if (res) {
          // this.getTeacherDivision()
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
                  this.$message.success('清除成功')
                  this.btnLoading = false
                  this.deleteDialog = false
                })
              })
            })
          })
          // this.initData()
          // this.deleteDialog = false
          // this.$message.success('清除成功')
        }
      })
      .catch(() => {
        this.btnLoading = false
        // this.deleteDialog = false;
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
    exportFile (modelType, downType, val) {
      let _this = this;
      const value = {
        'schoolId': this.schoolId,
        'termId': this.formInline.termId
      }
      const params = {
        modelType: modelType,
        downType: downType,
        bussinessParam: JSON.stringify(value)
      };
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
          }
        })
    },
    // 导入
    onImport () {
      this.fileList = [];
      this.importDialog = true;
    },
    // 导出
    onExport () {
      this.exportDialog = !this.exportDialog;
    },
    // 确定导入
    onConfirmImport () {
      const value = {
        'schoolId': this.schoolId,
        'termId': this.formInline.termId
      }
      this.requestUrl = this.baseUrl + '/batch/batchIn?modelType=6&bussinessParam=' + encodeURI(JSON.stringify(value));
      if (this.fileList.length > 0) {
        this.$_showLoading();
        this.$nextTick(() => {
          this.$refs.teachDivision.submit();
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
          // this.getTeacherDivision();
          this.getTeacherVisions().then(() => {
            this.getAlarmQuotas().then(() => {
              this.getTeacherList()
              this.getSubClass(this.formInline.schoolYearId).then(() => {
                this.getTeacherDivision().then(() => {
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
                })
              })
            })
          })
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.teaching-info {
  height: 100%;
  overflow: auto; 
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
  .teaching-info-content {
    height: calc(100% - 108px);
    padding: 8px 0 14px 0;
    .demo-form-inline {
      padding: 0 20px;
      .el-select {
        width: 210px;
      }
    }
    .teaching-info-data {
      height: calc(100% - 52px);
      display: flex;
      padding: 0 20px;
      .left {
        width: 210px;
        height: 100%;
        border: 1px solid $teaching-division-color3;
        .title {
          width: 190px;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid $teaching-division-color3;
          margin: 0 auto;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          padding-left: 5px;
        }
        .first-c {
          height: calc(100% - 51px);
          padding-top: 15px;
          li {
            padding: 12px 0 8px 28px;
            cursor: pointer;
            .grade-first {
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
            }
          }
          li:hover, li.grade-active {
            background: $teaching-division-color4;
          }
        }
        .second-c {
          li:hover, li.active {
            color: $teaching-division-color5;
          }
        }
      }
      .right {
        margin-left: 20px;
        width: calc(100% - 230px);
        // height: calc(100% - 120px);
        height: 100%;
      }
    }
  }
  .teaching-vision-data {
    height: calc(100% - 52px);
    .teaching-vision-header {
      width: 100%;
      height: 58px;
      background: $teaching-division-color4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 25px 0 20px;
      span, i {
        font-size: 16px;
        color: $color-font1;
        font-weight: 600;
      }
      i {
        color: $color-font1;
        cursor: pointer;
      }
    }
    .teaching-vision-content {
      height: calc(100% - 58px);
      display: flex;
      padding: 20px;
      .week-show {
        color: #ED5666; 
      }
      .left-teacher-table {
        width: calc(100% - 254px);
        margin-right: 20px;
      }
      .right-total {
        width: 234px;
        height: 100%;
        border: 1px solid $teaching-division-color3;
        border-radius: 2px;
        .title {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        .explain {
          width: 100%;
          height:44px;
          background: $teaching-division-color6;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: inline-block;
            box-sizing: border-box;
            width: 50%;
            text-align: center;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            &:first-child {
              border-right: 1px solid $teaching-division-color7;
            }
          }
        }
      }
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
.teaching-popover {
  width: 297px !important;
  height: 300px;
  background: rgba(0, 0, 0, 0.51);
  border: 1px solid rgba(235, 235, 235, 1);
  box-shadow: 0px 6px 3px 0px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  color: #fff;
  .popper__arrow::after {
    border-right-color: #000 !important;
  }
  .teaching-tooltip {
    width: 285px;
    height: 278px;
    .__vuescroll {
      .__view {
        padding: 0 15px 20px 8px;
        p {
          text-align: left;
          line-height: 1.5;
        }
        > ul
          li {
            display: flex;
            height: 40px;
            line-height: 40px;
            padding: 0 5px 0 8px;
            justify-content: space-around;
            > span {
              width: 30%;
              overflow: hidden;
            }
          }
      }
    }
  }
}
.the-form-operate {
  width: calc(100% - 230px);
  display: flex;
  justify-content: space-between;
  .operation {
    display: flex;
    justify-content: space-between;
    position: relative;
    .select-box {
      position: absolute;
      width: 150px;
      z-index: 1;
      top: 35px;
      right: 0;
      background: $layout-color4;
      border-radius: 0px 0px 4px 4px;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.4);
      .select-item {
        cursor: pointer;
        text-align: center;
        padding: 0 10%;
        height: 44px;
        line-height: 44px;
        &:hover {
          color: $layout-color4_4;
          background: $layout-color4_5;
        }
        &:first-child {
          border-bottom: 1px solid $layout-color4_6;
        }
      }
    }
  }
  .el-button {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
  }
  .has-btn-border:hover {
    border-color: $button-blue-color !important;
  }
  .operate-top-color {
    background-color: $teaching-division-color5;
    color: #fff;
    border: none;
  }
  .operate-top-btn {
    border: 1px solid $teaching-division-color3;
    background-color: #fff;
    span {
      margin-left: 4px;
    }
  }
  .first-color {
    background-color: $teaching-division-color5;
    margin-right: 10px;
  }
  .second-color {
    background-color: $teaching-division-color8;
  }
  .operate-top-btn:nth-child(2) {margin-left: 20px;}
}
.th-table-comp {
  // height: 100%;
  td { 
    position: relative;
    .cell {
      padding: 0;
    }
  }
  .no-click {
    color: $teaching-division-color10;
    cursor: pointer;
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .teaching-warning {
    color: $teaching-division-color9;
    position: absolute;
    margin: 5px 0 0 10px;
    .teaching-tooltip {
      .__vuescroll {
        .__view {
          padding: 20px 22px;
          p {
            text-align: left;
            line-height: 1.5;
          }
          > ul
            li {
              display: flex;
              height: 40px;
              line-height: 40px;
              justify-content: space-around;
              > span {
                width: 30%;
                overflow: hidden;
              }
            }
        }
      }
    }
    &:hover {
      .teaching-tooltip {
        display: block;
      }
    }
    .teaching-tooltip {
      width: 285px;
      height: 300px;
      background: rgba(0, 0, 0, 0.51);
      border: 1px solid rgba(235, 235, 235, 1);
      box-shadow: 0px 6px 3px 0px rgba(0, 0, 0, 0.03);
      border-radius: 3px;
      color: #fff;
      position: absolute;
      top: -14px;
      left: 26px;
      display: none;
      z-index: 1000000;
      &::before {
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border-width: 8px 10px 8px 0;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.51) transparent transparent;
        position: absolute;
        top: 12px;
        left: -10px;
      }
    }
  }
  .el-table__body-wrapper {
    height: calc(100% - 50px);
  }
  .border-bottom:nth-child(1) {
    padding-bottom: 10px;
  }
  .hasborder {
    padding-top: 10px;
    padding-bottom: 0px !important;
    border-top: 1px solid $teaching-division-color7;
  }
}
// 节次时间设置
.early-warning-setting {
  .class-text {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: $color-font1;
    font-size: 14px;
  }
  .class-total {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;
    .second {margin-right: 16px;}
    .el-input {
      width: 62px;
      position: relative;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .el-switch {
      margin-right: 24px;
    }
  }
}
.single-btn {
  .dialog-footer {
    .el-button {
      background-color: $dialog-color2;
      color: #fff;
      border: none;
      padding: 0;
      width: 80px;
      height: 32px;
    }
  }
}
.select-teacher {
  .select-header {
    display: flex;
    .el-input {
      width: 220px;
      .el-input__inner {
        height: 32px;
      }
    }
    .el-button {
      height: 32px;
      line-height: 0;
      margin-left: 25px;
    }
  }
  .select-table {
    width: 100%;
    display: inline-block;
    width: 330px;
    height: 260px;
    overflow: auto;
    margin: 20px 0;
    border: 1px solid $teaching-division-color3;
    box-sizing: border-box;
    tr {
      display: inline-block;
      width: 320px;
      td {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // background: #fff;
      }
    }
    td {
      text-align: left;
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    tr:hover {
      color: $teaching-division-color5;
    }
  }
}
.edit-teach-plan {
  .el-form-item {
    margin-bottom: 10px !important;
    .el-form-item__content {
      .el-select {
        width: 338px;
      }
    }
  }
  .teacher-line {
    .el-select {
      width: 200px !important;
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
            border-bottom: 1px solid $teaching-division-color3;
          }
        }
      }
    }
    .el-input-group {
      width: 80px;
      margin-left: 20px;
    }
    .el-input__inner {height: 32px;}
    .teacher-add {
      display: inline-block;
      padding-left: 8px;
      cursor: pointer;
      color: $teaching-division-color11;
    }
    .teacher-delete {
      display: inline-block;
      padding-left: 8px;
      cursor: pointer;
      color: $teaching-division-color9;
    }
  }
  .total-class {
    width: 380px; height: 40px;
    line-height: 40px;
    text-align: center;
    background: $teaching-division-color12;
    margin: 20px 0 10px 0;
    span:nth-child(1) {
      color: $color-font1;
    }
    span:nth-child(2) {
      color: $teaching-division-color13;
      font-size: 16px;
      padding-left: 20px;
    }
  }
}
.right-total {
  .el-collapse {
    .el-collapse-item {
      color: $color-font2;
      font-size: 14px;
      .el-collapse-item__content {
        padding-bottom: 0;
      }
      .el-collapse-item__header.is-active {
        border-bottom: 1px solid $teaching-division-color3;
      }
    }
    .el-collapse-item__header {
      padding: 0 40px 0 90px;
      color: $color-font1;
    }
  }
  .right-total-ul {
    li {
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
    }
  }
}
.teacher-division-adn {
  width: 100px;
  padding-left: 20px;
  line-height: 28px;
}
</style>
