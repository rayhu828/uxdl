<template>
  <div class="advertising-container">
    <!-- 搜索区域 -->
    <el-row>
      <el-form ref="paramsRef" :inline="true" :model="params">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="params.name"
              placeholder="请输入轮播图名称"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select v-model="params.status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select v-model="params.upadte_admin" placeholder="请选择更新人">
              <el-option
                :key="index"
                v-for="(item, index) in scupadte_admin"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <!-- 开始日期选择器 -->
            <el-date-picker
              type="date"
              placeholder="选择开始日期"
              v-model="params.start_time"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <!-- 结束日期选择器 -->
            <el-date-picker
              type="date"
              placeholder="选择结束日期"
              v-model="params.end_time"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="4" class="buttons">
          <el-button size="small" type="primary" @click="getAdvertisingList"
            >搜索</el-button
          >
          <el-button size="small" type="primary" @click="addDialogAdvertising"
            >新增</el-button
          >
        </el-col>
      </el-form>
    </el-row>

    <!-- 表格区域 -->
    <el-table :data="advertisingList" border>
      <el-table-column label="轮播图名称" prop="name"></el-table-column>
      <el-table-column label="轮播图图片" prop="image">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? "已停用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="链接地址" prop="link_url"></el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-button type="text" @click="moveUp(scope.$index,scope.row)">上移</el-button>
          <el-button type="text" @click="moveDown(scope.$index,scope.row)"
            >下移</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatetime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status === 1" disabled
            >删除</el-button
          >
          <el-button type="text" v-else @click="deleteBox(scope)"
            >删除</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 1"
            @click="enableBox(scope)"
            >停用</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 0"
            @click="enableBox(scope)"
            >启用</el-button
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

    <!-- 新增弹出框 -->
    <el-dialog
      title="新增轮播图"
      :visible.sync="addDialogVisible"
      width="30%"
      center
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="link_url">
          <el-input
            v-model="addForm.link_url"
            placeholder="请输入链接地址"
          ></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="图片">
          <el-upload
            action="http://139.9.143.69:8002/admin/ads/materials/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :headers="headersObj"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取 消</el-button>
        <el-button type="primary" @click="addDialogAscertain">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  addAdvertising,
  changeAdvertising,
  deleteAdvertising,
  getAdvertisingData,
  moveDownAdvertising,
  moveUpAdvertising
} from '@/api/request/managementCenter/advertising'

