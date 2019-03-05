<template>
  <div>
    <div class="message-comp" @click="closeMessage" v-if="isShow"></div>
    <div class="message-bar" :class="{ isShow: isShow }">
      <!-- 系统消息和学校消息 -->
      <div v-if="currentSchool && !((this.currentSchool.accountType === 1 && this.currentSchool.schoolState === 2) || (this.currentSchool.accountType === 2 && this.currentSchool.schoolState === 2))">
        <div class="s-menu clearfix">
          <template>
            <a
              class="s-menu_a"
              v-for="(item, index) in menuList"
              :class="{'router-link-active': index === selectIndex}"
              :key="'s-menu_' + index"
              @click="changeMsgType(index)"
            >{{ item.title }}</a>
          </template>
        </div>
        <vue-scroll>
          <!-- 学校消息列表 -->
          <ul class="message-list" v-if="selectIndex === 0">
            <li
              v-for="(item, index) in messageList"
              :key="'schoolMsgList' + index"
              class="message-item"
              @click="viewMessageDetail(item)"
            >
              <p
                class="mess-date textoverflow-single never-read"
              >{{item.addTime | moment('yyyy-MM-dd')}}</p>
              <p class="mess-title textoverflow-single">{{item.msgTitle}}</p>
            </li>
            <div class="no-message" v-if="messageList.length <= 0">暂无消息</div>
          </ul>
          <!-- 系统消息列表 -->
          <ul class="message-list" v-else>
            <li
              class="message-item"
              v-for="(item, index) in messageList"
              :key="'sysMsgList' + index"
              @click="viewMessageDetail(item)"
            >
              <p
                class="mess-date textoverflow-single never-read"
              >{{item.addTime | moment('yyyy-MM-dd')}}</p>
              <p class="mess-title textoverflow-single">{{item.msgTitle}}</p>
            </li>
            <div class="no-message" v-if="messageList.length <= 0">暂无消息</div>
          </ul>
        </vue-scroll>
      </div>
      <!-- 只有系统消息 -->
      <div v-else>
        <h3 class="title">系统消息</h3>
        <vue-scroll>
          <ul class="message-list">
            <li
              class="message-item"
              v-for="(item, index) in messageList"
              :key="'systemMsgList' + index"
              @click="viewMessageDetail(item)"
            >
              <p
                class="mess-date textoverflow-single never-read"
              >{{item.addTime | moment('yyyy-MM-dd')}}</p>
              <p class="mess-title textoverflow-single">{{item.msgTitle}}</p>
            </li>
            <div class="no-message" v-if="messageList.length <= 0">暂无消息</div>
          </ul>
        </vue-scroll>
      </div>
      <div class="view-all" @click="closeMessage">
        <router-link :to="messageListPage">查看全部</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { getMsgList, updateMsgStatus } from "../views/index/store/api.js";
