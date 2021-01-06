import request from '@/utils/request'
// import QS from 'qs'
// 引入qs模块，用来序列化post类型的数据，

// 获取分类
export const getCategory = params => {
  return request({
    method: 'GET',
    url: '/admin/categorys',
    params
  })
}

// 新增分类接口
export const addCategory = data => {
  return request({
    method: 'post',
    url: '/admin/categorys/',
    data
  })
}

// 获取分类信息
export const editorCategory = (id) => {
  return request({
    method: 'get',
    url: `/admin/categorys/${id}`
  })
}

// 确认修改分类信息
export const saveEditorCategory = (id, fd) => {
  return request({
    method: 'put',
    url: `/admin/categorys/${id}`,
    data: fd
  })
}

// 删除分类事件
export const delCategory = id => {
  return request({
    method: 'DELETE',
    url: `/admin/categorys/${id}`
  })
}

// 确认停用/启用事件
export const editorStatus = (id, data) => {
  return request({
    method: 'PATCH',
    url: `/admin/categorys/${id}?status=${data}`,
    data
  })
}
