<template>
  <div style="height: 100%; width: 100%">
    <iframe
      v-if="index === '1'"
      src="static/doc/奥昇教务排课操作手册.pdf"
      frameborder="0"
      scrolling="auto"
      style="width:100%; height: 100%;"
    >
      此浏览器不支持PDF浏览，请您下载后查看
      <a href="static/doc/奥昇教务排课操作手册.pdf" download>下载pdf文件</a>
    </iframe>
    <iframe
      v-else-if="index === '2'"
      src="static/doc/奥昇教务排课FAQ文档.pdf"
      frameborder="0"
      scrolling="auto"
      style="width:100%; height: 100%;"
    >
      此浏览器不支持PDF浏览，请您下载后查看
      <a href="static/doc/奥昇教务排课FAQ文档.pdf" download>下载pdf文件</a>
    </iframe>
    <video
      v-else-if="index === '3'"
      src="http://fileprod.aorise.org/education/file/AORISE_Course_Arrangement_Operational_Video.mp4"
      style="width:100%; height: 100%;"
      controls="controls"
    ></video>
    <div v-else>页面参数错误</div>
  </div>
</template>
<script>
export default {
  name: "HelpCenter",
  data() {
    return {
      index: "1"
    };
  },
  mounted() {
    this.index = this.$route.query.index;
    console.log(this.index)
    if (this.index === '3') {
      document.title = '视频教程'
    } else if (this.index === '1') {
      document.title = '操作手册'
    } else {
      document.title = 'FAQ'
    }
  }
};
</script>