export default {
  name: "MessageBar",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuList: [
        // 登录模态框切换数组
        {
          title: "学校信息"
        },
        {
          title: "系统信息"
        }
      ],
      selectIndex: 0,
      currentSchool: null,
      currentRole: null, // 当前的用户权限
      messageListPage: "/message-center-noschool",
      messageList: [], // 消息列表展示
      userInfo: {}
    };
  },
  mounted() {
    this.currentSchool = this.$store.state.user.currentSchool; // 获取到当前学校的数据
    this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
    if (this.$store.state.user.currentRole) {
      this.currentRole = this.$store.state.user.currentRole;
    }
    this.getMsgList(); // 获取消息列表
    this.settingPath(); // 设置点击查看全部时的跳转路径
  },
  methods: {
    closeMessage() {
      this.$emit("closeMessage", false);
    },
    viewMessageDetail(item) {
      this.closeMessage(); // 关闭消息侧边栏
      if (item.msgParam) {
        if (item.msgParam.indexOf("{") === -1) {
          this.$message.warning("参数格式错误");
          return;
        }
      }
      // 更新消息已读状态
      updateMsgStatus(item.uid).then(() => {
        this.$store.dispatch("updateUserMsgCountStatus"); // 通知store更新已读信息数量
      });
      // 查看消息详情
      if (this.currentSchool) {
        // 有学校
        const msgType = item.msgType;
        if (this.selectIndex === 1) {
          // 系统消息
          switch (msgType) {
            case 1:
              if (
                this.currentRole.roleType === "ADMIN" ||
                this.currentRole.roleType === "CJADMIN"
              ) {
                this.$router.push({ path: "/platform/user-audit" }); // 跳转到入校审核页面
              } else {
                this.$message.warning("您没有权限");
              }
              break;
            default:
              // 其他类型的消息都跳转到消息详情页面
              this.$router.push({
                path: "/message-center/view-message",
                query: { msgUid: item.msgUid, uid: item.uid }
              });
              break;
          }
        } else if (this.selectIndex === 0) {
          // 学校消息
          switch (msgType) {
            case 1: // 调课审批(跳转到调课的审批页面，要分权限的不同)
              if (
                this.currentRole.roleType === "ADMIN" ||
                this.currentRole.roleType === "CJADMIN"
              ) {
                this.$router.push({
                  path: "/approval-management/in-approval",
                  query: { approvalUid: JSON.parse(item.msgParam).uid }
                });
              } else {
                this.$router.push({
                  path: "/main-common/in-approval-common",
                  query: { approvalUid: JSON.parse(item.msgParam).uid }
                });
              }
              break;
            case 2: // 代课通知(跳转到代课的详情页面，要分权限的不同)
              if (
                this.currentRole.roleType === "ADMIN" ||
                this.currentRole.roleType === "CJADMIN"
              ) {
                this.$router.push({
                  path: "/approval-management/view-supply",
                  query: { supplyUid: JSON.parse(item.msgParam).uid }
                });
              } else {
                this.$router.push({
                  path: "/main-common/view-supply-common",
                  query: { supplyUid: JSON.parse(item.msgParam).uid }
                });
              }
              break;
            case 3: // 温馨提示
              this.$router.push({
                path: "/message-center/view-message",
                query: { msgUid: item.msgUid, uid: item.uid }
              });
              break;
            case 4: // 调课通知(跳转到调课的详情页面, 要区分权限)
              if (
                this.currentRole.roleType === "ADMIN" ||
                this.currentRole.roleType === "CJADMIN"
              ) {
                this.$router.push({
                  path: "/approval-management/view-approval",
                  query: { approvalUid: JSON.parse(item.msgParam).uid }
                });
              } else {
                this.$router.push({
                  path: "/main-common/view-approval-common",
                  query: { approvalUid: JSON.parse(item.msgParam).uid }
                });
              }
              break;
          }
        }
      } else {
        this.$router.push({
          path: "/message-center-noschool/view-messge-noschool",
          query: { msgUid: item.msgUid, uid: item.uid }
        });
      }
    },
    changeMsgType(index) {
      // 改变消息类型
      this.selectIndex = index;
      this.getMsgList();
      this.settingPath(); // 设置点击查看全部时的跳转路径
    },
    // 设置点击查看全部时的跳转路径
    settingPath() {
      if (this.currentSchool) {
        // 如果当前学校过期了
        if (
          (this.currentSchool.accountType === 1 &&
            this.currentSchool.schoolState === 2) ||
          (this.currentSchool.accountType === 2 &&
            this.currentSchool.schoolState === 2)
        ) {
          this.messageListPage = "/message-center-noschool";
        } else {
          if (this.selectIndex === 0) {
            // 学校消息列表
            this.messageListPage = "/message-center/school-message";
          } else {
            // 系统消息列表
            this.messageListPage = "/message-center/system-message";
          }
        }
      } else {
        // 只有系统消息
        this.messageListPage = "/message-center-noschool";
      }
    },
    getMsgList() {
      let isNotice;
      if (this.currentSchool) {
        if (this.selectIndex === 0) {
          // 学校消息
          isNotice = 1;
        } else {
          // 系统消息
          isNotice = 2;
        }
      } else {
        // 只查询系统消息
        isNotice = 2;
      }
      const queryParam = {
        pageSize: 0,
        "where.userId": this.userInfo.uid,
        "where.isNotice": isNotice,
        "where.isRead": false
      };
      getMsgList(queryParam).then(res => {
        this.messageList = res.data.list;
      });
    }
  },
  watch: {
    isShow: function() {
      this.getMsgList(); // 更新消息列表
    }
  }
};
</script>
<style lang="scss" scoped>
.message-comp {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  opacity: 0;
  z-index: 99;
}
.message-bar {
  position: fixed;
  top: 60px;
  right: -292px;
  height: calc(100vh - 100px);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  background: $commonmessage-back;
  width: 292px;
  z-index: 100;
  transition: right 0.8s ease-in-out;
  .s-menu {
    // 切换学校信息和系统信息的样式
    width: 240px;
    margin: 0px auto;
    padding: 13px 0;
    border-bottom: 1px solid $commonmessage-color7;
    .s-menu_a {
      height: 36px;
      line-height: 36px;
      color: $font-color;
      float: left;
      width: 120px;
      background: $menu-color1;
      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: $menu-color2;
      text-align: center;
      margin: 0 auto;
      &.router-link-active,
      &:hover {
        color: $menu-color4;
        background: $menu-color3;
        border-color: $menu-color3;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-of-type {
        border-right-width: 1px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
  .title {
    line-height: 50px;
    text-align: center;
    color: $commonmessage-color8;
    font-size: 14px;
    background: $commonmessage-color9;
    border-radius: 2px 2px 0px 0px;
  }
  .message-list {
    height: calc(100vh - 220px);
    font-size: 14px;
    // 消息列表
    padding: 0px 35px;
    .message-item {
      padding-top: 25px;
      cursor: pointer;
      p {
        width: 220px;
        text-indent: 16px;
        line-height: 20px;
      }
      .mess-date {
        position: relative;
      }
      .mess-title {
        color: $commonmessage-color2;
      }
      .have-read {
        color: $commonmessage-color6;
        &::before {
          content: "";
          width: 8px;
          height: 9px;
          background: $commonmessage-color4;
          position: absolute;
          top: 5px;
          left: 0;
          border-radius: 50%;
        }
      }
      .never-read {
        color: $commonmessage-color5;
        &::before {
          content: "";
          width: 8px;
          height: 9px;
          background: $commonmessage-color3;
          position: absolute;
          top: 5px;
          left: 0;
          border-radius: 50%;
        }
      }
    }
    .no-message {
      line-height: 68px;
      font-size: 16px;
      color: $commonmessage-color6;
      text-align: center;
    }
  }
  .view-all {
    position: absolute;
    bottom: 0;
    left: 26px;
    width: 240px;
    border-top: 1px solid $commonmessage-color7;
    line-height: 50px;
    height: 50px;
    text-align: center;
    a {
      color: $commonmessage-color9;
    }
  }
}
.isShow {
  right: 0;
}
</style>