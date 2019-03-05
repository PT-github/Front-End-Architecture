const getters = {
  token: state => state.user.token,
  collapse: state => state.menu.collapse,
  schoolYear: state => state.course.schoolYear
}
export default getters