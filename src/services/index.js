import request from '@/utils/request'
/**
 * testApiService
 * @param {Object} data 接口入参
 */
export function testApiService(data) {
  return request({
    url: '/testApiService',
    method: 'post',
    data
  })
}