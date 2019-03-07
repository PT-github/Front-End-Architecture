<template>
  <div style="margin-top: 1000px" class="print-class-table">
    <div id="AA" style="width: 100%;">
      <p style="margin-left: 40%; font-weight: bold; font-size: 16px; margin-bottom: 10px">{{printContent.schoolYearName}}({{printContent.termName}})班级表</p>
      <el-table :data="tableData3" style="width: 100%;">
        <el-table-column label="节数/星期" width="140" align="center">
          <template slot-scope="scope">
            <p class="sub">第{{ scope.row.week1.classIndex }}节</p>
            <p class="name">{{ scope.row.week1.time }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :prop="item.label"
          :label="item.name"
          min-width="168"
          align="center"
          v-for="(item, index) in configData"
          :key="index + 'table'"
        >
          <template slot-scope="scope">
            <p class="sub" v-if="!showShortSubject" style="color: #000000">{{ scope.row[item.label].subjectName }}</p>
            <p class="sub" v-if="showShortSubject" style="color: #000000">{{ scope.row[item.label].subjectShortName }}</p>
            <p class="name" v-if="showTeacher" style="color: #000000">{{ scope.row[item.label].teacherName }}</p>
            <a
              class="adjust-blue-icon"
              v-if="scope.row[item.label].adjustCourseDto"
              @click="onViewAdjust(scope.row[item.label])"
            >
              <span>调</span>
            </a>
            <a
              class="replace-orange-icon"
              v-if="!scope.row[item.label].adjustCourseDto && scope.row[item.label].replaceCourseDto"
              @click="onView(scope.row[item.label])"
            >
              <span>代</span>
            </a>
            <a
              class="replace-orange-icon top25"
              v-if="scope.row[item.label].adjustCourseDto && scope.row[item.label].replaceCourseDto"
              @click="onView(scope.row[item.label])"
            >
              <span>代</span>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="hidden" style="display: none"></div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { getCurrentTerm } from '../../store/api';
export default {
  name: "print-class-timetable-syllabus",
  data () {
    return {
      schoolId: null,
      tableData3: [],
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      showTeacher: true,
      showShortSubject: false,
      maxCourseWeekDay: 4,
      printContent: {},
      configData: []
    }
  },
  mounted(){  //生命周期里接收参数
    // this.schoolId = this.$parent.schoolId
    // if(this.schoolId) {
    //   this.getCurrentTermData();
    // }
  },
  methods: {
    //获取当前学期
    getCurrentTermData() {
      let queryParams = {
        schoolId: this.schoolId,
      }
      getCurrentTerm(queryParams).then(res =>{
        if(res.data) {
          this.printContent = res.data
        }
      }).catch(e =>{
        console.log(e);
      })
    },
    print () {
      this.$parent.showprint = true
      // this.$_showLoading()
      // this.tableData.splice(0, this.tableData.length)
      // this.tableData.push(...this.$parent.tableData)
      this.tableData3 = this.$parent.tableData3
      this.configData = this.$parent.configData
      this.printContent = Object.assign({}, this.$parent.printContent)
      // this.weekFormatter = this.$parent.weekFormatter
      // this.maxCourseWeekDay = this.$parent.maxCourseWeekDay
      console.log(this.tableData3)
      let _this = this
      this.$nextTick(() => {
        // 生成图片
        var dom = document.getElementById('AA')
        html2canvas(dom, {
        }).then(function(canvas) {
          var base64Src = canvas.toDataURL()
          var img =
            "<img src='" + base64Src + "' / width='100%'>";
          document.getElementById('hidden').innerHTML = img
          var image = new Image()
          image.onload = function () {
            _this.printClasss()
            // _this.$_hideLoading()
            _this.$parent.showprint = false
          }
          image.src = base64Src
        });
      })
    },
    printClasss () {
      var dom = document.getElementById('hidden')
      var width = window.innerWidth;
      var height = window.innerHeight;
      var newwindow = window.open(
        "",
        "",
        "width=" + width + ",height=" + height
      );
      if (newwindow === null) {
        this.$message.warning('您的浏览器已经拦截了打印窗口，请设置浏览器允许弹出新窗口')
        return
      }
      newwindow.document.body.innerHTML = dom.innerHTML
      newwindow.document.body.style.margin = 0;
      newwindow.print();
    }
  }
}
</script>


<style lang="scss" scoped>
  .print-class-table{
    @mixin icon-style {
      position: absolute;
      right: 0;
      width: 16px;
      height: 24px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      display: inline-block;
      span {
        padding: 0 2px;
      }
    }
    .adjust-blue-icon {
      top: 0;
      background: url("../../../../assets/img/blue-icon.png") no-repeat;
      @include icon-style;
    }
    .replace-orange-icon {
      top: 0;
      background: url("../../../../assets/img/orange-icon.png") no-repeat;
      @include icon-style;
    }
    .top25 {
      top: 25px !important;
    }
    .sub {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: $course-view-color5;
    }
    .name {
      font-size: 12px;
      color: $course-view-color6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

</style>
<style lang="scss">
  .print-class-table{
    .table-left{
      width: 100%!important;
    }
    .el-table{
      border: 2px solid #000000 !important;
      th {
        border-right: 2px solid #000000 !important;
      }
    }
    .el-table__header{
      th{
        background-color: #C1C1C1 !important;
        .cell{
          color: #000000;
          font-weight: bold !important;
        }
      }
    }
    .el-table__body {
      td {
        &:first-child {
          font-weight: bold !important;
          background-color: #C1C1C1 !important;
        }
        border: 1px solid #000000!important;
        .cell{
          color: #000000;
        }
      }
    }
  }
</style>
