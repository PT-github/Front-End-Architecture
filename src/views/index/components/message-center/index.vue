<template>
  <div class="message-center-no">
    <LayoutHeader></LayoutHeader>
    <router-view></router-view>
    <LayoutFooter></LayoutFooter>
  </div>
</template>
<script>
import LayoutHeader from "../../../../components/LayoutHeader";
import LayoutFooter from '../../../../components/LayoutFooter'; 

export default {
  name: "MessageCenterNo",
  data() {
    return {
      menuList: [
        {
          title: "教师信息",
          path: "/basic/teacher-info"
        },
        {
          title: "教师组信息",
          path: "/basic/teacher-group-info"
        }
      ]
    };
  },
  components: {
    LayoutHeader,
    LayoutFooter
  }
};
</script>
<style lang="scss" scoped>
.message-center-no {
  height: 100%;
  position: relative;
}
</style>
