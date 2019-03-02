const user = {
  state: {
    name: ''
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    }
  },
  actions: {
    SetName({ commit }, name) { // 将用户名字存入store
      commit('SET_NAME', name)
    }
  }
}

export default user