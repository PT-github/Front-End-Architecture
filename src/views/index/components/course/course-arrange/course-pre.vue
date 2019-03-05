<template>
  <div class="course-pre-arrange">
    <s-title :titleArr="titleArr"></s-title>
    <div class="course-pre_container">
      <div class="course-pre_content">
        <div class="course-pre-arrange_content">
          <div class="operation-btn" @click="operateShow = true">操作记录</div>
          <div class="course-tips" v-show="hasTips">
            <i class="iconfont icon-tishi"></i>
            操作提示：1，将左侧目标，拖拽至课程表空白处可设置固排/禁排规则。2，勾选基础规则将影响整体排课结果。
            <i
              class="iconfont icon-x"
              @click="hasTips = false"
            ></i>
          </div>
          <div class="course-arrange-box" :class="{noTips: !hasTips}">
            <div class="course-arrange_left">
              <div class="course-arrange_left-top">
                <div class="nav-tab">
                  <div class="nav-item" :class="{ active: preRuleType === 1 }" @click="preRuleType = 1">固排</div>
                  <div class="nav-item" :class="{ active: preRuleType === 2 }" @click="preRuleType = 2">禁排</div>
                </div>
                <div class="nav-tab-content">
                  <CourseNav ref="CourseNavComp" :active="preRuleType"></CourseNav>
                </div>
              </div>
            </div>
            <div class="course-arrange_center">
              <div class="course-arrange_center-top">
                <div class="left-txt">设置范围：</div>
                <el-form size="small" :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item>
                    <el-select v-model="formInline.stageType" placeholder="全部学段" @change="changeStageType">
                      <el-option v-for="(item, index) in stageTypesFilter" :key="index + '_stageTyps'" :label="item.enumField" :value="item.enumValue"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="formInline.gradeId" placeholder="全部年级" @change="changeGrade">
                      <el-option v-for="(item, index) in gradesListFilter" :key="index + '_gradesList'" :label="item.gradeFullName" :value="item.uid"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="formInline.classId" placeholder="全部班级" @change="changeClass">
                      <el-option v-for="(item, index) in classListFilter" :key="index + '_classListFilter'" :label="item.classFullName" :value="item.classId"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                  </el-form-item> -->
                </el-form>
                <div class="right-btn" @click="confirmClearDialog = true">
                  <i class="iconfont icon-qingchu"></i>
                  <span>清除所有</span>
                </div>
              </div>
              <div class="course-arrange_center-content">
                <CourseRule ref="CourseRuleComp" :alarmValue="alarmValue"></CourseRule>
              </div>
            </div>
            <div class="course-arrange_right">
              <div class="course-arrange_right-top">
                <span class="txt">基础规则</span>
                <span class="num">5</span>
              </div>
              <div class="course-arrange_right-content">
                <CourseBaseRule ref="CourseBaseRuleComp"></CourseBaseRule>
              </div>
            </div>
          </div>
          <div class="submit-next">
            <div class="color-panel">
              <div class="color-item can">
                <i class="square"></i>
                可拖入
              </div>
              <div class="color-item force">
                <i class="square"></i>
                强行拖入
              </div>
              <div class="color-item canot">
                <i class="square"></i>
                不可拖入
              </div>
            </div>
            
            <el-button type="primary" size="small" v-if="fromHand && !hasModified" @click="autoSchedule">下一步(手动微调)</el-button>
            <el-button type="primary" size="small" v-else @click="autoSchedule">下一步(自动排课)</el-button>
          </div>
        </div>
        <CourseReport @resetArrange="autoSchedule" :gradeIds="params.gradeIds" :schoolId="params.schoolId" :termId="params.termId" :schoolYearId="params.schoolYearId" ref="courseReportComp"></CourseReport>
      </div>
    </div>
    
    <div class="operate-box" :class="{ hide: !operateShow }">
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
              <div class="operate-item_title">{{ item.operateInfoTitle }}</div>
              <div class="operate-item_desc">{{ item.operateInfoDesc }}</div>
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
    <el-dialog class="dialog-comp" title="提示" width="380px" :visible.sync="confirmClearDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>提示?
      </div>
      <div class="confirm-center">
        是否清空所有设置
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearConfirm">确 定</el-button>
        <el-button @click="confirmClearDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deepCopy } from '@/utils'
