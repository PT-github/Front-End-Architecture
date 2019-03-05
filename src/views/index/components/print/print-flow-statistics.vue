<template>
  <div>
  <div id="AA">
    <p style="text-align: center; font-weight: bold; font-size: 16px;height: 30px;">课量统计</p>
    <el-table  key='flow-firstTable' :data="tableData.list" show-summary :summary-method="getSummaries" sum-text="总计" stripe style="width: 100%" class="table-comp summer-table">
      <el-table-column width="120px" :show-overflow-tooltip="true" align="center" prop="name" label="姓名" ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="planSubjectNums" label="任教科目" >
        <template slot-scope="scope">
          <span @click="onDetail(scope.row)" class="cell-detail">{{scope.row.planSubjectNums}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="planClassSize" label="应上课时"></el-table-column>
      <el-table-column align="center" prop="actualClassSize" label="实上课时"></el-table-column>
      <el-table-column width="180px" align="center" prop="difference" label="调代课时">
        <template slot-scope="scope">
          <span>{{scope.row.difference}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div id="hidden"></div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
  name: "print-flow-statistics",
  data () {
    return {
      tableData: {}
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    print () {
      this.$parent.showPrint = true
      // this.$_showLoading()
      // this.tableData.splice(0, this.tableData.length)
      // this.tableData.push(...this.$parent.tableData)
      this.tableData = Object.assign({}, this.$parent.tableData)
      console.log(this.tableData)
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
            _this.$parent.showPrint = false
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
    },
    // 导出
    /**
     * 初始化学年学期信息
     */
    /**
     * 每页显示条数改变
     */
    handleSizeChange() {
    },
    /**
     * 当前页改变
     */
    handleCurrentChange() {
      // this.pagination.pageNum = val
      // this.getClassSize()
    },
    getSummaries() {
      let sums = ["总计", null, 0, 0, 0];
      this.tableData.list && this.tableData.list.length > 0 ? this.tableData.list.forEach(item => {
        sums[2] += item.planClassSize ? item.planClassSize : 0
        sums[3] += item.actualClassSize ? item.actualClassSize : 0
        sums[4] += item.difference ? item.difference : 0
      }) : null
      return sums;
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/_variable.scss';
  .flow-info {
    height: 100%;
    .flow-info-content {
      height: 100%;
      padding: 0 20px 14px 20px;
      .demo-form-inline {
        .el-select,
        .el-input {
          width: 185px;
        }
      }
    }
    .cell-detail {
      display: inline-block;
      width: 100%;
      color: $statistics-color1;
      text-decoration: underline;
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  @import '@/assets/css/_variable.scss';
  .flow-info {
    .__vuescroll {
      height: calc(100% - 50px) !important;
    }
    .__view {
      width: 100% !important;
    }
  }
  .statistics-header-label {
    .el-form-item__label {
      color: $color-font1;
    }
    .el-date-editor {
      width: 250px;
      .el-range-separator {
        width: 10%;
      }
    }
  }
  .summer-table {
    .el-table__footer {
      color: $color-font2;
      font-weight:600;
    }
  }
  .dialog-flow {
    .el-table__header {
      th > .cell {
        font-weight: 400;
        color: $color-font1;
      }
    }
    .el-dialog__body {
      padding: 20px 40px 30px 40px;
    }
  }
</style>
