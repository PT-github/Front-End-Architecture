<template>
  <div class="course-list">
    <s-title :title="'排课管理'"></s-title>
    <div class="course-list-content">
      <div class="course-content_top">
        <el-checkbox-group class="fl" v-model="checkList">
          <el-checkbox v-for="(item, index) in stageTyps" :key="'check_' + index" :label="item.enumValue">{{item.enumField}}</el-checkbox>
        </el-checkbox-group>
        <div class="fr">
          <el-button size="small" @click="arrangeFun">排课</el-button>
          <el-button size="small" class="pubBtn" type="primary" @click="publishCourseList">发布课表</el-button>
          <a v-if="previewHref" :href="previewHref" target="_blank" class="previewBtn">预览课表</a>
          
          <div class="showTips" :class="{active: showTips}">请勾选要排课的年级（可多选）</div>
          <div class="showTips showPubTips" :class="{active: showPubTips}">请勾选要发布课表的年级（可多选）</div>
        </div>
      </div>
      <el-table ref="tableComp" v-loading="loading" :data="filterTableData" class="table-comp mytable-comp" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" label="学段" width="100">
          <template slot-scope="scope">
            {{ scope.row.stageType ? dicFormater('SYS_BASE_STAGE_TYPE', scope.row.stageType): '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gradeFullName" label="年级" width="100"></el-table-column>
        <el-table-column align="center" label="基础数据完整度" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.fullType.indexOf('11111') === 0 && scope.row.fullType[scope.row.fullType.length - 1] === '1'">
              完整<span class="look" @click="showBaseInfo(scope.row.fullType, scope.row)">查看</span>
            </template>
            <template v-else>
              <span class="uncomplete">不完整</span><span class="look" @click="showBaseInfo(scope.row.fullType, scope.row)">查看</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排课进度" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.isCourse">已排完</template>
            <template v-else-if="scope.row.isCourse === false">未排完</template>
            <template v-else>
              <template v-if="scope.row.fullType.indexOf('11111') === 0 && scope.row.fullType[scope.row.fullType.length - 1] === '1'">
                未排
              </template>
              <template v-else>-</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布状态" width="130">
          <template slot-scope="scope">
            <template v-if="!scope.row.isCourse">-</template>
            <template v-else-if="scope.row.isPublish === 1 || scope.row.isPublish === 2">发布</template>
            <template v-else-if="scope.row.isPublish === 3">未发布</template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最近更新时间|操作用户">
          <template slot-scope="scope">
            <template v-if="scope.row.addTime && scope.row.updateTime && scope.row.addTime === scope.row.updateTime">
              <span>-</span>
            </template>
            <template v-else>
              {{ scope.row.updateTime | moment }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ scope.row.updateUser }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.fullType.indexOf('11111') === 0 && scope.row.fullType[scope.row.fullType.length - 1] === '1'">
              <template v-if="!scope.row.isCourse && scope.row.isPublish !== 2 && scope.row.isPublish !== 1">
                <span class="opera" @click="arrange(scope.row)">排课</span>
              </template>
              <template v-else>
                <template v-if="scope.row.isPublish === 2">
                  <el-tooltip class="item" effect="dark" popper-class="course-list-tooltip" placement="top-end">
                    <div slot="content">该课表发布已超过开学两周<br/>时间，不能修改！</div>
                    <span class="opera prevent">修改课表</span>
                  </el-tooltip>
                </template>
                <template v-else>
                  <span class="opera" @click="modifyCourseList(scope.row)">修改课表</span>
                </template>
                <span class="opera" @click="previewCourseTable(scope.row)">预览课表</span>
              </template>
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="no-data-tips" v-show="noDataFlag">
        <div class="no-data-tips_content">
          <img src="../../../../assets/img/no-data.png" alt="">
          <p class="txt" v-if="!hasCurrentYearTerm">请在<router-link :to="{ path: '/basic/term-info' }">基础数据-学年学期</router-link>中创建学年和学期</p>
          <p class="txt" v-else>请在<router-link :to="{ path: '/basic/grade-info' }">基础数据-年级班级</router-link>中创建年级和班级</p>
        </div>
      </div>
      <!-- <div class="pagination-comp clearfix">
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
      </div> -->
      <!-- <div class="course-list-submit">
        <el-button type="primary" size="small" @click="goCourseRulePage">排课</el-button>
        <el-button size="small">发布课表</el-button>
        <el-button size="small">查看课表</el-button>
      </div> -->
    </div>
    <el-dialog class="dialog-comp" title="查看" width="400px" :visible.sync="lookDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="dialog-tooltip">
        <i class="el-icon-warning"></i>
        <span>完善有异常的基础信息才能开始排课</span>
      </div>
      <div class="dialog-center">
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[0] === '0', 'el-icon-circle-check':fullTypeObj[0] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/term-info'}">学年学期</router-link></div>
          <div class="right" :class="{'no-data': fullTypeObj[0] === '0'}"><span class="tips">{{ fullTypeObj[0] === '0' ? '无数据' : '正常' }}</span></div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[1] === '0', 'el-icon-circle-check':fullTypeObj[1] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/teacher-info'}">教师信息</router-link></div>
          <div class="right" :class="{'no-data': fullTypeObj[1] === '0'}"><span class="tips">{{ fullTypeObj[1] === '0' ? '无数据' : '正常' }}</span></div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[2] === '0', 'el-icon-circle-check':fullTypeObj[2] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/grade-info'}">年级班级</router-link></div>
          <div class="right" :class="{'no-data': fullTypeObj[2] === '0'}"><span class="tips">{{ fullTypeObj[2] === '0' ? '无数据' : '正常' }}</span></div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[3] === '0', 'el-icon-circle-check':fullTypeObj[3] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/class-data'}">课时设置</router-link></div>
          <div class="right" :class="{'no-data': fullTypeObj[3] === '0'}"><span class="tips">{{ fullTypeObj[3] === '0' ? '无数据' : '正常' }}</span></div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[4] === '0', 'el-icon-warning':fullTypeObj[4] === '2', 'el-icon-circle-check':fullTypeObj[4] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/subject-info'}">科目信息</router-link></div>
          <div class="right" :class="{'no-data': fullTypeObj[4] === '0', 'un-completed': fullTypeObj[4] === '2'}">
            <span class="tips">
              <template v-if="fullTypeObj[4] === '0'">无数据</template>
              <template v-else-if="fullTypeObj[4] === '1'">正常</template>
              <template v-else>不正常</template>
            </span>
          </div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-warning':fullTypeObj[5] === '0', 'el-icon-circle-check':fullTypeObj[5] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/basic/venue-info'}">场地信息</router-link></div>
          <div class="right" :class="{'un-completed': fullTypeObj[5] === '0'}">
            <span class="tips">{{ fullTypeObj[5] === '0' ? '无数据，可跳过' : '正常' }}</span>
          </div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-warning':fullTypeObj[6] === '0', 'el-icon-circle-check':fullTypeObj[6] === '1'}"></i></div>
          <div class="center">基础数据－<router-link :to="{path: '/teaching-plan/teaching-group-info'}">教研组信息</router-link></div>
          <div class="right" :class="{'un-completed': fullTypeObj[6] === '0'}"><span class="tips">{{ fullTypeObj[6] === '0' ? '无数据，可跳过' : '正常' }}</span></div>
        </div>
        <div class="dialog-center_item">
          <div class="left"><i :class="{'el-icon-circle-close':fullTypeObj[7] === '0' || fullTypeObj[7] === '2', 'el-icon-circle-check':fullTypeObj[7] === '1'}"></i></div>
          <div class="center">
            基础数据－
            <template v-if="fullTypeObj[7] === '1'">
              <router-link :to="{path: '/teaching-plan/teaching-division'}">教学分工</router-link>
            </template>
            <template v-else>
              <!-- <router-link :to="{path: '/teaching-plan/teaching-division'}">教学分工</router-link> -->
              <a href="javascript:;" @click="getClassId">教学分工</a>
            </template>
          </div>
          <div class="right" :class="{'no-data': fullTypeObj[7] === '2' || fullTypeObj[7] === '0'}">
            <span class="tips">
              <template v-if="fullTypeObj[7] === '0'">无数据</template>
              <template v-else-if="fullTypeObj[7] === '1'">正常</template>
              <template v-else>不完整</template>
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="dialog-comp" title="修改确认" width="360px" :visible.sync="confirmModifyDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>确认要修改课表吗？
      </div>
      <div class="confirm-center">
        点击进入后该课表将变为未发布状态并且有可能丢失部分数据
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyConfirm">确 定</el-button>
        <el-button @click="confirmModifyDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="发布课表确认" width="360px" :visible.sync="confirmPublishDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>确认是否发布？
      </div>
      <div class="confirm-center">
        {{publishTipsContent}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publicConfirm">确 定</el-button>
        <el-button @click="confirmPublishDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-comp" title="排课确认" width="360px" :visible.sync="confirmArrangeDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="confirm-top">
        <i class="iconfont icon-zanwushuju"></i>保留预排设置继续排课吗？
      </div>
      <div class="confirm-center">
        各年级排课进度不一致
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmArrange">确 定</el-button>
        <el-button @click="confirmArrangeDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// updCourseStatus, 
import { getClassIdInDivisions, getYear, courseListApi, publishCourses, selectEmptyCourses } from '../../store/api'
import envConfig from "@/config"; // base请求地址
export default {
  name: 'CourseList',
  data () {
    return {
      publishTipsContent: '',
      noDataFlag: false, // 无数据标志
      hasCurrentYearTerm: false, // 是否有当前学年学期
      // 该学校所拥有的学段 小学 初中 高中
      hasStageTyps: [],
      // 查询条件 选中的学段
      checkList: [],
      // 表格高度
      tableHeight: 'calc(100% - 74px)',
      loading: false,
      // 表格初始列表
      tableData: [],
      // 表格过滤的列表
      filterTableData: [],
      params: {}, // 点击排课跳转时的参数
      showTips: false, // 未勾选项目点击排课错误提示控制
      showPubTips: false, // 未勾选项目点击发布错误提示控制
      pubParams: {}, // 发布课表的入参
      modifyParams: {}, // 修改课表的入参
      
      timer: null, // 时间控制器
      multipleSelection: [],
      disabled: false,
      currentPage: 2,
      formInline: {},
      lookDialog: false, // 查看弹出层控制
      confirmModifyDialog: false, // 修改confirm弹出层控制
      confirmPublishDialog: false, // 发布confirm弹出层控制
      confirmArrangeDialog: false, // 排课confirm弹出层控制
      fullTypeObj: [ '0', '1', '1', '1', '2', '0', '0', '2' ],
      previewHref: '',
      lookDialogData: null
    }
  },
  computed: {
    schoolInfo () {
      return this.$store.state.user.currentSchool
    },
    stageTyps () {
      let arry = this.dicFormater('SYS_BASE_STAGE_TYPE')
      for (let i = arry.length - 1; i >= 0; i--) {
        if (this.hasStageTyps.indexOf(parseInt(arry[i].enumValue)) !== -1) {
          continue
        } else {
          arry.splice(i, 1)
        }
      }
      return arry
    }
  },
  watch: {
    checkList () {
      this.filterTableDataFun()
    }
  },
  mounted () {
    if (this.schoolInfo && this.schoolInfo.stageTypes && this.schoolInfo.stageTypes.length > 0) {
      this.hasStageTyps.push(...this.schoolInfo.stageTypes)
    }
    this.getCourseList()
  },
  methods: {
    getClassId () {
      console.log(this.lookDialogData)
      this.$_showLoading()
      let params = {
        schoolId: this.lookDialogData.schoolId,
        gradeId: this.lookDialogData.gradeId,
        termId: this.lookDialogData.termId
      }
      getClassIdInDivisions(params).then((res) => {
        this.$_hideLoading()
        this.$router.push({
          path: '/teaching-plan/teaching-division',
          query: {
            classId: res.data,
            gradeId: this.lookDialogData.gradeId
          }
        })
      }).catch(() => {
        this.$_hideLoading()
      })
    },
    /**通过学校获取当前学年 */
    getCurrentYear () {
      this.hasCurrentYearTerm = false
      getYear({
        schoolId: this.schoolInfo.uid
      }).then(res => {
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].isDefault) {
              this.hasCurrentYearTerm = true
              break
            }
          }
        }
        this.$nextTick(() => {
          this.noDataFlag = true
          this.$nextTick(() => {
            this.loading = false
          })
        })
      })
    },
    /**通过学年学期列表 */
    previewCourseTable (row) {
      let url = envConfig.ADDPREFIX + '/course/preview-course?schoolId=' + this.schoolInfo.uid + '&gradeIds=' + row.gradeId + '&termId=' + row.termId
      window.open(url, '_blank')
    },
    /**排课列表 */
    getCourseList () {
      this.noDataFlag = false
      this.loading = true
      this.tableData.splice(0, this.tableData.length)
      this.filterTableData.splice(0, this.filterTableData.length)
      
      courseListApi(this.schoolInfo.uid).then((res) => {
        this.tableData.splice(0, this.tableData.length)
        if (res.data && res.data.length > 0) {
          this.tableData.push(...res.data)
          this.filterTableData.push(...res.data)
          this.noDataFlag = false
          let gradeIds = [], termId = ''
          for (let i = 0; i < res.data.length; i++) {
            gradeIds.push(res.data[i].gradeId)
            i === 0 && (termId = res.data[i].termId)
          }
          this.previewHref = envConfig.ADDPREFIX + '/course/preview-total-syllabus?schoolId=' + this.schoolInfo.uid + '&gradeIds=' + gradeIds.join(',') + '&termId=' + termId
          this.$nextTick(() => {
            this.loading = false
          })
        } else {
          this.getCurrentYear()
        }
        this.filterTableDataFun()
      }).catch(() => {
        this.loading = false
      })
    },
    /**根据过滤条件 过滤列表数据 */
    filterTableDataFun () {
      // this.multipleSelection.splice(0, this.multipleSelection.length)
      for (let i = 0; i < this.filterTableData.length; i++) {
        if (this.checkList.indexOf(this.filterTableData[i].stageType + '') !== -1) {
          // this.multipleSelection.push(this.filterTableData[i])
          this.$refs['tableComp'].toggleRowSelection(this.filterTableData[i], true)
        } else {
          this.$refs['tableComp'].toggleRowSelection(this.filterTableData[i], false)
        }
      }
    },
    /**
     * fullType 由8个数字组成（0代表完整，1代表无数据，2代表不完整）
     */
    showBaseInfo (fullType, row) {
      this.lookDialogData = row
      console.log(fullType, row)
      for (let i = 0; i < fullType.length; i++) {
        this.$set(this.fullTypeObj, i, fullType[i])
      }
      this.$nextTick(() => {
        this.lookDialog = true
      })
    },
    arrange (data) {
      // , isPublish
      // let f = true, fullType = '', isCourse
      let gradeIdList = [], termId, schoolId = this.schoolInfo.uid, schoolYearId, stageType = [], jumpIndex = 1
      // let courseStatusObj = {
      //   v1: false, // 已排完
      //   v2: false, // 未排完
      //   v3: false, // 未排
      //   v4: false // 已发布（但是可继续排课）
      // }
      gradeIdList.push(data.gradeId)
      termId = data.termId
      schoolYearId = data.schoolYearId
      jumpIndex = data.jumpIndex
      // fullType = data.fullType
      // isPublish = data.isPublish
      // isCourse = data.isCourse
      data.stageType && stageType.indexOf(data.stageType) === -1 && stageType.push(data.stageType)
      // if (isCourse) {
      //   // 已排完
      //   courseStatusObj.v1 = true
      // } else if (isCourse === false) {
      //   // 未排完
      //   courseStatusObj.v2 = true
      // } else if (fullType.indexOf('1111') === 0 && fullType[fullType.length - 1] === '1') {
      //   // 未排
      //   courseStatusObj.v3 = true
      // }
      this.$set(this.params, 'gradeIds', gradeIdList.join(','))
      this.$set(this.params, 'termId', termId)
      this.$set(this.params, 'schoolId', schoolId)
      this.$set(this.params, 'schoolYearId', schoolYearId)
      this.$set(this.params, 'stageType', stageType.join(','))
      this.$set(this.params, 'isCourse', data.isCourse)
      if (jumpIndex === 1) {
        // 跳转到预排界面
        this.$router.push({
          name: 'CoursePreArrange',
          query: this.params
        })
      } else {
        this.$router.push({
          name: 'CourseHandArrange',
          query: this.params
        })
      }
      // if (f) {
      //   // 1 都是未排/未排完/已排完 直接跳转 不给提示
      //   if (courseStatusObj.v1 && !courseStatusObj.v2 && !courseStatusObj.v3) {
      //     // 跳转到手动调课
      //     this.$router.push({
      //       name: 'CourseHandArrange',
      //       query: this.params
      //     })
      //   } else if ((!courseStatusObj.v1 && ((courseStatusObj.v2 && !courseStatusObj.v3) || (!courseStatusObj.v2 && courseStatusObj.v3)))) {
      //     // 跳转到预排界面
      //     this.$router.push({
      //       name: 'CoursePreArrange',
      //       query: this.params
      //     })
      //   } else {
      //     // this.confirmMessage = '各年级排课进度不一致，保留预排设置继续排课？'
      //     this.confirmArrangeDialog = true
      //     // 确定之后跳转到预排界面
      //   }
      // }
    },
    /**选择年级进行排课 */
    arrangeFun () {
      if (this.multipleSelection.length === 0) {
        this.showTips = true
        this.showPubTips = false
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showTips = false
          clearTimeout(this.timer)
          this.timer = null
        }, 2000)
      } else {
        // let f = true, isCourse
        let fullType = '', isCourse = false, isPublish = 0, gradeIdList = [], termId, schoolId = this.schoolInfo.uid, schoolYearId, stageType = [], jumpIndex, isEqual = true
        // let courseStatusObj = {
        //   v1: false, // 已排完
        //   v2: false, // 未排完
        //   v3: false, // 未排
        //   v4: false // 已发布（但是可继续排课）
        // }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (i == 0) {
            jumpIndex = this.multipleSelection[i].jumpIndex
          } else {
            if (jumpIndex !== this.multipleSelection[i].jumpIndex) {
              // jumpIndex不同
              isEqual = false
            }
          }
          gradeIdList.push(this.multipleSelection[i].gradeId)
          termId = this.multipleSelection[i].termId
          schoolYearId = this.multipleSelection[i].schoolYearId
          fullType = this.multipleSelection[i].fullType
          if (this.multipleSelection[i].isPublish === 1) {
            isPublish = 1
          }
          if (this.multipleSelection[i].isCourse) {
            isCourse = true
          }
          this.multipleSelection[i].stageType && stageType.indexOf(this.multipleSelection[i].stageType) === -1 && stageType.push(this.multipleSelection[i].stageType)
          if (this.multipleSelection[i].isPublish === 2 || fullType.indexOf('11111') !== 0 || fullType[fullType.length - 1] !== '1') {
            this.$message.error('您勾选的年级选项中有基础数据不完整或已发布课表')
            return
          }
          // if (isPublish === 1) {
          //   courseStatusObj.v4 = true
          // }
          // if (isCourse) {
          //   // 已排完
          //   courseStatusObj.v1 = true
          // } else if (isCourse === false) {
          //   // 未排完
          //   courseStatusObj.v2 = true
          // } else if (fullType.indexOf('1111') === 0 && fullType[fullType.length - 1] === '1') {
          //   // 未排
          //   courseStatusObj.v3 = true
          // }
        }
        this.$set(this.params, 'gradeIds', gradeIdList.join(','))
        this.$set(this.params, 'termId', termId)
        this.$set(this.params, 'schoolId', schoolId)
        this.$set(this.params, 'schoolYearId', schoolYearId)
        this.$set(this.params, 'stageType', stageType.join(','))
        this.$set(this.params, 'isCourse', isCourse)
        this.$set(this.params, 'isPublish', isPublish)
        if (isEqual) {
          if (jumpIndex === 1) {
            this.$router.push({
              name: 'CoursePreArrange',
              query: this.params
            })
          } else {
            this.$router.push({
              name: 'CourseHandArrange',
              query: this.params
            })
          }
          // // 1 非未排/非未排完/已排完 直接跳转 不给提示
          // if (courseStatusObj.v1 && !courseStatusObj.v2 && !courseStatusObj.v3) {
          //   // 跳转到手动调课
          //   this.$router.push({
          //     name: 'CourseHandArrange',
          //     query: this.params
          //   })
          // } else if ((!courseStatusObj.v1 && ((courseStatusObj.v2 && !courseStatusObj.v3) || (!courseStatusObj.v2 && courseStatusObj.v3)))) {
          //   // 跳转到预排界面
          //   this.$router.push({
          //     name: 'CoursePreArrange',
          //     query: this.params
          //   })
          // } else {
          //   // this.confirmMessage = '各年级排课进度不一致，保留预排设置继续排课？'
          //   this.confirmArrangeDialog = true
          //   // 确定之后跳转到预排界面
          // }
        } else {
          // this.$message.error('您勾选的年级选项中有基础数据不完整或已发布课表')
          this.confirmArrangeDialog = true
        }
      }
    },
    /**确定 跳转到预排界面 */
    confirmArrange () {
      this.$router.push({
        name: 'CoursePreArrange',
        query: this.params
      })
      this.$nextTick(() => {
        this.confirmArrangeDialog = false
      })
    },
    publicConfirm () {
      let gradeIds = [], termId = '', schoolId = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        gradeIds.push(this.multipleSelection[i].gradeId)
        termId = this.multipleSelection[i].termId
        schoolId = this.multipleSelection[i].schoolId
      }
      this.$set(this.pubParams, 'gradeIds', gradeIds)
      this.$set(this.pubParams, 'termId', termId)
      this.$set(this.pubParams, 'schoolId', schoolId)
      this.$_showLoading()
      publishCourses(this.pubParams).then((res) => {
        // 需要接口判断是否有空节数 有给提示 没有直接发布
        console.log(res)
        this.getCourseList()
        this.$_hideLoading()
        this.$nextTick(() => {
          this.confirmPublishDialog = false
        })
      })
    },
    /**发布课表confirm */
    publishCourseList () {
      if (this.multipleSelection.length === 0) {
        this.showPubTips = true
        this.showTips = false
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.showPubTips = false
          clearTimeout(this.timer)
          this.timer = null
        }, 2000)
      } else {
        let gradeIds = [], termId = '', schoolId = '', schoolYearId = '', hasPublish = false, isCourse = true, basedataIScomplete = true
        for (let i = 0; i < this.multipleSelection.length; i++) {
          gradeIds.push(this.multipleSelection[i].gradeId)
          if (i === 0) {
            termId = this.multipleSelection[i].termId
            schoolId = this.multipleSelection[i].schoolId
            schoolYearId = this.multipleSelection[i].schoolYearId
          }
          if (this.multipleSelection[i].isPublish === 1 || this.multipleSelection[i].isPublish === 2) {
            hasPublish = true
          }
          if (!this.multipleSelection[i].isCourse) {
            isCourse = false
          }
          // fullType.indexOf('11111') === 0 && scope.row.fullType[scope.row.fullType.length - 1] === '1'
          if (this.multipleSelection[i].fullType.indexOf('11111') !== 0 || this.multipleSelection[i].fullType[this.multipleSelection[i].fullType.length - 1] !== '1') {
            basedataIScomplete = false
          }
        }
        if (hasPublish) {
          this.$message.error('请勾选未发布的年级')
          return 
        }
        if (!isCourse) {
          this.$message.error('勾选记录中有未排完的年级')
          return 
        }
        if (!basedataIScomplete) {
          this.$message.error('勾选记录中有基础数据不完整的年级')
          return 
        }
        this.$_showLoading()
        selectEmptyCourses({
          gradeIds: gradeIds.join(','),
          termId,
          schoolId,
          schoolYearId 
        }).then(res => {
          this.publishTipsContent = '发布成功后将成为正式课表展示给各相关用户'
          let data = res.data
          if (data.isEmpty || data.isStorage) {
            this.publishTipsContent = '您勾选的年级的课表存在'
            this.publishTipsContent += (data.isEmpty ? '空白区域' : '') + (data.isEmpty && data.isStorage ? '、' : '')
            this.publishTipsContent += (data.isStorage ? '暂存区域' : '')
          }
          this.$_hideLoading()
          this.$nextTick(() => {
            this.confirmPublishDialog = true
          })
        }).catch(() => {
          this.$_hideLoading()
        })
      }
    },
    /**发布排课 */
    publishFun () {
      // 参数this.pubParams
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.showTips = false
      this.showPubTips = false
    },
    /**修改课表 */
    modifyCourseList (row) {
      this.$set(this.params, 'gradeIds', row.gradeId)
      this.$set(this.params, 'termId', row.termId)
      this.$set(this.params, 'schoolId', row.schoolId)
      this.$set(this.params, 'schoolYearId', row.schoolYearId)
      this.$set(this.params, 'stageType', row.stageType)
      this.$set(this.params, 'isPublish', row.isPublish)
      this.$set(this.params, 'isCourse', row.isCourse)
      // 跳转到手动调课
      this.$router.push({
        name: 'CourseHandArrange',
        query: this.params
      })
      // this.$_showLoading()
      // updCourseStatus({
      //   gradeIds: [row.gradeId],
      //   termId: row.termId
      // }).then(() => {
      //   this.$_hideLoading()
      //   this.$set(this.params, 'gradeIds', row.gradeId)
      //   this.$set(this.params, 'termId', row.termId)
      //   this.$set(this.params, 'schoolId', row.schoolId)
      //   this.$set(this.params, 'schoolYearId', row.schoolYearId)
      //   this.$set(this.params, 'stageType', row.stageType)
      //   this.$set(this.params, 'isPublish', row.isPublish)
      //   // 跳转到手动调课
      //   this.$router.push({
      //     name: 'CourseHandArrange',
      //     query: this.params
      //   })
      // }).catch(() => {
      //   this.$_hideLoading()
      // })
      
    },
    modifyConfirm () {
      // this.modifyParams
      this.confirmModifyDialog = false
    },


    
    onSubmit () {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    goCourseRulePage () {
      this.$router.push({ path: '/course/course-rule' })
    }
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.course-list {
  height: 100%;
  width: 100%;
  .previewBtn {
    border: 1px solid $course-list-color28;
    width: 80px;
    height: 33px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    margin-left: 10px;
    border-radius: 3px;
    color: $course-list-color30;
    font-size: 12px;
  }
  .dialog-comp {
    .confirm-top {
      display: flex;
      color: $course-list-color24;
      font-size: 16px;
      justify-content: center;
      margin-top: 16px;
      margin-bottom: 15px;
      .icon-zanwushuju {
        padding-right: 10px;
        font-size: 22px;
      }
    }
    .confirm-center {
      text-align: center;
      color: $course-list-color25;
      line-height: 24px;
      padding: 0 28px 10px;
    }
  }
  .dialog-tooltip {
    width: 100%;
    height: 40px;
    line-height: 40px;
    // background: $course-list-color11;
    padding-left: 15px;
    margin-bottom: 18px;
    > i, span {
      color: $course-list-color12;
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .dialog-center_item {
    display: flex;
    height: 40px;
    line-height: 40px;
    .left {
      width: 30px;
      font-size: 18px;
      .el-icon-circle-close {
        color: $course-list-color13;
      }
      .el-icon-circle-check {
        color: $course-list-color14;
      }
      .el-icon-warning {
        color: $course-list-color15;
        font-size: 17px;
      }
    }
    .center {
      flex: 1;
      color: $course-list-color16;
      a {
        color: $course-list-color23;
        text-decoration: underline;
      }
    }
    .right {
      .tips {
        height: 20px;
        display: inline-block;
        font-size: 12px;
        color: $course-list-color18;
        background: $course-list-color17;
        line-height: 20px;
        border-radius: 4px;
        padding: 0 10px;
      }
      &.no-data {
        .tips {
          background: $course-list-color19;
          color: $course-list-color20;
        }
      }
      &.un-completed {
        .tips {
          background: $course-list-color21;
          color: $course-list-color22;
        }
      }
    }
  }
  .course-list-content {
    padding: 0 20px 14px;
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    .mytable-comp {
      min-height: 300px;
    }
    .no-data-tips {
      position: absolute;
      top: 110px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;
      text-align: center;
      .no-data-tips_content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: $course-list-color27;
        background: #fff;
        max-height: 100%;
        p {
          padding: 10px 0;
        }
        a {
          color: $course-list-color26;
          text-decoration: underline;
          &:hover {
            color: $course-list-color26;
          }
        }
      }
    }
    .course-content_top {
      height: 60px;
      border-top: 1px solid $course-list-color1;
      padding-top: 14px;
      .fl {
        margin-top: 5px;
      }
      .fr {
        position: relative;
        .pubBtn {
          background: $button-blue-color;
          border-color: $button-blue-color;
        }
        .showTips {
          display: none;
          position: absolute;
          top: 40px;
          left: 0;
          background: $course-list-color7;
          z-index: 1;
          color: $course-list-color8;
          padding: 10px;
          font-size: 12px;
          border-radius: 4px;
          &.active {
            display: block;
          }
          &:before {
            content: '';
            width: 12px;
            height: 12px;
            top: -12px;
            left: 10px;
            border-width: 6px;
            border-color: transparent transparent $course-list-color7 transparent;
            position: absolute;
            border-style: solid;
            box-sizing: border-box;
          }
        }
        .showPubTips {
          left: 67px;
        }
        .el-button {
          &:first-child {
            &:hover {
              background: $course-list-color6;
            }
            color: $course-list-color5;
            border-color: $course-list-color5;
          }
        }
      }
    }
    .course-list-submit {
      height: 47px;
      padding-top: 15px;
    }
    .uncomplete {
      color: $course-list-color3;
      padding: 0 5px;
      border-right: 1px solid $course-list-color10;
    }
    // .line {
    //   color: $course-list-color10;
    // }
    .look {
      color: $course-list-color9;
      cursor: pointer;
      padding: 0 5px;
    }
    .prevent {
      color: $course-list-color4;
    }
  }
}
</style>
<style lang="scss">
.course-list {
  .el-checkbox, .el-checkbox__input.is-checked+.el-checkbox__label {
    color: $course-list-color2;
  }
}
.course-list-tooltip {
  background: $course-list-color7 !important;
  .popper__arrow {
    border-top-color: $course-list-color7 !important;
  }
  .popper__arrow:after {
    display: none;
  }
}
</style>

