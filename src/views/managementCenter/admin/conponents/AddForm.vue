<template>
  <!-- 新增用户 -->
  <el-dialog
    v-if="!adminInfo"
    title="新增用户"
    :visible.sync="addDialogVisible"
    width="50%"
    :show-close="false"
    :before-close="handleClose"
  >
    <el-form
      ref="addFormRef"
      :rules="rules"
      label-width="80px"
      :model="addForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="addForm.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="addForm.phone" type="tel" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="addForm.status" placeholder="停用">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAdmin">确 定</el-button>
    </span>
  </el-dialog>
  <!--编辑用户 -->
  <el-dialog
    v-else
    title="编辑用户"
    :visible.sync="editialogVisible"
    width="50%"
    :show-close="false"
    :before-close="handleClose"
  >
    <el-form
      ref="addFormRef"
      :rules="rules"
      label-width="80px"
      :model="adminInfo"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="adminInfo.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="adminInfo.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="adminInfo.phone"
          type="tel"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="adminInfo.password"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="selectValue" placeholder="停用">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="editAdminById">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAdmin, editAdmin } from '@/api/request/managementCenter/admin.js'
export default {
  name: 'dialogForm',
  data () {
    const pwdValidator = (rule, value, callback) => {
      const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (!regPwd.test(value)) callback(new Error('密码必须包含字母和数字'))
      callback()
    }
    const phoneValidator = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!regMobile.test(value)) callback(new Error('手机号格式不正确'))
      callback()
    }
    return {
      // 新增用户表单数据
      addForm: {
        username: '', // 用户名
        sex: '1', // 性别
        phone: '', // 手机号
        password: '', // 密码
        status: 0 // 状态
      },
      // 编辑用户表单数据
      rules: {
        username: [
          {
            required: true,
            min: 3,
            max: 18,
            message: '用户名长度在 3 到 18 个字符',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '性别是必选项',
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            min: 3,
            max: 11,
            message: '长度在 3 到 11 个字符',
            trigger: 'blur'
          },
          {
            validator: phoneValidator,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 18,
            message: '密码长度在 6 到 18 个字符，仅包含数字和字母',
            trigger: 'blur'
          },
          {
            validator: pwdValidator,
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '状态是必选项，默认状态为停用',
            trigger: 'change'
          }
        ]
      },
      options: [
        {
          value: 0,
          label: '停用'
        },
        {
          value: 1,
          label: '启用'
        }
      ]
    }
  },
  props: {
    addDialogVisible: {
      type: Boolean
    },
    editialogVisible: {
      type: Boolean
    },
    adminInfo: {
      type: Object
    }
  },
  /**
   * 注册组件
   */
  components: {},
  /**
   * 实例创建完成
   */
  created () {},
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {
    selectValue: {
      get () {
        if (this.adminInfo) {
          return this.adminInfo.status === 0 ? '停用' : '启用'
        }
        return false
      },
      set (newval) {
        // 状态修改时，当前用户的状态重新赋值
        this.adminInfo.status = newval
      }
    }
  },
  methods: {
    switchChange (newState) {
      // eslint-disable-next-line no-unused-expressions
      this.addForm.status ? 1 : 0
    },
    handleClose () {
      this.$refs.addFormRef.resetFields()
      this.$emit('close-dialog')
    },
    // 添加新管理员
    addAdmin () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请正确填写表单项')
        const { data: res } = await addAdmin(this.addForm)
        if (res.code !== 0) return this.$message.error('创建失败')
        this.$message.success(res.message)
        this.$refs.addFormRef.resetFields()
        this.$emit('close-dialog')
        this.$parent.initAdminList()
      })
    },
    // 编辑
    async editAdminById () {
      const id = this.adminInfo.id
      const data = {
        username: this.adminInfo.username,
        sex: this.adminInfo.sex,
        phone: this.adminInfo.phone,
        password: this.adminInfo.password,
        status: this.adminInfo.status
      }
      const { data: res } = await editAdmin(id, data)
      if (res.code !== 0) return this.$message.error('编辑失败！')
      this.$message.success('编辑成功')
      this.$emit('close-dialog')
      this.$parent.initAdminList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog {
    .el-dialog__header {
      text-align: center;
      font-weight: 900;
    }
  }
}
</style>
