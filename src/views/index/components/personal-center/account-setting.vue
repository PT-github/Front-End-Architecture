<template>
  <div class="account-setting">
    <vue-scroll>
      <div class="account-wrapper">
        <h3 class="account-title">帐号设置</h3>
        <div class="account-content clearfix">
          <ul class="account-left fl">
            <li>
              <div class="key">
                姓名：
                <span class="gray">姓名既是你的昵称也是重要标志，如需修改请点</span>
                <span class="red" @click="updateUserName">这里</span>
              </div>
              <div class="value">
                <span>{{userInfo.userName}}</span>
              </div>
            </li>
            <li>
              <div class="key">
                手机号码：
                <span class="gray">若手机号已丢失或停用，请立即更换，避免账户被盗，如需修改请点</span>
                <span class="red" @click="updateTelphone">这里</span>
              </div>
              <div class="value">
                <span>{{userInfo.userMobile}}</span>
              </div>
            </li>
            <li>
              <div class="key">
                登录密码：
                <span class="gray">建议定期修改密码，以保证帐号更加安全，如需修改请点</span>
                <span class="red" @click="updatePassword">这里</span>
              </div>
              <div class="value">
                <span>************</span>
              </div>
            </li>
          </ul>
          <div class="account-right fl">
            <div class="user-logo">
              <img v-if="userInfo.imageThumbnailName" :src="userLogo" alt>
              <!-- 默认头像 -->
              <img v-else src="../../../../assets/img/defaltuser.png" alt>
              <el-button type="primary" class="user-logo-button" @click="uploadLogo">修改头像</el-button>
            </div>
          </div>
        </div>
      </div>
    </vue-scroll>
    <!-- 修改密码模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'修改密码'"
      width="392px"
      :visible.sync="resetPasswordDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="resetPassForm"
        :rules="resetPasswordRules"
        label-width="80px"
        ref="resetPassForm"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input
            type="password"
            v-model="resetPassForm.oldPwd"
            autocomplete="off"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            v-model="resetPassForm.newPwd"
            autocomplete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input
            type="password"
            v-model="resetPassForm.checkpass"
            autocomplete="off"
            placeholder="与新密码输入保持一致"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPasswordForm">确 定</el-button>
        <el-button @click="resetPasswordDialog = false">取 消</el-button>
      </span>
    </el-dialog>
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
              type="password"
              v-model="resetTelphoneForm.userPassword"
              autocomplete="off"
              placeholder="请输入登录密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新手机号码" prop="userMobile">
            <el-input
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
        <el-button type="primary" @click="submitTelphoneForm">确 定</el-button>
        <el-button  @click="resetTelphoneDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改姓名模态框 -->
    <el-dialog
      class="dialog-comp"
      :title="'修改姓名'"
      width="392px"
      :visible.sync="resetUsernameDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="telphone-form">
        <el-form
          :model="resetUsernameForm"
          :rules="resetUsernameRules"
          label-width="92px"
          ref="resetUsernameForm"
        >
          <el-form-item label="请输入姓名" prop="userName">
            <el-input v-model="resetUsernameForm.userName" autocomplete="off" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUsernameForm">确 定</el-button>
        <el-button @click="resetUsernameDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 上传头像模态框 -->
    <div class="upload-modal">
      <el-dialog
        class="dialog-comp"
        :title="'上传头像'"
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
            <i class="iconfont">&#xe6f6;</i>&nbsp;上传头像
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
            ></vueCropper>
          </div>
          <div class="img-shearing no-img" v-else>
            <i class="iconfont">&#xe6f9;</i>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmUploadLogo">确 定</el-button>
          <el-button @click="uploadLogoDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
// api引入
import {
  smsValidateCodes,
  updateUserMobile,
  updatePassword,
  updateUserInfo,
  uploadPhoto,
  updateUserImage,
  checkUserMobile
} from "../../store/api.js";
import { checkTelAndExist } from "../../../../utils/validator.js";
import envConfig from "@/config"; // base请求地址

