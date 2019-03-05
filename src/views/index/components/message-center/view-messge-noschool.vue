<template>
  <div class="view-message">
    <vue-scroll>
      <s-title :title="'通知详情'" :showBack="false"></s-title>
      <div class="view-message-info">
        <h2 class="message-title">{{msgDetail.msgTitle}}</h2>
        <h5 class="message-date">{{msgDetail.addTime | moment('yyyy-MM-dd HH:mm')}}</h5>
        <p class="text">{{msgDetail.msgContent}}</p>
        <!-- <div class="image-box">
          <img src="//via.placeholder.com/460x318" alt>
        </div>
        <p
          class="text"
        >亲爱的用户，根据系统更新计划，奥昇教务系统新增排考功能。根据您的建议，并按照产品的推进计划，每两周对系统进行迭代更新，为您提供一个功能更强大、使用更方便的教务管理系统是奥昇教育全体同事的最大追求。</p>-->
        <div class="team">
          <p>奥昇教育团队</p>
          <p>{{msgDetail.addTime | moment('yyyy-MM-dd HH:mm')}}</p>
        </div>
      </div>
      <!-- <div class="view-message-info-two" v-else>
        <h2 class="message-title">某某老师暂离/离调岗代课通知</h2>
        <div class="table-box">
          <h5 class="table-title">因特殊原因，需要对某某老师所带班级科目课程进行调整，具体调整如下：</h5>
          <el-table :data="tableData" class="table-comp">
            <el-table-column align="center" prop="schoolYear" width="172" label="任教班级"></el-table-column>
            <el-table-column align="center" prop="term" label="科目"></el-table-column>
            <el-table-column align="center" prop="startTime" label="周课时"></el-table-column>
          </el-table>
          <div class="table-date">
            <span>代课期限:</span>
            <span>2018-11-06 —学期末</span>
          </div>
        </div>
        <div class="send-person">
          <p>
            <span class="key">发送人:</span>
            <span class="value">谭某（教务主任）</span>
          </p>
          <p>
            <span class="key">发送时间:</span>
            <span class="value">2018-10-16 09：36</span>
          </p>
        </div>
      </div>-->
    </vue-scroll>
  </div>
</template>
<script>
import { updateMsgStatus, getMsgDetail } from "../../store/api";
export default {
  name: "ViewMessage",
  data() {
    return {
      type: 2,
      tableData: [
        // 申请记录表格数据
        {
          schoolYear: "2017-2018学年",
          term: "上学期",
          startTime: "2018-02-17"
        },
        {
          schoolYear: "2017-2018学年",
          term: "下学期",
          startTime: "2018-09-17"
        }
      ],
      msgDetail: {}
    };
  },
  mounted() {
    // 获取到消息的uid和类型
    const msgUid = this.$route.query.msgUid;
    const uid = this.$route.query.uid;
    if (msgUid) {
      this.$_showLoading({
        text: "加载中..."
      });
      getMsgDetail({ msgId: msgUid })
        .then(res => {
          this.msgDetail = res.data; // 获取到消息详情
          updateMsgStatus(uid).then(res => {
            // 更新消息已读状态
            this.$store.dispatch("updateUserMsgCountStatus"); // 通知store更新已读信息数量
          });
          this.$_hideLoading();
        })
        .catch(e => {
          console.log(e);
          this.$_hideLoading();
        });
    }
  },
  methods: {},
  components: {}
};
</script>
<style lang="scss" scoped>
.view-message {
  height: calc(100% - 100px);
  .view-message-info {
    padding: 8px 20px 62px 20px;
    color: $messagecenter-color1;
    font-size: 14px;
    .message-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
    .message-date {
      color: $messagecenter-color2;
      text-align: center;
      padding: 14px 0 18px 0;
      border-bottom: 1px solid $messagecenter-color4;
    }
    .image-box {
      img {
        display: block;
        width: 460px;
        height: 318px;
        margin: 0 auto;
      }
    }
    .text {
      font-size: 15px;
      line-height: 30px;
      padding: 24px 14px;
      text-indent: 30px;
    }
    .team {
      color: $messagecenter-color2;
      text-align: right;
      padding-right: 26px;
      line-height: 40px;
    }
  }
  .view-message-info-two {
    padding: 8px 20px 40px 20px;
    color: $messagecenter-color1;
    font-size: 14px;
    .message-title {
      font-weight: bold;
      text-align: center;
      font-size: 20px;
      padding-bottom: 22px;
      border-bottom: 1px solid $messagecenter-color4;
    }
    .table-box {
      margin: 36px 18px 0 18px;
      width: 860px;
      .table-title {
        font-size: 15px;
        padding-bottom: 26px;
      }
      .table-date {
        line-height: 50px;
        text-align: center;
        background: $messagecenter-color5;
        span:nth-of-type(1) {
          font-weight: bold;
          color: $messagecenter-color2;
        }
        span:nth-of-type(2) {
          font-size: 16px;
          font-weight: bold;
          padding-left: 12px;
        }
      }
    }
    .send-person {
      padding-top: 35px;
      padding-left: 40px;
      p {
        .key {
          color: $messagecenter-color2;
          font-weight: bold;
        }
        .value {
          color: $messagecenter-color6;
          padding-left: 12px;
        }
      }
      p:nth-of-type(2) {
        padding-top: 12px;
      }
    }
  }
}
</style>


