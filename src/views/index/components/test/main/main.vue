<template>
  <div class="main">
    <s-title :title="'学校信息'"></s-title>
    <s-title :title="'年级信息'">
      <router-link class="fr-button" :to="'/'" tag="a">
          <i class="iconfont icon-zhiban"></i>
          返回首页
        </router-link>
    </s-title>
    <s-title :title="'教师信息'"></s-title>
    <s-menu :menuList="menuList">
      <div slot="right" class="right-btn">
        <i class="iconfont icon-zhiban"></i>
        返回工作台
      </div>
    </s-menu>
    <router-link :to="'/about'" tag="a">go about</router-link><br/>
    <router-link :to="'/otherAbout'" tag="a">go otherAbout</router-link><br/>
    <el-button size="small" class="testBtn" type="primary" @click="testApi" v-stat="{name: '按钮埋点A', data: '传递的数据A'}">测试接口请求1</el-button>
    <el-button class="testBtn" type="primary" @click="testApi2" v-stat="{name: '按钮埋点B', data: '传递的数据B'}">测试权限系统的接口请求2</el-button>
  </div>
</template>
<script>
import { login, testApiService } from '@/views/index/store/api'
export default {
  name: 'Main',
  data () {
    return {
      menuList: [
        {
          title: '课时数据',
          path: '/basic/term-man'
        },
        {
          title: '教师分工',
          path: '/testDrag'
        }
      ]
    }
  },
  mounted () {
    console.log(this.$config, '===============')
  },
  methods: {
    testApi () {
      this.$_showLoading({
        text: '加载中...'
      })
      testApiService({a:1,b:2}).then(res =>{
        console.log(res)
      }).catch(e =>{
        console.log(e)
      })
      setTimeout(() => {
        this.$_hideLoading()
      }, 1000)
    },
    testApi2 () {
      this.$_showLoading({
        text: '加载中...'
      })
      login({a:1,b:2}).then(res =>{
        console.log(res)
      }).catch(e =>{
        console.log(e)
      })
      setTimeout(() => {
        this.$_hideLoading()
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  .right-btn {
    color: $font-color;
    font-weight: bold;
  }
}
</style>
