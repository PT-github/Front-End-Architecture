<template>
  <div class="layout-header clearfix">
    <div class="layout-header_left">
      <div class="pic">
        <img src="../assets/img/logo.png" alt="奥昇教务管理平台">
      </div>
      <div class="title">
        <span>奥昇教务管理平台</span>
      </div>
    </div>
    <div class="layout-header_right" v-if="this.$store.state.user.userInfo">
      <div class="select-scool inline" v-if="currentSchool">
        <div
          class="select-school_content"
          @mouseover="selectActive = true"
          @mouseout="selectActive = false"
        >
          <div>
            <span>{{currentSchool.fullName}}</span>
            <i class="iconfont icon-xiala" v-if="schoolList.length > 0"></i>
            <div
              v-if="schoolList.length > 0"
              class="select-ul"
              :class="{active: selectActive, maxheight: schoolList.length >= 5}"
            >
              <vue-scroll>
                <div
                  @click="changeCurrnetSchool(item)"
                  v-for="(item, index) in schoolList"
                  :key="index + 'school-list'"
                  class="select-option"
                >{{item.fullName}}</div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
      <div class="message-box inline no-line" title="消息中心">
        <div class="message-box_content" @click="isMessageBar = !isMessageBar">
          <i class="iconfont icon-xinfeng"></i>
          <div
            class="badge"
            :class="{ badgeShow: Number($store.state.user.userMsgCount) > 0 }"
          >{{$store.state.user.userMsgCount}}</div>
        </div>
      </div>
      <div class="inline">
        <div class="user-box">
          <div class="user-pic">
            <img v-if="userLogo !== ''" :src="userLogo">
            <!-- 默认头像 -->
            <img v-else src="../assets/img/defaltuser.png" alt>
          </div>
          <div class="select-box">
            <div class="select-item user" @click="personCenter">{{userInfo.userName}}</div>
            <div class="select-item account" @click="goAccount" v-if="accountShow">帐号设置</div>
            <div class="select-item" @click="userLogout">退出登录</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 消息中心 -->
    <MessageBar :isShow="isMessageBar" @closeMessage="closeMessage"></MessageBar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { logout } from "../views/index/store/api.js";
import MessageBar from "./MessageBar";
import envConfig from "@/config"; // base请求地址
import defaultLogo from "../assets/img/user.png";

