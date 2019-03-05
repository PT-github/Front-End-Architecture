<template>
  <!-- 调课详情弹框 -->
      <el-dialog
        class="dialog-comp use-dialog"
        title="调课详情"
        width="600px"
        :visible.sync="adjustDialogFlag"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="replace-box" v-if="adjustCourseObj && adjustCourseObj.adjustCourseDto">
          <div class="replace-item"><label>申请教师：</label><span>{{adjustCourseObj.adjustCourseDto.lectureTeacherName}}</span></div>
          <div class="replace-item"><label>调课日期：</label><span>{{adjustCourseObj.adjustCourseDto.startTime | moment('yyyy-MM-dd')}}</span></div>
          <div class="replace-item"><label>调课信息</label></div>
          <div class="replace-item">
            <p class="item-box bg">
              <span class="class-name">调课班级</span>
              <span class="adjust-course">主调课时</span>
              <span class="adjust-course">被调课时</span>
            </p>
            <p class="item-box border-bg">
                <span class="class-name">{{adjustCourseObj.adjustCourseDto.className}}</span>
                <span class="adjust-course">
                  <a class="course-mask" v-if="adjustCourseObj.uid !== adjustCourseObj.adjustCourseDto.initiativeUid">当前课节</a>
                  {{week[(adjustCourseObj.adjustCourseDto.initiativeWeekDay-1)]}}({{adjustCourseObj.adjustCourseDto.startTime | moment('MM-dd')}}) 第{{adjustCourseObj.adjustCourseDto.initiativeClassIndex}}节课-{{adjustCourseObj.adjustCourseDto.initiativeTeacherName}}({{adjustCourseObj.adjustCourseDto.initiativeSubjectName}})
                </span>
                <span class="adjust-course">
                  <a class="course-mask" v-if="adjustCourseObj.uid !== adjustCourseObj.adjustCourseDto.passiveUid">当前课节</a>
                  {{week[(adjustCourseObj.adjustCourseDto.passiveWeekDay-1)]}}({{adjustCourseObj.adjustCourseDto.passiveStartTime | moment('MM-dd')}}) 第{{adjustCourseObj.adjustCourseDto.passiveClassIndex}}节课-{{adjustCourseObj.adjustCourseDto.passiveTeacherName}}({{adjustCourseObj.adjustCourseDto.passiveSubjectName}})
                </span>
            </p>
          </div>
        </div>
      </el-dialog>
</template>
<script>
export default {
  name: "adjustCourseDialog",
  props: {
    adjustCourseObj: {
      type: Object,
      default: () => {}
    },
    // repalceDialog: Boolean
  },
  data () {
    return {
      adjustDialogFlag: false,
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    }
  },
  methods: {
    toogleVisiable (f) {
      this.adjustDialogFlag = f
    },
  }
};
</script>
<style lang="scss" scoped>
.dialog-comp {
  .replace-box {
    .replace-item {
      margin-bottom: 18px;
      &:last-child {
        margin-bottom: 0;
      }
      label {
        color: $replace-color1;
      }
    }
    .item-box {
      width: 100%;
      display: flex;
      text-align: center;
      border: 1px solid $replace-color3;
      span {
        padding: 15px 0;
      }
      .class-name {
        display: inline-block;
        width: 16%;
      }
      .adjust-course {
        display: inline-block;
        width: 42%;
        .course-mask {
          padding: 2px 5px;
          font-size: 12px;
          color: $adjust-color1;
          background: $adjust-color2;
          border-radius: 2px;
        }
      }
    }
    .bg {
      background: $replace-color2;
    }
    .border-bg {
      border-top: none;
      span {
        border-right: 1px solid $replace-color3;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.use-dialog {
  .el-dialog__body {
    padding: 20px;
    color: $font-color;
  }
}
</style>

