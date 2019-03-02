<template>
  <div class="login">
    <div class="username">
      用户名：<input type="text" name="username" v-model="form.username">
    </div>
    <div class="password">
      密码：<input type="password" name="password" v-model="form.password">
    </div>
    <div class="submit">
      <input type="submit" @click="sub" value="登录">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '11e3333eeee1',
        password: '222'
      }
    }
  },
  methods: {
    sub () {
      console.log('1111AAAAdddd1111')
    }
  }
}
</script>
