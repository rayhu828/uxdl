import request from '../../../utils/request'

// 获取素材列表
export const getMaterData = params => {
  return request({
    method: 'GET',
    url: '/admin/materials/',
    params
  })
}

// 修改素材 浏览量/下载量/收藏量
export const changeNum = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/admin/virtual_data/${id}`,
    data
  })
}

// 停用启用素材
export const changeStatus = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/admin/materials/${id}?status=${data}`,
    data
  })
}

// 删除素材
export const deleteMater = id => {
  return request({
    method: 'DELETE',
    url: `/admin/materials/${id}`
  })
}

// 获取分类数据
export const getClassify = () => {
  return request({
    method: 'GET',
    url: '/admin/categorys/'
  })
}
