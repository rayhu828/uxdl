<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="query.pageNum"
    :page-size="10"
    layout="total,sizes,prev,pager,next,jumper,slot"
    :page-sizes="[10, 20, 30, 40, 50]"
    background
    prev-text="上一页"
    next-text="下一页"
    :total="total"
  >
    <button slot>确定</button>
  </el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  data () {
    return {}
  },
  props: {
    query: {
      required: true,
      type: Object
    },
    total: {
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
    handleSizeChange (newSize) {
      this.$emit('change-size', newSize)
    },
    handleCurrentChange (newPage) {
      this.$emit('change-page', newPage)
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  /deep/ .el-pager {
    li:not(.disabled).active {
      background-color: #48517b !important;
    }
    li {
      border: 1px solid #cbcfe0;
      background-color: transparent;
      color: #545e8f;
      border-radius: 4px;
      margin: 0 3px;
    }
    .el-icon-more {
      border: 0;
    }
  }
  /deep/ .btn-prev,
  /deep/.btn-next {
    padding: 0 4px;
  }
  /deep/.el-pagination__total {
    color: #545e8f;
    margin-left: 10px;
  }
  /deep/.el-pagination__jump {
    color: #545e8f;
    margin: 0;
  }
  /deep/ .el-pagination__jump {
    margin-right: 10px;
    .el-pagination__editor.el-input {
      width: 35px;
      .el-input__inner {
        width: 30px;
        background-color: transparent;
      }
    }
  }
  /deep/button {
    background-color: transparent !important;
    color: #545e8f;
    border: 1px solid #cbcfe0;
    border-radius: 4px;
    cursor: pointer;
  }
  /deep/.el-input__inner {
    background: transparent;
    color: #545e8f;
  }
}
</style>
