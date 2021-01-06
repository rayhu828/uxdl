import request from '@/utils/request'
/**
 * 获取用户列表信息
 * @param {*} params
 */
export const getUsers = params => {
  return request({
    method: 'GET',
    url: '/admin/users',
    params
  })
}
/**
 * 启用/禁用用户
 * @param {*} userId 用户id
 */
export const setUserState = userId => {
  return request({
    method: 'PATCH',
    url: '/admin/users/' + userId
  })
}
/**
 * 查看用户数据
 * @param {*} params
 */
export const seeUserDataById = params => {
  return request({
    method: 'GET',
    url: 'admin/users/meterials',
    params
  })
}
/**
 * 获取用户素材分类
 */
export const getCateGory = () => {
  return request({
    method: 'GET',
    url: '/admin/category'
  })
}

/* ------------------查看数据模块（素材操作）--------------------- */
/**
 * 删除素材
 * @param {*} id  素材id
 */
export const deleteMaterial = id => {
  return request({
    method: 'DELETE',
    url: `/admin/materials/${id}`
  })
}
/**
 * 禁用/启用素材
 * @param {*} id
 */
export const editMaterialStatus = (id, params) => {
  return request({
    method: 'PATCH',
    url: `/admin/materials/${id}`,
    params
  })
}
