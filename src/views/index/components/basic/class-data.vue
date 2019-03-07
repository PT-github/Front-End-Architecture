<template>
  <div class="class-data">
    <s-title :title="'课时数据'"></s-title>
    <div style="width: calc(100% - 40px);height: 1px; background: #e8e8e8;margin: 0 auto 8px;"></div>
    <!-- <div v-if="!isShowToolTip" class="tooltip">
      <i class="el-icon-warning"></i>
      <span>操作提示：选择年级，鼠标点击无课至课表节次中，可将对应年级的对应课节设置为无课。已设为无课的节次点击可取消</span>
    </div> -->
    <div class="class-data-content" v-if="!pageBegin">
      <vue-scroll>
        <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
          <el-form-item>
            <el-select v-model="formInline.termId" placeholder="请选择学期" @change="onChangeSchoolYear">
              <template v-if="schoolYearTermList">
                <el-option v-for="item in schoolYearTermList" :key="item.uid + '_st'" :label="item.name" :value="item.uid"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item class="right-fr">
            <div class="time-set" v-show="!isModify && !isShowToolTip" @click="onClassTimeSet">节次时间设置</div>
            <p class="save-btn xiugai" v-show="!isModify && !isShowToolTip" @click="isModify = true">
              课时修改
              <el-tooltip class="item" popper-class="classdata-tip" effect="dark" content="点击课时修改可调整课时进行无课设置 " placement="bottom">
                <i class="icon iconfont icon-jingshi"></i>
              </el-tooltip>
            </p>
            <p class="save-btn" v-show="isModify" @click="courseParamSubmit">保存</p>
            <p class="save-btn-cancle" v-show="isModify" @click="onCancleModify">取消</p>
            <!-- <div v-if="isModify" class="tooltip-hasclass">
              <i class="el-icon-warning"></i>
              <span>点击课表节次，可直接将对应年级的对应课节设置为无课</span>
            </div> -->
          </el-form-item>
        </el-form>
        <div v-if="!isShowToolTip" class="has-class-data">
          <div class="left">
            <!-- <vue-scroll> -->
            <p class="title">选择年级</p>
            <ul>
              <li :class="{'active': item.uid === formInline.gradeId}" v-for="(item, index) in gradeList" :key="index + 'grade'" @click="onChangeGrade(item.uid)">{{ item.gradeFullName }}</li>
            </ul>
            <!-- </vue-scroll> -->
          </div>
          <div class="right">
            <el-form :inline="true" size="small" class="right-top-operate">
              <el-form-item label="每周天数">
                <el-select v-show="isModify" v-model="settingDataForm.days" placeholder="请选择" @change="onChangeClassDays">
                  <el-option v-for="(item, index) in selectList" :key="index + 'a'" :value="item"></el-option>
                </el-select>
                <span class="noclass" v-show="!isModify">{{settingDataForm.days}}</span>
              </el-form-item>
              <el-form-item label="上午节数">
                <el-select v-show="isModify" v-model="settingDataForm.amNum" placeholder="请选择" @change="onChangeClassTotalAm">
                  <el-option :disabled="settingDataForm.pmNum === 0 && item === 0" v-for="(item, index) in classList" :key="index + 'b'" :label="item" :value="item"></el-option>
                </el-select>
                <span class="noclass" v-show="!isModify">{{settingDataForm.amNum}}</span>
              </el-form-item>
              <el-form-item label="下午节数">
                <el-select v-show="isModify" v-model="settingDataForm.pmNum" placeholder="请选择" @change="onChangeClassTotalPm">
                  <el-option :disabled="settingDataForm.amNum === 0 && item === 0" v-for="(item, index) in classList" :key="index + 'c'" :label="item" :value="item"></el-option>
                </el-select>
                <span class="noclass" v-show="!isModify">{{settingDataForm.pmNum}}</span>
              </el-form-item>
              <el-form-item>
                <div v-if="isModify" class="tooltip-hasclass">
                  <i class="el-icon-warning"></i>
                  <span>点击课表节次，可直接将对应年级的对应课节设置为无课</span>
                </div>
              </el-form-item>
              <!-- <el-form-item class="right-fr" v-show="!isModify">
                <div @click="onClassTimeSet">节次时间设置</div>
              </el-form-item> -->
            </el-form>
            <div class="table-box">
              <p class="title">课表展示</p>
              <el-table v-loading="loading" :data="tableData" style="width: 100%" class="table-class-show" :row-class-name="changeStyle">
                <el-table-column width="150px" align="center" fixed>
                  <template slot-scope="scope">
                    <div class="count">
                      <p>{{ scope.row.type }}</p>
                      <p class="bttime">{{ classTimeConfig[scope.$index + '_'] ? classTimeConfig[scope.$index + '_'].classStarttime + '-' + classTimeConfig[scope.$index + '_'].classEndtime : '' }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column v-for="(item, index) in settingDataForm.days" :key="index + '_days'" align="center" :label="week[index]">
                  <template slot-scope="scope">
                    <span
                      :class="{isNotModify: !isModify}"
                      @click.stop="onChangeClassState(scope.$index + 1, index + 1)">
                        {{settingDataForm.noCourseData[(scope.$index + 1) + '_' + (index + 1)] ? '无课' : ''}}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-if="isShowToolTip" class="no-class-data">
          <div class="no-class-img"></div>
          <div class="no-class-text">您尚未设置课时数据，请点击“设置课时”按钮进行设置</div>
          <div v-if="schoolYearTermList.length > 0 && gradeList.length > 0" class="no-class-btn" @click="onClassSet">设置课时</div>
          <div v-else class="no-class-btn" style="background: #DDD;">设置课时</div>
        </div>
      </vue-scroll>
    </div>
    <!-- 无数据课时设置 -->
    <el-dialog
      class="dialog-comp"
      title="课时设置"
      width="600px"
      :visible.sync="classSettingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="no-class-data-setting">
        <div class="dialog-tooltip">
          <span>备注：如有各学段不一样，最大化设置、后续步骤再个性化设置</span>
        </div>
        <div class="dialog-flex">
          <div class="linee"><span>每周天数</span><el-input v-model="settingData.days">
            <template slot="append">
              <div class="operate">
                <i class="el-icon-arrow-up" @click="onJiajia('days')"></i>
                <i class="el-icon-arrow-down" @click="onJianjian('days')"></i>
              </div>
            </template>
          </el-input></div>
          <div class="linee"><span>上午节数</span><el-input v-model="settingData.amNum">
            <template slot="append">
              <div class="operate">
                <i class="el-icon-arrow-up" @click="onJiajia('amNum')"></i>
                <i class="el-icon-arrow-down" @click="onJianjian('amNum')"></i>
              </div>
            </template>
          </el-input></div>
          <div class="n-line-active linee"><span>下午节数</span><el-input v-model="settingData.pmNum">
            <template slot="append">
              <div class="operate">
                <i class="el-icon-arrow-up" @click="onJiajia('pmNum')"></i>
                <i class="el-icon-arrow-down" @click="onJianjian('pmNum')"></i>
              </div>
            </template>
          </el-input></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onConfirmClassSet">确 定</el-button>
        <el-button @click="classSettingDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 节次时间设置 -->
    <el-dialog
      class="dialog-comp"
      title="节次时间设置"
      width="392px"
      :visible.sync="classTimeSettingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="class-time-setting">
        <div class="class-text">
          <span class="title">节次</span>
          <span class="title">开始时间</span>
          <span class="title">结束时间</span>
        </div>
        
        <div v-for="(item, index) in classTimeSetListFormater" :key="index + 'time'" class="class-total">
          <span class="title">第{{index + 1}}节</span>
          <el-time-select :clearable="false" :key="index + '_start_time'" :picker-options="{
              start: '06:00',
              step: '00:05',
              end: '20:00'
            }" v-model="item.classStarttime"></el-time-select>
          <el-time-select :clearable="false" :key="index + '_end_time'" :picker-options="{
              start: '06:00',
              step: '00:05',
              end: '20:00'
            }" v-model="item.classEndtime"></el-time-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onConfirmClassTimeSet">确 定</el-button>
        <el-button @click="classTimeSettingDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getYearTermList, gradeInit, getSubClassList, getClassDataList, classDataAdd, classDataUpdate, getClassTimeList, classTimeAdd, classTimeUpdate } from '@/views/index/store/api'
