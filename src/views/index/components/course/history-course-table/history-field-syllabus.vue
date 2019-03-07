<template>
  <div class="course-class-table view-field-table">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.plass" placeholder="场地选择"  @change="getHistoryPlaceTableList">
            <el-option v-for="item in plassOptions" :key="item.uid"
                     :label="item.placeFullname"
                     :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getHistoryPlaceTableList" class="icon-button pr-10">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="course-class-content" ref="table">
        <div class="table-left">
          <el-table :data="tableData3" style="width: 100%;" height="100%" v-loading="loading">
            <el-table-column label="节数/星期" width="140" align="center">
            <template slot-scope="scope">
              <p class="sub">第{{ scope.row.classIndex }}节</p>
              <p class="name">{{ scope.row.time }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="weekFormatter[index]" min-width="168" align="center" v-for="(item, index) in maxCourseWeekDay" :key="index + '_weekFormatter'">
            <template slot-scope="scope">
              <div class="sub" v-if="scope.row['v' + (index + 1)]">     
                  <span v-if="!showShortSubject">{{ scope.row['v' + (index + 1)].subjectName }}</span>
                  <span v-if="showShortSubject">{{ scope.row['v' + (index + 1)].subjectShortName }}</span>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p v-for="(itm, inx) in scope.row['v' + (index + 1)].placeTimetableItemDtoList" :key="inx + '_placeTimetableItemDtoList'" class="grade-tip">{{ itm.className }}</p>
                    </div>
                    <span v-if="scope.row['v' + (index + 1)].placeTimetableItemDtoList.length > 0">({{ scope.row['v' + (index + 1)].placeTimetableItemDtoList.length }})</span>
                  </el-tooltip>
                </div>
            </template>
          </el-table-column>
            <template slot="empty">
                <div v-if="loading">
                </div>
                <div v-else>
                    <img src="../../../../../assets/img/no-data.png">
                    <p>暂无课表数据</p>
                </div>
            </template>
          </el-table>
        </div>
    </div>
  </div>
</template>
<script>
import { getPlaces, getHistoryPlaceTable } from '../../../store/api';
export default {
  name: 'HistoryFieldSyllabus',
  data () {
    return {
      formInline: {
        plass: '',
        checkList: ['0','2']
      },
      plassOptions: null,
      configData: [],
      tableData3: [],
      showShortSubject: false,     //是否展示科目简称
      currentSchool: null,     //当前学校
      term: null,    //学期id
      schoolYearId: null,      //学年
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      maxCourseWeekDay: 5, // 每周上课天数
      maxCourse: 6, // 每天上课节数
      loading: false,
    }
  },
  mounted(){  //生命周期里接收参数
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    this.schoolYearId = +this.$route.query.schoolYearId || null
    this.term = +this.$route.query.term || null
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      this.getPlacesList();
    } 
  },
  methods: {
    //获取场地
    getPlacesList() {
      this.$_showLoading();
      this.loading = true;
      getPlaces(this.schoolId).then(res =>{
        if(res.data && res.data.length > 0) {
          this.plassOptions = res.data;
          this.formInline.plass = this.plassOptions[0].uid;
          this.getHistoryPlaceTableList();
        }else {
          this.$nextTick(() => {
            this.loading = false
          })
        }
        this.$nextTick(() => {
          this.$_hideLoading()
        })
      }).catch(e =>{
         console.log(e);
         this.$_hideLoading()
      }) 
    },
    //场地课表
    getHistoryPlaceTableList() {
        this.loading = true;
        this.tableData3 = []
        let queryParams = {
          termId : this.term,
          placeId: this.formInline.plass,
        }
        getHistoryPlaceTable(queryParams).then(res =>{
          console.log("11111111111111111",res.data);
          let data = res.data, configData = {}
          this.maxCourse = (data.maxCourseAm || 0) + (data.maxCoursePm || 0)
          this.maxCourseWeekDay = data.maxCourseWeekDay || 0
          if (this.maxCourseWeekDay) {
            let tableConfig = {}
            if (data.baseSchoolGradeTimes && data.baseSchoolGradeTimes.length > 0) {
              for (let i = 0; i < data.baseSchoolGradeTimes.length; i++) {
                configData[data.baseSchoolGradeTimes[i].classIndex] = data.baseSchoolGradeTimes[i]
              }
            }
            if (data.placeTimetableDtos && data.placeTimetableDtos.length > 0) {
              for (let j = 0; j < data.placeTimetableDtos.length; j++) {
                tableConfig[
                  data.placeTimetableDtos[j].classIndex + '_' + data.placeTimetableDtos[j].weekDay
                ] = data.placeTimetableDtos[j]
              }
            }
            for (let m = 1; m <= this.maxCourse; m++) {
              let obj = {}
              obj.classIndex = m
              obj.time = configData[m] ? configData[m].classStarttime + '-' + configData[m].classEndtime : ''
              for (let prop in tableConfig) {
                if (prop.indexOf(m + '_') === 0) {
                  obj['v' + tableConfig[prop].weekDay] = tableConfig[prop]
                }
              }
              this.tableData3.push(obj)
            }
          } else {
            this.maxCourseWeekDay = 5
            this.maxCourse = 6
          }
          this.$nextTick(() => {
            this.loading = false
          })
      }).catch(e =>{
         console.log(e);
         this.loading = false
         this.tableData3 = [];
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.course-class-table {
  width: 100%;
  height: 100%;
  background: $course-view-color1;
  .course-class-top {
    width: 100%;
    height: 60px;
    padding: 10px 20px 0;
    .demo-form-inline {
      float: left;
      height: 34px;
      overflow: hidden;
    }
  }
  .course-class-content {
    width: 100%;
    height: calc(100% - 76px);
    display: flex;
    .table-left {
      width: 75%;
      padding-left: 20px;
    }
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
  .blank-data {
    padding: 50px 0;
    text-align: center;
  }
}
</style>
<style lang="scss">
.course-class-table {
  .el-table__header {
    th {
      padding: 24px 0;
      background: #FAFAFA;
    }
  }
  .el-table__body {
    td {
      height: 68px;
      border-left: 1px solid #EAEAEA;
      &:last-child {
        border-right: 1px solid #EAEAEA;
      }
      &:first-child {
        background: #FAFAFA;
      }
    }
  }
  .el-table__empty-block {
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
  }
  .table-left {
    .el-table::before {
      height: 0;
    }
  }
}
.grade-tip {
    line-height: 24px;
 }
 .el-tooltip__popper[x-placement^=right] .popper__arrow {
   border-right-color: $course-view-color4
 }
 .el-tooltip__popper[x-placement^=right] .popper__arrow::after {
   border-right-color: $course-view-color4
 }
 .el-tooltip__popper.is-dark {
   background: $course-view-color4
 }
.view-field-table {
  .el-table__header-wrapper {
    border-top: 1px solid $preview-class-table-color1 !important;
    border-right: 1px solid $preview-class-table-color1 !important;
    border-left: 1px solid $preview-class-table-color1 !important;
  }
}
.course-options-right {
      .el-button+.el-button {
         margin-left: 16px;
      }
 }
</style>
