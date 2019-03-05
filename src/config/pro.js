// 服务 生产环境
// export default {
//   // 用户服务
//   USER: 'http://apipro.aorise.org/education-approval-manage'
// }

export default {
  APPROVALURL: 'http://api.aorise.org/education-approval-manage', // 审批服务地址
  // 基础数据
  baseUrl: 'http://api.aorise.org/education-base-data',
  // 用户服务
  AUTH: 'http://api.aorise.org/education-user-related',
  // 公共服务
  COMMON: 'http://api.aorise.org/smart-city-common',
  // 排课管理
  COURSEURL: 'http://api.aorise.org/education-course-schedule', // 预排
  COURSE_HAND_URL: 'http://api.aorise.org/education-course-schedule', // 手动排课
  STATISTICS: 'http://api.aorise.org/education-data-analyze', // 数据统计
  ADDPREFIX: 'http://web.aorise.org/web-education/#', // 前端地址前缀
  FILEPATH: 'http://fileprod.aorise.org/education/', // 文件地址前缀
  SCORE_MANAGE: 'http://api.aorise.org/education-score-manage/' // 成绩管理
}