import { compareTime, deepCopy } from '@/utils'
export default {
  name: 'ClassData',
  data () {
    return {
      tableHeight: 'calc(100% - 93px)',
      formInline: {
        schoolId: 9, // 学校ID
        schoolYearId: '', // 学年ID
        termId: '', // 学期ID
        gradeId: '' // 年级ID
      },
      isShowToolTip: false, // 无课时数据面板显示控制
      gradeList: [], // 当前学期下的年级
      schoolYearTermList: [], // 学年学期列表
      gradeDataCache: {}, // 年级的课时数据（接口返回的）
      gradeDataSourse: {}, // 年级的课时数据（接口返回的+后续修改的）
      isModify: false, // 是否正在修改
      pageBegin: true, // 界面开始初始化
      settingData: { // 课时数据默认设置
        days: 5, // 每周上课天数
        amNum: 4, // 上午多少节
        pmNum: 2 // 下午多少节
      },
      settingDataForm: { // 课时数据设置
        days: 5, // 每周上课天数
        amNum: 4, // 上午多少节
        pmNum: 2, // 下午多少节
        noCourseData: {} // 无课数据对象
      },
      maxSettingData: {
        amNum: 0,
        pmNum: 0,
      },
      loading: false,
      selectList: [1, 2, 3, 4, 5, 6, 7], // 每周天数
      classList: [0, 1, 2, 3, 4, 5, 6, 7], // 上下午节数
      tableData: [], // 表内容

      type: ['第一节','第二节','第三节','第四节','第五节','第六节','第七节', '第八节', '第九节', '第十节', '第十一节', '第十二节', '第十三节', '第十四节'],
      week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
      
      tableConfig: [], // 表头数据
      saveTableConfig: [
        {label: '星期一', prop : 'one'},
        {label: '星期二', prop : 'two'},
        {label: '星期三', prop : 'three'},
        {label: '星期四', prop : 'four'},
        {label: '星期五', prop : 'five'},
        {label: '星期六', prop : 'six'},
        {label: '星期天', prop : 'seven'}
      ],
      propConfig: [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven' ],
      
      // noClassConfig: {}, // 无课设置 {1_1: {}, 1_2: {}}
      classTimeSetList: [], // 节次时间设置数据
      classTimeSetListFormater: [], // 过滤后的节次课时
      classTimeConfig: {}, // 节次时间设置数据{1: {}, 2: {}}
      classTimeSettingDialog: false, // 节次时间设置弹框显示标志

      yearTermList: [], // 学年学期数据
      // gradeList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classSettingDialog: false
    }
  },
  computed: {
    schoolYearIdFormater () {
      let obj = {}
      for (let i = 0; i < this.schoolYearTermList.length; i++) {
        obj[this.schoolYearTermList[i].uid] = this.schoolYearTermList[i]
      }
      return obj
    }
  },
  mounted () {
    this.$_showLoading()
    if (this.$store.state.user.currentSchool) {
      this.formInline.schoolId = this.$store.state.user.currentSchool.uid
    } else {
      this.$message.error('未获取到学校信息')
      this.$_hideLoading()
      return 
    }
    this.getSchoolYear().then(() => {
      this.getClassTime()
      this.pageBegin = false
      this.getGrade().then(() => {
        if (this.gradeList.length > 0) {
          this.formInline.gradeId = this.gradeList[0].uid
          this.getClassData().then(() =>{
            this.$_hideLoading()
          })
        } else {
          this.$message.error('请维护年级信息')
          this.isShowToolTip = true
          this.$_hideLoading()
        }
      }).catch(() => {
        this.isShowToolTip = true
        this.$_hideLoading()
      })
    }).catch(() => {
      this.isShowToolTip = true
      this.$_hideLoading()
    })
  },
  methods: {
    /**
     * 切换学年学期
     * 获取年级
     * 获取年级对应的课时数据
     */
    onChangeSchoolYear() {
      this.isModify = false
      this.formInline.schoolYearId = this.schoolYearIdFormater[this.formInline.termId].schoolYearid
      this.$_showLoading()
      this.classTimeSetList.splice(0, this.classTimeSetList.length)
      // 清空时间数据
      for (let prop in this.classTimeConfig) {
        this.$set(this.classTimeConfig, prop, null)
      }
      // 清空缓存数据
      this.gradeDataSourse = {}
      this.gradeDataCache = {}
      this.getGrade().then(() => {
        if (this.gradeList.length > 0) {
          this.formInline.gradeId = this.gradeList[0].uid
          this.getClassData().then(() => {
            this.$_hideLoading()
          })
        } else {
          // this.$message({
          //   message: '请维护年级信息',
          //   type: 'error'
          // })
          this.$_hideLoading()
          this.isShowToolTip = true
          this.showState = true
        }
      }).catch(() => {
        this.isShowToolTip = true
        this.showState = true
        this.$_hideLoading()
      })
    },
    /**
     * 根据学年设置课时数据
     */
    onConfirmClassSet () { // 无课确认设置弹框
      this.$_showLoading()
      classDataAdd({
        schoolId: this.formInline.schoolId, // 学校ID
        termId: this.formInline.termId, // 学期ID
        courseAm: this.settingData.amNum, // 上午节数
        coursePm: this.settingData.pmNum, // 下午节数
        courseWeekDay: this.settingData.days, // 每周天数
      }).then(() => {
        this.$_hideLoading()
        this.classSettingDialog = false
        this.isShowToolTip = false
        this.showState = false
        this.getClassData()
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    /**
     * 节次时间设置
     */
    onConfirmClassTimeSet () { // 节次时间设置确认弹框
      let endTime // 上一次的结束时间
      for (let i = 0; i < this.classTimeSetListFormater.length; i++) {
        if (compareTime(this.classTimeSetListFormater[i].classEndtime, this.classTimeSetListFormater[i].classStarttime) !== 1) {
          this.$message({
            message: '每节课的开始时间必须小于结束时间',
            type: 'error'
          })
          return
        }
        if (endTime && compareTime(this.classTimeSetListFormater[i].classStarttime, endTime) !== 1) {
          this.$message({
            message: '每节课开始时间必须大于上一节课的结束时间',
            type: 'error'
          })
          return
        }
        endTime = this.classTimeSetListFormater[i].classEndtime
      }
      let request = classTimeAdd
      this.classTimeSetList.length > 0 && this.classTimeSetList[0].uid && (request = classTimeUpdate)

      this.$_showLoading()
      request(this.classTimeSetListFormater).then(() => {
        this.$message.success('节次时间设置成功')
        for (let prop in this.classTimeConfig) {
          this.$set(this.classTimeConfig, prop, null)
        }
        this.classTimeSetList.splice(0, this.classTimeSetList.length)
        for (let i = 0; i < this.classTimeSetListFormater.length; i++) {
          this.$set(this.classTimeConfig, i + '_', this.classTimeSetListFormater[i])
          this.classTimeSetList.push(this.classTimeSetListFormater[i])
        }
        this.$nextTick(() => {
          this.classTimeSettingDialog = false
          this.$_hideLoading()
        })
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    setTimeFormater () {
      let list = deepCopy(this.classTimeSetList)
      this.classTimeSetListFormater.splice(0, this.classTimeSetListFormater.length)
      this.classTimeSetListFormater.push(...list)
    },
    /**
     * 打开节次时间弹框
     */
    onClassTimeSet () {
      if (this.classTimeSetList.length > 0) {
        this.setTimeFormater()
        this.$nextTick(() => {
          this.classTimeSettingDialog = true
        })
      } else {
        this.$_showLoading()
        this.getClassTime().then(() => {
          if (this.classTimeSetList.length <= 0) {
            for (let i = 0; i < this.maxSettingData.amNum + this.maxSettingData.pmNum; i++) {
              this.classTimeSetList.push({
                schoolId: this.formInline.schoolId,
                gradeId: this.formInline.gradeId,
                termId: this.formInline.termId,
                classIndex: i + 1,
                classStarttime: '00:00',
                classEndtime: '00:00',
                classTimetype: i <= this.maxSettingData.amNum ? 1 : 2
              })
            }
          }
          this.setTimeFormater()
          this.$nextTick(() => {
            this.classTimeSettingDialog = true
          })
          this.$_hideLoading()
        }).catch(() => {
          this.$_hideLoading()
        })
      }
    },
    onCancleModify () {
      for (let prop in this.gradeDataCache) {
        this.gradeDataSourse[prop] = this.gradeDataCache[prop]
      }
      this.handlerData(this.gradeDataSourse[this.formInline.gradeId])
      this.isModify = false
    },
    onClassSet () { // 无课设置弹框
      this.classSettingDialog = true
    },
    onJiajia (obj) { // 无课设置++
      if (this.settingData[obj] >= 0 && this.settingData[obj] < 7)
        this.$set(this.settingData, obj, ++this.settingData[obj])
      else if (this.settingData[obj] > 7)
        this.$set(this.settingData, obj, 7)
      else if (this.settingData[obj] < 0)
        this.$set(this.settingData, obj, 0)
    },
    onJianjian (obj) { // 无课设置--
      if (this.settingData[obj] > 0 && this.settingData[obj] <= 7)
        this.$set(this.settingData, obj, --this.settingData[obj])
      else if (this.settingData[obj] > 7)
        this.$set(this.settingData, obj, 7)
      else
        this.$set(this.settingData, obj, 0)
    },
    changeStyle ({rowIndex}) { // 上午最后一行添加类
      if (rowIndex === this.settingDataForm.amNum - 1) {
        return 'am-last-row';
      }
    },
    /**
     * 课时数据提交
     */
    courseParamSubmit () {
      this.$_showLoading()
      //gradeDataSourse原始数据 gradeDataCache接口返回数据
      let baseGradeTermCourseCountList = [] // 年级已修改课节次数据的集合
      let baseGradeNoCourseList = [] // 如果年级修改了无课设置，push该年级当前的所有无课数据

      let tempDefault // 接口默认设置的课时数据
      let temp // 修改后的课时数据
      let tempDefaultNoCourse // 接口默认设置的无课数据
      let tempNoCourse // 修改后的无课数据
      let gradeIds = [] // 删除了所有无课数据的年级id
      for (let prop in this.gradeDataSourse) {
        // 课节次数据
        tempDefault = this.gradeDataCache[prop].baseGradeTermCourseCount
        temp = this.gradeDataSourse[prop].baseGradeTermCourseCount
        if (tempDefault.courseAm != temp.courseAm || tempDefault.coursePm != temp.coursePm || tempDefault.courseWeekDay != temp.courseWeekDay) {
          baseGradeTermCourseCountList.push(temp)
          if (temp.courseAm > this.maxSettingData.amNum) {
            this.maxSettingData.amNum = temp.courseAm
          }
          if (temp.coursePm > this.maxSettingData.pmNum) {
            this.maxSettingData.pmNum = temp.coursePm
          }
        }
        // 无课数据
        tempDefaultNoCourse = this.gradeDataCache[prop].baseGradeNoCourseList
        tempNoCourse = this.gradeDataSourse[prop].baseGradeNoCourseList
        if (tempDefaultNoCourse.length !== 0 && tempNoCourse.length === 0) {
          // 该年级清空了无课数据
          gradeIds.push(parseInt(prop))
        } else if (!this.compareList(tempDefaultNoCourse, tempNoCourse)) {
          baseGradeNoCourseList.push(...tempNoCourse)
        }
      }
      classDataUpdate({
        gradeIds,
        termId: this.formInline.termId,
        schoolId: this.formInline.schoolId,
        baseGradeTermCourseCountList,
        baseGradeNoCourseList 
      }).then(res => {
        this.$_hideLoading()
        this.$message.success('课时设置数据保持成功')
        if (res && res.data) {
          this.maxSettingData.amNum = res.data.maxCourseAm
          this.maxSettingData.pmNum = res.data.maxCoursePm
        }
        // 同步缓存中的课时数据
        for (let prop in this.gradeDataSourse) {
          this.gradeDataCache[prop] = deepCopy(this.gradeDataSourse[prop])
        }
        this.isModify = false
        this.classTimeSetList.splice(0, this.classTimeSetList.length)
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    /**
     * 判断无课数据是否相同 只判断classIndex和weekDay位置是否有数据
     */
    compareList (src, dest) {
      if (src.length !== dest.length) {
        return false
      } else {
        let srcObj = {}, destObj = {}
        for (let i = 0; i < src.length; i++) {
          srcObj[src[i].classIndex + '_' + src[i].weekDay] = true
        }
        for (let j = 0; j < dest.length; j++) {
          destObj[dest[j].classIndex + '_' + dest[j].weekDay] = true
          if (!srcObj[dest[j].classIndex + '_' + dest[j].weekDay]) {
            return false
          }
        }
        return true
      }
    },
    /**
     * 切换年级
     */
    onChangeGrade (uid) {
      if (this.formInline.gradeId !== uid) {
        this.formInline.gradeId = uid
        this.getClassData(true)
      }
    },
    /**
     * 无课设置
     */
    onChangeClassState (classIndex, weekDay) {
      if (!this.isModify) {
        return
      }
      if (this.settingDataForm.noCourseData[classIndex + '_' + weekDay]) {
        this.syncData(classIndex, weekDay)
        this.$set(this.settingDataForm.noCourseData, classIndex + '_' + weekDay, null)
      } else {
        this.syncData(classIndex, weekDay, true)
        this.$set(this.settingDataForm.noCourseData, classIndex + '_' + weekDay, {
          classIndex: classIndex,
          dayTime: classIndex <= this.settingDataForm.amNum ? 1: 2,
          gradeId: this.formInline.gradeId,
          schoolId: this.formInline.schoolId,
          termId: this.formInline.termId,
          weekDay: weekDay
        })
      }
    },
    /**
     * 同步年级无课数据
     * f 删除/新增无课
     * classIndex课节次
     * weekDay周几
     */
    syncData (classIndex, weekDay, f) {
      if (f) {
        this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.push({
          classIndex: classIndex,
          dayTime: classIndex <= this.settingDataForm.amNum ? 1: 2,
          gradeId: this.formInline.gradeId,
          schoolId: this.formInline.schoolId,
          termId: this.formInline.termId,
          weekDay: weekDay
        })
      } else {
        for (let i = 0; i < this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length; i++) {
          if (this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i].classIndex === classIndex && this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i].weekDay === weekDay) {
            this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.splice(i, 1)
            break
          }
        }
      }
      
    },
    /**
     * 下午节数设置
     */
    onChangeClassTotalPm (num) {
      this.gradeDataSourse[this.formInline.gradeId].baseGradeTermCourseCount.coursePm = num
      let lastPmNum = this.tableData.length - this.settingDataForm.amNum // 之前的下午课节数
      for (let prop in this.settingDataForm.noCourseData) {
        this.$set(this.settingDataForm.noCourseData, prop, null)
      }
      let tempObj
      if (lastPmNum > num) {
        // 下午课节数减少
        for (let i = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length - 1; i >= 0; i--) {
          tempObj = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i]
          if (tempObj.classIndex > this.settingDataForm.amNum + num) {
            this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.splice(i, 1)
          }
        }
        // 表格删除数据
        this.tableData.splice(this.settingDataForm.amNum + num, lastPmNum - num)
      } else {
        // 下午课节数增加
        // 表格新增数据
        for (let i = this.tableData.length; i < this.settingDataForm.amNum + num; i++) {
          this.tableData.push({
            type: this.type[i]
          })
        }
      }
      for (let j = 0; j < this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length; j++) {
        tempObj = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[j]
        this.$set(this.settingDataForm.noCourseData, tempObj.classIndex + '_' + tempObj.weekDay, this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[j])
      }
    },
    /**
     * 上午节数设置
     */
    onChangeClassTotalAm (num) {
      this.gradeDataSourse[this.formInline.gradeId].baseGradeTermCourseCount.courseAm = num
      let lastAmNum = this.tableData.length - this.settingDataForm.pmNum // 之前的上午课节数
      for (let prop in this.settingDataForm.noCourseData) {
        this.$set(this.settingDataForm.noCourseData, prop, null)
      }
      let tempObj
      if (this.tableData.length > this.settingDataForm.pmNum + num) {
        // 上午课节数减少
        for (let i = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length - 1; i >= 0; i--) {
          tempObj = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i]
          if (tempObj.classIndex > num && tempObj.classIndex <= lastAmNum) {
            this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.splice(i, 1)
          } else if (tempObj.classIndex > lastAmNum) {
            tempObj.classIndex = tempObj.classIndex - (lastAmNum - num)
          }
        }
        
        // 表格数据删除多余的数据
        this.tableData.splice(this.settingDataForm.pmNum + num, this.tableData.length - (this.settingDataForm.pmNum + num))
      } else {
        // 上午课节数增加
        for (let i = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length - 1; i >= 0; i--) {
          tempObj = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i]
          if (tempObj.classIndex > lastAmNum) {
            tempObj.classIndex = tempObj.classIndex + (num - lastAmNum)
          }
        }
        // 表格新增数据
        for (let i = this.tableData.length; i < this.settingDataForm.pmNum + num; i++) {
          this.tableData.push({
            type: this.type[i]
          })
        }
      }
      for (let j = 0; j < this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length; j++) {
        tempObj = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[j]
        this.$set(this.settingDataForm.noCourseData, tempObj.classIndex + '_' + tempObj.weekDay, this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[j])
      }
    },
    /**
     * 每周上课天数设置
     */
    onChangeClassDays (num) {
      this.gradeDataSourse[this.formInline.gradeId].baseGradeTermCourseCount.courseWeekDay = num
      this.settingDataForm.days = num
      for (let i = this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.length - 1; i >= 0; i--) {
        if (this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i].weekDay > num) {
          this.$set(this.settingDataForm.noCourseData,
            this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i].classIndex + '_' + this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList[i].weekDay,
            null
          )
          this.gradeDataSourse[this.formInline.gradeId].baseGradeNoCourseList.splice(i, 1)
        }
      }
    },
    handlerData (data) {
      this.maxSettingData.amNum = data.maxCourseParamDto.maxCourseAm
      this.maxSettingData.pmNum = data.maxCourseParamDto.maxCoursePm

      this.settingDataForm.amNum = data.baseGradeTermCourseCount.courseAm
      this.settingDataForm.pmNum = data.baseGradeTermCourseCount.coursePm
      this.settingDataForm.days = data.baseGradeTermCourseCount.courseWeekDay
      for (let prop in this.settingDataForm.noCourseData) {
        this.$set(this.settingDataForm.noCourseData, prop, null)
      }
      this.tableData.splice(0, this.tableData.length)
      for (let i = 0; i < data.baseGradeNoCourseList.length; i++) {
        this.$set(this.settingDataForm.noCourseData, data.baseGradeNoCourseList[i].classIndex + '_' + data.baseGradeNoCourseList[i].weekDay, data.baseGradeNoCourseList[i])
      }
      for (let j = 0; j < this.settingDataForm.amNum + this.settingDataForm.pmNum; j++) {
        this.tableData.push({ type: this.type[j] })
      }
    },
    /**
     * 通过学校、学期、年级获取课时数据
     */
    getClassData (isExchangeGrade) {
      this.loading = true
      this.isShowToolTip = false
      if (this.gradeDataSourse[this.formInline.gradeId]) {
        // 缓存中存在该年级的课时数据
        return new Promise(resolve => {
          this.loading = false
          this.handlerData(this.gradeDataSourse[this.formInline.gradeId])
          resolve()
        })
      } else {
        return getClassDataList({
          termId: this.formInline.termId, // 学期ID
          gradeId: this.formInline.gradeId, // 年级ID
        }).then(res => {
          if (!res.data.baseGradeTermCourseCount) {
            // 该年级无课时数据
            // 切换年级 没有课时数据 该年级是新增的年级 发请求设置默认的课时数据
            if (isExchangeGrade) {
              // 新增年级设置默认课节数
              gradeInit({
                schoolId: this.formInline.schoolId,
                termId: this.formInline.termId,
                gradeId: this.formInline.gradeId,
              }).then(response => {
                this.gradeDataSourse[this.formInline.gradeId] = deepCopy(response.data)
                this.gradeDataCache[this.formInline.gradeId] = deepCopy(response.data)
                this.handlerData(response.data)
                this.$nextTick(() => {
                  this.loading = false
                })
              }).catch(() => {
                this.$message.error('设置年级默认无课设置失败')
                this.loading = false
              })
            } else {
              // 无课时数据
              this.isShowToolTip = true
              this.$nextTick(() => {
                this.loading = false
              })
            }
          } else {
            this.gradeDataSourse[this.formInline.gradeId] = deepCopy(res.data)
            this.gradeDataCache[this.formInline.gradeId] = deepCopy(res.data)
            this.handlerData(res.data)
            this.$nextTick(() => {
              this.loading = false
            })
          }
        }).catch(error => {
          console.log(error, '获取课时数据错误')
          this.loading = false
          this.$_hideLoading()
        })
      }
    },
    /**
     * 通过学年和学校获取当前年级
     */
    getGrade() {
      this.gradeList.splice(0, this.gradeList.length)
      return getSubClassList(this.formInline).then(res => {
        if (res.data && res.data.length > 0) {
          this.gradeList.push(...res.data)
        }
      })
    },
    /**
     * 初始化学年学期信息
     */
    getSchoolYear () {
      return new Promise((resolve, reject) => {
        getYearTermList({
          schoolId: this.formInline.schoolId
        }).then(res => {
          if (res.data && res.data.length > 0) {
            console.log(res.data)
            this.schoolYearTermList.push(...res.data)
            let hasCurrentYear = false
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isSelected) {
                this.formInline.termId = res.data[i].uid
                this.formInline.schoolYearId = res.data[i].schoolYearid
                hasCurrentYear = true
                break
              }
            }
            if (!hasCurrentYear) {
              this.formInline.termId = res.data[0].uid
              this.formInline.schoolYearId = res.data[0].schoolYearid
            }
            resolve()
          } else {
            this.$message.error('请维护该学校的学年学期信息')
            reject('请维护该学校的学年学期信息')
          }
          // this.$_hideLoading()
        }).catch(() => {
          reject(null)
          this.$_hideLoading()
        })
      })
    },
    /**
     * 根据学期获取节次时间
     */
    getClassTime () {
      this.classTimeSetList.splice(0, this.classTimeSetList.length)
      this.classTimeConfig = {}
      for (let prop in this.classTimeConfig) {
        this.$set(this.classTimeConfig, prop, null)
      }
      return getClassTimeList({
        termId: this.formInline.termId
      }).then(res => {
        if (res.data && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(this.classTimeConfig, i + '_', res.data[i])
            this.classTimeSetList.push(res.data[i])
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variable.scss';
.class-data {
  height: 100%;
  // overflow: auto;
  .tooltip {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: $class-data-color1;
    padding-left: 15px;
    margin-bottom: 8px;
    > i, span {
      color: $class-data-color2;
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .class-data-content {
    height: calc(100% - 58px);
    padding: 0 0 14px 20px;
    .demo-form-inline {
      .el-select {
        width: 210px;
      }
    }
    .no-class-data {
      height: calc(100% - 52px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 8%;
      .no-class-img {
        width: 100px; height: 100px;
        background: url('../../../../assets/img/no-class-data.png') no-repeat;
      }
      .no-class-text {
        color: $class-data-color3;
        font-size: 14px;
        padding-top: 25px;
      }
      .no-class-btn {
        width: 110px; height: 40px;
        line-height: 40px;
        margin-top: 25px;
        text-align: center;
        background: $class-data-color4;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .has-class-data {
      height: calc(100% - 52px);
      display: flex;
      .left {
        width: 210px;
        border: 1px solid $class-data-color11;
        .title {
          width: 190px;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid $class-data-color11;
          margin: 0 auto;
          color: $color-font1;
          font-size: 14px;
          font-weight: 600;
          padding-left: 5px;
        }
        ul {
          height: calc(100% - 51px);
          li {
            padding: 12px 0 12px 28px;
            cursor: pointer;
          }
          li:hover, li.active {
            color: $class-data-color5;
          }
        }
      }
      .right {
        margin-left: 20px;
        width: calc(100% - 230px);
        // height: calc(100% - 120px);
        height: 100%;
        padding-right: 20px;
        .right-top-operate {
          border-bottom: 1px solid $class-data-color11;
          padding-left: 15px;
          .tooltip-hasclass {
            width: 100%;
            height: 32px;
            line-height: 32px;
            // background: $class-data-color1;
            padding-left: 15px;
            border-radius: 4px;
            margin-top: 2px;
            > i, span {
              color: $class-data-color2;
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .save-btn {
            display: inline-block;
            width: 70px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: $class-data-color12;
            border-radius: 4px;
            color: #fff;
            margin: 0 auto;
            margin-top: 2px;
            cursor: pointer;
          }
          .save-btn-cancle {
            display: inline-block;
            width: 70px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            // background: $class-data-color12;
            border-radius: 4px;
            color: $color-font2;
            border: 1px solid $class-data-color11;
            border-radius: 4px;
            margin: 0 auto;
            margin-top: 2px;
            margin-left: 10px;
            cursor: pointer;
          }
          .el-form-item {
            margin-right: 15px;
          }
          .el-select {
            width: 90px;
          }
          .noclass {
            display: inline-block;
            width: 90px;
            color: $color-font1;
          } 
        }
        .table-box {
          height: 100%;
          .title {
            width: 100%;;
            color: $color-font3;
            font-size: 16px;
            font-weight: 600;
            height: 50px;
            line-height: 50px;
            text-align: center;
          }
          .save-btn {
            width: 70px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: $class-data-color6;
            border-radius: 4px;
            color: #fff;
            margin: 30px auto 0;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/assets/css/_variable.scss';
.class-data {
  .el-input__icon {line-height: 10px;}
  .el-input__inner {padding-right: 15px;}
}
// 无数据课时设置
.no-class-data-setting {
  .dialog-tooltip {
    width: 100%;
    height: 40px;
    line-height: 40px;
    // background: $class-data-color1;
    margin-bottom: 18px;
    > i, span {
      color: $class-data-color2;
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .dialog-flex {
    display: flex;
  }
  .linee {
    width: 30%;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    margin-right: 25px;
    span {
      display: inline-block;
      width: 110px;
    }
    .el-input {
      position: relative;
      width: 100px;
      .el-input-group__append {
        padding: 0;
      }
      .operate {
        width: 20px;height: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        i {
          width: 20px; height: 15px;
          line-height: 15px;
          text-align: center;
          font-size: 8px;
          cursor: pointer;
          &:first-child {
            border-bottom: 1px solid $class-data-color11;
          }
        }
      }
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
  .n-line-active { margin-right: 0; }
}
.right-top-operate {
  .el-form-item__label {
    color: $color-font1;
    font-size: 14px;
    font-weight: 400;
  }
  .right-fr {
    float: right;
    > div {
      width: 125px;
      height: 32px;
      border: 1px solid $class-data-color6;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      color: $class-data-color6;
      cursor: pointer;
    }
  }
}
.table-class-show {
  border-width: 1px 1px 0; 
  border-style: solid;
  border-color: $table-color8;
  background-color: $class-data-color7;
  .bttime {
    font-size: 12px;
  }
  .el-table__header {
    tr {
      th {
        background-color: $class-data-color7;
        border: none;
        font-size: 14px;
        color: $color-font2;
        font-weight: 400;
      }
    }
  }
  .el-table__body {
    td {
      .cell {
        width: 100%;height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 100%;
          height: 62px;
          position: absolute;
          left: 0;
          top: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:not(.isNotModify):hover {
            box-shadow: 0px 1px 9px 3px $class-data-color8;
            background: $class-data-color13;
          }
        }
      }
    }
    tr {
      height: 70px;
      td {
        border: none;
        height: 60px;
      }
      td:nth-child(1) {
        background-color: $class-data-color7;
      }
      td:not(:nth-child(1)) {
        background-color: #fff;
        border-bottom: 3px solid $class-data-color7;
        border-right: 3px solid $class-data-color7;
        border-top: 1px solid $class-data-color11;
        border-left: 1px solid $class-data-color11;
        cursor: pointer;
      }
    }
    .am-last-row {
      height: 80px;
      td:not(:nth-child(1)) {
        border-bottom: 10px solid $class-data-color14;
      }
    }
  }
}
// 节次时间设置
.class-time-setting {
  .class-text {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: $color-font1;
    font-size: 14px;
  }
  .class-total {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;
    .title {
      width: 72px; height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius:8px 8px 4px 4px;
      background: $class-data-color9;
      font-size: 14px;
      color: $color-font3;
    }
    .el-input {
      width: 94px;
      position: relative;
      .el-input-group__append {
        padding: 0;
      }
      .operate {
        width: 20px;height: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        i {
          width: 20px; height: 15px;
          line-height: 15px;
          text-align: center;
          font-size: 8px;
          cursor: pointer;
          &:first-child {
            border-bottom: 1px solid $class-data-color11;
          }
        }
      }
      .el-input__inner {height: 32px;}
    }
  }
}
.class-data-content {
  .__view {
    width: 100% !important;
  }
}
.demo-form-inline {
  .right-fr {
    width: calc(100% - 240px);
    .el-form-item__content {
      width: 100%;
      // display: flex;
    }
    .time-set {
      width: 125px;
      height: 32px;
      display: inline-block;
      border: 1px solid $class-data-color12;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      color: $class-data-color12;
      margin-top: 2px;
      margin-right: 10px;
      margin-left: 5px;
      cursor: pointer;
    }
    .xiugai {
      width: 120px;
      margin-left: 10px;
      .icon-jingshi {
        font-size: 14px;
        color: #fff;
        margin-left: 3px;
      }
    }
  }
  .save-btn {
    display: inline-block;
    width: 70px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: $class-data-color12;
    border-radius: 4px;
    color: #fff;
    // margin: 0 auto;
    margin-top: 2px;
    margin-right: 15px;
    cursor: pointer;
  }
  .save-btn-cancle {
    display: inline-block;
    width: 70px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    // background: $class-data-color12;
    border-radius: 4px;
    color: $color-font2;
    border: 1px solid $class-data-color11;
    border-radius: 4px;
    margin: 0 auto;
    margin-top: 2px;
    cursor: pointer;
  }
}
.classdata-tip {
  // background: rgba(0, 0, 0, 0.53) !important;
  .el-tooltip__popper .popper__arrow::after {
    // border-color: rgba(0, 0, 0, 0.53) !important;
  }
}
</style>
