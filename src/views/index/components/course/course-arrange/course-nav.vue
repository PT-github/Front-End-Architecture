<template>
  <div class="course-nav-item">
    <vue-scroll>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" v-show="active === 1">
          <template slot="title">
            科目列表
            <el-tooltip placement="top">
              <div slot="content">不可拖入，可能原因<br/>1、某个或某些班级无此科目<br/>2、某个或某些科目/老师有课节冲突，同一个老师不能在同一时间安排多节课<br/>3、某个或某些科目/老师课量已超上限</div>
              <div class="iconfont icon-wenhao reason-cont"></div>
            </el-tooltip>
          </template>
          <div class="subject-box">
            <span class="subject-item"
              v-for="(item, index) in subjectList"
              :key="index + '_subjectList'"
              :draggable="!item.setGray"
              @dragstart="dragstart($event, item.uid, 1, item.subjectFullname, 1)"
              @drag="drag($event)"
              @dragend="dragend"
              :class="{'setGray': item.setGray}"
              >
              {{ item.subjectFullname }}
              <!-- <template v-if="!item.setGray">
                {{ item.subjectFullname }}
              </template>
              <template v-else>
                <el-tooltip placement="top">
                  <div slot="content">不可拖入，可能原因<br/>1、某个或某些班级无此科目<br/>2、某个或某些科目/老师有课节冲突，同一个老师不能在同一时间安排多节课<br/>3、某个或某些科目/老师课量已超上限</div>
                  <span>{{ item.subjectFullname }}</span>
                </el-tooltip>
              </template> -->
            </span>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" v-show="active === 1" :class="{noBottomBorder: active === 1}">
          <template slot="title">
            老师列表
            <el-tooltip placement="top">
              <div slot="content">老师在这些班级有课时冲突<br/>请缩小设置范围</div>
              <div class="iconfont icon-wenhao reason-cont"></div>
            </el-tooltip>
          </template>
          <div class="subject-box">
            <span class="subject-item"
              v-for="(item, index) in teacherList"
              :key="index + '_teacherList'"
              :draggable="!item.setGray"
              @dragstart="dragstart($event, item.uid, 2, item.teacherName, 1)"
              @drag="drag"
              @dragend="dragend"
              :class="{'setGray': item.setGray}"
              >
              {{ item.teacherName }}
              <!-- <template v-if="!item.setGray">
                {{ item.teacherName }}
              </template>
              <template v-else>
                <el-tooltip placement="top">
                  <div slot="content">老师在这些班级有课时冲突<br/>请缩小设置范围</div>
                  <span>{{ item.teacherName }}</span>
                </el-tooltip>
              </template> -->
            </span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="科目列表" name="3" v-show="active === 2">
          <div class="subject-box">
            <span class="subject-item"
              v-for="(item, index) in subjectList"
              :key="index + '_subjectList_2'"
              draggable="true"
              @dragstart="dragstart($event, item.uid, 1, item.subjectFullname, 2)"
              @drag="drag"
              @dragend="dragend"
              >
              {{ item.subjectFullname }}
            </span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="老师列表" name="4" v-show="active === 2" :class="{noBottomBorder: active === 1}">
          <div class="subject-box">
            <span class="subject-item"
              v-for="(item, index) in teacherList"
              :key="index + '_teacherList_2'"
              draggable="true"
              @dragstart="dragstart($event, item.uid, 2, item.teacherName, 2)"
              @drag="drag"
              @dragend="dragend"
              >
              {{ item.teacherName }}
            </span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="教研组列表" name="5" v-show="active === 2">
          <div class="subject-box">
            <span class="subject-item"
              v-for="(item, index) in groupList"
              :key="index + '_groupList'"
              draggable="true"
              @dragstart="dragstart($event, item.uid, 3, item.groupName, 2)"
              @drag="drag"
              @dragend="dragend"
              >
              {{ item.groupName }}
            </span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </vue-scroll>
  </div>
