<template>
  <div class="personal-center">
    <LayoutHeader ref="LayoutHeader"></LayoutHeader>
    <router-view></router-view>
    <LayoutFooter></LayoutFooter>
  </div>
</template>
<script>
import LayoutHeader from "../../../../components/LayoutHeader";
import LayoutFooter from '../../../../components/LayoutFooter'; 

export default {
  name: "PersonalCenter",
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
.personal-center {
  position: relative;
  height: 100%;
}
</style>