import { updCourseStatus, autoScheduleCourse, clearAll, revoke, selectPreScheduleInfos, baseRule, getAllBaseData } from '../../../store/api'
import CourseBaseRule from "./course-base-rule";
import CourseNav from "./course-nav";
import CourseRule from "./course-rule";
import CourseReport from "./course-report";
export default {
  name: "CoursePreArrange",
  data() {
    return {
      isPublish: '',
      alarmValue: 0, // 老师天上课节数预警值 默认为0 为0时表示不预警
      titleArr: [
        // 面包屑数组
        {
          path: "/course/course-list",
          name: "排课管理"
        },
        {
          path: "/course/course-hand-arrange",
          name: "预排设置"
        }
      ],
      confirmClearDialog: false,
      params: {
        gradeId: [], // 年级列表
        termId: '', // 学期
        schoolId: '', // 学校
        schoolYearId: '', // 学年
        stageType: [], // 学段列表
        gradeIds: '' // 年级字符串列表
      },
      // form表单数据
      formInline: {
        stageType: '', // 学段
        gradeId: '', // 年级
        classId: '' // 班级
      },
      initParams: {
        gradeIds: '', // 年级列表(多个以逗号相连)
        termId: '', // 学期ID
        schoolId: '', // 学校
        schoolYearId: '', // 学年
      },
      /**
       * 已排课的教师任课表
       * {
       *  教师ID：{
       *    "1_1": {任课数据},
       *    ......
       *  },
       *  ......
       * }
       */
      teacherTeachTable: {},
      /**
       * 全校的教学计划
       * 整理出科目维度 subjectTeachingDivisions
       *  科目在各班的教学计划
       * {
       *  科目ID：{
       *    班级ID：{
       *      科目的教学计划数据
       *    }
       *  }
       * }
       * 整理出老师维度 teacherTeachingDivisions
       *  老师在各班的教学计划
       * {
       *  老师ID：{
       *    班级ID：[{科目的教学计划数据}]
       *  }
       * }
       */
      subjectTeachingDivisions: {},
      teacherTeachingDivisions: {},
      /**
       * 所有老师数据
       * {
       *  老师ID：{老师对象}
       * }
       */
      teacherObj: {},
      /**
       * 按年级存放的科目和老师
       * {
       *  年级ID：{
       *    subjectInfoList: [],
       *    teacherInfoList: []
       *  }
       * }
       */
      subjectAndTeacherDtos: {},
      /**
       * 年级维度的课时数据
       * {
       *  年级ID：{
       *    课时数据对象
       *    + classIds: []
       *  }
       * }
       */
      gradeNoCourseObj: {},
      /**
       * 按班级存放的无课设置
       * {
       *  班级ID：{
       *    1_1: {无课数据}
       *  }
       * }
       */
      classNoCourseObj: {},
      /**
       * 老师天上课节数的数据 后续老师天上课节数预警用
       * 老师ID为key，对象内 key为1代表周一 value表示在周一的上课节数
       * {
       *  老师ID：{
       *    '1': 0,
       *    '2': 0
       *  }
       * }
       */
      teacherTeachingNums: {},
      hasTips: true, // 有提示信息
      operateShow: false, // 操作记录显示和隐藏
      preRuleType: 1,
      // 学段列表
      stageTypes: [],
      // 学段对象 {学段ID: [ 年级ID, ... ]}
      stageTypeObj: {},
      // 前面带过来的年级列表
      gradesList: [],
      // 根据学段过滤后的年级列表
      gradesListFilter: [{ gradeFullName: '全部', uid: '' }],
      // 年级对象{年级ID: [{班级对象}, ...], ...}
      gradesObj: {},
      // 年级下的班级列表
      classList: [],
      classIdList: [], // 当前勾选的年级下的所有班级ID列表
      // 根据年级过滤后的班级列表
      classListFilter: [{ classFullName: '全部', classId: '' }],
      ruleList: [], // 基础规则列表
      teacherMasterSets: {
        isOpen: false, // 是否开启
        classIndex: 1, // 第几节课
        weekDay: 1, // 周几
      },
      /**
       * 班主任列表 以班级维度存放
       * {
       *  班级ID：{teacherId:老师ID, teacherName: 老师名称},
       *  ......
       * }
       */
      teacherMasterObj: {},
      /**
       * 所有的预排规则列表 按班级存放 this.preScheduleObj
       * {
       *  班级ID：{
       *    1_1: {
       *      preScheduleType: 固排/禁排 1固排 2禁排
       *      list: [固排对象或禁排列表]
       *    },
       *    1_2: {},
       *    ......
       *  },
       *  ......
       * }
       */
      preScheduleObj: {},
      /**
       * 其他班级各位置的固排
       * {
       *  1_1: [],
       *  1_2: []
       * }
       */
      otherClassRules: {},
      groupType: '', // 教研组课分为年级、学段、学校教研组（1、年级2、学段3、学校）
      groupList: [], // 教研组列表
      groupListFilter: [], // 过滤后的教研组列表
      operateList: [], // 操作记录列表
      step: 0,
      fromHand: '',
      hasModified: false, // 规则是否已修改
    };
  },
  computed: {
    stageTypesFilter () {
      let arry = this.stageTypes.filter(item => this.params.stageType.indexOf(item.enumValue) !== -1)
      return [{ enumField: '全部', enumValue: '' }].concat(arry)
    },
    classListObj () {
      let o = {}
      this.classList.forEach(item => {
        o[item.classId] = item
      })
      return o
    }
  },
  created () {
    this.fromHand = this.$route.query.fromHand || ''
    this.params.gradeIds = this.$route.query.gradeIds
    // 学期
    this.params.termId = this.$route.query.termId
    this.initParams.termId = this.params.termId
    // this.preScheduleParam.termId = this.$route.query.termId
    // 学校
    this.params.schoolId = this.$route.query.schoolId
    this.initParams.schoolId = this.params.schoolId
    // this.preScheduleParam.schoolId = this.$route.query.schoolId
    // 学年
    this.params.schoolYearId = this.$route.query.schoolYearId
    this.initParams.schoolYearId = this.params.schoolYearId
    // 年级列表
    this.$route.query.gradeIds && this.params.gradeId.push(...(this.$route.query.gradeIds + '').split(','))
    // 学段
    this.$route.query.stageType && this.params.stageType.push(...(this.$route.query.stageType + '').split(','))
    // 从基础数据中获取学段信息
    this.stageTypes.push(...this.dicFormater('SYS_BASE_STAGE_TYPE'))
    this.init()
    this.isPublish = this.$route.query.isPublish || ''
  },
  methods: {
    /**修改年级课表发布状态 */
    modifyTablePubStatus () {
      if (this.isPublish && parseInt(this.isPublish) === 1) {
        updCourseStatus({
          gradeIds: (this.params.gradeIds + '').split(','),
          termId: this.params.termId
        }).then(() => {
          this.isPublish = 0
        })
      }
    },
    handlerData (data) {
      if (data) {
        // 年级班级
        if (data.gradeDtos && data.gradeDtos.length > 0) {
          for (let gd = 0; gd < data.gradeDtos.length; gd++) {
            this.gradesList.push(data.gradeDtos[gd])
            this.gradesListFilter.push(data.gradeDtos[gd])
            if (data.gradeDtos[gd].classList && data.gradeDtos[gd].classList.length > 0) {
              if (!this.stageTypeObj[data.gradeDtos[gd].stageType]) {
                this.stageTypeObj[data.gradeDtos[gd].stageType] = []
              }
              this.stageTypeObj[data.gradeDtos[gd].stageType].push(data.gradeDtos[gd].uid)
              this.gradesObj[data.gradeDtos[gd].uid] = data.gradeDtos[gd].classList
              this.classList.push(...data.gradeDtos[gd].classList)
              this.classListFilter.push(...data.gradeDtos[gd].classList)
              for (let cl = 0; cl < data.gradeDtos[gd].classList.length; cl++) {
                this.classIdList.push(data.gradeDtos[gd].classList[cl].classId)
              }
            }
          }
        }
        // 根据年级返回的科目和老师 按年级存放 this.subjectAndTeacherDtos
        if (data.subjectAndTeacherDtos && data.subjectAndTeacherDtos.length > 0) {
          for (let satd = 0; satd < data.subjectAndTeacherDtos.length; satd++) {
            this.subjectAndTeacherDtos[data.subjectAndTeacherDtos[satd].gradeId] = data.subjectAndTeacherDtos[satd]
          }
        }
        // 教师任课表 不包含当前勾选年级下的已排课的班级
        if (data.timetableDtos && data.timetableDtos.length > 0) {
          this.teacherTeachTable = {}
          for (let td = 0; td < data.timetableDtos.length; td++) {
            this.teacherTeachTable[data.timetableDtos[td].teacherId] = {}
            if (data.timetableDtos[td].teacherTimetableItemDtoList && data.timetableDtos[td].teacherTimetableItemDtoList.length > 0) {
              for (let ttidl = 0; ttidl < data.timetableDtos[td].teacherTimetableItemDtoList.length; ttidl++) {
                this.teacherTeachTable[data.timetableDtos[td].teacherId][
                  data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].classIndex + '_' + data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].weekDay
                ] = data.timetableDtos[td].teacherTimetableItemDtoList[ttidl]

                // 设置老师天上课节数
                if (!this.teacherTeachingNums[data.timetableDtos[td].teacherId]) {
                  this.teacherTeachingNums[data.timetableDtos[td].teacherId] = {
                    [data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].weekDay]: 0
                  }
                } else if (!this.teacherTeachingNums[data.timetableDtos[td].teacherId][data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].weekDay]) {
                  this.teacherTeachingNums[data.timetableDtos[td].teacherId][data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].weekDay] = 0
                }
                this.teacherTeachingNums[data.timetableDtos[td].teacherId][data.timetableDtos[td].teacherTimetableItemDtoList[ttidl].weekDay] += 1
              }
            }
          }
        } else {
          this.teacherTeachTable = {}
        }
        // 班主任列表 如果规则打开了 才将数据存储 规则未打开 不存储该数据 以班级为维度存储到班主任对象
        // 在该位置为无课时 老师天数不需要 + 1
        if (this.teacherMasterSets.isOpen && data.classAndHeadMasterDtos && data.classAndHeadMasterDtos.length > 0) {
          this.teacherMasterObj = {}
          if (data.baseRuleDto) {
            this.teacherMasterSets.classIndex = data.baseRuleDto.classIndex
            this.teacherMasterSets.weekDay = data.baseRuleDto.weekDay
          }
          this.teacherTeachingNums = {}
          for (let cahmd = 0; cahmd < data.classAndHeadMasterDtos.length; cahmd++) {
            if (data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap) {
              for (let cahmm in data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap) {
                if (data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId && data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherName) {
                  this.teacherMasterObj[cahmm] = Object.assign(data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm], {
                    gradeId: data.classAndHeadMasterDtos[cahmd].gradeId
                  })
                  // 如果该班级在班主任课位置不为无课时 老师天上课节数需要 + 1
                  if (this.classNoCourseObj[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm]] && this.classNoCourseObj[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm]][this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay]) {
                    continue
                  }
                  
                  if (!this.teacherTeachingNums[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId]) {
                    this.teacherTeachingNums[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId] = {
                      [this.teacherMasterSets.weekDay]: 0
                    }
                  } else if (!this.teacherTeachingNums[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId][this.teacherMasterSets.weekDay]) {
                    this.teacherTeachingNums[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId][this.teacherMasterSets.weekDay] = 0
                  }
                  this.teacherTeachingNums[data.classAndHeadMasterDtos[cahmd].classAndHeadMasterMap[cahmm].teacherId][this.teacherMasterSets.weekDay] += 1
                }
              }
            }
          }
        } else {
          this.teacherMasterObj = {}
        }
        /**
         * 全校的教学计划
         * 整理出科目维度 subjectTeachingDivisions
         *  科目在各班的教学计划
         * {
         *  科目ID：{
         *    班级ID：{
         *      科目的教学计划数据
         *    }
         *  }
         * }
         * 整理出老师维度 teacherTeachingDivisions
         *  老师在各班的教学计划
         * {
         *  老师ID：{
         *    班级ID：[{科目的教学计划数据}]
         *  }
         * }
         */
        if (data.classTeachingDivisions && data.classTeachingDivisions.length > 0) {
          this.subjectTeachingDivisions = {}
          this.teacherTeachingDivisions = {}
          for (let ctd = 0; ctd < data.classTeachingDivisions.length; ctd++) {
            if (data.classTeachingDivisions[ctd].subjectTeachingDivisionList && data.classTeachingDivisions[ctd].subjectTeachingDivisionList.length > 0) {
              for (let std = 0; std < data.classTeachingDivisions[ctd].subjectTeachingDivisionList.length; std++) {
                // 科目教学计划
                if (!this.subjectTeachingDivisions[data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].uid]) {
                  this.subjectTeachingDivisions[data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].uid] = {}
                }
                this.subjectTeachingDivisions[data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].uid][
                  data.classTeachingDivisions[ctd].uid
                ] = Object.assign({setNums: 0}, deepCopy(data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std]))

                // 老师教学计划
                if (data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList && data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList.length > 0) {
                  for (let til = 0; til < data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList.length; til++) {
                    
                    this.teacherObj[data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid] = data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til]

                    if (!this.teacherTeachingDivisions[
                      data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid
                    ]) {
                      this.teacherTeachingDivisions[
                        data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid
                      ] = {
                        [data.classTeachingDivisions[ctd].uid] : []
                      }
                    } else if (!this.teacherTeachingDivisions[
                      data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid
                    ][data.classTeachingDivisions[ctd].uid]) {
                      this.teacherTeachingDivisions[
                        data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid
                      ][data.classTeachingDivisions[ctd].uid] = []
                    }
                    this.teacherTeachingDivisions[
                      data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std].teacherInfoList[til].uid
                    ][data.classTeachingDivisions[ctd].uid].push(data.classTeachingDivisions[ctd].subjectTeachingDivisionList[std])
                  }
                }
              }
            }
          }
        } else {
          this.subjectTeachingDivisions = {}
          this.teacherTeachingDivisions = {}
        }
        /**
         * 所有的预排规则列表 按班级存放 this.preScheduleObj
         * {
         *  班级ID：{
         *    1_1: {
         *      preScheduleType: 固排/禁排 1固排 2禁排
         *      list: [固排对象或禁排列表]
         *    },
         *    1_2: {},
         *    ......
         *  },
         *  ......
         * }
         */
        let noClassMstRuleClasses = [] // 打开班主任设置时，没有班主任规则的班级ID列表 用途：后续的班主任规则添加
        if (data.preScheduleInfosMap && data.preScheduleInfosMap.length > 0) {
          this.preScheduleObj = {}
          for (let psim = 0; psim < data.preScheduleInfosMap.length; psim++) {
            /**
             * 如果是固排 需要累积老师的上课节数 
             * 固排科目，该科目的已设定节数 + 1，该科目在该班级只由一个老师教，该老师的在当天上课节数需要 + 1
             * 固排老师，该老师的当天的上课节数 + 1，该老师在该班级只教一门科目，该科目的已设定节数 + 1
             * 
             * 如果打开了班主任设置，在班主任课的位置已设定规则，前面设定的班主任对应的老师的上课节数 - 1
             */
            if (this.teacherMasterSets.isOpen && this.teacherMasterSets.classIndex === data.preScheduleInfosMap[psim].classIndex && this.teacherMasterSets.weekDay === data.preScheduleInfosMap[psim].weekDay) {
              // 已经打开了班主任设置 并且循环到了该位置
              if (this.teacherMasterObj[data.preScheduleInfosMap[psim].classId]) {
                // 该班级有班主任
                this.teacherTeachingNums[this.teacherMasterObj[data.preScheduleInfosMap[psim].classId]['teacherId']][this.teacherMasterSets.weekDay] -= 1
              }
              // 设置没有班主任规则缓存
              noClassMstRuleClasses.indexOf(data.preScheduleInfosMap[psim].classId) === -1 && noClassMstRuleClasses.push(data.preScheduleInfosMap[psim].classId)
            }

            // 只对未删除的规则做存储 operateType = 1 填入 operateType = 2 删除
            if (data.preScheduleInfosMap[psim].operateType === 1) {
              if (!this.preScheduleObj[data.preScheduleInfosMap[psim].classId]) {
                this.preScheduleObj[data.preScheduleInfosMap[psim].classId] = {
                  [data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay]: []
                }
              } else if (!this.preScheduleObj[data.preScheduleInfosMap[psim].classId][data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay]) {
                this.preScheduleObj[data.preScheduleInfosMap[psim].classId][data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay] = []
              }
              this.preScheduleObj[data.preScheduleInfosMap[psim].classId][
                data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
              ].push(data.preScheduleInfosMap[psim])
              
              if (data.preScheduleInfosMap[psim].preScheduleType === 1) {
                // 固排
                if (data.preScheduleInfosMap[psim].objType === 1) {
                  // 固排科目
                  this.subjectTeachingDivisions[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].classId].setNums += 1

                  // 查看该班级该科目的老师是否只有一个
                  let teacherInfoList = this.subjectTeachingDivisions[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].classId].teacherInfoList
                  if (teacherInfoList && teacherInfoList.length === 1) {
                    let teacher = teacherInfoList[0]
                    if (!this.teacherTeachingNums[teacher.uid]) {
                      this.teacherTeachingNums[teacher.uid] = {
                        [data.preScheduleInfosMap[psim].weekDay]: 0
                      }
                    } else if (!this.teacherTeachingNums[teacher.uid][data.preScheduleInfosMap[psim].weekDay]) {
                      this.teacherTeachingNums[teacher.uid][data.preScheduleInfosMap[psim].weekDay] = 0
                    }
                    this.teacherTeachingNums[teacher.uid][data.preScheduleInfosMap[psim].weekDay] += 1

                    // 将其他班级的固排科目(该班级该科目只由一个老师教)和老师 放置到 this.otherClassRules 对象存储
                    if (this.classIdList.indexOf(data.preScheduleInfosMap[psim].classId) === -1) {
                      if (!this.otherClassRules[
                        data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                      ]) {
                        this.otherClassRules[
                          data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                        ] = []
                      }
                      this.otherClassRules[
                        data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                      ].push(Object.assign({
                        teacherId: teacher.uid
                      }, data.preScheduleInfosMap[psim]))
                    }
                    
                  }
                } else {
                  // 固排老师
                  if (!this.teacherTeachingNums[data.preScheduleInfosMap[psim].objId]) {
                    this.teacherTeachingNums[data.preScheduleInfosMap[psim].objId] = {
                      [data.preScheduleInfosMap[psim].weekDay]: 0
                    }
                  } else if (!this.teacherTeachingNums[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].weekDay]) {
                    this.teacherTeachingNums[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].weekDay] = 0
                  }
                  this.teacherTeachingNums[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].weekDay] += 1

                  // 查看该老师在该班级是否只教一门科目
                  if (this.teacherTeachingDivisions[data.preScheduleInfosMap[psim].objId] && this.teacherTeachingDivisions[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].classId]) {
                    let subjectList = this.teacherTeachingDivisions[data.preScheduleInfosMap[psim].objId][data.preScheduleInfosMap[psim].classId]
                    if (subjectList.length === 1) {
                      this.subjectTeachingDivisions[subjectList[0].uid][data.preScheduleInfosMap[psim].classId].setNums -= 1
                    }
                  }
                  // 如果该规则所在班级在未勾选范围内 存储到 otherClassRules 中
                  if (this.classIdList.indexOf(data.preScheduleInfosMap[psim].classId) === -1) {
                    if (!this.otherClassRules[
                      data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                    ]) {
                      this.otherClassRules[
                        data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                      ] = []
                    }
                    this.otherClassRules[
                      data.preScheduleInfosMap[psim].classIndex + '_' + data.preScheduleInfosMap[psim].weekDay
                    ].push(data.preScheduleInfosMap[psim])
                  }
                }
              }
            }
          }
          
        } else {
          this.preScheduleObj = {}
        }
        if (this.teacherMasterSets.isOpen) {
          // 在该位置为无课时 不添加班主任规则
          // 打开了班主任设置 主动添加班主任规则 到 this.preScheduleObj 对象存储
          for (let clt = 0; clt < this.classList.length; clt++) {
            if (noClassMstRuleClasses.indexOf(this.classList[clt].classId) === -1) {

              // 如果该班级在班主任课位置不为无课时 老师天上课节数需要 + 1
              if (this.classNoCourseObj[this.classList[clt].classId] && this.classNoCourseObj[this.classList[clt].classId][this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay]) {
                continue
              }

              if (!this.preScheduleObj[this.classList[clt].classId]) {
                this.preScheduleObj[this.classList[clt].classId] = {
                  [this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay]: []
                }
              } else if (!this.preScheduleObj[this.classList[clt].classId][
                this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay
              ]) {
                this.preScheduleObj[this.classList[clt].classId][
                  this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay
                ] = []
              }
              this.preScheduleObj[this.classList[clt].classId][
                this.teacherMasterSets.classIndex + '_' + this.teacherMasterSets.weekDay
              ].push({
                classId: this.classList[clt].classId,
                classIndex: this.teacherMasterSets.classIndex,
                gradeId: this.teacherMasterObj[this.classList[clt].classId] ? this.teacherMasterObj[this.classList[clt].classId].gradeId : null,
                objId: this.teacherMasterObj[this.classList[clt].classId] ? this.teacherMasterObj[this.classList[clt].classId].teacherId: null,
                objName: this.teacherMasterObj[this.classList[clt].classId] ? '班主任课' : '未设置班主任',
                isMstRule: 1,
                objType: 2,
                operateType: 1,
                preScheduleType: 1,
                weekDay: this.teacherMasterSets.weekDay
              })
            }
          }
        }
        // 教研组列表
        if (data.groups && data.groups.length > 0) {
          this.groupType = data.groups[0].objType // 教研组课分为年级、学段、学校教研组（1、学段2、年级3、学校）
          this.groupList.push(...data.groups)
          this.groupListFilter.push(...data.groups)
        }
        this.$refs['CourseNavComp'].setData()
        this.$refs['CourseRuleComp'].setCourseTable()
      }
    },
    /**初始化获取当前界面所有数据 */
    init () {
      this.$_showLoading()
      this.initParams.gradeIds = this.params.gradeIds
      Promise.all([this.getBaseData(), this.getBaseRule(), this.getAllPreRules()]).then((list) => {
        let data = list[0]
        this.handlerData(data)
        this.$nextTick(() => {
          this.$_hideLoading()
        })
      }).catch((error) => {
        this.$_hideLoading()
        error && this.$message.error(error)
        console.log(error)
      })
    },
    /**切换学段 */
    changeStageType (v) {
      /**====================过滤年级、班级开始 ====================*/
      this.formInline.gradeId = ''
      this.formInline.classId = ''
      this.gradesListFilter.splice(1, this.gradesListFilter.length)
      this.classListFilter.splice(1, this.classListFilter.length)
      if (v !== '') {
        let arry = []//, subject = [], teacher = []
        for (let i = 0; i < this.gradesList.length; i++) {
          if (this.gradesList[i].stageType + '' === v) {
            // 年级
            arry.push(this.gradesList[i])
            // 班级
            this.gradesList[i].classList && this.gradesList[i].classList.length > 0 && this.classListFilter.push(...this.gradesList[i].classList)
          }
        }
        this.gradesListFilter.push(...arry)
      } else {
        // 年级
        this.gradesListFilter.push(...this.gradesList)
        // 班级
        this.classListFilter.push(...this.classList)
      }
      // 重新设置 固排/禁排的科目和老师
      this.$refs['CourseNavComp'].setData()

      this.$refs['CourseRuleComp'].setCourseTable()
    },
    /**切换年级 */
    changeGrade (v) {
      /**====================过滤班级开始 ====================*/
      this.formInline.classId = ''
      this.classListFilter.splice(1, this.classListFilter.length)
      if (v !== '') {
        // let subject = [], teacher = []
        // 年级不为空
        for (let i = 0; i < this.gradesListFilter.length; i++) {
          if (this.gradesListFilter[i].uid === v) {
            // 班级
            this.gradesListFilter[i].classList && this.gradesListFilter[i].classList.length > 0 && this.classListFilter.push(...this.gradesListFilter[i].classList)
            break
          }
        }
      } else {
        // 年级为空 需要判断学段是否为空
        if (this.formInline.stageType !== '') {
          // let subject = [], teacher = []
          for (let i = 0; i < this.gradesListFilter.length; i++) {
            if (this.gradesListFilter[i].stageType + '' === this.formInline.stageType) {
              // 班级
              this.gradesListFilter[i].classList && this.gradesListFilter[i].classList.length > 0 && this.classListFilter.push(...this.gradesListFilter[i].classList)
            }
          }
        } else {
          // 班级
          this.classListFilter.push(...this.classList)
        }
      }
      // 重新设置 固排/禁排的科目和老师
      this.$refs['CourseNavComp'].setData()

      this.$refs['CourseRuleComp'].setCourseTable()
    },
    /**切换班级 */
    changeClass () {
      // 重新设置 固排/禁排的科目和老师
      this.$refs['CourseNavComp'].setData()

      this.$refs['CourseRuleComp'].setCourseTable()
    },
    /**获取所有基础数据 */
    getBaseData () {
      return new Promise((resolve, reject) => {
        getAllBaseData(this.initParams).then((res) => {
          if (res && res.data) {
            let data = res.data
            // this.handlerData(data)
            resolve(data)
          } else {
            reject('初始化数据失败，请刷新界面重新尝试')
          }
        }).catch(() => {
          reject()
        })
      })
    },
    /**根据学期ID获取所有的基础规则 */
    getBaseRule () {
      return new Promise((resolve, reject) => {
        baseRule({
          termId: this.initParams.termId,
          gradeIds: this.params.gradeIds
        }).then(res => {
          if (res && res.data && res.data.length > 0) {
            this.ruleList.push(...res.data)
            // for (let i = 0; i < this.ruleList.length; i++) {
            //   if (this.ruleList[i]['ruleType'] === 3) {
            //     // 每周一第一节设为班主任课
            //     this.teacherMasterSets.isOpen = this.ruleList[i]['isOpen']
            //   }
            // }
            this.$refs['CourseBaseRuleComp'].setRules(res.data)
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    /**查询当前学期所选年级下的无课、课时设置、预警值 */
    getAllPreRules () {
      return new Promise((resolve, reject) => {
        selectPreScheduleInfos(this.initParams).then(res => {
          let data = res.data
          // 无课 课时设置
          if (data.courseDtos && data.courseDtos.length > 0) {
            for (let i = 0; i < data.courseDtos.length; i++) {
              this.gradeNoCourseObj[data.courseDtos[i]['gradeId']] = Object.assign(data.courseDtos[i], {
                classIds: []
              })
              for (let j = 0; j < data.courseDtos[i].classInfoList.length; j++) {
                this.gradeNoCourseObj[data.courseDtos[i]['gradeId']]['classIds'].push(data.courseDtos[i].classInfoList[j].uid)
                // 将无课设置设置到班级上 后续要用到 this.classNoCourseObj
                if (data.courseDtos[i].baseGradeNoCourseList && data.courseDtos[i].baseGradeNoCourseList.length > 0) {
                  for (let k = 0; k < data.courseDtos[i].baseGradeNoCourseList.length; k++) {
                    if (!this.classNoCourseObj[
                      data.courseDtos[i].classInfoList[j].uid
                    ]) {
                      this.classNoCourseObj[
                        data.courseDtos[i].classInfoList[j].uid
                      ] = {}
                    }
                    this.classNoCourseObj[
                      data.courseDtos[i].classInfoList[j].uid
                    ][
                      data.courseDtos[i].baseGradeNoCourseList[k].classIndex + '_' + data.courseDtos[i].baseGradeNoCourseList[k].weekDay
                    ] = data.courseDtos[i].baseGradeNoCourseList[k]
                  }
                }
              }
            }
            if (data.planAlarms && data.planAlarms.length > 0) {
              for (let i = 0; i < data.planAlarms.length; i++) {
                if (data.planAlarms[i]['alarmType'] === 2) {
                  this.alarmValue = data.planAlarms[i]['alarmValue']
                }
              }
            }
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 清除所有
    clearConfirm () {
      this.modifyTablePubStatus()
      this.$_showLoading()
      clearAll({
        gradeIds: this.params.gradeId,
        termId: this.params.termId
      }).then(res => {
        this.hasModified = true
        // 需要返回 预排设置 preScheduleInfosMap []
        // 教学分工 classTeachingDivisions 数据
        this.handlerData(Object.assign(res.data, {
          preScheduleInfosMap: []
        }))
        this.$nextTick(() => {
          this.$_hideLoading()
          this.confirmClearDialog = false
        })
      })
    },
    // 撤销操作
    resetOperate (step) {
      let batchNos = []
      for (let i = 0; i < step + 1; i++) {
        batchNos.push(this.operateList[i].batchNo)
      }
      this.$_showLoading()
      revoke({ 
        batchNos,
        schoolId: this.params.schoolId,
        schoolYearId: this.params.schoolYearId,
        gradeIds: this.params.gradeId,
        termId: this.params.termId
      }).then(res => {
        // 需要返回 预排设置 preScheduleInfosMap []
        // 教学分工 classTeachingDivisions [] 数据
        this.handlerData(res.data)
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
    /**
     * 排课报告弹窗显示
     */
    autoSchedule () {
      this.modifyTablePubStatus()
      if (this.fromHand && !this.hasModified) {
        this.$router.push({ path: '/course/course-hand-arrange', query: {
          schoolId: this.params.schoolId,
          schoolYearId: this.params.schoolYearId,
          termId: this.params.termId,
          gradeIds: this.params.gradeIds
        } })
      } else {
        this.$refs["courseReportComp"].show();
        let ruleObj = this.$refs['CourseBaseRuleComp'].ruleObj, rule = {}
        for (let prop in ruleObj) {
          rule[prop] = ruleObj[prop].isOpen
        }
        autoScheduleCourse({
          schoolId: this.params.schoolId,
          schoolYearId: this.$route.query.schoolYearId,
          termId: this.params.termId,
          gradeIds: this.initParams.gradeIds,
          rule
        }).then(res => {
          this.$refs["courseReportComp"].setFinished(res.data)
        }).catch(() => {
          this.$refs["courseReportComp"].close();
        })
      }
      
    }
  },
  components: {
    CourseBaseRule,
    CourseNav,
    CourseRule,
    CourseReport
  }
};
</script>
<style lang="scss" scoped>
.course-pre-arrange {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
  
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
            padding: 10px 10px 0;
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
  .course-pre_container {
    width: 100%;
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: auto;
    .course-pre_content {
      width: 100%;
      height: 100%;
      min-height: 440px;
      overflow-x: hidden;
    }
  }
  .course-pre-arrange_content {
    position: relative;
    height: 100%;
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
    .course-tips {
      height: 50px;
      line-height: 50px;
      background: $course-pre-arrange-color1;
      color: $course-pre-arrange-color2;
      padding-left: 23px;
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
      height: calc(100% - 96px);
      display: flex;
      padding: 14px;
      &.noTips {
        height: calc(100% - 46px);
      }
      .course-arrange_left {
        width: 190px;
        border: 1px solid $course-pre-arrange-color3;
        position: relative;
        .course-arrange_left-top {
          width: 100%;
          height: 100%;
        }
        .nav-tab {
          height: 61px;
          position: relative;
          display: flex;
          padding: 15px 14px;
          // &:after {
          //   content: '';
          //   width: 173px;
          //   height: 1px;
          //   background: $course-pre-arrange-color3;
          //   position: absolute;
          //   bottom: 0;
          //   left: 8px;
          // }
          .nav-item {
            flex: 1;
            color: $course-pre-arrange-color17;
            background: $course-pre-arrange-color18;
            border: 1px solid $course-pre-arrange-color19;
            text-align: center;
            height: 32px;
            line-height: 30px;
            cursor: pointer;
            &.active {
              color: $course-pre-arrange-color20;
              background: $course-pre-arrange-color21;
              border: 1px solid $course-pre-arrange-color21;
            }
            &:first-child {
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            & + .nav-item {
              border-left: 0;
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
          }
        }
        .nav-tab-content {
          height: calc(100% - 61px);
          width: 100%;
        }
      }
      .course-arrange_center {
        min-width: 660px;
        flex: 1;
        height: 100%;
        .course-arrange_center-top {
          border-right: 1px solid $course-pre-arrange-color3;
          height: 63px;
          border-bottom: 1px solid $course-pre-arrange-color3;
          border-top: 1px solid $course-pre-arrange-color3;
          overflow: hidden;
          padding-top: 12px;
          padding-left: 10px;
          display: flex;
          .left-txt {
            width: 88px;
            padding-top: 8px;
            text-align: right;
          }
          .el-form {
            flex: 1;
            display: flex;
            margin-right: 10px;
          }
          .right-btn {
            margin-top: 2px;
            cursor: pointer;
            margin-right: 10px;
            width: 100px;
            height: 32px;
            line-height: 30px;
            text-align: center;
            border:1px solid rgba(219,219,219,1);
            border-radius:4px;
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
        width: 310px;
        border: 1px solid $course-pre-arrange-color3;
        position: relative;
        .course-arrange_right-top {
          height: 62px;
          padding-top: 23px;
          position: relative;
          &:after {
            content: "";
            width: 294px;
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
            left: 90px;
            background: $course-pre-arrange-color6;
            border-radius: 50px;
            // min-width: 20px;
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
        }
      }
    }
  }
}
</style>
<style lang="scss">
.course-pre-arrange {
  .course-arrange_center-top {
    .el-form-item {
      // width: 20%;
      .el-form-item__content,
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
