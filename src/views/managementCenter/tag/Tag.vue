<template>
  <div class="Tag-container">
    <el-input
      v-model="params.name"
      placeholder="请输入名称"
      clearable
      @clear="initTagList"
    ></el-input>
    <el-select
      v-model="params.update_admin"
      placeholder="请选择跟新人"
      clearable
      @clear="initTagList"
    >
      <el-option
        v-for="(item, i) in updateAdmins"
        :key="i"
        :value="item"
        clearable
        @clear="initTagList"
      >
      </el-option>
    </el-select>
    <el-date-picker
      v-model="time"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      clearable
      @clear="initTagList"
      @change="changeTime"
    >
    </el-date-picker>
    <el-button @click="searchClick">搜索</el-button>
    <el-button @click="addForm">新增</el-button>
    <el-table :data="tagTableData" style="width: 100%">
      <el-table-column prop="name" label="标签名称" width="180">
      </el-table-column>
      <el-table-column label="分类" width="180">
      <template slot-scope="scope">
          {{scope.row.category.name}}
      </template>
      </el-table-column>
      <el-table-column prop="update_admin" label="更新人" width="180">
      </el-table-column>
      <el-table-column label="跟新时间">
        <template slot-scope="scope">
          {{ scope.row.update_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editForm(scope)" >编辑</el-button>
          <el-button size="mini" @click="deletetagById(scope)" class="deleteBtn"
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
    <!-- 编辑表单 -->
    <dialog-form
      :editVisible="editVisible"
      @close="handleCloseDialog"
      :tagInfo="tagInfo"
      ref="editForm"
    />
    <!-- 新增表单 -->
    <dialog-form  :addVisible="addVisible" @close="handleCloseDialog" />
  </div>
</template>

<script>
import { getTagList, deleteTag } from '@/api/request/managementCenter/tag.js'
import { getAdminData } from '@/api/request/managementCenter/admin.js'
import Pagination from '@/components/Pagination'
import DialogForm from './components/dialogForm'
export default {
  name: 'Tag',
  data () {
    return {
      updateAdmins: [], // 存储更新人数据
      params: {
        name: '', // 关键字
        update_admin: '', // 更新人
        start_time: '',
        end_time: '',
        pageNum: 1,
        pageSize: 10
      },
      time: ['', ''], // 开始时间-结束时间
      tagTableData: [],
      total: 0,
      editVisible: false, // 编辑对话框控制
      addVisible: false, // 添加对话框控制
      tagInfo: { name: '' } // 编辑表单数据
    }
  },
  /**
   * 注册组件
   */
  components: { Pagination, DialogForm },
  /**
   * 实例创建完成
   */
  created () {
    this.initTagList()
    this.initAdminListData()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {

  },
  computed: {
    tagCateShow () {
      return 1
    }
  },
  methods: {
    // 初始化表格数据
    async initTagList () {
      const { data: res } = await getTagList(this.params)
      if (res.code !== 0) return this.$message.error('数据加载失败')
      this.tagTableData = res.data.rows
      this.total = res.data.total
    },
    // 搜索功能
    async searchClick () {
      // 从第一页数据开始搜索
      this.params.pageNum = 1
      this.params.pageSize = 10
      const { data: res } = await getTagList(this.params)
      if (res.code !== 0) return this.$message.error('数据加载失败')
      this.tagTableData = res.data.rows
      this.total = res.data.total
    },
    changeTime () {
      if (this.time === null) {
        this.params.start_time = ''
        this.params.end_time = ''
        return this.initTagList()
      }
      this.params.start_time = this.time[0]
      this.params.end_time = this.time[1]
    },
    // 获取管理员名单/更新人名单
    async initAdminListData () {
      const { data: res } = await getAdminData()
      console.log(res)
      res.data.rows.forEach(item => {
        this.updateAdmins.push(item.username)
      })
    },
    handleChangePage (newpage) {
      this.params.pageNum = newpage
      this.initTagList()
    },
    handleChangeSize (newsize) {
      this.params.pageSize = newsize
      this.initTagList()
    },
    // 删除标签
    async deletetagById (scope) {
      const result = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).catch(err => err)
      if (result !== 'confirm') return // 取消了删除
      const { data: res } = await deleteTag(scope.row.id)
      if (res.code !== 0) return this.$message.error('删除是失败')
      // 如果是本页最后一行数据，删除后，页码值减一
      const deleteBtn = document.querySelectorAll('.deleteBtn')
      if (deleteBtn.length === 1) {
        // eslint-disable-next-line no-unused-expressions
        this.params.pageNum === 1 ? 1 : this.params.pageNum--
      }
      this.$message.success('删除成功')
      this.initTagList()
    },
    // 编辑标签
    editForm (scope) {
      this.editVisible = true
      this.tagInfo = scope.row
      // 获取标记标签的引用，并且传递数据（标签的信息）
      this.$refs.editForm.editTagCate(scope.row)
    },
    // 新增标签
    addForm () {
      this.addVisible = true
    },
    // 关闭弹出层
    handleCloseDialog () {
      this.editVisible = false
      this.addVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-input {
  width: 200px;
}
.el-button {
  background: #6563ff;
  color: #fff;
  height: 32px;
  line-height: 32px;
  padding: 0 20px;
  border: 0;
}

.el-table {
  margin-top: 20px;
}
.el-range-editor.el-input__inner {
  vertical-align: bottom;
}
.el-input,
.el-select,
.el-date-editor {
  margin-right: 10px;
}
</style>
