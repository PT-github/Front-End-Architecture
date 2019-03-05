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
// ==================导入导出start================
/**
 * 下载模板/导出
 * @param {Object} data 接口入参
 */
// export function downloadModel(data) {
//   return request({
//     url: '/batch/batchDownOrOut?' + data,
//     method: 'GET'
//   })
// }
export function downloadModel(data) {
  return request({
    url: '/batch/batchDownOrOut?',
    method: 'post',
    data
  })
}
/**
 * 删除下载的模板
 * @param {Object} data 接口入参
 */
export function deleteDownLoadFile(filePath) {
  return request({
    url: '/batch/ModelExcelDeleted?filePath=' + filePath,
    method: 'delete'
  })
}
/**
 * 课表导出
 * @param {*} data 
 */
export function exportCourse(data) {
  return request({
    url: '/courseService/exportCourse?schoolId=' + data.schoolId + '&viewType=' + data.viewType + '&uid=' + data.uid + '&showType=' + data.showType,
    method: 'GET',
    mode: 'COURSEURL'
  })
}
/**
 * 统计导出
 * @param {*} data 
 */
export function exportCourseStatistics(data) {
  return request({
    url: '/courseStatisticsService/exportStatistics',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
// ==================用户留言服务start================
/**
 * 新增用户留言
 * @param {Object} data 接口入参
 */
export function addUserNotes(data) {
  return request({
    url: '/userNotesInfoService/userNotes',
    method: 'post',
    data
  })
}
// ==================用户留言服务end================

// ==================用户服务start================
/**
 * 用户登录接口
 * @param {Object} data 接口入参
 */
export function login(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/login',
    method: 'post',
    data
  })
}
/**
 * 用户登出
 * @param {Object} data 登出参数
 */
export function logout(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/logout',
    method: 'GET',
    params: data
  })
}
/**
 * 用户是否注册查询接口
 * @param {Object} data 用户是否注册查询接口
 */
export function checkUserMobile(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/checkUserMobile',
    method: 'GET',
    params: data
  })
}
/**
 * 用户注册接口
 * @param {Object} data 接口入参
 */
export function userReg(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/reg',
    method: 'post',
    data
  })
}
/**
 * 获取验证码接口
 * @param {Object} data 接口入参
 */
export function smsValidateCodes(data) {
  return request({
    mode: 'AUTH',        
    url: '/userService/sms/code',
    method: 'post',
    timeout: 0,
    data
  })
}
/**
 * 忘记密码接口
 * @param {Object} data 接口入参
 */
export function forgetPwd(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/forgetPwd',
    method: 'PUT',
    data
  })
}
/**
 * 用户头像修改接口
 * @param {Object} data 接口入参
 */
export function updateUserImage(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/userImage',
    method: 'PUT',
    data
  })
}
/**
 * 用户手机号修改接口
 * @param {Object} data 接口入参
 */
export function updateUserMobile(data) {
  return request({
    mode: 'AUTH',
    url: '/userService/userMobile',
    method: 'PUT',
    data
  })
}
/**
 * 用户密码修改接口
 * @param {Object} data 接口入参
 */
export function updatePassword(data) {
  return request({
    mode: 'AUTH',        
    url: '/userService/userPassword',
    method: 'PUT',
    data
  })
}
/**
 * 用户信息修改接口
 * @param {Object} data 接口入参
 */
export function updateUserInfo(data) {
  return request({
    mode: 'AUTH',    
    url: '/userService/userInfo',
    method: 'PUT',
    data
  })
}
/**
 * 获取用户信息
 * @param {String} uid 参数
 */
export function getUserInfo(uid) {
  return request({
    mode: 'AUTH',
    url: '/userService/userInfo/' + uid,
    method: 'GET'
  })
}
// ==================用户服务end================

// ==================消息公告服务start================
/**
 * 查询消息详情
 * @param {Object} data 参数
 */
export function getMsgDetail(data) {
  return request({
    mode: 'AUTH',
    url: '/msgNoticeService/detail',
    method: 'GET',
    params: data
  })
}
/**
 * 更新消息(已读)
 * @param {String} uid 接口入参
 */
export function updateMsgStatus(uid) {
  return request({
    mode: 'AUTH',    
    url: '/msgNoticeService/msg/' + uid,
    method: 'PUT'
  })
}
/**
 * 查询消息列表
 * @param {Object} data 参数
 */
export function getMsgList(data) {
  return request({
    mode: 'AUTH',
    url: '/msgNoticeService/msgList',
    method: 'GET',
    params: data
  })
}
/**
 * 新增消息公告
 * @param {Object} data 接口入参
 */
export function addMsgNotice(data) {
  return request({
    mode: 'AUTH',
    url: '/msgNoticeService/msgNotice',
    method: 'post',
    data
  })
}
/**
 * 全部标记为已读
 * @param {Object} data 接口入参
 */
export function updateAllMsgStatus(data) {
  return request({
    mode: 'AUTH',    
    url: '/msgNoticeService/readAll',
    method: 'PUT',
    data
  })
}
// ==================消息公告服务end================

// ==================学校服务start================
/**
 * 新增试用学校记录
 * @param {Object} data 接口入参
 */
export function addNewSchool(data) {
  return request({
    url: '/schoolInfoService/schools',
    method: 'post',
    data
  })
}
/**
 * 查询用户学校相关数据信息(工作台的统计数据)
 *  @param {Object} data 接口入参
 */
export function getUserSchoolInfo(data) {
  return request({
    url: '/schoolInfoService/correlationInfo',
    method: 'GET',
    params: data
  })
}
/**
 * 查询我的学校
 *  @param {Object} data 接口入参
 */
export function getMySchoolList(data) {
  return request({
    url: '/schoolInfoService/mySchool',
    method: 'GET',
    params: data
  })
}
/**
 * 学校审核
 * @param {Object} data 接口入参
 */
export function schoolAudit(data) {
  return request({
    url: '/schoolInfoService/school',
    method: 'PUT',
    data
  })
}
/**
 * 学校认证
 * @param {Object} data 接口入参
 */
