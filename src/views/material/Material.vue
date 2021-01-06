<template>
  <div class="Material-container">
    <!-- 搜索区域 -->
    <el-form ref="paramsRef" :model="params" :inline="true">
      <el-row>
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="params.key"
              placeholder="请输入素材名称/用户名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="params.status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-cascader
              v-model="selectClassifyKeys"
              :options="classifyList"
              :props="classifyProps"
              @change="handleChange"
              placeholder="请选择类型"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <template>
              <span>浏览量</span>
              <el-input-number
                size="small"
                v-model="params.view_num"
                :min="0"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
              <span> -- </span>
              <el-input-number
                size="small"
                v-model="params.view_num"
                :min="1"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
            </template>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-form-item>
            <template>
              <el-select
                v-model="params.update_admin"
                placeholder="请选择更新人"
              >
                <el-option
                  v-for="(item, i) in updateAdminArr"
                  :key="i"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <!-- 开始日期选择器 -->
            <el-date-picker
              type="date"
              placeholder="选择开始日期"
              v-model="params.statrTime"
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
              v-model="params.endTime"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <template>
              <span>下载量</span>
              <el-input-number
                size="small"
                v-model="params.dowload_num"
                :min="1"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
              <span> -- </span>
              <el-input-number
                size="small"
                v-model="params.view_num"
                :min="1"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <template>
              <span>收藏量</span>
              <el-input-number
                size="small"
                v-model="params.view_num"
                :min="1"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
              <span> -- </span>
              <el-input-number
                size="small"
                v-model="params.view_num"
                :min="1"
                :max="200"
                label="描述文字"
                controls-position="right"
              ></el-input-number>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item>
            <el-button size="small" type="primary" @click="getMaterList"
              >搜索</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="materList">
      <el-table-column label="素材编号">
        <template slot-scope="scope">
          {{ "SC" }}{{ scope.row.updata_time | dateFormat1 }}{{ "0000" }}
        </template>
      </el-table-column>
      <el-table-column label="素材名称" prop="name"></el-table-column>
      <el-table-column label="分类">
        <template slot-scope="scope">
          {{ scope.row.category1_id }} / {{ scope.row.category2_id }} /
          {{ scope.row.category3_id }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? "已停用" : "已启用" }}
        </template>
      </el-table-column>
      <el-table-column label="大小" prop="source_size"></el-table-column>
      <el-table-column label="格式" prop="filetype"></el-table-column>
      <el-table-column label="作者" prop="user"></el-table-column>
      <el-table-column label="下载量">
        <template slot-scope="scope">
          <el-button type="text"
            >{{ scope.row.download_num }} /
            {{ scope.row.basic_download_num }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="浏览量">
        <template slot-scope="scope">
          <el-button type="text"
            >{{ scope.row.visit_num }} /
            {{ scope.row.basic_visit_num }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="收藏量">
        <template slot-scope="scope">
          <el-button type="text"
            >{{ scope.row.favourite_num }} /
            {{ scope.row.basic_favourite_num }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updata_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status === 0"
            @click="deleteMaterData(scope)"
            >删除</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 0"
            @click="blockMater(scope)"
            >启用</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 1"
            @click="blockMater(scope)"
            >停用</el-button
          >
          <el-button type="text" v-if="scope.row.status === 0"
            >编辑分类</el-button
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
  </div>
</template>

<script>
import {
  getMaterData,
  changeStatus,
  deleteMater,
  getClassify
} from '@/api/request/managementCenter/mater'

import Pagination from '@/components/Pagination'

export default {
  name: 'Material',
  data () {
    return {
      // 获取到的素材列表
      materList: [],
      // 获取分类数据列表
      classifyList: [],
      // 级联选择器的配置对象
      classifyProps: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'categoryList',
        checkStrictly: true
      },

      // 级联选择框双向绑定到的数组
      selectClassifyKeys: [],

      // 查询参数对象
      params: {
        key: '', // 素材名称  或者ID
        status: '', // 状态：1为启用，0为禁用
        update_admin: '', // 更新人id
        statrTime: '', // 开始时间
        endTime: '', // 结束时间
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        categoryId: '', // 分类id
        is_real: '', // 1 表示真实  0 表示非
        dowload_num: '', // 下载量 范围[start,end]----> [1,200]
        view_num: '', // 浏览量  范围[start,end]----> [1,200]
        collection_num: '' // 收藏量  范围[start,end]----> [1,200]
      },
      total: 0,
      // 修改数据时的id参数
      changeId: '',
      // 更新人列表
      updateAdminArr: []
    }
  },
  /**
   * 注册组件
   */
  components: { Pagination },
  /**
   * 实例创建完成
   */
  created () {
    this.getMaterList()
    this.getClassifyList()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {},
  methods: {
    async getMaterList () {
      console.log(this.params)
      const { data: res } = await getMaterData(this.params)
      // console.log(res);
      if (res.code !== 0) {
        return this.$message.error('查询素材列表失败!')
      }

      // 通过循环将更新人变成一个数组
      res.data.rows.forEach((item) => {
        this.updateAdminArr.push(item.update_admin)
      })

      this.$message.success('查询素材列表成功!')
      // 重置表单数据
      this.params = {
        key: '',
        status: '',
        update_admin: '',
        statrTime: '',
        endTime: '',
        categoryId: '',
        is_real: '',
        dowload_num: '',
        view_num: '',
        collection_num: ''
      }
      this.params.key = ''
      this.params.status = ''
      this.params.statrTime = ''
      this.params.endTime = ''
      // 重置级联选择器数据
      this.selectClassifyKeys = []
      this.materList = res.data.rows
      this.total = res.data.total
    },

    // 发起请求，获取分类数据
    async getClassifyList () {
      const { data: res } = await getClassify()

      if (res.code !== 0) {
        return this.$message.error('获取分类列表失败')
      }

      this.classifyList = res.data.rows
    },

    // 页码改变时
    handleChangePage (newPage) {
      this.params.pageNum = newPage
      // 清空更新人数组
      this.updateAdminArr = []
      this.getMaterList()
    },

    // 每页显示数据条数改变时
    handleChangeSize (newSize) {
      this.params.pageSize = newSize
      this.getMaterList()
    },

    // 启用和停用素材
    async blockMater (scope) {
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
      const { data: res } = await changeStatus(scope.row.id, state)

      if (res.code !== 0) {
        return this.$message.error('更改状态失败!')
      }

      this.$message.success('更新状态成功!')
      this.getMaterList()
    },

    // 删除素材
    async deleteMaterData (scope) {
      const confirmDelete = await this.$confirm('是否确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch((err) => err)

      // console.log(confirmDelete);

      if (confirmDelete !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      console.log(scope.row)
      const { data: res } = await deleteMater(scope.row.id)

      if (res.code !== 0) {
        return this.$message.error('删除数据失败!')
      }

      this.$message.success('删除数据成功!')
      this.getMaterList()
    },

    // 级联选择框选中项变化会触发此函数
    handleChange () {
      // console.log(this.selectClassifyKeys);
      this.params.categoryId = this.selectClassifyKeys[
        this.selectClassifyKeys.length - 1
      ]
      console.log(this.params)
    }

  }
}
</script>
<style lang='less' scoped>
.Material-container {
  min-width: 1143px;
  .el-form-item {
  margin-bottom: 0;
}
.el-input-number--small {
  width: 80px;
}
.dialogform {
  padding-left: 70px;
  line-height: 40px;
}
.formitem {
  margin-right: 0;
}

/deep/ .el-input--prefix {
  width: unset;
  .el-input__inner {
    padding-right: unset !important;
  }
}

// .el-date-editor.el-input,
// .el-date-editor.el-input__inner {
//   max-width: 194px;
// }

// .el-col-5 {
//   width: 234px;
// }
}

</style>
