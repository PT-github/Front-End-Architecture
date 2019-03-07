<template>
  <div class="course-hand-arrange">
    <s-title :title="'手动调课'"></s-title>
    <div class="course-pre-arrange_content">
      <div class="operation-btn" @click="operateShow = true">操作记录</div>
      <div class="operation-btn preview" @click="preview">预览课表</div>
      <div class="operation-btn exp-class" @click="showExpClass">异常班级</div>
      <div style="width: 100%;height: 100%;min-height: 600px;">
        <div class="course-tips">
          <i class="iconfont icon-tishi"></i>
          操作提示：课程暂存区显示本班级剩余科目课时数，可以使用鼠标拖拽的方式互换、或填充暂存区和课表内的区块。
          <div class="btn" @click="autoSchedule">排课报告</div>
        </div>
        <div class="course-arrange-box">
          <!-- <div class="course-arrange_left">
            <div class="course-arrange_left-top">
              <div class="nav-title">
                <span class="txt">年级班级</span>
              </div>
              <div class="nav-tab-content">
                <GradeClassComp></GradeClassComp>
              </div>
            </div>
          </div> -->
          <div class="course-arrange_center">
            <div class="course-arrange_center-top">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="年级班级：">
                  <el-select v-model="formInline.gradeId" @change="changeGrade">
                    <el-option v-for="(item, index) in grades" :key="index + '_grades'" :label="item.gradeFullName" :value="item.uid"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formInline.classId" @change="changeClass">
                    <el-option v-for="(item, index) in classes" :key="index + '_classes'" :label="item.classFullName" :value="item.classId"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="clearBtn" @click="confirmDialog = true">
                <i class="iconfont icon-qingchu"></i>
                <span class="txt">清除微调</span>
              </div>
            </div>
            <div class="course-arrange_center-content">
              <CourseSchedule ref="CourseScheduleComp"></CourseSchedule>
            </div>
          </div>
          <div class="course-arrange_right">
            <div class="course-arrange_right-top">
              <span class="txt">课程暂存区</span>
              <!-- <span class="num">13</span> -->
            </div>
            <div class="course-arrange_right-content">
              <div class="course-arrange_right-content-top">
                <CourseStorage ref="CourseStorageComp"></CourseStorage>
              </div>
              <!-- <div class="reset-box">
                <div class="reset-btn" @click="reSchedule">重拍本班课表</div>
              </div> -->
              <div class="course-teach-panel">
                <TeachCourse ref="TeachCourseComp"></TeachCourse>
                <ExpClassTable ref="ExpClassTableComp" :list="excClassList" @exchangeClass="exchangeClass"></ExpClassTable>
              </div>
            </div>
          </div>
        </div>
        <div class="submit-next">
          <div class="color-panel">
            <div class="color-item can">
              <i class="square"></i>
              可以拖入
            </div>
            <div class="color-item force">
              <i class="square"></i>
              强行拖入(与预排规则冲突)
            </div>
            <div class="color-item canot">
              <i class="square"></i>
              禁止拖入
            </div>
          </div>
          <el-button size="small" @click="goPreArrange">返回预排</el-button>
          <el-button type="primary" size="small" @click="reArrangeDialog = true" plain>重排本班</el-button>
          <el-button type="primary" size="small" @click="finishClearDialog = true">完成排课</el-button>
        </div>
      </div>
    </div>
    <el-dialog class="dialog-comp" title="提示" width="360px" :visible.sync="confirmDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>确认清除
      </div>
      <div class="confirm-center">
        确认是否全部清除微调
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirm">确 定</el-button>
        <el-button @click="confirmDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <div class="operate-box" :class="{ hide: !operateShow}">
      <!-- <div class="operate-box_bg"></div> -->
      <div class="operate-box_content">
        <div class="operate-box_content-top">
          <span class="title">操作记录</span>
          <span class="iconfont icon-x" @click="operateShow = false"></span>
        </div>
        <div class="operate-box_content-list" @mouseleave="setStep(-1)">
          <template v-if="operateList && operateList.length > 0">
            <div class="operate-item"
              v-for="(item, index) in operateList"
              :key="index + '_operateList'"
              :class="{active: index < step}"
              @mouseover="setStep(index)"
              @click="resetOperate(index)"
              >
              <div class="operate-item_title">{{ item.stepContent }}</div>
              <!-- <div class="operate-item_desc">{{ item.operateInfoDesc }}</div> -->
            </div>
          </template>
          <template v-else>
            <div class="no-data">
              <img src="../../../../../assets/img/no-data_1.png" alt="无数据显示">
              <div class="txt">暂无操作记录</div>
            </div>
          </template>
        </div>
        <div class="operate-box_content-bottom">
          <span v-show="step !== 0">撤销{{step}}步操作</span>
        </div>
      </div>
    </div>
    <el-dialog class="dialog-comp" title="提示" width="380px" :visible.sync="reArrangeDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>提示?
      </div>
      <div class="confirm-center">
        是否确认重排本班课表
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reSchedule">确 定</el-button>
        <el-button @click="reArrangeDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="380px" :visible.sync="finishClearDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>提示?
      </div>
      <div class="confirm-center">
        是否完成排课，点确定，界面即将跳转至排课管理界面
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishFun">确 定</el-button>
        <el-button @click="finishClearDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <CourseReport ref="courseReportComp" :type="'hand-arrange'"></CourseReport>
  </div>
