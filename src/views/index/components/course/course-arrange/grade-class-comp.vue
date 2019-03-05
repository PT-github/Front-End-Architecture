<template>
  <vue-scroll>
    <div class="grade-class-comp">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="一年级" name="1">
          <div class="subject-box">
            <span class="subject-item active">1班<i class="nums">3</i></span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班<i class="nums">2</i></span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="二年级" name="2">
          <div class="subject-box">
            <span class="subject-item active">1班</span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班</span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="三年级" name="3">
          <div class="subject-box">
            <span class="subject-item active">1班</span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班</span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="四年级" name="4">
          <div class="subject-box">
            <span class="subject-item active">1班</span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班</span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="五年级" name="5">
          <div class="subject-box">
            <span class="subject-item active">1班</span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班</span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="六年级" name="6">
          <div class="subject-box">
            <span class="subject-item active">1班</span>
            <span class="subject-item">2班</span>
            <span class="subject-item">3班</span>
            <span class="subject-item">4班</span>
          </div>
        </el-collapse-item>
        
      </el-collapse>
    </div>
  </vue-scroll>
</template>
<script>
export default {
  name: 'GradeClassComp',
  data () {
    return {
      activeNames: ''
    }
  },
  methods: {
    handleChange () {}
  }
}
</script>
<style lang="scss" scoped>
.grade-class-comp {
  width: 100%;
  height: 100%;
  user-select: none;
  .subject-item {
    display: block;
    height: 35px;
    line-height: 35px;
    background: $course-hand-arrange-color6;
    padding-left: 10px;
    font-size: 12px;
    color: $course-hand-arrange-color1;
    margin-bottom: 1px;
    cursor: pointer;
    &.active, &:hover {
      color: $course-hand-arrange-color3;
      background: $course-hand-arrange-color2;
    }
    .nums {
      background: $course-hand-arrange-color4;
      color: $course-hand-arrange-color5;
      float: right;
      height: 15px;
      line-height: 15px;
      padding: 0 4px;
      border-radius: 15px;
      margin-right: 8px;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="scss">
.grade-class-comp {
  .el-collapse-item {
    &:after {
      content: '';
      width: 173px;
      height: 1px;
      background: $course-pre-arrange-color3;
      display: block;
      margin-left: 8px;
    }
  }
  .el-collapse-item__header {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    font-weight: bold;
    color: $course-hand-arrange-color1;
    padding-left: 10px;
    padding-right: 5px;
    border-bottom: 0;
  }
  .el-collapse-item__arrow {
    line-height: 38px;
  }
  .el-collapse-item__wrap {
    border-bottom: 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}

</style>
