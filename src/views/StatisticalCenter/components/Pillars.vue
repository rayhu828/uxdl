<template>
  <div class="pillars">
    <div class="title">数据面板</div>
    <div class="select_panel">
      <div class="time">
        <el-select v-model="yearValue" placeholder="请选择" @change="changeHandle">
          <el-option
            v-for="item in yearArr"
            :key="item"
            :label="item+'年'"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-select v-model="monthValue" placeholder="请选择" @change="changeHandle">
          <el-option
            v-for="item in month"
            :key="item"
            :label="item+'月'"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="category">
        <el-button :type="typeValue==='visitCount'?'primary':'default'" size="mini" @click="btnHandle('visitCount','visitCount')">浏览量</el-button>
        <el-button :type="typeValue==='favouriteCount'?'primary':'default'" size="mini" @click="btnHandle('favouriteCount','favouriteCount')">收藏量</el-button>
        <el-button :type="typeValue==='downloadCount'?'primary':'default'" size="mini" @click="btnHandle('downloadCount','downloadCount')">下载量</el-button>
      </div>
    </div>
    <div class="main"></div>
  </div>

</template>

<script>
import { getPillarsCharts } from '@/api/request/StatisticalCenter'
import * as echarts from 'echarts'
export default {
  name: '',
  data () {
    return {
      yearArr: [2018],
      yearValue: '',
      month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      monthValue: '',
      query: '', // 查询参数
      pillarsData: [], // 图表数据
      pillarsText: [], // 图表文字
      defaultData: [], // 默认展示的数据
      typeValue: 'default',
      value1: '',
      value2: ''
    }
  },
  components: {},
  created () {
    this.getYears()
  },
  mounted () {
    this.initChart('visitCount', 'visitCount')
  },
  computed: {},
  methods: {
    // 获取年份
    getYears () {
      const dt = new Date()
      const currentYear = dt.getFullYear()
      this.yearValue = dt.getFullYear()
      this.monthValue = dt.getMonth()
      for (let i = 2019; i <= currentYear; i++) {
        this.yearArr.push(i)
      }
      this.query = `${this.yearValue}-${this.monthValue}`
    },
    // 获取数据渲染图标
    async  initChart (value, value2) {
      this.typeValue = value2
      this.value1 = value
      this.value2 = value2
      const { data: res } = await getPillarsCharts(this.query)
      if (res.code !== 0) return this.$message.error('数据加载失败')
      this.defaultData = res.data[value] // 设置默认数据
      const arrText = []
      const arrNum = []
      this.defaultData.forEach(item => {
        arrText.push(item.category)
        arrNum.push(item[value2])
      })
      this.pillarsData = arrNum
      this.pillarsText = arrText
      // console.log(res)
      this.initPillars()
      console.log(res.data[value])
    },
    // 初始化一个图标配置
    initPillars () {
      const el = document.querySelector('.main')
      const myChart = echarts.init(el)
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.pillarsText,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'bar',
            barWidth: '40%',
            data: this.pillarsData
          }
        ]
      }
      myChart.setOption(option)
    },
    // 切换查看分类
    btnHandle (value, value2) {
      this.initChart(value, value2)
    },
    changeHandle () {
      this.query = `${this.yearValue}-${this.monthValue}`
      setTimeout(() => {
        this.initChart(this.value1, this.value2)
      }, 0)
    }
  }
}
</script>
<style scoped lang="less">
.title {
  color: #333;
  font-size: 16px;
  border-left: 3px solid #5786E7;
  line-height: 20px;
  padding-left: 10px;
}
.select_panel {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}

.el-select {
  width: 100px;
}
.main{
  width: 100%;
  height: 300px;
  background-color: #fff;
}
</style>