</template>
<script>
import { updateIsCourseStatus, updCourseStatus, courseReport, finishSchedule, selectManualAdjustInfos, manualAdjust, clearClassManualAdjust, undoManualAdjust, classReSchedule } from '../../../store/api'
import { deepCopy } from '@/utils'
import TeachCourse from './teach-course'
import GradeClassComp from './grade-class-comp'
import CourseSchedule from './course-schedule'
import CourseReport from './course-report'
import CourseStorage from './course-storage'
import ExpClassTable from './exp-class-table'
import envConfig from "@/config"; // base请求地址
export default {
  name: 'CourseHandArrange',
  data () {
    return {
      isPublish: '', // 该年级课表是否已发布
      // 问题班级列表
      excClassList: [],
      reArrangeDialog: false,
      finishClearDialog: false,
      operateList: [], // 操作记录列表
      step: 0, // 撤销步骤
      operateShow: false,
      confirmDialog: false,
      nums: 6,
      hasTips: true, // 提示框显示/隐藏
      params: {
        termId: '', // 学期
        schoolId: '', // 学校
        schoolYearId: '', // 学年
        gradeIds: '', // 年级字符串列表
        stageType: ''
      },
      classes: [], // 班级列表
      classIds: [], // 当前勾选年级下的所有班级ID集合
      classObj: {}, // 班级对象 {班级ID：班级name}
      grades: [], // 年级列表
      gradesObj: {}, // 年级对应的班级
      formInline: {
        gradeId: '',
        classId: ''
      },
      /*
        所有老师的任课情况
        {
          老师UID： {
            1_1: {各班任课情况}
          }
        }
       */
      teacherTeachingTable: {},
      /**
       * 所有老师的各天的任课数（预警用）
       * {
       *  老师ID：{
       *    '1': 0,
       *    '2': 0
       *  },
       *  ......
       * }
       */
      teacherTeachingNumsTable: {},
      /**
       * 当前勾选年级下的班级课表
       * {
       *   班级ID： [
       *      {方格对象}
       *   ]
       * }
       */
      classCourseTable: {},
      /**
       * 课时数据 包含无课设置
       * {
       *  年级ID：{}
       * }
       */
      courseParamInfos: {},
      // 数据为 {classIndex: 1, weekDay: 1} 表示星期一的第一节为班主任课
      isOpenTeacherMaster: {
        classIndex: 1,
        weekDay: 1
      },
      // 是否打开了班主任课设置
      isOpenTM: false,
      // 班主任ID列表
      classHeadMasterIds: [],
      // 班主任对象 { 班主任ID： {班主任对象} }
      classHeadMasterObj: {},
      /**
       * 当前勾选的年级下的各班预设规则
       */
      classPreScheduleInfos: {
        prevent: {}, // 禁排对象 只包含当前勾选年级下所有禁排数据，按班级存放
        subjectFixed: {}, // 固排对象 包含该当前勾选年级下所有固排数据+未排课的所有班级的固排数据 按科目存放
        teacherFixed: {} // 固排对象 包含该当前勾选年级下所有固排数据+未排课的所有班级的固排数据 按老师存放
      },
      /**
       * 科目的固排 （此固排按班级维度存放，存放只有科目和老师是一对一关系的科目的固排）
       * {
       *  班级ID：{
       *  1_1: {该科目的固排+老师的信息}
       *  ....
       * }
       * }
       */
      fixedUniqoTeacherRule: {},
      /**
       * 未排课的+当前勾选年级下的固排 以班级维度查看
       * {
       *  班级ID：{
       *    teacher：{
       *      1_1: {},
       *      ...
       *    },
       *    subject：{
       *      1_1：{},
       *      ...
       *    }
       *  },
       *  ......
       * }
       */
      fixedRule: {},
      /**
       * 当前勾选年级下的科目、老师、教研组的禁排 以班级为维度
       * {
       *  班级ID：{
       *    teacher: [],
       *    subject: [],
       *    group: []
       *  }
       * }
       */
      preventTeacherRule: {},
      /**
       * 班主任规则的对象
       * {
       *  班级ID：{1_1: true},
       *  ....
       * }
       */
      teacherMstRuleMap: {},
      /**
       * 以老师维度的教研组
       * {
       *  老师ID：{
       *    教研组ID：{}
       *    ......
       *  }
       * }
       */
      groupObj: {},
      /**
       * 教学计划对象，存放时的科目信息，并且科目与老师是1对1的关系，以班级为维度
       */
      teachingDivision: {},
      /**教师每天上课节数预警 当值为0时 不预警 */
      alarmValue: 0,
      /**课程暂存区的数据，按班级存放 */
      tempAndBlankInfos: {},
      isCourse: false
    }
  },
  mounted () {
    if (this.$route && this.$route.query) {
      this.params.termId = this.$route.query.termId
      this.params.schoolId = this.$route.query.schoolId
      this.params.schoolYearId = this.$route.query.schoolYearId
      this.params.gradeIds = this.$route.query.gradeIds
      this.params.stageType = this.$route.query.stageType
      this.getAutoScheduledTable()
      this.isPublish = this.$route.query.isPublish || ''
      let isCourse = this.$route.query.isCourse + ''
      this.isCourse = isCourse && isCourse === 'true' ? true : false
    }
  },
  methods: {
    showExpClass () {
      this.$refs['ExpClassTableComp'].hide = false
    },
    preview () {
      let url = envConfig.ADDPREFIX + '/course/preview-course?schoolId=' + this.params.schoolId + '&gradeIds=' + this.params.gradeIds + '&termId=' + this.params.termId
      window.open(url, '_blank')
    },
    /**
     * 排课报告弹窗显示
     */
    autoSchedule () {
      this.$refs["courseReportComp"].show();
      courseReport({
        schoolId: this.params.schoolId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId,
        schoolYearId: this.params.schoolYearId
      }).then(res => {
        this.$refs["courseReportComp"].setFinished(res.data)
      })
    },
    goPreArrange () {
      this.$router.push({
        path: '/course/course-pre-arrange',
        query: {
          gradeIds: this.params.gradeIds,
          termId: this.params.termId,
          schoolId: this.params.schoolId,
          schoolYearId: this.params.schoolYearId,
          stageType: this.params.stageType,
          isPublish: this.isPublish,
          fromHand: 1
        }
      })
    },
    /**完成排课 */
    finishFun () {
      this.$_showLoading()
      finishSchedule({
        termId: this.params.termId,
        gradeIds: this.params.gradeIds
      }).then((res) => {
        if (res.data) {
          this.$message.success('已完成排课')
          this.$router.push({
            path: '/course/course-list'
          })
        }
        this.$_hideLoading()
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    /**重排本班课表 */
    reSchedule () {
      this.$_showLoading()
      classReSchedule({
        schoolId: this.params.schoolId,
        schoolYearId: this.params.schoolYearId,
        termId: this.params.termId,
        gradeId: this.formInline.gradeId,
        classId: this.formInline.classId,
        gradeIds: this.params.gradeIds
      }).then(res => {
        this.reArrangeDialog = false
        this.handlerData(res.data)
        this.$refs['CourseScheduleComp'].setNoCourseTable()
        this.$refs['TeachCourseComp'].setNoCourseTable()
        this.$refs['CourseStorageComp'].setData()
        this.operateList.splice(0, this.operateList.length)
        this.$nextTick(() => {
          this.$_hideLoading()
        })
      }).catch(error => {
        console.log(error)
        this.$_hideLoading()
      })
    },
    addOperateRecord (o) {
      this.operateList.splice(0, 0, o)
    },
    // 撤销操作
    resetOperate (step) {
      let batchNos = []
      for (let i = 0; i < step + 1; i++) {
        batchNos.push(this.operateList[i].fineIndex)
      }
      this.$_showLoading()
      undoManualAdjust({ 
        schoolId: this.params.schoolId,
        schoolYearId: this.params.schoolYearId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId
      }, batchNos).then(res => {
        this.handlerData(res.data)
        this.$refs['CourseScheduleComp'].setNoCourseTable()
        this.$refs['TeachCourseComp'].setNoCourseTable()
        this.$refs['CourseStorageComp'].setData()
        this.operateList.splice(0, step + 1)
        this.$nextTick(() => {
          this.$_hideLoading()
          // this.operateShow = false
        })
      })
      console.log(step + 1)
    },
    setStep (step) {
      this.step = step + 1
    },
    /**修改年级课表发布状态 */
    modifyTablePubStatus () {
      if (this.isPublish && parseInt(this.isPublish) === 1) {
        updCourseStatus({
          gradeIds: (this.params.gradeIds + '').split(','),
          termId: this.params.termId
        }).then(() => {
          this.isPublish = 0
        })
      } else if (this.isCourse) {
        updateIsCourseStatus({
          gradeIds: this.params.gradeIds,
          termId: this.params.termId
        }).then(() => {
          this.isCourse = false
        })
      }
    },
    /**清除班级手动调课记录 */
    confirm () {
      this.modifyTablePubStatus()
      this.$_showLoading()
      let params = Object.assign({
        classId: this.formInline.classId
      }, this.params)
      clearClassManualAdjust(params).then((res) => {
        this.confirmDialog = false
        this.handlerData(res.data)
        this.$refs['CourseScheduleComp'].setNoCourseTable()
        this.$refs['TeachCourseComp'].setNoCourseTable()
        this.$refs['CourseStorageComp'].setData()
        this.operateList.splice(0, this.operateList.length)
        this.$_hideLoading()
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    /**课表互换 刷新课表 */
    refreshDataByExchange (startData, endData) {
      console.log(endData)
      if (endData && endData.delRules && endData.delRules.length > 0) {
        // 被替换的规则中有固排 科目 和 老师 需要更新老师的任课表 老师的天上课节数 更新规则数据
        for (let ed = 0; ed < endData.delRules.length; ed++) {
          if (endData.delRules[ed].preScheduleType === 1) {
            if (endData.delRules[ed].objType === 1) {
              // 固排科目规则的移除
              if (this.fixedRule[endData.delRules[ed].classId] && this.fixedRule[endData.delRules[ed].classId].subject && this.fixedRule[endData.delRules[ed].classId].subject[endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]) {
                delete this.fixedRule[endData.delRules[ed].classId].subject[endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]
              }
              if (this.fixedUniqoTeacherRule[endData.delRules[ed].classId] && this.fixedUniqoTeacherRule[endData.delRules[ed].classId][endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]) {
                let futrS = this.fixedUniqoTeacherRule[endData.delRules[ed].classId][endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]
                if (futrS.objId === endData.delRules[ed].objId && futrS.objType === 1) {
                  
                  /**老师的当天任课数 - 1 */
                  // if (!this.teacherTeachingNumsTable[futrS.teacherId]) {
                  //   this.teacherTeachingNumsTable[futrS.teacherId] = {}
                  // }
                  // this.teacherTeachingNumsTable[futrS.teacherId][endData.delRules[ed].weekDay] = 
                  //   this.teacherTeachingNumsTable[futrS.teacherId][endData.delRules[ed].weekDay] ? 
                  //     (this.teacherTeachingNumsTable[futrS.teacherId][endData.delRules[ed].weekDay] - 1) : 0

                  delete this.fixedUniqoTeacherRule[endData.delRules[ed].classId][endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]
                }
              }
            } else if (endData.delRules[ed].objType === 2) {
              // 固排老师规则的移除 老师任课数 - 1
              if (this.fixedRule[endData.delRules[ed].classId] && this.fixedRule[endData.delRules[ed].classId].teacher && this.fixedRule[endData.delRules[ed].classId].teacher[endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]) {
                delete this.fixedRule[endData.delRules[ed].classId].teacher[endData.delRules[ed].classIndex + '_' + endData.delRules[ed].weekDay]
              }
              /**老师的当天任课数 - 1 */
              // if (!this.teacherTeachingNumsTable[endData.delRules[ed].objId]) {
              //   this.teacherTeachingNumsTable[endData.delRules[ed].objId] = {}
              // }
              // this.teacherTeachingNumsTable[endData.delRules[ed].objId][endData.delRules[ed].weekDay] = 
              //   this.teacherTeachingNumsTable[endData.delRules[ed].objId][endData.delRules[ed].weekDay] ? 
              //     (this.teacherTeachingNumsTable[endData.delRules[ed].objId][endData.delRules[ed].weekDay] - 1) : 0
            }
          } else if (endData.delRules[ed].preScheduleType === 2) {
            if (endData.delRules[ed].objType === 1) {
              // 禁排科目规则的移除
              if (this.preventTeacherRule[this.formInline.classId] && this.preventTeacherRule[this.formInline.classId].subject && this.preventTeacherRule[this.formInline.classId].subject.length > 0) {
                for (let psb = this.preventTeacherRule[this.formInline.classId].subject.length - 1; psb >= 0 ; psb --) {
                  if (this.preventTeacherRule[this.formInline.classId].subject[psb].classIndex === endData.delRules[ed].classIndex && this.preventTeacherRule[this.formInline.classId].subject[psb].weekDay === endData.delRules[ed].weekDay) {
                    this.preventTeacherRule[this.formInline.classId].subject.splice(psb, 1)
                  }
                }
              }
            } else if (endData.delRules[ed].objType === 2) {
              // 禁排老师规则的移除
              if (this.preventTeacherRule[this.formInline.classId] && this.preventTeacherRule[this.formInline.classId].teacher && this.preventTeacherRule[this.formInline.classId].teacher.length > 0) {
                for (let tsb = this.preventTeacherRule[this.formInline.classId].teacher.length - 1; tsb >= 0 ; tsb --) {
                  if (this.preventTeacherRule[this.formInline.classId].teacher[tsb].classIndex === endData.delRules[ed].classIndex && this.preventTeacherRule[this.formInline.classId].teacher[tsb].weekDay === endData.delRules[ed].weekDay) {
                    this.preventTeacherRule[this.formInline.classId].teacher.splice(tsb, 1)
                  }
                }
              }
            } else if (endData.delRules[ed].objType === 3) {
              // 禁排教研组规则的移除
              if (this.preventTeacherRule[this.formInline.classId] && this.preventTeacherRule[this.formInline.classId].group && this.preventTeacherRule[this.formInline.classId].group.length > 0) {
                for (let gsb = this.preventTeacherRule[this.formInline.classId].group.length - 1; gsb >= 0 ; gsb --) {
                  if (this.preventTeacherRule[this.formInline.classId].group[gsb].classIndex === endData.delRules[ed].classIndex && this.preventTeacherRule[this.formInline.classId].group[gsb].weekDay === endData.delRules[ed].weekDay) {
                    this.preventTeacherRule[this.formInline.classId].group.splice(gsb, 1)
                  }
                }
              }
            }
          }
        }
        delete endData['delRules']
        delete endData['canDragIn']
      }
      





      let start = {
        classIndex: startData.classIndex,
        weekDay: startData.weekDay,
        classId: this.formInline.classId
      },
      end = {
        classIndex: endData.classIndex,
        weekDay: endData.weekDay,
        classId: this.formInline.classId
      }
      if (startData && startData.teacherId) {
        if (startData.classIndex) {
          // 删除老师任课数据
          delete this.teacherTeachingTable[startData.teacherId][start.classIndex + '_' + start.weekDay]
          /**老师的当天任课数 - 1 */
          if (!this.teacherTeachingNumsTable[startData.teacherId]) {
            this.teacherTeachingNumsTable[startData.teacherId] = {}
          }
          this.teacherTeachingNumsTable[startData.teacherId][start.weekDay] = 
            this.teacherTeachingNumsTable[startData.teacherId][start.weekDay] ? 
              (this.teacherTeachingNumsTable[startData.teacherId][start.weekDay] - 1) : 0
        }
        
        // 新增老师任课数据
        if (!this.teacherTeachingTable[startData.teacherId]) {
          this.teacherTeachingTable[startData.teacherId] = {}
        }
        this.teacherTeachingTable[startData.teacherId][end.classIndex + '_' + end.weekDay] = Object.assign(deepCopy(startData), end)
        if (!this.teacherTeachingNumsTable[startData.teacherId]) {
          this.teacherTeachingNumsTable[startData.teacherId] = {}
        }
        this.teacherTeachingNumsTable[startData.teacherId][end.weekDay] = 
          this.teacherTeachingNumsTable[startData.teacherId][end.weekDay] ? 
            (this.teacherTeachingNumsTable[startData.teacherId][end.weekDay] + 1) : 1
      }
      if (endData) {
        if (endData.teacherId) {
          // 删除老师任课数据
          if (!(startData && startData.teacherId && startData.teacherId === endData.teacherId)) {
            delete this.teacherTeachingTable[endData.teacherId][end.classIndex + '_' + end.weekDay]
          }
          /**老师的当天任课数 - 1 */
          if (!this.teacherTeachingNumsTable[endData.teacherId]) {
            this.teacherTeachingNumsTable[endData.teacherId] = {}
          }
          this.teacherTeachingNumsTable[endData.teacherId][end.weekDay] = 
            this.teacherTeachingNumsTable[endData.teacherId][end.weekDay] ? 
              (this.teacherTeachingNumsTable[endData.teacherId][end.weekDay] - 1) : 0
          if (start.classIndex) {
            // 新增老师任课数据
            this.teacherTeachingTable[endData.teacherId][start.classIndex + '_' + start.weekDay] = Object.assign(deepCopy(endData), start)
            this.teacherTeachingNumsTable[endData.teacherId][start.weekDay] = 
            this.teacherTeachingNumsTable[endData.teacherId][start.weekDay] ? 
              (this.teacherTeachingNumsTable[endData.teacherId][start.weekDay] + 1) : 1
          }
        }
        
        if (!start.classIndex) {
          // 告诉暂存区 刷新数据(start.classIndex 不存在 表示从暂存区拖拽过来 和 表格 互换)
          // this.$refs['CourseStorageComp'].addData(endData)
          // 告诉暂存区 删除拖动的数据
          this.$refs['CourseStorageComp'].reloadData(startData, endData)
        }
        
      }
      // 刷新当前班级课表
      let count = 0
      if (!start.classIndex) {
        count++
      }
      if (this.classCourseTable[this.formInline.classId]) {
        for (let i = this.classCourseTable[this.formInline.classId].length - 1; i >= 0 ; i--) {
          if (this.classCourseTable[this.formInline.classId][i].classIndex === end.classIndex && this.classCourseTable[this.formInline.classId][i].weekDay === end.weekDay) {
            this.classCourseTable[this.formInline.classId].splice(i, 1)
            count++
          } else if (this.classCourseTable[this.formInline.classId][i].classIndex === start.classIndex && this.classCourseTable[this.formInline.classId][i].weekDay === start.weekDay) {
            this.classCourseTable[this.formInline.classId].splice(i, 1)
            count++
          }
          if(count === 2) {
            break
          }
        }
      } else {
        this.$set(this.classCourseTable, this.formInline.classId, [])
      }
      if (start.classIndex) {
        // 表格内部拖动
        startData.teacherId && this.classCourseTable[this.formInline.classId].push(Object.assign(deepCopy(startData), end))
        endData.teacherId && this.classCourseTable[this.formInline.classId].push(Object.assign(deepCopy(endData), start))
      } else {
        // 从暂存区 拖拽过来 classIndex 不存在
        this.classCourseTable[this.formInline.classId].push(Object.assign(deepCopy(startData), {
          classId: this.formInline.classId,
          gradeId: this.formInline.gradeId,
          schoolId: this.params.schoolId,
          teacherName: startData.teacherName,
          subjectName: startData.subjectFullName,
          placeId: startData.placeId,
          classIndex: endData.classIndex,
          weekDay: endData.weekDay
        }))
      }
      // 告诉子组件 刷新课表
      this.$refs['CourseScheduleComp'].setCourseTable(true)
    },
    /**
     * 更新问题班级的暂存区数目和空白区数 this.excClassList
     */
    refreshClassAreaNums (classId, tempStorageCount, blankCount) {
      for (let ec = 0; ec < this.excClassList.length; ec++) {
        if (this.excClassList[ec].classId === classId) {
          this.$set(this.excClassList, ec, Object.assign(this.excClassList[ec], {
            tempStorageCount: this.excClassList[ec].tempStorageCount + tempStorageCount,
            blankCount: this.excClassList[ec].blankCount + blankCount
          }))
          break
        }
      }
    },
    /**放入到缓存区时更新老师任课数据和老师每天的任课数 */
    refreshData (data) {
      this.modifyTablePubStatus()
      console.log(data, this.$refs['CourseScheduleComp'].batchNo)
      let baseClassAutoCourseFine = {
        schoolId: this.params.schoolId,
        gradeId: this.formInline.gradeId,
        termId: this.params.termId,
        classId: this.formInline.classId,
        fineIndex: this.$refs['CourseScheduleComp'].batchNo,
        weekDay: data.weekDay,
        classIndex: data.classIndex,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        placeId: data.placeId,

        weekDayAfter: null,
        classIndexAfter: null,
        subjectIdAfter: null,
        teacherIdAfter: null,
        placeIdAfter: null,
        stepContent: '',
      }
      baseClassAutoCourseFine.stepContent = '周' + baseClassAutoCourseFine.weekDay + '第' + baseClassAutoCourseFine.classIndex + '节的' + data.subjectName +
        '放置到暂存区'
      console.log(baseClassAutoCourseFine)
      this.addOperateRecord(baseClassAutoCourseFine)
      manualAdjust({
        baseClassAutoCourseFine
      }).then(res => {
        console.log(res)
      })
      // 删除老师任课数据
      delete this.teacherTeachingTable[data.teacherId][data.classIndex + '_' + data.weekDay]
      /**老师的当天任课数 - 1 */
      if (!this.teacherTeachingNumsTable[data.teacherId]) {
        this.teacherTeachingNumsTable[data.teacherId] = {}
      }
      this.teacherTeachingNumsTable[data.teacherId][data.weekDay] = 
        this.teacherTeachingNumsTable[data.teacherId][data.weekDay] ? 
          (this.teacherTeachingNumsTable[data.teacherId][data.weekDay] - 1) : 0
      // 清空当前班级课表该位置的任课信息
      console.log(data.classIndex + '_' + data.weekDay)
      for (let i = 0; i < this.classCourseTable[this.formInline.classId].length; i++) {
        if (this.classCourseTable[this.formInline.classId][i].classIndex === data.classIndex && this.classCourseTable[this.formInline.classId][i].weekDay === data.weekDay) {
          this.classCourseTable[this.formInline.classId].splice(i, 1)
          break
        }
      }
      // 告诉子组件 刷新课表
      this.$refs['CourseScheduleComp'].setCourseTable(true)
    },
    /**获取手动调课时需要的信息 */
    getAutoScheduledTable () {
      this.$_showLoading()
      selectManualAdjustInfos(this.params).then(res => {
        this.handlerData(res.data)
        this.$refs['CourseScheduleComp'].setNoCourseTable()
        this.$refs['TeachCourseComp'].setNoCourseTable()
        this.$refs['CourseStorageComp'].setData()
        this.$nextTick(() => {
          this.$_hideLoading()
        })
      }).catch(error => {
        console.log(error)
        this.$_hideLoading()
      })
    },
    exchangeClass (data) {
      this.formInline.gradeId = data.gradeId
      this.classes.splice(0, this.classes.length)
      this.classes.push(...this.gradesObj[data.gradeId])
      this.formInline.classId = data.classId
      this.$refs['CourseScheduleComp'].setNoCourseTable()
      this.$refs['TeachCourseComp'].setNoCourseTable()
      this.$refs['CourseStorageComp'].setData()
      this.operateList.splice(0, this.operateList.length)
    },
    // 切换年级
    changeGrade (v) {
      this.classes.splice(0, this.classes.length)
      this.classes.push(...this.gradesObj[v])
      this.formInline.classId = this.gradesObj[v][0].classId
      this.$refs['CourseScheduleComp'].setNoCourseTable()
      this.$refs['TeachCourseComp'].setNoCourseTable()
      this.$refs['CourseStorageComp'].setData()
      this.operateList.splice(0, this.operateList.length)
    },
    changeClass () {
      this.$refs['CourseScheduleComp'].setCourseTable()
      this.$refs['CourseStorageComp'].setData()
      this.operateList.splice(0, this.operateList.length)
    },
    handlerData (data) {
      
      /**预警信息 */
      if (data.teacherPlanAlarmInfos && data.teacherPlanAlarmInfos.length > 0) {
        for (let tpai = 0; tpai < data.teacherPlanAlarmInfos.length; tpai++) {
          if (data.teacherPlanAlarmInfos[tpai].alarmType === 2 && data.teacherPlanAlarmInfos[tpai].isOpen) {
            // 每天的上课节数预警
            this.alarmValue = data.teacherPlanAlarmInfos[tpai].alarmValue
          }
        }
      }
      // 年级班级
      if (data.gradeClassInfos && data.gradeClassInfos.length > 0) {
        for (let i = 0; i < data.gradeClassInfos.length; i++) {
          this.grades.push(data.gradeClassInfos[i])
          this.gradesObj[data.gradeClassInfos[i]['uid']] = data.gradeClassInfos[i].classList
          for (let cl = 0; cl < data.gradeClassInfos[i].classList.length; cl++) {
            this.classIds.push(data.gradeClassInfos[i].classList[cl]['classId'])
          }
          if (i === 0) {
            this.formInline.gradeId = data.gradeClassInfos[i]['uid']
            this.classes.push(...data.gradeClassInfos[i].classList)
            this.formInline.classId = data.gradeClassInfos[i].classList[0].classId
          }
        }
      }
      // 无课设置 和 课时数据
      /**将数据存放到this.courseParamInfos中 以年级为维度 */
      if (data.courseParamInfos && data.courseParamInfos.length > 0) {
        for (let i = 0; i < data.courseParamInfos.length; i++) {
          this.courseParamInfos[data.courseParamInfos[i].gradeId] = data.courseParamInfos[i]
        }
      }
      // 全校的课表
      /** 根据课表 梳理出 所有老师的任课情况 放置到this.teacherTeachingTable */
      /** 根据课表 梳理出 班级对应的课表 放置到this.classCourseTable */
      if (data.publishCourseInfos && data.publishCourseInfos.length > 0) {
        this.teacherTeachingNumsTable = {}
        this.teacherTeachingTable = {}
        this.classCourseTable = {}
        for (let i = 0; i < data.publishCourseInfos.length; i++) {
          /**累计老师的每天任课数 */
          if (!this.teacherTeachingNumsTable[data.publishCourseInfos[i].teacherId]) {
            this.teacherTeachingNumsTable[data.publishCourseInfos[i].teacherId] = {}
          }
          this.teacherTeachingNumsTable[data.publishCourseInfos[i].teacherId][data.publishCourseInfos[i].weekDay] = 
            this.teacherTeachingNumsTable[data.publishCourseInfos[i].teacherId][data.publishCourseInfos[i].weekDay] ? 
              (this.teacherTeachingNumsTable[data.publishCourseInfos[i].teacherId][data.publishCourseInfos[i].weekDay] + 1) : 1
          /**保存老师的任课情况 */
          if (!this.teacherTeachingTable[data.publishCourseInfos[i].teacherId]) {
            // 当前老师任课情况不存在
            this.teacherTeachingTable[data.publishCourseInfos[i].teacherId] = {}
          }
          this.teacherTeachingTable[data.publishCourseInfos[i].teacherId][
            data.publishCourseInfos[i].classIndex + '_' + data.publishCourseInfos[i].weekDay
          ] = data.publishCourseInfos[i]
          /**保存各班级的任课数据 */
          if (!this.classCourseTable[data.publishCourseInfos[i].classId]) {
            // 当前班级课表不存在
            this.$set(this.classCourseTable, data.publishCourseInfos[i].classId, [])
          }
          this.classCourseTable[data.publishCourseInfos[i].classId].push(data.publishCourseInfos[i])
        }
      }
      /**教研组 groupObj */
      if (data.teacherGroupInfos && data.teacherGroupInfos.length > 0) {
        for (let tgi = 0; tgi < data.teacherGroupInfos.length; tgi++) {
          if (data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList && data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList.length > 0) {
            for (let bstil = 0; bstil < data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList.length; bstil++) {
              if (!this.groupObj[data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList[bstil].uid]) {
                this.groupObj[data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList[bstil].uid] = {}
              }
              this.groupObj[data.teacherGroupInfos[tgi].baseSchoolTeacherInfoList[bstil].uid][data.teacherGroupInfos[tgi].uid] = data.teacherGroupInfos[tgi]
            }
          }
        }
      }
      /**
       * 班主任规则 2018-12-27将班主任规则删除
       */
      // data.baseRuleDto存在 表示已经打开了班主任课的设置
      if (this.isOpenTM && data.baseRuleDto) {
        this.teacherMstRuleMap = {}
        this.classHeadMasterObj = {}
        this.isOpenTM = true
        this.$set(this.isOpenTeacherMaster, 'classIndex', data.baseRuleDto.classIndex)
        this.$set(this.isOpenTeacherMaster, 'weekDay', data.baseRuleDto.weekDay)
        // 班主任列表
        if (data.classHeadMasterInfos && data.classHeadMasterInfos.length > 0) {
          for (let chmi = 0; chmi < data.classHeadMasterInfos.length; chmi++) {
            if (data.classHeadMasterInfos[chmi].classAndHeadMasterMap) {
              for (let cahmm in data.classHeadMasterInfos[chmi].classAndHeadMasterMap) {
                if (data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId) {
                  // 梳理出班级的班主任规则数据
                  this.teacherMstRuleMap[cahmm] = {
                    [data.baseRuleDto.classIndex + '_' + data.baseRuleDto.weekDay]: data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm]
                  }
                  this.classHeadMasterObj[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId] = Object.assign({
                    classId: cahmm, // 班级ID
                    gradeId: data.classHeadMasterInfos[chmi].gradeId
                  }, data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm])
                  this.classHeadMasterIds.push(data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId)

                  /**累计老师的每天任课数 */
                  // if (!this.teacherTeachingNumsTable[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId]) {
                  //   this.teacherTeachingNumsTable[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId] = {}
                  // }
                  // this.teacherTeachingNumsTable[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId][data.baseRuleDto.weekDay] = 
                  //   this.teacherTeachingNumsTable[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId][data.baseRuleDto.weekDay] ? 
                  //     (this.teacherTeachingNumsTable[data.classHeadMasterInfos[chmi].classAndHeadMasterMap[cahmm].teacherId][data.baseRuleDto.weekDay] + 1) : 1
                }
              }
            }
          }
        }
      }
      /**
       * 全校教学计划 找到所有1对1的科目数据
       */
      if (data.teachingDivisionInfos && data.teachingDivisionInfos.length > 0) {
        for (let tdi = 0; tdi < data.teachingDivisionInfos.length; tdi++) {
          this.classObj[data.teachingDivisionInfos[tdi].uid] = data.teachingDivisionInfos[tdi].classFullname
          if (data.teachingDivisionInfos[tdi].subjectTeachingDivisionList && data.teachingDivisionInfos[tdi].subjectTeachingDivisionList.length > 0) {
            for (let std = 0; std < data.teachingDivisionInfos[tdi].subjectTeachingDivisionList.length; std++) {
              if (data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].teacherInfoList && data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].teacherInfoList.length === 1) {
                // 按科目存放 科目ID为key
                if (!this.teachingDivision[data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].uid]) {
                  this.teachingDivision[data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].uid] = {}
                }
                this.teachingDivision[data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].uid][
                  data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std].classId
                ] = data.teachingDivisionInfos[tdi].subjectTeachingDivisionList[std]
              }
            }
          }
        }
      }
      /**
       * 未排课年级的预设规则 + 勾选年级的预设规则
       */
      if (data.preScheduleInfos && data.preScheduleInfos.length > 0) {
        this.fixedRule = {}
        this.fixedUniqoTeacherRule = {}
        this.preventTeacherRule = {}
        for (let psi = 0; psi < data.preScheduleInfos.length; psi++) {
          if (this.isOpenTM) {
            // 如果打开了班主任规则 并且规则中有班主任课位置的规则 则删除班主任规则 该班主任的任课数 - 1
            if (data.preScheduleInfos[psi].classIndex === this.isOpenTeacherMaster.classIndex && data.preScheduleInfos[psi].weekDay === this.isOpenTeacherMaster.weekDay && this.teacherMstRuleMap[data.preScheduleInfos[psi].classId]) {
              // 该位置为班主任课的位置

              /**老师的每天任课数 需要 - 1 */
              // if (!this.teacherTeachingNumsTable[this.teacherMstRuleMap[data.preScheduleInfos[psi].classId][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId]) {
              //   this.teacherTeachingNumsTable[this.teacherMstRuleMap[data.preScheduleInfos[psi].classId][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId] = {}
              // }
              // this.teacherTeachingNumsTable[this.teacherMstRuleMap[data.preScheduleInfos[psi].classId][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId][this.isOpenTeacherMaster.weekDay] = 
              //   this.teacherTeachingNumsTable[this.teacherMstRuleMap[data.preScheduleInfos[psi].classId][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId][this.isOpenTeacherMaster.weekDay] ? 
              //     (this.teacherTeachingNumsTable[this.teacherMstRuleMap[data.preScheduleInfos[psi].classId][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId][this.isOpenTeacherMaster.weekDay] - 1) : 0

              delete this.teacherMstRuleMap[data.preScheduleInfos[psi].classId]
            }
          }
          if (data.preScheduleInfos[psi].operateType === 1) {
            // 填入
            // 找到所有老师的固排
            if (data.preScheduleInfos[psi].preScheduleType === 1) {
              // 固排 preScheduleType = 1
              if (data.preScheduleInfos[psi].objType === 2) {
                // objType = 2 为老师
                /**该老师当天的任课数累积 */
                // if (!this.teacherTeachingNumsTable[data.preScheduleInfos[psi].objId]) {
                //   this.teacherTeachingNumsTable[data.preScheduleInfos[psi].objId] = {}
                // }
                // this.teacherTeachingNumsTable[data.preScheduleInfos[psi].objId][data.preScheduleInfos[psi].weekDay] = 
                //   this.teacherTeachingNumsTable[data.preScheduleInfos[psi].objId][data.preScheduleInfos[psi].weekDay] ? 
                //     (this.teacherTeachingNumsTable[data.preScheduleInfos[psi].objId][data.preScheduleInfos[psi].weekDay] + 1) : 1

                if (!this.fixedRule[data.preScheduleInfos[psi].classId]) {
                  this.fixedRule[data.preScheduleInfos[psi].classId] = {
                    teacher: {},
                    subject: {}
                  }
                }
                this.fixedRule[data.preScheduleInfos[psi].classId].teacher[
                  data.preScheduleInfos[psi].classIndex + '_' + data.preScheduleInfos[psi].weekDay
                ] = data.preScheduleInfos[psi]
              } else if (data.preScheduleInfos[psi].objType === 1) {
                // objType = 1 为科目
                if (!this.fixedRule[data.preScheduleInfos[psi].classId]) {
                  this.fixedRule[data.preScheduleInfos[psi].classId] = {
                    teacher: {},
                    subject: {}
                  }
                }
                this.fixedRule[data.preScheduleInfos[psi].classId].subject[
                  data.preScheduleInfos[psi].classIndex + '_' + data.preScheduleInfos[psi].weekDay
                ] = data.preScheduleInfos[psi]


                if (this.teachingDivision[data.preScheduleInfos[psi].objId] && this.teachingDivision[data.preScheduleInfos[psi].objId][data.preScheduleInfos[psi].classId]) {
                  let teacher = this.teachingDivision[data.preScheduleInfos[psi].objId][data.preScheduleInfos[psi].classId]['teacherInfoList'][0]
                  // 从教学计划中 找到该科目 如果找到了 那么证明在该老师的任课班级中 该科目和老师是1对1的关系 此时需要将老师的任课数 + 1
                  // if (!this.teacherTeachingNumsTable[teacher.uid]) {
                  //   this.teacherTeachingNumsTable[teacher.uid] = {}
                  // }
                  // this.teacherTeachingNumsTable[teacher.uid][data.preScheduleInfos[psi].weekDay] = 
                  //   this.teacherTeachingNumsTable[teacher.uid][data.preScheduleInfos[psi].weekDay] ? 
                  //     (this.teacherTeachingNumsTable[teacher.uid][data.preScheduleInfos[psi].weekDay] + 1) : 1

                  if (!this.fixedUniqoTeacherRule[data.preScheduleInfos[psi].classId]) {
                    this.fixedUniqoTeacherRule[data.preScheduleInfos[psi].classId] = {}
                  }
                  this.fixedUniqoTeacherRule[data.preScheduleInfos[psi].classId][
                    data.preScheduleInfos[psi].classIndex + '_' + data.preScheduleInfos[psi].weekDay
                  ] = Object.assign(data.preScheduleInfos[psi], {
                    teacherId: teacher.uid
                  })
                }
              }
            } else {
              // 其他的为禁排
              if (!this.preventTeacherRule[data.preScheduleInfos[psi].classId]) {
                this.preventTeacherRule[data.preScheduleInfos[psi].classId] = {
                  teacher: [], // 老师的禁排
                  subject: [], // 科目的禁排
                  group: [] // 教研组的禁排
                }
              }
              if (data.preScheduleInfos[psi].objType === 1) {
                // 科目
                this.preventTeacherRule[data.preScheduleInfos[psi].classId].subject.push(data.preScheduleInfos[psi])
              } else if (data.preScheduleInfos[psi].objType === 2) {
                // 老师
                this.preventTeacherRule[data.preScheduleInfos[psi].classId].teacher.push(data.preScheduleInfos[psi])
              } else {
                // 教研组
                this.preventTeacherRule[data.preScheduleInfos[psi].classId].group.push(data.preScheduleInfos[psi])
              }
            }
          }
        }
      }
      if (this.isOpenTM) {
        // 打开了班主任规则 循环规则已经 过滤了班主任规则（也就是用固排/禁排替换了班主任课位置） 没有替换的 表示该班级还有班主任规则 相当于固排老师
        for (let tmrm in this.teacherMstRuleMap) {
          if (this.teacherMstRuleMap[tmrm] && this.teacherMstRuleMap[tmrm][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay]) {
            if (!this.fixedRule[tmrm]) {
              this.fixedRule[tmrm] = {
                teacher: {},
                subject: {}
              }
            }
            this.fixedRule[tmrm].teacher[
              this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay
            ] = {
              classIndex: this.isOpenTeacherMaster.classIndex,
              weekDay: this.isOpenTeacherMaster.weekDay,
              objId: this.teacherMstRuleMap[tmrm][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId,
              objType: 2,
              objName: '班主任',
              preScheduleType: 3,
              gradeId: this.classHeadMasterObj[this.teacherMstRuleMap[tmrm][this.isOpenTeacherMaster.classIndex + '_' + this.isOpenTeacherMaster.weekDay].teacherId].gradeId
            }
          }
        }
      }
      /**
       * 课程暂存区的数据 this.tempAndBlankInfos
       */
      if (data.tempAndBlankInfos) {
        this.tempAndBlankInfos = {}
        this.excClassList.splice(0, this.excClassList.length)
        for (let tbis = 0; tbis < data.tempAndBlankInfos.length; tbis++) {
          this.excClassList.push(data.tempAndBlankInfos[tbis])
          this.tempAndBlankInfos[data.tempAndBlankInfos[tbis].classId] = data.tempAndBlankInfos[tbis]
        }
      }
    },
    /**设置暂存区显示和隐藏 */
    setStorageAreaData (f, data) {
      this.$refs['CourseStorageComp'].setDropData(f, data)
    },



    /**
     * 排课报告弹窗显示
     */
    show () {
      this.$refs['courseReportComp'].show()
    },
    onSubmit () {},
    handleScroll () {
      // if (y.scrollTop && y.scrollTop > 64) {
      //   this.ruleStyle.vTop = (y.scrollTop - 64) + 'px'
      //   this.ruleStyle.vHeight = (document.querySelector('.course-arrange-box').offsetHeight - y.scrollTop + 34) + 'px'
      //   this.ruleStyle.hasScroll = true
      // } else {
      //   this.ruleStyle.vTop = '0px'
      //   this.ruleStyle.vHeight = '100%'
      //   this.ruleStyle.hasScroll = false
      // }
    }
  },
  components: {
    ExpClassTable,
    TeachCourse,
    GradeClassComp,
    CourseSchedule,
    CourseReport,
    CourseStorage
  }
}
</script>
<style lang="scss" scoped>
.course-hand-arrange {
  width: 100%;
  height: 100%;
  position: relative;
  background: $course-pre-arrange-color;
  user-select: none;
  .operate-box {
    position: fixed;
    top: 140px;
    right: 0;
    bottom: 30px;
    width: 330px;
    z-index: 10000000;
    transition: all 1s;
    &.hide {
      right: -330px;
    }
    .operate-box_content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 330px;
      background: #FFF;
      box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.14);
      border-radius:6px 0px 0px 6px;
      overflow: hidden;
      .operate-box_content-bottom {
        height: 60px;
        line-height: 60px;
        color: #333333;
        font-weight: 400;
        text-align: center;
        background:rgba(245,245,245,1);
      }
      .operate-box_content-list {
        height: calc(100% - 115px);
        background: #FFF;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 3px 5px;
        .no-data {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          color: #666;
          > img {
            width: 134px;
            margin: 0 auto;
          }
        }
        .operate-item {
          height: 60px;
          border-bottom: 1px solid #EAEAEA;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #888888;
          cursor: pointer;
          .operate-item_desc {
            padding: 6px 10px 0;
          }
          .operate-item_title {
            padding: 20px 10px 0;
          }
          &.active {
            color: #339EFE;
            background: #E3ECFB;
          }
        }
      }
      .operate-box_content-top {
        height: 55px;
        line-height: 55px;
        background:rgba(245,245,245,1);
        border-radius:6px 2px 2px 2px;
        .title {
          font-weight: bold;
          padding-left: 16px;
          font-size: 16px;
        }
        .iconfont {
          margin-right: 10px;
          float: right;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .operate-box_bg {
      width: 100%;
      height: 100%;
      background: rgba(112, 112, 112, .5);
    }
  }
  .dialog-comp {
    .confirm-top {
      display: flex;
      color: $course-list-color24;
      font-size: 16px;
      justify-content: center;
      margin-top: 16px;
      margin-bottom: 15px;
      .icon-zanwushuju {
        padding-right: 10px;
        font-size: 22px;
      }
    }
    .confirm-center {
      text-align: center;
      color: $course-list-color25;
      line-height: 24px;
      padding: 0 28px 10px;
      word-break: break-all;
    }
  }
  .course-pre-arrange_content {
    position: relative;
    height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: auto;
    overflow-x: hidden;
    .operation-btn {
      position: absolute;
      top: 90px;
      right: 0;
      z-index: 1;
      width: 30px;
      height: 80px;
      color: $course-pre-arrange-color36;
      background: $course-pre-arrange-color37;
      font-size: 12px;
      white-space: pre-line;
      padding: 8px 0 0 10px;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      cursor: pointer;
    }
    .preview {
      top: 180px;
      background: $course-pre-arrange-color38;
    }
    .exp-class {
      top: 270px;
      background: $course-pre-arrange-color39;
    }
    .course-tips {
      height: 50px;
      line-height: 50px;
      background: $course-pre-arrange-color1;
      color: $course-pre-arrange-color2;
      padding-left: 23px;
      .btn {
        cursor: pointer;
        float: right;
        width: 80px;
        height: 30px;
        line-height: 28px;
        border: 1px solid $course-hand-arrange-color7;
        text-align: center;
        margin-right: 20px;
        margin-top: 10px;
      }
      .icon-x {
        float: right;
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
    .submit-next {
      padding-bottom: 14px;
      text-align: center;
      position: relative;
      .color-panel {
        position: absolute;
        top: 6px;
        left: 14px;
        .color-item {
          float: left;
          height: 20px;
          display: flex;
          margin-right: 20px;
          line-height: 20px;
          color: #666666;
          .square {
            width: 16px;
            height: 16px;
            margin-top: 2px;
            margin-right: 8px;
          }
        }
        .can {
          color: $course-pre-arrange-color31_1_1;
          .square {
            background-color: $course-pre-arrange-color31_1;
          }
        }
        .force {
          color: $course-pre-arrange-color31_2_1;
          .square {
            background-color: $course-pre-arrange-color31_2;
          }
        }
        .canot {
          color: $course-pre-arrange-color31_3_1;
          .square {
            background-color:  $course-pre-arrange-color31_3;
          }
        }
      }
    }
    .course-arrange-box {
      display: flex;
      padding: 20px;
      height: calc(100% - 96px);
      &.noTips {
        height: calc(100% - 46px);
      }
      .course-arrange_left {
        width: 190px;
        border: 1px solid $course-pre-arrange-color3;
        position: relative;
        background: $course-pre-arrange-color0;
        .course-arrange_left-top {
          width: 100%;
          height: 100%;
          .nav-title {
            height: 61px;
            padding-top: 23px;
            position: relative;
            // &:after {
            //   content: '';
            //   width: 173px;
            //   height: 1px;
            //   background: $course-pre-arrange-color3;
            //   position: absolute;
            //   bottom: 0;
            //   left: 8px;
            // }
            .txt {
              display: block;
              border-left: 4px solid $course-pre-arrange-color4;
              height: 16px;
              line-height: 16px;
              color: $course-pre-arrange-color5;
              font-size: 16px;
              font-weight: bold;
              padding-left: 13px;
            }
          }
          .nav-tab-content {
            width: 100%;
            height: calc(100% - 62px);
          }
        }
      }
      .course-arrange_center {
        min-width: 660px;
        flex: 1;
        background: $course-pre-arrange-color0;
        .course-arrange_center-top {
          border: 1px solid $course-pre-arrange-color3;
          height: 63px;
          overflow: hidden;
          padding-top: 15px;
          padding-left: 17px;
          // .txt {
          //   text-align: center;
          //   color: $course-pre-arrange-color5;
          //   font-size: 16px;
          //   font-weight: bold;
          // }
          .el-form {
            float: left;
          }
          .clearBtn {
            cursor: pointer;
            float: right;
            margin-right: 16px;
            height: 32px;
            line-height: 32px;
            border:1px solid rgba(219,219,219,1);
            border-radius:4px;
            color: #666666;
            padding: 0 10px;
            .iconfont {
              padding-right: 5px;
            }
          }
        }
        .course-arrange_center-content {
          height: calc(100% - 63px);
        }
      }
      .course-arrange_right {
        margin-left: 11px;
        width: 420px;
        
        position: relative;
        
        .course-arrange_right-top {
          height: 62px;
          padding-top: 23px;
          position: relative;
          background: $course-pre-arrange-color0;
          border-top: 1px solid $course-pre-arrange-color3;
          border-left: 1px solid $course-pre-arrange-color3;
          border-right: 1px solid $course-pre-arrange-color3;
          &:after {
            content: '';
            width: 380px;
            height: 1px;
            background: $course-pre-arrange-color3;
            position: absolute;
            bottom: 0;
            left: 11px;
          }
          .txt {
            display: block;
            border-left: 4px solid $course-pre-arrange-color4;
            height: 16px;
            line-height: 16px;
            color: $course-pre-arrange-color5;
            font-size: 16px;
            font-weight: bold;
            padding-left: 13px;
          }
          .num {
            position: absolute;
            top: 21px;
            left: 105px;
            background: $course-pre-arrange-color6;
            border-radius: 50px;
            padding: 0 4px;
            height: 20px;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
            color: $course-pre-arrange-color7;
          }
        }
        .course-arrange_right-content {
          width: 100%;
          height: calc(100% - 62px);
          display: flex;
          flex-direction: column;
          .reset-box {
            background: $course-pre-arrange-color0;
            margin-bottom: 10px;
            .reset-btn {
              width: 290px;
              height: 45px;
              text-align: center;
              line-height: 45px;
              color: $course-storage-color6;
              background: $course-storage-color5;
              margin: 0 auto 10px;
              border-radius:6px;
              cursor: pointer;
            }
          }
          .course-teach-panel {
            border: 1px solid $course-pre-arrange-color3;
            position: relative;
          }
          .course-arrange_right-content-top {
            flex: 1;
            width: 100%;
            overflow: hidden;
            background: $course-pre-arrange-color0;
            margin-bottom: 20px;
            border-left: 1px solid $course-pre-arrange-color3;
            border-bottom: 1px solid $course-pre-arrange-color3;
            border-right: 1px solid $course-pre-arrange-color3;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.course-hand-arrange {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-select .el-input__inner {
    height: 32px;
  }
  .el-form--inline .el-form-item__label,.el-form--inline .el-form-item__content ,.el-input__icon{
    line-height: 32px;
  }
  .el-form-item__label {
    color: #333333;
  }
}
</style>