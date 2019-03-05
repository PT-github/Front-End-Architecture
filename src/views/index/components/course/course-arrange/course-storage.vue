<template>
  <vue-scroll>
    <div class="course-storage clearfix" @drop="dropFun($event)">
      <div class="course-storage-item"
        v-for="(item, index) in list"
        :key="index + '_list'"
        draggable="true"
        @dragstart="dragstart($event, item, index)"
        @dragend="dragend($event)"
        @dragover="dragover"
        @drop="dropFun($event)"
        @click="setTeacherCourse(item)"
        >
        <div class="course">{{ item.subjectFullName }}({{ item.count }})</div>
        <div class="teacher">{{ item.teacherName }}</div>
      </div>
    </div>
    <div class="drop-area" v-show="dropAreaVisiable" @drop="drop" @dragover="dragover" @dragenter="dragenter"></div>
  </vue-scroll>
</template>
<script>
// import { deepCopy } from '@/utils'
export default {
  name: 'CourseStorage',
  data () {
    return {
      list: [],
      dropAreaVisiable: false,
      dragStartData: null,
      dropData: null,
      listIndex: ''
    }
  },
  methods: {
    setTeacherCourse (data) {
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(data)
    },
    dropFun (e) {
      e.stopPropagation();
      e.preventDefault();
    },
    /**拖拽开始事件 */
    dragstart (e, data, index) {
      this.$parent.$refs['ExpClassTableComp'].closeView()
      this.dragStartData = data
      this.listIndex = index
      this.$parent.$refs['CourseScheduleComp'].setTableDataStatusByStorage(data)
      // console.log(data)
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(data)
      e.dataTransfer.setData("Text", 'Hello World'); // firefox必须有数据才允许拖拽
    },
    /**拖拽放置事件 */
    drop (e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.dropData) {
        console.log(this.dropData, '====================')
        // 该班级的暂存区的个数 + 1

        // 更新问题班级的暂存区数目和空白区数 this.excClassList
        this.$parent.refreshClassAreaNums(this.dropData.classId, 1, 1)

        let contain = false
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].subjectId === this.dropData.subjectId && this.list[i].teacherId === this.dropData.teacherId) {
            this.$set(this.list, i, Object.assign(this.list[i], {
              count: this.list[i].count + 1
            }))
            contain = true
            this.$parent.tempAndBlankInfos[this.dropData.classId].classUnCourseItems[i].count = this.list[i].count
            // this.$set(this.$parent.tempAndBlankInfos[this.dropData.classId].classUnCourseItems, i, Object.assign(this.$parent.tempAndBlankInfos[this.dropData.classId].classUnCourseItems[i], {
            //   count: this.$parent.tempAndBlankInfos[this.dropData.classId].classUnCourseItems[i].count + 1,
            // }))
            break
          }
        }
        if (!contain) {
          let tempObj = {
            count: 1,
            subjectFullName: this.dropData.subjectName,
            subjectId: this.dropData.subjectId,
            subjectShortName: this.dropData.subjectShortName,
            teacherId: this.dropData.teacherId,
            teacherName: this.dropData.teacherName,
            teacherNo: this.dropData.teacherNo
          }
          this.list.push(tempObj)
          this.$parent.tempAndBlankInfos[this.dropData.classId].classUnCourseItems.push(tempObj)
        }
        console.log(this.dropData)
        // 通知父组件 更新老师任课表 天上课节数 - 1 该班级的暂存区的个数 + 1
        this.$parent.refreshData(this.dropData)
      }
    },
    dragend () {
      this.$parent.$refs['CourseScheduleComp'].dragendFromStorage()
      this.$parent.$refs['TeachCourseComp'].setDragStartTeachingTable(this.dragStartData)
      this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(this.$parent.$refs['CourseScheduleComp'].tempData, 'end')
      // console.log(deepCopy(this.dragStartData), deepCopy(this.$parent.$refs['CourseScheduleComp'].tempData))
    },
    reloadData (startData, endData) {
      console.log(startData, endData, '===============')
      let containEndData = false
      for (let i = this.list.length - 1; i >= 0; i--) {
        if (startData && this.list[i].subjectId === startData.subjectId && this.list[i].teacherId === startData.teacherId) {
          if (this.list[i].count <= 1) {
            this.list.splice(i, 1)
            this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems.splice(i, 1)
          } else {
            this.$set(this.list, i, Object.assign(this.list[i], {
              count: this.list[i].count - 1
            }))
            this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems[i].count = this.list[i].count
          }
          // containStartData = true
        } else if (endData && this.list[i].subjectId === endData.subjectId && this.list[i].teacherId === endData.teacherId) {
          this.$set(this.list, i, Object.assign(this.list[i], {
            count: this.list[i].count + 1
          }))
          this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems[i].count = this.list[i].count
          containEndData = true
        }
        
      }
      if (!containEndData && endData && endData.subjectId && endData.teacherId) {
        this.list.push({
          count: 1,
          subjectFullName: endData.subjectName,
          subjectId: endData.subjectId,
          subjectShortName: endData.subjectShortName,
          teacherId: endData.teacherId,
          teacherName: endData.teacherName,
          teacherNo: endData.teacherNo
        })
        this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems.push({
          count: 1,
          subjectFullName: endData.subjectName,
          subjectId: endData.subjectId,
          subjectShortName: endData.subjectShortName,
          teacherId: endData.teacherId,
          teacherName: endData.teacherName,
          teacherNo: endData.teacherNo
        })
      }
    },
    addData (data) {
      let contain = false
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].subjectId === data.subjectId && this.list[i].teacherId === data.teacherId) {
          this.$set(this.list, i, Object.assign(this.list[i], {
            count: this.list[i].count + 1
          }))
          contain = true
          this.$parent.tempAndBlankInfos[data.classId].classUnCourseItems[i].count = this.list[i].count
          break
        }
      }
      if (!contain) {
        this.list.push({
          count: 1,
          subjectFullName: data.subjectName,
          subjectId: data.subjectId,
          subjectShortName: data.subjectShortName,
          teacherId: data.teacherId,
          teacherName: data.teacherName,
          teacherNo: data.teacherNo
        })
        this.$parent.tempAndBlankInfos[data.classId].classUnCourseItems.push({
          count: 1,
          subjectFullName: data.subjectName,
          subjectId: data.subjectId,
          subjectShortName: data.subjectShortName,
          teacherId: data.teacherId,
          teacherName: data.teacherName,
          teacherNo: data.teacherNo
        })
      }
    },
    removeData () {
      if (this.listIndex !== '') {
        let data = this.list[this.listIndex]
        if (data.count <= 1) {
          this.list.splice(this.listIndex, 1)
          this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems.splice(this.listIndex, 1)
        } else {
          this.$set(this.list, this.listIndex, Object.assign(data, {
            count: data.count - 1
          }))
          this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems[this.listIndex].count = this.list[this.listIndex].count
        }
      }
    },
    dragenter () {
      // console.log(e.target, '======拖拽进入========')
      this.$parent.$refs['TeachCourseComp'].setDragEndTeachingTable(null)
    },
    dragover (e) {
      e.preventDefault()
    },
    setDropData (f, data) {
      this.dropAreaVisiable = f
      this.dropData = data
    },
    setData () {
      this.list.splice(0, this.list.length)
      if (this.$parent.formInline.classId && this.$parent.tempAndBlankInfos[this.$parent.formInline.classId] && this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems && this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems.length > 0) {
        this.list.push(...this.$parent.tempAndBlankInfos[this.$parent.formInline.classId].classUnCourseItems)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drop-area {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.course-storage {
  width: 100%;
  height: 100%;
  padding: 3px 15px 40px;
  position: relative;
  .course-storage-item {
    float: left;
    width: 86px;
    height: 45px;
    border: 1px solid $course-storage-color1;
    text-align: center;
    color: $course-storage-color2;
    padding-top: 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    margin-right: 10px;
    margin-top: 7px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .course {
      font-weight: bold;
    }
    .teacher {
      font-size: 12px;
    }
    &.active {
      border-color: $course-storage-color3;
      color: $course-storage-color4;
    }
  }
}
@media screen and (max-width: 1400px){
  .course-storage {
    .course-storage-item {
      margin-right: 8px;
    }
  }
}
@media screen and (max-width: 1370px){
  .course-storage {
    .course-storage-item {
      margin-right: 5px;
    }
  }
}
</style>
