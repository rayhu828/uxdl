import request from '@/utils/request'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，后面会提到
/**
 * 登陆接口
 * @param {Object} data:用户表单信息
 */
export const login = data => {
  return request({
    method: 'post',
    url: 'backendoauth/login',
    data: QS.stringify(data)
  })
}

/**
 * 获取登录人信息
 */

export const getLoginUser = () => {
  return request({
    method: 'GET',
    url: '/admin/users/adminInfo'
  })
}
