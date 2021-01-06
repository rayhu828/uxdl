import request from '@/utils/request'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，

/**
 * 获取管理员列表
 * @param {*} params
 */
export const getAdminData = params => {
  return request({
    method: 'GET',
    url: '/admin/admins',
    params
  })
}
/**
     * 添加管理员
     * @param {*} data
     */
export const addAdmin = data => {
  return request({
    method: 'POST',
    url: '/admin/admins',
    data: QS.stringify(data)
  })
}
/**
     * 启用或禁用管理员状态
     * @param {*} id
     */
export const changeAdminState = (id) => {
  return request({
    method: 'patch',
    url: `/admin/admins/${id}`
  })
}

/**
 * 删除管理员
 * @param {*} id
 */
export const deleteAdmin = (id) => {
  return request({
    method: 'DELETE',
    url: `/admin/admins/${id}`
  })
}

export const editAdmin = (id, data) => {
  return request({
    method: 'PUT',
    url: `/admin/admins/${id}`,
    data: QS.stringify(data)
  })
}
