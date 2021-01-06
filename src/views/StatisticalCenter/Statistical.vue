<template>
  <div class="Statistical-container">
    <!-- 网站概览 -->
    <div class="overview">
      <div class="title">网站概览</div>
      <div class="select_panel">
        <el-select v-model="yearValue" placeholder="请选择" @change="changeHandle">
          <el-option
            v-for="item in yearArr"
            :key="item"
            :label="item + '年'"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-select v-model="monthValue" placeholder="请选择" @change="changeHandle">
          <el-option
            v-for="item in month"
            :key="item"
            :label="item + '月'"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 数据面板 -->
      <div class="data_panel">
        <div v-for="(item, i) in overviewResult" :key="i">
          <span>{{ item.dataNum }}</span>
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
    <!-- 搜索关键词占比-->
    <ring />
    <!--      柱状图-->
    <pillars />
  </div>
</template>

<script>
import { getOverview } from '@/api/request/StatisticalCenter'
import Ring from './components/Ring.vue'
import Pillars from './components/Pillars.vue'

export default {
  name: 'Statistical',
  data () {
    return {
      yearArr: [2018],
      yearValue: '',
      month: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ],
      monthValue: '',
      query: '', // 查询参数
      overviewResult: [
        {
          title: '素材量'
        },
        {
          title: '浏览量'
        },
        {
          title: '收藏量'
        },
        {
          title: '下载量'
        },
        {
          title: '用户量'
        },
        {
          title: '活跃度'
        }
      ] // 概览数据
    }
  },
  /**
   * 注册组件
   */
  components: {
    Ring,
    Pillars
  },
  /**
   * 实例创建完成
   */
  created () {
    this.query = this.getYears()

    this.initOverView()
  },
  /**
   * 实例挂载完成，请求数据，操作Dom时常用
   */
  mounted () {},
  computed: {},
  methods: {
    // 获取当前年份---2018
    getYears () {
      const dt = new Date()
      const currentYear = dt.getFullYear()
      this.yearValue = dt.getFullYear()
      this.monthValue = dt.getMonth()
      for (let i = 2019; i <= currentYear; i++) {
        this.yearArr.push(i)
      }
      return `${this.yearValue}-${this.monthValue}`
    },
    // 发送请求获取数据
    async initOverView () {
      const { data: res } = await getOverview(this.query)
      if (res.code !== 0) return this.$message.error('获取数据失败')
      this.$message.success('获取数据成功')
      // this.overviewResult = res.data
      let i = 0
      for (const key in res.data) {
        this.overviewResult[i].dataNum = res.data[key]
        i++
      }
      this.$set(this.overviewResult)
    },
    changeHandle () {
      this.query = `${this.yearValue}-${this.monthValue}`
      setTimeout(() => {
        this.overviewResult()
      }, 0)
    }
  }
}
</script>
<style lang='less' scoped>
.Statistical-container {
  width: 100%;
  min-width: 1200px;

  .title {
    color: #333;
    font-size: 16px;
    border-left: 3px solid #5786e7;
    line-height: 20px;
    padding-left: 10px;
  }
}

.overview {
  .select_panel {
    padding: 10px 0;
  }

  .el-select {
    width: 100px;
  }

  .data_panel {
    width: 100%;
    height: 140px;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    padding: 30px 0;
    box-sizing: border-box;

    > div {
      display: flex;
      flex: 1;
      flex-direction: column; /*在上而下*/
      align-items: center;
      justify-content: center;

      &:nth-child(n + 2) {
        border-left: 1px solid #e6e6e6;
      }

      > span {
        &:nth-child(1) {
          color: #319afb;
          font-size: 30px;
          font-weight: bold;
        }

        &:nth-child(2) {
          color: #808080;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
