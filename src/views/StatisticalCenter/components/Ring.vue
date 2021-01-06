<template>
    <div class="overview">
        <div class="title">网站概览</div>
        <div class="select_panel">
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
        <div class="data_panel" id="chart-box">
          <div class="chart-item"  v-for="(item,i) in ringData" :key="i"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { getCharts } from '../../../api/request/StatisticalCenter.js'
// import $ from 'jquery'
export default {
  name: '',
  data () {
    return {
      yearArr: [2018],
      yearValue: '',
      month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      monthValue: '',
      query: '', // 查询参数
      total: 0, // 环图的数据条数
      ringData: [] // 环图数据，主要用来创建div个数
    }
  },

  watch: {},
  components: {},
  created () {
  },
  mounted () {
    this.query = this.getYears()
    this.initData()
  },
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
    // 根据返回的数据条数创建环图
    changeHandle () {
      this.query = `${this.yearValue}-${this.monthValue}`
      setTimeout(() => {
        this.initData()
      }, 0)
    },
    // 渲染图标
    async initData () {
      const { data: res } = await getCharts(this.query)
      if (res.code !== 0) return this.$message('数据加载失败')
      this.ringData = res.data // 用来决定创建图标的个数
      // 根据数据条数创建一个元素
      // res.data.forEach((item, index) => {
      //   $('<div class="chart-item"></div>').appendTo($('#chart-box'))
      // })
      // 获取创建的图标
      const el = document.getElementById('chart-box').getElementsByClassName('chart-item')
      // 开始安然图标
      setTimeout(() => {
        res.data.forEach((item, index) => {
          item.el = el[index]
        })
        res.data.forEach(item => {
          this.initChart(item)
        })
      }, 0)
    },
    // 初始化一个环图配置
    initChart (options) {
      const myChart = echarts.init(options.el)
      const getvalue = [options.kcount]
      const option = {
        title: {
          text: getvalue,
          textStyle: {
            color: '#28BCFE',
            fontSize: 16
          },
          subtext: options.keyword,
          subtextStyle: {
            color: '#666666',
            fontSize: 18
          },
          itemGap: 20,
          left: 'center',
          top: '43%'
        },

        angleAxis: {
          max: 100,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false

          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: '150%' // 图形大小
        },
        series: [{
          type: 'bar',
          data: getvalue,
          showBackground: true,
          backgroundStyle: {
            color: '#BDEBFF'
          },
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 6,
          itemStyle: {
            normal: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#25BFFF'
              }, {
                offset: 1,
                color: '#5284DE'
              }]),
              shadowBlur: 5,
              shadowColor: '#2A95F9'
            }
          }
        }]
      }
      myChart.setOption(option)
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
}

.el-select {
    width: 100px;
}

.data_panel {
    background: #fff;
    display: flex;
    justify-content: space-around;
    height: 200px;
    width: 100%;
    div.chart-item {
        width: 200px;
        height: 200px;
    }
}
</style>
