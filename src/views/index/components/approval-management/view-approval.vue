<template>
  <div class="view-approval">
    <vue-scroll>
      <s-title :titleArr="titleArr" :haveBorder="true"></s-title>
      <div class="view-body">
        <h2 class="view-title">查看【编号：TDK181108004】</h2>
        <!--调课日期  -->
        <div class="view-date">
          <span class="key">调课日期:</span>
          <span class="value">{{ approvalDetail.startTime | moment('yyyy-MM-dd') }}</span>
        </div>
        <!--课时信息  -->
        <div class="view-classlist">
          <p class="key">课时信息:</p>
          <el-table :data="classlist" class="table-comp">
            <el-table-column align="center" prop="className" label="调课班级"></el-table-column>
            <el-table-column align="center" prop="needClass" label="需调课时">
              <template slot-scope="scope">
                <div class="class-mess">
                  <p>{{scope.row.needClass}}</p>
                  <p>{{scope.row.needClassTeacher}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="sufferClass" label="被调课时">
              <template slot-scope="scope">
                <div class="class-mess">
                  <p>{{scope.row.sufferClass}}</p>
                  <p>{{ scope.row.sufferClassTeacher }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--申请原因  -->
        <div class="view-applyreason">
          <span class="key">申请原因:</span>
          <span class="value">{{approvalDetail.applyReason}}</span>
        </div>
        <!--审批进度  -->
        <div class="audit-progress">
          <p class="key">审批进度:</p>
          <div class="progress-list">
            <div
              class="progress-item clearfix"
              v-for="(item, index) in processList"
              :key="'processList' + index"
            >
              <div>
                <img class="user-logo" :src="item.iconPath" v-if="item.iconPath" alt>
                <img class="user-logo" v-else src="../../../../assets/img/defaltuser.png" alt>
              </div>
              <div v-if="item.userName">{{item.userName}}</div>
              <div v-if="item.positionName">{{ '(' + item.positionName + ')'}}</div>
              <div
                class="font-card"
                :class="{ colorred: item.approvalState === 3 && index !== 0, colorblue: item.approvalState === 2 && index !== 0, coloryellow: (item.approvalState === null || item.approvalState === 1) && index !== 0, colorgray: index === 0 }"
              >
                <span v-if="index === 0">申请人</span>
                <span v-else-if="item.approvalState === null || item.approvalState === 1">未审核</span>
                <span
                  v-else
                >{{ dicFormater('BASE_SCHOOL_INFO_APPROVAL_STATE', item.approvalState) }}</span>
              </div>
              <div>{{item.approvalTime | moment('yyyy-MM-dd HH:mm:ss')}}</div>
              <div v-if="item.approvalContent" class="remarks" :title="item.approvalContent">备注：{{item.approvalContent}}</div>
            </div>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import { getApplyClassDetail } from "../../store/api";
import envConfig from "@/config"; // base请求地址
import { formatDate, weekArrs } from "../../../../utils/index.js";

export default {
  name: "ViewApproval",
  data() {
    return {
      titleArr: [
        {
          path: "/approval-management/wait-approval",
          name: "调课审批"
        },
        {
          path: "/approval-management/have-approval",
          name: "审批详情"
        }
      ],
      // 调课信息列表
      classlist: [],
      userInfo: {}, // 用户信息
      approvalDetail: {}, // 审批的详情信息
      FILEPATH: envConfig.FILEPATH, // 文件前缀地址
      processList: [] // 审批进度列表
    };
  },
  mounted() {
    this.userInfo = this.$store.state.user.userInfo; // 获取到用户信息
    this.$_showLoading({
      text: "加载中..."
    });
    const queryParam = {
      uid: this.$route.query.approvalUid,
      opType: 2
    };
    getApplyClassDetail(queryParam)
      .then(res => {
        this.$_hideLoading();
        this.approvalDetail = res.data;
        // 处理课时信息
        this.classlist = [
          {
            className: this.approvalDetail.className,
            needClass: "",
            needClassTeacher: "",
            sufferClass: "",
            sufferClassTeacher: ""
          }
        ];
        // 还原需调课时信息
        if (this.approvalDetail.initiativeCourse) {
          // 记录下需调课时的信息
          const initiativeCourse = this.approvalDetail.initiativeCourse;
          this.classlist[0].needClass =
            weekArrs[initiativeCourse.weekDay] +
            "第" +
            initiativeCourse.classIndex +
            "节课";
          this.classlist[0].needClassTeacher =
            initiativeCourse.uid === this.userInfo.uid
              ? "我"
              : initiativeCourse.teacherName +
                "(" +
                initiativeCourse.subjectName +
                ")";
        }
        // 还原被调课时信息
        if (this.approvalDetail.passiveCourse) {
          const passiveCourse = this.approvalDetail.passiveCourse;
          this.classlist[0].sufferClass =
            weekArrs[passiveCourse.weekDay] +
            "第" +
            passiveCourse.classIndex +
            "节课";
          this.classlist[0].sufferClassTeacher =
            passiveCourse.uid === this.userInfo.uid
              ? "我"
              : passiveCourse.teacherName +
                "(" +
                passiveCourse.subjectName +
                ")";
        }
        // 处理审批进度的数组(approvalState为null代表未审核, true代表已通过, false代表已驳回)
        this.processList = this.approvalDetail.exchangeNodeList.map(item => {
          if (item.userHeadImage) {
            item.iconPath =
              this.FILEPATH +
              item.userHeadImage.filePath +
              "/" +
              item.userHeadImage.filePathName;
          } else {
            item.iconPath = "";
          }
          item.addTime = formatDate(item.addTime, "yyyy-MM-dd");
          return item;
        });
      })
      .catch(() => {
        this.$_hideLoading();
      });
  },
  methods: {},
  components: {}
};
</script>
<style lang="scss" scoped>
.view-approval {
  width: 100%;
  height: 100%;
  position: relative;
  .view-body {
    width: 50%;
    min-width: 738px;
    margin: 20px 0 40px 20px;
    border: 1px solid $approval-color25;
    font-size: 14px;
    .view-title {
      font-weight: bold;
      color: $approval-color16;
      background: $approval-color17;
      line-height: 50px;
      border-bottom: 1px solid $approval-color25;
      text-align: center;
    }
    > div {
      padding: 19px 20px;
      border-bottom: 1px solid $approval-color25;
    }
    .key {
      color: $approval-color11;
      padding-right: 12px;
    }
    .value {
      color: $approval-color16;
    }

    .colorgray {
      color: $approval-color6;
      background: $approval-color11;
    }

    .coloryellow {
      color: $approval-color10;
      background: $approval-color13;
    }

    .colorblue {
      color: $approval-color7;
      background: $approval-color12;
    }

    .colorred {
      color: $approval-color9;
      background: $approval-color15;
    }
    .view-classlist {
      .table-comp {
        margin-top: 20px;
      }
    }
    .audit-progress {
      // 审批样式
      .progress-list {
        padding-top: 20px;
        .progress-item {
          padding-bottom: 66px;
          position: relative;
          .user-logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: block;
          }
          > div {
            float: left;
            line-height: 40px;
            padding-left: 14px;
          }
          .remarks {
            position: relative;
            color: $approval-color2;
            background: $approval-color14;
            position: absolute;
            top: 40px;
            left: 67px;
            padding: 9px 12px;
            line-height: 28px;
            max-height: 72px;
            border-radius: 2px;
            word-break: break-all;
            overflow: hidden;
          }
          .font-card {
            // 文字卡片
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            margin: 10px 0;
            margin-left: 14px;
            padding: 0 4px;
            border-radius: 2px;
          }
          &::before {
            content: "";
            width: 1px;
            height: 66px;
            position: absolute;
            top: 40px;
            left: 33px;
            background: $approval-color4;
          }
        }
        .progress-item:nth-last-of-type(1) {
          &::before {
            height: 0;
          }
        }
      }
    }
  }
}
</style>
