// 服务 测试环境
// export default {
//   // 用户服务
//   USER: 'http://apitest.aorise.org/education-approval-manage'
// }

export default {
  APPROVALURL: 'http://apirel.aorise.org/education-approval-manage', // 审批服务地址
  // 基础数据
  baseUrl: 'http://apirel.aorise.org/education-base-data',
  // 用户服务
  AUTH: 'http://apirel.aorise.org/education-user-related',
  // 公共服务
  COMMON: 'http://apirel.aorise.org/smart-city-common',
  // 排课管理
  COURSEURL: 'http://apirel.aorise.org/education-course-schedule', // 预排
  // COURSEURL: 'http://10.116.65.207:8081', // 邓波
  COURSE_HAND_URL: 'http://apirel.aorise.org/education-course-schedule', // 手动排课
  // COURSE_HAND_URL: 'http://10.116.64.73:8081', // 手动排课

  // COURSEURL: 'http://apidev.aorise.org/education-course-schedule',
  STATISTICS: 'http://apirel.aorise.org/education-data-analyze', // 数据统计
  ADDPREFIX: 'http://webrel.aorise.org/web-education/#',
  FILEPATH: 'http://file.aorise.org/education/', // 文件地址前缀
  SCORE_MANAGE: 'http://apirel.aorise.org/education-score-manage/' // 成绩管理
}