export function schoolAttestation(data) {
  return request({
    url: '/schoolInfoService/schoolAttestation',
    method: 'PUT',
    data
  })
}
/**
 * 根据省市区id查询学校列表
 *  @param {Object} data 接口入参
 */
export function getSchoolListByAreaId(data) {
  return request({
    url: '/schoolInfoService/schoolList',
    method: 'GET',
    params: data
  })
}
/**
 * 查询学校详情信息
 *  @param {String} uid 接口入参
 */
export function getSchoolsDetial(uid) {
  return request({
    url: '/schoolInfoService/schoolsDetial/' + uid,
    method: 'GET'
  })
}
// ==================学校服务end================

// ==================用户入校服务start================
/**
 * 查询我的申请(加入学校)记录
 *  @param {String} userId 接口入参
 */
export function getApplyForRecord(userId) {
  return request({
    url: '/userEnterSchoolService/applyForRecord',
    method: 'GET',
    params: userId
  })
}
/**
 * 用户申请入校
 * @param {Object} data 接口入参
 */
export function userEnterSchools(data) {
  return request({
    url: '/userEnterSchoolService/enterSchools',
    method: 'post',
    data
  })
}
/** 
 * 退出学校
 * @param {Object} data 入参
 */
export function exitSchool(data) {
  return request({
    url: '/userEnterSchoolService/enterSchools',
    method: 'delete',
    params: data
  })
}
// ==================用户入校服务end================

// ==================区域信息服务start================
/**
 * 查询所有区域信息并以层级结构返回
 */
export function getAllAreaLevel() {
  return request({
    mode: 'COMMON',
    url: '/SysAreaInfoController/areaLevel',
    method: 'GET'
  })
}
// ==================区域信息服务end================

// ==================字典信息服务start================
/**
 * 查询所有字典数据
 */
export function getAllDic() {
  return request({
    url: '/dictInfoService/all',
    method: 'GET'
  })
}
// ==================字典信息服务end================

// ==================首页系统参数服务===============
/**
 * 查询首页系统参数
 */
export function getIndexPageParam() {
  return request({
    url: '/sysParamInfoService/paramInfoServiceList',
    method: 'GET'
  })
}
// ==================上传服务start===========
/**
 * 上传
 * @param {Object} file 接口入参
 */
export function upload(data) {
  return request({
    url: '/new',
    method: 'post',
    data
  })
}
/**
 * 上传头像
 * @param {Object} data 接口入参
 */
export function uploadPhoto(data) {
  return request({
    mode: 'AUTH',
    url: '/uploadService/image',
    method: 'post',
    data
  })
}
// ==================上传服务end===========

// ==================调课审批服务start===========
/**
 * 调课申请接口
 *  @param {Object} data 接口入参
 */
export function addApplyClass(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/exchange/apply',
    method: 'post',
    data
  })
}

/**
 * 调课审批接口
 * @param {Object} data 接口入参
 */
export function applyClassApprove(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/exchange/approve',
    method: 'PUT',
    data
  })
}

/**
 * 学校流程详情接口
 *  @param {Object} data 接口入参
 */
export function getApplyClassDetail(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/exchange/detail',
    method: 'GET',
    params: data
  })
}

/**
 * 调课审批列表查询接口
 *  @param {Object} data 接口入参
 */
export function getApplyClassList(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/exchanges',
    method: 'GET',
    params: data
  })
}

/**
 * 是否可以设置流程
 *  @param {String} uid 接口入参
 */
export function flowEditable(uid) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/exchange/editable/' + uid,
    method: 'GET'
  })
}

// ==================调课审批服务end===========

// ==================学校流程服务start===========
/**
 * 学校流程详情接口
 *  @param {String} uid 接口入参
 */
export function getSchoolFlow(uid) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/schoolFlow/' + uid,
    method: 'GET'
  })
}

/**
 * 学校流程修改接口
 * @param {Object} data 接口入参
 */
export function updateSchoolFlow(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/schoolFlow',
    method: 'PUT',
    data
  })
}

/**
 * 学校流程列表接口
 *  @param {Object} data 接口入参
 */
export function getSchoolFlowList(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/flowService/schoolFlows',
    method: 'GET',
    params: data
  })
}
// ==================学校流程服务start===========

// ==================代课管理服务start===========
/**
 * 查询代课详情信息
 *  @param {String} uid 接口入参
 */
export function getExchangeClassDetial(uid) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/detail/' + uid,
    method: 'GET'
  })
}

/**
 * 查询当前时间段能否代课
 *  @param {Object} data 接口入参
 */
export function canExchangeClass(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/exchange',
    method: 'GET',
    params: data
  })
}

/**
 * 查询代课列表
 *  @param {Object} data 接口入参
 */
export function getExchangeList(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/exchangeList',
    method: 'GET',
    params: data
  })
}

/**
 * 查询代课教师列表
 *  @param {Object} data 接口入参
 */
export function getExchangeTeacherInfo(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/teacherInfo',
    method: 'GET',
    params: data
  })
}

/**
 * 新增代课
 *  @param {Object} data 接口入参
 */
export function addExchangeClass(data) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/exchange',
    method: 'post',
    data
  })
}

/**
 * 销毁代课
 * @param {String} uid 接口入参
 */
export function destroyExchangeClass(uid) {
  return request({
    mode: 'APPROVALURL',
    url: '/courseExchangeService/exchange/' + uid,
    method: 'PUT'
  })
}

// ==================代课管理服务end===========
/**
 * 操作日志（页面/触点）
 * @param {Object} data 操作日志入参
 */
export function sendSpot(data) {
  if (process.env.VUE_APP_API === 'dev') {
    console.log('开发环境记录日志到后台', "数据：" + JSON.stringify(data))
  } else {
    return request({
      url: '/sendSpot',
      method: 'post',
      data
    })
  }
}
/** 
 * getYearTermList
 * 学年学期列表列表
 * @param {Object} data 入参
 */
