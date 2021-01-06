<template>
    <div class="dialogForm-container">
        <!-- 编辑 -->
        <el-dialog
            v-if="tagInfo"
            :title="dialogTitle"
            :visible.sync="editVisible"
            width="50%"
            :show-close="false"
            :before-close="handleCloseDialog"
        >
            <el-form
                ref="addFormRef"
                :rules="formRules"
                :model="editForm"
                label-width="100px"
            >
                <el-form-item label="标签名称" prop="tagName">
                    <el-input v-model="editForm.tagName"></el-input>
                </el-form-item>
                <!--选择分类-->
                <el-form-item label="选择分类" prop="selectCate">
                    <el-cascader
                        v-model="editForm.selectCate"
                        :options="tagCate"
                        :props="props"
                        placeholder="请选择分类"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog
            v-else
            :title="dialogTitle"
            :visible.sync="addVisible"
            width="50%"
            :show-close="false"
            :before-close="handleCloseDialog"
        >
            <el-form
                :model="addForm"
                ref="addFormRef"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="标签名称" prop="tagName">
                    <el-input v-model="addForm.tagName" placeholder="请输入标签名"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" prop="selectCate">
                    <el-cascader
                        v-model="addForm.selectCate"
                        :options="tagCate"
                        :props="props"
                        placeholder="请选择分类"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
import {
  getTagCate,
  addTag,
  editTag,
  getTagCateOne
} from '@/api/request/managementCenter/tag.js'
// 获取标签所有分类
export default {
  name: 'dialogForm',
  data () {
    return {
      // 添加表单
      addForm: {
        tagName: '',
        selectCate: [] // 选择标签分类数组
      },
      // 编辑表单
      editForm: {
        tagName: '',
        selectCate: []
      },
      tagCate: [], // 存储所有分类
      // 表单规则
      formRules: {
        tagName: [
          {
            required: true,
            message: '标签名不能为空',
            trigger: 'blur'
          }
        ],
        selectCate: [
          {
            required: true,
            message: '分类不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '标签名不能为空0000',
            trigger: 'blur'
          }
        ]
      },
      props: {
        children: 'categoryList',
        label: 'name',
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'id',
        lazy: true,
        lazyLoad (node, resolve) {
          resolve()
        }
      }
    }
  },
  props: {
    // 编辑表单控制
    editVisible: {
      type: Boolean
    },
    // 添加表单控制
    addVisible: {
      type: Boolean
    },
    // 标签信息对象
    tagInfo: {
      type: Object
    }
  },
  created () {
    this.initCate()
  },
  mounted () {
  },
  computed: {
    dialogTitle () {
      if (this.tagInfo) {
        return '编辑标签'
      }
      return '新增标签'
    }
  },
  methods: {
    // 关闭对话框
    handleCloseDialog () {
      this.$refs.addFormRef.resetFields()
      this.addForm.selectCate = []
      this.$emit('close')
    },
    // 获取所有标签分类
    async initCate () {
      const { data: res } = await getTagCate()
      if (res.code !== 0) return this.$message.error('标签分类加载失败')
      // 需要删除一些为空的分类项，避免级联选择器最后一项为空白页面
      res.data.rows.forEach((element) => {
        this.deleteBlankCate(element)
      })
      this.tagCate = res.data.rows
    },
    // 递归：删除空的分类
    deleteBlankCate (node) {
      if (node.categoryList.length === 0) {
        return delete node.categoryList
      }
      node.categoryList.forEach((item) => {
        this.deleteBlankCate(item)
      })
    },
    // 编辑提交
    async editSubmit () {
      console.log('编辑表单')
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editTag(this.tagInfo.id, {
          name: this.editForm.tagName,
          category_id: this.editForm.selectCate[this.editForm.selectCate.length - 1].toString()
        })
        if (res.code !== 0) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.$refs.addFormRef.resetFields() // 重置表单
        this.$emit('close')
        this.$parent.initTagList()
      })
    },
    // 点击编辑时获取单个标签的分类
    async editTagCate (tag) {
      console.log(this.editForm)
      this.editForm.tagName = tag.name
      const { data: res } = await getTagCateOne(tag.category.id)
      this.getEditTagCate(res.data)
    },
    // 递归获取当前编辑标签的分类
    getEditTagCate (node) {
      // this.editForm.selectCate.push(node.id)
      this.editForm.selectCate = [...this.editForm.selectCate, node.id]
      if (node.categoryList === null || node.categoryList.length === 0) {
        return
      }
      node.categoryList.forEach(item => {
        this.getEditTagCate(item)
      })
    },
    // 新增提交
    async addSubmit () {
      // 校验表单数
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addTag({
          name: this.addForm.tagName,
          category_id: this.addForm.selectCate[this.addForm.selectCate.length - 1].toString()
        })
        if (res.code !== 0) return this.$message.error('新增标签失败')
        this.$message.success('新增标签成功')
        this.$refs.addFormRef.resetFields() // 重置表单
        this.addForm.selectCate = []
        this.$emit('close')
        this.$parent.initTagList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-button--primary {
    background: #663ee7 !important;
    border: 1px solid #663ee7;
}
.el-cascader{
    width: 100%;
}
</style>