export default {
  name: "AccountSetting",
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /[\s\S]{6,20}/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入6-20位密码"));
        }
        if (this.resetPassForm.checkpass !== "") {
          this.$refs.resetPassForm.validateField("checkpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetPassForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      validateCodeButtonShow: true, // 验证码点击按钮是否显示
      count: 0, // 时间
      timer: null, // 定时器
      userInfo: {}, // 用户信息
      userLogo: "", // 用户头像地址
      resetPasswordDialog: false, // 修改密码的模态框
      resetPassForm: {
        // 修改密码的表单
        oldPwd: "",
        newPwd: "",
        checkpass: ""
      },
      resetPasswordRules: {
        oldPwd: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "请输入6-20位密码", trigger: "blur" }
        ],
        newPwd: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        checkpass: [
          { validator: validatePass2, trigger: "blur" },
          { required: true, message: "确认密码不能为空", trigger: "blur" }
        ]
      },
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
      resetUsernameDialog: false, // 修改姓名模态框是否展示
      resetUsernameForm: {
        userName: ""
      },
      resetUsernameRules: {
        userName: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      },
      uploadLogoDialog: false, // 上传头像模态框是否展示
      avatarShow: null, // 头像展示路径
      autoCrop: true,
      autoCropWidth: 120,
      autoCropHeight: 120,
      fixedBox: true
    };
  },
  mounted() {
    this.getUserInfo(); // 获取用户信息
    this.$parent.$refs.LayoutHeader.accountShow = false; // 让头部的帐号设置隐藏
  },
  destroyed() {
    this.$parent.$refs.LayoutHeader.accountShow = true; // 让头部的帐号设置显示
  },
  methods: {
    getUserInfo() {
      this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
      this.resetUsernameForm.userName = this.userInfo.userName; // 回填用户名
      this.userLogo =
        envConfig.FILEPATH +
        this.userInfo.imagePath +
        "/" +
        this.userInfo.imagePathName; // 拼接用户头像
    },
    updatePassword() {
      // 打开修改密码模态框
      this.resetPasswordDialog = true;
      this.resetPassword(); // 重置修改密码表单
    },
    submitPasswordForm() {
      // 提交修改密码的表单
      this.$refs.resetPassForm.validate(valid => {
        if (valid) {
          this.$_showLoading({
            // 打开加载效果
            text: "加载中..."
          });
          updatePassword(this.resetPassForm)
            .then(() => {
              this.$message.success("修改登录密码成功，请用新密码登录");
              this.resetPasswordDialog = false; // 关闭修改密码模态框
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
    resetPassword() {
      // 重置修改密码表单
      if (this.$refs.resetPassForm) {
        this.$refs.resetPassForm.resetFields();
      }
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
    updateUserName() {
      this.resetUsernameDialog = true;
      this.resetUsername(); // 重置用户名表单
      setTimeout(() => {
        this.resetUsernameForm.userName = this.userInfo.userName; // 回填用户名
      }, 100);
    },
    submitUsernameForm() {
      // 提交修改用户名的表单
      this.$refs.resetUsernameForm.validate(valid => {
        if (valid) {
          this.resetUsernameForm["uid"] = this.userInfo.uid;
          const submitData = {
            userName: this.resetUsernameForm.userName,
            uid: this.userInfo.uid
          };
          updateUserInfo(submitData)
            .then(() => {
              this.$message.success("修改姓名成功");
              this.resetUsernameDialog = false; // 关闭修改用户名模态框
              this.$store.commit(
                "UPDATE_USERNAME",
                this.resetUsernameForm.userName
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
    resetUsername() {
      // 重置修改手机号表单
      if (this.$refs.resetUsernameForm) {
        this.$refs.resetUsernameForm.resetFields();
      }
    },
    getValidateCode() {
      // 获取到短信验证码
      let tel = this.resetTelphoneForm.userMobile;
      if (tel) {
        let reg = /^1\d{10}$/;
        if (reg.test(tel)) {
          checkUserMobile({ userMobile: tel }).then(res => {
            if (res.data) {
              this.$message.warning("该手机号码已经被注册");
            } else {
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
                      this.count = 0;
                      this.validateCodeButtonShow = true;
                      clearInterval(this.timer);
                      this.timer = null;
                    }
                  }, 1000);
                } else {
                  this.$message.error("验证码发送失败");
                }
              });
            }
          });
        } else {
          this.$message.warning("请先输正确的手机号再发送验证码!");
        }
      } else {
        this.$message.warning("请先输正确的手机号再发送验证码!");
      }
    },
    uploadLogo() {
      // 打开上传头像模态框
      this.uploadLogoDialog = true;
      this.avatarShow = null;
    },
    confirmUploadLogo() {
      // 确定上传头像
      this.$refs.cropper.getCropData(data => {
        this.$_showLoading({ text: "头像上传中..." }); // 打开加载效果
        uploadPhoto({ base64Str: String(data.split("base64,")[1]) })
          .then(res => {
            const imageFile = res.data;
            const submitData = {
              filePath: imageFile.filePath,
              filePathName: imageFile.fileName,
              fileType: 1, // 1、图片2、视频
              imgHeight: imageFile.fileHeight,
              imgWidth: imageFile.fileWidth,
              imgSize: imageFile.fileSize,
              objType: 1, // 所属对象类型1、用户信息 2、学校信息3、二维码4、广告图片
              thumbnailName: imageFile.thumbnailFileName,
              thumbnailPath: imageFile.thumbnailFilePath
            };
            // 更新用户头像信息
            updateUserImage(submitData)
              .then(() => {
                this.uploadLogoDialog = false; // 关闭模态框
                this.$message.success("头像上传成功");
                this.$_hideLoading(); // 关闭加载效果
                this.$store.commit("UPDATE_USER_LOGO", imageFile); // 通知store更新用户头像
                this.getUserInfo(); // 刷新用户信息
                this.$parent.$refs.LayoutHeader.getUserInfo(); // 通知头部更新用户头像
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
    //选择本地图片
    uploadImg(e) {
      //上传图片
      var file = e.target.files[0];
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("仅支持JPEG、JPG、PNG图片文件!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return;
      }
      this.avatarShow = URL.createObjectURL(file);
    }
  },
  components: {
    VueCropper
  }
};
</script>
<style lang="scss" scoped>
.account-setting {
  background: $person-color14;
  height: calc(100% - 100px);
  padding-top: 36px;
  .account-wrapper {
    // 帐号设置样式
    width: 1000px;
    background: $person-color1;
    margin: 0 auto;
    padding-bottom: 40px;
    .account-title {
      text-align: center;
      font-size: 18px;
      color: $person-color8;
      line-height: 70px;
      border-bottom: 1px solid $person-color5;
    }
    .account-content {
      padding-left: 30px;
      .account-left {
        width: 709px;
        li {
          padding-top: 30px;
          overflow: hidden;
          font-size: 14px;
          .key {
            font-size: 16px;
            color: $person-color8;
            .gray {
              color: $person-color4;
              font-size: 14px;
            }
            .red {
              font-size: 14px;
              color: $person-color16;
              padding-left: 4px;
              cursor: pointer;
            }
          }
          .value {
            font-size: 16px;
            color: $person-color12;
            background: rgba(245, 245, 245, 1);
            border-radius: 2px;
            margin-top: 15px;
            line-height: 50px;
            padding: 0px 20px;
          }
        }
      }
      .account-right {
        width: 261px;
        padding-top: 58px;
        .user-logo {
          width: 145px;
          margin: 0 auto;
          text-align: center;
          img {
            width: 145px;
            height: 145px;
            display: block;
            border-radius: 50%;
          }
          .user-logo-button {
            width: 120px;
            height: 40px;
            margin-top: 20px;
          }
        }
      }
    }
  }
  // 修改表单元素的样式
  .telphone-form {
    .validate-code {
      display: inline-block;
      width: 192px;
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
}
</style>
<style lang="scss">
// 模态框样式覆盖
.account-setting {
  .el-button {
    // 按钮默认样式
    border-radius: 4px;
    line-height: 0;
    padding: 0;
    width: 80px;
    height: 32px;
  }
  .dialog-comp {
    .el-dialog__body .el-form {
      padding: 0;
    }
    .el-dialog__body {
      padding: 30px 62px 20px 28px;
      .el-form .el-form-item__label {
        text-align: right;
      }
    }
    .el-dialog__footer {
      .dialog-footer {
        // .el-button:nth-child(2) {
        //   background: $person-color1;
        //   color: $person-color12;
        // }
      }
    }
  }
  .upload-modal {
    .dialog-comp {
      .el-dialog__body {
        padding: 36px 30px 20px 30px;
      }
    }
  }
}
</style>

