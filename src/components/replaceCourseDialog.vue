<template>
  <!-- 代课详情弹框 -->
      <el-dialog
        class="dialog-comp use-dialog"
        title="代课详情"
        width="600px"
        :visible.sync="repalceDialogFlag"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="replace-box">
          <div class="replace-item"><label>暂离/离调岗教师：</label><span>{{replaceCourseObj.beforeTeacher}}</span></div>
          <div class="replace-item"><label>代课期限：</label>
            <span>{{replaceCourseObj.startTime | moment('yyyy-MM-dd')}} 第{{replaceCourseObj.startClassIndex}}节课</span>
            <span v-if="replaceCourseObj.isEndClass"> - 学期末</span>
            <span v-else> - {{replaceCourseObj.endTime | moment('yyyy-MM-dd')}} 第{{replaceCourseObj.endClassIndex}}节课</span> 
          </div>
          <div class="replace-item"><label>代课信息：</label></div>
          <div class="replace-item">
            <p class="item-box bg"><span>班级和科目</span><span>代课老师</span></p>
            <p class="item-box border-bg"><span>{{replaceCourseObj.className}}({{replaceCourseObj.subjectName}})</span><span>{{replaceCourseObj.afterTeacher}}</span></p>
          </div>
        </div>
      </el-dialog>
</template>
<script>
export default {
  name: "replaceCourseDialog",
  props: {
    replaceCourseObj: {
      type: Object,
      default: () => {}
    },
    // repalceDialog: Boolean
  },
  data () {
    return {
      repalceDialogFlag: false
    }
  },
  methods: {
    toogleVisiable (f) {
      this.repalceDialogFlag = f
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
      height: 50px;
      line-height: 50px;
      display: flex;
      text-align: center;
      border: 1px solid $replace-color3;
      span {
        display: inline-block;
        width: 50%;
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