export function getYearTermList(data) {
  return request({
    url: '/termInfoService/termList',
    method: 'get',
    params: data
  })
}
/***************   科目信息start   ***********************/
/** 
 * getSubInfoList
 * 科目信息列表
 * @param {Object} data 入参
 */
export function getSubInfoList(data) {
  return request({
    url: '/subjectInfoService/subjectInfoList',
    method: 'get',
    params: data
  })
}
/** 
 * subInfoAdd
 * 科目信息新增
 * @param {Object} data 入参
 */
export function subInfoAdd(data) {
  return request({
    url: '/subjectInfoService/subjectInfos',
    method: 'post',
    data
  })
}
/** 
 * subInfoUpdate
 * 科目信息修改
 * @param {Object} data 入参
 */
export function subInfoUpdate(data) {
  return request({
    url: '/subjectInfoService/subjectInfos',
    method: 'put',
    data
  })
}
/** 
 * subInfoDelete
 * 科目信息删除
 * @param {String} id 入参
 */
export function subInfoDelete(id) {
  return request({
    url: '/subjectInfoService/subjectInfos/' + id,
    method: 'delete'
  })
}
/** 
 * getSubTermList
 * 科目查询学期下拉框
 * @param {Object} data 入参
 */
export function getSubTermList() {
  return request({
    url: '/sysYearInfoService/year',
    method: 'get'
  })
}
/** 
 * getSubClassList
 * 科目查询年级班级
 * @param {Object} data 入参
 */
export function getSubClassListGAI(data) {
  return request({
    url: '/gradeInfoService/gradeInfoList',
    method: 'get',
    params: data
  })
}
/** 
 * getSubClassList
 * 科目查询年级班级
 * @param {Object} data 入参
 */
export function getSubClassList(data) {
  return request({
    url: '/gradeInfoService/gradeClass',
    method: 'get',
    params: data
  })
}
/** 
 * getStageGradeClass
 * 查询学段年级班级
 * @param {Object} data 入参
 */
export function getStageGradeClass(data) {
  return request({
    url: '/gradeInfoService/stageGradeClass',
    method: 'get',
    params: data
  })
}
/** 
 * getSubPlaceTreeList
 * 科目查询年级班级
 * @param {Object} data 入参
 */
export function getSubPlaceTreeList(data) {
  return request({
    url: '/placeTypeService/placeTypeTree',
    method: 'get',
    params: data
  })
}
/***************   科目信息end   ***********************/
/***************   场地信息start   ***********************/
/** 
 * getVenueList
 * 场地信息列表
 * @param {Object} data 入参
 */
export function getVenueList(data) {
  return request({
    url: '/schoolPlaceService/placeInfosList',
    method: 'get',
    params: data
  })
}
/** 
 * venueAdd
 * 场地信息新增
 * @param {Object} data 入参
 */
export function venueAdd(data) {
  return request({
    url: '/schoolPlaceService/placeInfos',
    method: 'post',
    data
  })
}
/** 
 * venueUpdate
 * 场地信息修改
 * @param {Object} data 入参
 */
export function venueUpdate(data) {
  return request({
    url: '/schoolPlaceService/placeInfos',
    method: 'put',
    data
  })
}
/** 
 * venueDelete
 * 场地信息删除
 * @param {String} id 入参
 */
export function venueDelete(id) {
  return request({
    url: '/schoolPlaceService/placeInfos/' + id,
    method: 'delete'
  })
}
/***************   场地信息end   ***********************/
/* =====================学年学期start========================= */
/**
 * addTerm
 * @param {Object} data 接口入参
 * 新增学年学期
 */
export function addTerm(data) {
  return request({
    url: '/termInfoService/term',
    method: 'post',
    data
  })
}
/**
 * updateTerm
 * @param {Object} data 接口入参
 * 修改学年学期
 */
export function updateTerm(data) {
  return request({
    url: '/termInfoService/term',
    method: 'PUT',
    data
  })
}
/**
 * getTerm
 * @param {Object} data 接口入参
 * 查询学年学期列表
 */
export function getTerm(data) {
  return request({
    url: '/termInfoService/term',
    method: 'GET',
    params: data,
  })
}
/**
 * getYear
 * @param {Object} 无 接口入参
 * 查询学年
 */
export function getYear(data) {
  return request({
    url: '/termInfoService/years',
    method: 'GET',
    params: data
  })
}
/* export function getYear() {
  return request({
    url: '/sysYearInfoService/year',
    method: 'GET',
    params: {}
  })
} */
/**
 * deleteTerm
 * @param {Object} data 接口入参
 * 删除学期接口
 */
export function deleteTerm(data) {
  return request({
    url: '/termInfoService/terms',
    method: 'DELETE',
    params: data,
  })
}
/**
 * getFiveYear
 * @param {Object} 无 接口入参
 * 查询当前学年往后走5年
 */
export function getFiveYear() {
  return request({
    url: '/sysYearInfoService/year',
    method: 'GET',
    params: {}
  })
}
/**
 * getCurrentTerm
 * @param {Object} data
 * 查询当前学期(根据学校UID)
 */
export function getCurrentTerm(data) {
  return request({
    url: '/termInfoService/currentTerm',
    method: 'GET',
    params: data
  })
}
/* =====================学年学期end========================= */

/* =====================教师start========================= */
/**
 * addTeacher
 * @param {Object} data 接口入参
 * 创建教师信息
 */
export function addTeacher(data) {
  return request({
    url: '/teacherInfoService/teacher',
    method: 'post',
    data
  })
}
/**
 * updateTeacher
 * @param {Object} data 接口入参
 * 修改教师信息
 */
export function updateTeacher(data) {
  return request({
    url: '/teacherInfoService/teacher',
    method: 'PUT',
    data
  })
}
/**
 * getTeacher
 * @param {Object} data 接口入参
 * 查询教师列表
 */
export function getTeacher(data) {
  return request({
    url: '/teacherInfoService/teacher',
    method: 'GET',
    params: data,
  })
}
/**
 * allTeacher
 * @param {Object} data 接口入参
 * 查询所有老师
 */
