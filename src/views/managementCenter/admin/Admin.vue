<template>
  <div class="admin-container">
    <div class="search_box">
      <el-input
        v-model="searchParams.username"
        placeholder="请输入名称"
        class="input1"
        clearable
        @clear="initAdminList"
      ></el-input>
      <el-input
        v-model="searchParams.phone"
        placeholder="请输入手机号"
        class="input2"
        clearable
        @clear="initAdminList"
      ></el-input>
      <el-button @click="searchClick">搜索</el-button>
      <el-button @click="showAddForm">新增</el-button>
    </div>
    <el-table :data="adminList" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="180">
        <template v-slot="scope">
          {{ scope.row.sex ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="status" label="状态 ">
        <template v-slot="scope">
          {{ scope.row.status === "0" ? "停用" : "启用" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="操作">
        <template v-slot="scope">
          <el-button size="mini" @click="editAdmin(scope)" class="editAdmin"
            >编辑</el-button
          >
          <!--  :class="scope.row.status === '0' ? 'chage_btn' : ''" -->
          <el-button
            size="mini"
            @click="changeState(scope)"
            >{{ scope.row.status === "1" ? "停用" : "启用" }}</el-button
          >
          <el-button size="mini" @click="removeAdmin(scope)" class="deleteBtn"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      :query="params"
      :total="total"
      @change-page="handleChangePage($event)"
      @change-size="handleChangeSize($event)"
    />
    <!-- 新增管理员对话框 -->
    <add-form-dialog
      :addDialogVisible="addDialogVisible"
      @close-dialog="handleClose"
    />
    <!-- 编辑用户对话框 -->
    <add-form-dialog
      :editialogVisible="editialogVisible"
      :adminInfo="adminInfo"
      @close-dialog="handleClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getAdminData,
  changeAdminState,
  deleteAdmin
} from '@/api/request/managementCenter/admin.js'
import addFormDialog from './conponents/AddForm'
export default {
  name: 'admin',
  data () {
    return {
      adminList: [], // 管理员数据列表
      total: 0,
      // 查询所有列表的参数
      params: {
        pageNum: 1, // 页码值
        pageSize: 10 // 每页条数
      },
      // 带有查询参数的数据
      searchParams: {
        username: '', // 用户名
        phone: '' // 手机号
      },
      addDialogVisible: false,
      editialogVisible: false,
      adminInfo: {} // 编辑用户的信息
    }
  },
  /**
   * 注册组件
   */
  components: { Pagination, addFormDialog },
  /**
   * 实例创建完成
   */
  created () {
    this.initAdminList()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {},
  methods: {
    async initAdminList () {
      const { data: res } = await getAdminData(this.params)
      if (res.code !== 0) return this.$message.error('数据列表加载是失败！')
      res.data.rows.forEach(item => {
        item.status = item.status.toString()
      })
      this.adminList = res.data.rows
      this.total = res.data.total
    },
    // 页码值改变
    handleChangePage (newpage) {
      this.params.pageNum = newpage
      this.initAdminList()
    },
    // 每页数据改变
    handleChangeSize (size) {
      this.params.pageSize = size
      this.initAdminList()
    },
    // 搜索事件
    async searchClick () {
      if (
        !(
          this.searchParams.username.trim().length ||
          this.searchParams.phone.trim()
        )
      ) {
        this.$message.closeAll()
        return this.$message.warning('请输入要搜索的关键词')
      }
      if (this.searchParams.username.trim().length !== 0) {
        const { data: res } = await getAdminData({
          username: this.searchParams.username, // 手机号
          pageNum: 1, // 页码值
          pageSize: 10 // 每页条数
        })
        this.adminList = res.data.rows
      } else if (this.searchParams.phone.trim().length !== 0) {
        const { data: res } = await getAdminData({
          phone: this.searchParams.phone, // , // 手机号
          pageNum: 1, // 页码值
          pageSize: 10 // 每页条数
        })
        this.adminList = res.data.rows
      } else {
        const { data: res } = await getAdminData(this.params)
        this.adminList = res.data.rows
      }
    },
    // 新增用户对话框显示
    showAddForm () {
      this.addDialogVisible = true
    },
    // 关闭新增用户对话框表单
    handleClose () {
      this.addDialogVisible = false
      this.editialogVisible = false
    },
    // 切换状态/启用停用
    async changeState (scope) {
      if (scope.row.id === 19) return this.$message.warning('该用户不可被修改')
      const stateText = scope.row.status === '0' ? '启用' : '停用'
      const result = await this.$confirm(`是否确认${stateText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (result !== 'confirm') return
      const { data: res } = await changeAdminState(scope.row.id)
      if (res.code !== 0) {
        return this.$message.error('状态切换失败')
      }
      scope.row.status = scope.row.status === '0' ? '1' : '0'
      this.$message.closeAll()
      this.$message.success(res.message)
    },
    // 删除
    async removeAdmin (adminInfo) {
      if (adminInfo.row.id === 19) {
        return this.$message.error('该用户不可以被删除')
      }
      const result = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).catch(err => err)
      if (result !== 'confirm') return
      const deleteBtn = document.querySelectorAll('.deleteBtn')
      if (deleteBtn.length === 1) {
        // eslint-disable-next-line no-unused-expressions
        this.params.pageNum === 1 ? 1 : this.params.pageNum--
      }
      const { data: res } = await deleteAdmin(adminInfo.row.id)
      if (res.code !== 0) return this.$message.error('删除失败')
      this.$message.success(res.message)
      this.initAdminList()
    },
    // 编辑用户
    editAdmin (scope) {
      if (scope.row.id === 19) return this.$message.warning('该用户不可被编辑')
      this.editialogVisible = true
      this.adminInfo = scope.row
    }
  }
}
</script>
<style lang="less" scoped>
.search_box {
  display: flex;
  margin-bottom: 20px;
  > * {
    margin-right: 20px;
  }
  .el-input {
    font-size: 13px;
    line-height: 32px;
    height: 32px;
  }
  .input1,
  .el-select {
    width: 160px;
    height: 32px;
  }
  .input2 {
    min-width: 220px;
    width: 220px;
    height: 32px;
  }
  .el-date-editor {
    width: 380px;
  }
}
.el-button {
  background: #6563ff;
  color: #fff;
  height: 32px;
  line-height: 32px;
  padding: 0px 20px;
  border: 0;
}
.chage_btn {
  color: #fff;
  background: #f56c6c;
}
</style>
