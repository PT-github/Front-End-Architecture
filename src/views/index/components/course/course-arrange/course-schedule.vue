<template>
  <div class="course-schedule">
    <div class="course-rules_left">
      <div class="course-rules_left-item"
        v-for="(item, index) in courseConfig.dayTotal"
        :key="index + '_courseParamInfos'"
        >
        {{ courseConfig.day[index] }}
      </div>
    </div>
    <div class="course-rules_right">
      <div class="course-rules_right-top">
        <div class="course-rule-header"
          v-for="(item, index) in courseConfig.weekTotal"
          :key="index + '_courseWeekDay'"
          >
          {{ courseConfig.week[index] }}
        </div>
      </div>
      <div class="course-rules_right-content">
        <div class="course-rules_tr"
          v-for="(item, index) in courseConfig.dayTotal"
          :key="index + '_courseParamInfos_table'"
          
          >
          <div class="course-rules_item "
            v-for="(day, idx) in courseConfig.weekTotal"
            :key="idx + '_courseWeekDay_table'"
            :draggable="courseTable[(index + 1) + '_' + (idx + 1)] && !courseTable[(index + 1) + '_' + (idx + 1)].noCourseFlag"
            @dragstart="dragstart($event, courseTable[(index + 1) + '_' + (idx + 1)])"
            @dragend="dragend($event)"
            @dragenter="dragenter($event, courseTable[(index + 1) + '_' + (idx + 1)])"
            @dragover="dragover"
            @drop="drop($event, index + 1, idx + 1)"
            @click="setTeacherCourse(courseTable[(index + 1) + '_' + (idx + 1)])"
            :class="{
              allow: !courseTable[(index + 1) + '_' + (idx + 1)] || (courseTable[(index + 1) + '_' + (idx + 1)] && courseTable[(index + 1) + '_' + (idx + 1)].canDragIn === 1),
              prevent: courseTable[(index + 1) + '_' + (idx + 1)] && courseTable[(index + 1) + '_' + (idx + 1)].canDragIn === 3,
              force: courseTable[(index + 1) + '_' + (idx + 1)] && courseTable[(index + 1) + '_' + (idx + 1)].canDragIn === 2,
              dragged: courseTable[(index + 1) + '_' + (idx + 1)] && courseTable[(index + 1) + '_' + (idx + 1)].dragged,
              isNoCourse: courseTable[(index + 1) + '_' + (idx + 1)] && courseTable[(index + 1) + '_' + (idx + 1)].noCourseFlag,
            }"
            >
            <template v-if="courseTable[(index + 1) + '_' + (idx + 1)] && !courseTable[(index + 1) + '_' + (idx + 1)].noCourseFlag">
              <div class="course">{{ courseTable[(index + 1) + '_' + (idx + 1)] ? courseTable[(index + 1) + '_' + (idx + 1)]['subjectName'] || '' : '' }}</div>
              <div class="teacher">{{ courseTable[(index + 1) + '_' + (idx + 1)] ? courseTable[(index + 1) + '_' + (idx + 1)]['teacherName'] || '' : '' }}</div>
            </template>
            <template v-else>
              <div>无课</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="dialog-comp" title="提示" width="600px" :visible.sync="confirmDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>与预设规则相冲突，是否继续
      </div>
      <div class="confirm-center">
        <!-- <span v-html="confirmContent"></span> -->
        <div class="confirm-table">
          <div class="confirm-table-tr th">
            <div class="confirm-table-td">序号</div>
            <div class="confirm-table-td">类型</div>
            <div class="confirm-table-td">星期</div>
            <div class="confirm-table-td">节次</div>
            <div class="confirm-table-td">内容</div>
            <!-- <div class="confirm-table-td">班级列表</div> -->
          </div>
          <div class="confirm-table-body">
            <div class="confirm-table-tr" v-for="(item, index) in confirmContentList" :key="index + '_confirmContentList'">
              <div class="confirm-table-td">{{ index + 1 }}</div>
              <div class="confirm-table-td">{{ item.type }}</div>
              <div class="confirm-table-td">{{ courseConfig.week[item.weekDay - 1] }}</div>
              <div class="confirm-table-td">{{ courseConfig.day[item.classIndex - 1] }}</div>
              <div class="confirm-table-td">{{ item.name }}</div>
              <!-- <div class="confirm-table-td">
                <template v-if="item.classList && item.classList.length <= 17">
                  共{{ item.nums }}个班：{{ item.classList }}
                </template>
                <template v-else>
                  <el-tooltip class="item" popper-class="confirmTableTooltip" effect="dark" :content="item.classList" placement="right">
                    <div>共{{ item.nums }}个班：{{ item.classList }}</div>
                  </el-tooltip>
                </template>
              </div> -->
            </div>
          </div>
          <!-- <div class="tips-txt">提示：确认操作，预设规则会被清除</div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirm">确 定</el-button>
        <el-button @click="cancelConfirm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="380px" :visible.sync="alarmPopupDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>是否继续?
      </div>
      <div class="confirm-center">
        {{ alarmContent }}{{ alarmValue }}节
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alarmConfirm">确 定</el-button>
        <el-button @click="alarmPopupDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deepCopy, generateBatchNo } from '@/utils'
