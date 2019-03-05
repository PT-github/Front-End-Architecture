<template>
  <div class="background">
    <div class="home-nav clearfix">
      <div class="nav-item fl" v-for="(item, index) in items" :key="index + 'nav'">
        <div class="nav-item-icon">
          <img :src="item.icon">
        </div>
        <div class="nav-item-name">{{item.name}}</div>
        <div class="nav-item-use">{{item.use}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import con1 from "../../../../../assets/img/nav-icon-1.png";
import con2 from "../../../../../assets/img/nav-icon-2.png";
import con3 from "../../../../../assets/img/nav-icon-3.png";
import con4 from "../../../../../assets/img/nav-icon-4.png";
import con5 from "../../../../../assets/img/nav-icon-5.png";
import con6 from "../../../../../assets/img/nav-icon-6.png";
export default {
  name: "HomeNav",
  data() {
    return {
      items: [
        {
          name: "基础数据",
          icon: con1,
          path: "/basic/term-man",
          use: "高效录入"
        },
        {
          name: "智能排课",
          icon: con2,
          path: "/basic/term-man",
          use: "方便可靠"
        },
        {
          name: "查看课表",
          icon: con3,
          path: "/basic/term-man",
          use: "多端查看 科学展示"
        },
        {
          name: "调代课申请",
          icon: con4,
          path: "/basic/term-man",
          use: "多端申请 审批简捷"
        },
        {
          name: "审批管理",
          icon: con5,
          path: "/basic/term-man",
          use: "流程高效"
        },
        {
          name: "APP&公众号",
          icon: con6,
          path: "/basic/term-man",
          use: "多端互动 高效沟通"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.background {
  background: $home-color17;
  .home-nav {
    width: 1218px;
    margin: 0 auto;
    text-align: center;
    .nav-item {
      background: $home-color5;
      width: 183px;
      margin: 30px 10px;
      padding: 30px 0;
      border-radius: 8px;
      &:hover {
        box-shadow: 0px 4px 10px 0px rgba(102, 102, 102, 0.3);
      }
      .nav-item-icon {
        margin: 0 auto;
        height: 74px;
        img {
          display: block;
          margin: auto;
        }
      }
      .nav-item-name {
        font-size: 20px;
        color: $home-color3;
        margin-top: 30px;
      }
      .nav-item-use {
        font-size: 14px;
        color: $home-color11;
        margin-top: 6px;
      }
    }
  }
}
</style>
