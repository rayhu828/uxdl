/**
 * sessionStorage
 */
export const setStorage = (key, value) => {
  // 1. 将要存储的数据转换为字符串
  const newKey = JSON.stringify(key)
  const newValue = JSON.stringify(value)
  window.sessionStorage.setItem(newKey, newValue)
}

export const getStorage = key => {
  const newKey = JSON.stringify(key)
  if (window.sessionStorage.getItem(newKey)) {
    const storage = window.sessionStorage.getItem(newKey)
    return JSON.parse(storage)
  } else {
    console.log('读取数据', '本地不存在此数据')
  }
}

export const removeStorage = () => {
  window.sessionStorage.clear()
}
