<template>
  <div class="Login-container">
    <div class="login_box">
      <div class="login_logo">
        <img src="@/assets/images/uxdl.png" alt="uxdl"/>
      </div>
      <!-- form表单 -->
      <el-form ref="userRef" :rules="userRules" :model="userForm">
        <el-form-item prop="adminname">
          <el-input
            v-model="userForm.adminname"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="userForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <div class="forgotten_pwd">忘记密码</div>
        <!-- 登陆按钮 -->
        <el-button @click="onSubmit">登 陆</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/request/user.js'
import { setStorage } from '@/utils/storage.js'
import globalConfig from '@/globalConfig.json'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data () {
    // TODO:验证规则
    // 密码正则
    // const validatePass = (rule, value, callback) => {
    //   const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    //   if (!pwdReg.test(value)) {
    //     callback(new Error('密码仅包含英文和数字，不区分大小写'))
    //   } else {
    //     if (this.userForm.password !== '') {
    //       this.$refs.userRef.validateField('password')
    //     }
    //     callback()
    //   }
    // }
    return {
      userForm: {
        adminname: 'mumu',
        password: '123456'
      },
      // 验证规则
      userRules: {
        adminname: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
          // TODO:验证规则
          // {
          //   min: 6,
          //   max: 20,
          //   message: '用户名的长度为6-20位',
          //   trigger: 'blur'
          // }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '密码的长度为6-20位',
            trigger: 'blur'
          }
          // TODO:验证规则
          // {
          //   validator: validatePass,
          //   trigger: 'blur'
          // }
        ]
      }
      //
    }
  },
  components: {},
  created () {
  },
  mounted () {
  },
  computed: {},
  methods: {
    ...mapMutations(['setToken']),
    onSubmit () {
      this.$refs.userRef.validate(async valid => {
        if (!valid) return this.$message.error('登录失败')
        const { data: res } = await login(this.userForm)
        if (res.code !== 0) return this.$message.error('登陆失败')
        // 本地存储token
        this.setToken(res.data)
        setStorage(globalConfig.token, res.data)
        this.$router.push('/home')
        this.$message.closeAll()
        this.$message.success('登陆成功')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Login-container {
  height: 100%;
  background: #0c0c26 url("~@/assets/images/login-bg.png") no-repeat center
    center/contain;
  width: 100%;

  .login_box {
    width: 460px;
    height: 340px;
    background: #ffffff;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .login_logo {
      text-align: center;
      width: 460px;
      height: 120px;
      margin-top: -60px;
    }
  }

  /deep/ .el-form {
    padding: 0 53px;

    .el-form-item__content {
      margin: 0 !important;
      padding: 0;
    }

    .el-form-item {
      margin-top: 5px;
    }

    .el-input__inner {
      border: 0;
      border-bottom: 1px solid #9595b1a8;
      border-radius: 0;
      color: #333;
      padding: 0;
    }

    .el-button {
      width: 357px;
      height: 60px;
      background: #373768;
      border-radius: 6px;
      font-size: 24px;
      color: #ffffff;
    }

    .forgotten_pwd {
      text-align: right;
      font-size: 14px;
      color: #999999;
      margin: 22px 0;
    }
  }
}
</style>
