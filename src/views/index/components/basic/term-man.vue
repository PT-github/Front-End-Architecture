<template>
  <div class="term-man">
    <s-title :title="'学年学期'"></s-title>
    <div class="term-info">
    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
      <el-form-item>
        <el-select v-model="formInline.schoolYear" placeholder="请选择学年">
          <el-option v-for="item in yearOptions" :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search">查询</el-button>
      </el-form-item>
      <div class="el-form-right fr">
        <el-form-item>
          <el-button type="primary">新增</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" :span-method="objectSpanMethod" border class="table-comp" :height="tableHeight">
      <el-table-column align="center" prop="schoolYear" width="172" label="学年"></el-table-column>
      <el-table-column align="center" prop="term" label="学期" ></el-table-column>
      <el-table-column align="center" prop="startTime" label="开始时间"></el-table-column>
      <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
      <el-table-column align="center" label="操作" width="210">
        <template>
          <span class="opera">修改</span>
          <span class="delete">删除</span>
          <!-- <i class="iconfont icon-xiugai"></i>
          <i class="iconfont icon-shanchu"></i> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-comp clearfix">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  name: 'TermMan',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      currentPage: 2,
      formInline: {
        schoolYear: '',
      },
       yearOptions: [{
          value: '2017-2018',
          label: '2017-2018学年'
        }, {
          value: '2016-2017',
          label: '2016-2017学年'
      }],
      tableData: [{
        schoolYear: '2017-2018学年',
        term: '上学期',
        startTime: '2018-02-17',
        endTime: '2018-07-21'
      }, {
        schoolYear: '2017-2018学年',
        term: '下学期',
        startTime: '2018-09-17',
        endTime: '2018-12-21'
      }, {
        schoolYear: '2018-2019学年',
        term: '上学期',
        startTime: '2018-02-17',
        endTime: '2018-07-21'
      }, {
        schoolYear: '2018-2019学年',
        term: '下学期',
        startTime: '2018-09-17',
        endTime: '2018-12-21'
      }]
    }
  },
  methods: {
    onSubmit () {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column);
        if (columnIndex === 0 || columnIndex === 4) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.term-man {
  padding: 14px 20px;
  width: 100%;
  height: 100%;
  .term-info {
     height: calc(100% - 100px);
  }
}
</style>
