<template>
<!-- <vue-scroll> -->
  <div class="term-man">
    <s-title :title="'学年学期'"></s-title>
    <div class="term-scroll">
    <vue-scroll>
    <div class="term-info">
    <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline clearfix">
      <el-form-item>
        <el-select v-model="schoolYearId" placeholder="请选择学年" @change="onChangeYear" value-key="uid">
          <el-option v-for="item in yearOptionsAll" :key="item.uid"
                     :label="item.schoolYear"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="icon-button mgt-2" @click="getTermData">查询</el-button>
      </el-form-item>
      <div class="el-form-right fr">
        <el-form-item>
          <el-button type="primary" @click="onAdd" class="def-button mgt-2" v-if="yearAfter">新增</el-button>
          <el-button class="def-button" v-else>新增</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" class="table-comp" style="width: 100%" ref="table" v-loading="loading">
      <el-table-column align="center" prop="schoolYear" width="172" label="学年"></el-table-column>
      <el-table-column align="center" label="学期" class-name="term-column">
        <template slot-scope="scope">
          <p v-if="scope.row">上学期</p>
          <p v-if="scope.row">下学期</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <p >{{ scope.row.upStartTime | moment('yyyy-MM-dd')}}</p>
          <p >{{ scope.row.startTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <p >{{ scope.row.upEndTime | moment('yyyy-MM-dd')}}</p>
          <p >{{ scope.row.endTime | moment('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label=" 操作" width="210">
        <template slot-scope="scope">
          <span class="opera" @click="onEdit(scope.row)">修改</span>
          <span class="delete" @click="onDelete(scope.row)">删除</span>
          <!-- <template v-if="scope.row.yearAfter">
            <span class="opera" @click="onEdit(scope.row)">修改</span>
            <span class="opera" @click="onDelete(scope.row)">删除</span>
          </template>
          <template v-else>
            <span class="opera gray-color">修改</span>
            <span class="opera gray-color">删除</span>
        </template> -->
        </template>
      </el-table-column>
       <template slot="empty">
          <div v-if="loading">
          </div>
          <div v-else>
              <img src="../../../../assets/img/no-data.png">
              <p>暂无数据</p>
          </div>
      </template>
    </el-table>
    </div>
    </vue-scroll>
    </div>
    <!-- 添加/修改学年 -->
      <el-dialog
        class="dialog-comp"
        :title="AEIntitle"
        width="600px"
        :visible.sync="addEditInDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          :model="postAddInData"
          :rules="rules"
          ref="form"
          label-width="120px"
          :label-position="labelPosition"
          size="small"
          class="term-dialog-form clearfix demo-ruleForm">
          <el-form-item label="学年" prop="yearId">
            <template v-if="AEInStatus === 1">
              <el-select v-model="postAddInData.yearId" placeholder="请选择学年" @change="yearChange">
                <el-option v-for="item in currYearOptions" :key="item.uid"
                          :label="item.schoolYear"
                          :value="item.uid"></el-option>
              </el-select>
            </template>
            <template v-else-if="AEInStatus === 2">
              <el-select v-model="postAddInData.yearId" placeholder="请选择学年" disabled>
                <el-option v-for="item in yearOptions" :key="item.uid"
                          :label="item.schoolYear"
                          :value="item.uid"></el-option>
              </el-select>
            </template>
          </el-form-item>
         <!-- <div class="term-title">
            <span class="fl-title">上学期</span>
          </div> -->
          <el-form-item label="上学期开始时间" prop="upStartTime" class="fl">
            <el-date-picker
              v-model="postAddInData.upStartTime"
              type="date"
              :picker-options="upStartDateOpt"
              placeholder="选择日期"
              :default-value= "defUpStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="upEndTime" class="fr" label-width="80px">
            <el-date-picker
              v-model="postAddInData.upEndTime"
              type="date"
              :picker-options="upEndDateOpt"
              placeholder="选择日期"
              :default-value= "defUpEndTime">
            </el-date-picker>
          </el-form-item>
          <!-- <div class="term-title">
            <span class="fl-title">下学期</span>
          </div> -->
          <el-form-item label="下学期开始时间" prop="startTime" class="fl">
            <el-date-picker
              v-model="postAddInData.startTime"
              type="date" 
              :picker-options="startDateOpt"
              placeholder="选择日期"
              :default-value= "defStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" class="fr" label-width="80px">
            <el-date-picker
              v-model="postAddInData.endTime"
              type="date" 
              :picker-options="endDateOpt"
              placeholder="选择日期"
              :default-value= "defEndTime">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmAddEditIn">确 定</el-button>
          <el-button @click="addEditInDialog = false">取 消</el-button> 
        </span>
      </el-dialog>
      <!-- 删除弹框 -->
      <el-dialog
        class="dialog-comp"
        title="删除提示"
        width="360px"
        :visible.sync="deleteDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="dialog-box">
          <p>是否确认删除?</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onConfirmDelete">确 定</el-button>
          <el-button @click="deleteDialog = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
  <!-- </vue-scroll> -->
</template>
<script>
import { mapGetters } from 'vuex'
import { getTerm, addTerm, deleteTerm, updateTerm, getFiveYear } from '../../store/api';
export default {
  name: 'TermInfo',
  data () {
    return {
      tableHeight: 'calc(100% - 149px)',
      labelPosition: 'right',   //表单label对齐方式
      schoolId: 1,   //学校id
      formInline: {},  
      schoolYearId: {
          schoolYear: '全部学年',
          uid: null,
          yearAfter: true,
      },   //选择学年
      yearAfter: true,       //当前学年之后的学年
      defaultSchoolYearId: null,   //默认学年
      yearOptionsAll: [
        {
          schoolYear: '全部学年',
          uid: null,
          yearAfter: true,
        }
      ],
      yearOptions: [],
      currYearOptions: [],   //新增学年当年学年列表
      tableData: [],
      multipleSelection: [],
      postAddInData: {
        yearId: '',
        upStartTime: '',
        upEndTime: '',
        startTime: '',
        endTime: '',
      },
      addEditInDialog: false, // 编辑添加学年
      AEIntitle: '新增学年',
      rules: {
        yearId: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        upStartTime: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        upEndTime: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        startTime: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
        endTime: [{ required: true, message: '该项内容不可为空', trigger: 'change'}],
      },
      deleteDialog: false,
      deleteItem: {},
      confirmLoading: false, // 按钮loading状态
      AEInStatus: 1, // 1=新增,2=编辑
      schoolInfoList: null,   // 学校信息
      currentSchool: null,    //当前学校
      loading: false,     //表格loading
      defUpStartTime: '',
      defUpEndTime: '',
      defStartTime: '',
      defEndTime: '',
      startDate: '',
      endDate: '',
      upStartDateOpt: {
        disabledDate: (time) => {
          if(this.postAddInData.upEndTime) {
             return time.getTime() >= this.postAddInData.upEndTime || time.getTime() < this.startDate
          }else if(this.postAddInData.startTime) {
             return time.getTime() >= this.postAddInData.startTime || time.getTime() < this.startDate
          }else if(this.postAddInData.endTime) {
            return time.getTime() >= this.postAddInData.endTime || time.getTime() < this.startDate
          }else {
            return time.getTime() < this.startDate || time.getTime() > this.endDate
          }
        }
      },
      upEndDateOpt: {
        disabledDate: (time) => {
          if(this.postAddInData.upStartTime) {
            if(this.postAddInData.startTime) {
              return time.getTime() <= this.postAddInData.upStartTime || time.getTime() >= this.postAddInData.startTime
            }else if (this.postAddInData.endTime) {
              return time.getTime() <= this.postAddInData.upStartTime || time.getTime() >= this.postAddInData.endTime
            }else {
              return time.getTime() <= this.postAddInData.upStartTime || time.getTime() > this.endDate
            }
          }else {
            if(this.postAddInData.startTime) {
              return time.getTime() > this.postAddInData.startTime || time.getTime() < this.startDate
            }else if(this.postAddInData.endTime) {
              return time.getTime() >= this.postAddInData.endTime || time.getTime() < this.startDate
            }else {
              return time.getTime() < this.startDate || time.getTime() > this.endDate
            }
          }
        }
      },
      startDateOpt: {
        disabledDate: (time) => {
          if(this.postAddInData.upEndTime) {
            if(this.postAddInData.endTime){
              return time.getTime() <= this.postAddInData.upEndTime || time.getTime() >= this.postAddInData.endTime
            }else {
              return time.getTime() <= this.postAddInData.upEndTime || time.getTime() > this.endDate
            }
          }else if(this.postAddInData.upStartTime) {
            if(this.postAddInData.endTime) {
              return time.getTime() <= this.postAddInData.upStartTime || time.getTime() >= this.postAddInData.endTime
            }else {
              return time.getTime() <= this.postAddInData.upStartTime || time.getTime() > this.endDate
            }
          }else {
            if(this.postAddInData.endTime) {
              return time.getTime() >= this.postAddInData.endTime || time.getTime() < this.startDate
            }else {
              return time.getTime() < this.startDate || time.getTime() > this.endDate
            }
          }
        }
      },
      endDateOpt: {
        disabledDate: (time) => {
           if(this.postAddInData.startTime) {
             return time.getTime() <= this.postAddInData.startTime || time.getTime() > this.endDate
           }else if(this.postAddInData.upEndTime) {
             return time.getTime() <= this.postAddInData.upEndTime || time.getTime() > this.endDate
           }else if(this.postAddInData.upStartTime){
             return time.getTime() <= this.postAddInData.upStartTime || time.getTime() > this.endDate
           }else {
            return time.getTime() < this.startDate || time.getTime() > this.endDate
          }
        }
      },      
    }
  },
  computed: {
    ...mapGetters([
      'schoolYear'
    ])
  },
  mounted () {
    this.schoolInfoList = this.$store.state.user.schoolInfoList; // 获取到用户学校信息
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校信息
    if(this.currentSchool) {
      this.schoolId = this.currentSchool.uid;
      console.log("schoolId", this.schoolId)
      this.getSchoolYear();
      this.getTermData();
    }
    this.getYearData();
  },
  methods: {
    yearChange(value) {
      console.log("111111",value)
      this.getDate(value)
    },
    getDate(value) {
      let selectYear = {}
      for(let item of this.yearOptions) {
        if(item.uid === value) {
          selectYear = item
          break
        }
      }
      let startYear = selectYear.startYear
      let endYear = selectYear.endYear
      this.defUpStartTime = startYear + '/9/1'
      this.defUpEndTime = endYear + '/1/1'
      this.defStartTime = endYear + '/3/1'
      this.defEndTime = endYear + '/7/1'
      this.startDate = new Date((startYear + '/1/1')) 
      this.endDate = new Date((endYear + '/12/31')) 
      console.log("=========",typeof this.defUpStartTime,this.defUpEndTime,this.defStartTime,this.defEndTime,this.startDate,this.endDate)
    },
    //查询学年
    getYearData () {
      getFiveYear().then(res =>{
         if(res.data && res.data.length > 0){
           this.yearOptions = res.data;
         }
      }).catch(e =>{
         console.log(e)
      }) 
    },
    /**
     * 初始化学年学期信息
     */
    getSchoolYear () {
      return new Promise(resolve => {
        this.$_showLoading();
        this.loading = true;
        if (this.schoolYear && this.schoolYear.length > 0) {
          this.yearOptionsAll = [...this.yearOptionsAll, ...this.schoolYear];
          for (let item of this.schoolYear) {
             if(item.isDefault){
               this.defaultSchoolYearId = item.uid;
               break;
             }
          }
          this.$nextTick(() => {
            this.$_hideLoading()
          })
          resolve()
        } else {
          this.$store.dispatch('SetSchoolYear').then(() =>{
            this.yearOptionsAll = [...this.yearOptionsAll, ...this.schoolYear];
            for (let item of this.schoolYear) {
             if(item.isDefault){
               this.defaultSchoolYearId = item.uid;
               break;
             }
            }
            this.$nextTick(() => {
              this.$_hideLoading()
            })
            resolve()
          }).catch(() => {
            this.$_hideLoading()
          })
        }

      })
    },
    //查询学年学期列表
    getTermData () {
      this.loading = true
      let queryParams = {
        schoolId: this.schoolId,
      };
      this.schoolYearId && (queryParams['yearId'] = this.schoolYearId.uid);
      getTerm(queryParams).then(res =>{
         this.tableData = res.data;
         this.$nextTick(() => {
            this.loading = false;
         })
      }).catch(e =>{
         console.log(e);
         this.loading = false;
      })      
    },
    //选择学年
    onChangeYear(value) {
      console.log(value);
      this.yearAfter = value.yearAfter;
      this.getTermData();
    },
    // 新增学年
    onAdd () { 
      this.AEIntitle = '新增学年';
      this.AEInStatus = 1;
      this.postAddInData = {}
      this.addEditInDialog = true
      this.currYearOptions.splice(0, this.currYearOptions.length)
      for(let item of this.yearOptions) {
        let isExist = false;
        if(this.schoolYear && this.schoolYear.length > 0) {
          for(let key of this.schoolYear) {
            if(item.uid === key.uid) {
              isExist = true;
              break;
            }
          }
        }
        if(!isExist){
            this.currYearOptions.push(item);
        }
      }
      console.log("888888",this.schoolYear,this.currYearOptions)
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    onEdit (obj) { // 编辑学年
      this.AEIntitle = '编辑学年';
      this.AEInStatus = 2;
      this.postAddInData = {};
      this.postAddInData = Object.assign({}, obj);
      this.getDate(obj.yearId)
      this.addEditInDialog = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    //确定新增或者编辑
    onConfirmAddEditIn () {
      this.$_showLoading();
      let queryParams = {
        yearId: this.postAddInData.yearId,
        upStartTime: this.postAddInData.upStartTime,
        upEndTime: this.postAddInData.upEndTime,
        startTime: this.postAddInData.startTime,
        endTime: this.postAddInData.endTime,
        schoolId: this.schoolId
      }
      let upStartTime = Date.parse(new Date(this.postAddInData.upStartTime));
      let endTime = Date.parse(new Date(this.postAddInData.endTime));
      let nDays = Math.abs(parseInt((endTime - upStartTime) / 1000 / 3600 / 24));
      console.log("nDay",nDays)
      if(nDays > 365) {
        this.$message.error("学期时间长度限制不可超过1年");
        this.$_hideLoading()
        return false
      }else if(nDays < 30){
        this.$message.error("学期时间长度限制不可少于1个月");
        this.$_hideLoading()
        return false
      }
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.AEInStatus === 2) {
              updateTerm(queryParams).then(res => {
                console.log(res);
                this.addEditInDialog = false;
                this.$nextTick(() => {
                  this.$_hideLoading()
                })
                this.$message.success('修改成功');
                this.getTermData();
              }).catch(e => {
                console.log(e);
                this.$_hideLoading()
              })
            } else if (this.AEInStatus === 1) {
              addTerm(queryParams).then(res =>{
                console.log("addTermaddTermaddTermaddTerm",res);
                this.$message.success('新增成功');
                this.addEditInDialog = false;
                this.$nextTick(() => {
                  this.$_hideLoading()
                })
                this.$store.dispatch("ResetSchoolYear");
                this.yearOptionsAll= [{schoolYear: '全部学年',uid: null,yearAfter: true}]
                this.getSchoolYear();
                this.getTermData();
              }).catch(e =>{
                console.log(e);
                this.$_hideLoading()
              })
            }
          }else {
            this.$nextTick(() => {
                this.$_hideLoading()
            })
          }
        })
      })
    },
    //删除
    onDelete (obj) {
      this.deleteItem = Object.assign({}, obj);
      this.deleteDialog = true
    },
    //确定删除
    onConfirmDelete () {
      this.$_showLoading()
      let queryParams = {
        schoolId: this.schoolId,
        yearId: this.deleteItem.yearId,
      };
      deleteTerm(queryParams).then(res => {
        console.log(res);
        this.deleteDialog = false;
        this.$nextTick(() => {
            this.$_hideLoading()
        })
        this.$message.success('删除成功');
        this.$store.dispatch("ResetSchoolYear");
        this.yearOptionsAll= [{schoolYear: '全部学年',uid: null,yearAfter: true}]
        this.getSchoolYear();
        this.getTermData();
      }).catch(e => {
        console.log(e);
        this.$_hideLoading()
        this.deleteDialog = false;
      }) 
    },
  },
  components: {
    // [Pagination.name]: Pagination
  }
}
</script>
<style lang="scss" scoped>
.term-man {
  width: 100%;
  height: 100%;
  .term-scroll {
    width: 100%;    
    height: calc(100% - 50px);
    .term-info {
        height: 100%;
        padding: 14px 20px 0;
        border-top: 1px solid $border-color;
      }
  }
}
</style>
<style lang="scss">
.term-scroll {
  .__view {
    width: 100% !important;
  }
  .term-info{
    .el-table td {
          padding: 0;
          border-right: 1px solid $table-color8;
          .cell {
            padding-left: 0;
            padding-right: 0;
            line-height: 50px;
            p:first-of-type{
              border-bottom: 1px solid $table-color8;
            }
        }
        &:last-child {
          border-right: none;
        }
    }
  }
}

</style>