export default {
  name: 'Advertising',
  data () {
    return {
      // 轮播图数据列表
      advertisingList: [],
      // 轮播图数据总数
      total: 0,
      // 用于搜索轮播图数据的表单数据
      params: {
        name: '', // 轮播图名称
        status: '', // 状态
        upadte_admin: '', // 更新人名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        pageNum: 1, // 页码
        pageSize: 10 // 每页显示数据条数
      },
      // 下拉搜索框里显示的更新人
      scupadte_admin: [],
      // 控制新增弹出框
      addDialogVisible: false,
      // 新增轮播图的表单数据
      addForm: {
        name: '', // 图片名称
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        image: '', // 上传的图片地址
        link_url: '', // 点击轮播图跳转地址
        remarks: '', // 图片备注
        seq: 1, // 权重值
        status: 0 // 标签状态（1启用，0禁用） 默认禁用
      },
      // 新增表单的验证规则
      addFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 100, message: '长度在 100 个字符以内', trigger: 'blur' }
        ]
      },
      // 上传图片时的请求头
      headersObj: {
        adminuid: this.tokenStr
      }
    }
  },
  /**
   * 注册组件
   */
  components: {
    Pagination
  },
  /**
   * 实例创建完成
   */
  created () {
    this.getAdvertisingList()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {
    // uploadDisabled:function() {
    //     return this.imagelist.length >0
    // },
  },
  methods: {
    // 获取轮播图数据
    async getAdvertisingList () {
      // console.log(this.params)
      const { data: res } = await getAdvertisingData(this.params)
      if (res.data == null) return
      if (res.code !== 0) {
        return this.$message.error('获取轮播图列表失败!')
      }
      // console.log(res.data);
      // 通过循环将得到的的更新人重新拼接成数组
      // eslint-disable-next-line camelcase
      const scupadte_admin = []
      res.data.rows.forEach((item) => {
        scupadte_admin.push(item.upadte_admin)
      })
      // console.log(scupadte_admin);

      // 处理token字符串
      const tokenStr = window.sessionStorage.getItem('"token"')
      this.headersObj.adminuid = tokenStr.slice(1, tokenStr.length - 1)

      // 重置搜索表单数据
      this.params = {
        name: '', // 轮播图名称
        status: '', // 状态
        upadte_admin: '', // 更新人名称
        start_time: '', // 开始时间
        end_time: '' // 结束时间
      }

      this.advertisingList = res.data.rows
      this.total = res.data.total
      // console.log(this.advertisingList);
    },

    // 页码改变时
    handleChangePage (newPage) {
      this.params.pageNum = newPage
      this.getAdvertisingList()
    },

    // 每页显示数据条数改变时
    handleChangeSize (newSize) {
      this.params.pageSize = newSize
      this.getAdvertisingList()
    },

    // 实现停用和启用功能
    async enableBox (scope) {
      // 判断状态实现动态
      const confirmText = scope.row.status === 0 ? '启用' : '禁用'

      const confirmResult = await this.$confirm(
        `是否确认${confirmText}`,
        `${confirmText}`,
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const state = scope.row.status === 0 ? '1' : '0'
      // console.log(scope.row.id);
      // console.log(state);
      const { data: res } = await changeAdvertising(scope.row.id, state)

      if (res.code !== 0) {
        return this.$message.error('更改状态失败!')
      }

      this.$message.success('更新状态成功!')
      this.getAdvertisingList()

      // console.log(confirmResult);
    },

    // 实现删除功能
    async deleteBox (scope) {
      const confirmDelete = await this.$confirm('是否确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)

      // console.log(confirmDelete);

      if (confirmDelete !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await deleteAdvertising(scope.row.id)

      if (res.code !== 0) {
        return this.$message.error('删除数据失败!')
      }

      this.$message.success('删除数据成功!')
      this.getAdvertisingList()
    },

    // 点击新增按钮效果
    addDialogAdvertising () {
      this.addDialogVisible = true
    },

    // 新增弹出框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 点击新增弹出框的取消按钮触发的事件
    async addDialogCancel () {
      const confirmResult = await this.$confirm('是否确认取消', '取消', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('请继续新增操作')
      }

      this.addDialogVisible = false
      this.$message.success('已取消新增操作')
    },

    // 点击新增弹出框的确定按钮触发的事件
    async addDialogAscertain () {
      const confirmResult = await this.$confirm('是否确认保存', '保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消新增')
      }

      // 确定新增，发起请求
      // eslint-disable-next-line camelcase
      const json_data = JSON.stringify(this.addForm)
      const { data: res } = await addAdvertising(json_data)

      if (res.code !== 0) {
        return this.$message.error('新增轮播图失败')
      }

      this.$message.success('新增轮播图成功')
      this.addDialogVisible = false
      this.getAdvertisingList()
    },

    handlePictureCardPreview () {},

    handleRemove () {},

    // 监听蹄片上传成功的事件
    handleSuccess (response) {
      this.addForm.image = response.data.url
      // console.log(this.addForm.image);
    },

    // 监听上移按钮的点击事件
    async moveUp (index, row) {
      if (index > 0) {
        const upData = this.advertisingList[index - 1]
        this.advertisingList.splice(index - 1, 1)
        this.advertisingList.splice(index, 0, upData)
        const { data: res } = await moveUpAdvertising(row.id, -1)
        if (res.code !== 0) {
          return this.$message.error('上移失败')
        }
        this.$message.success('上移成功')
      } else {
        this.$message.error('已经是第一条，不可上移')
      }
    },

    // 监听下移按钮的点击事件
    async moveDown (index, row) {
      if (index + 1 === this.advertisingList.length) {
        this.$message.error('已经是最后一条，不可下移')
      } else {
        const upData = this.advertisingList[index + 1]
        this.advertisingList.splice(index + 1, 1)
        this.advertisingList.splice(index, 0, upData)
        const { data: res } = await moveDownAdvertising(row.id, 1)
        if (res.code !== 0) {
          return this.$message.error('下移失败')
        }
        this.$message.success('下移成功')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 194px;
}
.buttons {
  padding-top: 5px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #000;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.disabled .el-upload-picture-card {
  display: none;
}

.order {
  font-size: 40px;
}
</style>
