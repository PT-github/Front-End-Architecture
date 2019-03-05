<template>
  <div class="course-rules">
    <div class="course-rules_left">
      <div class="course-rules_left-item" v-for="(item, index) in classIndex" :key="index + '_classIndex'">
        <span class="l">{{ baseConfig.times[index] }}</span>
        <span class="s">{{ index + 1 }}</span>
      </div>
    </div>
    
    <div class="course-rules_right">
      <div class="course-rules_right-top">
        <div class="course-rule-header" v-for="(item, index) in weekDay" :key="index + '_weekDay'">{{ baseConfig.week[index] }}</div>
      </div>
      <div class="course-rules_right-content">
        <div class="course-rules_tr" v-for="(item, index) in classIndex" :key="index + '_rules_tr'">
          <div class="course-rules_item"
            v-for="(item, idx) in weekDay"
            :key="index + '_rules_item_' + idx"
            @dragenter="dragenter($event)"
            @dragover="dragover"
            @drop="drop($event, index + 1, idx + 1)"
            :class="{
              reset: tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'],
              prevent: tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'] === 2,
              fixed: tableData[(index + 1) + '_' + (idx + 1)] && (tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'] === 1 || tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'] === 3),
              'can-dragIn': tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['canDraggingIn'] === 1,
              'can-dragIn-force': tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['canDraggingIn'] === 2,
              'cannot-dragIn': tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['canDraggingIn'] === 3,
              'isNoCourse': tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['isNoCourse']
            }"
            >
            <template>{{ tableData[(index + 1) + '_' + (idx + 1)] ? tableData[(index + 1) + '_' + (idx + 1)]['name'] : '' | strCutWithLen(15) }}</template>
            <div class="show-all" v-if="tableData[(index + 1) + '_' + (idx + 1)] && tableData[(index + 1) + '_' + (idx + 1)]['name'] && tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'] && tableData[(index + 1) + '_' + (idx + 1)]['preScheduleType'] !== 1 && !tableData[(index + 1) + '_' + (idx + 1)]['isNoCourse']">
              <template v-if="tableData[(index + 1) + '_' + (idx + 1)].preScheduleType">
                <span>{{ tableData[(index + 1) + '_' + (idx + 1)].preScheduleType === 1 ? '[固排]' : '[禁排]' }}</span>
              </template>
              {{tableData[(index + 1) + '_' + (idx + 1)]['name']}}
            </div>
            <div class="reset-cover" v-if="tableData[(index + 1) + '_' + (idx + 1)] && !tableData[(index + 1) + '_' + (idx + 1)]['isNoCourse']" @click="deletePreRule(index + 1, idx + 1, tableData[(index + 1) + '_' + (idx + 1)])"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="dialog-comp" title="提示" width="600px" :visible.sync="confirmReplaceDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>{{ confirmReplaceTitle }}
      </div>
      <div class="confirm-center">
        <!-- <span v-html="confirmReplaceContent"></span> -->
        <div class="confirm-table" v-if="confirmReplaceContentList && confirmReplaceContentList.length > 0">
          <div class="confirm-table-tr th">
            <div class="confirm-table-td">序号</div>
            <div class="confirm-table-td">类型</div>
            <div class="confirm-table-td">内容</div>
            <div class="confirm-table-td">班级列表</div>
          </div>
          <div class="confirm-table-body">
            <div class="confirm-table-tr" v-for="(item, index) in confirmReplaceContentList" :key="index + '_confirmReplaceContentList'">
              <div class="confirm-table-td">{{ index + 1 }}</div>
              <div class="confirm-table-td">{{ item.type }}</div>
              <div class="confirm-table-td">{{ item.name }}</div>
              <!-- <div class="confirm-table-td">共{{ item.classList.length }}个班：{{ item.classList }}</div> -->
              <div class="confirm-table-td">
                <template v-if="item.classList && item.classList.length <= 17">
                  共{{ item.nums }}个班：{{ item.classList }}
                </template>
                <template v-else>
                  <el-tooltip class="item" popper-class="confirmTableTooltip" effect="dark" :content="item.classList" placement="right">
                    <div>共{{ item.nums }}个班：{{ item.classList }}</div>
                  </el-tooltip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerReplaceEvent">确 定</el-button>
        <el-button @click="confirmReplaceDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="600px" :visible.sync="confirmDeleteDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>是否移除?
      </div>
      <div class="confirm-center">
        <!-- <span v-html="confirmDeleteContent"></span>confirmDeleteContentList -->
        <div class="confirm-table">
          <div class="confirm-table-tr th">
            <div class="confirm-table-td">序号</div>
            <div class="confirm-table-td">类型</div>
            <div class="confirm-table-td">内容</div>
            <div class="confirm-table-td">班级列表</div>
          </div>
          <div class="confirm-table-body">
            <div class="confirm-table-tr" v-for="(item, index) in confirmDeleteContentList" :key="index + '_confirmDeleteContentList'">
              <div class="confirm-table-td">{{ index + 1 }}</div>
              <div class="confirm-table-td">{{ item.type }}</div>
              <div class="confirm-table-td">{{ item.name }}</div>
              <div class="confirm-table-td">
                <template v-if="item.classList && item.classList.length <= 17">
                  共{{ item.nums }}个班：{{ item.classList }}
                </template>
                <template v-else>
                  <el-tooltip class="item" popper-class="confirmTableTooltip" effect="dark" :content="item.classList" placement="right">
                    <div>共{{ item.nums }}个班：{{ item.classList }}</div>
                  </el-tooltip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirm">确 定</el-button>
        <el-button @click="confirmDeleteDialog = false">取 消</el-button>
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
        <el-button @click="alarmCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--
    <el-dialog class="dialog-comp" title="提示" width="380px" :visible.sync="confirmReplaceAllDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>是否全部替换?
      </div>
      <div class="confirm-center">
        检测到一年级1班等N个班级已设置固排或禁排不能同时存在固排和禁排项
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replaceConfirm">确 定</el-button>
        <el-button @click="confirmReplaceAllDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="360px" :visible.sync="confirmReplaceDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>是否替换?
      </div>
      <div class="confirm-center">
        同一课时不能设置固排和禁排项
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replaceConfirm">确 定</el-button>
        <el-button @click="confirmReplaceDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="360px" :visible.sync="confirmConflictReplaceDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>{{conflictTitle}}
      </div>
      <div class="confirm-center">
        {{conflictInfo}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replaceConfirm">确 定</el-button>
        <el-button @click="confirmConflictReplaceDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="提示" width="360px" :visible.sync="alarmPop" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>是否继续
      </div>
      <div class="confirm-center">
        拖动的科目对应的老师或老师的单天课节数超过了预警值
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goOnByAlarmPop">确 定</el-button>
        <el-button @click="alarmPop = false">取 消</el-button>
      </span>
    </el-dialog>
    -->
    <!-- <el-dialog class="dialog-comp" title="发布课表确认" width="360px" :visible.sync="confirmPublishDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>确认是否发布？
      </div>
      <div class="confirm-center">
        发布成功后将成为正式课表展示给各相关用户
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishFun">确 定</el-button>
        <el-button @click="confirmPublishDialog = false">取 消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { deepCopy, generateBatchNo } from '@/utils'
import { savePreScheduleInfo } from '../../../store/api'
export default {
  name: 'CourseRule',
  props: ['alarmValue'],
  data () {
    return {
      confirmDeleteContent: '',
      confirmDeleteContentList: [],
      baseConfig: {
        week: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
        times: ['第一节','第二节','第三节','第四节','第五节','第六节','第七节','第八节','第九节','第十节','十一节','十二节','十三节','十四节',],
      },
      classIndex: 0, // 课节数
      weekDay: 0, // 每周天数
      tableData: {}, // 表格内容
      confirmReplaceDialog: false, // 提示框 显示控制
      confirmReplaceTitle: '', // 标题
      confirmReplaceContent: '', // 提示内容
      confirmReplaceContentList: [], // 提示内容列表
      classFormat: null, // 班级对象 key为班级id value为班级对象

      objId: '', // 拖拽项 ID
      objType: '', // 拖拽项类型
      objName: '', // 拖拽项名称
      preScheduleType: '', // 禁排/固排拖拽
      tempTableData: null, // 拖拽放下时 方格的数据

      batchNo: '',
      dropClassIndex: '',
      dropWeekDay: '',

      deleteArray: [],
      confirmDeleteDialog: false,
      deleteClassIndex: '',
      deleteWeekDay: '',
      deleteData: '',
      alarmPopupDialog: false,
      alarmContent: ''
    }
  },
  methods: {
    deleteConfirm () {
      let classIndex = this.deleteClassIndex
      let weekDay = this.deleteWeekDay
      let data = this.deleteData
      let arry = [], text = ''
      let classIds = this.getClass()
      let batchNo = generateBatchNo(), operateObj = {}
      let name = data.name
      if (data.preScheduleType === 4 || data.preScheduleType === 3) {
        text = ''
      } else if (data.preScheduleType === 1) {
        text = '固排'
      } else if (data.preScheduleType === 2) {
        text = '禁排'
      }
      operateObj.batchNo = batchNo
      operateObj.operateInfoTitle = text + this.baseConfig.week[weekDay - 1] + this.baseConfig.times[classIndex - 1] + '：' + name
      operateObj.operateInfoDesc = '移除：'
      this.$parent.operateList.splice(0, 0, operateObj)
      for (let i = 0; i < classIds.length; i++) {
        let obj = {}
        obj.schoolId = this.$parent.params.schoolId
        obj.termId = this.$parent.params.termId
        obj.classId = classIds[i]
        obj.gradeId = this.$parent.classListObj[classIds[i]]['gradeId']
        obj.batchNo = batchNo
        obj.operateType = 2 // 1. 填入 2. 移除
        obj.weekDay = weekDay
        obj.classIndex = classIndex
        obj.operateInfo = '移除：' + text + this.baseConfig.week[weekDay - 1] + this.baseConfig.times[classIndex - 1] + '：' + name + '（范围：' + this.$parent.classListObj[classIds[i]]['classFullName'] + '）'
        operateObj.operateInfoDesc += this.$parent.classListObj[classIds[i]]['classFullName']
        i !== classIds.length - 1 && (operateObj.operateInfoDesc += ',')
        arry.push(obj)
        // 设置预设规则对象
        if (this.$parent.preScheduleObj[classIds[i]] && this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay]) {
          for (let preR = 0; preR < this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay].length; preR++) {
            if (this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].preScheduleType === 1) {
              // 固排 对应的科目设定节数 - 1 对应老师的天上课节数 - 1
              if (this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objType === 1) {
                // 科目
                this.$parent.subjectTeachingDivisions[this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objId][obj.classId].setNums -= 1

                let teacher = this.$parent.subjectTeachingDivisions[this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objId][obj.classId].teacherInfoList
                if (teacher && teacher.length === 1) {
                  this.$parent.teacherTeachingNums[teacher[0].uid][weekDay] -= 1
                }

              } else {
                // 老师
                if (this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objId) {
                  this.$parent.teacherTeachingNums[this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objId][weekDay] -= 1

                  let subject = this.$parent.teacherTeachingDivisions[this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay][preR].objId][obj.classId]
                  if (subject && subject.length === 1) {
                    this.$parent.subjectTeachingDivisions[subject[0].uid][obj.classId].setNums -= 1
                  }
                }
              }
            }
          }
          delete this.$parent.preScheduleObj[classIds[i]][classIndex + '_' + weekDay]
        }
      }
      this.deleteArray.push(...arry)
      console.log(arry)
      this.setPreSchedule()
      this.savePreSchedule(this.deleteArray)
      this.$parent.$refs['CourseNavComp'].setData()
    },
    deletePreRule (classIndex, weekDay, data) {
      if (data.ruleList && data.ruleList.length > 0) {
        this.confirmDeleteContent = ''
        this.confirmDeleteContentList.splice(0, this.confirmDeleteContentList.length)
        let obj = {}
        for (let i = 0; i < data.ruleList.length; i++) {
          if (!obj[data.ruleList[i].objId + '_' + data.ruleList[i].preScheduleType]) {
            obj[data.ruleList[i].objId + '_' + data.ruleList[i].preScheduleType] = {
              type: data.ruleList[i].preScheduleType === 2 ? '禁排' : '固排',
              name: (data.ruleList[i].objType === 3 ? '教研组-' : '') + data.ruleList[i].objName,
              classNames: []
            }
          }
          obj[data.ruleList[i].objId + '_' + data.ruleList[i].preScheduleType].classNames.push(this.$parent.classListObj[data.ruleList[i].classId].classFullName)
          // this.confirmDeleteContent += this.$parent.classListObj[data.ruleList[i].classId].classFullName + '的'
          // this.confirmDeleteContent += data.ruleList[i].preScheduleType === 2 ? '禁排' : '固排'
          // this.confirmDeleteContent += (data.ruleList[i].objType === 3 ? '教研组-' : '') + data.ruleList[i].objName
          // this.confirmDeleteContent += i !== data.ruleList.length - 1 ? '<br/>' : ''
        }
        for (let prop in obj) {
          // this.confirmDeleteContent += '[' + obj[prop].type + ']'
          // this.confirmDeleteContent += obj[prop].name
          // this.confirmDeleteContent += '(' + obj[prop].classNames.length + ')' + '<br/>'
          this.confirmDeleteContentList.push({
            type: obj[prop].type,
            name: obj[prop].name,
            nums: obj[prop].classNames.length,
            classList: obj[prop].classNames.join(',')
          })
        }
        // if (this.confirmDeleteContent) {
        //   this.confirmDeleteContent = this.confirmDeleteContent.substr(0, this.confirmDeleteContent.length - 5)
        // }
      }
      this.deleteClassIndex = classIndex
      this.deleteWeekDay = weekDay
      this.deleteData = data
      this.deleteArray.splice(0, this.deleteArray.length)
      this.$nextTick(() => {
        this.confirmDeleteDialog = true
      })
    },
    /**保存预排规则 */
    savePreSchedule (arry) {
      this.$parent.modifyTablePubStatus()
      this.confirmDeleteDialog = false
      this.confirmReplaceDialog = false
      this.$parent.hasModified = true
      savePreScheduleInfo(arry).then(() => {
        console.log('保存预排设置成功')
      })
    },
    handlerReplaceEvent () {
      // 处理覆盖时需要删除的规则
      let delArry = []
      let objId = this.objId
      let objType = this.objType
      let preScheduleType = this.preScheduleType
      let classIds = this.getClass()
      let currentPreRules = deepCopy(this.$parent.preScheduleObj)
      let allClassIds = this.getAllClass()
      let teacherList = []

      if (preScheduleType === 1) {
        // 固排
        if (objType === 1) {
          // 固排科目 查看科目所对应的老师在当前勾选的年级下的所有班级内是否有固排 有 置为可强行拖入状态
          for (let cl = 0; cl < classIds.length; cl++) {
            let subject = this.$parent.subjectTeachingDivisions[objId][classIds[cl]]
            if (subject.teacherInfoList && subject.teacherInfoList.length === 1) {
              teacherList.push(subject.teacherInfoList[0].uid)
            }
          }
          for (let al1 = 0; al1 < allClassIds.length; al1++) {
            if (classIds.indexOf(allClassIds[al1]) === -1) {
              if (currentPreRules[allClassIds[al1]] && currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay] && currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay].length > 0) {
                for (let j = currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay].length - 1; j >= 0; j--) {
                  if (currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].preScheduleType === 1) {
                    // 固排
                    if (currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objType === 1) {
                      // 固排科目
                      let subject = deepCopy(this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objId])
                      if (subject[allClassIds[al1]] && subject[allClassIds[al1]].teacherInfoList && subject[allClassIds[al1]].teacherInfoList.length === 1) {
                        if (teacherList.indexOf(subject[allClassIds[al1]].teacherInfoList[0].uid) !== -1) {
                          delArry.push(Object.assign(currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j], {
                            operateType: 2,
                            batchNo: this.batchNo
                          }))
                          // 删除this.$parent.preScheduleObj中的固排科目
                          this.$parent.preScheduleObj[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay].splice(j, 1)
                          // 该班级的科目任课数 - 1
                          this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objId][allClassIds[al1]].setNums -= 1
                          // 该科目对应的该班级的老师的天任课数 - 1
                          this.$parent.teacherTeachingNums[subject[allClassIds[al1]].teacherInfoList[0].uid][this.dropWeekDay] -= 1
                        }
                      }
                    } else if (currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objType === 2 && teacherList.indexOf(currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objId) !== -1) {
                      // 固排老师
                      delArry.push(Object.assign(currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j], {
                        operateType: 2,
                        batchNo: this.batchNo
                      }))
                      // 删除this.$parent.preScheduleObj中的固排老师
                      this.$parent.preScheduleObj[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay].splice(j, 1)
                      // 该老师的天任课数 - 1
                      this.$parent.teacherTeachingNums[currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objId][this.dropWeekDay] -= 1
                      // 该老师在该班级如果只教一门科目 该科目的已上课数 - 1
                      let subjectList = this.$parent.teacherTeachingDivisions[currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].objId][currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].classId]
                      if (subjectList && subjectList.length === 1) {
                        this.$parent.subjectTeachingDivisions[subjectList[0].uid][currentPreRules[allClassIds[al1]][this.dropClassIndex + '_' + this.dropWeekDay][j].classId].setNums -= 1
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (objType === 2) {
          // 固排老师 查看在当前勾选的年级下的所有班级内 是否有老师的固排 科目的固排（科目和老师一对一） 有 置为可强行拖入状态
          for (let al = 0; al < allClassIds.length; al++) {
            if (classIds.indexOf(allClassIds[al]) === -1) {
              if (currentPreRules[allClassIds[al]] && currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay] && currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay].length > 0) {
                for (let i = currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay].length - 1; i >= 0; i--) {
                  if (currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].preScheduleType === 1) {
                    // 固排
                    if (currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objType === 2 && objId === currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objId) {
                      // 固排老师
                      delArry.push(Object.assign(currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i], {
                        operateType: 2,
                        batchNo: this.batchNo
                      }))
                      // 删除this.$parent.preScheduleObj中的固排老师
                      this.$parent.preScheduleObj[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay].splice(i, 1)
                      // 老师的天任课数 - 1
                      this.$parent.teacherTeachingNums[currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objId][this.dropWeekDay] -= 1
                      // 该老师在该班级如果只教一门科目 该科目的已上课数 - 1
                      let subjectList = this.$parent.teacherTeachingDivisions[currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objId][currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].classId]
                      if (subjectList && subjectList.length === 1) {
                        this.$parent.subjectTeachingDivisions[subjectList[0].uid][currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].classId].setNums -= 1
                      }
                    } else if (currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objType === 1) {
                      // 固排科目
                      let subject = deepCopy(this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objId])
                      if (subject[allClassIds[al]] && subject[allClassIds[al]].teacherInfoList && subject[allClassIds[al]].teacherInfoList.length === 1) {
                        if (subject[allClassIds[al]].teacherInfoList[0].uid === objId) {
                          delArry.push(Object.assign(currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i], {
                            operateType: 2,
                            batchNo: this.batchNo
                          }))
                          this.$parent.preScheduleObj[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay].splice(i, 1)

                          // 该班级的科目任课数 - 1
                          this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al]][this.dropClassIndex + '_' + this.dropWeekDay][i].objId][allClassIds[al]].setNums -= 1
                          // 该老师的天任课数 - 1
                          this.$parent.teacherTeachingNums[subject[allClassIds[al]].teacherInfoList[0].uid][this.dropWeekDay] -= 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(delArry)
      this.handlerDropEvent(delArry)
    },
    handlerDropEvent (delArry = []) {
      let batchNo = this.batchNo
      let classIds = this.getClass()
      let arry = [], text = this.preScheduleType === 1 ? '固排' : '禁排',
        name = '', operationObj = {
          operateInfoTitle: '',
          operateInfoDesc: ''
        }
      for (let i = 0; i < classIds.length; i++) {
        let obj = {}
        obj.objId = this.objId
        obj.objType = this.objType // 1科目2老师3教研组
        obj.objName = this.objName
        obj.schoolId = this.$parent.params.schoolId
        obj.termId = this.$parent.params.termId
        obj.classId = classIds[i]
        obj.gradeId = this.$parent.classListObj[classIds[i]]['gradeId']
        obj.batchNo = batchNo
        obj.operateType = 1 // 1. 填入 2. 移除
        obj.preScheduleType = this.preScheduleType
        obj.weekDay = this.dropWeekDay
        obj.classIndex = this.dropClassIndex
        name = this.objName
        if (this.objType === 3) {
          // 教研组
          name = '教研组-' + this.objName
        }
        obj.operateInfoTitle = text + '周' + this.baseConfig.week[this.dropWeekDay - 1] + '第' + this.baseConfig.times[this.dropClassIndex - 1] + '：' + name
        if (i === 0) {
          operationObj.batchNo = batchNo
          operationObj.operateInfoTitle = text + this.baseConfig.week[this.dropWeekDay - 1] + this.baseConfig.times[this.dropClassIndex - 1] + '：' + name
          operationObj.operateInfoDesc = '填入：'
        }
        operationObj.operateInfoDesc += this.$parent.classListObj[classIds[i]]['classFullName']
        obj.operateInfoDesc = '填入：' + this.$parent.classListObj[classIds[i]]['classFullName']
        arry.push(obj)
        
        if (this.preScheduleType === 1) {

          // 给父组件 添加规则
          if (!this.$parent.preScheduleObj[classIds[i]]) {
            this.$parent.preScheduleObj[classIds[i]] = {
              [obj.classIndex + '_' + obj.weekDay] : []
            }
          } else if (!this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay]) {
            this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay] = []
          } else {
            // 该位置存在规则 如果是固排 需要对该固排的科目和老师的数据进行处理
            if (this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay].length === 1) {
              // 固排只有一个
              let ruleObj = this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay][0]
              if (ruleObj.preScheduleType === 1) {
                if (ruleObj.objType === 1) {
                  // 固排科目 科目的已上课数 - 1 该科目对应的老师如果只有一个 老师的天任课数 - 1
                  this.$parent.subjectTeachingDivisions[ruleObj.objId][ruleObj.classId].setNums -= 1
                  let teacher = this.$parent.subjectTeachingDivisions[ruleObj.objId][ruleObj.classId].teacherInfoList
                  if (teacher && teacher.length === 1) {
                    this.$parent.teacherTeachingNums[teacher[0].uid][this.dropWeekDay] -= 1
                  }
                } else {
                  // 固排老师 老师的天任课数 - 1 该老师在该班级只教一门科目 该科目的已上课数 - 1
                  this.$parent.teacherTeachingNums[ruleObj.objId][this.dropWeekDay] -= 1
                  let subject = this.$parent.teacherTeachingDivisions[ruleObj.objId][ruleObj.classId]
                  if (subject && subject.length === 1) {
                    this.$parent.subjectTeachingDivisions[subject[0].uid][ruleObj.classId].setNums -= 1
                  }
                }
              }
            }
          }
          this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay] = [obj]
        } else if (this.preScheduleType === 2) {
          // 给父组件 添加规则
          if (!this.$parent.preScheduleObj[classIds[i]]) {
            this.$parent.preScheduleObj[classIds[i]] = {
              [obj.classIndex + '_' + obj.weekDay] : [obj]
            }
          } else if (!this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay]) {
            this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay] = [obj]
          } else {
            let _type, preventList = [], isFixed = false
            for (let pre = 0; pre < this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay].length; pre++) {
              _type = this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay][pre].preScheduleType
              
              if (_type === 1) {
                isFixed = true
                this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay] = [obj]

                // 该位置存在规则 如果是固排 需要对该固排的科目和老师的数据进行处理
                // 固排只有一个
                let ruleObj = this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay][pre]
                if (ruleObj.preScheduleType === 1) {
                  if (ruleObj.objType === 1) {
                    // 固排科目 科目的已上课数 - 1 该科目对应的老师如果只有一个 老师的天任课数 - 1
                    this.$parent.subjectTeachingDivisions[ruleObj.objId][ruleObj.classId].setNums -= 1
                    let teacher = this.$parent.subjectTeachingDivisions[ruleObj.objId][ruleObj.classId].teacherInfoList
                    if (teacher && teacher.length === 1) {
                      this.$parent.teacherTeachingNums[teacher[0].uid][this.dropWeekDay] -= 1
                    }
                  } else {
                    // 固排老师 老师的天任课数 - 1 该老师在该班级只教一门科目 该科目的已上课数 - 1
                    this.$parent.teacherTeachingNums[ruleObj.objId][this.dropWeekDay] -= 1
                    let subject = this.$parent.teacherTeachingDivisions[ruleObj.objId][ruleObj.classId]
                    if (subject && subject.length === 1) {
                      this.$parent.subjectTeachingDivisions[subject[0].uid][ruleObj.classId].setNums -= 1
                    }
                  }
                }
                break
              } else {
                // 给父组件 添加规则
                preventList.push(this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay][pre].objId + '_' + this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay][pre].objType)
              }
            }
            if (!isFixed) {
              if (preventList.indexOf(obj.objId + '_' + obj.objType) === -1) {
                this.$parent.preScheduleObj[classIds[i]][obj.classIndex + '_' + obj.weekDay].splice(0, 0, obj)
              } else {
                arry.splice(i, 1)
              }
            }
            
          }
        }
        if (this.preScheduleType === 1) {
          // 固排 科目已设定节数 + 1 老师 天上课节数 + 1
          if (this.objType === 1) {
            // 固排科目
            this.$parent.subjectTeachingDivisions[obj.objId][obj.classId].setNums += 1

            // 查看该班级该科目的老师是否只有一个
            let teacherInfoList = this.$parent.subjectTeachingDivisions[obj.objId][obj.classId].teacherInfoList
            if (teacherInfoList && teacherInfoList.length === 1) {
              let teacher = teacherInfoList[0]
              if (!this.$parent.teacherTeachingNums[teacher.uid]) {
                this.$parent.teacherTeachingNums[teacher.uid] = {
                  [this.dropWeekDay]: 0
                }
              } else if (!this.$parent.teacherTeachingNums[teacher.uid][this.dropWeekDay]) {
                this.$parent.teacherTeachingNums[teacher.uid][this.dropWeekDay] = 0
              }
              this.$parent.teacherTeachingNums[teacher.uid][this.dropWeekDay] += 1
            }
          } else if (this.objType === 2) {
            // 固排老师
            if (!this.$parent.teacherTeachingNums[obj.objId]) {
              this.$parent.teacherTeachingNums[obj.objId] = {
                [this.dropWeekDay]: 0
              }
            } else if (!this.$parent.teacherTeachingNums[obj.objId][this.dropWeekDay]) {
              this.$parent.teacherTeachingNums[obj.objId][this.dropWeekDay] = 0
            }
            this.$parent.teacherTeachingNums[obj.objId][this.dropWeekDay] += 1

            // 查看该老师在该班级是否只教一门科目
            if (this.$parent.teacherTeachingDivisions[obj.objId] && this.$parent.teacherTeachingDivisions[obj.objId][obj.classId]) {
              let subjectList = this.$parent.teacherTeachingDivisions[obj.objId][obj.classId]
              if (subjectList.length === 1) {
                this.$parent.subjectTeachingDivisions[subjectList[0].uid][obj.classId].setNums += 1
              }
            }
          }
        }
      }
      arry.push(...delArry)
      // 去除有无课设置班级的规则
      for (let j = arry.length - 1; j >= 0; j--) {
        if (this.$parent.classNoCourseObj[arry[j]['classId']] && this.$parent.classNoCourseObj[arry[j]['classId']][arry[j]['classIndex'] + '_' + arry[j]['weekDay']]) {
          if (this.$parent.preScheduleObj[arry[j]['classId']] && this.$parent.preScheduleObj[arry[j]['classId']][arry[j]['classIndex'] + '_' + arry[j]['weekDay']]) {
            this.$parent.preScheduleObj[arry[j]['classId']][arry[j]['classIndex'] + '_' + arry[j]['weekDay']].splice(0, this.$parent.preScheduleObj[arry[j]['classId']][arry[j]['classIndex'] + '_' + arry[j]['weekDay']].length)
          }
          arry.splice(j, 1)
        }
      }
      this.$parent.operateList.splice(0, 0, operationObj)
      this.setPreSchedule()
      if (arry.length === 0) {
        return
      }
      this.savePreSchedule(arry)
      this.$parent.$refs['CourseNavComp'].setData()
      console.log(arry)
    },
    alarmCancel () {
      this.alarmPopupDialog = false
      this.resetTableStatus()
    },
    alarmConfirm () {
      if (this.tempTableData) {
        if (this.tempTableData.canDraggingIn === 1) {
          this.handlerDropEvent()
        } else {
          this.handlerForceDragIn()
        }
      }
      this.alarmPopupDialog = false
    },
    /**处理预警信息 超过预警值 返回true 没有超过 返回false*/
    handlerAlarmValue () {
      let alarmValue = this.$parent.alarmValue
      let weekDay = this.dropWeekDay
      let objId = this.objId
      let classIds = this.getClass()
      if (alarmValue === 0) {
        return false
      } else if (this.tempTableData.canDraggingIn === 1) {
        // 预警值不为0 表示打开了预警设置 老师的天上课节数达到预警值 弹出提示框
        if (this.preScheduleType === 1) {
          // 固排
          if (this.objType === 1) {
            
            // 固排科目
            let subject = this.$parent.subjectTeachingDivisions[objId], teacherDayObj = {}
            for (let i = 0; i < classIds.length; i++) {
              if (subject[classIds[i]].teacherInfoList && subject[classIds[i]].teacherInfoList.length === 1) {
                if (!teacherDayObj[subject[classIds[i]].teacherInfoList[0]]) {
                  teacherDayObj[subject[classIds[i]].teacherInfoList[0].uid] = 0
                }
                teacherDayObj[subject[classIds[i]].teacherInfoList[0].uid] += 1
              }
            }
            let flag = false, arry = [], tempCount
            for (let prop in teacherDayObj) {
              if (!this.$parent.teacherTeachingNums[prop] || !this.$parent.teacherTeachingNums[prop][weekDay]) {
                tempCount = 0
              } else {
                tempCount = this.$parent.teacherTeachingNums[prop][weekDay]
              }
              if (tempCount + teacherDayObj[prop] > alarmValue) {
                arry.push(prop)
                flag = true
              } 
            }
            if (flag) {
              this.alarmContent = ''
              for (let i = 0; i < arry.length; i++) {
                this.alarmContent += this.$parent.teacherObj[arry[i]].teacherName + this.baseConfig.week[weekDay - 1]
                if (i !== arry.length - 1) {
                  this.alarmContent += '、'
                }
              }
              this.alarmContent += '上课节数已经超过预警值'
              this.alarmPopupDialog = true
              return true
            }
          } else {
            // 固排老师
            let teacherTeachingNums = this.$parent.teacherTeachingNums[objId + '']
            if (teacherTeachingNums && teacherTeachingNums[weekDay + ''] && (teacherTeachingNums[weekDay + ''] + 1) > alarmValue) {
              this.alarmPopupDialog = true
              this.alarmContent = this.$parent.teacherObj[objId].teacherName + this.baseConfig.week[weekDay - 1] + '上课节数已经超过预警值'
              return true
            }
          }
        }
      } else {
        let teacherDayObj1 = {}
        let ruleList = this.tempTableData.ruleList
        if (ruleList && ruleList.length > 0) {
          for (let r = 0; r < ruleList.length; r++) {
            if (ruleList[r].preScheduleType === 1) {
              // 固排
              if (ruleList[r].objType === 1) {
                // 固排科目
                let teacherInfoList = this.$parent.subjectTeachingDivisions[ruleList[r].objId][ruleList[r].classId].teacherInfoList
                if (teacherInfoList && teacherInfoList.length === 1) {
                  if (!teacherDayObj1[teacherInfoList[0].uid]) {
                    teacherDayObj1[teacherInfoList[0].uid] = 0
                  }
                  teacherDayObj1[teacherInfoList[0].uid] += 1
                }

              } else {
                // 固排老师
                if (!teacherDayObj1[ruleList[r].objId]) {
                  teacherDayObj1[ruleList[r].objId] = 0
                }
                teacherDayObj1[ruleList[r].objId] += 1
              }
            }
          }
        }
        let conflictList = this.tempTableData.conflictList
        if (conflictList && conflictList.length > 0) {
          for (let c = 0; c < conflictList.length; c++) {
            if (conflictList[c].preScheduleType === 1) {
              // 固排
              if (conflictList[c].objType === 1) {
                // 固排科目
                let teacherInfoList = this.$parent.subjectTeachingDivisions[conflictList[c].objId][conflictList[c].classId].teacherInfoList
                if (teacherInfoList && teacherInfoList.length === 1) {
                  if (!teacherDayObj1[teacherInfoList[0].uid]) {
                    teacherDayObj1[teacherInfoList[0].uid] = 0
                  }
                  teacherDayObj1[teacherInfoList[0].uid] += 1
                }
              } else {
                // 固排老师
                if (!teacherDayObj1[conflictList[c].objId]) {
                  teacherDayObj1[conflictList[c].objId] = 0
                }
                teacherDayObj1[conflictList[c].objId] += 1
              }
            }
          }
        }
        for (let prop in teacherDayObj1) {
          if (this.$parent.teacherTeachingNums[prop] && this.$parent.teacherTeachingNums[prop][this.dropWeekDay]) {
            teacherDayObj1[prop] = this.$parent.teacherTeachingNums[prop][this.dropWeekDay] - teacherDayObj1[prop]
          }
        }
        if (this.preScheduleType === 1) {
          // 固排
          if (this.objType === 1) {
            
            // 固排科目
            let subject = this.$parent.subjectTeachingDivisions[objId], teacherSelectIds = []
            for (let i = 0; i < classIds.length; i++) {
              if (subject[classIds[i]].teacherInfoList && subject[classIds[i]].teacherInfoList.length === 1) {
                teacherSelectIds.push(subject[classIds[i]].teacherInfoList[0].uid)
                if (Object.keys(teacherDayObj1).indexOf(subject[classIds[i]].teacherInfoList[0].uid + '') !== -1) {
                  teacherDayObj1[subject[classIds[i]].teacherInfoList[0].uid] += 1
                } else {
                  if (this.$parent.teacherTeachingNums[subject[classIds[i]].teacherInfoList[0].uid] && this.$parent.teacherTeachingNums[subject[classIds[i]].teacherInfoList[0].uid][this.dropWeekDay]) {
                    teacherDayObj1[subject[classIds[i]].teacherInfoList[0].uid] = this.$parent.teacherTeachingNums[subject[classIds[i]].teacherInfoList[0].uid][this.dropWeekDay]
                  }
                  teacherDayObj1[subject[classIds[i]].teacherInfoList[0].uid] += 1
                }
              }
            }
            let flag = false, arry = []
            for (let prop1 in teacherDayObj1) {
              if (teacherSelectIds.indexOf(parseInt(prop1)) !== -1) {
                if (teacherDayObj1[prop1] > alarmValue) {
                  arry.push(prop1)
                  flag = true
                } 
              }
            }
            if (flag) {
              this.alarmContent = ''
              for (let i = 0; i < arry.length; i++) {
                this.alarmContent += this.$parent.teacherObj[arry[i]].teacherName + this.baseConfig.week[weekDay - 1]
                if (i !== arry.length - 1) {
                  this.alarmContent += '、'
                }
              }
              this.alarmContent += '上课节数已经超过预警值'
              this.alarmPopupDialog = true
              return true
            }
          } else {
            // 固排老师
            if (Object.keys(teacherDayObj1).indexOf(objId + '') !== -1) {
              // 该老师ID 已经做了数据的加减处理
              if (teacherDayObj1[objId] + 1 > alarmValue) {
                this.alarmPopupDialog = true
                this.alarmContent = this.$parent.teacherObj[objId].teacherName + this.baseConfig.week[weekDay - 1] + '上课节数已经超过预警值'
                return true
              }
            } else {
              let teacherTeachingNums = this.$parent.teacherTeachingNums[objId + '']
              if (teacherTeachingNums && teacherTeachingNums[weekDay + ''] && (teacherTeachingNums[weekDay + ''] + 1) > alarmValue) {
                this.alarmPopupDialog = true
                this.alarmContent = this.$parent.teacherObj[objId].teacherName + this.baseConfig.week[weekDay - 1] + '上课节数已经超过预警值'
                return true
              }
            }
            
          }
        }
      }
      return false
    },
    /**拖拽放置事件 */
    drop (e, classIndex, weekDay) {
      this.batchNo = generateBatchNo()
      this.dropClassIndex = classIndex
      this.dropWeekDay = weekDay
      e.stopPropagation();
      e.preventDefault();
      this.getClassFormatter()
      this.tempTableData = deepCopy(this.tableData[classIndex + '_' + weekDay])
      if (this.tempTableData.canDraggingIn === 1) {
        // 可拖入 直接调接口 存数据
        if (!this.handlerAlarmValue()) {
          this.handlerDropEvent()
        }
      } else if (this.tempTableData.canDraggingIn === 2) {
        if (!this.handlerAlarmValue()) {
          this.handlerForceDragIn()
        }
      } else {
        // 不可拖入
      }
    },
    handlerForceDragIn () {
      this.confirmReplaceTitle = ''
      this.confirmReplaceContent = ''
      this.confirmReplaceContentList.splice(0, this.confirmReplaceContentList.length)
      // 可强行拖入 需要confirm
      if (this.tempTableData.preScheduleType === 3) {
        this.confirmReplaceTitle = '是否替换？'
        for (let i = 0; i < this.tempTableData.ruleList.length; i++) {
          this.confirmReplaceContent += this.classFormat[this.tempTableData.ruleList[i].classId].classFullName
          this.confirmReplaceContent += (i != this.tempTableData.ruleList.length - 1) ? '、' : ''
        }
        this.confirmReplaceContent += '班主任课设置'
      // } else if (this.tempTableData.preScheduleType === 4) {
      //   console.log(this.tempTableData)
      //   this.confirmReplaceTitle = '是否覆盖？'
      //   this.confirmReplaceContent += '各班不一致的设置'
      } else {
        let allIsPreventScheduleType = true // 是否全部为禁排标志（提示改为知否追加）
        if (this.tempTableData.preScheduleType === 4) {
          this.confirmReplaceTitle = '是否覆盖？'
        } else {
          this.confirmReplaceTitle = '是否替换？'
        }
        let obj = {}
        if (this.tempTableData && this.tempTableData.ruleList && this.tempTableData.ruleList.length > 0) {
          for (let i = 0; i < this.tempTableData.ruleList.length; i++) {
            // this.confirmReplaceContent += this.classFormat[this.tempTableData.ruleList[i].classId].classFullName + '的'
            // this.confirmReplaceContent += (this.tempTableData.ruleList[i].preScheduleType === 1 ? '固排' : '禁排') + this.tempTableData.ruleList[i].objName
            // this.confirmReplaceContent += (i != this.tempTableData.ruleList.length - 1) ? '<br/>' : ''
            this.tempTableData.ruleList[i].preScheduleType !== 2 && (allIsPreventScheduleType = false)
            if (!obj[this.tempTableData.ruleList[i].objId + '_' + this.tempTableData.ruleList[i].preScheduleType]) {
              obj[this.tempTableData.ruleList[i].objId + '_' + this.tempTableData.ruleList[i].preScheduleType] = {
                type: this.tempTableData.ruleList[i].preScheduleType === 2 ? '禁排' : '固排',
                name: (this.tempTableData.ruleList[i].objType === 3 ? '教研组-' : '') + this.tempTableData.ruleList[i].objName,
                classNames: []
              }
            }
            obj[this.tempTableData.ruleList[i].objId + '_' + this.tempTableData.ruleList[i].preScheduleType].classNames.push(this.$parent.classListObj[this.tempTableData.ruleList[i].classId].classFullName)
          }
        }
        if (this.tempTableData.conflictList && this.tempTableData.conflictList.length > 0) {
          // if (this.confirmReplaceContent) {
          //   this.confirmReplaceContent += '<br/>'
          // }
          for (let i = 0; i < this.tempTableData.conflictList.length; i++) {
            // this.confirmReplaceContent += this.classFormat[this.tempTableData.conflictList[i].classId].classFullName + '的'
            // this.confirmReplaceContent += (this.tempTableData.conflictList[i].preScheduleType === 1 ? '固排' : '禁排') + this.tempTableData.conflictList[i].objName
            // this.confirmReplaceContent += (i != this.tempTableData.conflictList.length - 1) ? '<br/>' : ''
            if (!obj[this.tempTableData.conflictList[i].objId + '_' + this.tempTableData.conflictList[i].preScheduleType]) {
              obj[this.tempTableData.conflictList[i].objId + '_' + this.tempTableData.conflictList[i].preScheduleType] = {
                type: this.tempTableData.conflictList[i].preScheduleType === 2 ? '禁排' : '固排',
                name: (this.tempTableData.conflictList[i].objType === 3 ? '教研组-' : '') + this.tempTableData.conflictList[i].objName,
                classNames: []
              }
            }
            obj[this.tempTableData.conflictList[i].objId + '_' + this.tempTableData.conflictList[i].preScheduleType].classNames.push(this.$parent.classListObj[this.tempTableData.conflictList[i].classId].classFullName)
          }
        }
        
        
        for (let prop in obj) {
          // this.confirmReplaceContent += '[' + obj[prop].type + ']'
          // this.confirmReplaceContent += obj[prop].name
          // this.confirmReplaceContent += '(' + obj[prop].classNames.length + ')' + '<br/>'
          this.confirmReplaceContentList.push({
            type: obj[prop].type,
            name: obj[prop].name,
            nums: obj[prop].classNames.length,
            classList: obj[prop].classNames.join(',')
          })
        }
        if (this.preScheduleType === 2 && allIsPreventScheduleType) {
          // 如果拖拽项为禁排 并且拖入的位置全部是禁排 提示标题改为是否追加
          this.confirmReplaceContentList.splice(0, this.confirmReplaceContentList.length)
          this.confirmReplaceTitle = '是否给各班追加[禁排]'
          this.confirmReplaceTitle += this.objType === 3 ? '教研组-' : ''
          this.confirmReplaceTitle += this.objName
        }
      }
      this.$nextTick(() => {
        this.confirmReplaceDialog = true
      })
    },
    /**
     * 拖拽时 改变表格数据状态
     * 
     */
    setTableStatus (objId, objType, objName, preScheduleType) {
      this.objId = objId
      this.objType = objType
      this.objName = objName
      this.preScheduleType = preScheduleType
      let classIds = this.getClass()
      let otherClassRules = deepCopy(this.$parent.otherClassRules)
      let currentPreRules = deepCopy(this.$parent.preScheduleObj)
      let allClassIds = this.getAllClass()
      let teacherList = []
      if (preScheduleType === 1) {
        // 固排
        if (objType === 1) {
          // 固排科目 查看科目所对应的老师 是否有任课 如果有任课 不能拖入

          // 固排科目 查看科目所对应的老师在当前勾选的年级下的所有班级内是否有固排 有 置为可强行拖入状态
          for (let cl = 0; cl < classIds.length; cl++) {
            let subject = this.$parent.subjectTeachingDivisions[objId][classIds[cl]]
            if (subject.teacherInfoList && subject.teacherInfoList.length === 1) {
              teacherList.push(subject.teacherInfoList[0].uid)
            }
          }
          for (let al1 = 0; al1 < allClassIds.length; al1++) {
            if (classIds.indexOf(allClassIds[al1]) === -1) {
              if (currentPreRules[allClassIds[al1]]) {
                for (let cp1 in currentPreRules[allClassIds[al1]]) {
                  if (currentPreRules[allClassIds[al1]][cp1].length > 0) {
                    for (let cpr1 = 0; cpr1 < currentPreRules[allClassIds[al1]][cp1].length; cpr1++) {
                      if (currentPreRules[allClassIds[al1]][cp1][cpr1].operateType === 1) {
                        if (teacherList.indexOf(currentPreRules[allClassIds[al1]][cp1][cpr1].objId) !== -1 && currentPreRules[allClassIds[al1]][cp1][cpr1].objType === 2) {
                          // 固排老师
                          if (!this.tableData[cp1]) {
                            this.$set(this.tableData, cp1, {
                              canDraggingIn: 2,
                              conflictList: [
                                currentPreRules[allClassIds[al1]][cp1][cpr1]
                              ]
                            })
                          } else {
                            this.$set(this.tableData[cp1], 'canDraggingIn', 2)
                            if (!this.tableData[cp1]['conflictList']) {
                              this.$set(this.tableData[cp1], 'conflictList', [])
                            }
                            this.tableData[cp1]['conflictList'].push(currentPreRules[allClassIds[al1]][cp1][cpr1])
                          }
                        } else if (currentPreRules[allClassIds[al1]][cp1][cpr1].objType === 1) {
                          // 固排科目
                          let subject = this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al1]][cp1][cpr1].objId]
                          if (subject[allClassIds[al1]] && subject[allClassIds[al1]].teacherInfoList && subject[allClassIds[al1]].teacherInfoList.length === 1) {
                            if (teacherList.indexOf(subject[allClassIds[al1]].teacherInfoList[0].uid) !== -1) {
                              if (!this.tableData[cp1]) {
                                this.$set(this.tableData, cp1, {
                                  canDraggingIn: 2,
                                  conflictList: [
                                    currentPreRules[allClassIds[al1]][cp1][cpr1]
                                  ]
                                })
                              } else {
                                this.$set(this.tableData[cp1], 'canDraggingIn', 2)
                                if (!this.tableData[cp1]['conflictList']) {
                                  this.$set(this.tableData[cp1], 'conflictList', [])
                                }
                                this.tableData[cp1]['conflictList'].push(currentPreRules[allClassIds[al1]][cp1][cpr1])
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          // 在未勾选的班级内有固排的科目或老师 该位置不能被固排
          for (let i = 0; i < classIds.length; i++) {
            if (this.$parent.subjectTeachingDivisions[objId][classIds[i]].teacherInfoList.length === 1) {
              let teacher = this.$parent.subjectTeachingDivisions[objId][classIds[i]].teacherInfoList[0]
              if (this.$parent.teacherTeachTable[teacher.uid]) {
                for (let ttt in this.$parent.teacherTeachTable[teacher.uid]) {
                  if (!this.tableData[ttt]) {
                    this.$set(this.tableData,ttt, {
                      canDraggingIn: 3
                    })
                  } else {
                    this.$set(this.tableData[ttt], 'canDraggingIn', 3)
                  }
                }
              }
              for (let ocr in otherClassRules) {
                if (otherClassRules[ocr] && otherClassRules[ocr].length > 0) {
                  for (let r = 0; r < otherClassRules[ocr].length; r++) {
                    if (otherClassRules[ocr][r].objType === 1 && otherClassRules[ocr][r].teacherId === teacher.uid) {
                      // 科目
                      if (!this.tableData[ocr]) {
                        this.$set(this.tableData, ocr, {
                          canDraggingIn: 3
                        })
                      } else {
                        this.$set(this.tableData[ocr], 'canDraggingIn', 3)
                      }
                    } else if (otherClassRules[ocr][r].objType === 2 && otherClassRules[ocr][r].objId === teacher.uid) {
                      // 老师
                      if (!this.tableData[ocr]) {
                        this.$set(this.tableData, ocr, {
                          canDraggingIn: 3
                        })
                      } else {
                        this.$set(this.tableData[ocr], 'canDraggingIn', 3)
                      }
                    }
                  }
                }
              }
            }
          }
          
          for (let prop in this.tableData) {
            if (this.tableData[prop]) {
              if (this.tableData[prop].canDraggingIn) {
                continue
              } else if (this.tableData[prop].isNoCourse) {
                this.$set(this.tableData[prop], 'canDraggingIn', 3)
              } else if (this.tableData[prop].preScheduleType === 3) {
                // 固排拖入班主任课
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else if (this.tableData[prop].preScheduleType === 4) {
                // 固排各班不一致
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else if (this.tableData[prop].preScheduleType === 1) {
                // 固排拖入固排 判断两者是否数据一致 如果一致 不允许拖入
                let o = this.tableData[prop].ruleList[0]
                if (o.objId === objId && o.objType === objType) {
                  this.$set(this.tableData[prop], 'canDraggingIn', 3)
                } else {
                  this.$set(this.tableData[prop], 'canDraggingIn', 2)
                }
              } else if (this.tableData[prop].preScheduleType === 2) {
                // 固排拖入禁排
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else {
                this.$set(this.tableData[prop], 'canDraggingIn', 1)
              }
            } else {
              this.$set(this.tableData, prop, {
                canDraggingIn: 1
              })
            }
          }
        } else if (objType === 2) {
          let classId = this.$parent.formInline.classId || this.$parent.classListFilter[1].classId
          // 固排老师 查看在当前勾选的年级下的所有班级内 是否有老师的固排 科目的固排（科目和老师一对一） 有 置为可强行拖入状态
          for (let al = 0; al < allClassIds.length; al++) {
            if (classIds.indexOf(allClassIds[al]) === -1) {
              if (currentPreRules[allClassIds[al]]) {
                for (let cp in currentPreRules[allClassIds[al]]) {
                  if (currentPreRules[allClassIds[al]][cp].length > 0) {
                    for (let cpr = 0; cpr < currentPreRules[allClassIds[al]][cp].length; cpr++) {
                      if (currentPreRules[allClassIds[al]][cp][cpr].operateType === 1) {
                        if (currentPreRules[allClassIds[al]][cp][cpr].objId === objId && currentPreRules[allClassIds[al]][cp][cpr].objType === 2) {
                          // 固排老师
                          if (!this.tableData[cp]) {
                            this.$set(this.tableData, cp, {
                              canDraggingIn: 2,
                              conflictList: [
                                currentPreRules[allClassIds[al]][cp][cpr]
                              ]
                            })
                          } else {
                            this.$set(this.tableData[cp], 'canDraggingIn', 2)
                            if (!this.tableData[cp]['conflictList']) {
                              this.$set(this.tableData[cp], 'conflictList', [])
                            }
                            this.tableData[cp]['conflictList'].push(currentPreRules[allClassIds[al]][cp][cpr])
                          }
                        } else if (currentPreRules[allClassIds[al]][cp][cpr].objType === 1) {
                          // 固排科目
                          let subject = this.$parent.subjectTeachingDivisions[currentPreRules[allClassIds[al]][cp][cpr].objId]
                          if (subject[allClassIds[al]] && subject[allClassIds[al]].teacherInfoList && subject[allClassIds[al]].teacherInfoList.length === 1) {
                            if (subject[allClassIds[al]].teacherInfoList[0].uid === objId) {
                              if (!this.tableData[cp]) {
                                this.$set(this.tableData, cp, {
                                  canDraggingIn: 2,
                                  conflictList: [
                                    currentPreRules[allClassIds[al]][cp][cpr]
                                  ]
                                })
                              } else {
                                this.$set(this.tableData[cp], 'canDraggingIn', 2)
                                if (!this.tableData[cp]['conflictList']) {
                                  this.$set(this.tableData[cp], 'conflictList', [])
                                }
                                this.tableData[cp]['conflictList'].push(currentPreRules[allClassIds[al]][cp][cpr])
                              }
                            }
                          }
                        }
                      } else {
                        if (!this.tableData[cp]) {
                          this.$set(this.tableData, cp, {
                            canDraggingIn: 2
                          })
                        } else {
                          this.$set(this.tableData[cp], 'canDraggingIn', 2)
                        }
                      }
                        
                    }
                  }
                  
                }
              }
            }
          }
          // 其他班级 有该老师的固排或科目的固排
          for (let ocr in otherClassRules) {
            if (otherClassRules[ocr] && otherClassRules[ocr].length > 0) {
              for (let r = 0; r < otherClassRules[ocr].length; r++) {
                if (otherClassRules[ocr][r].objType === 1 && otherClassRules[ocr][r].teacherId === objId) {
                  // 科目
                  if (!this.tableData[ocr]) {
                    this.$set(this.tableData, ocr, {
                      canDraggingIn: 3
                    })
                  } else {
                    this.$set(this.tableData[ocr], 'canDraggingIn', 3)
                  }
                } else if (otherClassRules[ocr][r].objType === 2 && otherClassRules[ocr][r].objId === objId) {
                  // 老师
                  if (!this.tableData[ocr]) {
                    this.$set(this.tableData, ocr, {
                      canDraggingIn: 3
                    })
                  } else {
                    this.$set(this.tableData[ocr], 'canDraggingIn', 3)
                  }
                }
              }
            }
          }
          // 固排老师 查看老师任课表 看是否有任课数据 有 置为3不可拖入
          for (let prop2 in this.tableData) {
            if (this.$parent.teacherTeachTable[objId] && this.$parent.teacherTeachTable[objId][prop2]) {
              if (!this.tableData[prop2]) {
                this.$set(this.tableData, prop2, {})
              }
              this.$set(this.tableData[prop2], 'canDraggingIn', 3)
              continue
            }
            if (this.tableData[prop2]) {
              if (this.tableData[prop2].isNoCourse) {
                this.$set(this.tableData[prop2], 'canDraggingIn', 3)
                continue
              }
              if (this.tableData[prop2].canDraggingIn) {
                continue
              }
              if (this.tableData[prop2].preScheduleType === 3) {
                // 固排拖入 班主任 查看该老师是否为该班班主任
                if (this.$parent.teacherMasterObj[classId] && this.$parent.teacherMasterObj[classId].teacherId === objId) {
                  this.$set(this.tableData[prop2], 'canDraggingIn', 1)
                } else {
                  this.$set(this.tableData[prop2], 'canDraggingIn', 2)
                }
              } else if (this.tableData[prop2].preScheduleType === 1) {
                // 固排拖入固排 判断两者是否数据一致 如果一致 不允许拖入
                let o = this.tableData[prop2].ruleList[0]
                if (o.objId === objId && o.objType === objType) {
                  this.$set(this.tableData[prop2], 'canDraggingIn', 3)
                } else {
                  this.$set(this.tableData[prop2], 'canDraggingIn', 2)
                }
              } else if (this.tableData[prop2].preScheduleType === 2) {
                // 固排拖入禁排
                this.$set(this.tableData[prop2], 'canDraggingIn', 2)
              } else {
                this.$set(this.tableData[prop2], 'canDraggingIn', 1)
              }
            } else {
              this.$set(this.tableData, prop2, {
                canDraggingIn: 1
              })
            }
          }
        }
      } else {
        // 禁排 只需要循环当前表格的tableData数据 不一致 显示可强行替换
        for (let prop in this.tableData) {
          if (this.tableData[prop]) {
            if (this.tableData[prop].isNoCourse) {
              this.$set(this.tableData[prop], 'canDraggingIn', 3)
              continue
            }
            if (this.tableData[prop].preScheduleType === 3 || this.tableData[prop].preScheduleType === 1 || this.tableData[prop].preScheduleType === 4) {
              // 禁排拖入 班主任/固排
              this.$set(this.tableData[prop], 'canDraggingIn', 2)
            } else {
              this.$set(this.tableData[prop], 'canDraggingIn', 1)
            }
          } else {
            this.$set(this.tableData, prop, {
              canDraggingIn: 1
            })
          }
        }
      }
    },
    /**
     * 根据条件 设置当前课节数和课表中的规则
     * 
     * 规则有如下情况
     * 1.各班不一致 preScheduleType = 4
     * 2.固排 preScheduleType = 1
     * 3.禁排需要多个合并 preScheduleType = 2
     * 4.无课 isNoCourse = true
     * 5.班主任课 preScheduleType = 3
     * */
    setCourseTable () {
      this.setCourseNums() // 设置课时数据
      
      this.setPreSchedule()
    },
    resetTableStatus () {
      for (let prop in this.tableData) {
        if (this.tableData[prop]) {
          this.$set(this.tableData[prop], 'canDraggingIn', 0)
          this.$set(this.tableData[prop], 'conflictList', [])
        }
      }
    },
    /**
     * 设置规则列表
     * 1.各班不一致
     * 2.固排
     * 3.禁排需要多个合并
     * 4.无课
     * 5.班主任课
     * */
    setPreSchedule () {
      for (let i = 1; i <= this.classIndex; i++) {
        for (let j = 1; j <= this.weekDay; j++) {
          this.$set(this.tableData, i + '_' + j, null)
        }
      }
      // 找到当前条件下的所有班级
      let classIds = this.getClass()
      /**找到无课的交集 */
      let noCoursePositionConfig = {} // 所有班级无课的位置 交集
      for (let cnc in this.$parent.classNoCourseObj) {
        if (classIds.indexOf(parseInt(cnc)) !== -1) {
          // 该班级的无课 存在
          for (let p in this.$parent.classNoCourseObj[cnc]) {
            if (!noCoursePositionConfig[p]) {
              noCoursePositionConfig[p] = 1
            } else {
              noCoursePositionConfig[p] += 1
            }
          }
        }
      }
      for (let position in noCoursePositionConfig) {
        if (noCoursePositionConfig[position] === classIds.length) {
          this.$set(this.tableData, position, {
            name: '无课',
            isNoCourse: true
          })
        }
      }
      /**循环规则列表 */
      let tempPreSchedule = {}, preSchedule = deepCopy(this.$parent.preScheduleObj)
      // 将所有班级的所有规则 全部放置到 tempPreSchedule中
      for (let cla = 0; cla < classIds.length; cla++) {
        if (preSchedule[classIds[cla]]) {
          // 该班级存在预设规则
          for (let ps in preSchedule[classIds[cla]]) {
            if (!tempPreSchedule[ps]) {
              tempPreSchedule[ps] = []
            }
            tempPreSchedule[ps].push(...preSchedule[classIds[cla]][ps])
          }
        }
      }
      for (let tps in tempPreSchedule) {
        let preClassIds = [], tempObj = {}, len
        if (tempPreSchedule[tps] && tempPreSchedule[tps].length > 0) {
          for (let tk = 0; tk < tempPreSchedule[tps].length; tk++) {
            preClassIds.indexOf(tempPreSchedule[tps][tk].classId) === -1 && preClassIds.push(tempPreSchedule[tps][tk].classId)
            if (!tempObj[tempPreSchedule[tps][tk].classId]) {
              tempObj[tempPreSchedule[tps][tk].classId] = []
            }
            tempObj[tempPreSchedule[tps][tk].classId].push(tempPreSchedule[tps][tk])
          }
        } else {
          continue
        }
        // 先判断 是否打开班主任设置
        if (this.$parent.teacherMasterSets.isOpen && tps === this.$parent.teacherMasterSets.classIndex + '_' + this.$parent.teacherMasterSets.weekDay) {
          if (this.isEqualMstRule(tempObj)) {
            // 班主任任课位置的规则 各班一致 直接显示第一个班级的规则
            for (let msr in tempObj) {
              if (tempObj[msr].length > 0) {
                if (tempObj[msr][0].isMstRule) {
                  if (classIds.length === 1) {
                    this.$set(this.tableData, tps, {
                      name: tempObj[msr][0].objName,
                      preScheduleType: 3,
                      ruleList: tempPreSchedule[tps]
                    })
                  } else {
                    this.$set(this.tableData, tps, {
                      name: '班主任课',
                      preScheduleType: 3,
                      ruleList: tempPreSchedule[tps]
                    })
                  }
                  break
                } else {
                  // 不是班主任课 直接取第一个放置到tableData中
                  let toRule
                  for (let to = 0; to < tempObj[msr].length; to++) {
                    if (to === 0) {
                      toRule = tempObj[msr][to]
                      if (toRule.objType === 3) {
                        toRule.name = '教研组-' + toRule.objName
                      }
                    } else {
                      toRule.objId += '' + tempObj[msr][to].objId
                      toRule.name += '，' + (tempObj[msr][to].objType === 3 ? '教研组-' + tempObj[msr][to].objName : tempObj[msr][to].objName)
                    }
                  }
                  toRule.ruleList = tempPreSchedule[tps]
                  this.$set(this.tableData, tps, {
                    preScheduleType: toRule.preScheduleType,
                    name: toRule.objName,
                    ruleList: tempPreSchedule[tps]
                  })
                }
              }
            }
          } else {
            this.$set(this.tableData, tps, {
              name: '各班不一致',
              preScheduleType: 4,
              ruleList: tempPreSchedule[tps]
            })
          }
        } else {
          // 如果该方格 有班级有无课设置 preClassIds 的长度需要 加上无课的班级个数
          len = preClassIds.length
          for (let nco in this.$parent.classNoCourseObj) {
            if (classIds.indexOf(parseInt(nco)) !== -1 && this.$parent.classNoCourseObj[nco][tps]) {
              len++
            }
          }
          if (len !== classIds.length) {
            this.$set(this.tableData, tps, {
              name: '各班不一致',
              preScheduleType: 4,
              ruleList: tempPreSchedule[tps]
            })
          } else if (!this.isEqualRule(tempObj)) {
            this.$set(this.tableData, tps, {
              name: '各班不一致',
              preScheduleType: 4,
              ruleList: tempPreSchedule[tps]
            })
          } else {
            // 各班规则一致 显示某一个班级的规则
            let toRule2
            for (let msr2 in tempObj) {
              if (tempObj[msr2].length > 0) {
                // 直接取第一个班级的规则放置到tableData中
                for (let to2 = 0; to2 < tempObj[msr2].length; to2++) {
                  if (to2 === 0) {
                    toRule2 = deepCopy(tempObj[msr2][to2])
                    if (toRule2.objType === 3) {
                      toRule2.objName = '教研组-' + toRule2.objName
                    }
                  } else {
                    toRule2.objId += ',' + tempObj[msr2][to2].objId
                    toRule2.objName += '，' + (tempObj[msr2][to2].objType === 3 ? '教研组-' + tempObj[msr2][to2].objName : tempObj[msr2][to2].objName)
                  }
                }
              }
            }
            this.$set(this.tableData, tps, {
              preScheduleType: toRule2.preScheduleType,
              name: toRule2.objName,
              ruleList: tempPreSchedule[tps]
            })
          }
        }
      }
    },
    getAllClass () {
      let list = []
      for (let i = 0; i < this.$parent.classList.length; i++) {
        list.push(this.$parent.classList[i].classId)
      }
      return list
    },
    /**
     * 获取当前所有勾选条件下的所有班级ID
     */
    getClass () {
      let classIds = []
      if (this.$parent.formInline.classId || this.$parent.classListFilter.length === 2) {
        classIds.push(this.$parent.formInline.classId || this.$parent.classListFilter[1].classId)
      } else {
        for (let i = 1; i < this.$parent.classListFilter.length; i++) {
          this.$parent.classListFilter[i].classId && classIds.push(this.$parent.classListFilter[i].classId)
        }
      }
      return classIds
    },
    getClassFormatter () {
      if (!this.classFormat) {
        this.classFormat = {}
        if (this.$parent.classList.length > 0) {
          for (let i = 0; i < this.$parent.classList.length; i++) {
            this.classFormat[this.$parent.classList[i].classId] = this.$parent.classList[i]
          }
        }
      }
    },
    /**设置课节数 */
    setCourseNums () {
      let gradeIds = [], maxClassIndex = this.classIndex, maxWeekDay = this.weekDay
      if (this.$parent.formInline.gradeId || this.$parent.gradesListFilter.length === 2) {
        gradeIds.push(this.$parent.formInline.gradeId || this.$parent.gradesListFilter[1].uid)
      } else {
        for (let i = 1; i < this.$parent.gradesListFilter.length; i++) {
          gradeIds.push(this.$parent.gradesListFilter[i].uid)
        }
      }
      let gncoData = this.$parent.gradeNoCourseObj, count = 0
      for (let gnco in gncoData) {
        if (gradeIds.indexOf(parseInt(gnco)) !== -1) {
          if (count === 0) {
            maxClassIndex = gncoData[gnco].baseGradeTermCourseCount.courseAm + gncoData[gnco].baseGradeTermCourseCount.coursePm
            maxWeekDay = gncoData[gnco].baseGradeTermCourseCount.courseWeekDay
          } else if (gradeIds.indexOf(parseInt(gnco)) !== -1) {
            maxClassIndex = maxClassIndex > (gncoData[gnco].baseGradeTermCourseCount.courseAm + gncoData[gnco].baseGradeTermCourseCount.coursePm) ? maxClassIndex : (gncoData[gnco].baseGradeTermCourseCount.courseAm + gncoData[gnco].baseGradeTermCourseCount.coursePm)
            maxWeekDay = maxWeekDay > gncoData[gnco].baseGradeTermCourseCount.courseWeekDay ? maxWeekDay : gncoData[gnco].baseGradeTermCourseCount.courseWeekDay
          }
          count++
        }
      }
      this.classIndex = maxClassIndex
      this.weekDay = maxWeekDay
    },
    /**
     * 判断各班规则是否一致
     * 不相等 返回false
     * 相等 返回true
     * 将每一项与第一个班级的规则相比较，有一个不相等 则不相等
     * 各班的规则条数不一致 则不相等
     * */
    isEqualRule (obj) {
      let count = 0, str = '', len
      for (let prop in obj) {
        if (count === 0) {
          len = obj[prop].length
          // 第一个班级的规则 用 固排/禁排项ID_固排/禁排项名称_固排/禁排类型
          for (let i = 0; i < obj[prop].length; i++) {
            str += obj[prop][i].objId + '_' + obj[prop][i].objName + '_' + obj[prop][i].objType
          }
        } else {
          if (obj[prop].length !== len) {
            return false
          }
          for (let j = 0; j < obj[prop].length; j++) {
            if (str.indexOf(obj[prop][j].objId + '_' + obj[prop][j].objName + '_' + obj[prop][j].objType) === -1) {
              return false
            }
          }
        }
        count++
      }
      return true
    },
    /**
     * 判断各班的班主任课位置 设置的规则 是否一致
     * 班主任规则存在班主任不存在的情况 也就是objId可能为空
     */
    isEqualMstRule (obj) {
      let count = 0, str = '', len, isMstRule
      for (let prop in obj) {
        if (count === 0) {
          len = obj[prop].length
          if (obj[prop].length > 0) {
            if (obj[prop][0].isMstRule) {
              isMstRule = true
            } else {
              // 不是班主任规则 按照正常规则比较 保存第一个班级的规则 用 固排/禁排项ID_固排/禁排项名称_固排/禁排类型
              for (let i = 0; i < obj[prop].length; i++) {
                str += obj[prop][i].objId + '_' + obj[prop][i].objName + '_' + obj[prop][i].objType
              }
            }
          }
        } else {
          if (obj[prop].length !== len) {
            return false
          }
          if (obj[prop].length > 0) {
            if (isMstRule) {
              // 第一个班级是班主任规则 后续的班级不是班主任规则 return false
              if (!obj[prop][0].isMstRule) {
                return false
              }
            } else {
              // 第一个不是班主任规则 按正常规则与第一项比较
              for (let j = 0; j < obj[prop].length; j++) {
                if (str.indexOf(obj[prop][j].objId + '_' + obj[prop][j].objName + '_' + obj[prop][j].objType) === -1) {
                  return false
                }
              }
            }
          }
        }
        count++
      }
      return true
    },























    // deletePreRule (classIndex, weekDay, data) {
    //   this.$parent.deletePreRule(classIndex, weekDay, data)
    // },
    setTeacherMasterSets (data, classAndHeadMaster) {
      this.$set(this.teacherMasterSets, 'isOpen', data.isOpen)
      this.$set(this.teacherMasterSets, 'classIndex', data.classIndex)
      this.$set(this.teacherMasterSets, 'weekDay', data.weekDay)
      for (let prop in classAndHeadMaster) {
        this.$set(this.classAndHeadMaster, prop, classAndHeadMaster[prop])
      }
    },
    setDraggingItemData (key, keyType, type, teacherArry) {
      this.objId = key
      this.objType = keyType
      this.type = type
      this.teacherArry = teacherArry
    },
    /**
     * allowObj允许强制拖入的位置
     * unAllowObj禁止拖入的位置
     * keyType: 1 科目 2 老师
     * canDraggingIn 1 允许拖入
     * canDraggingIn 2 允许强制拖入
     *  conflict 有值（其他班级
     * canDraggingIn 3 禁止拖入
     */
    setDraggingTableData (allowObj, unAllowObj) {
      /**
       * 一、固排科目 冲突情况
       * 1.该方格该位置显示各班不一致，需要提示【是否覆盖XXX班级的任课数据】
       * 2.该方格该位置有数据（可能是老师和科目）
       *   2.1.如果数据和拖动项的标识和类型（科目/老师）一致，则设置不可拖入
       *   2.2.如果数据和拖动项的标识和类型不一致，则提示【是否覆盖，该方格的数据】
       * 3.该方格没有数据（在其他班级该位置有冲突的老师），则提示【是否覆盖，某老师在XXX班级该位置处有XXX课程】
       * 二、固排老师
       * 1.该方格该位置有数据
       *  1.1 如果数据和拖动项的标识和类型一致，则设置不可拖入
       *  1.2 如果数据不一致，则提示是否覆盖【该方格的数据】
       * 2.该方格没有数据（在其他班级该位置有任课情况），则提示是否覆盖【某老师在XXX班级该位置的课程】
       * 三、禁排科目 冲突情况
       */
      for (var prop1 in allowObj) {
        if (this.tableData[prop1]) {
          // 该方格有数据
          if (this.tableData[prop1].objType === 4) {
            // 该方格有班主任课
            this.$set(this.tableData[prop1], 'canDraggingIn', 2)
            // this.$set(this.tableData[prop], 'conflictList', 2)
          } else if (this.tableData[prop1].preScheduleType === 4) {
            // 无课
            this.$set(this.tableData[prop1], 'canDraggingIn', 3)
          } else if (this.tableData[prop1].preScheduleType === 3) {
            // 各班不一致
            this.$set(this.tableData[prop1], 'canDraggingIn', 2)
            this.$set(this.tableData[prop1], 'conflictList', allowObj[prop1])
          } else if (this.type === 1 && this.tableData[prop1].preScheduleType === 1 && this.tableData[prop1]['objId'] === this.objId && this.tableData[prop1]['objType'] === this.objType) {
            // 固排时拖拽项与该方格的数据一致
            this.$set(this.tableData[prop1], 'canDraggingIn', 3)
          } else if (this.type === 2) {
            // 禁排时 该方格同为禁排
            this.$set(this.tableData[prop1], 'canDraggingIn', 1)
          } else {
            this.$set(this.tableData[prop1], 'canDraggingIn', 2)
            this.$set(this.tableData[prop1], 'conflictList', allowObj[prop1])
          }
          console.log('=================', JSON.stringify(this.tableData['2_1']), this.type)
        } else {
          console.log('=================', JSON.stringify(this.tableData['2_1']), this.type)
          // 该方格无数据
          if (this.type === 1) {
            this.$set(this.tableData, prop1, {
              canDraggingIn: 2,
              conflictList: allowObj[prop1]
            })
          }
          
        }
      }
      
      for (var prop2 in unAllowObj) {
        if (this.tableData[prop2]) {
          this.$set(this.tableData[prop2], 'canDraggingIn', 3)
        } else {
          this.$set(this.tableData, prop2, {
            canDraggingIn: 3
          })
        }
      }
      let prop
      for (let i = 1; i <= this.courseTimes; i++) {
        for (let j = 1; j <= this.courseWeekDay; j++) {
          prop = i + '_' + j
          if (this.tableData[prop]) {
            // 有数据
            if (!this.tableData[prop]['canDraggingIn']) {
              if (this.tableData[prop].preScheduleType === 4) {
                // 无课
                this.$set(this.tableData[prop], 'canDraggingIn', 3)
              } else if (this.tableData[prop]['preScheduleType'] === 3) {
                // 拖到各节次不一致的方格
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else if (this.tableData[prop]['preScheduleType'] === 1 && this.type === 1 && this.tableData[prop]['objId'] === this.objId && this.tableData[prop]['objType'] === this.objType) {
                // 固排项与方格项固排相同
                this.$set(this.tableData[prop], 'canDraggingIn', 3)
              } else if (this.type === 2 && this.tableData[prop]['preScheduleType'] === 2) {
                // 禁排 拖拽到禁排
                this.$set(this.tableData[prop], 'canDraggingIn', 1)
              } else if (this.type === 2 && this.tableData[prop]['preScheduleType'] === 1) {
                // 禁排 拖拽到固排
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else if (this.type === 1 && this.tableData[prop]['objId'] && this.tableData[prop]['objType']) {
                // 固排 覆盖 有数据的项
                this.$set(this.tableData[prop], 'canDraggingIn', 2)
              } else {
                this.$set(this.tableData[prop], 'canDraggingIn', 1)
              }
            } 
          } else {
            // 该方格无数据
            this.$set(this.tableData, prop, { canDraggingIn: 1 })
          }
        }
      }
    },
    setGradeTermData ({ noCourseList, courseWeekDay, courseTimes, preSets, classIdList }) {
      console.log(noCourseList)
      // this.noCourseList.splice(0, this.noCourseList.length)
      // this.noCourseList.push(...noCourseList)
      // let noCourseObj = {} // {班级ID： {1_1: {}, 1_2{}}}
      // if (noCourseList.length > 0) {
      //   for (let i = 0; i < noCourseList.length; i++) {
      //     noCourseObj[noCourseList[i]['classIndex'] + '_' + noCourseList[i]['weekDay']] = noCourseList[i]
      //   }
      // }
      this.courseWeekDay = courseWeekDay
      this.courseTimes = courseTimes
      for (let prop in this.tableData) {
        this.$set(this.tableData, prop, null)
      }
      // preScheduleType 1：固排，2：禁排，3：各班不一致（该位置可能有禁排、固排、无设置） 4 无课
      for (let i = 1; i <= courseTimes; i++) {
        for (let j = 1; j <= courseWeekDay; j++) {
          let _key = i + '_' + j
          for (let k = 0; k < classIdList.length; k++) {
            if (preSets[classIdList[k]['classId']] && preSets[classIdList[k]['classId']][_key]) {
              // 该班级在_key位置处存在预设规则
              if (this.tableData[_key]) {
                // 别的班级在该位置已经有预设规则
                if (this.tableData[_key]['preScheduleType'] === 1 && this.tableData[_key]['objType'] === 4 && preSets[classIdList[k]['classId']][_key]['objType'] === 4) {
                  // 之前已经设置了班主任课
                  // 该规则也是设置班主任课 查看名称是否一致 如果不一致 证明有一个没有设置班主任（显示班主任）
                  if (preSets[classIdList[k]['classId']][_key]['objName'] !== this.tableData[_key]['objName']) {
                    this.$set(this.tableData[_key], 'objName', '班主任课')
                  }
                } else if (this.tableData[_key]['preScheduleType'] === 4) {
                  // 之前已经设置了无课 显示当前的预设规则 继续循环
                  this.$set(this.tableData, _key, preSets[classIdList[k]['classId']][_key])
                } else if (this.tableData[_key]['preScheduleType'] === preSets[classIdList[k]['classId']][_key]['preScheduleType'] && this.tableData[_key]['objId'] === preSets[classIdList[k]['classId']][_key]['objId'] && this.tableData[_key]['objType'] === preSets[classIdList[k]['classId']][_key]['objType']) {
                  // 该班级在_key位置处禁排项与别的班级在该位置的禁排项相同 继续循环
                } else {
                  // 该班级在_key位置处禁排项与别的班级在该位置的禁排项不相同 则显示"各班不一致" 停止循环
                  this.$set(this.tableData[_key], 'preScheduleType', 3)
                  this.$set(this.tableData[_key], 'objName', '各班不一致')
                }
              } else {
                /**
                 * 别的班级在该位置已经还没有预设规则
                 * 如果循环下标k>0 证明 前面有班级在该位置未设规，则显示各班不一致 停止循环班级
                 */
                if (k > 0) {
                  this.$set(this.tableData, _key, Object.assign(preSets[classIdList[k]['classId']][_key], {
                    preScheduleType: 3,
                    objName: '各班不一致'
                  }))
                  break
                } else {
                  this.$set(this.tableData, _key, preSets[classIdList[k]['classId']][_key])
                }
              }
            } else if (noCourseList[classIdList[k]['classId']] && noCourseList[classIdList[k]['classId']][_key]) {
              // 无课
              this.$set(this.tableData, _key, {
                preScheduleType: 4,
                objName: '无课'
              })
            } else if (this.tableData[_key] && this.tableData[_key]['preScheduleType'] === 4) {
              // 有班级已经设置了无课 当前没有任何设置 显示空白
              this.$set(this.tableData, _key, null)
            } else {
              /**
               * 该班级在_key位置不存在预设规则
               * 判断tableData中该位置是否有预设规则
               *  如果有 显示各班不一致 停止循环班级
               *  如果没有 继续循环
               */
              if (this.tableData[_key] && this.tableData[_key]['preScheduleType'] !== 4) {
                this.$set(this.tableData[_key], 'preScheduleType', 3)
                this.$set(this.tableData[_key], 'objName', '各班不一致')
                break
              }
            }
          }
        }
      }
    },
    /**替换确定函数 */
    // replaceConfirm () {
    //   this.$emit('dragDopReplaceEvent', this.classIndex, this.weekDay, this.tempConflictData, this.dropData)
    //   this.confirmConflictReplaceDialog = false
    // },
    /**替换全部确定函数 */
    replaceAllConfirm () {
      this.$emit('dragDopReplaceAllEvent', this.classIndex, this.weekDay)
      this.confirmReplaceAllDialog = false
    },
    dragenter () {
      // console.log(e.target, '======拖拽进入========')
    },
    dragover (e) {
      e.preventDefault()
    },
    setTeacherTable (data) {
      this.teacherTeachTable = data
    },
    setTeacherId (teacherId) {
      this.teacherId = teacherId
    },
    setCountTeacherMap(data) {
      this.countTeacherMap = data
    },
    /**计算每天的上课节数 */
    calculateTeacherDayNums (teacherId, day, canDraggingIn) {
      let weekDay, arry, obj = {}, alarmValue = canDraggingIn ? this.alarmValue - 1 : this.alarmValue
      for (let prop in this.teacherTeachTable[teacherId]) {
        arry = prop.split('_')
        weekDay = arry[1]
        if (parseInt(day) === parseInt(weekDay)) {
          obj[weekDay] = obj[weekDay] ? obj[weekDay] + 1 : 1
          if (this.countTeacherMap[teacherId + '_' + day]) {
            if (obj[weekDay] + this.countTeacherMap[teacherId + '_' + day] >= alarmValue) {
              return false
            }
          } else if (obj[weekDay] >= alarmValue) {
            return false
          }
        }
      }
      return true
    },
    goOnByAlarmPop () {
      this.alarmPop = false
      this.judgePopup()
    },
    // /**拖拽放置事件 */
    // drop (e, classIndex, weekDay) {
    //   e.stopPropagation();
    //   e.preventDefault();
    //   // this.classIndex = classIndex // 拖入的课节下标
    //   // this.weekDay = weekDay // 拖入的星期下标
    //   // this.dropData = deepCopy(this.tableData[classIndex + '_' + weekDay])
    //   // if (this.dropData.canDraggingIn === 3) {
    //   //   // 禁止拖入
    //   //   return
    //   // }
    //   // if (this.teacherArry) {
    //   //   for (let i = 0; i < this.teacherArry.length; i++) {
    //   //     if (!this.calculateTeacherDayNums(this.teacherArry[i].teacherId, weekDay)) {
    //   //       // 计算每个老师是否超过预警值
    //   //       this.alarmPop = true
    //   //       return
    //   //     }
    //   //   }
    //   //   if (!this.alarmPop) {
    //   //     this.judgePopup()
    //   //   }
    //   // } else {
    //     // this.judgePopup()
    //   // }
    // },
    judgePopup () {
      let data = this.dropData
      this.tempConflictData = null
      if (data.canDraggingIn === 1) {
        // 可以拖入
        console.log('可以拖入')
        if (this.type === 2 && data['preScheduleType'] === 2) {
          // 禁排拖拽到禁排设置 累加
          this.$emit('dragDopEvent', this.classIndex, this.weekDay, 'f-to-f')
        } else {
          this.$emit('dragDopEvent', this.classIndex, this.weekDay)
        }
      } else if (data.canDraggingIn === 2) {
        if (data.objType === 4) {
          // 该方格为班主任课
          this.conflictTitle = '是否覆盖？'
          this.conflictInfo = '是否覆盖该班主任课设置'
          this.tempConflictData = deepCopy({
            conflictList: data
          })
        } else if (data.preScheduleType === 3) {
          this.conflictTitle = '是否覆盖？'
          this.conflictInfo = '各班设置不一致，是否覆盖'
        } else if (data.conflictList) {
          this.tempConflictData = deepCopy(data)
          console.log(data.conflictList)
          // 有冲突
          this.conflictTitle = '是否覆盖？'
          if (data.conflictList.length === 1 && data.conflictList[0].classId === data.classId && data.conflictList[0].classIndex === data.classIndex && data.conflictList[0].weekDay === data.weekDay) {
            // 冲突项的位置、班级 一致 只提示 覆盖
            this.conflictTitle = '是否替换？'
            this.conflictInfo = '是否替换-' + this.objTypeFormater[data.preScheduleType] + '' + data.objName + '设置'
          } else {
            this.conflictInfo = '该设置与'
            for (let i = 0; i < data.conflictList.length; i++) {
              this.conflictInfo += data.conflictList[i].classFullName + '的星期' + data.conflictList[i].weekDay + '第' + data.conflictList[i].classIndex + '节' + data.conflictList[i].objName
              if (i < data.conflictList.length - 1) {
                this.conflictInfo += '、'
              } else {
                this.conflictInfo += '有冲突'
              }
            }
          }
        } else {
          this.conflictTitle = '是否替换？'
          this.conflictInfo = '是否替换-' + this.objTypeFormater[data.preScheduleType] + '' + data.objName + '设置'
        }
        this.confirmConflictReplaceDialog = true
      } else if (data.canDraggingIn === 3) {
        // 禁止拖入
        return
      }
    },
    resetTableDagInColor () {
      for (let prop in this.tableData) {
        if (this.tableData[prop] && this.tableData[prop]['canDraggingIn']) {
          this.$set(this.tableData[prop], 'canDraggingIn', null)
          if (this.tableData[prop]['conflictList']) {
            this.$set(this.tableData[prop], 'conflictList', null)
          }
        }
      }
    },
    setTableDataByKey (key, o) {
      this.$set(this.tableData, key, o)
    }
  }
}
</script>
<style lang="scss" scoped>
.course-rules {
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
          }
          .confirm-table-td:nth-child(1), .confirm-table-td:nth-child(2), .confirm-table-td:nth-child(3) {
            width: 50px;
            border-right: 1px solid $course-list-color29;
            text-align: center;
          }
          .confirm-table-td:nth-child(3) {
            width: 80px;
          }
          .confirm-table-td:nth-child(4) {
            text-align: left;
            flex: 1;
            padding-left: 5px;
            padding-right: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            > div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              cursor: pointer;
            }
          }
        }
        .confirm-table-body {
          max-height: 400px;
          overflow-y: auto;
          border-left: 1px solid $course-list-color29;
          border-right: 1px solid $course-list-color29;
          border-bottom: 1px solid $course-list-color29;
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
        // overflow: hidden;
        padding: 0 5px;
        color: $course-pre-arrange-color29_1;
        &.fixed {
          background: $course-pre-arrange-color28;
          color: $course-pre-arrange-color29;
          // 固排
          &:before {
            content: '固排';
            position: absolute;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            right: 0;
            top: 0;
            width: 32px;
            height: 18px;
            color: $course-pre-arrange-color26;
            background: $course-pre-arrange-color27;
            border-bottom-left-radius: 8px;
          }
        }
        &.prevent {
          background: $course-pre-arrange-color32;
          color: $course-pre-arrange-color33;
          // 禁排
          &:before {
            content: '禁排';
            position: absolute;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            right: 0;
            top: 0;
            width: 32px;
            height: 18px;
            color: $course-pre-arrange-color30;
            background: $course-pre-arrange-color31;
            border-bottom-left-radius: 8px;
          }
        }
        &.can-dragIn {
          // background: $course-pre-arrange-color31_1;
          background: $course-schedule-color1;
          color: $course-schedule-color3;
        }
        &.can-dragIn-force {
          // background: $course-pre-arrange-color31_2;
          background: $course-schedule-color6;
          color: $course-schedule-color7;
        }
        &.cannot-dragIn {
          // background: $course-pre-arrange-color31_3;
          background: $course-schedule-color2;
          color: $course-schedule-color4;
        }
        &.isNoCourse {
          background: $course-schedule-color9;
          color: $course-schedule-color10;
        }
        .show-all {
          display: none;
          z-index: 1;
          position: absolute;
          top: 50%;
          left: 100%;
          width: 100%;
          padding: 5px 10px;
          white-space: pre-line;
          word-break: break-all;
          line-height: 20px;
          transform: translate(10px, -50%);
          background: rgba(0, 0, 0, 0.51);
          color: #FFF;
          border-radius: 3px;
          font-size: 12px;
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: -10px;
            width: 10px;
            height: 10px;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent rgba(0, 0, 0, 0.51) transparent transparent;
            box-sizing: border-box;
          }
        }
        &.reset {
          .reset-cover {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: $course-pre-arrange-color34;
            flex-direction: column;
            justify-content: center;
            &:before {
              content: '移除';
              color: $course-pre-arrange-color35;
            }
          }
          &:hover {
            .reset-cover {
              display: flex;
            }
            .show-all {
              display: block;
            }
          }
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
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    .course-rules_left-item {
      display: flex;
      flex: 1;
      overflow: hidden;
      color: $course-pre-arrange-color25;
      .l {
        text-align: center;
        writing-mode: vertical-lr;
      }
      .s {
        display: none;
      }
    }
  }
}
@media screen and ( max-height: 720px ) {
  .course-rules_left-item {
    font-size: 12px;
  }
}
@media screen and ( max-height: 700px ) {
  .course-rules_left-item {
      .l {
        display: none !important;
      }
      .s {
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        padding-left: 5px;
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
