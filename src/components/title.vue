<template>
  <div class="s-title clearfix" :class="{ border_bottom: haveBorder }">
    <div class="fl">
      <span class="fl-title" v-if="title !== ''">{{ title }}</span>
      <el-breadcrumb class="fl-title" separator-class="el-icon-arrow-right" v-else>
        <el-breadcrumb-item
          v-for="(item, index) in titleArr"
          :key="index + 'title'"
          :to="{ path: item.path }"
        >{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="fr" v-if="showBack">
      <slot>
        <el-button class="fr-button" @click="goBack">
          <i class="iconfont icon-fanhui"></i>
          返回工作台
        </el-button>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "sTitle",
  props: {
    title: {
      type: String,
      default: ""
    },
    showBack: {
      type: Boolean,
      default: true
    },
    titleArr: {
      type: Array,
      default: () => []
    },
    haveBorder: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack () {
      this.$router.push({path: '/working-table/manager'})
    }
  }
};
</script>
<style lang="scss" scoped>
.s-title {
  height: 50px;
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: $title-color1;
  background: $title-color4;

  .fl-title {
    height: 20px;
    font-size: 14px;
    color: #1e1e1e;
    margin-top: 15px;
    margin-left: 20px;
    padding-left: 15px;
    display: block;
  }
  .fr-button {
    width: 120px;
    height: 32px;
    font-size: 14px;
    color: #1e1e1e;
    margin-top: 9px;
    margin-left: 20px;
    padding: 0;
    display: block;
    border: 0;
    background: $title-color2;
  }
  .fl-title {
    border-left: 4px solid $title-color2;
    color: $font-color;
    font-weight: bold;
    line-height: 20px;
  }
  .fr-button {
    margin-right: 20px;
    color: #fff;
    font-weight: 400;
    border: 0;
    .iconfont {
      font-size: 12px;
    }
  }
}
.border_bottom {
  border-bottom: 1px solid $title-color7;
}
</style>

<style lang="scss">
// 面包屑样式覆盖
.s-title {
  .el-breadcrumb__separator {
    color: $title-color6;
    font-weight: bold;
  }
  .el-breadcrumb__item .el-breadcrumb__inner {
    color: $title-color6;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: $title-color5;
    font-weight: bold;
  }
}
</style>

