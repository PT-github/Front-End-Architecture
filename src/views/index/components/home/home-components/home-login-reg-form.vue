<template>
  <div class="home-login-reg-form">
    <!-- 登录模态框 -->
    <div class="login-modal" v-if="selectIndex === 0">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <el-form-item prop="userMobile">
          <el-input
            v-model="loginForm.userMobile"
            placeholder="请输入手机号"
            @keyup.enter.native="submitLogin"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            type="password"
            v-model="loginForm.userPassword"
            placeholder="请输入密码"
            @keyup.enter.native="submitLogin"
          ></el-input>
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember" @change="rememberChange">记住密码</el-checkbox>
          <span class="forget fr link-style" @click="changeModelIndex(2)">忘记密码?</span>
        </el-form-item>
      </el-form>
      <el-button class="login-reg-button" @click="submitLogin">登&nbsp;录</el-button>
      <p class="skip">
        <span class="link-style" @click="changeModelIndex(1)">还没有账号？免费注册</span>
      </p>
    </div>
    <!-- 注册模态框 -->
    <div class="reg-modal" v-if="selectIndex === 1">
      <el-form :model="regForm" :rules="regRules" ref="regForm">
        <el-form-item prop="userNameReg">
          <el-input
            v-model="regForm.userNameReg"
            placeholder="请输入用户名称"
            @keyup.enter.native="submitReg"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userMobileReg">
          <el-input
            v-model="regForm.userMobileReg"
            placeholder="请输入手机号"
            @keyup.enter.native="submitReg"
          ></el-input>
        </el-form-item>
        <el-form-item prop="codeReg" class="validate-code">
          <el-input v-model="regForm.codeReg" placeholder="请输入验证码" @keyup.enter.native="submitReg"></el-input>
          <span
            class="validate-get link-style"
            @click="getValidateCode('reg')"
            v-if="validateCodeButtonShow"
          >获取短信验证码</span>
          <span class="validate-get link-style" v-else>{{count}}s</span>
        </el-form-item>
        <el-form-item prop="userPasswordReg">
          <el-input
            type="password"
            v-model="regForm.userPasswordReg"
            placeholder="请输入密码, 6-20位字符"
            @keyup.enter.native="submitReg"
          ></el-input>
        </el-form-item>
      </el-form>
      <p class="agreement">
        注册即视为同意
        <a target="_blank" :href="ADDPREFIX">《奥昇教育平台使用协议》</a>
      </p>
      <el-button class="login-reg-button" @click="submitReg">注&nbsp;册</el-button>
      <p class="skip">
        <span class="link-style" @click="changeModelIndex(0)">已有账号？去登录</span>
      </p>
    </div>
    <!-- 找回密码模态框 -->
    <div class="findpass-modal" v-if="selectIndex === 2">
      <p class="findpass-title">找回密码</p>
      <el-form :model="findPassForm" :rules="findPassRules" ref="findPassForm">
        <el-form-item prop="userMobileFind">
          <el-input
            v-model="findPassForm.userMobileFind"
            placeholder="请输入手机号码"
            @keyup.enter.native="submitFindpass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="codeFind" class="validate-code">
          <el-input
            v-model="findPassForm.codeFind"
            placeholder="请输入验证码"
            @keyup.enter.native="submitFindpass"
          ></el-input>
          <span
            class="validate-get link-style"
            @click="getValidateCode('findPass')"
            v-if="validateCodeButtonShow"
          >获取短信验证码</span>
          <span class="validate-get link-style" v-else>{{count}}s</span>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            type="password"
            v-model="findPassForm.newPassword"
            placeholder="请设置新密码, 6-20位字符"
            @keyup.enter.native="submitFindpass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPasswordCheck">
          <el-input
            type="password"
            v-model="findPassForm.newPasswordCheck"
            placeholder="请再次输入密码"
            @keyup.enter.native="submitFindpass"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button class="login-reg-button" @click="submitFindpass">确&nbsp;定</el-button>
      <p class="skip">
        <span class="link-style" @click="changeModelIndex(0)">返回登录</span>
      </p>
    </div>
  </div>
