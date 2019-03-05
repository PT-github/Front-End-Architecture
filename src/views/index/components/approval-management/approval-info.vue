<template>
  <div class="approval-info" ref="approvalInfo">
    <s-title :title="'调课审批'"></s-title>
    <div class="s-menu clearfix">
      <router-link
        class="s-menu_a"
        :class="{'router-link-active': item.path === $route.path}"
        v-for="(item, index) in menuList"
        :key="'s-menu_' + index"
        :to="item.path"
      >
      {{ item.title }}
      <div class="badge" :class="{ badgeShow: auditCount > 0 && index === 0 }">{{auditCount}}</div>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "ApprovalInfo",
  data() {
    return {
      menuList: [
        {
          title: "待我审批",
          path: "/approval-management/wait-approval"
        },
        {
          title: "我审批的",
          path: "/approval-management/have-approval"
        },
        {
          title: "全部申请",
          path: "/approval-management/all-approval"
        }
      ],
      auditCount: 0
    };
  },
  methods: {
    setCount(num) {
      this.auditCount = num;
    }
  }
};
</script>
<style lang="scss" scoped>
.approval-info {
  width: 100%;
  height: 100%;
  position: relative;
  .s-menu {
    height: 50px;
    padding-bottom: 14px;
    padding: 0 20px;
    position: relative;
    border-bottom: 1px solid $menu-color5;
    background: $menu-color6;
    .s-menu_a {
      position: relative;
      height: 36px;
      line-height: 36px;
      color: $font-color;
      float: left;
      padding: 0 25px;
      background: $menu-color1;
      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: $menu-color2;
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
      .badge {
        visibility: hidden;
        position: absolute;
        top: 4px;
        right: 6px;
        min-width: 14px;
        min-height: 14px;
        line-height: 1;
        padding: 2px;
        font-size: 12px;
        color: white;
        text-align: center;
        background: red;
        border-radius: 50%;
      }
      .badgeShow {
        visibility: visible;
      }
    }

  }
}
</style>
