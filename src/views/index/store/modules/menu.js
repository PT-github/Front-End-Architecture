const user = {
  state: {
    collapse: false
  },
  mutations: {
    SET_COLLAPSE: (state, collapse) => {
        state.collapse = collapse
    }
  },
  actions: {
    // SetUserInfo({commit}, token) {
    //   storage.setItem('token', token)
    //   commit('SET_USERINFO', token)
    // }
  }
}

export default user