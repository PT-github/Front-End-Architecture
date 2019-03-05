// 服务 开发环境
// export default {
//   // 用户服务
//   USER: 'http://apidev.aorise.org/education-approval-manage'
// }
export default {
  // XXXX系统
  APPROVALURL: 'http://apidev.aorise.org/education-approval-manage', // 审批服务地址
  baseUrl: 'http://apidev.aorise.org/education-base-data', // 开发环境
  // baseUrl: 'http://10.116.64.72:8081', // 开发环境
  COURSEURL: 'http://apidev.aorise.org/education-course-schedule', // 预排
  // COURSEURL: 'http://10.116.64.73:8081', // 文建刚
  // COURSEURL: 'http://10.116.64.130:8081', // 邓波
  // COURSE_HAND_URL: 'http://10.116.65.69:8081', // 邓波 手动排课
  // COURSE_HAND_URL: 'http://10.116.64.73:8081', // 文建刚 手动排课
  COURSE_HAND_URL: 'http://apidev.aorise.org/education-course-schedule', // 手动排课
  // baseUrl: 'http://10.116.64.72:8081', // 冯罡
  // baseUrl: 'http://apidev.aorise.org/education-base-data', // 开发环境
  // baseUrl: 'http://10.116.64.38:8081', // 思雅
  // baseUrl: 'http://10.116.64.107:8081', // 邹偲
  // XXXX系统
  // AUTH: 'http://10.116.64.107:8081/',
  // STATISTICS: 'http://10.116.65.69:8081',
  STATISTICS: 'http://apidev.aorise.org/education-data-analyze', // 数据统计
  AUTH: 'http://apidev.aorise.org/education-user-related',
  COMMON: 'http://apidev.aorise.org/smart-city-common',
  ADDPREFIX: 'http://localhost:8080/#',
  FILEPATH: 'http://file.aorise.org/education/', // 文件地址前缀
  // SCORE_MANAGE: 'http://10.116.65.121:8081/' // 成绩管理
  SCORE_MANAGE: 'http://apidev.aorise.org/education-score-manage/' // 成绩管理
}