export function getAllTeacher(data) {
  return request({
    url: '/teacherInfoService/allTeacher',
    method: 'GET',
    params: data,
  })
}
/**
 * getTeacherNo
 * @param {Object} data 接口入参
 * 查询教师编号
 */
export function getTeacherNo(data) {
  return request({
    url: '/teacherInfoService/teacherNo',
    method: 'GET',
    params: data
  })
}
/**
 * getTeacherGrade
 * @param {Object} data 接口入参
 * 查询该教师所在年级的所有教师
 */
export function getTeacherGrade(data) {
  return request({
    url: '/teacherInfoService/teacherGrade',
    method: 'GET',
    params: data
  })
}
/**
 * deleteTeacher
 * @param {Object} uid 接口入参
 * 删除教师信息
 */
export function deleteTeacher(uid) {
  return request({
    url: '/teacherInfoService/teacher/' + uid,
    method: 'DELETE',
    params: {},
  })
}
/**
 * deleteBatchTeacher
 * @param {Object} data 接口入参
 * 批量删除教师信息
 */
export function deleteBatchTeacher(data) {
  return request({
    url: '/teacherInfoService/teachers',
    method: 'DELETE',
    params: data,
  })
}
/**
 * putDimission
 * @param uid 接口入参
 * 教师离职信息
 */
export function putDimission(uid) {
  return request({
    url: '/teacherInfoService/dimission/' + uid,
    method: 'PUT',
  })
}
/**
 * putEnterSchool
 * @param uid 接口入参
 * 教师入校信息
 */
export function putEnterSchool(data) {
  return request({
    url: '/teacherInfoService/teacherEnterSchool',
    method: 'PUT',
    data
  })
}
/* =====================教师end========================= */
/***************   场地分类start   ***********************/
/** 
 * getVenueTypeList
 * 场地分类列表
 * @param {Object} data 入参
 */
export function getVenueTypeList(data) {
  return request({
    url: '/placeTypeService/placeTypeList',
    method: 'get',
    params: data
  })
}
/** 
 * venueTypeAdd
 * 场地分类新增
 * @param {Object} data 入参
 */
export function venueTypeAdd(data) {
  return request({
    url: '/placeTypeService/placeTypes',
    method: 'post',
    data
  })
}
/** 
 * venueTypeUpdate
 * 场地分类修改
 * @param {Object} data 入参
 */
export function venueTypeUpdate(data) {
  return request({
    url: '/placeTypeService/placeTypes',
    method: 'put',
    data
  })
}
/** 
 * venueTypeDelete
 * 场地分类删除
 * @param {String} id 入参
 */
export function venueTypeDelete(id) {
  return request({
    url: '/placeTypeService/placeTypes/' + id,
    method: 'delete'
  })
}
/***************   场地分类end   ***********************/
/***************   课时数据start   ***********************/
/** 
 * getNoClassDataList
 * 无课信息查询
 * @param {Object} data 入参
 */
export function getNoClassDataList(data) {
  return request({
    url: '/courseService/noCourses',
    method: 'get',
    params: data
  })
}
/** 
 * getClassDataList
 * 课时数据查询
 * @param {Object} data 入参
 */
export function getClassDataList(data) {
  return request({
    url: '/courseService/courseParam',
    method: 'get',
    params: data
  })
}
/** 
 * gradeInit
 * 单个年级课时数据新增接口
 * @param {Object} data 入参
 */
export function gradeInit(data) {
  return request({
    url: '/courseService/gradeInit',
    method: 'post',
    params: {
      schoolId: data.schoolId,
      termId: data.termId,
      gradeId: data.gradeId
    }
  })
}
/** 
 * classDataAdd
 * 课时数据新增
 * @param {Object} data 入参
 */
export function classDataAdd(data) {
  return request({
    url: '/courseService/courseParam',
    method: 'post',
    data
  })
}
/** 
 * classDataUpdate
 * 课时数据修改
 * @param {Object} data 入参
 */
export function classDataUpdate(data) {
  return request({
    url: '/courseService/batchCourseParam',
    method: 'put',
    data
  })
}
/** 
 * getClassTimeList
 * 节次时间查询
 * @param {Object} data 入参
 */
export function getClassTimeList(data) {
  return request({
    url: '/courseService/courseTime',
    method: 'get',
    params: data
  })
}
/** 
 * classTimeAdd
 * 节次时间新增
 * @param {Object} data 入参
 */
export function classTimeAdd(data) {
  return request({
    url: '/courseService/courseTime',
    method: 'post',
    data
  })
}
/** 
 * classTimeUpdate
 * 节次时间修改
 * @param {Object} data 入参
 */
export function classTimeUpdate(data) {
  return request({
    url: '/courseService/courseTime',
    method: 'put',
    data
  })
}
/** 
 * getClassListByTeacher
 * 根据教师和学校查询课时
 * @param {Object} data 入参
 */
export function getClassListByTeacher(data) {
  return request({
    mode: 'COURSEURL',
    url: '/courseService/selectCoursesByTeacher',
    method: 'get',
    params: data
  })
}
/** 
 * selectTeacherCourseByIndex
 * 根据教师和学校查询课时(工作台查教师课表)
 * @param {Object} data 入参
 */
export function getClassListByTeacherIndex(data) {
  return request({
    mode: 'COURSEURL',
    url: '/courseService/selectTeacherCourseByIndex',
    method: 'get',
    params: data
  })
}
/** 
 * getCoursesByTeacherId
 * 针对调课获取教师课表
 * @param {Object} data 入参
 */
export function getCoursesByTeacherId(data) {
  return request({
    mode: 'COURSEURL',
    url: '/courseService/selectCoursesByTeacherId',
    method: 'get',
    params: data
  })
}

/** 
 * getCoursesByClassId
 * 针对调课获取班级课表
 * @param {Object} data 入参
 */
