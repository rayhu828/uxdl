<template>
  <div class="editDialogForm-container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="false"
      :before-close="quit"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          v-for="(cate, index) in form.cate"
          :label="cate.value"
          :key="index"
        >
          <el-input v-model="form.name"></el-input>
          <el-button @click="addCate(cate)">添加</el-button>
          <el-button @click="deleteCate(cate)" v-if="cate.value!=='一级分类'">删除</el-button>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quit">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editDialogForm',
  data () {
    return {
      form: {
        cate: [
          {
            id: 0,
            name: '摄影',
            value: '一级分类'
          }
        ]
      },

      status: [
        {
          value: '0',
          label: '禁用'
        },
        {
          value: '1',
          label: '启用'
        }
      ],
      value: '',
      cateText: ''
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
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
  computed: {},
  methods: {
    quit () {
      this.$emit('close')
    },
    addCate () {
      if (this.form.cate.length === 4) {
        return this.$message.error('最多可添加4个分类')
      }

      switch (this.form.cate.length) {
        case 1:
          this.cateText = '二级分类'
          break
        case 2:
          this.cateText = '三级分类'
          break
        case 3:
          this.cateText = '四级分类'
          break
        default:
          break
      }
      this.form.cate.push({
        value: this.cateText, // 分类级别123
        key: Date.now()
      })
    },
    deleteCate (item) {
      if (item.value === '一级分类') {
        return this.$message.error('一级分类不可被删除')
      }
      var index = this.form.cate.indexOf(item)
      if (index !== -1) {
        this.form.cate.splice(index)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.el-input {
  width: 400px;
}
</style>
