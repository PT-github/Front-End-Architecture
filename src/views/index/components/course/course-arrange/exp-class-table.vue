<template>
  <div class="exp-class-table" :class="{hide: hide}">
    <div class="exp-class-table-top">
      <span class="title">异常班级</span>
      <span class="iconfont icon-x" @click="tooglePopup"></span>
    </div>
    <div class="class-table">
      <div class="table-header">
        <div class="table-th">班级</div>
        <div class="table-th">暂存课数</div>
        <div class="table-th">空白区域</div>
      </div>
      <div class="table-body">
        <vue-scroll>
            <!-- :class="{last: index > 2 && index === list.length - 1}" -->
          <div
            class="table-tr"
            v-for="(item, index) in list"
            :key="index+ '_exp_class'"
            v-show="item.tempStorageCount > 0 || item.blankCount > 0"
            @click="exchangeClass(item)"
          >
            <div class="table-td canPoint">{{ item.classFullName }}</div>
            <div class="table-td">{{ item.tempStorageCount }}</div>
            <div class="table-td">{{ item.blankCount }}</div>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExpClassTable",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hide: true
    };
  },
  methods: {
    toggleDisplay () {
      this.hide = !this.hide
    },
    closeView () {
      this.hide = true
    },
    exchangeClass(data) {
      this.$emit("exchangeClass", data);
    },
    tooglePopup() {
      this.hide = !this.hide;
    }
  }
};
</script>
<style lang="scss" scoped>
.exp-class-table {
  width: 330px;
  position: fixed;
  top: 140px;
  right: 0;
  bottom: 30px;
  border-radius: 6px 0px 0px 6px;
  overflow: hidden;
  z-index: 100000000;
  transition: all 1s;
  box-shadow:0px 6px 6px 0px rgba(0, 0, 0, 0.14);
  &.hide {
    right: -330px;
  }
  .exp-class-table-top {
    height: 55px;
    line-height: 55px;
    background: $exp-class-table-color1;
    border-radius: 6px 2px 2px 2px;
    .title {
      color: $exp-class-table-color2;
      font-weight: bold;
      padding-left: 16px;
      font-size: 16px;
    }
    .iconfont {
      margin-right: 10px;
      float: right;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .canPoint {
    text-decoration: underline;
  }
  .class-table {
    background: #fff;
    flex: 1;
    height: calc(100% - 50px);
    padding: 15px 15px 18px;
    text-align: center;
    .table-body {
      height: calc(100% - 50px);
      border-bottom: 1px solid #eaeaea;
      border-left: 1px solid #eaeaea;
      border-right: 1px solid #eaeaea;
      .table-tr {
        cursor: pointer;
        display: flex;
        // border-left: 1px solid #EAEAEA;
        .table-td {
          flex: 1;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #eaeaea;
          &:not(:last-child) {
            border-right: 1px solid #eaeaea;
          }
        }
        &.last {
          .table-td {
            border-bottom: 0;
          }
        }
      }
    }
    .table-header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border: 1px solid rgba(234, 234, 234, 1);
      background: #f5f5f5;
      display: flex;
      .table-th {
        flex: 1;
        color: #333;
      }
    }
  }
}
</style>
