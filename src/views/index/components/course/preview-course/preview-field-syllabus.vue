<template>
  <div class="preview-field-syllabus">
    <div class="course-class-top">
      <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.placeId" placeholder="场地选择" @change="getClassTable">
            <el-option v-for="item in placeOptions" :key="item.uid"
              :label="item.placeFullname"
              :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button icon="el-icon-search" @click="getHistoryPlaceTableList">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox v-model="showShortSubject">科目简称</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="course-class-content" ref="table">
      <div class="table-left">
        <el-table :data="tableData" style="width: 100%" height="100%">
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
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getPlaces, previewPlaceCourse } from '../../../store/api';
export default {
  name: 'PreviewFieldSyllabus',
  data () {
    return {
      params: {
        schoolId: '',
        gradeIds: '',
        termId: '',
        viewType: 3,
        schoolYearId: ''
      },
      maxCourseWeekDay: 5, // 每周上课天数
      maxClassIndex: 6, // 每天上课节数
      weekFormatter: [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ],
      tableData: [],
      showTeacherNo: false, //是否教师编号
      showTeacher: true, //显示教师
      showShortSubject: true, //科目简称
      loading: false,
      formInline: {
        placeId: ''
      },
      gradeOptions: [],
      gradeObj: {},
      classOptions: [],
      configData: [],
      tableData2: [],
      placeOptions: []
    }
  },
  mounted(){  //生命周期里接收参数
    this.params.termId = this.$route.query.termId || "";
    this.params.gradeIds = this.$route.query.gradeIds || "";
    this.params.schoolId = this.$route.query.schoolId || "";
    this.$_showLoading()
    this.getPlacesList().then(() => {
      this.$_hideLoading()
      this.getClassTable()
    })
  },
  methods: {
    getClassTable() {
      this.loading = true
      this.tableData.splice(0, this.tableData.length)
      this.tableData2.splice(0, this.tableData2.length)
      previewPlaceCourse({
        schoolId: this.params.schoolId,
        gradeIds: this.params.gradeIds,
        termId: this.params.termId,
        placeId: this.formInline.placeId
      }).then(res => {
        console.log(res)
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
            this.tableData.push(obj)
          }
        } else {
          this.maxCourseWeekDay = 5
          this.maxCourse = 5
        }
        this.$nextTick(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    //获取场地
    getPlacesList() {
      return getPlaces(this.params.schoolId).then(res =>{
        if(res.data && res.data.length > 0) {
          this.placeOptions.push(...res.data);
          this.formInline.placeId = this.placeOptions[0].uid;
        }
      }).catch(e => {
         console.log(e);
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-field-syllabus {
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
    height: calc(100% - 60px);
    padding: 0 20px;
    // display: flex;
    .table-left {
      height: 100%;
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
.preview-field-syllabus {
  .el-table__header-wrapper {
    border-top: 1px solid $preview-class-table-color1 !important;
    border-right: 1px solid $preview-class-table-color1 !important;
    border-left: 1px solid $preview-class-table-color1 !important;
  }
  .el-table__header {
    th {
      padding: 24px 0;
      background: #FAFAFA;
    }
  }
  .el-table__body {
    td {
      border-left: 1px solid #EAEAEA;
      padding: 20px 0;
      &:last-child {
        border-right: 1px solid #EAEAEA;
      }
      &:first-child {
        background: #FAFAFA;
      }
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
</style>