export function getCoursesByClassId(data) {
  return request({
    mode: 'COURSEURL',
    url: '/courseService/selectCoursesByClassId',
    method: 'get',
    params: data
  })
}
/***************   课时数据end   ***********************/
/* =====================教研组start========================= */
/**
 * addTeachingGroup
 * @param {Object} data 接口入参
 * 创建教研组
 */
export function addTeachingGroup(data) {
  return request({
    url: '/teacherGroupService/group',
    method: 'post',
    data
  })
}
/**
 * getTeachingGroup
 * @param {Object} data 接口入参
 * 查询教研组列表
 */
export function getTeachingGroup(data) {
  return request({
    url: '/teacherGroupService/group',
    method: 'GET',
    params: data,
  })
}
/**
 * updateTeachingGroup
 * @param {Object} data 接口入参
 * 修改教研组信息
 */
export function updateTeachingGroup(data) {
  return request({
    url: '/teacherGroupService/group',
    method: 'PUT',
    data
  })
}
/**
 * deleteTeachingGroup
 * @param {Object} uid 接口入参
 * 删除教研组信息
 */
export function deleteTeachingGroup(uid) {
  return request({
    url: '/teacherGroupService//group/' + uid,
    method: 'DELETE',
    params: {},
  })
}
/**
 * getStageGrade
 * @param {Object} data 接口入参
 * 查询学段年级
 */
export function getStageGrade(data) {
  return request({
    url: '/teacherGroupService/stageGrade',
    method: 'GET',
    params: data,
  })
}
/**
 * getTeachingGroupTeacher
 * @param {Object} data 接口入参
 * 查询教师所属的教研组
 */
export function getTeachingGroupTeacher(data) {
  return request({
    url: '/teacherGroupService/teacher',
    method: 'GET',
    params: data,
  })
}
/**
 * getSubjects
 * @param {Object} data 接口入参
 * 查询科目
 */
export function getSubjects(data) {
  return request({
    url: '/subjectInfoService/subjects',
    method: 'GET',
    params: data,
  })
}
/**
 * getParam
 * @param {Object} data 接口入参
 * 查询是否设置教研组类型
 */
export function getParam(data) {
  return request({
    url: '/teacherGroupService/paramInfo',
    method: 'GET',
    params: data,
  })
}
/**
 * setParam
 * @param {Object} data 接口入参
 * 设置教研组类型
 */
export function setParam(data) {
  return request({
    url: '/paramInfoService/param',
    method: 'post',
    data
  })
}
/* =====================教研组end========================= */
/***************   教学分工start   ***********************/
/** 
 * getTeacherDivisionList
 * 教学分工查询
 * @param {Object} data 入参
 */
export function getTeacherDivisionList(data) {
  return request({
    url: '/divisionService/teachingDivisions',
    method: 'get',
    params: data
  })
}
/** 
 * teacherDivisionAdd
 * 教学分工新增
 * @param {Object} data 入参
 */
export function teacherDivisionAdd(data) {
  return request({
    url: '/divisionService/teachingDivision',
    method: 'post',
    data
  })
}
/** 
 * teacherDivisionUpdate
 * 教学分工修改
 * @param {Object} data 入参
 */
export function teacherDivisionUpdate(data) {
  return request({
    url: '/divisionService/teachingDivisions',
    method: 'put',
    data
  })
}
/** 
 * teacherDivisionDelete
 * 教学分工删除
 * @param {Object} data 入参
 */
export function teacherDivisionDelete(data) {
  return request({
    url: '/divisionService/teachingDivisions?termId=' + data.termId + '&classId=' + data.classId + '&subjectId=' + data.subjectId,
    method: 'delete'
  })
}
/** 
 * getAlarmQuotasList
 * 预警指标查询
 * @param {Object} data 入参
 */
export function getAlarmQuotasList(data) {
  return request({
    url: '/divisionService/alarmQuotas',
    method: 'get',
    params: data
  })
}
/** 
 * alarmQuotasUpdate
 * 预警指标修改
 * @param {Object} data 入参
 */
export function alarmQuotasUpdate(data) {
  return request({
    url: '/divisionService/alarmQuotas',
    method: 'put',
    data
  })
}
/** 
 * getTeacherVisionsList
 * 教师视角查询
 * @param {Object} data 入参
 */
export function getTeacherVisionsList(data) {
  return request({
    url: '/divisionService/teacherPespective',
    method: 'get',
    params: data
  })
}
/** 
 * getTeacherVisionsList
 * 教师视角剩余课节数
 * @param {Object} data 入参
 */
export function getRemaindingDivisions(data) {
  return request({
    url: '/divisionService/remainingDivisions',
    method: 'get',
    params: data
  })
}
/***************   教学分工end   ***********************/

/* =====================年级班级start========================= */
/**
 * addGradeClass
 * @param {Object} data 接口入参
 * 新增年级班级
 */
export function addGradeClass(data) {
  return request({
    url: '/gradeInfoService/gradeClass',
    method: 'post',
    data
  })
}

/**
 * getBaseGrade
 * @param {Object} data 接口入参
 * 查询年级初始化数据
 */
export function getBaseGrade(data) {
  return request({
    url: '/gradeInfoService/baseGrade',
    method: 'GET',
    params: data,
  })
}
/**
 * getClassGrade
 * @param {Object} data 接口入参
 * 查询班级列表
 */
export function getClassGrade(data) {
  return request({
    url: '/gradeInfoService/class',
    method: 'GET',
    params: data,
  })
}
/**
 * getTeacherClass
 * @param {Object} data 接口入参
 * 查询教师所在年级的所有班级
 */
export function getTeacherClass(data) {
  return request({
    url: '/gradeInfoService/teacherClass',
    method: 'GET',
    params: data,
  })
}
/**
 * updateClassGrade
 * @param {Object} data 接口入参
 * 修改班级信息
 */
export function updateClassGrade(data) {
  return request({
    url: 'gradeInfoService/class',
    method: 'PUT',
    data
  })
}
/**
 * deleteClassGrade
 * @param {Object} uid 接口入参
 * 删除班级信息
 */
