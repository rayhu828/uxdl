<template>
    <div>
        <el-button class="new_classifybtn" @click="classify_DialogVisible = true">新建分类</el-button>
        <!-- 卡片视图 -->
        <el-card :body-style="{ padding: '0px' }">
            <el-table
                :data="classify"
                style="width: 100%"
                :header-cell-class-name="headerStyle"
                class="classify"
                row-key="id"
                :tree-props="{children: 'categoryList', hasChildren: 'hasChildren'}"
            >
                <el-table-column prop="name" label="分类名称" width="180"></el-table-column>
                <el-table-column prop="level" label="分类编号" width="180"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">{{ scope.row.status == '0'? "停用" : "启用" }}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.update_time | dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="nextClassify(scope.row)">新建下级</el-button>
                        <el-button size="mini" @click="editorClassify(scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            @click="stopClassify(scope)"
                        >{{ scope.row.status == '1'? "停用" : "启用" }}</el-button>
                        <el-button size="mini" @click="delClassify(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 页码功能 -->
        <div v-if="this.classify.length !== 0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[4, 6, 8, 10]"
                :current-page="queryInfo.pageNum"
                :page-size="queryInfo.pageSize"
                layout="total, sizes,prev, pager, next,  jumper"
                :total="total"
                prev-text="上一页"
                next-text="下一页"
                background
            ></el-pagination>
        </div>
        <!-- <el-button type="primary">查询</el-button> -->

        <!-- 新建分类弹框 -->
        <el-dialog
            title="新增分类"
            :visible.sync="classify_DialogVisible"
            width="30%"
            :before-close="handleClose"
            center
        >
            <el-form
                ref="new_classifyRef"
                :model="new_classify"
                label-width="100px"
                :rules="new_classifyRules"
            >
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="一级分类" prop="one_name">
                            <el-input v-model="new_classify.one_name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <i class="el-icon-plus icons" @click="addInput"></i>
                    </el-col>
                </el-row>
                <el-row v-show="show">
                    <el-col :span="22">
                        <el-form-item label="二级分类" prop="two_name">
                            <el-input v-model="new_classify.two_name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <i class="el-icon-plus icons" @click="addInput2"></i>
                    </el-col>
                    <el-col :span="1">
                        <i class="el-icon-minus icons" @click="reduceInput"></i>
                    </el-col>
                </el-row>
                <el-row v-show="show2">
                    <el-col :span="22">
                        <el-form-item label="三级分类" prop="three_name">
                            <el-input v-model="new_classify.three_name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <i class="el-icon-plus icons"></i>
                    </el-col>
                    <el-col :span="1">
                        <i class="el-icon-minus icons" @click="reduceInput2"></i>
                    </el-col>
                </el-row>
                <el-form-item label="状态">
                    <el-select v-model="new_classify.status" placeholder="请选择状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addClassify" type="primary">保存</el-button>
                <el-button type="info" @click="classify_DialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 新建下一级弹框 -->
        <el-dialog
            title="新增下级分类"
            :visible.sync="nextClassify_DialogVisible"
            width="30%"
            @close="nextClassifyClose"
            center
        >
            <el-form
                ref="new_classifyRef"
                :model="new_classify"
                label-width="80px"
                :rules="new_classifyRules"
            >
                <el-form-item label="一级分类" prop="one_name">
                    <el-input v-model="new_classify.one_name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="二级分类" prop="two_name">
                    <el-input v-model="new_classify.two_name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="三级分类" prop="three_name">
                    <el-input v-model="new_classify.three_name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="new_classify.status" placeholder="请选择状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveNextClassify" type="primary">保存</el-button>
                <el-button type="info" @click="nextClassifyClose">取消</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类的对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editorDialogVisible"
            width="30%"
            :before-close="editorClose"
        >
            <el-form ref="editor_classifyRef" :model="editor_classify" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="editor_classify.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="分类级别" prop="level">
                    <el-input v-model="editor_classify.level" placeholder="请输入名称" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="editor_classify.status" placeholder="请选择状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editorDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditorClassify">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除弹框 -->
        <el-dialog title="删除" :visible.sync="delDialogVisible" width="30%" center>
            <span>是否确认删除</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDelClassify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
  getCategory,
  addCategory,
  editorCategory,
  saveEditorCategory,
  delCategory,
  editorStatus
} from '@/api/request/managementCenter/category.js'
export default {
  name: 'Categorys',

  props: {},

  components: {},

  data () {
    return {
      // 分类数据
      classify: [],
      // 页面显示条数
      currentPage4: 4,
      // 数据总数
      total: 0,
      // 分类弹框
      classify_DialogVisible: false,
      // 新增下级弹框
      nextClassify_DialogVisible: false,
      // 编辑弹框
      editorDialogVisible: false,
      // 停用弹出框
      stopDialogVisible: false,
      // 启用弹出框
      beginDialogVisible: false,
      // 删除弹出框
      delDialogVisible: false,
      // 新增分类对象
      new_classify: {
        one_name: '',
        two_name: '',
        three_name: '',
        status: '',
        level: ''
      },
      // 添加分类框是否显示
      show: true,
      show2: false,
      // 新增分类验证规则
      new_classifyRules: {
        one_name: [
          {
            required: true,
            message: '请输入一级分类名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '分类名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        two_name: [
          {
            message: '请输入二级分类名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '分类名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        three_name: [
          { message: '请输入三级分类名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '分类名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 单个分类信息
      independence: {},
      // 编辑分类信息
      editor_classify: {},
      // 获取分类信息的分页参数对象
      queryInfo: {
        // 参数名或菜单等级
        condition: '',
        // 当前页显示多少条数据
        pageSize: 4,
        // 当前页数
        pageNum: 1
      }
    }
  },
  created () {
    this.getClassify()
  },

  methods: {
    // 获取分类数据
    async getClassify () {
      const { data: res } = await getCategory(this.queryInfo)
      if (!res.flag) return this.$message.error('获取用户列表失败！')
      console.log(res)
      this.classify = res.data.rows
      this.total = res.data.total
      console.log(this.classify)
    },
    // 头部样式方法
    headerStyle ({ row, column, rowIndex, columnIndex }) {
      return 'tableStyle'
    },
    rowStyle ({ row, column, rowIndex, columnIndex }) {
      return 'tableRowStyle'
    },
    // 页码事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getClassify()
    },
    // 页码改变事件
    handleCurrentChange (newSize) {
      console.log(newSize)
      this.queryInfo.pageNum = newSize
      this.getClassify()
    },
    // 分类弹框关闭
    handleClose (done) {
      this.$refs.new_classifyRef.resetFields()
      this.classify_DialogVisible = false
    },
    // 新增分类事件
    addClassify () {
      const fd = new FormData()
      const names = [
        this.new_classify.one_name,
        this.new_classify.two_name,
        this.new_classify.three_name
      ]
      console.log(names)
      const status = this.new_classify.status
      fd.append('names', names)
      fd.append('status', status)
      console.log(fd)
      this.$refs.new_classifyRef.validate(async valid => {
        if (!valid) return
        // 发起添加的网络请求
        const { data: res } = await addCategory(fd)
        console.log(res)
        if (res.flag !== true) {
          return this.$message.error('添加失败！')
        }
        this.$refs.new_classifyRef.resetFields()
        this.$message.success('添加成功')
        this.classify_DialogVisible = false
        // 重新获取用户数据
        this.getClassify()
      })
    },
    // 关闭下级分类
    nextClassifyClose () {
      this.$refs.new_classifyRef.resetFields()
      this.new_classify.one_name = ''
      this.new_classify.two_name = ''
      this.new_classify.three_name = ''
      this.nextClassify_DialogVisible = false
    },
    // 新建下级事件
    async nextClassify (data) {
      console.log(data.id)
      const { data: res } = await editorCategory(data.id)
      console.log(res)
      console.log(res.data.name)
      if (data.level === 1) {
        this.new_classify.one_name = res.data.name
        if (res.data.status === '1') {
          this.new_classify.status = '1'
        } else {
          this.new_classify.status = '0'
        }
      } else if (data.level === 2) {
        this.new_classify.one_name = res.data.name
        this.new_classify.two_name = res.data.categoryList[0].name

        if (res.data.categoryList[0].status === '1') {
          this.new_classify.status = '1'
        } else {
          this.new_classify.status = '0'
        }
      } else {
        this.new_classify.one_name = res.data.name
        this.new_classify.two_name = res.data.categoryList[0].name
        this.new_classify.three_name =
                    res.data.categoryList[0].categoryList[0].name

        if (res.data.categoryList[0].categoryList[0].status === '1') {
          this.new_classify.status = '1'
        } else {
          this.new_classify.status = '0'
        }
      }

      this.nextClassify_DialogVisible = true
    },
    // 确认保存新建下级事件
    saveNextClassify () {
      const fd = new FormData()
      const names = [
        this.new_classify.one_name,
        this.new_classify.two_name,
        this.new_classify.three_name
      ]
      const status = this.new_classify.status
      fd.append('names', names)
      fd.append('status', status)
      console.log(names)
      this.$refs.new_classifyRef.validate(async valid => {
        if (!valid) return
        // 发起添加下级分类的网络请求
        const { data: res } = await addCategory(fd)
        console.log(res)
        if (res.flag !== true) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功')

        this.classify_DialogVisible = false

        // 重新获取用户数据
        this.getClassify()
      })
      // 重新获取用户数据
      this.getClassify()
      this.$refs.new_classifyRef.resetFields()
      this.new_classify.one_name = ''
      this.nextClassify_DialogVisible = false
    },
    // 编辑分类关闭
    editorClose () {
      this.editorDialogVisible = false
      this.$refs.editor_classifyRef.resetFields()
    },
    // 编辑分类事件
    async editorClassify (data) {
      console.log(data)
      console.log(data.id)
      const { data: res } = await editorCategory(data.id)
      console.log(res)
      if (data.level === 1) {
        this.editor_classify = res.data
      } else if (data.level === 2) {
        this.editor_classify = res.data.categoryList[0]
      } else {
        this.editor_classify = res.data.categoryList[0].categoryList[0]
      }
      console.log(this.editor_classify)
      if (this.editor_classify.status === '1') {
        this.editor_classify.status = '1'
      } else {
        this.editor_classify.status = '0'
      }
      this.editorDialogVisible = true
    },
    // 保存编辑分类
    async saveEditorClassify () {
      console.log(event)
      const fd = new FormData()
      fd.append('name', this.editor_classify.name)
      fd.append('status', this.editor_classify.status)
      // fd.append("parent_id", 0);
      const { data: res } = await saveEditorCategory(
        this.editor_classify.id,
        fd
      )
      console.log(res)
      this.editorDialogVisible = false
      this.getClassify()
      // 提示修改成功
      this.$message.success('编辑分类信息成功！')
    },
    // 删除分类事件
    delClassify (res) {
      this.independence = res
      console.log(this.independence)
      console.log(this.independence.id)
      this.delDialogVisible = true
    },
    // 确认删除事件
    async saveDelClassify () {
      console.log(this.independence.id)
      const { data: res } = await delCategory(this.independence.id)
      console.log(res)
      this.delDialogVisible = false

      // 刷新数据列表
      if (this.classify.length === '0') {
        this.queryInfo.pageNum--
      }
      console.log(this.queryInfo.pageNum)
      this.getClassify()
      // 提示修改成功
      this.$message.success('删除分类信息成功！')
    },
    // 停用事件
    async stopClassify (scope) {
      // const fd = new FormData();
      // fd.append('status', scope.row.status)
      const statusBtn = scope.row.status === '0' ? '启用' : '停用'
      const state = scope.row.status === 0 ? '1' : '0'
      const result = await this.$confirm(`是否确认${statusBtn}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (result !== 'confirm') return
      const { data: res } = await editorStatus(scope.row.id, state)
      console.log(res)
      if (res.code !== 0) {
        return this.$message.error('状态切换失败')
      }
      // 手动切换后台数据
      scope.row.status = scope.row.status === '0' ? '1' : '0'
      this.$message.closeAll()
      this.$message.success(res.message)
    },

    // 新增分类输入框
    addInput () {
      this.show = true
    },
    // 新增三级级分类框
    addInput2 () {
      this.show2 = true
    },
    // 删减分类框
    reduceInput () {
      this.show = false
    },
    reduceInput2 () {
      this.show2 = false
    }
  }
}
</script>

<style scoped lang='less'>
.new_classifybtn {
    width: 160px;
    // height: 30px;
    background: #663ee7;
    border-radius: 3px;
    color: white;
}

.el-card {
    margin-top: 20px;
}

.el-button {
    background: #663ee7;
    color: white;
}

/deep/ .tableStyle {
    width: 1630px;
    height: 50px;
    background: linear-gradient(0deg, #dfe0e6, #fafbff);
    border-radius: 6px 6px 0px 0px;
    text-align: center;
    color: #333333;
}

/deep/ .el-table td,
.el-table th {
    text-align: center !important;
    // padding-left: 30px !important ;
    font-size: 14px;
    font-family: Adobe Heiti Std;
    font-weight: normal;
    color: #333333;
}
/deep/ .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #663ee7 !important;
}

/deep/ .el-table .cell {
    position: relative !important;
}

/deep/ .el-table [class*='el-table__row--level'] .el-table__expand-icon {
    position: absolute;
    right: 40px;
}

/deep/.icons {
    color: #6666ff;
    // font-size: 16px;
    width: 16px;
    height: 16px;
    margin-right: 15px;
    margin-left: 10px;
    margin-top: 12px;
    text-align: center;
}
</style>
