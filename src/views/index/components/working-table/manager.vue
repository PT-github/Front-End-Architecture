<template>
  <div class="manager-wrapper">
    <vue-scroll>
      <div class="manager-title">
        <s-title :title="'工作台'" :showBack="false" :haveBorder="true"></s-title>
        <router-link
          v-if="currentSchool.isCertificate === 2 && (currentRole.roleType === 'ADMIN' || currentRole.roleType === 'CJADMIN')"
          :to="{path:'/working-table/school-accreditation'}"
          class="school-authentication"
        >未通过学校认证，立即认证》</router-link>
      </div>
      <el-row :gutter="18" style="margin: 0px" class="manager-body">
        <!-- 左边页面(管理员页面) -->
        <el-col
          :span="18"
          class="left-mana"
          v-if="currentRole.roleType === 'ADMIN' || currentRole.roleType === 'CJADMIN'"
        >
          <!-- 左上 -->
          <el-row :gutter="18" class="left-top">
            <!-- 学校信息 -->
            <el-col :span="16">
              <div class="school-message border-radi">
                <div class="school-top clearfix">
                  <div class="school-logo fl">
                    <img v-if="schoolLogo" :src="schoolLogo" alt>
                    <!-- 默认学校头像 -->
                    <img v-else src="../../../../assets/img/default_school_two.png" alt>
                    <p class="update-logo" @click="uploadLogo">
                      <i class="iconfont icon-xiugai"></i>
                      <span>修改</span>
                    </p>
                  </div>
                  <div class="school-tips fl">
                    <router-link :to="{path:'/working-table/school-accreditation'}">
                      <div
                        class="school-name"
                        v-bind:class="{ isCertificate: currentSchool.isCertificate === 1 }"
                      >
                        <p class="textoverflow-single">{{currentSchool.fullName}}</p>
                      </div>
                    </router-link>
                    <!-- 学校的地址和学段信息 -->
                    <div class="school-area">
                      <p>{{ currentSchool.provinceName + currentSchool.cityName + currentSchool.areaName }}</p>
                      <p>{{ periodMess }}</p>
                    </div>
                    <div class="tel">
                      <i class="iconfont icon-dianhua"></i>
                      <span>{{userInfo.userMobile}}</span>
                      <span @click="updateTelphone">修改</span>
                    </div>
                  </div>
                </div>
                <ul class="school-bottom clearfix">
                  <li>
                    <div class="value">{{correlationInfo.classNumber || 0}}</div>
                    <div class="key">班级个数</div>
                  </li>
                  <li>
                    <div class="value">{{correlationInfo.teacherNumber || 0}}</div>
                    <div class="key">教师人数</div>
                  </li>
                  <li>
                    <div class="value">{{correlationInfo.courseChangeNumber || 0}}</div>
                    <div class="key">本月调课课量</div>
                  </li>
                  <li>
                    <div class="value">{{correlationInfo.tipsayNumber || 0}}</div>
                    <div class="key">本月代课课量</div>
                  </li>
                </ul>
                <div
                  class="account-identify"
                  :class="{ noformal: currentSchool.accountType !== 1 }"
                >
                  <p class="rotate" v-if="currentSchool.accountType === null">试用账号</p>
                  <p
                    class="rotate"
                    v-else
                  >{{ dicFormater('BASE_SCHOOL_INFO_ACCOUNT_TYPE', currentSchool.accountType) }}</p>
                </div>
              </div>
            </el-col>
            <!-- 代办事项 -->
            <el-col :span="8">
              <div class="border-radi todo-list">
                <div class="good-title">
                  <p class="fl-title fl">待办事项</p>
                </div>
                <ul class="todo-item clearfix">
                  <li @click="skipToPage('/platform/user-audit')">
                    <div>
                      <div>
                        <i class="iconfont icon-shenqing"></i>
                      </div>
                      <div>入校待审核</div>
                      <div>{{correlationInfo.schoolToaudit || 0}}</div>
                      <div>人</div>
                    </div>
                  </li>
                  <li @click="skipToPage('/approval-management/approval-info')">
                    <div>
                      <div>
                        <i class="iconfont icon-tiaoke"></i>
                      </div>
                      <div>调课待审批</div>
                      <div>{{correlationInfo.courseChangeToaudit || 0}}</div>
                      <div>人</div>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
          <!-- 左下快捷入口 -->
          <el-row class="left-bottom">
            <el-col :span="24">
              <div class="fast-entrance">
                <div class="s-tab">
                  <p class="s-title fl" :class="{'active': sTab === 0}" @click="sTab = 0">快捷入口</p>
                  <p class="s-title fl" :class="{'active': sTab === 1}" @click="sTab = 1">我的应用</p>
                </div>
                <ul v-show="sTab === 0" class="fast-list clearfix">
                  <li>
                    <router-link to="/basic/term-info">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon.png" alt>
                      </div>
                      <p class="name">基础数据</p>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/course/course-list">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon5.png" alt>
                      </div>
                      <p class="name">排课系统</p>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/course/total-syllabus">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon1.png" alt>
                      </div>
                      <p class="name">查看课表</p>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/approval-management/wait-approval">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon2.png" alt>
                      </div>
                      <p class="name">调课审批</p>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/approval-management/supply-management">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon3.png" alt>
                      </div>
                      <p class="name">代课管理</p>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/data-statistics/flow-statistics">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon4.png" alt>
                      </div>
                      <p class="name">数据统计</p>
                    </router-link>
                  </li>
                </ul>
                <ul v-show="sTab === 1" class="fast-list clearfix">
                  <li>
                    <div @click="openScore">
                      <div class="icon">
                        <img src="../../../../assets/img/working-icon.png" alt>
                      </div>
                      <p class="name">成绩管理</p>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 左边页面(教师页面) -->
        <el-col :span="18" class="left-teacher" v-if="currentRole.roleType === 'COMMON'">
          <el-row :gutter="18">
            <el-col :span="12" style="min-height:536px;">
              <el-row>
                <!-- 学校信息 -->
                <el-col :span="24">
                  <div class="school-message-two border-radi">
                    <div class="school-top clearfix">
                      <div class="school-logo fl">
                        <img v-if="schoolLogo !== ''" :src="schoolLogo" alt>
                        <!-- 默认学校头像 -->
                        <img v-else src="../../../../assets/img/default_school_two.png" alt>
                      </div>
                      <div class="school-tips fl">
                        <div
                          class="school-name"
                          v-bind:class="{ isCertificate: currentSchool.isCertificate === 1 }"
                        >
                          <p class="textoverflow-single">{{currentSchool.fullName}}</p>
                        </div>
                        <div class="school-area">
                          <p>{{ currentSchool.provinceName + currentSchool.cityName + currentSchool.areaName }}</p>
                          <p>{{ periodMess }}</p>
                        </div>
                      </div>
                    </div>
                    <ul class="school-bottom clearfix">
                      <li>
                        <div class="value">{{correlationInfo.courseChangeNumber || 0}}</div>
                        <div class="key">本月调课课量</div>
                      </li>
                      <li>
                        <div class="value">{{correlationInfo.tipsayNumber || 0}}</div>
                        <div class="key">本月代课课量</div>
                      </li>
                    </ul>
                    <div
                      class="account-identify"
                      :class="{ noformal: currentSchool.accountType !== 1 }"
                    >
                      <p class="rotate" v-if="currentSchool.accountType === null">试用账号</p>
                      <p
                        class="rotate"
                        v-else
                      >{{ dicFormater('BASE_SCHOOL_INFO_ACCOUNT_TYPE', currentSchool.accountType) }}</p>
                    </div>
                  </div>
                </el-col>
                <!-- 快捷入口 -->
                <el-col :span="24">
                  <div style="margin-top: 20px;" class="fast-entrance-two border-radi">
                    <div class="good-title">
                      <p class="fl-title fl">快捷入口</p>
                    </div>
                    <ul class="fast-list clearfix">
                      <li>
                        <router-link to="/main-common/teacher-timetable">
                          <div class="icon">
                            <img src="../../../../assets/img/working-icon.png" alt>
                          </div>
                          <p class="name">查看课表</p>
                        </router-link>
                      </li>
                      <li @click="skipToPage('/main-common/approval-form')">
                        <div class="icon">
                          <img src="../../../../assets/img/working-icon5.png" alt>
                        </div>
                        <p class="name">申请调课</p>
                      </li>
                      <li>
                        <router-link to="/main-common/my-supply-list">
                          <div class="icon">
                            <img src="../../../../assets/img/working-icon1.png" alt>
                          </div>
                          <p class="name">代课查询</p>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <!-- 教师任课统计数据 -->
            <el-col :span="12">
              <div class="data-statistics border-radi">
                <div class="good-title">
                  <p class="fl-title fl">教师任课统计数据</p>
                </div>
                <div class="data-top">
                  <div class="count">
                    <p>任课班级数</p>
                    <p>{{correlationInfo.classCourseCount || 0}}</p>
                    <p>个</p>
                  </div>
                  <div class="count">
                    <p>科目</p>
                    <p>{{correlationInfo.subjectCount || 0}}</p>
                    <p>科</p>
                  </div>
                  <div class="count">
                    <p>周课时</p>
                    <p>{{correlationInfo.weekOfClass || 0}}</p>
                    <p>节</p>
                  </div>
                </div>
                <div class="data-bottom">
                  <el-table :data="tableData" class="table-comp" height="284">
                    <el-table-column align="center" prop="className" width="172" label="任教班级"></el-table-column>
                    <el-table-column align="center" prop="subjectName" label="科目"></el-table-column>
                    <el-table-column align="center" prop="total" label="周课时"></el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 右边显示日历和课程安排 -->
        <el-col :span="6">
          <div class="calendar border-radi">
            <Calendar v-on:choseDay="clickDay"></Calendar>
            <div class="class-list">
              <div class="class-logo">{{classTitle}}</div>
              <vue-scroll>
                <div class="no-class" v-if="showClassList.length <= 0">
                  <div>
                    <i class="iconfont icon-zanwushuju"></i>
                  </div>
                  <p>您暂无课程安排</p>
                </div>
                <div class="have-class" v-else>
                  <p
                    class="class-item"
                    v-for="(item, idx) in showClassList"
                    :key="'showclasslist' + idx"
                  >
                    <span>{{item.className}}</span>
                    <span>{{item.subjectName}}</span>
                    <span>{{item.showTime || '未知时间'}}</span>
                  </p>
                </div>
              </vue-scroll>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 上传头像模态框 -->
      <div class="upload-modal">
        <el-dialog
          class="dialog-comp"
          :title="'上传logo'"
          width="440px"
          :visible.sync="uploadLogoDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="upload-wrapper" v-if="uploadLogoDialog">
            <input
              type="file"
              id="uploads"
              accept="image/png, image/jpeg, image/jpg"
              @change="uploadImg($event)"
            >
            <label for="uploads" class="upload-button">
              <i class="iconfont icon-shangchuantouxiang"></i>&nbsp;上传logo
            </label>
            <p class="upload-tips">仅支持JPEG、JPG、PNG图片文件，且大小不超过2M.</p>
            <!-- 图片裁剪 -->
            <div class="img-shearing" v-if="avatarShow">
              <vueCropper
                ref="cropper"
                :img="avatarShow"
                :autoCrop="autoCrop"
                :autoCropWidth="autoCropWidth"
                :autoCropHeight="autoCropHeight"
                :fixedBox="fixedBox"
                :outputType="outputType"
              ></vueCropper>
            </div>
            <div class="img-shearing no-img" v-else>
              <i class="iconfont icon-wode"></i>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmUploadLogo">确 定</el-button>
            <el-button @click="uploadLogoDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 修改手机号模态框 -->
      <el-dialog
        class="dialog-comp"
        :title="'修改手机号'"
        width="392px"
        :visible.sync="resetTelphoneDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="telphone-form">
          <el-form
            :model="resetTelphoneForm"
            :rules="resetTelphoneRules"
            label-width="92px"
            ref="resetTelphoneForm"
          >
            <el-form-item label="登录密码" prop="userPassword">
              <el-input
                class="width210"
                type="password"
                v-model="resetTelphoneForm.userPassword"
                autocomplete="off"
                placeholder="请输入登录密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="新手机号码" prop="userMobile">
              <el-input
                class="width210"
                v-model="resetTelphoneForm.userMobile"
                autocomplete="off"
                placeholder="请输入新手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="validate-code">
              <el-input v-model="resetTelphoneForm.code" autocomplete="off" placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-button class="validate-button" :disabled="count > 0" @click="getValidateCode">
              <span v-if="validateCodeButtonShow">获取验证码</span>
              <span v-else>{{count}}s</span>
            </el-button>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="submitTelphoneForm">确 定</el-button>
          <el-button @click="resetTelphoneDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </vue-scroll>
  </div>
