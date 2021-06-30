import request from '@/utils/request'

export function getData(data) {
  return request({
    url: '/api/yxStoreAfterSales/sales/List',
    method: 'get',
    data
  })
}

export function salesCheck() {
  return request({
    url: '/api/yxStoreAfterSales/salesCheck',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'api/yxStoreAfterSales',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/yxStoreAfterSales/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/yxStoreAfterSales',
    method: 'put',
    data
  })
}
