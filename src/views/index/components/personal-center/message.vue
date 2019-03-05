<template>
  <div class="message">
    <vue-scroll>
      <!-- 个人资料 -->
      <div class="person-message">
        <router-link to="/personal-center/account-setting"></router-link>
        <div class="person-logo">
          <div class="logo-wrap">
            <img v-if="userLogo !== ''" :src="userLogo" alt>
            <img v-else src="../../../../assets/img/defaltuser.png" alt>
          </div>
          <div class="message">
            <p>{{userInfo.userName}}</p>
            <p>{{userInfo.userMobile}}</p>
          </div>
          <div class="account">
            <router-link to="/personal-center/account-setting" title="帐号设置">
              <i class="iconfont">&#xe625;</i>
            </router-link>
          </div>
        </div>
      </div>
      <!--页面主体 -->
      <div class="person-school">
        <!-- 学校title -->
        <div class="backgroundwhite">
          <div class="good-title width1200">
            <p class="fl-title fl">我的学校</p>
            <div v-if="schoolInfoList.length > 0" class="button-wrapper fr">
              <el-button type="primary" class="def-button" @click="createSchool">开通学校</el-button>
              <el-button type="primary" class="def-button" @click="applyToSchool">申请入校</el-button>
            </div>
          </div>
        </div>
        <!-- 无学校展示样式 -->
        <div class="no-school" v-if="schoolInfoList.length <= 0">
          <img src="../../../../assets/img/no-school.png" alt>
          <p>您还暂未加入任何学校，请先申请加入学校或开通学校</p>
          <div class="no-school-button">
            <el-button type="primary" class="def-button" @click="applyToSchool">申请入校</el-button>
            <el-button type="primary" class="def-button" @click="createSchool">开通学校</el-button>
          </div>
        </div>

        <!-- 学校卡片列表 -->
        <div class="card-wrapper width1200 clearfix" v-if="schoolInfoList.length > 0">
          <div
            class="school-item-card backgroundwhite clearfix"
            v-for="(item, index) in schoolInfoList"
            :key="'school_' + index"
            @click="enterWorkingTable(item)"
            :title="item.fullName"
          >
            <!-- 退出学校按钮 -->
            <div class="eixt-icon" :class="{ CommonUser: item.roleType === 'COMMON' || item.roleType === 'ADMIN' }">
              <a title="退出学校" @click.stop="eixtSchool(item)">
                <i class="el-icon-close"></i>
              </a>
            </div>
            <!-- 是否到期样式 -->
            <div
              class="school-expired"
              :class="{ haveExpired: (item.accountType === 1 && item.schoolState === 2) || (item.accountType === 2 && item.schoolState === 2) }"
            >
              <p class="expired-icon">
                <i class="iconfont icon-jingshi"></i>
              </p>
              <p class="expired-text">{{ isExpired(item, item.roleType, false) }}</p>
            </div>

            <div class="item-left fl">
              <img v-if="item.schoolLogo !== ''" :src="item.schoolLogo" alt>
              <img v-else src="../../../../assets/img/default_school.png" alt>
            </div>
            <div class="item-right fl">
              <p class="textoverflow-single">{{item.fullName}}</p>
              <p>
                <i class="iconfont">&#xe6f9;</i>
                {{item.chargeUserName || '暂无角色'}}
              </p>
            </div>
          </div>
        </div>
        <!--我的申请记录 -->
        <div class="application-record width1200" v-if="userApplyList.length > 0">
          <div class="good-title">
            <p class="fl-title">申请记录</p>
          </div>
          <div class="table-wrap">
            <el-table :data="userApplyList" border class="table-comp">
              <el-table-column align="center" prop="fullName" width="172" label="申请学校"></el-table-column>
              <el-table-column align="center" label="状态">
                <template
                  slot-scope="scope"
                >{{ dicFormater( 'BASE_SCHOOL_INFO_APPROVAL_STATE', scope.row.approvalState) }}</template>
              </el-table-column>
              <el-table-column align="center" label="申请时间">
                <template slot-scope="scope">{{ scope.row.addTime | moment('yyyy-MM-dd') }}</template>
              </el-table-column>
              <el-table-column align="center" prop="approvalContent" label="不通过理由"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </vue-scroll>

    <!-- 申请入校模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'申请入校'"
      width="460px"
      :visible.sync="applyJoinSchoolDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p class="alert-msg">请选择加入学校，申请提交后，学校将尽快审核。</p>
      <div class="trial-form">
        <el-form
          :model="applyJoinSchoolForm"
          :rules="applyJoinRules"
          ref="applyJoinSchoolForm"
          label-width="80px"
        >
          <el-form-item prop="provinceJoin" class="area" label="学校地址">
            <el-select
              v-model="applyJoinSchoolForm.provinceJoin"
              placeholder="省"
              class="school-address"
              @change="provinceChange"
              value-key="uid"
            >
              <el-option
                v-for="(item, index) in selectApplyProvinceList"
                :key="index + 'selectApplyProvinceList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cityJoin" class="area" label-width="0px">
            <el-select
              v-model="applyJoinSchoolForm.cityJoin"
              placeholder="市"
              class="school-address"
              value-key="uid"
              @change="cityChange"
            >
              <el-option
                v-for="(item, index) in selectApplyCityList"
                :key="index + 'selectApplyCityList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="areaJoin" class="area" label-width="0px">
            <el-select
              v-model="applyJoinSchoolForm.areaJoin"
              placeholder="区/县"
              class="school-address"
              value-key="uid"
              @change="areaChange"
            >
              <el-option
                v-for="(item, index) in selectApplyareaList"
                :key="index + 'selectApplyareaList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="school" label="学校名称">
            <el-select v-model="applyJoinSchoolForm.school" filterable clearable placeholder="请选择学校">
              <el-option
                v-for="(item, index) in selectApplySchoolList"
                :label="item.fullName"
                :value="item.uid"
                :key="index + 'applySchoolList'"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="applyName" label="姓名">
            <el-input v-model="applyJoinSchoolForm.applyName" placeholder="请输入您的姓名"></el-input>
          </el-form-item>
          <el-form-item prop="enterRemark" label="备注信息">
            <el-input
              type="textarea"
              :rows="4"
              v-model="applyJoinSchoolForm.enterRemark"
              placeholder="请输入备注信息"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="def-button" @click="submitApplyToSchoolForm">提交申请</el-button>
      </span>
    </el-dialog>
    <!-- 开通学校模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'开通学校'"
      width="460px"
      :visible.sync="createSchoolDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p class="alert-msg">请填写信息，工作人员将尽快与您联系。</p>
      <div class="trial-form">
        <el-form
          :model="createSchoolForm"
          :rules="createSchoolRules"
          ref="createSchoolForm"
          label-width="80px"
        >
          <el-form-item prop="provinceCreate" class="area" label="学校地址">
            <el-select
              v-model="createSchoolForm.provinceCreate"
              placeholder="省"
              class="school-address"
              @change="provinceChangeTwo"
              value-key="uid"
            >
              <el-option
                v-for="(item, index) in selectApplyProvinceList"
                :key="index + 'selectApplyProvinceList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cityCreate" class="area" label-width="0px">
            <el-select
              v-model="createSchoolForm.cityCreate"
              placeholder="市"
              class="school-address"
              value-key="uid"
              @change="cityChangeTwo"
            >
              <el-option
                v-for="(item, index) in selectApplyCityList"
                :key="index + 'selectApplyCityList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="areaCreate" class="area" label-width="0px">
            <el-select
              v-model="createSchoolForm.areaCreate"
              placeholder="区/县"
              class="school-address"
              value-key="uid"
            >
              <el-option
                v-for="(item, index) in selectApplyareaList"
                :key="index + 'selectApplyareaList'"
                :label="item.cname"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="fullName" label="学校名称">
            <el-input v-model="createSchoolForm.fullName" placeholder="请输入输入学校名称(必填)"></el-input>
          </el-form-item>
          <el-form-item label="涵盖学段" prop="stageTypes">
            <el-checkbox-group v-model="createSchoolForm.stageTypes">
              <el-checkbox
                v-for="(item, index) in periodListFormDic"
                :key="index + 'periodListFormDic'"
                :label="item.enumValue"
                name="stageTypes"
              >{{item.enumField}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="linkmanPhone" label="联系方式">
            <el-input v-model="createSchoolForm.linkmanPhone" disabled placeholder="请输入您的手机号(必填)"></el-input>
          </el-form-item>
          <el-form-item prop="linkmanName" label="姓名">
            <el-input v-model="createSchoolForm.linkmanName" disabled placeholder="请输入您的姓名(必填)"></el-input>
          </el-form-item>
          <el-form-item prop="agreement">
            <el-checkbox v-model="createSchoolForm.agreement">
              已阅读并同意&nbsp;
              <a class="agreement" target="_blank" :href="ADDPREFIX">《奥昇教育平台使用协议》</a>
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="def-button" @click="submitCreateSchoolForm">提交申请</el-button>
      </span>
    </el-dialog>

    <!-- 通知提交成功模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'申请成功'"
      width="360px"
      :visible.sync="successDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p class="success-tips color-blue" v-if="schoolSuccess">
        <i class="iconfont">&#xe6f7;</i>
        <span>您的入驻申请已成功提交</span>
      </p>
      <p class="success-tips">{{successTips}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="def-button" @click="successDialog = false;">确定</el-button>
      </span>
    </el-dialog>

    <!-- 通知退出学校模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'退出确认'"
      width="360px"
      :visible.sync="exitSchoolDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-box">确定要退出{{exitSchoolInfo.fullName}}吗？退出学校后，无法查看跟学校相关信息</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="def-button" @click="confirmEixtSchool">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  userEnterSchools,
  addNewSchool,
  getApplyForRecord,
  getSchoolListByAreaId,
  exitSchool,
  getAllAreaLevel
} from "../../store/api.js";
import { checkTel } from "../../../../utils/validator.js";
import envConfig from "@/config"; // base请求地址

export default {
  name: "Message",
  data() {
    var agreementValidate = (rule, value, callback) => {
      // 验证是否勾选协议
      if (value) {
        callback();
      } else {
        callback(new Error("请阅读并勾选使用协议"));
      }
    };
    return {
      userLogo: "", // 用户头像地址
      haveUserLogo: false, // 是否有头像
      ADDPREFIX: envConfig.ADDPREFIX + "/personal-center/user-agreement", // 用户协议地址
      FILEPATH: envConfig.FILEPATH,
      userInfo: {}, // 用户信息
      currentSchool: {}, // 当前用户信息
      currentRole: {}, // 当前权限
      schoolInfoList: [], // 学校列表数据
      userApplyList: [], // 申请记录表格数据
      periodListFormDic: [], // 学段列表
      applyJoinSchoolDialog: false, // 申请入校的模态框
      applyJoinSchoolForm: {
        // 申请入校的表单
        provinceJoin: "",
        cityJoin: "",
        areaJoin: "",
        applyName: "",
        school: "",
        enterRemark: ""
      },
      applyJoinRules: {
        provinceJoin: [
          { required: true, message: "省不能为空", trigger: "blur" }
        ],
        cityJoin: [{ required: true, message: "市不能为空", trigger: "blur" }],
        areaJoin: [
          { required: true, message: "区/县不能为空", trigger: "blur" }
        ],
        school: [
          { required: true, message: "学校名称不能为空", trigger: "blur" }
        ],
        applyName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        enterRemark: [
          { max: 100, message: "长度在100个字符以下", trigger: "blur" }
        ]
      },
      selectApplySchoolList: [], // 申请入校时下拉框学校数组
      selectApplyProvinceList: [], // 申请入校时下拉框省数组
      selectApplyCityList: [], // 申请入校时下拉框城市数组
      selectApplyareaList: [], // 申请入校时下拉框区县数组
      createSchoolDialog: false, // 开通学校的模态框
      createSchoolForm: {
        // 开通学校的表单
        provinceCreate: "",
        cityCreate: "",
        areaCreate: "",
        fullName: "",
        stageTypes: [],
        linkmanPhone: "",
        linkmanName: "",
        agreement: ""
      },
      createSchoolRules: {
        provinceCreate: [
          { required: true, message: "省不能为空", trigger: "blur" }
        ],
        cityCreate: [
          { required: true, message: "市不能为空", trigger: "blur" }
        ],
        areaCreate: [
          { required: true, message: "区/县不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "学校名称不能为空", trigger: "blur" }
        ],
        stageTypes: [
          { required: true, message: "学段不能为空", trigger: "blur" }
        ],
        linkmanPhone: [{ validator: checkTel, trigger: "blur" }],
        linkmanName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        agreement: [{ validator: agreementValidate, trigger: "blur" }]
      },
      successDialog: false, // 提醒模态框是否打开
      successTips: "",
      schoolSuccess: false, // 是否是申请入驻学校状态
      exitSchoolDialog: false, // 退出学校模态框是否打开
      exitSchoolInfo: {} // 退出的学校信息
    };
  },
  methods: {
    enterWorkingTable(school) {
      if (!this.canEnterWorkTable(school, school.roleType)) {
        return;
      }
      this.$store.dispatch("SetCurrentSchool", JSON.stringify(school)); // 切换当前学校(修改本地的当前学校信息)
      this.$store.dispatch("ResetSchoolYear"); // 清理学年学期
      this.$router.push({ path: "/working-table/manager" }); // 进入工作台
    },
    applyToSchool() {
      // 打开申请入校模态框
      this.applyJoinSchoolDialog = true;
      this.resetApplyToSchoolForm(); // 清空申请入校表单
      this.selectApplyCityList = []; // 清空市
      this.selectApplyareaList = []; // 清空区
      this.selectApplySchoolList = []; // 清空学校列表
    },
    provinceChange(city) {
      // 省下拉框的change回调
      this.selectApplyCityList = city.childList;
      if (this.selectApplyCityList) {
        this.applyJoinSchoolForm.cityJoin = this.selectApplyCityList[0];
        this.cityChange(this.applyJoinSchoolForm.cityJoin);
      } else {
        this.applyJoinSchoolForm.cityJoin = "";
      }
    },
    provinceChangeTwo(city) {
      // 省下拉框的change回调
      this.selectApplyCityList = city.childList;
      if (this.selectApplyCityList) {
        this.createSchoolForm.cityCreate = this.selectApplyCityList[0];
        this.cityChangeTwo(this.createSchoolForm.cityCreate);
      } else {
        this.createSchoolForm.cityCreate = "";
      }
    },
    cityChange(area) {
      // 市下拉框的change回调
      this.selectApplyareaList = area.childList;
      if (this.selectApplyareaList) {
        this.applyJoinSchoolForm.areaJoin = this.selectApplyareaList[0];
      } else {
        this.applyJoinSchoolForm.areaJoin = "";
      }
      this.areaChange();
    },
    cityChangeTwo(area) {
      // 市下拉框的change回调
      this.selectApplyareaList = area.childList;
      if (this.selectApplyareaList) {
        this.createSchoolForm.areaCreate = this.selectApplyareaList[0];
      } else {
        this.createSchoolForm.areaCreate = "";
      }
    },
    areaChange() {
      // 区/县change回调
      let submitData = {
        provinceId: this.applyJoinSchoolForm.provinceJoin.uid,
        cityId: this.applyJoinSchoolForm.cityJoin.uid
      };
      if (this.applyJoinSchoolForm.areaJoin) {
        submitData['areaId'] = this.applyJoinSchoolForm.areaJoin.uid;
      }
      this.applyJoinSchoolForm.school = ""; // 清空选中的学校
      this.$_showLoading({
        // 打开加载效果
        text: "加载中..."
      });
      getSchoolListByAreaId(submitData)
        .then(res => {
          this.selectApplySchoolList = res.data; // 获取到学校列表
          this.$_hideLoading(); // 关闭加载效果
        })
        .catch(() => {
          this.$_hideLoading(); // 关闭加载效果
        });
    },
    submitApplyToSchoolForm() {
      // 提交申请入校的表单
      this.$refs.applyJoinSchoolForm.validate(valid => {
        if (valid) {
          this.$_showLoading({
            // 打开加载效果
            text: "加载中..."
          });
          const submitData = {
            userId: this.userInfo.uid,
            applyName: this.applyJoinSchoolForm.applyName,
            schoolId: this.applyJoinSchoolForm.school,
            enterRemark: this.applyJoinSchoolForm.enterRemark,
            approvalSource: 1 // 代表web门户
          };
          userEnterSchools(submitData)
            .then(() => {
              this.refreshApplyList(); // 刷新用户的申请记录
              this.applyJoinSchoolDialog = false; // 关闭申请入校模态框
              // 打开成功的模态框
              this.successTips = "请耐心等候学校审核！";
              this.successDialog = true;
              this.schoolSuccess = true;
              this.$_hideLoading(); // 关闭加载效果
            })
            .catch(() => {
              this.$_hideLoading(); // 关闭加载效果
            });
        } else {
          return false;
        }
      });
    },
    resetApplyToSchoolForm() {
      // 重置申请入校表单
      if (this.$refs.applyJoinSchoolForm) {
        this.$refs.applyJoinSchoolForm.resetFields();
      }
    },
    createSchool() {
      this.createSchoolDialog = true; // 打开开通学校模态框
      this.resetCreateSchoolForm(); // 重置开通学校表单
      this.selectApplyCityList = [];
      this.selectApplyareaList = [];
      this.resetApplyToSchoolForm();
    },
    submitCreateSchoolForm() {
      // 提交开通学校的表单
      this.$refs.createSchoolForm.validate(valid => {
        if (valid) {
          this.$_showLoading({
            // 打开加载效果
            text: "加载中..."
          });
          const submitData = {
            provinceId: this.createSchoolForm.provinceCreate.uid,
            provinceName: this.createSchoolForm.provinceCreate.cname,
            cityId: this.createSchoolForm.cityCreate.uid,
            cityName: this.createSchoolForm.cityCreate.cname,
            areaId: this.createSchoolForm.areaCreate.uid,
            areaName: this.createSchoolForm.areaCreate.cname,
            fullName: this.createSchoolForm.fullName,
            stageTypes: this.createSchoolForm.stageTypes,
            linkmanPhone: this.createSchoolForm.linkmanPhone,
            linkmanName: this.createSchoolForm.linkmanName,
            approvalType: 2
          };
          addNewSchool(submitData)
            .then(() => {
              this.createSchoolDialog = false; // 关闭开通学校模态框
              // 打开成功的模态框
              this.successTips = "我们会尽快与您联系，请保持手机畅通。";
              this.successDialog = true;
              this.schoolSuccess = false;
              this.$_hideLoading(); // 关闭加载效果
            })
            .catch(() => {
              this.$_hideLoading(); // 关闭加载效果
            });
        } else {
          return false;
        }
      });
    },
    resetCreateSchoolForm() {
      // 重置申请入校表单
      if (this.$refs.createSchoolForm) {
        this.$refs.createSchoolForm.resetFields();
      }
    },
    eixtSchool(exitSchoolInfo) {
      this.exitSchoolInfo = exitSchoolInfo;
      this.exitSchoolDialog = true; // 打开退出学校模态框
    },
    confirmEixtSchool() {
      // 确定退出这个学校
      this.$_showLoading({
        // 打开加载效果
        text: "加载中..."
      });
      const submitData = {
        userId: this.userInfo.uid,
        schoolId: this.exitSchoolInfo.uid
      };
      exitSchool(submitData)
        .then(() => {
          this.$message.success("您已经成功退出");
          this.$store.commit("EXIT_SCHOOL", submitData.schoolId); // 退出学校
          this.exitSchoolDialog = false; // 关闭模态框
          this.$_hideLoading(); // 关闭加载效果
        })
        .catch(() => {
          this.$_hideLoading(); // 关闭加载效果
        });
    },
    refreshApplyList() {
      // 查询用户的申请记录
      getApplyForRecord({ userId: this.userInfo.uid })
        .then(res => {
          this.userApplyList = res.data;
        })
        .catch(() => {});
    },
    // 是否可以调转到工作台
    canEnterWorkTable(currentSchool, roleType) {
      if (!currentSchool || !roleType) {
        return false;
      }
      if (currentSchool.accountType === 2 && currentSchool.schoolState === 2) {
        return false;
      } else if (
        currentSchool.accountType === 1 &&
        currentSchool.schoolState === 2
      ) {
        // 学校开通到期
        return false;
      }
      return true;
    },
    // 判断当前学校是否试用，开通到期
    isExpired(currentSchool, roleType, isInit) {
      let showWarning;
      if (!currentSchool || !roleType) {
        return;
      }
      if (currentSchool.accountType === 2 && currentSchool.schoolState === 2) {
        // 学校试用到期
        if (roleType === "COMMON") {
          // 普通用户
          showWarning = "系统提醒：您的学校试用已到期，请联系学校管理员。";
        } else {
          showWarning =
            "系统提醒：您的学校试用已到期，请联系工作人员，联系电话：0731-89721858";
        }
        if (isInit) {
          // 如果是初始化调用
          this.$message.warning(showWarning);
        }
      } else if (
        currentSchool.accountType === 1 &&
        currentSchool.schoolState === 2
      ) {
        // 学校开通到期
        if (roleType === "COMMON") {
          // 普通用户
          showWarning = "系统提醒：您的学校已到期，请联系学校管理员。";
        } else {
          showWarning =
            "系统提醒：您的学校已到期，请联系工作人员，联系电话：0731-89721858";
        }
        if (isInit) {
          // 如果是初始化调用
          this.$message.warning(showWarning);
        }
      }
      return showWarning; // 返回一个提示字符串
    },
    messagePageInit() {
      this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
      this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校
      this.currentRole = this.$store.state.user.currentRole; // 获取到当前权限
      // 判断当前学校是否试用，开通到期
      if (this.currentRole && this.currentSchool) {
        this.isExpired(this.currentSchool, this.currentRole.roleType, true);
      }
      if (this.userInfo.imageThumbnailName) {
        // 拼接用户头像
        this.userLogo =
          this.FILEPATH +
          this.userInfo.imagePath +
          "/" +
          this.userInfo.imagePathName;
      } else {
        this.userLogo = "";
      }
      if (
        this.$store.state.user.schoolInfoList &&
        this.$store.state.user.roleList
      ) {
        // 获取到学校的列表
        const roleList = this.$store.state.user.roleList; // 获取权限列表
        // 拼接学校头像
        this.schoolInfoList = this.$store.state.user.schoolInfoList.map(
          item => {
            if (item.appendixInfoList.length) {
              const schoolLogoArr = item.appendixInfoList.filter(sonItem => {
                return sonItem.otherFlag === 1;
              });
              if (schoolLogoArr.length) {
                item["schoolLogo"] =
                  this.FILEPATH +
                  schoolLogoArr[0].filePath +
                  "/" +
                  schoolLogoArr[0].filePathName;
              } else {
                item["schoolLogo"] = "";
              }
            } else {
              item["schoolLogo"] = "";
            }
            return item;
          }
        );
        for (let i = 0; i < this.schoolInfoList.length; i++) {
          // 计算出此人的权限信息
          let organId = this.schoolInfoList[i]["organId"];
          for (let j = 0; j < roleList.length; j++) {
            let uid = roleList[j]["organId"];
            if (organId === uid) {
              this.schoolInfoList[i]["chargeUserName"] =
                roleList[j]["roleName"];
              this.schoolInfoList[i]["roleType"] = roleList[j]["roleType"];
              break;
            }
          }
        }
      }
      this.refreshApplyList(); // 查询用户的申请记录
      // 将开通学校的姓名与电话初始化
      this.createSchoolForm.linkmanName = this.userInfo.userName;
      this.createSchoolForm.linkmanPhone = this.userInfo.userMobile;
      this.applyJoinSchoolForm.applyName = this.userInfo.userName;
      // 将省市区联动信息初始化
      getAllAreaLevel().then(res => {
        this.selectApplyProvinceList = res.data.childList;
      });
      // 获取到学段字典信息
      this.periodListFormDic = this.dicFormater("SYS_BASE_STAGE_TYPE");
    }
  },
  mounted() {
    this.messagePageInit(); // 初始化页面
  }
};
</script>
<style lang="scss" scoped>
.message {
  height: calc(100% - 100px);
  position: relative;
  background-color: $person-color14;
  .good-title {
    // 标题公共样式
    height: 50px;
    overflow: hidden;
    .fl-title {
      border-left: 4px solid $title-color2;
      color: $font-color;
      line-height: 16px;
      margin: 17px 0;
      font-weight: bold;
      text-indent: 10px;
      font-size: 14px;
    }
    .button-wrapper {
      .el-button {
        width: 80px;
        height: 32px;
        margin-top: 9px;
        background: $person-color17;
      }
      .el-button:nth-of-type(2) {
        margin-left: 12px;
        background: $person-color6;
      }
    }
  }
  // 灰色背景
  .backgroundgray {
    background-color: $person-color19;
  }
  // 白色背景
  .backgroundwhite {
    background-color: $person-color1;
  }
  .person-message {
    // 个人中心
    background-color: transparent; // 不继承父元素的背景色
    height: 160px;
    background: url(../../../../assets/img/person-logo.png) no-repeat;
    background-size: 100%;
    text-align: center;
    .person-logo {
      position: relative;
      padding-top: 36px;
      width: 252px;
      height: 86px;
      margin: 0 auto;
      font-size: 16px;
      .logo-wrap {
        float: left;
        width: 86px;
        height: 86px;
        margin: 0 auto;
        border-radius: 50%;
        background: $person-color3;
        // opacity: 0.42;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 3px;
          display: block;
        }
      }
      .message {
        float: left;
        background-color: transparent; // 不继承父元素的背景色
        padding: 22px 0 0 20px;
        height: 86px;
        p {
          color: $person-color1;
          text-align: left;
          line-height: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 116px;
        }
        p:nth-of-type(2) {
          padding-top: 14px;
        }
      }
      .account {
        position: absolute;
        right: 0;
        top: 52px;
        width: 26px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: $person-color6;
        border-radius: 50%;
        a {
          color: $person-color1;
        }
      }
    }
    p:nth-of-type(1) {
      font-weight: bold;
      line-height: 38px;
      text-align: center;
      color: $person-color2;
    }
    p:nth-of-type(2) {
      line-height: 20px;
      font-size: 14px;
      text-align: center;
      color: $person-color2;
    }
  }
  .person-school {
    // 学校信息
    height: calc(100% - 160px);
    position: relative;
    .no-school {
      min-height: 420px;
      // 没有学校的样式
      text-align: center;
      img {
        padding-top: 58px;
      }
      p {
        line-height: 40px;
        color: $person-color4;
      }
      .no-school-button {
        width: 280px;
        margin: 48px auto;
        .el-button {
          width: 120px;
          color: $person-color1;
          background: $person-color17;
          margin: 0 10px;
          height: 40px;
        }
        .el-button:nth-of-type(2) {
          background: $person-color6;
        }
      }
    }
    .card-wrapper {
      .school-item-card {
        margin: 20px 0 20px 22px;
        box-sizing: border-box;
        padding: 15px 0 15px 15px;
        width: 280px;
        border: 1px solid $person-color5;
        font-size: 14px;
        float: left;
        position: relative;
        border-radius: 4px;
        cursor: pointer;
        .eixt-icon {
          width: 20px;
          opacity: 0;
          height: 20px;
          background: $person-color18;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 8;
          font-size: 17px;
          text-align: center;
          line-height: 20px;
          display: none;
          .el-icon-close {
            color: $person-color1;
          }
          a {
            color: $person-color9;
          }
        }
        // 学校是否到期
        .school-expired {
          position: absolute;
          height: 132px;
          width: 100%;
          left: 0;
          top: 0;
          z-index: 10;
          background: $person-color21;
          opacity: 0.6;
          border-radius: 4px;
          cursor: not-allowed;
          opacity: 0;
          display: none;
          text-align: center;
          .expired-icon {
            i {
              font-size: 36px;
              padding-top: 12px;
              color: $person-color20;
            }
          }
          .expired-text {
            margin: 0 auto;
            width: 204px;
            padding-top: 12px;
            font-size: 14px;
            line-height: 20px;
            color: $person-color20;
          }
        }
        .CommonUser {
          // 普通用户展示删除按钮
          display: block;
        }
        .haveExpired {
          // 学校已经到期了
          display: block;
        }
        &:hover {
          .eixt-icon {
            opacity: 1;
          }
          .school-expired {
            opacity: 0.6;
          }
        }
        .item-left {
          width: 100px;
          height: 100px;
          img {
            width: 100px;
            height: 100px;
            display: block;
            border-radius: 50%;
          }
        }
        .item-right {
          margin-left: 20px;
          padding-top: 22px;
          width: 136px;
          p:nth-of-type(1) {
            font-size: 18px;
            color: $person-color8;
          }
          p:nth-of-type(2) {
            color: $person-color4;
            padding-top: 15px;
            i {
              font-size: 18px;
              padding-right: 8px;
            }
          }
        }
      }
    }
    .school-item-card:nth-of-type(4n + 1) {
      margin-left: 0;
    }
  }
  .application-record {
    padding-bottom: 38px;
    .table-wrap {
      padding-top: 4px;
    }
  }
  .trial-form {
    .area {
      display: inline-block;
      margin-right: 12px;
    }
    .area:nth-of-type(3) {
      margin-right: 0px;
    }
    .school-address {
      width: 92px;
    }
    .button-center {
      text-align: center;
      margin: 48px 0 68px 0;
    }
  }
}
</style>
<style lang="scss">
// 模态框样式覆盖
.message {
  .el-button {
    // 按钮默认样式
    border-radius: 4px;
    border: none;
    padding: 0;
  }
  .dialog-comp {
    .el-dialog__body {
      font-size: 14px;
      .success-tips {
        line-height: 24px;
        color: $working-color9;
        text-align: center;
        i {
          font-size: 24px;
          padding-right: 10px;
        }
      }
      .success-tips:nth-last-of-type(1) {
        padding-top: 22px;
        padding-bottom: 20px;
      }
      .color-blue {
        color: $working-color1;
        font-size: 16px;
        line-height: 32px;
      }
      .agreement {
        // 阅读协议的样式
        color: $person-color9;
      }
      .el-form-item__label {
        text-align: right;
      }
    }
  }
}
</style>