export function deleteClassGrade(uid) {
  return request({
    url: '/gradeInfoService/class/' + uid,
    method: 'DELETE',
    params: {},
  })
}
/**
 * getClassLinkage
 * @param {Object} data 接口入参
 * 查询学年年级班级联动
 */
export function getClassLinkage(data) {
  return request({
    url: '/gradeInfoService/yearGradeClass',
    method: 'GET',
    params: data,
  })
}
/**
 * deleteBatchClass
 * @param {Object} uids 接口入参
 * 批量删除班级信息
 */
export function deleteBatchClass(uids) {
  return request({
    url: '/gradeInfoService/classes/' + uids,
    method: 'DELETE',
    params: {},
  })
}
/**
 * getHeadMasterList
 * @param {Object} data 接口入参
 * 查询班主任
 */
export function getHeadMasterList(data) {
  return request({
    url: '/teacherInfoService/headMasterList',
    method: 'GET',
    params: data,
  })
}
/**
 * getGradeAndClass
 * @param {Object} data 接口入参
 * 查询年级班级
 */
export function getGradeAndClass(data) {
  return request({
    url: '/gradeInfoService/gradeClass',
    method: 'GET',
    params: data,
  })
}
/**
 * getClassList
 * @param {Object} data 接口入参
 * 查询班级
 */
export function getClassList(data) {
  return request({
    url: '/gradeInfoService/classList',
    method: 'GET',
    params: data,
  })
}
/**
 * rename
 * @param {Object} data 接口入参
 * 统一修改班级名称
 */
export function rename(data) {
  return request({
    url: '/gradeInfoService/rename',
    method: 'PUT',
    data,
  })
}
/**
 * addSimpleClass
 * @param {Object} data 接口入参
 * 单个新增年级班级
 */
export function addSimpleClass(data) {
  return request({
    url: '/gradeInfoService/class',
    method: 'post',
    data
  })
}
/* =====================年级班级end========================= */

/* =====================用户管理start========================= */
/**
 * addUser
 * @param {Object} data 接口入参
 * 学校添加用户
 */
export function addUser(data) {
  return request({
    url: '/userInfoService/userInfos',
    method: 'post',
    mode: 'AUTH',
    data
  })
}

/**
 * getUserInfoList
 * @param {Object} data 接口入参
 * 分页查询学校用户列表
 */
export function getUserInfoList(data) {
  return request({
    url: '/userInfoService/userInfoList',
    method: 'GET',
    mode: 'AUTH',
    params: data,
  })
}
/**
 * updateUserInfos
 * @param {Object} data 接口入参
 * 更新学校用户
 */
export function updateUserInfos(data) {
  return request({
    url: 'userInfoService/userInfos',
    method: 'PUT',
    mode: 'AUTH',
    data
  })
}
/**
 * deleteUserInfos
 * @param {Object} uid 接口入参
 * 删除学校用户
 */
export function deleteUserInfos(data) {
  return request({
    url: '/userInfoService/userInfos',
    method: 'DELETE',
    mode: 'AUTH',
    params: data,
  })
}
/* =====================用户管理end========================= */

/* =====================排课相关接口start========================= */
/**
 * updCourseStatus
 * @param {Object} params 入参
 * 修改课表状态
 */
export function updCourseStatus(data) {
  return request({
    url: '/courseService/updCourseStatus',
    method: 'PUT',
    mode: 'COURSEURL',
    data
  })
}
/**
 * selectEmptyCourses
 * @param {Object} params 入参
 * 查询是否存在空白区域或暂存区域接口
 */
