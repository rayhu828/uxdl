import request from '@/utils/request'

// 获取轮播图列表
export const getAdvertisingData = params => {
  return request({
    method: 'GET',
    url: '/admin/ads',
    params
  })
}

// 启用或停用轮播图
export const changeAdvertising = (id, status) => {
  return request({
    method: 'PATCH',
    url: `/admin/ads/${id}?status=${status}`
  })
}

// 删除轮播图
export const deleteAdvertising = id => {
  return request({
    method: 'DELETE',
    url: `/admin/ads/${id}`
  })
}

// 新增轮播图
export const addAdvertising = data => {
  return request({
    method: 'POST',
    url: '/admin/ads/',
    data: JSON.parse(data)
  })
}

// 上移轮播图
export const moveUpAdvertising = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/admin/ads/${id}?seq=${data}`
  })
}

// 下移轮播图
export const moveDownAdvertising = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/admin/ads/${id}?seq=${data}`
  })
}
