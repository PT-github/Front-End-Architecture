<template>
  <div class="print-whole-tableSch print-total-schedule1">
    <div id="print-total-schedule1" :style="'width:' + width + 'px;'">
      <!--根据数据分页展示-->
      <template v-for="(item,temindex) in tableDataPages">
      <!--一页-->
      <div v-if="(temindex+1) !== tableDataPages.length" :style="'height:' + height + 'px;'" :key="'temp-total-schedule1' + temindex" style="width: 100%;overflow: hidden;margin:0;padding: 0;">
        <!--标题-->
        <p style="height: 60px;width: 100%;"></p>
        <p style="text-align: center; font-weight: bold; font-size: 30px;height: 80px;line-height: 80px;">
          {{printContent && printContent.schoolYearName}}({{printContent &&printContent.termName}})<span v-if="printName === 'total'">总课程表</span><span v-if="printName === 'subject'">学科分布表</span>
        </p>
        <!--表格-->
        <el-table :data="item" style="width: 100%;overflow: hidden;">
          <el-table-column  prop="classes" label="年级班级" :width="tableTitleWidth" align="center"></el-table-column>
          <el-table-column v-for="(item, index) in maxCourseWeekDay" :label="Week[index]" align="center" :key="index + '_maxCourseWeekDay'">
            <el-table-column v-for="(it, idx) in maxCourse" :label="(idx + 1) + ''" :width="tableColumnWidth" align="center" :key="idx + '_maxClassIndex_' + index">
              <template slot-scope="scope">
                <div v-if="scope.row['sub_' + index + '_' + idx]">
                  <p class="sub">{{ scope.row['sub_' + index + '_' + idx].subjectShortName }}</p>
                  <p class="name">{{ scope.row['sub_' + index + '_' + idx].teacherName }}</p>
                </div>
                <div v-if="scope.row['sub_' + index + '_' + idx]">
                  <a class="adjust-blue-icon" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto"><span>调</span></a>
                  <a class="replace-orange-icon" v-if="!scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto"><span>代</span></a>
                  <a class="replace-orange-icon top25" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto"><span>代</span></a>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
        <!--尾页-->
      <div v-else :key="'temp-total-schedule1' + temindex" style="width: 100%;overflow: hidden;margin:0;padding: 0;">
        <!--标题-->
        <p style="height: 60px;width: 100%;"></p>
        <p style="text-align: center; font-weight: bold; font-size: 30px;height: 80px;line-height: 80px;">
          {{printContent && printContent.schoolYearName}}({{printContent &&printContent.termName}})<span v-if="printName === 'total'">总课程表</span><span v-if="printName === 'subject'">学科分布表</span>
        </p>
        <!--表格-->
        <el-table :data="item" style="width: 100%;overflow: hidden;">
          <el-table-column  prop="classes" label="年级班级" :width="tableTitleWidth" align="center"></el-table-column>
          <el-table-column v-for="(item, index) in maxCourseWeekDay" :label="Week[index]" align="center" :key="index + '_maxCourseWeekDay'">
            <el-table-column v-for="(it, idx) in maxCourse" :label="(idx + 1) + ''" :width="tableColumnWidth" align="center" :key="idx + '_maxClassIndex_' + index">
              <template slot-scope="scope">
                <div v-if="scope.row['sub_' + index + '_' + idx]">
                  <p class="sub">{{ scope.row['sub_' + index + '_' + idx].subjectShortName }}</p>
                  <p class="name">{{ scope.row['sub_' + index + '_' + idx].teacherName }}</p>
                </div>
                <div v-if="scope.row['sub_' + index + '_' + idx]">
                  <a class="adjust-blue-icon" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto"><span>调</span></a>
                  <a class="replace-orange-icon" v-if="!scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto"><span>代</span></a>
                  <a class="replace-orange-icon top25" v-if="scope.row['sub_' + index + '_' + idx].adjustCourseDto && scope.row['sub_' + index + '_' + idx].replaceCourseDto"><span>代</span></a>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </template>
    </div>
    <!--img打印区域-->
    <div id="hidden" style="display: none"></div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas';
  export default {
    props: ['printName'],
    data () {
      return {
        Week: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
        tableData: [], // 打印数据
        tableDataPages: [], // 分页列表数据
        maxCourseWeekDay: 5,// 一周几天
        maxCourse: 6, // 一天几节课
        printContent: {}, // 标题内容
        width: 0,  // 宽度
        height: 0,  // 高度
        onePageNum: 0, // 一页多少行
        tableColumnWidth: 0, // 表格列宽度
        maxLength: 4, // 最大字数
        tableTitleWidth: 0, // 最大标题列宽度
        maxTitleLength: 6, // 最大标题字数
        lineHeight: 80, // 每行的高度
        autoMargin: 120,  // 左右边距之和 根据不同的浏览器这个值会有所不同!  5  6  120  124    6 8 120 148    6 10 120 162
        autoMarginTop: 116 // 上下边距之和 根据不同的浏览器和maxCourseWeekDay与maxCourse的值不同这个值会有所不同!   124 谷歌
      }
    },
    methods: {
      getBrowserVersion(){
        let userAgent = window.navigator.userAgent; //包含以下属性中所有或一部分的字符串：
        if(userAgent.lastIndexOf('Edge') !== -1) {
          this.autoMarginTop = 156
        } else if (userAgent.lastIndexOf('Chrome') !== -1) {
          this.autoMarginTop = 116
        } else {
          this.autoMarginTop = 116
        }
      },
      // 设置打印表格的各种数据信息
      setDataInfo(){
        /*
         打印默认以A4纸张横屏打印，A4纸张的高宽比297/210，
         但是由于不同的浏览器打印设置有所不同，导致打印边距有所不同，而打印边距无法获取与设置（不同的浏览器默认边距值有不同）
         因此设定边距为一个变量x，计算： (一页高度 + 上下边距y) =  （最大宽度 + 左右边距x）* 高宽比     (上下边距 != 左右边距)
         且理应有  一页高度 >= 行高*行数 + 标题高度
         最后得出一页可以放置多少行数据进而出现分页展示
        */
        /*  第一步 */
        // 找出标题最大长度和教师名字最大长度 -  以便于之后设置标题宽度和内容宽度
        this.getBrowserVersion();
        this.tableData.forEach(item => {
          for(let key in item) {
            if (typeof item[key] === 'object' && item[key].teacherName.length > this.maxLength) {
              this.maxLength = item[key].teacherName.length;
              console.log('maxLength',this.maxLength)
            } else if (typeof item[key] === 'string' && item[key].length > this.maxTitleLength) {
              this.maxTitleLength = item[key].length;
              console.log('maxTitleLength',this.maxTitleLength)
            }
          }
        });
        // 根据标题长度以及教师长度计算出实际的列宽度
        this.tableColumnWidth = this.maxLength * 12+2;
        this.tableTitleWidth = this.maxTitleLength * 18;
        // 设置一周有几天，一天有几节课程
        this.maxCourseWeekDay = this.$parent.maxCourseWeekDay;
        this.maxCourse = this.$parent.maxCourse;
        // 计算出容器总宽度（课节数 * 列宽度 + 标题列宽度）
        this.width = this.maxCourse * this.maxCourseWeekDay * this.tableColumnWidth + this.tableTitleWidth;
        /*   第二步  */
        let autoTop = (this.maxCourse * this.maxCourseWeekDay - 30) * 1.2 + this.autoMarginTop; // 上下边距自动变化
        // 计算出容器总高度 注意（这里的宽指的是A4的高,由于边距未知，因此autoMargin是通过各种测试得出的一个大概值，保证每一页的高度>= 实际高度）
        // (this.height + this.autoMarginTop) = (this.width + this.autoMargin) * (210/297)
        this.height = (this.width  + this.autoMargin) * (210/297) - autoTop;
        console.log('height',this.height)
        // 计算出除去标题和表头后一页可以放多少行（通过css控制使得标题总高度60*2，每行高度80）
        this.onePageNum = Math.floor((this.height - 120 - 60 - 80)/this.lineHeight) - 1;
        console.log('onePageNum',this.onePageNum)
        // 计算出总数居需要几页然后生成不同的数据值
        for (let i = 0; i< Math.ceil(this.tableData.length/this.onePageNum);i++) {
          this.tableDataPages[i] = this.tableData.slice(this.onePageNum*i, this.onePageNum*(i+1));
        }
        console.log(this.tableDataPages)
      },
      // 打印
      print () {
        // 获取父组件的打印数据
        this.tableData = this.$parent.tableData3;
        //获取父组件的标题内容
        if(this.$parent.printContent) {
          this.printContent = this.$parent.printContent;
        }
        // 如果是subject则刷新组件（针对学科分布表的数据改变）
        if (this.printName === 'subject') {
          this.$forceUpdate();
        }
        this.setDataInfo();
        let _this = this;
        this.$nextTick(() => {
          // 通过canvas生成图片
          var dom = document.getElementById('print-total-schedule1');
          html2canvas(dom, {}).then(function(canvas) {
            var base64Src = canvas.toDataURL();
            var img = "<img src='" + base64Src + "' / width='100%'>";
            document.getElementById('hidden').innerHTML = img;
            var image = new Image();
            image.onload = function () {
              _this.printClasss();
              _this.$parent.showprint = false
            }
            image.src = base64Src
          });
        })
      },
      // 将生成的src图片内容放入表格中并打印
      printClasss () {
        var dom = document.getElementById('hidden');
        var printWidth = window.innerWidth;
        var printHeight = window.innerHeight;
        var newwindow = window.open("", "", "width=" + printWidth + ",height=" + printHeight);
        if (newwindow === null) {
          this.$message.warning('您的浏览器已经拦截了打印窗口，请设置浏览器允许弹出新窗口');
          return
        }
        newwindow.document.body.innerHTML = dom.innerHTML;
        newwindow.document.body.style.margin = 0;
        newwindow.print();
      }
    }
  }