export function selectEmptyCourses(params) {
  return request({
    url: '/courseService/selectEmptyCourses',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * courseListApi
 * @param {schoolId} schoolId 学校ID
 * 查询排课列表接口
 */
export function courseListApi(schoolId) {
  return request({
    url: '/courseService/courseList/' + schoolId,
    method: 'GET',
    mode: 'COURSEURL'
  })
}
/**
 * getAllBaseData
 * @param {params} 入参
 * 根据年级查询科目/教师/教研组/班级列表接口
 */
export function getAllBaseData(params) {
  return request({
    url: '/courseService/getAllBaseData',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * baseRule
 * @param {termId} 入参
 * 根据学期ID 查询基础规则
 */
export function baseRule(params) {
  return request({
    url: '/courseService/baseRule/' + params.termId + '/' + params.gradeIds,
    method: 'GET',
    mode: 'COURSEURL'
  })
}
/**
 * updBaseRule
 * @param {data} 入参
 * 根据当前学校学期修改基础规则接口
 */
export function updBaseRule(data) {
  return request({
    url: '/courseService/updBaseRule',
    method: 'POST',
    mode: 'COURSEURL',
    data
  })
}
/**
 * selectPreScheduleInfos
 * @param {params} 入参
 * 查询当前学期所有班级预排设置接口
 */
export function selectPreScheduleInfos(params) {
  return request({
    url: '/courseService/selectPreScheduleInfos',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * savePreScheduleInfo
 * @param {params} 入参
 * 保存预排设置接口
 */
export function savePreScheduleInfo(data) {
  return request({
    url: '/courseService/savePreScheduleInfo',
    method: 'POST',
    mode: 'COURSEURL',
    data
  })
}
/**
 * revoke
 * @param {data} 入参
 * 撤销接口
 */
export function revoke(data) {
  return request({
    url: '/courseService/revoke',
    method: 'PUT',
    mode: 'COURSEURL',
    data
  })
}
/**
 * clearAll
 * @param {data} 入参
 * 清除所有接口
 */
export function clearAll(data) {
  return request({
    url: '/courseService/clearAll',
    method: 'PUT',
    mode: 'COURSEURL',
    data
  })
}
/**
 * publishCourses
 * @param {data} 入参
 * 清除所有接口
 */
export function publishCourses(data) {
  return request({
    url: '/courseService/publishCourses',
    method: 'PUT',
    mode: 'COURSEURL',
    data
  })
}

/* =====================排课相关接口end========================= */
/**
 * updateIsCourseStatus
 * @param {params} 入参
 * 修改年级已排完状态
 */
export function updateIsCourseStatus(params) {
  return request({
    url: '/courseService/updateIsCourseStatus',
    method: 'PUT',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * previewPlaceCourse
 * @param {params} 入参
 * 预览课表--场地课表
 */
export function previewPlaceCourse(params) {
  return request({
    url: '/courseService/previewPlaceCourse',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * previewTeacherCourse
 * @param {params} 入参
 * 预览课表--总课程表、班级课表、学科分布表
 */
export function previewTeacherCourse(params) {
  return request({
    url: '/courseService/previewTeacherCourse',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * previewClassCourse
 * @param {params} 入参
 * 预览课表--总课程表、班级课表、学科分布表
 */
export function previewClassCourse(params) {
  return request({
    url: '/courseService/previewClassCourse',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * autoScheduleCourse
 * @param {params} 入参
 * 自动排课
 */
export function autoScheduleCourse(params) {
  return request({
    url: '/courseService/autoScheduleCourse',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * courseReport
 * @param {params} 入参
 * 查看排课报告接口
 */
export function courseReport(params) {
  return request({
    url: '/courseService/courseReport',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * finishSchedule
 * @param {data} 入参
 * 完成排课接口
 */
export function finishSchedule(params) {
  return request({
    url: '/courseService/finishSchedule',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * autoScheduleCourse
 * @param {data} 入参
 * 获取手动调课时需要的信息接口
 */
export function selectManualAdjustInfos(params) {
  return request({
    url: '/courseService/selectManualAdjustInfos',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * manualAdjust
 * @param {data} 入参
 * 手动调课接口
 */
export function manualAdjust(data) {
  return request({
    url: '/courseService/manualAdjust',
    method: 'POST',
    mode: 'COURSE_HAND_URL',
    data
  })
}
/**
 * clearClassManualAdjust
 * @param {data} 入参
 * 清除班级手动调课记录接口
 */
export function clearClassManualAdjust(params) {
  return request({
    url: '/courseService/clearClassManualAdjust',
    method: 'DELETE',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * undoManualAdjust
 * @param {data} 入参
 * 撤消手动调课接口
 */
export function undoManualAdjust(params, fineIndexs) {
  return request({
    url: '/courseService/undoManualAdjust/' + fineIndexs,
    method: 'DELETE',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * classReSchedul
 * @param {data} 入参
 * 班级重排接口
 */
export function classReSchedule(params) {
  return request({
    url: '/courseService/classReSchedule',
    method: 'GET',
    mode: 'COURSE_HAND_URL',
    params
  })
}
/**
 * getCourseTeachers
 * @param {params} 入参
 * 根据学校标识获取所有老师----查看课表、历史课表
 */
export function getCourseTeachers(schoolId) {
  return request({
    url: '/courseService/teachers/' + schoolId,
    method: 'GET',
    mode: 'COURSEURL',
  })
}
/**
 * getClassIdInDivisions
 * @param {params} 入参
 * 获取教学分工不完整班级
 */
export function getClassIdInDivisions(params) {
  return request({
    url: '/courseService/getClassIdInDivisions',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getSubjectAndTeacher
 * @param {params} 入参
 * 根据学期和年级获取所有老师----预览教师课表
 */
export function getSubjectAndTeacher(params) {
  return request({
    url: '/divisionService/subjectAndTeacher',
    method: 'GET',
    params
  })
}
/**
 * getPlaces
 * @param {params} 入参
 * 根据学校标识获取所有场地---查看课表、历史课表
 */
export function getPlaces(schoolId) {
  return request({
    url: '/courseService/places/' + schoolId,
    method: 'GET',
    mode: 'COURSEURL',
  })
}
/**
 * getSubjectsCourse
 * @param {params} 入参
 * 根据学校标识获取所有科目----查看课表、历史课表
 */
export function getSubjectsCourse(params) {
  return request({
    url: '/courseService/subjects',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getCourseTable
 * @param {params} 入参
 * 查看总课程表/班级课表/学科分布表接口
 */
export function getCourseTable(params) {
  return request({
    url: '/courseService/totalCourseTable',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getTableTeachers
 * @param {params} 入参
 * 查看总任课表/教师课表接口
 */
export function getTableTeachers(params) {
  return request({
    url: '/courseService/courseTableTeachers',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getTablePlass
 * @param {params} 入参
 * 查看场地课表
 */
export function getTablePlass(params) {
  return request({
    url: '/courseService/totalCourseTablesInPlace',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getHistoryCourseList
 * @param {params} 入参
 * 分页查询历史课表
 */
export function getHistoryCourseList(params) {
  return request({
    url: '/courseService/historyCourseList',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getHistoryCourseTable
 * @param {params} 入参
 * 查看总课程表、班级课表、历史学科分布表-历史课表
 */
export function getHistoryCourseTable(params) {
  return request({
    url: '/courseService/historyTotalCourseTable',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getHistoryTeacherTable
 * @param {params} 入参
 * 查看总任课表、教师课表-历史课表
 */
export function getHistoryTeacherTable(params) {
  return request({
    url: '/courseService/historyCourseTableNumberTeachers',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getHistoryPlaceTable
 * @param {params} 入参
 * 查看场地课表-历史课表
 */
export function getHistoryPlaceTable(params) {
  return request({
    url: '/courseService/historyTotalCourseTablesInPlace',
    method: 'GET',
    mode: 'COURSEURL',
    params
  })
}
/**
 * getCourseRules
 * @param {termId} 入参
 * 查看规则-历史课表
 */
export function getCourseRules(termId) {
  return request({
    url: '/courseService/courseRules/'+ termId ,
    method: 'GET',
    mode: 'COURSEURL',
  })
}
/**
 * getRulesByTermId
 * @param {termId} 入参
 * 针对历史课表查询基础规则
 */
export function getRulesByTermId(termId) {
  return request({
    url: '/courseService/getRulesByTermId/'+ termId ,
    method: 'GET',
    mode: 'COURSEURL',
  })
}
/**
 * getBaseRules
 * @param {termId} 入参
 * 查询学校当前学期基础规则记录接口
 */
export function getBaseRules(termId) {
  return request({
    url: '/courseService/baseRule/'+ termId ,
    method: 'GET',
    mode: 'COURSEURL',
  })
}

/* =====================用户审核start========================= */
/**
 * getEnterSchoolList
 * @param {Object} data 接口入参
 * 分页查询用户审核列表
 */
export function getEnterSchoolList(data) {
  return request({
    url: '/userEnterSchoolService/enterSchoolList',
    method: 'GET',
    params: data,
  })
}
/**
 * updateEnterSchoolsChecked
 * @param {Object} data 接口入参
 * 更新用户审核状态
 */
export function updateEnterSchoolsChecked(data) {
  return request({
    url: '/userEnterSchoolService/enterSchoolsChecked',
    method: 'PUT',
    data
  })
}
/* =====================用户审核end========================= */

/* =====================操作日志start========================= */
/**
 * getBusinessLog
 * @param {Object} data 接口入参
 * 查询操作日志
 */
export function getBusinessLog(data) {
  return request({
    url: '/businessLogService/businessLog',
    method: 'GET',
    params: data,
  })
}
/* =====================操作日志end========================= */

/***************   课量统计start   ***********************/
/**
 * getClassSizeList
 * @param {Object} data 接口入参
 * 查询课量统计
 */
export function getClassSizeList(data) {
  return request({
    url: '/courseStatisticsService/classSizeStatistics',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/**
 * getClassSizeDetail
 * @param {Object} data 接口入参
 * 查询任教科目详情
 */
export function getClassSizeDetail(data) {
  return request({
    url: '/courseStatisticsService/planSubjectStatistics',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/***************   课量统计end   ************************/
/***************   调课统计start   ***********************/
/**
 * getAdjustSizeList
 * @param {Object} data 接口入参
 * 查询调课统计
 */
export function getAdjustSizeList(data) {
  return request({
    url: '/courseStatisticsService/adjustClassStatistics',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/**
 * getAdjustSizeDetail
 * @param {Object} data 接口入参
 * 查询调课详情
 */
export function getAdjustSizeDetail(data) {
  return request({
    url: '/courseStatisticsService/adjustClassDetails',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/***************   调课统计end   ************************/
/***************   代课统计start   ***********************/
/**
 * getAgentSizeList
 * @param {Object} data 接口入参
 * 查询课量统计
 */
export function getAgentSizeList(data) {
  return request({
    url: '/courseStatisticsService/agentClassStatistics',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/**
 * getAgentSizeDetail
 * @param {Object} data 接口入参
 * 查询任教科目详情
 */
export function getAgentSizeDetail(data) {
  return request({
    url: '/courseStatisticsService/agentClassDetails',
    method: 'GET',
    params: data,
    mode: 'STATISTICS'
  })
}
/***************   代课统计end   ************************/
/* =====================权限相关服务start========================= */
/**
 * getRolePosition
 * @param {Object} 无 接口入参
 * 获取学校角色以及对应职务
 */
export function getRolePosition() {
  return request({
    url: '/authService/rolePosition',
    method: 'GET',
    mode: 'AUTH',
    params: {},
  })
}
/**
 * getPositions
 * @param {Object} 无 接口入参
 */
export function getPositions() {
  return request({
    url: '/authService/positions',
    method: 'GET',
    mode: 'AUTH',
    params: {}
  })
}
/* =====================权限相关服务end========================= */

/* =====================成绩管理相关服务start========================= */
/**
 * getScoreYear
 * @param {Object}  接口入参
 * 查询有数据的年级
 */
export function getScoreYear(data) {
  return request({
    url: 'score/year',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreYear
 * @param {Object} 无 接口入参
 * 查询所有年级
 */
export function getAllYear() {
  return request({
    url: 'score/allGrade',
    method: 'GET',
    mode: 'SCORE_MANAGE'
  })
}
/**
 * getScoreStudentResults
 * @param {Object} 无 接口入参
 * 根据学校年级班级标识查询班级姓名查询学生成绩信息
 */
export function getScoreStudentResults(data) {
  return request({
    url: 'score/studentResults',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreSchoolResults
 * @param {Object} 无 接口入参
 * 根据学年学期，学校，年级标识查询成绩信息
 */
export function getScoreSchoolResults(data) {
  return request({
    url: 'score/schoolResults',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreGradeResults
 * @param {Object} 无 接口入参
 * 根据学校年级标识查询年级成绩信息
 */
export function getScoreGradeResults(data) {
  return request({
    url: 'score/gradeResults',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreGrade
 * @param {Object} 无 接口入参
 * 根据学年学期标识和学校标识查询年级信息
 */
export function getScoreGrade(data) {
  return request({
    url: 'score/grade',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreExportResults
 * @param {Object} 无 接口入参
 * 下载及导出文件
 */
export function getScoreExportResults(data) {
  return request({
    url: 'score/exportResults',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreExportResults
 * @param {Object} 无 接口入参
 * 根据学校年级班级标识查询班级成绩信息
 */
export function getScoreClassResults(data) {
  return request({
    url: 'score/classResults',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * getScoreClass
 * @param {Object} 无 接口入参
 * score/class/{uid}根据年级标识查询班级信息
 */
export function getScoreClass(data) {
  return request({
    url: 'score/class',
    method: 'GET',
    mode: 'SCORE_MANAGE',
    params: data
  })
}
/**
 * delScore
 * @param {Object} 无 接口入参
 * score/{uid}根据url删除下载文件
 */
export function delScore(path) {
  return request({
    url: 'score/ModelExcelDeleted?filePath=' + path,
    method: 'DELETE',
    mode: 'SCORE_MANAGE'
  })
}
/**
 * scoreImportResults
 * @param {Object} 无 接口入参
 * score/importResults成绩导入
 */
export function scoreImportResults(params) {
  return request({
    url: 'score/importResults',
    method: 'POST',
    mode: 'SCORE_MANAGE',
    params
  })
}
/* =====================成绩管理相关服务end========================= */