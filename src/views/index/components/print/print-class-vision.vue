<template>
  <div style="position: absolute; top: 44px; width: 100%; z-index: -9999999; padding: 20px">
    <div id="AA">
      <p style="text-align: center; font-weight: bold; font-size: 16px;height: 30px;"  v-if="printname">调课统计(班级视角)</p>
      <el-table key='flow-firstTable' :data="tableData.list" show-summary :summary-method="getSummaries" sum-text="总计" stripe style="width: 100%" class="table-comp summer-table" empty-text =" ">
        <el-table-column width="120px" :show-overflow-tooltip="true" align="center" prop="className" label="班级" ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="totalAdjustNums" label="申请调课课时" >
          <template slot-scope="scope">
            <span @click="onDetail(scope.row)" class="cell-detail">{{scope.row.totalAdjustNums}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stayAdjustNums" label="待批课时"></el-table-column>
        <el-table-column align="center" prop="rejectAdjustNums" label="驳回课时"></el-table-column>
        <el-table-column width="180px" align="center" prop="alreadyAdjustNums" label="实调课时">
          <template slot-scope="scope">
            <span>{{scope.row.alreadyAdjustNums}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="hidden" style="display: none"></div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
  props: ['printname'],
  name: "print-class-vision",
  data () {
    return {
      tableData: {}
    }
  },
  methods: {
    print () {
      this.$parent.isshowPrint = true
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
          _this.$parent.isshowPrint = false
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
      let sums = ["总计", 0, 0, 0, 0];
      this.tableData.list && this.tableData.list.length > 0 ? this.tableData.list.forEach(item => {
        sums[1] += item.totalAdjustNums ? item.totalAdjustNums : 0
        sums[2] += item.stayAdjustNums ? item.stayAdjustNums : 0
        sums[3] += item.rejectAdjustNums ? item.rejectAdjustNums : 0
        sums[4] += item.alreadyAdjustNums ? item.alreadyAdjustNums : 0
      }) : null
      return sums;
    },
  }
}
</script>


<style lang="scss" scoped>
  @import '@/assets/css/_variable.scss';
  .class-vision {
    height: 100%;
    .class-info-content {
      height: 100%;
      padding: 12px 20px 14px 20px;
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
    .dialog-class-vision {
      .top-p {
        color: $color-font2;
        font-size: 14px;
      }
      .top-b {
        color: $color-font4;
        font-size: 12px;
      }
      .class-pending {
        color: $statistics-color2;
      }
      .class-return {
        color: $statistics-color3;
      }
    }
  }
</style>

<style lang="scss">
  @import '@/assets/css/_variable.scss';
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
  .dialog-class-vision {
    .el-table__header {
      th > .cell {
        font-weight: 400;
        color: #333;
      }
    }
    .el-dialog__body {
      padding: 15px 40px 30px 40px;
    }
  }
  .pagination-dialog-th {
    padding: 20px 0 0 0;
  }
</style>
