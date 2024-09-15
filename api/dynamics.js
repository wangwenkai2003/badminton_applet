import request from '@/common/request.js'
export default {
  save: function (data) {
    return request.post('/dynamics/publish', data)
  },
  getDynamics: function (userAccount) {
    console.log(userAccount, 'param')
    return request.get('/dynamics/getDynamics?userAccount=' + userAccount)
  },
  dylike: function (data) {
    return request.post('/dyLike/save', data)
  },
  publishComment: function (data) {
    console.log(data, 'data')
    return request.post('/comment/publish', data)
  },
  getDynamicsList: function () {
    return request('/dynamics/getDynamicsList')
  },
  getDynamicsPage: function (currentLimit, limit) {
    return request.get('/dynamics/getDynamicsPage', {
      params: {
        currentLimit: currentLimit,
        limit: limit
      }
    })
  },
  getDynamicsByUserAccount: function (userAccount, currentLimit, limit) {
    return request.get('/dynamics/getDynamicsByUserAccount', {
      params: {
        userAccount: userAccount,
        currentLimit: currentLimit,
        limit: limit
      }
    })
  },
  getFollowDynamics: function (userAccount, currentLimit, limit) {
    return request.get('/dynamics/getFollowDynamics', {
      params: {
        userAccount: userAccount,
        currentLimit: currentLimit,
        limit: limit
      }
    })
  }
}
