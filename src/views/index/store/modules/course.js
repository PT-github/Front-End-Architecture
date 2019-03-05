import { getYear } from '../api'
const course = {
  state: {
    // 学年学期
    schoolYear: null
  },
  mutations: {
    SET_SCHOOL_YEAR: (state, schoolYear) => {
      state.schoolYear = schoolYear
    }
  },
  actions: {
    ResetSchoolYear({commit}) {
      commit('SET_SCHOOL_YEAR', null)
    },
    SetSchoolYear({commit}) {
      return new Promise((resolve, reject) => {
        let currentSchool = JSON.parse(localStorage.getItem('currentSchool'));
        if(currentSchool){
          let queryParam = {
            schoolId: currentSchool.uid
          }
          getYear(queryParam).then(response => {
            const data = response.data
            if (data && data.length > 0) {
              console.log("currentSchool",data,currentSchool.uid)
              commit('SET_SCHOOL_YEAR', data)
              resolve(data)
            } else {
              reject()
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    }
  }
}

export default course