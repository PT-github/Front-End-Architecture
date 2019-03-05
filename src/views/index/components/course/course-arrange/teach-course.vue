<template>
  <div class="teach-course">
    <div class="teacher-txt">
      <span>{{ dragStartTeacherNames || '-' }} (主调)</span>
      <span>{{ dragEndTeacherNames || '-' }}(被调)</span>
    </div>
    <div class="teach-course-container">
      <div class="course-nums">
        <div class="nums-item"></div>
        <div class="nums-item"
          v-for="(item, index) in courseConfig.dayTotal"
          :key="index + '_courseConfig_dayTotal'"
          >
            {{ index + 1 }}
          </div>
      </div>
      <div class="course-teacher-table">
        <div class="theader">
          <div class="tr">
            <div class="td"
              v-for="(item, idx) in courseConfig.weekTotal"
              :key="idx + '_courseConfig_weekTotal'"
              >
                {{ courseConfig.week[idx] }}
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr"
            v-for="(item, index) in courseConfig.dayTotal"
            :key="index + '_courseConfig_dayTotal2'"
            >
              <div class="td"
                v-for="(item, idx) in courseConfig.weekTotal"
                :key="idx + '_courseConfig_weekTotal2'"
                :class="{
                  has:  startTable[(index + 1) + '_' + (idx + 1)] && startTable[(index + 1) + '_' + (idx + 1)].teacherId && startTable[(index + 1) + '_' + (idx + 1)].subjectId,
                  current: startTable[(index + 1) + '_' + (idx + 1)] && startTable[(index + 1) + '_' + (idx + 1)].current
                }"
                >
                  {{ startTable[(index + 1) + '_' + (idx + 1)] ? startTable[(index + 1) + '_' + (idx + 1)].subjectShortName : '' }}
              </div>
          </div>
        </div>
      </div>
      <div class="course-teacher-table">
        <div class="theader">
          <div class="tr">
            <div class="td"
              v-for="(item, idx) in courseConfig.weekTotal"
              :key="idx + '_courseConfig_weekTotal3'"
              >
                {{ courseConfig.week[idx] }}
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr"
            v-for="(item, index) in courseConfig.dayTotal"
            :key="index + '_courseConfig_dayTotal3'"
            >
            <div class="td"
              v-for="(item, idx) in courseConfig.weekTotal"
              :key="idx + '_courseConfig_weekTotal4'"
              :class="{
                hasd:  endTable[(index + 1) + '_' + (idx + 1)] && endTable[(index + 1) + '_' + (idx + 1)].teacherId && endTable[(index + 1) + '_' + (idx + 1)].subjectId,
                currentd: endTable[(index + 1) + '_' + (idx + 1)] && endTable[(index + 1) + '_' + (idx + 1)].current
              }"
              >
                {{ endTable[(index + 1) + '_' + (idx + 1)] ? endTable[(index + 1) + '_' + (idx + 1)].subjectShortName : '' }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="course-teacher-table"></div> -->
    </div>
  </div>
</template>
<script>
import { deepCopy } from '@/utils'
export default {
  name: 'TeachCourse',
  data () {
    return {
      dragStartTeacherNames: '',
      startTable: {},
      endTable: {},
      dragEndTeacherNames: '',
      courseConfig: { 
        dayTotal: 0,
        weekTotal: 0,
        week: ['一','二','三','四','五','六','日'],
        day: ['第一节','第二节','第三节','第四节','第五节','第六节','第七节','第八节','第九节','第十节','第十一节','第十二节','第十三节','第十四节']
      },
    }
  },
  methods: {
    setDragEndTeachingTable (data, isDragEnd) {
      this.dragEndTeacherNames = ''
      for (let prop2 in this.endTable) {
        this.$set(this.endTable, prop2, null)
      }
      if (data && data.teacherId && this.$parent.teacherTeachingTable[data.teacherId]) {
        this.dragEndTeacherNames = data.teacherName
        for (let prop3 in this.$parent.teacherTeachingTable[data.teacherId]) {
          this.$set(this.endTable, prop3, deepCopy(this.$parent.teacherTeachingTable[data.teacherId][prop3]))
        }
      }
      if (data && data.classIndex && data.weekDay && !isDragEnd) {
        let key = data.classIndex + '_' + data.weekDay
        if (!this.endTable[key]) {
          this.$set(this.endTable, key, {
            current: true
          })
        } else {
          this.$set(this.endTable[key], 'current', true)
        }
      }
      if (isDragEnd) {
        for (let prop in this.startTable) {
          if (this.startTable && this.startTable[prop] && this.startTable[prop].current) {
            this.$set(this.startTable[prop], 'current', false)
          }
        }
      }
    },
    setDragStartTeachingTable (data) {
      for (let prop in this.startTable) {
        this.$set(this.startTable, prop, null)
      }
      for (let prop2 in this.endTable) {
        this.$set(this.endTable, prop2, null)
      }
      if (data && data.teacherId && this.$parent.teacherTeachingTable[data.teacherId]) {
        this.dragStartTeacherNames = data.teacherName
        this.dragEndTeacherNames = ''
        for (let prop3 in this.$parent.teacherTeachingTable[data.teacherId]) {
          this.$set(this.startTable, prop3, deepCopy(this.$parent.teacherTeachingTable[data.teacherId][prop3]))
        }
      } else {
        this.dragStartTeacherNames = ''
        this.dragEndTeacherNames = ''
      }
      if (data && data.classIndex && data.weekDay) {
        let key = data.classIndex + '_' + data.weekDay
        if (!this.startTable[key]) {
          this.$set(this.startTable, key, {
            current: true
          })
        } else {
          this.$set(this.startTable[key], 'current', true)
        }
      }
    },
    /**设置任课数据 */
    setTeacherCourseTable () {},
    /**设置课时数据 */
    setNoCourseTable () {
      if (this.$parent.courseParamInfos[this.$parent.formInline.gradeId]) {
        this.courseConfig.dayTotal = this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.courseAm + this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.coursePm
        this.courseConfig.weekTotal = this.$parent.courseParamInfos[this.$parent.formInline.gradeId].baseGradeTermCourseCount.courseWeekDay
        this.setTeacherCourseTable()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.teach-course {
  width: 100%;
  height: 100%;
  background: $teach-course-color3;
  .teach-course-container {
    display: flex;
    .course-teacher-table {
      flex: 1;
      & + .course-teacher-table {
        margin-left: 15px;
      }
      .td {
        height: 24px;
        flex: 1;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        &.has {
          background: $teach-course-color5;
          color: $teach-course-color6;
        }
        &.hasd {
          background: $teach-course-color7;
          color: $teach-course-color8;
        }
        &.current {
          color: $teach-course-color5;
          background: $teach-course-color6;
        }
        &.currentd {
          color: $teach-course-color7;
          background: $teach-course-color8;
        }
      }
      .tr {
        display: flex;
        // border-right: 1px solid $teach-course-color3;
        border-bottom: 1px solid $teach-course-color3;
        &:last-child {
          border-bottom: 0;
        }
      }
      .tbody {
        background: $teach-course-color4;
      }
    }
    .course-nums {
      width: 30px;
      .nums-item {
        width: 30px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
      }
    }
  }
  .teacher-txt {
    display: flex;
    height: 25px;
    justify-content: space-around;
    padding-left: 30px;
    > span {
      width: 110px;
      line-height: 25px;
      text-align: center;
      background: $teach-course-color1;
      color: $teach-course-color2;
      border-radius: 0 0 10px 10px;
      font-size: 12px;
    }
  }
}
</style>