</template>
<script>
import {
  getUserSchoolInfo,
  smsValidateCodes,
  uploadPhoto,
  schoolAttestation,
  updateUserMobile,
  getClassListByTeacherIndex,
  getClassTimeList,
  getCurrentTerm
} from "../../store/api.js";
import { checkTelAndExist } from "../../../../utils/validator.js";
import envConfig from "@/config"; // base请求地址
import { formatDate } from "../../../../utils/index.js";

export default {
  name: "Manager",
  data() {
    return {
      validateCodeButtonShow: true, // 验证码点击按钮是否显示
      count: "", // 时间
      timer: null, // 定时器
      userInfo: {}, // 用户信息
      periodMess: "", // 学段信息
      currentRole: {}, // 用户的权限信息
      currentSchool: {}, // 用户的学校详情信息
      currentTerm: {}, // 当前学期
      schoolLogo: "", // 学校的头像地址
      userTeacherId: "", // 当前用户的教师UID
      haveSchoolLogo: false, // 是否有学校头像
      correlationInfo: {}, // 用户相关信息
      showClassList: [], // 教师日历课程数组
      classIndexList: [], // 节次时间数组
      tableData: [],
      classTitle: "今日课程",
      uploadLogoDialog: false, // 上传头像模态框是否展示
      outputType: "png", // 图片裁剪输出格式
      avatarShow: null, // 头像展示路径
      autoCrop: true,
      autoCropWidth: 120,
      autoCropHeight: 120,
      fixedBox: true,
      resetTelphoneDialog: false, // 修改手机号的模态框
      resetTelphoneForm: {
        // 修改手机号的表单
        userPassword: "",
        userMobile: "",
        code: ""
      },
      resetTelphoneRules: {
        userPassword: [
          { required: true, message: "登陆密码不能为空", trigger: "blur" }
        ],
        userMobile: [
          { validator: checkTelAndExist, trigger: "blur" },
          { required: true, message: "新手机号不能为空", trigger: "blur" }
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }]
      },
      sTab: 0
    };
  },
  methods: {
    // 快捷入口跳转
    skipToPage(url) {
      this.$router.push({ path: url });
    },
    clickDay(data) {
      // 日历点击回调事件
      let today = new Date();
      today.setTime(today.getTime() - 24 * 60 * 60 * 1000);
      const yesterday =
        today.getFullYear() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getDate();
      let todaytwo = new Date();
      todaytwo.setTime(todaytwo.getTime() + 24 * 60 * 60 * 1000);
      const tomorrow =
        todaytwo.getFullYear() +
        "/" +
        (todaytwo.getMonth() + 1) +
        "/" +
        todaytwo.getDate();
      let todaythree = new Date();
      todaythree.setTime(todaythree.getTime());
      const goodday =
        todaythree.getFullYear() +
        "/" +
        (todaythree.getMonth() + 1) +
        "/" +
        todaythree.getDate();
      if (data === yesterday) {
        this.classTitle = "昨日课程";
      } else if (data === tomorrow) {
        this.classTitle = "明日课程";
      } else if (data === goodday) {
        this.classTitle = "今日课程";
      } else {
        this.classTitle = "当日课程";
      }
      this.handleClass(data);
    },
    uploadLogo() {
      // 打开上传头像模态框
      this.uploadLogoDialog = true;
      this.avatarShow = null;
    },
    //选择本地图片
    uploadImg(e) {
      //上传图片
      var file = e.target.files[0];
      const isLegal = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLegal) {
        this.$message.error("仅支持JPEG、JPG、PNG图片文件!");
        return;
      } else {
        this.outputType = file.type.split("/")[1];
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return;
      }
      this.avatarShow = URL.createObjectURL(file);
    },
    confirmUploadLogo() {
      // 确定上传头像
      this.$refs.cropper.getCropData(data => {
        this.$_showLoading({ text: "头像上传中..." }); // 打开加载效果
        uploadPhoto({ base64Str: String(data.split("base64,")[1]) })
          .then(res => {
            const imageFile = res.data;
            const submitData = {
              uid: this.currentSchool.uid,
              appendixInfoList: [
                {
                  // 学校头像上传
                  contentUid: this.currentSchool.uid,
                  filePath: imageFile.filePath,
                  filePathName: imageFile.fileName,
                  fileType: 1, // 1、图片2、视频
                  imgHeight: imageFile.fileHeight,
                  imgWidth: imageFile.fileWidth,
                  imgSize: imageFile.fileSize,
                  objType: 2,
                  otherFlag: 1, // 其他标识（例如学校有学校头像、许可证、营业执照。分别定义为1、2、3区分）
                  thumbnailName: imageFile.thumbnailFileName,
                  thumbnailPath: imageFile.thumbnailFilePath
                }
              ]
            };
            // 更新学校头像信息
            schoolAttestation(submitData)
              .then(() => {
                this.uploadLogoDialog = false; // 关闭模态框
                this.$message.success("学校头像上传成功");
                this.$store.commit(
                  "UPDATE_SCHOOL_LOGO",
                  submitData.appendixInfoList[0]
                ); // 通知store更新学校头像信息
                this.managePageInit(); // 刷新页面
                this.$_hideLoading(); // 关闭加载效果
              })
              .catch(() => {
                this.$_hideLoading(); // 关闭加载效果
              });
          })
          .catch(() => {
            this.$_hideLoading(); // 关闭加载效果
          });
      });
    },
    updateTelphone() {
      // 打开修改手机号模态框
      this.resetTelphoneDialog = true;
      this.resetTelphone(); // 重置修改手机号表单
    },
    submitTelphoneForm() {
      // 提交修改手机号的表单
      this.$refs.resetTelphoneForm.validate(valid => {
        if (valid) {
          this.$_showLoading({
            // 打开加载效果
            text: "加载中..."
          });
          updateUserMobile(this.resetTelphoneForm)
            .then(() => {
              this.$message.success("修改手机号码成功，请用新号码登录");
              this.resetTelphoneDialog = false; // 关闭修改手机号模态框
              this.$store.commit(
                "UPDATE_USER_MOBILE",
                this.resetTelphoneForm.userMobile
              ); // 更新用户信息
              this.$_hideLoading();
            })
            .catch(() => {
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetTelphone() {
      // 重置修改手机号表单
      if (this.$refs.resetTelphoneForm) {
        this.$refs.resetTelphoneForm.resetFields();
      }
    },
    getValidateCode() {
      // 获取到短信验证码
      let tel = this.resetTelphoneForm.userMobile;
      if (tel) {
        var reg = /^1\d{10}$/;
        if (reg.test(tel)) {
          // 调用接口发送验证码
          const submitData = {
            msgType: 3,
            userMobile: tel
          };
          smsValidateCodes(submitData).then(res => {
            if (res.data) {
              this.$message.success("验证码发送成功，请注意查收.");
              const TIME_COUNT = 60;
              this.count = TIME_COUNT;
              this.validateCodeButtonShow = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.validateCodeButtonShow = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            } else {
              this.$message.error("验证码发送失败");
            }
          });
        } else {
          this.$message({
            message: "请先输正确的手机号再发送验证码!",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "请先输正确的手机号再发送验证码!",
          type: "warning"
        });
      }
    },
    managePageInit() {
      // 页面初始化
      this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
      if (this.$store.state.user.currentRole) {
        // 获取到用户的权限信息
        this.currentRole = this.$store.state.user.currentRole;
        if (!this.currentRole) {
          this.$message.warning("您的权限信息有误，请您重新登录");
          this.$router.push({ path: "/personal-center/message" });
          if (!this.currentRole.roleType) {
            this.$message.warning("您的权限信息有误，请您重新登录");
            this.$router.push({ path: "/personal-center/message" });
          }
        }
      }
      // 获取用户的学校信息
      if (this.$store.state.user.currentSchool) {
        this.currentSchool = this.$store.state.user.currentSchool; // 获取此人的当前学校
        // 取到登录用户的teacherId
        let teacherArr;
        if (this.userInfo.teacherInfoList) {
          teacherArr = this.userInfo.teacherInfoList.filter(item => {
            return item.schoolId === this.currentSchool.uid;
          });
          if (teacherArr.length) {
            this.userTeacherId = teacherArr[0].teacherId;
          }
        }
        this.periodMess = this.currentSchool.stageTypes
          .map(item => {
            // 拼接学段信息
            return this.dicFormater("SYS_BASE_STAGE_TYPE", item);
          })
          .join("/");
        const appendixInfoList = this.currentSchool.appendixInfoList; // 当前学校附件列表
        const schoolLogoArr = appendixInfoList.filter(item => {
          return item.otherFlag === 1;
        });
        if (schoolLogoArr.length) {
          // 拼接学校头像信息
          if (schoolLogoArr[0].filePathName) {
            this.schoolLogo =
              envConfig.FILEPATH +
              schoolLogoArr[0].filePath +
              "/" +
              schoolLogoArr[0].filePathName;
          }
        }
        // 调用接口查询用户的详细信息
        const params = {
          schoolId: this.currentSchool.uid, // 学校uid
          userId: this.userInfo.uid
        };
        this.$_showLoading({
          text: "统计数据加载中..."
        });
        getUserSchoolInfo(params) // 查询用户学校相关数据信息
          .then(res => {
            this.correlationInfo = res.data;
            this.tableData = res.data.classCourseDetails; // 获取到教师班级课节详情
            // 获取当前学期信息
            getCurrentTerm({ schoolId: this.currentSchool.uid })
              .then(res => {
                this.currentTerm = res.data; // 记录当前的学期信息
                const queryParam = {
                  termId: res.data.uid
                };
                // 获取节次时间
                getClassTimeList(queryParam)
                  .then(res => {
                    this.$_hideLoading(); // 关闭统计数据加载效果
                    this.classIndexList = res.data; // 接收到节次时间数组
                    this.handleClass(""); // 处理教师的课程信息列表
                  })
                  .catch(() => {
                    this.$_hideLoading(); // 关闭统计数据加载效果
                  });
              })
              .catch(() => {
                this.$_hideLoading(); // 关闭统计数据加载效果
              });
          })
          .catch(() => {
            this.$_hideLoading(); // 关闭统计数据加载效果
          });
      }
    },
    handleClass(date) {
      // 处理教师的课程信息列表
      const queryParam = {
        schoolId: this.currentSchool.uid,
        teacherId: this.userTeacherId,
        startDate:
          date !== ""
            ? formatDate(new Date(date), "yyyy-MM-dd")
            : formatDate(new Date(), "yyyy-MM-dd")
      };
      if (this.userTeacherId && this.currentSchool.uid) {
        this.$_showLoading({
          text: "查询课程中..."
        });
        getClassListByTeacherIndex(queryParam)
          .then(res => {
            if (res.data) {
              this.showClassList = res.data
                .filter(item => {
                  return item.subjectName !== "";
                })
                .map(item => {
                  const arr = this.classIndexList.filter(sonItem => {
                    return item.classIndex === sonItem.classIndex;
                  });
                  if (arr.length) {
                    item["showTime"] =
                      arr[0].classStarttime + "-" + arr[0].classEndtime;
                  } else {
                    item["showTime"] = "";
                  }
                  return item;
                });
            } else {
              this.showClassList = [];
            }
            this.$_hideLoading(); // 关闭加载效果
          })
          .catch(() => {
            this.showClassList = []; // 课时列表清空
            this.$_hideLoading(); // 关闭加载效果
          });
      }
    },
    openScore() {
      window.open(envConfig.ADDPREFIX + "/score-manage");
    }
  },
  mounted() {
    this.managePageInit(); // 页面初始化
  }
};
</script>
<style lang="scss" scoped>
.manager-wrapper {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  font-size: 14px;
  .manager-title {
    position: relative;
    .school-authentication {
      // 学校认证
      position: absolute;
      right: 20px;
      top: 13px;
      color: $working-color1;
      &:hover {
        border-bottom: 1px solid $working-color1;
      }
    }
  }
}
// 标题公共样式
.good-title {
  height: 50px;
  overflow: hidden;
  line-height: 16px;
  font-size: 14px;
  border-bottom: 1px solid $working-color2;
  .fl-title {
    border-left: 4px solid $title-color2;
    color: $font-color;
    margin: 17px 0;
    font-weight: bold;
    text-indent: 10px;
  }
}
//
.s-tab {
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  font-size: 14px;
  border-bottom: 1px solid $working-color2;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  padding: 0 20px;
  .s-title {
    color: $font-color;
    height: 100%;
    text-align: center;
    cursor: pointer;
    margin-right: 30px;
    &:hover {
      font-weight: bold;
      border-bottom: 2px solid $title-color2;
    }
  }
  .active {
    border-bottom: 2px solid $title-color2;
    color: $font-color;
    height: 100%;
    font-weight: bold;
  }
}
.manager-wrapper .manager-body {
  padding: 20px 11px 14px 11px;
  box-sizing: border-box;
  position: relative;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .border-radi {
    border-radius: 4px;
    border: 1px solid $working-color4;
    box-sizing: border-box;
  }
  .border-b {
    border: 1px solid $working-color4;
  }
  .account-identify {
    // 账号标识样式
    width: 65px;
    height: 59px;
    position: absolute;
    right: 0px;
    top: 0px;
    background: url(../../../../assets/img/zhengshi.png) no-repeat;
    .rotate {
      line-height: 12px;
      color: $working-color8;
      position: absolute;
      top: 16px;
      left: 16px;
      transform-origin: center center;
      transform: rotate(45deg);
      font-size: 12px;
      -ms-transform: rotate(45deg); /* IE 9 */
      -moz-transform: rotate(45deg); /* Firefox */
      -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
      -o-transform: rotate(45deg);
    }
  }
  .noformal {
    background: url(../../../../assets/img/shiyong.png) no-repeat;
  }
  .left-mana {
    .left-top {
      // 左上页面样式
      .school-message {
        // 学校信息
        padding: 25px 22px 24px 22px;
        min-height: 300px;
        position: relative;
        .school-top {
          padding-bottom: 24px;
          border-bottom: 1px dashed $working-color5;
          .school-logo {
            position: relative;
            width: 110px;
            height: 110px;
            background: $working-color20;
            img {
              display: block;
              width: 80px;
              height: 80px;
              margin: 15px;
              border-radius: 50%;
            }
            border-radius: 4px;
            overflow: hidden;
            .update-logo {
              width: 100%;
              position: absolute;
              cursor: pointer;
              bottom: 0px;
              left: 0;
              height: 0px;
              line-height: 36px;
              text-align: center;
              font-size: 14px;
              color: $working-color8;
              background: $working-color19;
              opacity: 0.5;
              border-radius: 0px 0px 4px 4px;
              transition: height 1s;
              i {
                font-size: 16px;
                padding-right: 10px;
              }
            }
            &:hover {
              .update-logo {
                height: 36px;
              }
            }
          }
          .school-tips {
            margin-left: 20px;
            .school-name {
              font-size: 18px;
              color: $working-color1;
              line-height: 20px;
              position: relative;
              &::after {
                content: "未认证";
                border: 1px solid $working-color6;
                border-radius: 2px;
                font-size: 12px;
                padding: 2px 6px;
                color: $working-color6;
                position: absolute;
                right: -60px;
                top: -2px;
              }
              > p {
                max-width: 220px;
              }
            }
            .isCertificate {
              &::after {
                content: "已认证";
                border: 1px solid $working-color1;
                color: $working-color1;
              }
            }
            .school-area {
              padding-top: 12px;
              line-height: 20px;
              font-size: 14px;
              color: $working-color3;
            }
            .tel {
              line-height: 20px;
              padding-top: 12px;
              i {
                font-size: 20px;
                color: $working-color7;
              }
              span {
                color: $working-color7;
                padding-left: 8px;
              }
              span:nth-of-type(2) {
                color: $working-color1;
                cursor: pointer;
              }
            }
          }
        }
        .school-bottom {
          position: relative;
          padding-top: 28px;
          li {
            float: left;
            width: 25%;
            text-align: center;
            .value {
              font-size: 36px;
              color: $working-color1;
            }
            .key {
              font-size: 14px;
              color: $working-color9;
              padding-top: 16px;
            }
          }
        }
      }
      .todo-list {
        // 代办事项
        padding: 0 22px;
        min-height: 300px;
        .good-title {
          margin-bottom: 0;
          border: none;
        }
        .todo-item {
          > li {
            cursor: pointer;
            border-bottom: 1px dashed $working-color5;
            font-size: 14px;
            padding: 20px 0;
            > div {
              margin: 0 auto;
              width: 188px;
              overflow: hidden;
              div {
                line-height: 34px;
                float: left;
                color: $working-color9;
              }
              div:nth-of-type(1) {
                padding-right: 20px;
                i {
                  font-size: 24px;
                  color: $working-color10;
                }
              }
              div:nth-of-type(3) {
                font-size: 34px;
                color: $working-color11;
                padding: 0 10px;
              }
            }
          }
          li:nth-last-of-type(1) {
            border: none;
          }
        }
      }
    }
    .left-bottom {
      .fast-entrance {
        // 左下页面样式
        border-radius: 4px;
        border: 1px solid $working-color2;
        .good-title {
          margin-bottom: 0;
          border: none;
        }
        .fast-list {
          position: relative;
          > li {
            cursor: pointer;
            float: left;
            width: 16.6%;
            text-align: center;
            padding: 22px 0 25px 0;
            .icon {
              padding-bottom: 14px;
            }
            .name {
              font-size: 14px;
              color: $working-color9;
            }
          }
        }
      }
    }
  }
  .left-teacher {
    .school-message-two {
      // 学校信息
      padding: 25px 22px 24px 22px;
      min-height: 300px;
      position: relative;
      .school-top {
        padding-bottom: 24px;
        border-bottom: 1px dashed $working-color5;
        .school-logo {
          position: relative;
          width: 110px;
          height: 110px;
          background: $working-color20;
          img {
            display: block;
            width: 80px;
            height: 80px;
            margin: 15px;
            border-radius: 50%;
          }
          border-radius: 4px;
          overflow: hidden;
          .update-logo {
            width: 100%;
            position: absolute;
            cursor: pointer;
            bottom: 0px;
            left: 0;
            height: 0px;
            line-height: 36px;
            text-align: center;
            font-size: 14px;
            color: $working-color8;
            background: $working-color19;
            opacity: 0.5;
            border-radius: 0px 0px 4px 4px;
            transition: height 1s;
            -webkit-transition: height 1s;
            i {
              font-size: 16px;
              padding-right: 10px;
            }
          }
          &:hover {
            .update-logo {
              height: 36px;
            }
          }
        }
        .school-tips {
          margin-left: 20px;
          .school-name {
            padding-top: 18px;
            font-size: 18px;
            color: $working-color1;
            position: relative;
            &::after {
              content: "未认证";
              border: 1px solid $working-color6;
              border-radius: 2px;
              font-size: 12px;
              padding: 2px 6px;
              color: $working-color6;
              position: absolute;
              right: -60px;
              top: 20px;
            }
            > p {
              max-width: 180px;
            }
          }
          .isCertificate {
            &::after {
              content: "已认证";
              border: 1px solid $working-color1;
              color: $working-color1;
            }
          }
          .school-area {
            padding-top: 6px;
            line-height: 30px;
            color: $working-color3;
          }
        }
      }
      .school-bottom {
        position: relative;
        padding-top: 28px;
        li {
          float: left;
          width: 50%;
          text-align: center;
          .value {
            font-size: 36px;
            color: $working-color1;
          }
          .key {
            font-size: 14px;
            color: $working-color9;
            padding-top: 16px;
          }
        }
      }
    }
    .fast-entrance-two {
      // 左下页面样式
      padding: 0 22px;
      .good-title {
        margin-bottom: 0;
        border: none;
      }
      .fast-list {
        position: relative;
        > li {
          float: left;
          width: 33.3%;
          text-align: center;
          padding: 22px 0 25px 0;
          cursor: pointer;
          .icon {
            padding-bottom: 14px;
          }
          .name {
            font-size: 14px;
            color: $working-color9;
          }
        }
      }
    }
    .data-statistics {
      // 教师数据统计样式
      height: 536px;
      .good-title {
        margin-bottom: 0;
        border: none;
        padding: 0 22px;
      }
      .data-top {
        width: 346px;
        height: 156px;
        margin: 0 auto;
        margin-top: 20px;
        background: url(../../../../assets/img/teacher-data.png) no-repeat;
        overflow: hidden;
        .count {
          margin: 30px 0 0 200px;
          line-height: 24px;
          height: 24px;
          position: relative;
          // text-indent: 28px;
          > p {
            float: left;
            font-size: 14px;
            color: $working-color3;
          }
          p:nth-of-type(2) {
            font-size: 24px;
            color: $working-color1;
            padding: 0 8px;
          }
          &:before {
            content: "";
            position: absolute;
            top: 3px;
            left: -24px;
            height: 18px;
            width: 18px;
            background: url(../../../../assets/img/data-point.png) no-repeat;
            background-size: 100%;
          }
          &:after {
            content: "";
            position: absolute;
            top: 12px;
            left: -69px;
            width: 46px;
            height: 1px;
            background: $working-color12;
          }
        }
        .count:nth-of-type(1) {
          margin-top: 10px;
        }
        .count:nth-of-type(2) {
          &:after {
            width: 20px;
            left: -44px;
          }
        }
        .count:nth-of-type(3) {
          &:after {
            width: 42px;
            left: -65px;
          }
        }
      }
      .data-bottom {
        padding-top: 24px;
      }
    }
  }
  .class-list {
    .class-logo {
      width: 120px;
      height: 28px;
      border-bottom-right-radius: 28px;
      border-bottom-left-radius: 28px;
      background: $working-color15;
      margin: 0 auto;
      text-align: center;
      line-height: 28px;
      color: $working-color8;
      font-weight: bold;
    }
    .no-class {
      padding-top: 50px;
      text-align: center;
      i {
        font-size: 40px;
        color: $working-color8;
      }
      p {
        padding-top: 20px;
        color: $working-color8;
        font-size: 14px;
      }
    }
    .have-class {
      padding: 20px 20px 0 20px;
      color: $working-color8;
      font-size: 14px;
      max-height: 170px;
      .class-item {
        padding-bottom: 20px;
        overflow: hidden;
        position: relative;
        span {
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span:nth-of-type(1) {
          width: 35%;
        }
        span:nth-of-type(2) {
          width: 25%;
          text-align: center;
        }
        span:nth-of-type(3) {
          width: 40%;
          text-align: right;
        }
      }
    }
  }
}
// 上传头像样式
.upload-wrapper {
  text-align: center;
  position: relative;
  #uploads {
    position: absolute;
    clip: rect(0px, 0px, 0px, 0px);
  }
  .upload-button {
    display: inline-block;
    line-height: 34px;
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    outline: none;
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.2s ease;
    text-decoration: none;
    user-select: none;
    width: 110px;
    height: 34px;
    color: $uploadlogo-color4;
    border: 1px solid $uploadlogo-color3;
    margin: 0 auto;
    i {
      color: $uploadlogo-color1;
    }
  }
  .upload-tips {
    font-size: 12px;
    padding-top: 16px;
    padding-bottom: 28px;
    text-align: center;
    color: $uploadlogo-color5;
  }
  .img-shearing {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    margin-bottom: 12px;
  }
  .no-img {
    background: $uploadlogo-color2;
    line-height: 200px;
    text-align: center;
    i {
      font-size: 110px;
      color: $uploadlogo-color3;
    }
  }
}
// 修改手机号模态框样式
.telphone-form {
  .validate-code {
    display: inline-block;
    width: 192px;
  }
  .width210 {
    width: 210px;
  }
  .validate-button {
    width: 100px;
    line-height: 0;
    height: 32px;
    background: $person-color11;
    margin-left: 10px;
    color: $person-color12;
    padding: 0;
  }
}
</style>
<style lang="scss">
.calendar {
  height: 536px;
  position: relative;
  border: 1px solid $working-color12 !important;
  background: $working-color12;
  // 日历组件样式覆盖
  .wh_container {
    max-width: 600px;
    .wh_content_all {
      .wh_top_changge .wh_content_li {
        font-size: 16px;
      }
      background: $working-color8;
      .wh_item_date {
        color: $working-color9;
        font-size: 12px;
        &:hover {
          border: 1px solid $working-color1;
          border-radius: 50%;
          background: $working-color8;
        }
      }
      .wh_top_tag {
        font-size: 12px;
        color: $working-color9;
        border-bottom: 1px solid $working-color14;
      }
      .wh_other_dayhide {
        color: #dccfcc;
      }
      .wh_content_item {
        // 权重比较高的
        .wh_isToday {
          background-color: rgba(0, 0, 0, 0);
          color: $working-color13;
        }
        .wh_chose_day {
          background: $working-color13;
          color: $working-color8;
        }
      }
      li {
        color: $working-color9;
      }
      .wh_jiantou1,
      .wh_jiantou2 {
        border-color: $working-color9;
      }
    }
  }
}
</style>

