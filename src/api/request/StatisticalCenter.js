import request from '@/utils/request'
/**
 * 获取概览数据
 * @param params
 * @returns
 */
export const getOverview = params => {
  return request({
    method: 'GET',
    url: 'admin/statistics/core/overview/' + params
  })
}

export const getCharts = params => {
  console.log(params, '环图传递额参数')
  return request({
    method: 'GET',
    url: 'admin/statistics/core/keyword/' + params
  })
}

// 获取株形图数据
export const getPillarsCharts = params => {
  console.log(params, '环图传递额参数')
  return request({
    method: 'GET',
    url: 'admin/statistics/core/category/' + params
  })
}
