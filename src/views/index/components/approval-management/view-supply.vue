<template>
  <div class="view-supply">
    <vue-scroll>
      <s-title :titleArr="titleArr" :haveBorder="true"></s-title>
      <div class="view-body">
        <h2
          class="view-title"
          :class="{ isDelete: supplyDetail.delFlag, useless: supplyDetail.invalid }"
        >代课详情</h2>
        <!--请假教师  -->
        <div class="view-date">
          <span class="key">请假教师:</span>
          <span class="value">{{ supplyDetail.teacherName }}</span>
        </div>
        <!--代课信息  -->
        <div class="view-classlist">
          <p class="key">代课信息:</p>
          <el-table :data="supplyDetail.detailList" class="table-comp">
            <el-table-column align="center" type="index" label="序号"></el-table-column>
            <el-table-column align="center" label="班级和科目">
              <template slot-scope="scope">
                <span>{{ scope.row.classFullName + '(' + scope.row.subjectName + ')' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="exchangeTeacherName" label="代课老师"></el-table-column>
          </el-table>
        </div>
        <!--请假期限  -->
        <div class="view-applyreason">
          <span class="key">请假期限:</span>
          <span
            class="value"
          >{{ supplyDetail.startTime | moment('yyyy-MM-dd') + '第' + supplyDetail.startClassIndex + '节课'}}</span>&nbsp;~
          <span
            v-if="!supplyDetail.isEndClass"
          >{{ supplyDetail.endTime | moment('yyyy-MM-dd') + '第' + supplyDetail.endClassIndex + '节课'}}</span>
          <span v-else>学期末</span>
        </div>
        <!--请假期限  -->
        <div class="view-applyreason">
          <span class="key">添加人:</span>
          <span
            class="value"
          >{{ supplyDetail.addUserName + '(' + supplyDetail.addUserPosition + ')' }}</span>
        </div>
        <!--请假期限  -->
        <div class="view-applyreason">
          <span class="key">添加时间:</span>
          <span class="value">{{ supplyDetail.addTime | moment('yyyy-MM-dd HH:mm:ss') }}</span>
        </div>
        <!--销毁人  -->
        <div class="view-applyreason" v-if="supplyDetail.delFlag">
          <span class="key">销毁人:</span>
          <span class="value">{{ supplyDetail.updater }}</span>
        </div>
        <!--销毁时间  -->
        <div class="view-applyreason" v-if="supplyDetail.delFlag">
          <span class="key">销毁时间:</span>
          <span class="value">{{ supplyDetail.updateTime | moment('yyyy-MM-dd HH:mm:ss') }}</span>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import { getExchangeClassDetial } from "../../store/api";
export default {
  name: "ViewSupply",
  data() {
    return {
      supplyDetail: {},
      titleArr: [
        {
          path: "/approval-management/supply-management",
          name: "代课管理"
        },
        {
          path: "/approval-management/view-supply",
          name: "代课通知详情"
        }
      ],
      classlist: [] // 课时信息列表
    };
  },
  mounted() {
    // 获取到代课信息的UID
    const uid = this.$route.query.supplyUid;
    this.$_showLoading({ // 打开加载效果
      text: "加载中..."
    });
    getExchangeClassDetial(uid)
      .then(res => {
        this.supplyDetail = res.data; // 获取到代课详情信息
        this.$_hideLoading(); // 关闭加载效果
      })
      .catch(() => {
        this.$_hideLoading(); // 关闭加载效果
      });
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.view-supply {
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
    .abnormal {
      // 异常
      position: relative;
      &::before {
        position: absolute;
        top: 13px;
        left: 402px;
        border-radius: 3px;
        content: "异常";
        width: 50px;
        border: 1px solid $approval-color29;
        color: $approval-color29;
        background: $approval-color30;
        font-size: 12px;
        line-height: 20px;
      }
    }
    .useless {
      // 代课信息已经失效
      position: relative;
      &::after {
        position: absolute;
        top: 4px;
        right: 10px;
        content: "";
        width: 110px;
        height: 78px;
        background: url(../../../../assets/img/useless.png) no-repeat;
      }
    }
    .isDelete {
      // 代课信息已经被删除
      position: relative;
      &::after {
        position: absolute;
        top: 4px;
        right: 10px;
        content: "";
        width: 110px;
        height: 78px;
        background: url(../../../../assets/img/deleteIcon.png) no-repeat;
      }
    }
    > div {
      padding: 19px 20px;
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
    // 代课信息样式
    .view-classlist {
      .table-comp {
        margin-top: 20px;
      }
    }
  }
}
</style>
