<template>
  <div class="appo-center">
    <s-title :title="'应用中心'"></s-title>
    <div class="appo-main">
      <div class="appo-item" @click="openScore">
        <i class="iconfont">&#xe71a;</i>
        <h5>成绩管理</h5>
        <p>提供成绩格式转换，查询，将学校成绩数据转换为教育局上报格式</p>
        <span v-show="isOpen" class="is-open">已开通</span>
      </div>
    </div>
  </div>
</template>
<script>
import env_config from '@/config';
export default {
  data () {
    return {
      isOpen: true // 是否已经开通
    }
  },
  methods: {
    openScore () {
      window.open(env_config.ADDPREFIX + '/score-manage')
    }
  },
  watch: {}
}
</script>
<style scoped="scoped" lang="scss">
  .appo-main{
    border-top: 1px solid #E8E8E8;
    padding: 20px;
    .appo-item{
      float: left;
      width: 368px;
      height: 80px;
      padding: 10px;
      display: inline-block;
      background: #F9F9F9;
      cursor: pointer;
      position: relative;
      margin-right: 20px;
      margin-bottom: 20px;
      >i{
        display: inline-block;
        width: 60px;
        height: 60px;
        background: #ED5070;
        text-align: center;
        line-height: 60px;
        color: #FFFFFF;
        font-size: 36px;
        float: left;
        margin-right: 10px;
      }
      >h5{
        display: inline-block;
        color: #333333;
        font-weight: bold;
      }
      >p{
        color: #999999;
      }
      >span{
        display: block;
        position: absolute;
        width: 50px;
        height: 20px;
        top: 0;
        right: 0;
        background: #F2A000;
        text-align: center;
        line-height: 20px;
        color: #FFFFFF;
      }
    }
  }
</style>