</template>
<script>
// api引入
import {
  login,
  userReg,
  smsValidateCodes,
  forgetPwd
} from "../../../store/api.js";

import storage from "../../../../../utils/storage.js";
import {
  checkTelAndExist,
  checkTel,
  FindPasswordCheck
} from "../../../../../utils/validator.js";
import envConfig from "@/config"; // base请求地址
export default {
  name: "HomeLoginRegForm",
  props: {
    selectIndex: {
      type: Number,
      required: true,
      default: () => 0
    },
    isModalShow: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{6,20}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入6-20位数字以及英文字母"));
        }
        // if (this.findPassForm.newPasswordCheck !== "") {
        //   this.$refs.findPassForm.validateField("newPasswordCheck");
        // }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.findPassForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ADDPREFIX: envConfig.ADDPREFIX + "/personal-center/user-agreement", // 用户协议地址
      validateCodeButtonShow: true, // 验证码点击按钮是否显示
      count: "", // 时间
      timer: null, // 定时器
      loginForm: {
        // 登录表单
        userMobile: "",
        userPassword: "",
        remember: ""
      },
      loginRules: {
        // 登录表单验证
        userMobile: [{ validator: checkTel, trigger: "blur" }],
        userPassword: [
          { validator: validatePass, trigger: "blur" }
        ]
      },
      regForm: {
        userNameReg: "",
        userMobileReg: "",
        codeReg: "",
        userPasswordReg: ""
      },
      regRules: {
        // 注册表单验证
        userNameReg: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { max: 10, message: "用户名不能超过10个字符", trigger: "blur" }
        ],
        userMobileReg: [{ validator: checkTelAndExist, trigger: "blur" }],
        codeReg: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        userPasswordReg: [
          { validator: validatePass, trigger: "blur" }
        ]
      },
      findPassForm: {
        // 找回密码表单
        userMobileFind: "",
        codeFind: "",
        newPassword: "",
        newPasswordCheck: ""
      },
      findPassRules: {
        // 找回密码表单验证
        userMobileFind: [{ validator: FindPasswordCheck, trigger: "blur" }],
        codeFind: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPasswordCheck: [{ validator: validatePass2, trigger: "blur" }]
      },
      base64: require("js-base64").Base64
    };
  },
  methods: {
    // 判断学校是否开通到期或者试用到期
    rememberChange(item) {
      if (item !== true) {
        this.$store.commit("REMERBER_PASS", { remember: false });
      }
    },
    changeModelIndex(index) {
      // 通知父页面切换
      this.$emit("childChangeIndex", index);
    },
    closeModal() {
      // 通知父组件关闭模态框
      this.$emit("closeModal");
    },
    submitLogin() {
      // 登录请求方法
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this.$_showLoading({
            text: "登录中..."
          });
          const submitData = {
            userMobile: this.loginForm.userMobile.trim(),
            userPassword: this.loginForm.userPassword
          };
          login(submitData)
            .then(res => {
              // 是否记住密码
              try {
                this.$store.commit("REMERBER_PASS", this.loginForm);
                this.$message.success("登录成功");
                this.$_hideLoading();
                this.$store.dispatch("SetUserInfo", JSON.stringify(res.data)); // 将登录信息存入store
                this.closeModal(); // 关闭模态框
                const schoolInfoList = this.$store.state.user.schoolInfoList;
                if (schoolInfoList) {
                  if (schoolInfoList.length) {
                    // 获取到本地的当前学校
                    let localCurrentSchool = storage.getItem("currentSchool"),
                      sameSchool = [];
                    if (localCurrentSchool && localCurrentSchool !== "null") {
                      // 如果本地存储中有学校信息
                      localCurrentSchool = JSON.parse(
                        storage.getItem("currentSchool")
                      );
                      sameSchool = schoolInfoList.filter(item => {
                        // 如果本地的学校中有与学校列表中UID相同的就将它置为当前学校
                        return item.uid === localCurrentSchool.uid;
                      });
                      if (sameSchool.length) {
                        this.$store.dispatch(
                          "SetCurrentSchool",
                          JSON.stringify(sameSchool[0])
                        );
                      } else {
                        // 默认将第一个学校当成当前的学校
                        this.$store.dispatch(
                          "SetCurrentSchool",
                          JSON.stringify(schoolInfoList[0])
                        );
                      }
                    } else {
                      // 默认将第一个学校当成当前的学校
                      this.$store.dispatch(
                        "SetCurrentSchool",
                        JSON.stringify(schoolInfoList[0])
                      );
                    }
                    // 判断当前学校有没有试用到期
                    const currentSchool = this.$store.state.user.currentSchool;
                    if (currentSchool) {
                      if (
                        currentSchool.accountType === 1 &&
                        currentSchool.schoolState === 2
                      ) {
                        this.$router.push({ path: "/personal-center/message" }); // 学校试用到期跳转到个人中心
                      } else if (
                        currentSchool.accountType === 2 &&
                        currentSchool.schoolState === 2
                      ) {
                        this.$router.push({ path: "/personal-center/message" }); // 学校试用到期跳转到个人中心
                      } else {
                        this.$router.push({ path: "/working-table/manager" }); // 有学校且没有试用到期跳转到工作台
                      }
                    } else {
                      this.$router.push({ path: "/personal-center/message" }); // 没有当前学校跳转到个人中心
                    }
                  } else {
                    this.$store.commit("ClearCurrentSchool"); // 清空本地的当前学校
                    this.$router.push({ path: "/personal-center/message" }); // 没有学校跳转到个人中心
                  }
                } else {
                  this.$store.commit("ClearCurrentSchool"); // 清空本地的当前学校
                  this.$router.push({ path: "/personal-center/message" }); // 没有学校跳转到个人中心
                }
              } catch (error) {
                console.log("登录出错", error);
                this.$_hideLoading();
              }
            })
            .catch(() => {
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    },
    submitReg() {
      // 注册方法请求方法
      this.$refs["regForm"].validate(valid => {
        if (valid) {
          try {
            this.$_showLoading({
              text: "注册中..."
            });
            let submitData = {
              userName: this.regForm.userNameReg,
              userMobile: this.regForm.userMobileReg,
              code: this.regForm.codeReg,
              userPassword: this.regForm.userPasswordReg,
              userSource: 1 // 注册来源(1、门户2、APP3、公众号4、系统添加)
            };
            userReg(submitData)
              .then(() => {
                this.$_hideLoading(); // 关闭加载效果
                this.changeModelIndex(0); // 切换到登录界面
                this.$message.success("恭喜您已经注册成功");
                setTimeout(() => {
                  // 回填登录表单
                  this.loginForm.userMobile = submitData.userMobile;
                  this.loginForm.userPassword = submitData.userPassword;
                }, 200);
              })
              .catch(() => {
                this.$_hideLoading(); // 关闭加载效果
              });
          } catch (error) {
            console.log("注册出错", error);
          }
        } else {
          return false;
        }
      });
    },
    submitFindpass() {
      // 找回密码请求方法
      this.$refs["findPassForm"].validate(valid => {
        if (valid) {
          this.$_showLoading({
            text: "加载中..."
          });
          const submitData = {
            newPassword: this.findPassForm.newPassword,
            userMobile: this.findPassForm.userMobileFind,
            code: this.findPassForm.codeFind
          };
          forgetPwd(submitData)
            .then(() => {
              this.$message.success("修改密码成功，请重新登录");
              this.closeModal(); // 关闭模态框
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
    clearAllForm() {
      // 清理所有的表单
      if (this.$refs.loginForm && !this.loginForm.remember) {
        // 如果表单存在且没有记住密码则清空表单
        this.$refs.loginForm.resetFields();
      }
      if (this.$refs.regForm) {
        this.$refs.regForm.resetFields();
      }
      if (this.$refs.findPassForm) {
        this.$refs.findPassForm.resetFields();
      }
    },
    getValidateCode(type) {
      // 获取到短信验证码
      let tel, submitData;
      if (type === "reg") {
        // 注册模态框发送验证码
        tel = this.regForm.userMobileReg;
        submitData = {
          msgType: 1,
          userMobile: tel
        };
      } else if (type === "findPass") {
        // 找回密码模态框发送验证码
        tel = this.findPassForm.userMobileFind;
        submitData = {
          msgType: 2,
          userMobile: tel
        };
      } else {
        return;
      }
      if (tel) {
        var reg = /^1\d{10}$/;
        if (reg.test(tel)) {
          // 调用接口发送验证码
          smsValidateCodes(submitData).then(res => {
            if (res.data) {
              this.$message.success("验证码发送成功，请注意查收.");
              this.$_hideLoading(); // 关闭加载效果
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
              this.$_hideLoading();
              this.$message.error("验证码发送失败");
            }
          });
        } else {
          this.$message.warning("请先输正确的手机号再发送验证码!");
        }
      } else {
        this.$message.warning("请先输正确的手机号再发送验证码!");
      }
    },
    rememberPass() {
      // 取到本地的记住用户信息
      let remerberPass = storage.getItem("remerberPass");
      if (remerberPass) {
        remerberPass = JSON.parse(remerberPass);
        this.loginForm.userMobile = remerberPass.userMobile;
        this.loginForm.userPassword = this.base64.decode(
          // 解码
          remerberPass.userPassword
        );
        this.loginForm.remember = true;
      }
    }
  },
  watch: {
    selectIndex: function() {
      try {
        this.clearAllForm(); // 清理所有的表单
        if (this.timer) {
          clearInterval(this.timer); // 清除定时器
          this.validateCodeButtonShow = true;
        }
        if (this.selectIndex === 0) {
          // 监听当切到登录模态框时触发
          this.rememberPass();
        }
      } catch (error) {
        console.log("监听模态框切换失败", error);
      }
    },
    isModalShow: function(newval) {
      if (!newval) {
        this.clearAllForm(); // 关闭模态框就清理所有表单
      }
    }
  },
  components: {},
  mounted() {
    this.rememberPass();
  }
};
</script>
<style lang="scss">
.home-login-reg-form {
  padding: 0 35px 48px 35px;
  font-size: 14px;
  // min-height: 420px;
  .link-style {
    cursor: pointer;
    color: $home-color18;
    &:hover {
      border-bottom: 1px solid $home-color18;
    }
  }
  .login-reg-button {
    // 模态框点击提交统一样式
    width: 410px;
    height: 55px;
    font-size: 18px;
    font-weight: bold;
  }
  .forget {
    // 忘记密码
    line-height: 14px;
    padding-top: 13px;
  }
  .skip {
    // 模态框跳转样式
    margin: 22px auto 0 auto;
    text-align: center;
  }
  .reg-modal,
  .findpass-modal {
    // 模态框局部样式
    .validate-code {
      position: relative;
      .validate-get {
        display: inline-block;
        min-width: 40px;
        position: absolute;
        right: 0px;
        top: 20px;
        line-height: 14px;
        background: $home-color5;
      }
    }
    .agreement {
      // 奥昇协议
      text-align: center;
      color: $home-color3;
      padding-bottom: 22px;
      a {
        color: $home-color18;
      }
    }
  }
  .findpass-modal {
    // 模态框局部样式
    .findpass-title {
      padding-bottom: 22px;
      font-size: 30px;
      color: $person-color2;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.home-login-reg-form {
  // 记住密码样式
  .login-modal {
    .el-checkbox {
      float: left;
      margin-left: 8px;
    }
  }
  // 模态框样式覆盖
  .el-dialog {
    border-radius: 6px;
  }
  .el-form {
    .el-input__inner {
      border: none;
      border-bottom: 1px solid #eaeaea;
      border-radius: 0;
      height: 54px;
    }
    .el-checkbox__label {
      font-size: 14px;
      color: $home-color2;
    }
  }
}
</style>

