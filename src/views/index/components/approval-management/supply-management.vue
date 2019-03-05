<template>
  <div class="supply-management">
    <s-title :title="'代课管理'" :haveBorder="true"></s-title>
    <div class="supply-scroll">
      <vue-scroll>
        <div class="supply-info">
          <el-form
            :inline="true"
            size="small"
            :model="formInline"
            ref="formInline"
            class="search-form"
          >
            <el-form-item label-width="72px" class="add-date" label="添加时段:">
              <el-date-picker
                v-model="formInline.applyDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label-width="92px" class="teacher-name" label="教师姓名:">
              <el-input
                v-model="formInline.teacherName"
                placeholder="请输入名称"
                @keyup.enter.native="getSupplyList"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" class="icon-button" @click="getSupplyList">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="formInline.showDel" @change="showDelChange">显示已销毁数据</el-checkbox>
            </el-form-item>
            <div class="el-form-right fr">
              <el-form-item>
                <el-button type="primary" @click="onAddClass" class="def-button">添加</el-button>
              </el-form-item>
            </div>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            class="table-comp"
            :row-class-name="tableRowClassName"
            v-loading="tableLoading"
          >
            <el-table-column align="center" class="width15" label="编号">
              <template slot-scope="scope">
                <span>{{ scope.row.exchangeNumber }}</span>
                <span class="warning-icon" v-if="scope.row.invalid && !scope.row.delFlag">
                  <el-tooltip
                    popper-class="sub-warning-style"
                    class="sub-warning-tooltip-up"
                    effect="light"
                    content="异常：该时段内课表有调整过"
                    placement="right"
                  >
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width15" label="请假教师">
              <template slot-scope="scope">
                <span>{{ scope.row.teacherName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width15" label="开始时间">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime | moment('yyyy-MM-dd') + '第' + scope.row.startClassIndex + '节课'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width15" label="结束时间">
              <template slot-scope="scope">
                <span
                  v-if="!scope.row.isEndClass"
                >{{scope.row.endTime | moment('yyyy-MM-dd') + '第' + scope.row.endClassIndex + '节课'}}</span>
                <span v-else>学期末</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width15" label="添加时间">
              <template slot-scope="scope">
                <span>{{ scope.row.addTime | moment('yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width10" label="添加人">
              <template slot-scope="scope">
                <span>{{ scope.row.addUserName + '(' + scope.row.addUserPosition + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="width15" label="操作">
              <template slot-scope="scope">
                <span class="opera" @click="goDetail(scope.row)">查看</span>
                <span
                  class="opera"
                  @click="deleteDialog = true; deleteSupplyUid = scope.row.uid"
                  v-if="!scope.row.delFlag"
                >销毁</span>
                <span class="opera" style="cursor: auto;" v-else>已销毁</span>
              </template>
            </el-table-column>
            <template slot="empty">
              <div v-if="tableLoading"></div>
              <div v-else>
                <img src="../../../../assets/img/no-data.png">
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
          <template v-if="total > 10">
            <div class="pagination-comp clearfix">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </template>
        </div>
      </vue-scroll>
    </div>

    <!-- 添加代课信息模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'添加代课信息'"
      width="600px"
      :visible.sync="addSupplyDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="addSupplyForm" ref="addSupplyForm" :rules="addSupplyRules" class="add-form">
        <el-form-item label-width="112px" label="选择请假教师:" class="width200" prop="teacher">
          <el-select
            v-model="addSupplyForm.teacher"
            @change="selectTeacherChange"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="(item, index) in teacherList"
              :key="'teacherList' + index"
              :label="item.teacherName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="82px" label="开始时间:" class="width200 inline" prop="startDate">
          <el-date-picker
            v-model="addSupplyForm.startDate"
            @change="selectStarttimeChange"
            type="date"
            :picker-options="upStartDateOpt"
            placeholder="选择日期"
            :disabled="!addSupplyForm.teacher"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0px" class="width150 inline marginLeft20" prop="startClass">
          <el-select
            v-model="addSupplyForm.startClass"
            @change="selectStartclassChange"
            placeholder="请选择课时"
            no-data-text="该教师当天无课"
            :disabled="!addSupplyForm.teacher"
            value-key="uid"
          >
            <el-option
              v-for="(item, index) in startClassSelectList"
              :key="'startClass' + index"
              :label="item.className + item.subjectName + '第' + item.classIndex + '节'"
              :value="item"
              :disabled="item.isSelect"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="82px" label="结束时间:" class="width200 inline" prop="endDate">
          <el-date-picker
            v-model="addSupplyForm.endDate"
            @change="selectEndtimeChange"
            type="date"
            :picker-options="upEndDateOpt"
            placeholder="选择日期"
            :disabled="!addSupplyForm.teacher || addSupplyForm.isSelectEnd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label-width="0px" class="width150 inline marginLeft20" prop="endClass">
          <el-select
            v-model="addSupplyForm.endClass"
            placeholder="请选择课时"
            no-data-text="该教师当天无课"
            :disabled="!addSupplyForm.teacher || addSupplyForm.isSelectEnd"
            @change="computedTotalClass"
            value-key="uid"
          >
            <el-option
              v-for="(item, index) in endClassSelectList"
              :key="'endClass' + index"
              :label="item.className + item.subjectName + '第' + item.classIndex + '节'"
              :value="item"
              :disabled="item.isSelect"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="0px" class="inline marginLeft20" prop="isSelectEnd">
          <el-checkbox v-model="addSupplyForm.isSelectEnd" @change="selectEndTermChange">学期未</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-table
            ref="addClassTable"
            :data="showClassTable"
            stripe
            class="table-comp"
            :row-style="rowStyle"
            :empty-text="'请先添加需求代课的教师'"
            border
          >
            <el-table-column align="center" type="index" width="80px" label="序号"></el-table-column>
            <el-table-column align="center" label="班级和科目">
              <template slot-scope="scope">
                <span>{{ scope.row.className + scope.row.subjectName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="代课老师">
              <template slot-scope="scope">
                <el-select v-model="addTeacherArr[scope.row.index]" filterable placeholder="请选择">
                  <el-option
                    v-for="(item, index) in searchTeacherList[scope.row.index]"
                    :key="'searchTeacherList' + index"
                    :label="item.teacherName"
                    :value="item.uid"
                    :disabled="!item.inSchool || item.hasOwnProperty('disabledTeacer')"
                  >
                    <span>{{ item.teacherName }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <span class="opera" @click="onDeleteItem(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item prop="isPush">
          <el-checkbox disabled v-model="addSupplyForm.isPush">确认添加后，PC和移动端推送通知</el-checkbox>
        </el-form-item>
        <el-form-item prop="isUpdate">
          <el-checkbox disabled v-model="addSupplyForm.isUpdate">确认添加后，代课信息将会更新到课表中</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit-button-two" @click="submitSupplyForm">确定</el-button>
        <el-button class="submit-button-two" @click="addSupplyDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      class="dialog-comp"
      title="删除提示"
      width="392px"
      :visible.sync="deleteDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="delete-box">
        <p>是否确认删除该代课信息？</p>
        <p>删除后，数据不能恢复！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onConfirmDelete">确 定</el-button>
        <el-button @click="deleteDialog = false;">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCurrentTerm,
  getAllTeacher,
  getExchangeTeacherInfo,
  getClassListByTeacher,
  getExchangeList, // 查询代课的列表
  addExchangeClass, // 新增代课
  canExchangeClass, // 查询此时段是否可以代课
  destroyExchangeClass // 销毁代课信息
} from "../../store/api";
import {
  arrayWeightRemoval,
  formatDate,
  deepCopy
} from "../../../../utils/index.js";
export default {
  name: "SupplyManagement",
  data() {
    return {
      addTeacherArr: [],
      currentSchool: {}, // 当前学校信息
      currentTerm: {}, // 当前学期信息
      teacherList: [], // 请假教师列表
      tableData: [], // 代课信息查询列表
      tableLoading: false, // 表格加载效果
      startClassSelectList: [], // 开始时间选择的课时
      endClassSelectList: [], // 结束时间选择的课时
      weekClassList: [], // 这个教师的周课时列表
      searchTeacherList: [], // 展示远程搜索教师的数组
      rowStyle: {},
      tableHeight: "calc(100% - 149px)", // 表格高度
      labelPosition: "right", //表单label对齐方式
      currentPage: 1, // 表格当前页
      pageSize: 10, // 表格每页数量
      total: null, // 表格数据总量
      formInline: {
        // 查询表单
        applyDate: "",
        teacherName: "",
        showDel: true // 是否显示删除的数据
      },
      addSupplyDialog: false, // 添加代课信息模态框是否打开
      deleteDialog: false, // 删除模态框是否打开
      deleteSupplyUid: "",
      addSupplyForm: {
        // 添加代课信息表单
        teacher: "",
        startDate: "",
        startClass: "",
        endDate: "",
        endClass: "",
        isSelectEnd: false, // 是否选择学期末
        isPush: true,
        isUpdate: true
      },
      addSupplyRules: {
        // 添加代课信息验证规则
        teacher: [
          { required: true, message: "请假教师不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        startClass: [
          { required: true, message: "开始时间课时不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        endClass: [
          { required: true, message: "结束时间课时不能为空", trigger: "blur" }
        ]
      },
      upStartDateOpt: {
        // 代课开始时间限定
        disabledDate: time => {
          if (this.currentTerm.hasOwnProperty("termStarttime")) {
            // 如果存在学期的开始时间和结束时间
            if (
              this.currentTerm.termStarttime &&
              this.currentTerm.termEndtime
            ) {
              // 如果存在学期的开始时间
              if (this.addSupplyForm.endDate) {
                return (
                  time.getTime() < this.currentTerm.termStarttime ||
                  time.getTime() > this.addSupplyForm.endDate ||
                  time.getTime() > this.currentTerm.termEndtime
                );
              } else {
                return (
                  time.getTime() < this.currentTerm.termStarttime ||
                  time.getTime() > this.currentTerm.termEndtime
                );
              }
            } else {
              return time.getTime() > 1000000000000000000000000;
            }
          } else {
            return time.getTime() > 1000000000000000000000000;
          }
        }
      },
      upEndDateOpt: {
        // 代课结束时间限定
        disabledDate: time => {
          if (this.currentTerm.hasOwnProperty("termEndtime")) {
            // 如果存在学期的结束时间
            if (this.currentTerm.termEndtime) {
              if (this.addSupplyForm.startDate) {
                return (
                  time.getTime() > this.currentTerm.termEndtime ||
                  time.getTime() < this.addSupplyForm.startDate
                );
              } else {
                return (
                  time.getTime() < this.currentTerm.termStarttime ||
                  time.getTime() > this.currentTerm.termEndtime
                );
              }
            } else {
              return time.getTime() > 1000000000000000000000000;
            }
          } else {
            return time.getTime() > 1000000000000000000000000;
          }
        }
      },
      showClassTable: [
        // 添加教师代课信息表格的展示数据
      ],
      submitClassTable: [] // 添加教师代课信息表格的提交数据
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取当前的学校信息
    // 获取所有的教师信息
    getAllTeacher({ schoolId: this.currentSchool.uid }).then(res => {
      this.teacherList = res.data;
    });
    // 获取当前学期信息
    getCurrentTerm({ schoolId: this.currentSchool.uid }).then(res => {
      this.currentTerm = res.data;
    });
    this.getSupplyList(); // 查询代课管理列表
  },
  methods: {
    showDelChange() {
      // 是否显示销毁数据
      this.getSupplyList();
    },
    tableRowClassName({ row }) {
      // 控制被销毁的样式
      if (row.delFlag) {
        return "gray-row";
      }
      return "";
    },
    //查询代课信息列表
    getSupplyList() {
      let queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        "where.schoolId": this.currentSchool.uid
      };
      if (this.formInline.applyDate) {
        queryParams["where.startTime"] = formatDate(
          this.formInline.applyDate[0],
          "yyyy-MM-dd"
        );
        queryParams["where.endTime"] = formatDate(
          this.formInline.applyDate[1],
          "yyyy-MM-dd"
        );
      }
      if (!this.formInline.showDel) {
        queryParams["where.delFlag"] = 0;
      } else {
        delete queryParams["where.delFlag"];
      }
      if (this.formInline.teacherName) {
        queryParams["where.teacherName"] = this.formInline.teacherName;
      }
      this.tableLoading = true; // 表格加载效果打开
      getExchangeList(queryParams)
        .then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.tableLoading = false; // 表格加载效果关闭
        })
        .catch(() => {
          this.tableLoading = false; // 表格加载效果关闭
        });
    },
    selectTeacherChange() {
      // 选择教师change方法
      // 清空下面的数据
      this.addSupplyForm.startDate = "";
      this.addSupplyForm.startClass = "";
      this.addSupplyForm.endDate = "";
      this.addSupplyForm.endClass = "";
      this.addSupplyForm.isSelectEnd = false;
      this.startClassSelectList = []; // 清空开始课节数组
      this.showClassTable = []; // 清空计算出的课节
      this.endClassSelectList = []; // 清空结束课节数组
    },
    selectStarttimeChange(time) {
      // 选择开始时间change，将当天的课节筛选出来
      this.addSupplyForm.startClass = ""; // 清空选中的开始课时
      this.addSupplyForm.endDate = "";
      this.addSupplyForm.endClass = "";
      this.startClassSelectList = []; // 清空开始课节数组
      this.endClassSelectList = []; // 清空结束课节数组
      this.showClassTable = []; // 清空计算出的课节
      if (!time) {
        this.addSupplyForm.isSelectEnd = false;
        this.selectEndtimeChange(false); // 手动触发选择学期末change方法
        return;
      }
      this.$_showLoading({
        text: "查询当前教师周课时中..."
      });
      const queryParam = {
        schoolId: this.currentSchool.uid,
        teacherId: this.addSupplyForm.teacher,
        startDate: formatDate(time, "yyyy-MM-dd")
      };
      getClassListByTeacher(queryParam)
        .then(res => {
          const weeks = time.getDay() === 0 ? 7 : time.getDay();
          this.startClassSelectList = res.data.filter(item => {
            return item.weekDay === weeks;
          });
          // 根据classIndex排序
          this.startClassSelectList.sort((a, b) => {
            return a.classIndex - b.classIndex;
          });
          this.$_hideLoading();
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    selectEndtimeChange(time) {
      this.addSupplyForm.endClass = ""; // 清空选中的结束课时
      this.endClassSelectList = []; // 清空结束课节数组
      if (!time) {
        return;
      }
      if (!this.addSupplyForm.startDate) {
        this.$message.warning("请先选择开始时间");
        this.addSupplyForm.endDate = "";
        return;
      }
      // 打开加载效果
      this.$_showLoading({
        text: "查询当前教师周课时中..."
      });
      const queryParam = {
        schoolId: this.currentSchool.uid,
        teacherId: this.addSupplyForm.teacher,
        startDate: formatDate(this.addSupplyForm.startDate, "yyyy-MM-dd"),
        endDate: formatDate(time, "yyyy-MM-dd")
      };
      getClassListByTeacher(queryParam)
        .then(res => {
          this.$_hideLoading(); // 关闭加载效果
          // 选择结束时间change，将当天的课节筛选出来
          this.weekClassList = res.data;
          const weeks = time.getDay() === 0 ? 7 : time.getDay();
          this.endClassSelectList = this.weekClassList.filter(item => {
            return item.weekDay === weeks;
          });
          // 根据classIndex排序
          this.endClassSelectList.sort((a, b) => {
            return a.classIndex - b.classIndex;
          });
          if (this.addSupplyForm.startClass) {
            // 如果开始课节被选中且开始结束时间在同一天
            const startDate = this.addSupplyForm.startDate.getTime();
            const endDate = this.addSupplyForm.endDate.getTime();
            const betweenDate = parseInt(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            ); // 相差的天数
            if (betweenDate === 0) {
              this.endClassSelectList = this.endClassSelectList.filter(item => {
                return (
                  item.classIndex >= this.addSupplyForm.startClass.classIndex
                );
              });
            }
          }
          // 如果选中了学期末那么默认填入最后的那个课节
          if (this.addSupplyForm.isSelectEnd) {
            if (this.endClassSelectList.length) {
              if (
                this.endClassSelectList[this.endClassSelectList.length - 1][
                  "isSelect"
                ]
              ) {
                // 结束课节不能被选中
                this.addSupplyForm.isSelectEnd = false;
                this.$message.warning("无法生成代课，此期间存在代课或者调课");
                this.showClassTable = []; // 清空之前计算的课节数据
              } else {
                this.addSupplyForm.endClass = this.endClassSelectList[
                  this.endClassSelectList.length - 1
                ];
                // 手动触发选择结束课时的change方法
                this.computedTotalClass(this.addSupplyForm.endClass);
              }
            }
          }
        })
        .catch(() => {
          this.$_hideLoading(); // 关闭加载效果
        });
    },
    selectStartclassChange() {
      // 选择开始课节change
      this.addSupplyForm.endDate = "";
      this.addSupplyForm.endClass = "";
      this.showClassTable = []; // 清空之前计算的课节数据
    },
    selectEndTermChange(item) {
      // 选择学期末change方法
      if (!this.addSupplyForm.startDate || !this.addSupplyForm.startClass) {
        this.$message.warning("请先填好开始时间和开始课节再选择");
        this.addSupplyForm.isSelectEnd = !item;
        return;
      }
      if (item) {
        // 默认选中最后一天的最后一节课
        this.addSupplyForm.endDate = new Date(this.currentTerm.termEndtime);
        this.addSupplyForm.endClass = ""; // 清空结束课节
        this.selectEndtimeChange(this.addSupplyForm.endDate); // 手动触发结束时间change事件
      } else {
        this.addSupplyForm.endDate = "";
        this.addSupplyForm.endClass = "";
        this.showClassTable = []; // 清空之前计算的课节数据
      }
    },
    computedTotalClass(endClass) {
      // 计算课节方法
      this.showClassTable = []; // 清空之前计算的课节数据
      // 计算时间区间的所有课时
      if (
        !this.addSupplyForm.startDate ||
        (!this.addSupplyForm.endDate || !this.addSupplyForm.startClass)
      ) {
        return;
      }
      // 开始时间是周几
      const startDateWeek =
        this.addSupplyForm.startDate.getDay() === 0
          ? 7
          : this.addSupplyForm.startDate.getDay();
      const startDate = this.addSupplyForm.startDate.getTime();
      const endDate = this.addSupplyForm.endDate.getTime();
      const startClassIndex = this.addSupplyForm.startClass.classIndex; // 开始课时Index
      const endClassIndex = endClass.classIndex; // 结束课时Index
      // 相差的天数
      const betweenDate = parseInt(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );

      let weekArr = []; // 星期的数组
      if (betweenDate === 0) {
        // 开始时间和结束的时间相等的情况
        let weekCount = startDateWeek === 0 ? 7 : startDateWeek;
        this.showClassTable = this.weekClassList.filter(item => {
          return (
            item.weekDay === weekCount &&
            (item.classIndex >= startClassIndex &&
              item.classIndex <= endClassIndex)
          );
        });
      } else {
        // 开始时间和结束时间不相等的情况
        for (let i = 0; i <= betweenDate; i++) {
          if (i === 0) {
            weekArr = [...weekArr, startDateWeek];
          } else {
            const weekNum = weekArr[weekArr.length - 1];
            if (weekNum === 7) {
              weekArr.push(1);
            } else {
              weekArr.push(weekNum + 1);
            }
          }
        }
      }
      for (let j = 0; j < weekArr.length; j++) {
        let itemArr;
        // 先处理开始的那一天和结束的那天
        if (j === 0) {
          // 开始的一天
          itemArr = this.weekClassList.filter(item => {
            // 取开始课节之后的课时
            return (
              item.weekDay === weekArr[0] && item.classIndex >= startClassIndex
            );
          });
        } else if (j === weekArr.length - 1) {
          itemArr = this.weekClassList.filter(item => {
            // 取结束课节之前的课时
            return (
              item.weekDay === weekArr[weekArr.length - 1] &&
              item.classIndex <= endClassIndex
            );
          });
        } else {
          itemArr = this.weekClassList.filter(item => {
            return item.weekDay === weekArr[j];
          });
        }
        this.showClassTable = [...this.showClassTable, ...itemArr];
      }
      // 获取到要提交的数组
      this.submitClassTable = arrayWeightRemoval(
        this.showClassTable.map(item => {
          return item;
        }),
        "uid"
      );
      // 课节展示数组去重
      this.showClassTable = arrayWeightRemoval(
        this.showClassTable.map(item => {
          return item;
        }),
        "classId",
        "subjectId"
      );

      // 计算出代课教师的列表
      const queryParamTwo = {
        startTime: formatDate(this.addSupplyForm.startDate, "yyyy-MM-dd"),
        endTime: formatDate(this.addSupplyForm.endDate, "yyyy-MM-dd"),
        schoolId: this.currentSchool.uid,
        schoolYearId: this.currentTerm.schoolYearid,
        startClassIndex: startClassIndex,
        endClassIndex: endClassIndex,
        teacherId: this.addSupplyForm.teacher,
        termId: this.currentTerm.uid
      };
      getExchangeTeacherInfo(queryParamTwo).then(res => {
        let teacherArr = res.data.filter(sonItems => {
          // 过滤掉选中的教师
          return sonItems.uid !== this.addSupplyForm.teacher;
        });
        this.searchTeacherList = []; // 清空教师选择列表
        for (let i = 0; i < this.showClassTable.length; i++) {
          let showClassTableItem = this.showClassTable[i];
          let pushArr = deepCopy(teacherArr);
          for (let j = 0; j < pushArr.length; j++) {
            let teacherArrItem = pushArr[j];
            if (teacherArrItem.list !== null && teacherArrItem.inSchool) {
              // 是否存在科目和班级ID相同的数据
              let isExit = teacherArrItem.list.filter(item => {
                return (
                  item.subjectId === showClassTableItem.subjectId &&
                  item.classId === showClassTableItem.classId
                );
              });
              if (isExit.length) {
                teacherArrItem["disabledTeacer"] = true;
              }
            }
          }
          this.searchTeacherList.push(pushArr);
        }
      });
      this.getSupplyTeacherForm(); // 生成教师的表单
    },
    getSupplyTeacherForm() {
      // 生成教师的表单
      this.addTeacherArr = [];
      for (let z = 0; z < this.showClassTable.length; z++) {
        this.showClassTable[z]["index"] = z;
        this.addTeacherArr.push("");
      }
    },
    goDetail(item) {
      // 查看代课通知详情
      this.$router.push({
        path: "/approval-management/view-supply",
        query: { supplyUid: item.uid }
      });
    },
    onAddClass() {
      // 添加代课信息
      this.addSupplyDialog = true; // 打开模态框
      if (this.$refs.addSupplyForm) {
        this.$refs.addSupplyForm.resetFields(); // 清空表单
        this.showClassTable = []; // 清空班级科目信息列表
      }
    },
    submitSupplyForm() {
      // 提交代课信息
      this.$refs["addSupplyForm"].validate(valid => {
        if (valid) {
          if (!this.showClassTable.length) {
            this.$message.warning("代课列表不能为空");
            return;
          } else {
            const errorArr = this.addTeacherArr.filter(item => {
              return item === "";
            });
            if (errorArr.length) {
              this.$message.warning("请选择好所有的代课教师");
              return;
            }
          }
          // 查询此时段是否可以代课
          const queryParam = {
            startTime: formatDate(this.addSupplyForm.startDate, "yyyy-MM-dd"),
            endTime: formatDate(this.addSupplyForm.endDate, "yyyy-MM-dd"),
            startClassIndex: this.addSupplyForm.startClass.classIndex,
            endClassIndex: this.addSupplyForm.endClass.classIndex,
            teacherId: this.addSupplyForm.teacher
          };
          canExchangeClass(queryParam).then(res => {
            if (res.data) {
              this.$_showLoading({
                text: "加载中..."
              });
              let submitData = {
                teacherId: this.addSupplyForm.teacher,
                endClassIndex: this.addSupplyForm.endClass.classIndex, // 代课结束节次序号
                endTime: this.addSupplyForm.endDate, // 代课结束时间
                endWeekDay:
                  this.addSupplyForm.endDate.getDay() === 0
                    ? 7
                    : this.addSupplyForm.endDate.getDay(), // 代课结束是周几
                isEndClass: this.addSupplyForm.isSelectEnd, // 是否学期末
                publishCourseId: "", // 课表标识
                schoolId: this.currentSchool.uid, // 学校UID
                startClassIndex: this.addSupplyForm.startClass.classIndex, // 代课开始节次序号
                startTime: this.addSupplyForm.startDate, // 代课开始时间
                startWeekDay:
                  this.addSupplyForm.startDate.getDay() === 0
                    ? 7
                    : this.addSupplyForm.startDate.getDay(), // 代课结束是周几
                termId: this.currentTerm.uid,
                detailList: this.submitClassTable.map(item => {
                  return {
                    classId: item.classId,
                    subjectId: item.subjectId,
                    gradeId: item.gradeId,
                    publishCourseId: item.uid,
                    schoolId: this.currentSchool.uid,
                    termId: item.termId
                  };
                })
              };
              // 代课教师对应的科目信息数组 exchangeTeacherId
              let arrs = [];
              for (let i = 0; i < this.addTeacherArr.length; i++) {
                arrs = [
                  ...arrs,
                  {
                    teacherId: this.addTeacherArr[i],
                    classId: this.showClassTable[i].classId,
                    subjectId: this.showClassTable[i].subjectId,
                    publishCourseId: this.showClassTable[i].uid
                  }
                ];
              }
              for (let j = 0; j < submitData.detailList.length; j++) {
                const detailItem = submitData.detailList[j];
                for (let z = 0; z < arrs.length; z++) {
                  const arrsItem = arrs[z];
                  if (
                    detailItem.classId === arrsItem.classId &&
                    detailItem.subjectId === arrsItem.subjectId
                  ) {
                    detailItem["exchangeTeacherId"] = arrsItem.teacherId;
                    break;
                  }
                }
              }
              addExchangeClass(submitData)
                .then(() => {
                  this.$message.success("新增代课信息成功");
                  this.addSupplyDialog = false; // 关闭模态框
                  this.getSupplyList(); // 刷新列表
                  this.$_hideLoading();
                })
                .catch(() => {
                  this.$_hideLoading();
                });
            } else {
              this.$message.warning("请假教师在您选择的时段中已经存在代课信息");
            }
          });
        } else {
          return false;
        }
      });
    },
    onDeleteItem(sonItem) {
      // 删除模态框代课信息
      this.showClassTable = this.showClassTable.filter(item => {
        return item.uid !== sonItem.uid;
      });
      this.getSupplyTeacherForm(); // 重新生成代课教师表单
    },
    onConfirmDelete() {
      // 确定删除代课信息
      if (!this.deleteSupplyUid) {
        this.$message.warning("参数错误");
        return;
      }
      this.$_showLoading({
        text: "删除中..."
      });
      destroyExchangeClass(this.deleteSupplyUid)
        .then(() => {
          this.$message.success("删除代课信息成功");
          this.getSupplyList(); // 刷新列表
          this.$_hideLoading();
          this.deleteDialog = false; // 关闭删除模态框
        })
        .catch(() => {
          this.$_hideLoading();
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getSupplyList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getSupplyList();
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.supply-management {
  width: 100%;
  height: 100%;
  position: relative;
  .supply-scroll {
    height: calc(100% - 50px);
    .supply-info {
      // height: calc(100% - 100px);
      padding: 14px 20px;
      .search-form {
        // 搜索框样式
        .teacher-name {
          .el-input {
            width: 120px;
          }
        }
      }
      .table-comp {
        // 表格样式
        position: relative;
        width: 100%;
        .width20 {
          width: 20%;
        }
        .width15 {
          width: 15%;
        }
        .width10 {
          width: 10%;
        }
        .warning-icon {
          // 警告icon颜色
          padding-left: 4px;
          i {
            color: $approval-color9;
            padding-left: 3px;
          }
        }
        .deleteStyle {
          color: $approval-color24;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td {
          background: white;
        }
      }
    }
  }
  .add-form {
    // 添加代课信息模态框样式
    .inline {
      display: inline-block;
    }
    .width200 {
      width: 222px;
      .el-input {
        width: 150px;
      }
    }
    .width150 {
      width: 150px;
    }
    .marginLeft20 {
      margin-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.supply-management {
  .el-table .gray-row {
    // 销毁的数据
    color: $approval-color31;
    .opera {
      color: $approval-color31;
    }
  }
  .el-range-editor--small .el-range-separator {
    // 日历组件样式
    z-index: 100;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 240px;
  }
  .table-comp .el-table__empty-block {
    min-height: 220px;
  }
}
.sub-warning-style {
  // 警告样式
  font-size: 14px;
  padding: 18px 25px;
  border: 1px solid $border-color !important;
  color: $approval-color22;
  background: $approval-color23 !important;
  opacity: 0.53;
  .popper__arrow {
    color: $approval-color23;
    opacity: 0.53;
  }
}
</style>