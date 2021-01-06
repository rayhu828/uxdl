import request from '@/utils/request'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，后面会提到

/**
 * 获取所有标签数据
 * @param {*} params
 */
export const getTagList = params => {
  return request({
    method: 'GET',
    url: '/admin/tags',
    params
  })
}
/**
 * 删除标签
 * @param {*} id
 */
export const deleteTag = id => {
  return request({
    method: 'delete',
    url: `/admin/tags/${id}`
  })
}
/**
 * 获取标签的全部分类
 */
export const getTagCate = () => {
  return request({
    method: 'GET',
    url: '/admin/categorys'
  })
}
/**
 * 获取单个标签选中的分类
 */
export const getTagCateOne = cateId => {
  return request({
    method: 'GET',
    url: '/admin/categorys/' + cateId
  })
}
/**
 * 新增标签
 * @param {*} data
 */
export const addTag = data => {
  console.log(data)
  return request({
    method: 'POST',
    url: '/admin/tags',
    data: QS.stringify(data)
  })
}

/**
 * 编辑标签
 * @param {*} id
 */
export const editTag = (id, params) => {
  return request({
    method: 'put',
    url: `/admin/tags/${id}`,
    params
  })
}