import { manualAdjust } from '../../../store/api'
export default {
  name: 'CourseSchedule',
  props: ['alarmValue'],
  data () {
    return {
      confirmDialog: false, // 提示框控制
      courseConfig: { 
        dayTotal: 0,
        weekTotal: 0,
        week: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
        day: ['第一节','第二节','第三节','第四节','第五节','第六节','第七节','第八节','第九节','第十节','第十一节','第十二节','第十三节','第十四节',]
      },
      // 无课对象
      noCourseTable: {},
      // 课表对象
      courseTable: {},
      dragStartPoint: {
        classIndex: '',
        weekDay: '',
        subjectId: '',
        subjectName: '',
        teacherId: '',
        placeId: ''
      },
      dragStartData: null,
      tempData: null,
      batchNo: null,
      alarmPopupDialog: false,
      alarmContent: '',
      confirmContent: '',
      confirmContentList: []
    }
  },
  created () {
    // console.log(this.$parent.formInline.classId, this.$parent.classCourseTable)
  },
  methods: {
    setTeacherCourse (data) {
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(data)
    },
    cancelConfirm () {
      this.confirmDialog = false
      if (this.dragStartData && this.dragStartData.classIndex && this.dragStartData.weekDay) {
        this.$set(this.courseTable[this.dragStartData.classIndex + '_' + this.dragStartData.weekDay], 'dragged', false)
      }
      if (this.tempData && this.tempData.classIndex && this.tempData.weekDay) {
        this.$set(this.courseTable[this.tempData.classIndex + '_' + this.tempData.weekDay], 'dragged', false)
      }
    },
    showConflictPop () {
      this.confirmContent = ''
      this.confirmContentList.splice(0, this.confirmContentList.length)
      if (this.tempData.conflictList && this.tempData.conflictList.length > 0) {
        let obj = {}
        for (let i = 0; i < this.tempData.conflictList.length; i++) {
          // this.confirmContent += this.tempData.conflictList[i].className || ''
          // this.confirmContent += this.courseConfig.week[this.tempData.conflictList[i].weekDay - 1] + '第' + this.tempData.conflictList[i].classIndex + '节'
          // this.confirmContent += this.tempData.conflictList[i].preScheduleType === 1 ? '固排' : '禁排'
          // this.confirmContent += this.tempData.conflictList[i].objType === 1 ? '科目' : (this.tempData.conflictList[i].objType === 2 ? '老师' : '教研组')
          // this.confirmContent += this.tempData.conflictList[i].objName
          // i !== this.tempData.conflictList.length - 1 && (this.confirmContent += '<br/>')
          if (!obj[this.tempData.conflictList[i].objId + '_' + this.tempData.conflictList[i].preScheduleType]) {
            obj[this.tempData.conflictList[i].objId + '_' + this.tempData.conflictList[i].preScheduleType] = {
              type: this.tempData.conflictList[i].preScheduleType === 2 ? '禁排' : '固排',
              name: (this.tempData.conflictList[i].objType === 3 ? '教研组-' : '') + this.tempData.conflictList[i].objName,
              classIndex: this.tempData.conflictList[i].classIndex,
              weekDay: this.tempData.conflictList[i].weekDay,
              classNames: []
            }
          }
          obj[this.tempData.conflictList[i].objId + '_' + this.tempData.conflictList[i].preScheduleType].classNames.push(this.tempData.conflictList[i].className || '')
        }
        for (let prop in obj) {
          this.confirmContentList.push({
            type: obj[prop].type,
            name: obj[prop].name,
            nums: obj[prop].classNames.length,
            classIndex: obj[prop].classIndex,
            weekDay: obj[prop].weekDay,
            classList: obj[prop].classNames.join(',')
          })
        }
      }
      this.$nextTick(() => {
        this.confirmDialog = true
      })
    },
    alarmConfirm () {
      if (this.tempData.canDragIn && this.tempData.canDragIn === 2) {
        this.showConflictPop()
      } else {
        this.confirm()
      }
    },
    /**处理预警 */
    handlerAlarmValue () {
      let alarmValue = this.$parent.alarmValue
      let dragStartData = this.dragStartData
      let dropData = this.tempData
      let teacherTeachingNumsTable = this.$parent.teacherTeachingNumsTable
      this.alarmContent = ''
      if (alarmValue === 0) {
        return false
      } else if (!dragStartData.classIndex && !dragStartData.weekDay) {
        // 从暂存区拖拽到课表
        if (teacherTeachingNumsTable[dragStartData.teacherId] && teacherTeachingNumsTable[dragStartData.teacherId][dropData.weekDay]) {
          if (teacherTeachingNumsTable[dragStartData.teacherId][dropData.weekDay] + 1 > alarmValue) {
            this.alarmContent += dragStartData.teacherName + '上课节数已经超过预警值'
            this.alarmPopupDialog = true
            return true
          }
        }
      } else if (dragStartData.weekDay === dropData.weekDay || dragStartData.teacherId === dropData.teacherId) {
        return false
      } else {
        let flag = false
        // 拖拽起始位置的老师
        if (dragStartData.teacherId && teacherTeachingNumsTable[dragStartData.teacherId] && teacherTeachingNumsTable[dragStartData.teacherId][dropData.weekDay]) {
          if (teacherTeachingNumsTable[dragStartData.teacherId][dropData.weekDay] + 1 > alarmValue) {
            this.alarmContent += dragStartData.teacherName + this.courseConfig.week[dropData.weekDay - 1]
            flag = true
          }
        }
        if (dropData.teacherId && teacherTeachingNumsTable[dropData.teacherId] && teacherTeachingNumsTable[dropData.teacherId][dragStartData.weekDay]) {
          if (teacherTeachingNumsTable[dropData.teacherId][dragStartData.weekDay] + 1 > alarmValue) {
            this.alarmContent += this.alarmContent ? '，' : ''
            this.alarmContent += dropData.teacherName + this.courseConfig.week[dropData.weekDay - 1]
            flag = true
          }
        }
        if (flag) {
          this.alarmContent += '上课节数已经超过预警值'
          this.alarmPopupDialog = true
          return true
        }
      }
      return false
    },
    confirm () {
      this.$parent.modifyTablePubStatus()
      this.confirmDialog && (this.confirmDialog = false)
      let baseClassAutoCourseFine = {
        schoolId: this.$parent.params.schoolId,
        gradeId: this.$parent.formInline.gradeId,
        classId: this.$parent.formInline.classId,
        termId: this.$parent.params.termId,
        fineIndex: this.batchNo,
        weekDay: this.dragStartPoint.weekDay || null,
        classIndex: this.dragStartPoint.classIndex || null,
        subjectId: this.dragStartPoint.subjectId || null,
        teacherId: this.dragStartPoint.teacherId || null,
        placeId: this.dragStartPoint.placeId || null,
        weekDayAfter: this.tempData.weekDay || null,
        classIndexAfter: this.tempData.classIndex,
        subjectIdAfter: this.tempData.subjectId || null,
        teacherIdAfter: this.tempData.teacherId || null,
        placeIdAfter: this.tempData.placeId || null,
        stepContent: '',
      }
      let basePreScheduleInfos = []
      this.tempData.delRules && basePreScheduleInfos.push(...this.tempData.delRules)
      baseClassAutoCourseFine.stepContent = ''
      if (baseClassAutoCourseFine.weekDay) {
        baseClassAutoCourseFine.stepContent += '周' + baseClassAutoCourseFine.weekDay + '第' + baseClassAutoCourseFine.classIndex + '节'
      } else {
        baseClassAutoCourseFine.stepContent += '从暂存区拖拽'
      }
      if (this.dragStartPoint.subjectName) {
        baseClassAutoCourseFine.stepContent += this.dragStartPoint.subjectName
      }
      if (baseClassAutoCourseFine.weekDayAfter) {
        baseClassAutoCourseFine.stepContent += '与周' + baseClassAutoCourseFine.weekDayAfter + '第' + baseClassAutoCourseFine.classIndexAfter + '节' + (this.tempData.subjectName || '') + '互换'
      } else {
        baseClassAutoCourseFine.stepContent += '拖拽到暂存区'
      }
        '与周' + baseClassAutoCourseFine.weekDayAfter + '第' + baseClassAutoCourseFine.classIndexAfter + '节' + (this.tempData.subjectName || '') + '互换'
      console.log(baseClassAutoCourseFine)
      this.$parent.addOperateRecord(baseClassAutoCourseFine)
      /**
       * 科目互换需要更新
       * 1.老师的任课表
       * 2.老师每日上课节数
       * 当存在规则的移除时，需要再次更新1和2的数据
       **/
      this.$parent.refreshDataByExchange(this.dragStartData, this.tempData)
      /**
       * 刷新问题班级的暂存区和空白格子数
       */
      if (!baseClassAutoCourseFine.weekDay && !baseClassAutoCourseFine.classIndex) {
        // 位置信息不存在 表示从暂存区拖入到课表中
        if (baseClassAutoCourseFine.subjectIdAfter && baseClassAutoCourseFine.teacherIdAfter) {
          // 拖入的方格内有科目和老师 表示 暂存区与课表互换 暂存区数目和空白格子数目保持不变
        } else {
          // 不存在 表示暂存区拖入课表的空白格子中 暂存区数目、空白格子数目 - 1
          this.$parent.refreshClassAreaNums(baseClassAutoCourseFine.classId, -1, -1)
        }
      }
      manualAdjust({
        baseClassAutoCourseFine,
        basePreScheduleInfos
      }).then(res => {
        console.log(res)
      })
    },
    /**拖拽放置事件 */
    drop (e, classIndex, weekDay) {
      this.tempData = deepCopy(this.courseTable[classIndex + '_' + weekDay])
      // this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(this.tempData)
      e.stopPropagation();
      e.preventDefault();
      console.log(classIndex, weekDay)
      if ((this.dragStartPoint.classIndex === classIndex && this.dragStartPoint.weekDay === weekDay) || this.tempData.canDragIn === 3) {
        // 不允许被拖入
        return
      } else if (this.tempData.canDragIn && this.tempData.canDragIn === 2) {
        if (!this.handlerAlarmValue()) {
          this.showConflictPop()
        }
      } else {
        if (!this.handlerAlarmValue()) {
          this.confirm()
        }
      }
    },
    dragenter (e, data) {
      let tempDragstart = this.dragStartData
      if (data.teacherId && data.subjectId) {
        if (tempDragstart.teacherId && tempDragstart.subjectId) {
          if (data.teacherId !== tempDragstart.teacherId && data.subjectId !== tempDragstart.subjectId) {
            this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(data)
          } else {
            this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(null)
          }
        } else {
          this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(data)
        }
      } else {
        this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable({
          classIndex: data.classIndex,
          weekDay: data.weekDay
        })
      }
    },
    dragover (e) {
      e.preventDefault()
    },
    generatePreRuleObj ({batchNo, classIndex, weekDay, gradeId, classId, objName, preScheduleType, objType}) {
      let obj = {}
      obj.schoolId = this.$parent.params.schoolId
      obj.termId = this.$parent.params.termId
      obj.classId = classId || this.$parent.formInline.classId
      obj.gradeId = gradeId || this.$parent.formInline.gradeId
      obj.batchNo = batchNo
      obj.objName = objName
      obj.objType = objType
      obj.preScheduleType = preScheduleType
      obj.operateType = 2 // 1. 填入 2. 移除
      obj.weekDay = weekDay
      obj.classIndex = classIndex
      return obj
    },
    /**开始拖拽 */
    dragstart (e, data) {
      this.$parent.$refs['ExpClassTableComp'].closeView()
      this.dragStartData = data
      data && data.teacherId && data.subjectId && this.$parent.setStorageAreaData(true, data)
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(data)
      this.dragStartPoint.classIndex = data.classIndex
      this.dragStartPoint.weekDay = data.weekDay
      this.dragStartPoint.subjectId = data.subjectId
      this.dragStartPoint.teacherId = data.teacherId
      this.dragStartPoint.placeId = data.placeId
      this.dragStartPoint.subjectName = data.subjectName
      let classId = this.$parent.formInline.classId
      let batchNo = generateBatchNo()
      this.batchNo = batchNo
      /**
       * 可以强行拖入的情况（假如拖动A科目，对应老师为a，拖动到科目B位置，对应老师是b）
       * 当前班级，在B位置有A科目、a老师、a对应的教研组的禁排
       * 当前班级，在A位置处有B科目、b老师、b对应的教研组的禁排
       * 
       * 当前班级，在A位置有A科目、a老师的固排
       * 当前班级，在B位置有B科目、b老师的固排
       * 
       * 其他班级，在B位置有A科目、a老师的固排
       * 其他班级，在A位置有B科目、b老师的固排
       */
      console.log(data)
      if (data && data.teacherId && data.subjectId && this.$parent.preventTeacherRule[classId]) {
        // 有该老师对应的科目/老师/教研组的禁排
        if (this.$parent.groupObj[data.teacherId] && this.$parent.preventTeacherRule[classId].group.length > 0) {
          // 教研组的禁排
          for (let g = 0; g < this.$parent.preventTeacherRule[classId].group.length; g++) {
            if (this.$parent.groupObj[data.teacherId][this.$parent.preventTeacherRule[classId].group[g].objId]) {
              // 当前班级的禁排教研组
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]) {
                this.$set(this.courseTable,
                  this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay,
                  { conflictList: [] }
                )
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].group[g])
              
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].group[g].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].group[g].weekDay,
                  objName: '教研组-' + this.$parent.preventTeacherRule[classId].group[g].objName,
                  objType: 3,
                  preScheduleType: 2
                })
              )
            }
          }
        }
        if (this.$parent.preventTeacherRule[classId].subject.length > 0) {
          // 科目的禁排
          for (let s = 0; s < this.$parent.preventTeacherRule[classId].subject.length; s++) {
            if (this.$parent.preventTeacherRule[classId].subject[s].objId === data.subjectId) {
              // 当前班级的禁排科目
              // this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay], 'canDragIn', 2)
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]) {
                this.$set(this.courseTable,
                  this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay,
                  { conflictList: [] }
                )
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].subject[s])




              if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].subject[s].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].subject[s].weekDay,
                  objName: this.$parent.preventTeacherRule[classId].subject[s].objName,
                  objType: 1,
                  preScheduleType: 2
                })
              )
            }
          }
        }
        if (this.$parent.preventTeacherRule[classId].teacher.length > 0) {
          // 老师的禁排
          for (let s = 0; s < this.$parent.preventTeacherRule[classId].teacher.length; s++) {
            if (this.$parent.preventTeacherRule[classId].teacher[s].objId === data.teacherId) {
              // 当前班级的禁排老师
              // this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay], 'canDragIn', 2)
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]) {
                this.$set(this.courseTable,
                  this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay,
                  { conflictList: [] }
                )
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].teacher[s])



              if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].teacher[s].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].teacher[s].weekDay,
                  objName: this.$parent.preventTeacherRule[classId].teacher[s].objName,
                  objType: 2,
                  preScheduleType: 2
                })
              )
            }
          }
        } 
      }

      let fixedSubjectId = null, fixedTeacherId = null
      // 先找出 拖拽起始位置是否有固排 如果有 那么设置固排固排数据 下面循环时 不是该固排的科目/老师 则需要置红色
      if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].subject && this.$parent.fixedRule[classId].subject[data.classIndex + '_' + data.weekDay]) {
        // 起始位置有固排科目
        fixedSubjectId = this.$parent.fixedRule[classId].subject[data.classIndex + '_' + data.weekDay]
      }
      if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].teacher && this.$parent.fixedRule[classId].teacher[data.classIndex + '_' + data.weekDay]) {
        // 起始位置有固排老师
        fixedTeacherId = this.$parent.fixedRule[classId].teacher[data.classIndex + '_' + data.weekDay]
      }
      // 找到其他班级 在拖拽起始位置的固排 科目
      let otherFixedTeacherId = []
      for (let ftr in this.$parent.fixedUniqoTeacherRule) {
        if (parseInt(ftr) !== classId) {
          if (this.$parent.fixedUniqoTeacherRule[ftr] && this.$parent.fixedUniqoTeacherRule[ftr][data.classIndex + '_' + data.weekDay]) {
            otherFixedTeacherId.push(Object.assign(deepCopy(this.$parent.fixedUniqoTeacherRule[ftr][data.classIndex + '_' + data.weekDay]), {
              teacherId: this.$parent.fixedUniqoTeacherRule[ftr][data.classIndex + '_' + data.weekDay].teacherId
            }))
          }
        }
      }
      // 找到其他班级 在拖拽起始位置的固排 老师
      for (let ftr2 in this.$parent.fixedRule) {
        if (parseInt(ftr2) !== classId) {
          if (this.$parent.fixedRule[ftr2] && this.$parent.fixedRule[ftr2].teacher[data.classIndex + '_' + data.weekDay]) {
            otherFixedTeacherId.push(this.$parent.fixedRule[ftr2].teacher[data.classIndex + '_' + data.weekDay])
          }
        }
      }

      /** 
       * =========================================
       * 前面重新将班主任改为固排老师 此处注释舍弃
       * 判断是否打开了班主任规则
       * 打开
       *  判断当前班级在班主任课位置处是否有班主任规则
       *  -没有 程序继续
       *  -有 判断当前位置是否为班主任课的位置
       *        -是 其他非当前班级的班主任任课的方格置红色 *
       *        -不是 判断当前拖动的老师是否为当前班级的班主任
       *          -是 程序继续
       *          -不是 班主任课位置置红色 *
       * ps注意：当置红色时需要判断如下情况
       * A为班主任课的位置 B不是该班级的班主任 B是别的班级X的班主任
       *  A->B 需要判断X班级是否有班主任规则，如果有，做强行替换时需要删除X班的班主任规则
       * A不为班主任课的位置 B为班主任课的位置 A是别的班级X的班主任
       *  A->B 需要判断X班级是否有班主任规则，如果有，做强行替换时需要删除X班的班主任规则
       * =========================================
       */
      /*
      let teacherMasterId = ''
      if (this.$parent.isOpenTM) {
        if (this.$parent.teacherMstRuleMap[classId]) {
          // 当前班级有班主任规则
          let teacherMstId = this.$parent.teacherMstRuleMap[classId][
              this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay
            ].teacherId
          if (this.$parent.teacherMstRuleMap[classId][data.classIndex + '_' + data.weekDay]) {
            // 当前拖拽位置为班主任任课位置
            teacherMasterId = teacherMstId
          } else {
            // 当前拖拽位置不是班主任课位置
            // 判断当前拖拽位置的老师是否为班主任
            if (this.$parent.classHeadMasterIds.indexOf(data.teacherId) !== -1) {
              // 拖拽位置的老师是班主任
              // 判断该老师是否为当前班级的班主任
              if (data.teacherId !== teacherMstId) {
                // 判断该老师是班主任的班级 是否有班主任规则
                if (this.$parent.teacherMstRuleMap[this.$parent.classHeadMasterObj[data.teacherId].classId]) {
                  // 该老师是班主任的班级有班主任规则 需要删除该规则
                  this.$set(this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay], 'canDragIn', 2)

                  if (!this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules']) {
                    this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules'] = []
                  }
                  this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules'].push(
                    this.generatePreRuleObj(
                      batchNo,
                      this.$parent.isOpenTeacherMaster.classIndex,
                      this.$parent.isOpenTeacherMaster.weekDay,
                      this.$parent.classHeadMasterObj[data.teacherId].gradeId,
                      this.$parent.classHeadMasterObj[data.teacherId].classId
                    )
                  )
                }
              }
            } else {
              // 该拖拽位置的老师不是班主任 在班主任课的位置需要置红色
              this.$set(this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay], 'canDragIn', 2)

              if (!this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules']) {
                this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.isOpenTeacherMaster.classIndex + '_' + this.$parent.isOpenTeacherMaster.weekDay]['delRules'].push(
                this.generatePreRuleObj(
                  batchNo,
                  this.$parent.isOpenTeacherMaster.classIndex,
                  this.$parent.isOpenTeacherMaster.weekDay
                )
              )
            }
            
          }
        } else {
          // 循环其他班级的班主任规则
        }
      }
      */
      for (let ct in this.courseTable) {
        if (this.courseTable[ct] && this.courseTable[ct]['dragged']) {
          this.$set(this.courseTable[ct], 'dragged', false)
        }
        if (ct !== (data.classIndex + '_' + data.weekDay)) {
          if (data.teacherId && data.subjectId) {
            if (this.courseTable[ct] && this.courseTable[ct].teacherId === data.teacherId && this.courseTable[ct].subjectId === data.subjectId) {
              // 该方格的老师和科目与拖拽的方格的科目老师相同 不允许拖入 继续循环
              this.$set(this.courseTable[ct], 'canDragIn', 3)
              continue
            }
            // 在其他班级在循环的位置处有拖拽起始位置的老师对应科目（其他班级该科目和老师是一对一关系）的固排
            for (let ftr3 in this.$parent.fixedUniqoTeacherRule) {
              if (parseInt(ftr3) !== classId) {
                if (this.$parent.fixedUniqoTeacherRule[ftr3][ct] && this.$parent.fixedUniqoTeacherRule[ftr3][ct].teacherId === data.teacherId) {
                  if (!this.courseTable[ct]) {
                    this.$set(this.courseTable, ct, {
                      conflictList: []
                    })
                  } else if (!this.courseTable[ct].conflictList) {
                    this.courseTable[ct].conflictList = []
                  }
                  this.$set(this.courseTable[ct], 'canDragIn', 2)
                  this.courseTable[ct].conflictList.push(this.$parent.fixedUniqoTeacherRule[ftr3][ct])

                  if (!this.courseTable[ct]['delRules']) {
                    this.courseTable[ct]['delRules'] = []
                  }
                  this.courseTable[ct]['delRules'].push(
                    this.generatePreRuleObj({
                      batchNo,
                      classIndex: this.$parent.fixedUniqoTeacherRule[ftr3][ct].classIndex,
                      weekDay: this.$parent.fixedUniqoTeacherRule[ftr3][ct].weekDay,
                      gradeId: this.$parent.fixedUniqoTeacherRule[ftr3][ct].gradeId,
                      classId: this.$parent.fixedUniqoTeacherRule[ftr3][ct].classId,
                      objName: this.$parent.fixedUniqoTeacherRule[ftr3][ct].objName,
                      objType: 1,
                      preScheduleType: 1
                    })
                  )
                }
              }
            }
            // 在其他班级在循环的位置处有拖拽起始位置的老师的固排
            for (let ftr4 in this.$parent.fixedRule) {
              if (parseInt(ftr4) !== classId) {
                if (this.$parent.fixedRule[ftr4] && this.$parent.fixedRule[ftr4].teacher[ct] && this.$parent.fixedRule[ftr4].teacher[ct].objId === data.teacherId) {
                  if (!this.courseTable[ct]) {
                    this.$set(this.courseTable, ct, {
                      conflictList: []
                    })
                  } else if (!this.courseTable[ct].conflictList) {
                    this.courseTable[ct].conflictList = []
                  }
                  this.$set(this.courseTable[ct], 'canDragIn', 2)
                  this.courseTable[ct].conflictList.push(this.$parent.fixedRule[ftr4].teacher[ct])
                  if (!this.courseTable[ct]['delRules']) {
                    this.courseTable[ct]['delRules'] = []
                  }
                  this.courseTable[ct]['delRules'].push(
                    this.generatePreRuleObj({
                      batchNo,
                      classIndex: this.$parent.fixedRule[ftr4].teacher[ct].classIndex,
                      weekDay: this.$parent.fixedRule[ftr4].teacher[ct].weekDay,
                      gradeId: this.$parent.fixedRule[ftr4].teacher[ct].gradeId,
                      classId: this.$parent.fixedRule[ftr4].teacher[ct].classId,
                      objName: this.$parent.fixedRule[ftr4].teacher[ct].objName,
                      objType: 2,
                      preScheduleType: 1
                    })
                  )
                }
              }
            }
            // 判断当前位置是否有固排 如果有固排 判断拖拽的位置是否为该固排的科目或老师
            if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].subject && this.$parent.fixedRule[classId].subject[ct]) {
              // 当前位置有固排科目
              if (this.$parent.fixedRule[classId].subject[ct].objId !== data.subjectId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(this.$parent.fixedRule[classId].subject[ct])

                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: this.$parent.fixedRule[classId].subject[ct].classIndex,
                    weekDay: this.$parent.fixedRule[classId].subject[ct].weekDay,
                    objName: this.$parent.fixedRule[classId].subject[ct].objName,
                    objType: 1,
                    preScheduleType: 1
                  })
                )
              }
            }
            if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].teacher && this.$parent.fixedRule[classId].teacher[ct]) {
              // 当前位置有固排老师
              if (this.$parent.fixedRule[classId].teacher[ct].objId !== data.teacherId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(this.$parent.fixedRule[classId].teacher[ct])
                
                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: this.$parent.fixedRule[classId].teacher[ct].classIndex,
                    weekDay: this.$parent.fixedRule[classId].teacher[ct].weekDay,
                    objName: this.$parent.fixedRule[classId].teacher[ct].objName,
                    objType: 2,
                    preScheduleType: 1
                  })
                )
              }
            }
            // 不是当前拖拽的起始位置
            if (this.$parent.teacherTeachingTable[data.teacherId] && this.$parent.teacherTeachingTable[data.teacherId][ct] && this.$parent.teacherTeachingTable[data.teacherId][ct].classId !== classId) {
              // 该老师在其他班级的该位置有任课 该位置不允许被拖入
              if (!this.courseTable[ct]) {
                this.$set(this.courseTable, ct, {})
              }
              this.$set(this.courseTable[ct], 'canDragIn', 3)
            }
            if (this.courseTable[ct] && this.courseTable[ct].teacherId && this.$parent.teacherTeachingTable[this.courseTable[ct].teacherId] && this.$parent.teacherTeachingTable[this.courseTable[ct].teacherId][data.classIndex + '_' + data.weekDay] && this.$parent.teacherTeachingTable[this.courseTable[ct].teacherId][data.classIndex + '_' + data.weekDay].classId !== classId) {
              // 该位置的科目对应的老师 在其他班级拖拽起始位置有任课 该位置也不能被拖入
              this.$set(this.courseTable[ct], 'canDragIn', 3)
            }
          }
          if (this.courseTable[ct] && this.courseTable[ct].teacherId && this.courseTable[ct].subjectId) {
            /*
            if (teacherMasterId && this.courseTable[ct].teacherId !== teacherMasterId) {
              this.$set(this.courseTable[ct], 'canDragIn', 2)

              if (!this.courseTable[ct]['delRules']) {
                this.courseTable[ct]['delRules'] = []
              }
              this.courseTable[ct]['delRules'].push(
                this.generatePreRuleObj(
                  batchNo,
                  data.classIndex,
                  data.weekDay
                )
              )
            }
            */
            if (otherFixedTeacherId) {
              // 其他班级的拖拽起始位置处有科目(其他班级该科目和老师是一对一的关系)和老师的固排 当前位置的老师如果在范围中 那么当前位置不建议和起始位置互换
              for (let ofti = 0; ofti < otherFixedTeacherId.length; ofti ++) {
                if (this.courseTable[ct] && otherFixedTeacherId[ofti].teacherId === this.courseTable[ct].teacherId) {
                  if (!this.courseTable[ct]) {
                    this.$set(this.courseTable, ct, {
                      conflictList: []
                    })
                  } else if (!this.courseTable[ct].conflictList) {
                    this.courseTable[ct].conflictList = []
                  }
                  this.$set(this.courseTable[ct], 'canDragIn', 2)
                  this.courseTable[ct].conflictList.push(otherFixedTeacherId[ofti])

                  if (!this.courseTable[ct]['delRules']) {
                    this.courseTable[ct]['delRules'] = []
                  }
                  this.courseTable[ct]['delRules'].push(
                    this.generatePreRuleObj({
                      batchNo,
                      classIndex: otherFixedTeacherId[ofti].classIndex,
                      weekDay: otherFixedTeacherId[ofti].weekDay,
                      gradeId: otherFixedTeacherId[ofti].gradeId,
                      classId: otherFixedTeacherId[ofti].classId,
                      objName: otherFixedTeacherId[ofti].objName,
                      objType: otherFixedTeacherId[ofti].objType,
                      preScheduleType: 1
                    })
                  )
                }
              }
            }

            if (fixedSubjectId) {
              // 当前班级起始位置有固排科目
              if (this.courseTable[ct] && this.courseTable[ct].subjectId !== fixedSubjectId.objId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(fixedSubjectId)

                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: data.classIndex,
                    weekDay: data.weekDay,
                    objName: data.subjectName,
                    objType: 1,
                    preScheduleType: 1
                  })
                )
              }
            }
            if (fixedTeacherId) {
              // 起始位置有固排老师
              if (this.courseTable[ct] && this.courseTable[ct].teacherId !== fixedTeacherId.objId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(fixedTeacherId)

                // if (!this.courseTable[ct]) {
                //   this.$set(this.courseTable, ct, {})
                // }
                // this.$set(this.courseTable[ct], 'canDragIn', 2)

                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: data.classIndex,
                    weekDay: data.weekDay,
                    objName: data.subjectName,
                    objType: 2,
                    preScheduleType: 1
                  })
                )
              }
            }

            // 判断当前位置是否在拖拽起始位置有禁排 如果有禁排 那么要置为可强行拖入的红色
            // 有该老师对应的科目/老师/教研组的禁排
            if (this.$parent.preventTeacherRule[classId] && this.$parent.groupObj[this.courseTable[ct].teacherId] && this.$parent.preventTeacherRule[classId].group.length > 0) {
              // 教研组的禁排
              for (let goup = 0; goup < this.$parent.preventTeacherRule[classId].group.length; goup++) {
                if (this.$parent.groupObj[this.courseTable[ct].teacherId][this.$parent.preventTeacherRule[classId].group[goup].objId]) {
                  // 当前老师是当前禁排的教研组的成员 判断该教研组禁排的位置是否为拖拽起始位置
                  if (this.$parent.preventTeacherRule[classId].group[goup].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[goup].weekDay === data.classIndex + '_' + data.weekDay) {
                    if (!this.courseTable[ct]) {
                      this.$set(this.courseTable, ct, {
                        conflictList: []
                      })
                    } else if (!this.courseTable[ct].conflictList) {
                      this.courseTable[ct].conflictList = []
                    }
                    this.$set(this.courseTable[ct], 'canDragIn', 2)
                    this.courseTable[ct].conflictList.push(this.$parent.preventTeacherRule[classId].group[goup])
                    
                    if (!this.courseTable[ct]['delRules']) {
                      this.courseTable[ct]['delRules'] = []
                    }
                    this.courseTable[ct]['delRules'].push(
                      this.generatePreRuleObj({
                        batchNo,
                        classIndex: data.classIndex,
                        weekDay: data.weekDay,
                        objName: this.$parent.preventTeacherRule[classId].group[goup].objName,
                        objType: 3,
                        preScheduleType: 2
                      })
                    )
                  }
                }
              }
            }
            if (this.$parent.preventTeacherRule[classId] && this.$parent.preventTeacherRule[classId].subject.length > 0) {
              // 科目的禁排
              for (let sub = 0; sub < this.$parent.preventTeacherRule[classId].subject.length; sub++) {
                if (this.$parent.preventTeacherRule[classId].subject[sub].objId === this.courseTable[ct].subjectId) {
                  // 当前科目有禁排 看该禁排位置是否为拖拽起始位置
                  if (this.$parent.preventTeacherRule[classId].subject[sub].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[sub].weekDay === data.classIndex + '_' + data.weekDay) {
                    if (!this.courseTable[ct]) {
                      this.$set(this.courseTable, ct, {
                        conflictList: []
                      })
                    } else if (!this.courseTable[ct].conflictList) {
                      this.courseTable[ct].conflictList = []
                    }
                    this.$set(this.courseTable[ct], 'canDragIn', 2)
                    this.courseTable[ct].conflictList.push(this.$parent.preventTeacherRule[classId].subject[sub])

                    if (!this.courseTable[ct]['delRules']) {
                      this.courseTable[ct]['delRules'] = []
                    }
                    this.courseTable[ct]['delRules'].push(
                      this.generatePreRuleObj({
                        batchNo,
                        classIndex: data.classIndex,
                        weekDay: data.weekDay,
                        objName: this.$parent.preventTeacherRule[classId].subject[sub].objName,
                        objType: 1,
                        preScheduleType: 2
                      })
                    )
                  }
                }
              }
            }
            if (this.$parent.preventTeacherRule[classId] && this.$parent.preventTeacherRule[classId].teacher.length > 0) {
              // 老师的禁排
              for (let s = 0; s < this.$parent.preventTeacherRule[classId].teacher.length; s++) {
                if (this.$parent.preventTeacherRule[classId].teacher[s].objId === this.courseTable[ct].teacherId) {
                  // 当前老师有禁排 看该禁排位置是否为拖拽起始位置
                  if (this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay === data.classIndex + '_' + data.weekDay) {
                    if (!this.courseTable[ct]) {
                      this.$set(this.courseTable, ct, {
                        conflictList: []
                      })
                    } else if (!this.courseTable[ct].conflictList) {
                      this.courseTable[ct].conflictList = []
                    }
                    this.$set(this.courseTable[ct], 'canDragIn', 2)
                    this.courseTable[ct].conflictList.push(this.$parent.preventTeacherRule[classId].teacher[s])

                    if (!this.courseTable[ct]['delRules']) {
                      this.courseTable[ct]['delRules'] = []
                    }
                    this.courseTable[ct]['delRules'].push(
                      this.generatePreRuleObj({
                        batchNo,
                        classIndex: data.classIndex,
                        weekDay: data.weekDay,
                        objName: this.$parent.preventTeacherRule[classId].teacher[s].objName,
                        objType: 2,
                        preScheduleType: 2
                      })
                    )
                  }
                }
              }
            }
          }
          /**
           * 不允许拖入的情况（假如拖动A科目，对应老师为a）
           *  1.该位置为无课
           *  2.a老师在其他班级的位置处有任课（位置需要去除当前拖拽位置）
           *  3.循环到其他任课节数，该任课的老师在其他班级a的拖拽位置有任课
           */
          if (this.courseTable[ct] && this.courseTable[ct].noCourseFlag) {
            // 该位置为无课 直接设置进入拖入 继续循环
            this.$set(this.courseTable[ct], 'canDragIn', 3)
            continue
          }
          
          if (this.courseTable[ct] && !this.courseTable[ct]['canDragIn']) {
            this.$set(this.courseTable[ct], 'canDragIn', 1)
          }
        }
      }
      this.tempData = null
      e.dataTransfer.setData("Text", 'Hello World'); // firefox必须有数据才允许拖拽
    },
    setTableDataStatusByStorage (data) {
      this.dragStartPoint.classIndex = 0
      this.dragStartPoint.weekDay = 0
      this.dragStartPoint.subjectId = data.subjectId
      this.dragStartPoint.teacherId = data.teacherId
      this.dragStartData = data
      let classId = this.$parent.formInline.classId
      let batchNo = generateBatchNo()
      this.batchNo = batchNo
      console.log(data)
      if (data && data.teacherId && data.subjectId && this.$parent.preventTeacherRule[classId]) {
        // 有该老师对应的科目/老师/教研组的禁排
        if (this.$parent.groupObj[data.teacherId] && this.$parent.preventTeacherRule[classId].group.length > 0) {
          // 教研组的禁排
          for (let g = 0; g < this.$parent.preventTeacherRule[classId].group.length; g++) {
            if (this.$parent.groupObj[data.teacherId][this.$parent.preventTeacherRule[classId].group[g].objId]) {
              // 当前班级的禁排教研组
              
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]) {
                this.$set(this.courseTable, this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay, {
                  conflictList: []
                })
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].group[g])


              if (!this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].group[g].classIndex + '_' + this.$parent.preventTeacherRule[classId].group[g].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].group[g].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].group[g].weekDay,
                  objName: '教研组-' + this.$parent.preventTeacherRule[classId].group[g].objName,
                  objType: 3,
                  preScheduleType: 2
                })
              )
            }
          }
        }
        if (this.$parent.preventTeacherRule[classId].subject.length > 0) {
          // 科目的禁排
          for (let s = 0; s < this.$parent.preventTeacherRule[classId].subject.length; s++) {
            if (this.$parent.preventTeacherRule[classId].subject[s].objId === data.subjectId) {
              // 当前班级的禁排科目
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]) {
                this.$set(this.courseTable, this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay,{
                  conflictList: []
                })
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].subject[s])
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].subject[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].subject[s].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].subject[s].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].subject[s].weekDay,
                  objName: this.$parent.preventTeacherRule[classId].subject[s].objName,
                  objType: 1,
                  preScheduleType: 2
                })
              )
            }
          }
        }
        if (this.$parent.preventTeacherRule[classId].teacher.length > 0) {
          // 老师的禁排
          for (let s = 0; s < this.$parent.preventTeacherRule[classId].teacher.length; s++) {
            if (this.$parent.preventTeacherRule[classId].teacher[s].objId === data.teacherId) {
              // 当前班级的禁排老师
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]) {
                this.$set(this.courseTable, this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay, {
                  conflictList: []
                })
              } else if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList) {
                this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList = []
              }
              this.$set(this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay], 'canDragIn', 2)
              this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay].conflictList.push(this.$parent.preventTeacherRule[classId].teacher[s])
              if (!this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules']) {
                this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules'] = []
              }
              this.courseTable[this.$parent.preventTeacherRule[classId].teacher[s].classIndex + '_' + this.$parent.preventTeacherRule[classId].teacher[s].weekDay]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.preventTeacherRule[classId].teacher[s].classIndex,
                  weekDay: this.$parent.preventTeacherRule[classId].teacher[s].weekDay,
                  objName: this.$parent.preventTeacherRule[classId].teacher[s].objName,
                  objType: 2,
                  preScheduleType: 2
                })
              )
            }
          }
        }
      }
      for (let ct in this.courseTable) {
        if (this.courseTable[ct] && this.courseTable[ct]['dragged']) {
          this.$set(this.courseTable[ct], 'dragged', false)
        }
        if (data.teacherId && data.subjectId) {
          if (this.courseTable[ct] && this.courseTable[ct].teacherId === data.teacherId && this.courseTable[ct].subjectId === data.subjectId) {
            // 该方格的老师和科目与拖拽的方格的科目老师相同 不允许拖入 继续循环
            this.$set(this.courseTable[ct], 'canDragIn', 3)
            continue
          }
          // 在其他班级在循环的位置处有拖拽起始位置的老师对应的科目（其他班级该科目和老师是一对一关系）的固排
          for (let ftr3 in this.$parent.fixedUniqoTeacherRule) {
            if (parseInt(ftr3) !== classId) {
              if (this.$parent.fixedUniqoTeacherRule[ftr3][ct] && this.$parent.fixedUniqoTeacherRule[ftr3][ct].teacherId === data.teacherId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(this.$parent.fixedUniqoTeacherRule[ftr3][ct])
                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: this.$parent.fixedUniqoTeacherRule[ftr3][ct].classIndex,
                    weekDay: this.$parent.fixedUniqoTeacherRule[ftr3][ct].weekDay,
                    gradeId: this.$parent.fixedUniqoTeacherRule[ftr3][ct].gradeId,
                    classId: this.$parent.fixedUniqoTeacherRule[ftr3][ct].classId,
                    objName: this.$parent.fixedUniqoTeacherRule[ftr3][ct].objName,
                    objType: 1,
                    preScheduleType: 1
                  })
                )
              }
            }
          }
          // 在其他班级在循环的位置处有拖拽起始位置的老师的固排
          for (let ftr4 in this.$parent.fixedRule) {
            if (parseInt(ftr4) !== classId) {
              if (this.$parent.fixedRule[ftr4] && this.$parent.fixedRule[ftr4].teacher[ct] && this.$parent.fixedRule[ftr4].teacher[ct].objId === data.teacherId) {
                if (!this.courseTable[ct]) {
                  this.$set(this.courseTable, ct, {
                    conflictList: []
                  })
                } else if (!this.courseTable[ct].conflictList) {
                  this.courseTable[ct].conflictList = []
                }
                this.$set(this.courseTable[ct], 'canDragIn', 2)
                this.courseTable[ct].conflictList.push(this.$parent.fixedRule[ftr4].teacher[ct])
                if (!this.courseTable[ct]['delRules']) {
                  this.courseTable[ct]['delRules'] = []
                }
                this.courseTable[ct]['delRules'].push(
                  this.generatePreRuleObj({
                    batchNo,
                    classIndex: this.$parent.fixedRule[ftr4].teacher[ct].classIndex,
                    weekDay: this.$parent.fixedRule[ftr4].teacher[ct].weekDay,
                    gradeId: this.$parent.fixedRule[ftr4].teacher[ct].gradeId,
                    classId: this.$parent.fixedRule[ftr4].teacher[ct].classId,
                    objName: this.$parent.fixedRule[ftr4].teacher[ct].objName,
                    objType: 2,
                    preScheduleType: 1
                  })
                )
              }
            }
          }
          // 判断当前位置是否有固排 如果有固排 判断拖拽的位置是否为该固排的科目或老师
          if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].subject && this.$parent.fixedRule[classId].subject[ct]) {
            // 当前位置有固排科目
            if (this.$parent.fixedRule[classId].subject[ct].objId !== data.subjectId) {
              if (!this.courseTable[ct]) {
                this.$set(this.courseTable, ct, {
                  conflictList: []
                })
              } else if (!this.courseTable[ct].conflictList) {
                this.courseTable[ct].conflictList = []
              }
              this.$set(this.courseTable[ct], 'canDragIn', 2)
              this.courseTable[ct].conflictList.push(this.$parent.fixedRule[classId].subject[ct])

              if (!this.courseTable[ct]['delRules']) {
                this.courseTable[ct]['delRules'] = []
              }
              this.courseTable[ct]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.fixedRule[classId].subject[ct].classIndex,
                  weekDay: this.$parent.fixedRule[classId].subject[ct].weekDay,
                  objName: this.$parent.fixedRule[classId].subject[ct].objName,
                  objType: 1,
                  preScheduleType: 1
                })
              )
            }
          }
          if (this.$parent.fixedRule[classId] && this.$parent.fixedRule[classId].teacher && this.$parent.fixedRule[classId].teacher[ct]) {
            // 当前位置有固排老师
            if (this.$parent.fixedRule[classId].teacher[ct].objId !== data.teacherId) {
              if (!this.courseTable[ct]) {
                this.$set(this.courseTable, ct, {
                  conflictList: []
                })
              } else if (!this.courseTable[ct].conflictList) {
                this.courseTable[ct].conflictList = []
              }
              this.$set(this.courseTable[ct], 'canDragIn', 2)
              this.courseTable[ct].conflictList.push(this.$parent.fixedRule[classId].teacher[ct])
              
              if (!this.courseTable[ct]['delRules']) {
                this.courseTable[ct]['delRules'] = []
              }
              this.courseTable[ct]['delRules'].push(
                this.generatePreRuleObj({
                  batchNo,
                  classIndex: this.$parent.fixedRule[classId].teacher[ct].classIndex,
                  weekDay: this.$parent.fixedRule[classId].teacher[ct].weekDay,
                  objName: this.$parent.fixedRule[classId].teacher[ct].objName,
                  objType: 2,
                  preScheduleType: 1
                })
              )
            }
          }
          if (this.$parent.teacherTeachingTable[data.teacherId] && this.$parent.teacherTeachingTable[data.teacherId][ct] && this.$parent.teacherTeachingTable[data.teacherId][ct].classId !== classId) {
            // 该老师在其他班级的该位置有任课 该位置不允许被拖入
            if (!this.courseTable[ct]) {
              this.$set(this.courseTable, ct, {
                canDragIn: 3
              })
            } else {
              this.$set(this.courseTable[ct], 'canDragIn', 3)
            }
          }
        }
        /**
         * 不允许拖入的情况（假如拖动A科目，对应老师为a）
         *  1.该位置为无课
         *  2.a老师在其他班级的位置处有任课（位置需要去除当前拖拽位置）
         *  3.循环到其他任课节数，该任课的老师在其他班级a的拖拽位置有任课
         */
        if (this.courseTable[ct] && this.courseTable[ct].noCourseFlag) {
          // 该位置为无课 直接设置进入拖入 继续循环
          this.$set(this.courseTable[ct], 'canDragIn', 3)
          continue
        }
        
        if (this.courseTable[ct] && !this.courseTable[ct]['canDragIn']) {
          this.$set(this.courseTable[ct], 'canDragIn', 1)
        }
      }
    },
    dragendFromStorage () {
      for (let prop in this.courseTable) {
        if (this.courseTable[prop]) {
          this.$set(this.courseTable[prop], 'canDragIn', 0)
          this.$set(this.courseTable[prop], 'delRules', [])
          this.$set(this.courseTable[prop], 'conflictList', [])
          if (this.tempData && this.tempData.classIndex && this.tempData.weekDay && prop === this.tempData.classIndex + '_' + this.tempData.weekDay && !this.tempData.noCourseFlag && this.tempData.canDragIn && this.tempData.canDragIn !== 3) {
            this.$set(this.courseTable[prop], 'dragged', true)
          }
        }
      }
    },
    dragend () {
      this.$parent.setStorageAreaData(false)
      console.log('拖拽结束..........')
      for (let prop in this.courseTable) {
        if (this.courseTable[prop]) {
          this.$set(this.courseTable[prop], 'canDragIn', 0)
          this.$set(this.courseTable[prop], 'delRules', [])
          this.$set(this.courseTable[prop], 'conflictList', [])
          if (this.dragStartData && this.dragStartData.classIndex && this.dragStartData.weekDay && prop === this.dragStartData.classIndex + '_' + this.dragStartData.weekDay && this.tempData && this.tempData.canDragIn && this.tempData.canDragIn !== 3) {
            this.$set(this.courseTable[prop], 'dragged', true)
          }
          if (this.tempData && this.tempData.classIndex && this.tempData.weekDay && prop === this.tempData.classIndex + '_' + this.tempData.weekDay && !this.tempData.noCourseFlag && this.tempData.canDragIn && this.tempData.canDragIn !== 3) {
            this.$set(this.courseTable[prop], 'dragged', true)
          }
        }
      }
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(this.dragStartData)
      if (this.dragStartData && this.tempData && this.dragStartData.teacherId === this.tempData.teacherId) {
        this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(null, 'end')
      } else {
        this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(this.tempData, 'end')
      }
    },
    /**设置课表 */
    setCourseTable (f) {
      for (let prop in this.courseTable) {
        this.$set(this.courseTable, prop, null)
      }
      if (this.$parent.classCourseTable[this.$parent.formInline.classId]) {
        for (var i = 0; i < this.$parent.classCourseTable[this.$parent.formInline.classId].length; i++) {
          this.$set(this.courseTable, [
            this.$parent.classCourseTable[this.$parent.formInline.classId][i].classIndex + '_' + this.$parent.classCourseTable[this.$parent.formInline.classId][i].weekDay
          ], this.$parent.classCourseTable[this.$parent.formInline.classId][i])
        }
      }
      for (let i = 1; i <= this.courseConfig.dayTotal; i++) {
        for (let j = 1; j<= this.courseConfig.weekTotal; j++) {
          if (!this.courseTable[i + '_' + j]) {
            // 该位置不存在科目信息
            if (this.noCourseTable[i + '_' + j]) {
              // 该位置存在无课
              this.$set(this.courseTable, [i + '_' + j], {
                noCourseFlag: true,
                classIndex: i,
                weekDay: j
              })
            } else {
              this.$set(this.courseTable, [i + '_' + j], {
                classIndex: i,
                weekDay: j
              })
            }
          }
        }
      }
      if (f) {
        if (this.dragStartData && this.dragStartData.classIndex && this.dragStartData.weekDay) {
          this.$set(this.courseTable[this.dragStartData.classIndex + '_' + this.dragStartData.weekDay], 'dragged', true)
        }
        if (this.tempData && this.tempData.classIndex && this.tempData.weekDay) {
          this.$set(this.courseTable[this.tempData.classIndex + '_' + this.tempData.weekDay], 'dragged', true)
        }
      }
    },
    /**设置课时数据和无课设置 */
    setNoCourseTable () {
      if (this.$parent.courseParamInfos[this.$parent.formInline.gradeId]) {
        this.courseConfig.dayTotal = this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.courseAm + this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.coursePm
        this.courseConfig.weekTotal = this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.courseWeekDay
        // 无课列表
        for (let prop in this.noCourseTable) {
          delete this.noCourseTable[prop]
        }
        if (this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeNoCourseList && this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeNoCourseList.length > 0){
          for (let i = 0; i < this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeNoCourseList.length; i++) {
            this.noCourseTable[
              this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeNoCourseList[i].classIndex + '_' + this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeNoCourseList[i].weekDay
            ] = true
          }
        }
        this.setCourseTable()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.course-schedule {
  width: 100%;
  height: 100%;
  display: flex;
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
      .confirm-table {
        .confirm-table-tr {
          display: flex;
          &:not(:last-child) {
            border-bottom: 1px solid $course-list-color29;
          }
          &.th {
            color: #999999;
            background-color: #FAFAFA;
            border: 1px solid $course-list-color29;
          }
          .confirm-table-td {
            height: 50px;
            line-height: 50px;
            width: 50px;
            border-right: 1px solid $course-list-color29;
            text-align: center;
          }
          .confirm-table-td:nth-child(3), .confirm-table-td:nth-child(4) {
            width: 80px;
          }
          .confirm-table-td:nth-child(5) {
            flex: 1;
            border-right: 0;
          }
          // .confirm-table-td:nth-child(4) {
          //   text-align: left;
          //   flex: 1;
          //   padding-left: 5px;
          //   padding-right: 5px;
          //   white-space: nowrap;
          //   overflow: hidden;
          //   text-overflow: ellipsis;
          //   > div {
          //     white-space: nowrap;
          //     overflow: hidden;
          //     text-overflow: ellipsis;
          //     cursor: pointer;
          //   }
          // }
        }
        .confirm-table-body {
          max-height: 400px;
          overflow-y: auto;
          border-left: 1px solid $course-list-color29;
          border-right: 1px solid $course-list-color29;
          border-bottom: 1px solid $course-list-color29;
        }
        .tips-txt {
          height: 30px;
          line-height: 30px;
          text-align: left;
        }
      }
    }
  }
  .course-rules_right {
    flex: 1;
    .course-rules_right-top {
      height: 35px;
      background: $course-pre-arrange-color24;
      color: $course-pre-arrange-color25;
      border-right: 1px solid $course-pre-arrange-color3;
      display: flex;
      .course-rule-header {
        text-align: center;
        height: 35px;
        line-height: 35px;
        flex: 1;
      }
    }
    .course-rules_right-content {
      height: calc(100% - 35px);
      border-left: 1px solid $course-pre-arrange-color3;
      border-top: 1px solid $course-pre-arrange-color3;
      display: flex;
      flex-direction: column;
      .course-rules_tr {
        flex: 1;
        width: 100%;
        display: flex;
      }
      .course-rules_item {
        flex: 1;
        height: 100%;
        position: relative;
        text-align: center;
        border-right: 1px solid $course-pre-arrange-color3;
        border-bottom: 1px solid $course-pre-arrange-color3;
        cursor: pointer;
        display: flex;
        justify-content: center;
        flex-direction: column;
        overflow: hidden;
        padding: 0 5px;
        color: $course-schedule-color5;
        .course {
          font-weight: bold;
        }
        .teacher {
          font-size: 12px;
        }
        &.allow {
          // 允许被拖入
          background: $course-schedule-color1;
          color: $course-schedule-color3;
        }
        &.prevent {
          // 禁止被拖入样式
          background: $course-schedule-color2;
          color: $course-schedule-color4;
          
        }
        &.force {
          // 可强行被拖入样式
          background: $course-schedule-color6;
          color: $course-schedule-color7;
        }
        &.dragged {
          color: $course-schedule-color8;
          &:before {
            font-family: "iconfont" !important;
            font-size: 15px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            content: '\e660';
            position: absolute;
            top: 6px;
            right: 6px;
          }
        }
        &.isNoCourse {
          background: $course-schedule-color9;
          color: $course-schedule-color10;
        }
      }
    }
  }
  .course-rules_left {
    width: 35px;
    height: 100%;
    padding-top: 35px;
    background: $course-pre-arrange-color24;
    border-bottom: 1px solid $course-pre-arrange-color3;
    border-left: 1px solid $course-pre-arrange-color3;
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    .course-rules_left-item {
      flex: 1;
      // width: 20px;
      text-align: center;
      // padding-top: 13px;
      color: $course-pre-arrange-color25;
      writing-mode: vertical-lr;
    }
  }
}
</style>
<style lang="scss">
.confirmTableTooltip {
  max-width: 200px !important;
  line-height:25px;
}
</style>