export default {
  name: "LayoutHeader",
  data() {
    return {
      defaultLogo: defaultLogo,
      selectActive: false,
      schoolList: [], // 学校列表
      currentSchool: {},
      userInfo: {},
      isMessageBar: false,
      userLogo: "",
      haveUserLogo: false,
      accountShow: true // 帐号设置是否显示
    };
  },
  methods: {
    goAccount() {
      // 跳转到帐号设置页面
      this.$router.push({ path: "/personal-center/account-setting" });
    },
    closeMessage() {
      this.isMessageBar = false;
    },
    userLogout() {
      if (this.$store.state.user.userInfo) {
        const telephone = this.$store.state.user.userInfo.userMobile;
        this.$_showLoading({
          text: "退出中..."
        });
        console.log('号码', telephone);
        // 调用登出接口
        logout({ userMobile: telephone })
          .then(res => {
            if (res) {
              this.$_hideLoading();
              this.$message.success("您已经退出登录");
              this.$store.commit("USER_LOGOUT");
              this.$router.push({ path: "/" }); // 返回首页
              this.$store.dispatch("ResetSchoolYear");
            }
          })
          .catch(() => {
            // console.log('wocaonima', error);
            this.$message.error("退出登录失败");
            this.$_hideLoading();
          });
      }
    },
    changeCurrnetSchool(item) {
      this.$store.dispatch("SetCurrentSchool", JSON.stringify(item)); // 切换当前学校(修改本地的当前学校信息)
      this.$router.push({ path: "/working-table/manager" }); // 返回工作台页面
      this.getSchoolInfo();
      window.location.reload(); // 刷新页面
    },
    getSchoolInfo() {
      // 获取到学校的信息
      this.currentSchool = this.$store.state.user.currentSchool;
      // 过滤当前选中的学校
      if (this.$store.state.user.schoolInfoList) {
        this.schoolList = this.$store.state.user.schoolInfoList.filter(item => {
          return (
            item.uid !== this.currentSchool.uid &&
            (!(item.accountType === 1 && item.schoolState === 2) &&
              !(item.accountType === 2 && item.schoolState === 2))
          );
        });
      }
    },
    getUserInfo() {
      // 获取用户信息
      this.userInfo = this.$store.state.user.userInfo;
      if (this.userInfo.imageThumbnailName) {
        this.userLogo =
          envConfig.FILEPATH +
          this.userInfo.imageThumbnailPath +
          "/" +
          this.userInfo.imageThumbnailName; // 拼接用户头像
      } else {
        this.userLogo = "";
      }
    },
    personCenter() {
      this.$router.push({ path: "/personal-center/message" });
    }
  },
  computed: {
    ...mapGetters(["collapse"])
  },
  mounted() {
    this.getSchoolInfo(); // 获取到学校的信息
    this.getUserInfo(); // 获取用户信息
    this.$store.dispatch("updateUserMsgCountStatus"); // 通知store更新已读信息数量
  },
  components: {
    MessageBar
  }
};
</script>
<style lang="scss" scoped>
.layout-header {
  position: relative;
  height: 60px;
  background: $layout-color1;
  font-size: 14px;
  .layout-header_left {
    float: left;
    .pic {
      margin-top: 19px;
      margin-left: 25px;
      margin-right: 15px;
      float: left;
    }
    .title {
      float: left;
      color: $layout-color2;
      margin-top: 20px;
    }
  }
  .layout-header_right {
    float: right;
    height: 60px;
    line-height: 60px;
    color: $layout-color2;
    .inline {
      float: left;
      padding-right: 23px;
      margin-right: 23px;
      position: relative;
      z-index: 10000;
      &:last-child {
        padding-right: 0;
      }
      &.no-line {
        margin-right: 0;
      }
      &:not(:last-child):after {
        content: "";
        height: 12px;
        width: 2px;
        border-left: 2px solid $layout-color3;
        position: absolute;
        right: 0;
        top: 24px;
      }
    }
    .message-box {
      padding-right: 25px;
      position: relative;
      .message-box_content {
        cursor: pointer;
        padding: 0 5px;
        height: 38px;
        line-height: 38px;
        margin-top: 12px;
        .iconfont {
          font-size: 20px;
        }
        .badge {
          // 消息数量
          visibility: hidden;
          position: absolute;
          top: 12px;
          left: 14px;
          min-width: 14px;
          line-height: 1;
          padding: 2px 6px;
          font-size: 12px;
          color: $layout-color18;
          text-align: center;
          background: $layout-color17;
          border-radius: 1px;
        }
        .badgeShow {
          visibility: visible;
        }
      }
      .el-icon-message {
        font-size: 20px;
      }
    }
    .user-box {
      text-align: center;
      width: 70px;
      cursor: pointer;
      position: relative;
      z-index: 100;
      .select-box {
        display: none;
        position: absolute;
        width: 140px;
        top: 60px;
        right: 0;
        background: $layout-color4;
        border-radius: 0px 0px 4px 4px;
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.4);
        .select-item {
          height: 44px;
          line-height: 44px;
          color: #666666;
          &:hover {
            background: $layout-color4_5;
            color: $layout-color4_7;
          }
        }
        .user {
          color: $layout-color4_2;
          font-weight: bold;
          border-bottom: 1px solid $layout-color4_6;
        }
      }
      &:hover {
        background-color: $layout-color4_1;
        .select-box {
          display: block;
        }
      }
      .user-pic {
        display: inline-block;
        img {
          // @keyframes rotation {
          //   from {
          //     -webkit-transform: rotate(0deg);
          //   }
          //   to {
          //     -webkit-transform: rotate(360deg);
          //   }
          // }
          // @-moz-keyframes rotation {
          //   from {
          //     -webkit-transform: rotate(0deg);
          //   }
          //   to {
          //     -webkit-transform: rotate(360deg);
          //   }
          // }
          width: 32px;
          height: 32px;
          border-radius: 32px;
          vertical-align: middle;
          // &:hover {
          //   -webkit-transform: rotate(360deg);
          //   animation: rotation 3s linear infinite;
          //   -moz-animation: rotation 3s linear infinite;
          //   -webkit-animation: rotation 3s linear infinite;
          //   -o-animation: rotation 3s linear infinite;
          // }
        }
      }
    }
    .select-scool {
      .select-school_content {
        cursor: pointer;
        padding: 0 5px;
        height: 38px;
        line-height: 38px;
        margin-top: 12px;
        position: relative;
        z-index: 1;
        .iconfont {
          font-size: 14px;
        }
        .select-ul {
          display: none;
          position: absolute;
          // width: 230px;
          top: 34px;
          left: 0;
          border-radius: 5px;
          box-shadow: 1px 1px 1px 1px $layout-color6;
          background-color: $layout-color7;
          &.active {
            display: block;
          }
          &:before {
            content: "";
            width: 10px;
            height: 10px;
            border-color: transparent transparent $layout-color7 transparent;
            border-width: 5px;
            border-style: solid;
            position: absolute;
            top: -10px;
            left: 31px;
            box-sizing: border-box;
          }
          .select-option {
            padding: 0 8px;
            white-space: nowrap;
            min-width: 130px;
            text-align: center;
            border-bottom: 1px solid $layout-color4_6;
            color: #666666;
            cursor: pointer;
          }
          // .selected {
          //   background: $layout-color4_5;
          //   color: $layout-color4_7;
          // }
        }
        .maxheight {
          height: 194px;
        }
      }
      .iconfont {
        padding-left: 10px;
      }
    }
  }
}
</style>

