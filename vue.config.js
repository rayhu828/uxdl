module.exports = {
  chainWebpack: config => {
    // 发布阶段
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      // config.productionSourceMap = false
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        dayjs: 'dayjs',
        // 'json-bigint': 'JSONbig',
        echarts: 'echarts'
      })
    })
    // 开发阶段
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