</template>
<script>
import { deepCopy } from '@/utils'
export default {
  name: 'CourseNavItem',
  props: {
    active: {
      type: Number,
      default: 1
    },
    // 教研组列表
    groupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      subjectList: [], // 科目列表
      teacherList: [], // 老师列表
      activeNames: ['1', '3']
    };
  },
  methods: {
    /**开始拖拽 */
    dragstart (e, objId, objType, objName, preScheduleType) {
      this.$parent.$refs['CourseRuleComp'].setTableStatus(objId, objType, objName, preScheduleType)
      e.dataTransfer.setData("Text", 'Hello World'); // firefox必须有数据才允许拖拽
    },
    /**设置固排/禁排的科目、老师和教研组 */
    setData () {
      /**
       * 科目
       *  置灰情况
       *    1.当前勾选年级下无该科目
       *    2.当前勾选的年级下，有任意一个班级的该科目已设定课节数已达到教学计划设置的数量
       *    3.当前勾选的班级下，有任意一个科目在不同班级由同一个老师教
       */

      /**
       * 老师
       *  置灰情况
       *  多个班级 置灰
       *  一个班级 当该班级下该老师只教一门科目，该科目已设定节数已达到教学计划设置的数量
       */
      this.subjectList.splice(0, this.subjectList.length)
      this.teacherList.splice(0, this.teacherList.length)
      let subjectObj = {}, teachers = [], subjectAndTeacherDtos = deepCopy(this.$parent.subjectAndTeacherDtos)
      if (this.$parent.formInline.gradeId) {
        subjectObj = {
          [this.$parent.formInline.gradeId]: subjectAndTeacherDtos[this.$parent.formInline.gradeId].subjectInfoList
        }
        teachers = subjectAndTeacherDtos[this.$parent.formInline.gradeId].teacherInfoList
      } else if (this.$parent.gradesListFilter.length > 1) {
        for (let i = 1; i < this.$parent.gradesListFilter.length; i++) {
          subjectObj[this.$parent.gradesListFilter[i].uid] = subjectAndTeacherDtos[this.$parent.gradesListFilter[i].uid].subjectInfoList
          teachers.push(...subjectAndTeacherDtos[this.$parent.gradesListFilter[i].uid].teacherInfoList)
        }
      }
      this.handlerSubjectAndTeacher(subjectObj, teachers)
      this.handlerGroup()
    },
    /**设置教研组数据 */
    handlerGroup () {
      this.groupList.splice(0, this.groupList.length)
      // 1、学段2、年级
      if (this.$parent.groupType === 1) {
        // 学段
        let stageType
        if (this.$parent.formInline.stageType || this.$parent.stageTypesFilter.length === 2) {
          stageType = this.$parent.formInline.stageType || this.$parent.stageTypesFilter[1].enumValue
        } else if (this.$parent.formInline.gradeId) {
          for (let g = 1; g < this.$parent.gradesListFilter.length; g++) {
            if (this.$parent.gradesListFilter[g].uid === this.$parent.formInline.gradeId) {
              stageType = this.$parent.gradesListFilter[g].stageType
              break
            }
          }
        } else if (this.$parent.formInline.classId) {
          for (let c = 0; c < this.$parent.classListFilter.length; c++) {
            if (this.$parent.classListFilter[c].classId === this.$parent.formInline.classId) {
              for (let g1 = 1; g1 < this.$parent.gradesListFilter.length; g1++) {
                if (this.$parent.gradesListFilter[g1].uid === this.$parent.classListFilter[c].gradeId) {
                  stageType = this.$parent.gradesListFilter[g1].stageType
                  break
                }
              }
              break
            }
          }
        }
        for (let i = 0; i < this.$parent.groupList.length; i++) {
          (stageType + '' === this.$parent.groupList[i].objId + '') && this.groupList.push(this.$parent.groupList[i])
        }
      } else if (this.$parent.groupType === 2) {
        // 年级
        let gradId
        if (this.$parent.formInline.gradeId || this.$parent.gradesListFilter.length === 2) {
          gradId = this.$parent.formInline.gradeId || this.$parent.gradesListFilter[1].uid
        } else if (this.$parent.formInline.classId) {
          for (let c = 0; c < this.$parent.classListFilter.length; c++) {
            if (this.$parent.classListFilter[c].classId === this.$parent.formInline.classId) {
              gradId = this.$parent.classListFilter[c].gradeId
              break
            }
          }
        }
        for (let i = 0; i < this.$parent.groupList.length; i++) {
          gradId === this.$parent.groupList[i].objId && this.groupList.push(this.$parent.groupList[i])
        }
      }
    },
    /**
     * 处理科目和老师数据 设置置灰状态
     */
    handlerSubjectAndTeacher (subjectObj, teachers) {
      let subjectIds = [], subjects = []
      // 处理科目数据(去重)
      for (let prop in subjectObj) {
        for (let s = 0; s < subjectObj[prop].length; s++) {
          if (subjectIds.indexOf(subjectObj[prop][s].uid) === -1) {
            // 不存在
            subjects.push(subjectObj[prop][s])
            subjectIds.push(subjectObj[prop][s].uid)
          }
        }
      }
      for (let k = 0; k < subjects.length; k++) {
        if (!this.hasSubjectByGroup(subjects[k])) {
          // 该年级下没有该科目
          subjects[k].setGray = true
        } else if (this.subjectIsOverSetNumsByGroup(subjects[k])) {
          // 是否超过预设
          subjects[k].setGray = true
        } else if (this.isUniqoTeacher(subjects[k])) {
          // 是否在不同班由同一个老师教
          subjects[k].setGray = true
        }
      }
      this.subjectList.push(...this.sortList(subjects))
      // 处理老师数据（去重）
      let teacherIds = [], teacherList = []
      for (let i = 0; i < teachers.length; i++) {
        if (teacherIds.indexOf(teachers[i].uid) === -1) {
          teacherList.push(teachers[i])
          teacherIds.push(teachers[i].uid)
        }
      }
      let isMulti = true, classId
      if (!!this.$parent.formInline.classId || this.$parent.classListFilter.length === 2) {
        isMulti = false
        classId = this.$parent.formInline.classId || this.$parent.classListFilter[1].classId
      }
      for (let t = 0; t < teacherList.length; t++) {
        if (isMulti) {
          // 多个班级
          teacherList[t].setGray = true
        } else {
          // 单个班级
          if (this.$parent.teacherTeachingDivisions[teacherList[t].uid]) {
            if (!this.$parent.teacherTeachingDivisions[teacherList[t].uid][classId]) {
              // 在该班级不存在教学计划
              teacherList[t].setGray = true
            }
          }
        }
      }
      this.teacherList.push(...this.sortList(teacherList))
    },
    sortList (list) {
      return list.sort((a, b) => {
        if (a.setGray && !b.setGray) {
          return 1
        } else if (!a.setGray && b.setGray) {
          return -1
        } else {
          return 0
        }
      })
    },
    /**
     * 当前勾选的班级下，该科目在不同班级由同一个老师教
     * 由同一个老师教 返回true
     * 由多个老师教 返回false 只有一个班级 也返回 false
     */
    isUniqoTeacher (subject) {
      if (this.$parent.formInline.classId || this.$parent.classListFilter.length === 2) {
        // 勾选了班级 或者 班级列表只有一个（另外一个是全部） 直接返回
        return false
      }
      let teacherList = [], teacherInfoList // 存放各班的老师ID
      let subjectTeachingDivisions = this.$parent.subjectTeachingDivisions
      for (let i = 1; i < this.$parent.classListFilter.length; i++) {
        teacherInfoList = subjectTeachingDivisions[subject.uid][this.$parent.classListFilter[i].classId].teacherInfoList
        if (teacherInfoList.length === 1) {
          // 科目在该班级只由一个老师教
          if (teacherList.indexOf(teacherInfoList[0].uid) !== -1) {
            return true
          } else {
            teacherList.push(teacherInfoList[0].uid)
          }
        } else {
          // 科目在该班级有多个老师教的情况 不考虑
          continue
        }
      }
      return false
    },
    /**
     * 当前勾选的年级下，是否存在在某个班级该科目已设定课节数已达到教学计划设置的数量
     * 超过 返回true
     * 未超过 返回false
     */
    subjectIsOverSetNumsByGroup (subject) {
      let classIds = []
      if (this.$parent.formInline.classId || this.$parent.classListFilter.length === 2) {
        // 只有一个班级
        classIds.push(this.$parent.formInline.classId || this.$parent.classListFilter[1].classId)
      } else if (this.$parent.classListFilter.length > 2) {
        // 多个班级
        for (let i = 1; i < this.$parent.classListFilter.length; i++) {
          classIds.push(this.$parent.classListFilter[i].classId)
        }
      }
      let tempSub
      for (let c = 0; c < classIds.length; c++) {
        tempSub = this.$parent.subjectTeachingDivisions[subject.uid][classIds[c]]
        if (tempSub.setNums >= tempSub.courseTotal) {
          return true
        }
      }
      return false
    },
    /**
     * 当前勾选年级下是否有该科目
     * 该条件下有该科目 返回true
     * 没有该科目 返回false
     */
    hasSubjectByGroup (subject) {
      let gradesIds = []
      if (this.$parent.formInline.gradeId) {
        gradesIds.push(this.$parent.formInline.gradeId)
      } else if (this.$parent.gradesListFilter.length > 1) {
        for (let i = 1; i < this.$parent.gradesListFilter.length; i++) {
          gradesIds.push(this.$parent.gradesListFilter[i].uid)
        }
      }
      let hasSubject, sub // 是否包含该科目
      for (let g = 0; g < gradesIds.length; g++) {
        hasSubject = false
        sub = this.$parent.subjectAndTeacherDtos[gradesIds[g]].subjectInfoList
        for (let s = 0; s < sub.length; s++) {
          if (sub[s].uid === subject.uid) {
            hasSubject = true
            break
          }
        }
        if (!hasSubject) {
          return false
        }
      }
      return true
    },







    
    setDataList ({subject = [], teachers = []} = {}) {
      this.subjectList.splice(0, this.subjectList.length)
      this.subjectList.push(...subject)
      this.teacherList.splice(0, this.teacherList.length)
      this.teacherList.push(...teachers)
    },
    // /**开始拖拽 */
    // dragstart (e, key, keyType, type) {
    //   this.$emit('dragStart', key, keyType, type)
    //   e.dataTransfer.setData("Text", 'Hello World'); // firefox必须有数据才允许拖拽
    // },
    drag () {
      // console.log(e)
      // console.log(e.target, '正在拖拽中..........')
    },
    dragend () {
      // console.log('拖拽结束..........')
      this.$parent.$refs['CourseRuleComp'].resetTableStatus()
    }
  }
}
</script>
<style lang="scss" scoped>
.course-nav-item {
  width: 100%;
  height: 100%;
  user-select:none;
  .reason-cont {
    color: $course-nav-color1;
    position: absolute;
    top: 14px;
    right: 35px;
    height: 17px;
    line-height: 17px;
  }
  .noBottomBorder {
    margin-bottom: -1px
  }
  .subject-box {
    display: flex;
    flex-wrap: wrap;
    padding: 0 8px;
    .subject-item {
      width: 50px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      margin: 0 2px;
      .el-tooltip {
        outline: none !important;
      }
      &:not(.setGray).active, &:not(.setGray):hover {
        color: $course-pre-arrange-color23;
        border: 1px solid $course-pre-arrange-color22;
        border-radius: 2px;
        line-height: 28px;
      }
      &.setGray {
        color: $course-pre-arrange-color22_1;
      }
    }
  }
}
</style>
<style lang="scss">
.course-nav-item {
  .el-collapse-item {
    position: relative;
  }
  .el-collapse-item__header {
    height: 45px;
    line-height: 45px;
    padding: 0 8px;
  }
  .el-collapse-item__arrow {
    line-height:45px;
    color: $course-nav-color2;
  }
}
</style>
