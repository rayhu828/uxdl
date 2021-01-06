<template>
  <div class="user-container">
    <div class="search_box">
      <el-input
        v-model="params.name"
        placeholder="请输入名称"
        class="input1"
        clearable
        @clear="initUserList"
      ></el-input>
      <el-input
        v-model="socails"
        placeholder="请输入手机号、微信号、或者QQ号"
        clearable
        class="input2"
        @clear="initUserList"
      ></el-input>
      <!-- 跟新人 -->
      <el-select
        v-model="updataAdminName"
        clearable
        placeholder="请选择更新人"
        @clear="initUserList"
      >
        <el-option
          v-for="(item, index) in updataAdmins"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      <!-- 日期 -->
      <el-date-picker
        v-model="selectTime"
        type="daterange"
        range-separator="至"
        start-placeholder="请选择开始日期"
        end-placeholder="请选结束日期"
        @clear="initUserList"
        @change="handleChangeTime"
      >
      </el-date-picker>
      <el-button @click="searchClick">搜索</el-button>
    </div>
    <el-table :data="userTableData" style="width: 100%">
      <el-table-column prop="name" label="用户名称" width="180">
      </el-table-column>
      <el-table-column prop="id" label="用户ID" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="weixin" label="微信号" width="180">
      </el-table-column>
      <el-table-column prop="qq" label="QQ号" width="180"> </el-table-column>
      <el-table-column prop="material_num" label="素材量" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="switchUserState(scope)">{{
            scope.row.status === 1 ? "禁用" : "启用"
          }}</el-button>
          <el-button @click="seeUserData(scope)">查看数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :query="params"
      :total="total"
      @change-page="handleChangePage($event)"
      @change-size="handleChangeSize($event)"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getUsers,
  setUserState
} from '@/api/request/managementCenter/users.js'
import { getAdminData } from '@/api/request/managementCenter/admin.js'
export default {
  name: 'user',
  data () {
    return {
      updataAdmins: [], // 更新人数组---应该是所有管理员
      updataAdminName: '', // 选择单个跟新人
      selectTime: [],
      userTableData: [],
      params: {
        name: '', // 搜索关键字
        start_time: '', // 开始日期
        end_time: '', // 结束日期
        pageNum: 1, // 页码
        pageSize: 10,
        status: ''
      },
      total: 0,
      socails: '' // 手机/微信/qq
    }
  },
  components: { Pagination },
  created () {
    this.initUserList()
    this.initAdminListData()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {},
  methods: {
    // 初始化页面表格数据
    async initUserList () {
      const { data: res } = await getUsers(this.params)
      console.log(res)
      this.userTableData = res.data.rows
      this.total = res.data.total
    },
    // 获取更新人数据
    async initAdminListData () {
      const { data: res } = await getAdminData()
      res.data.rows.forEach(item => {
        this.updataAdmins.push(item.username)
      })
    },
    // 搜搜
    async searchClick () {
      // 如果所有字段为空，直接跳出
      if (this.params.name.trim().length === 0 && this.socails.trim().length === 0 && this.params.start_time.length === 0 && this.params.end_time.length === 0 && this.updataAdminName.length === 0) return
      // 按照用户名查找
      if (this.params.name.trim()) {
        this.initUserList()
      } else if (this.socails.trim()) {
        // 按照手机号/微信//qq号查找
        const socails = {
          socails: this.socails // 更新人
        }
        const newObj = {}
        Object.assign(newObj, socails, this.params)
        const { data: res } = await getUsers(newObj)
        this.userTableData = res.data.rows
      } else if (this.updataAdminName.trim()) {
        // 根据跟新人查找
        const updataAdmin = {
          update_admin: this.updataAdminName // 更新人
        }
        const newObj = {}
        Object.assign(newObj, updataAdmin, this.params)
        const { data: res } = await getUsers(newObj)
        this.userTableData = res.data.rows
      } else if (this.params.start_time.length !== 0) {
        // 按照时间查询
        this.initUserList()
      }
    },
    // 启用/停用
    async switchUserState (scope) {
      const text = scope.row.status === 1 ? '禁用' : '启用'
      const result = await this.$confirm(`确认${text}`, `${text}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (result !== 'confirm') return
      const { data: res } = await setUserState(scope.row.id)
      if (res.code !== 0) return this.$message.error(text + '失败')
      this.$message.closeAll()
      this.$message.success(text + '成功')
      this.initUserList()
    },
    // 查看用户数据
    seeUserData (scope) {
      this.$router.push(`/user/${scope.row.id}`)
    },
    handleChangePage (newpage) {
      this.params.pageNum = newpage
      this.initUserList()
    },
    handleChangeSize (newsize) {
      this.params.pageSize = newsize
      this.initUserList()
    },
    handleChangeTime () {
      console.log('时间改变了')
      if (this.selectTime === null) {
        this.params.start_time = ''
        this.params.end_time = ''
        return this.initUserList()
      }
      this.params.start_time = this.selectTime[0]
      this.params.end_time = this.selectTime[1]
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
    font-size: 13px !important;
  }
  .input1,
  .el-select {
    width: 160px;
  }
  .input2 {
    min-width: 220px;
    width: 220px;
  }
  .el-date-editor {
    width: 380px;
  }
  /deep/ .el-button {
    height: 30px;
    padding: 0 20px;
    background: #663ee7;
    color: #fff;
  }
}
.el-button {
  height: 30px;
  padding: 0 20px;
  background: #663ee7;
  color: #fff;
}
</style>
