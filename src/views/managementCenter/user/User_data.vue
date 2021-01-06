<template>
  <div class="User_data-container">
    <el-table :data="usersTableData" style="width: 100%">
      <el-table-column type="index" label="素材编号" width="100">
        <template slot-scope="scope">
          <!--                    {{ scope.row.create_time }}-->
          <!-- SC+日期+时间+序号 -->
          {{ number(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="素材名称" width="180">
      </el-table-column>
      <el-table-column label="分类" width="180">
        <!-- TODO：查看用户数据，分类管理 -->
        <template slot-scope="scope">
          {{ scope.row.category1_name !== null ? scope.row.category1_name : '' }}
          {{ scope.row.category2_name !== null ? '/' + scope.row.category2_name : '' }}
          {{ scope.row.category3_name !== null ? '/' + scope.row.category3_name : '' }}
          {{ scope.row.category4_name !== null ? '/' + scope.row.category4_name : '' }}
        </template>
      </el-table-column>
      <el-table-column  label="状态" width="80">
          <template slot-scope="scope">
              {{ scope.row.status===1 ? '启用' : '禁用'}}
          </template>
      </el-table-column>
      <el-table-column prop="spec" label="大小" width="80"></el-table-column>
      <el-table-column prop="filetype" label="格式" width="80">
      </el-table-column>
      <el-table-column prop="user_id" label="作者" width="80">
        <!-- TODO：作者 -->
      </el-table-column>
      <el-table-column prop="download_num" label="下载量" width="100">
      </el-table-column>
      <el-table-column prop="visit_num" label="浏览量" width="100">
      </el-table-column>
      <el-table-column prop="collection_num" label="收藏量" width="100">
      </el-table-column>
      <el-table-column label="更新时间" width="120">
        <template slot-scope="scope">
          {{ scope.row.updata_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="mini" @click="deleteData(scope.row)">删除</el-button>
          <el-button size="mini" @click="changeState(scope.row)">{{
              scope.row.status === 1 ? '停用' : '启用'
            }}
          </el-button>
          <el-button size="mini" @click="edit">编辑分类</el-button>
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
    <!-- 编辑分类弹框 -->
    <edit-form :dialogVisible="dialogVisible" @close="closeForm"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { seeUserDataById, deleteMaterial, editMaterialStatus } from '@/api/request/managementCenter/users.js'
import dayjs from 'dayjs'
import EditForm from './components/editDialogForm'

export default {
  name: 'User_data',
  data () {
    return {
      params: {
        id: this.$route.params.userId,
        pageNum: 1,
        pageSize: 10
      },
      usersTableData: [],
      total: 0, // 数据总数目
      dialogVisible: false // 编辑对话框控制
    }
  },
  /**
   * 注册组件
   */
  components: {
    Pagination,
    EditForm
  },
  /**
   * 实例创建完成
   */
  created () {
    this.initUserData()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {
  },
  computed: {},
  methods: {
    async initUserData () {
      console.log(this.params)
      const { data: res } = await seeUserDataById(this.params)
      if (res.code !== 0) return this.$message.error('获取数据失败')
      this.usersTableData = res.data.userMeterial.rows
      this.total = res.data.userMeterial.total
    },
    // 页码值改变
    handleChangePage (newpage) {
      this.params.pageNum = newpage
      this.initUserData()
    },
    // 每页数据改变
    handleChangeSize (newSize) {
      this.params.pageSize = newSize
      this.initUserData()
    },
    // 删除素材
    async deleteData (info) {
      const result = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (result !== 'confirm') return
      const { data: res } = await deleteMaterial(info.id)
      if (res.code !== 0) return this.$message.error('删除失败')
      this.$message.closeAll()
      this.$message.success('删除成功')
    },
    // 停用/启用
    async changeState (info) {
      var text = info.status === 1 ? '停用' : '启用'
      const result = await this.$confirm(`是否${text}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (result !== 'confirm') return
      info.status = info.status === 1 ? 0 : 1
      const { data: res } = await editMaterialStatus(info.id, {
        status: info.status
      })
      if (res.code !== 0) return this.$message.error('启用失败')
      this.$message.closeAll()
      this.$message.success('启用成功')
    },
    edit () {
      this.dialogVisible = true
    },
    closeForm () {
      this.dialogVisible = false
    },
    // 编号
    number (time) {
      // SC+日期+时间+序号
      // const d = new Date()
      return 'SC' + dayjs(time).year() + dayjs(time).month() + dayjs(time).date()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-button {
  height: 30px;
  padding: 0 20px;
  background: #663ee7;
  color: #fff;
}
</style>