</script>


<style lang="scss" scoped>
  .print-total-schedule1{
    overflow: hidden;
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
      padding: 0;
    }
    .sub {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      font-size: 18px;
      padding: 0;
      margin: 0;
      color: $course-view-color5;
    }
    .name {
      font-size: 12px;
      padding: 0;
      margin: 0;
      color: $course-view-color6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
<style lang="scss">
  .print-whole-tableSch{
    /* 表格头部css */
    .el-table__header-wrapper{
      .el-table__header{
        tr {
          border-right: none;
          &:first-child {
            th + th {
              border-right: 1px solid #000000!important;
            }
          }
        }
        th{
          border: 1px solid #000000;
          background-color: #C1C1C1 !important;
          height: 60px!important;
          .cell{
            color: #000000;
            font-weight: bold !important;
            font-size: 12px;
          }
        }
      }
    }
    /* 表格主体css */
    .el-table__body-wrapper{
      padding-bottom: 0!important;
      .el-table__body {
        .el-table__row{
          height: 80px!important;
          overflow: hidden;
          td {
            height: 80px!important;
            overflow: hidden;
            border: 1px solid #000000;
            &:first-child {
              font-weight: bold !important;
              background-color: #C1C1C1 !important;
            }
            .cell{
              color: #000000;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>

