import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout.vue'
import store from '../store/store'
import storage from '@/utils/storage'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: '/' + process.env.VUE_APP_PROJECTNAME + '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "Home" */ '@/views/index/components/home/index.vue'),
      meta: {
        menu: '102'
      }
    },
    {
      path: '/help-center',
      name: 'HelpCenter',
      component: () => import(/* webpackChunkName: "HelpCenter" */ '@/views/index/components/home/home-help-center/help-center.vue'), 
      meta: { title: '帮助中心', needLogin: false}     
    },
    {
      path: '/main',
      name: 'main',
      component: Layout,
      redirect: { name: 'TermInfo' },
      children: [
        {
          path: '/basic/term-info',
          name: 'TermInfo',
          component: () => import(/* webpackChunkName: "TermInfo" */ '@/views/index/components/basic/term-info.vue'),
          meta: { title: '学年学期', menu: '112' }
        },
        {
          path: '/basic/teacher-man',
          name: 'TeacherMan',
          component: () => import(/* webpackChunkName: "TeacherMan" */ '@/views/index/components/basic/teacher-man.vue'),
          redirect: { name: 'TeacherInfo' },
          children: [
            {
              path: '/basic/teacher-info',
              name: 'TeacherInfo',
              component: () => import(/* webpackChunkName: "TeacherInfo" */ '@/views/index/components/basic/teacher-info.vue'),
              meta: { title: '教师信息', menu: '113' },
            }
          ]
        },
        {
          path: '/basic/grade-info',
          name: 'GradeMan',
          component: () => import(/* webpackChunkName: "GradeInfo" */ '@/views/index/components/basic/grade-info.vue'),
          meta: { title: '年级班级', menu: '114' }
        },
        {
          path: '/basic/class-data',
          name: 'ClassData',
          component: () => import(/* webpackChunkName: "ClassData" */ '@/views/index/components/basic/class-data.vue'),
          meta: { title: '课时数据', menu: '115' }
        },
        {
          path: '/basic/subject-info',
          name: 'SubjectInfo',
          component: () => import(/* webpackChunkName: "SubjectInfo" */ '@/views/index/components/basic/subject-info.vue'),
          meta: { title: '科目信息', menu: '116' }
        },
        {
          path: '/basic/venue-info',
          name: 'VenueInfo',
          component: () => import(/* webpackChunkName: "VenueInfo" */ '@/views/index/components/basic/venue-info.vue'),
          redirect: { name: 'VenueList' },
          children: [
            {
              path: '/basic/venue-list',
              name: 'VenueList',
              component: () => import(/* webpackChunkName: "VenueList" */ '@/views/index/components/basic/venue-list.vue'),
              meta: { title: '场地列表', menu: '117' }
            },
            {
              path: '/basic/venue-setting',
              name: 'VenueSetting',
              component: () => import(/* webpackChunkName: "VenueSetting" */ '@/views/index/components/basic/venue-setting.vue'),
              meta: { title: '分类设置', menu: '117' }
            }
          ]
        },
        {
          path: '/teaching-plan/teaching-group-info',
          name: 'TeachingGroupInfo',
          component: () => import(/* webpackChunkName: "TeachingGroupInfo" */ '@/views/index/components/teaching-plan/teaching-group-info.vue'),
          meta: { title: '教研组信息', menu: '118' }
        },
        {
          path: '/teaching-plan/teaching-division',
          name: 'TeachingDivision',
          component: () => import(/* webpackChunkName: "TeachingDivision" */ '@/views/index/components/teaching-plan/teaching-division.vue'),
          meta: { title: '教学分工', menu: '119' }
        },
        {
          path: '/approval-management/process-setting',
          name: 'ProcessSetting',
          component: () => import(/* webpackChunkName: "ProcessSetting" */ '@/views/index/components/approval-management/process-setting.vue'),
          meta: { title: '流程设置', menu: '123' }
        },
        {
          path: '/approval-management/approval-info',
          name: 'ApprovalInfo',
          component: () => import(/* webpackChunkName: "ApprovalInfo" */ '@/views/index/components/approval-management/approval-info.vue'),
          redirect: { name: 'WaitApproval' },
          children: [
            {
              path: '/approval-management/wait-approval',
              name: 'WaitApproval',
              component: () => import(/* webpackChunkName: "WaitApproval" */ '@/views/index/components/approval-management/wait-approval.vue'),
              meta: { title: '待我审批', menu: '124' }
            },
            {
              path: '/approval-management/have-approval',
              name: 'HaveApproval',
              component: () => import(/* webpackChunkName: "HaveApproval" */ '@/views/index/components/approval-management/have-approval.vue'),
              meta: { title: '我审批的', menu: '124' }
            },
            {
              path: '/approval-management/all-approval',
              name: 'AllApproval',
              component: () => import(/* webpackChunkName: "AllApproval" */ '@/views/index/components/approval-management/all-approval.vue'),
              meta: { title: '全部申请', menu: '124' }
            }
          ]
        },
        {
          path: '/approval-management/view-approval',
          name: 'ViewApproval',
          component: () => import(/* webpackChunkName: "ViewApproval" */ '@/views/index/components/approval-management/view-approval.vue'),
          meta: { title: '审批详情', menu: '124' }
        },
        {
          path: '/approval-management/in-approval',
          name: 'InApproval',
          component: () => import(/* webpackChunkName: "InApproval" */ '@/views/index/components/approval-management/in-approval.vue'),
          meta: { title: '审批', menu: '124' }
        },
        {
          path: '/approval-management/supply-management',
          name: 'SupplyManagement',
          component: () => import(/* webpackChunkName: "SupplyManagement" */ '@/views/index/components/approval-management/supply-management.vue'),
          meta: { title: '代课管理', menu: '125' }
        },
        {
          path: '/approval-management/view-supply',
          name: 'ViewSupply',
          component: () => import(/* webpackChunkName: "ViewSupply" */ '@/views/index/components/approval-management/view-supply.vue'),
          meta: { title: '代课通知详情', menu: '125' }
        },
        { // 已经入校的消息界面
          path: '/message-center',
          name: 'MessageCenter',
          component: () => import(/* webpackChunkName: "MessageCenter" */ '@/views/index/components/message-center/message-center.vue'),
          redirect: { name: 'SchoolMessage' },
          children: [
            {
              path: '/message-center/school-message',
              name: 'SchoolMessage',
              component: () => import(/* webpackChunkName: "SchoolMessage" */ '@/views/index/components/message-center/school-message.vue'),
              meta: { title: '待我审批' }
            },
            {
              path: '/message-center/system-message',
              name: 'SystemMessage',
              component: () => import(/* webpackChunkName: "HaveApproval" */ '@/views/index/components/message-center/system-message.vue'),
              meta: { title: '我审批的' }
            }
          ]
        },
        { // 已经入校的消息界面
          path: '/message-center/view-message',
          name: 'ViewMessage',
          component: () => import(/* webpackChunkName: "ViewMessage" */ '@/views/index/components/message-center/view-message.vue'),
          meta: { title: '通知详情' }
        },
        {
          path: '/course/course-list',
          name: 'CourseList',
          component: () => import(/* webpackChunkName: "CourseList" */ '@/views/index/components/course/course-list.vue'),
          meta: { title: '排课管理', menu: '120' }
        },
        {
          path: '/course/course-pre-arrange',
          name: 'CoursePreArrange',
          component: () => import(/* webpackChunkName: "CoursePre" */ '@/views/index/components/course/course-arrange/course-pre.vue'),
          meta: { title: '预排', menu: '120' }
        },
        {
          path: '/course/course-hand-arrange',
          name: 'CourseHandArrange',
          component: () => import(/* webpackChunkName: "CourseHandArrange" */ '@/views/index/components/course/course-arrange/course-hand-arrange.vue'),
          meta: { title: '手动排课', menu: '120' }
        },
        {
          path: '/course/course-table',
          name: 'CourseTable',
          component: () => import(/* webpackChunkName: "CourseTable" */ '@/views/index/components/course/course-table.vue'),
          meta: { title: '查看课表' },
          children: [
            {
              path: '/course/total-syllabus',
              name: 'TotalSyllabus',
              component: () => import(/* webpackChunkName: "TotalSyllabus" */ '@/views/index/components/course/course-table/total-syllabus.vue'),
              meta: { title: '总课程表', menu: '121' }
            },
            {
              path: '/course/total-teach-syllabus',
              name: 'TotalTeachSyllabus',
              component: () => import(/* webpackChunkName: "TotalTeachSyllabus" */ '@/views/index/components/course/course-table/total-teach-syllabus.vue'),
              meta: { title: '总任课表', menu: '121' }
            },
            {
              path: '/course/class-syllabus',
              name: 'ClassSyllabus',
              component: () => import(/* webpackChunkName: "ClassSyllabus" */ '@/views/index/components/course/course-table/class-syllabus.vue'),
              meta: { title: '班级课表', menu: '121' }
            },
            {
              path: '/course/teacher-syllabus',
              name: 'TeacherSyllabus',
              component: () => import(/* webpackChunkName: "TeacherSyllabus" */ '@/views/index/components/course/course-table/teacher-syllabus.vue'),
              meta: { title: '教师课表', menu: '121' }
            },
            {
              path: '/course/field-syllabus',
              name: 'FieldSyllabus',
              component: () => import(/* webpackChunkName: "FieldSyllabus" */ '@/views/index/components/course/course-table/field-syllabus.vue'),
              meta: { title: '场地课表', menu: '121' }
            },
            {
              path: '/course/subject-distribution-syllabus',
              name: 'SubjectDistributionSyllabus',
              component: () => import(/* webpackChunkName: "SubjectDistributionSyllabus" */ '@/views/index/components/course/course-table/subject-distribution-syllabus.vue'),
              meta: { title: '学科分布表', menu: '121' }
            },
          ]
        },
        {
          path: '/course/history-list',
          name: 'HistoryList',
          component: () => import(/* webpackChunkName: "HistoryList" */ '@/views/index/components/course/history-list.vue'),
          meta: { title: '历史课表', menu: '122' }
        },
        {
          path: '/course/history-course-table',
          name: 'HistoryCourseTable',
          component: () => import(/* webpackChunkName: "HistoryCourseTable" */ '@/views/index/components/course/history-course-table.vue'),
          meta: { title: '历史课表' },
          children: [
            {
              path: '/course/history-total-syllabus',
              name: 'HistoryTotalSyllabus',
              component: () => import(/* webpackChunkName: "HistoryTotalSyllabus" */ '@/views/index/components/course/history-course-table/history-total-syllabus.vue'),
              meta: { title: '总课程表-历史课表', menu: '122' }
            },
            {
              path: '/course/history-total-teach-syllabus',
              name: 'HistoryTotalTeachSyllabus',
              component: () => import(/* webpackChunkName: "HistoryTotalTeachSyllabus" */ '@/views/index/components/course/history-course-table/history-total-teach-syllabus.vue'),
              meta: { title: '总任课表-历史课表', menu: '122' }
            },
            {
              path: '/course/history-class-syllabus',
              name: 'HistoryClassSyllabus',
              component: () => import(/* webpackChunkName: "HistoryClassSyllabus" */ '@/views/index/components/course/history-course-table/history-class-syllabus.vue'),
              meta: { title: '班级课表-历史课表', menu: '122' }
            },
            {
              path: '/course/history-teacher-syllabus',
              name: 'HistoryTeacherSyllabus',
              component: () => import(/* webpackChunkName: "HistoryTeacherSyllabus" */ '@/views/index/components/course/history-course-table/history-teacher-syllabus.vue'),
              meta: { title: '教师课表-历史课表', menu: '122' }
            },
            {
              path: '/course/history-field-syllabus',
              name: 'HistoryFieldSyllabus',
              component: () => import(/* webpackChunkName: "HistoryFieldSyllabus" */ '@/views/index/components/course/history-course-table/history-field-syllabus.vue'),
              meta: { title: '场地课表-历史课表', menu: '122' }
            },
            {
              path: '/course/history-subject-distribution-syllabus',
              name: 'HistorySubjectDistributionSyllabus',
              component: () => import(/* webpackChunkName: "HistorySubjectDistributionSyllabus" */ '@/views/index/components/course/history-course-table/history-subject-distribution-syllabus.vue'),
              meta: { title: '学科分布表-历史课表', menu: '122' }
            },
          ]
        },
        {
          path: '/platform/user-manage',
          name: 'UserManage',
          component: () => import(/* webpackChunkName: "UserManage" */ '@/views/index/components/platform/user-manage.vue'),
          meta: { title: '用户管理', menu: '129' }
        },
        {
          path: '/platform/user-audit',
          name: 'UserAudit',
          component: () => import(/* webpackChunkName: "UserAudit" */ '@/views/index/components/platform/user-audit.vue'),
          meta: { title: '用户审核', menu: '130' }
        },
        {
          path: '/platform/operation-log',
          name: 'OperationLog',
          component: () => import(/* webpackChunkName: "OperationLog" */ '@/views/index/components/platform/operation-log.vue'),
          meta: { title: '操作日志', menu: '131' }
        },
        {
          path: '/appo-center',
          name: 'AppoCenter',
          component: () => import(/* webpackChunkName: "OperationLog" */ '@/views/index/components/appo-center/appo-list.vue'),
          meta: { title: '应用中心' }
        },
        {
          path: '/data-statistics/flow-statistics',
          name: 'FlowStatistics',
          component: () => import(/* webpackChunkName: "FlowStatistics" */ '@/views/index/components/data-statistics/flow-statistics.vue'),
          meta: { title: '课量统计', menu: '126' }
        },
        {
          path: '/data-statistics/class-info',
          name: 'ClassInfo',
          component: () => import(/* webpackChunkName: "ClassInfo" */ '@/views/index/components/data-statistics/class-info.vue'),
          redirect: { name: 'TeacherVision' },
          children: [
            {
              path: '/data-statistics/teacher-vision',
              name: 'TeacherVision',
              component: () => import(/* webpackChunkName: "TeacherVision" */ '@/views/index/components/data-statistics/teacher-vision.vue'),
              meta: { title: '调课统计', menu: '127' }
            },
            {
              path: '/data-statistics/class-vision',
              name: 'ClassVision',
              component: () => import(/* webpackChunkName: "ClassVision" */ '@/views/index/components/data-statistics/class-vision.vue'),
              meta: { title: '调课统计', menu: '127' }
            }
          ]
        },
        {
          path: '/data-statistics/substitute-statistics',
          name: 'SubstituteStatistics',
          component: () => import(/* webpackChunkName: "SubstituteStatistics" */ '@/views/index/components/data-statistics/substitute-statistics.vue'),
          meta: { title: '代课统计', menu: '128' }
        }
      ]
    },
    {
      path: '/course/preview-course',
      name: 'PreviewCourse',
      component: () => import(/* webpackChunkName: "PreviewCourse" */ '@/views/index/components/course/preview-course.vue'),
      meta: { title: '预览课表' },
      children: [
        {
          path: '/course/preview-total-syllabus',
          name: 'PreviewTotalSyllabus',
          component: () => import(/* webpackChunkName: "HistoryTotalSyllabus" */ '@/views/index/components/course/preview-course/preview-total-syllabus.vue'),
          meta: { title: '总课程表' }
        },
        {
          path: '/course/preview-total-teach-syllabus',
          name: 'PreviewTeachSyllabus',
          component: () => import(/* webpackChunkName: "PreviewTotalTeachSyllabus" */ '@/views/index/components/course/preview-course/preview-total-teach-syllabus.vue'),
          meta: { title: '总任课表' }
        },
        {
          path: '/course/preview-class-syllabus',
          name: 'PreviewClassSyllabus',
          component: () => import(/* webpackChunkName: "PreviewClassSyllabus" */ '@/views/index/components/course/preview-course/preview-class-syllabus.vue'),
          meta: { title: '班级课表' }
        },
        {
          path: '/course/preview-teacher-syllabus',
          name: 'PreviewTeacherSyllabus',
          component: () => import(/* webpackChunkName: "PreviewTeacherSyllabus" */ '@/views/index/components/course/preview-course/preview-teacher-syllabus.vue'),
          meta: { title: '教师课表' }
        },
        {
          path: '/course/preview-field-syllabus',
          name: 'PreviewFieldSyllabus',
          component: () => import(/* webpackChunkName: "PreviewFieldSyllabus" */ '@/views/index/components/course/preview-course/preview-field-syllabus.vue'),
          meta: { title: '场地课表' }
        },
        {
          path: '/course/preview-subject-distribution-syllabus',
          name: 'PreviewSubjectDistributionSyllabus',
          component: () => import(/* webpackChunkName: "PreviewSubjectDistributionSyllabus" */ '@/views/index/components/course/preview-course/preview-subject-distribution-syllabus.vue'),
          meta: { title: '学科分布表' }
        },
      ]
    },
    { // 普通用户的界面
      path: '/main-common',
      name: 'MainTeacher',
      component: Layout,
      children: [
        {
          path: '/main-common/teacher-timetable',
          name: 'TeacherTimetable',
          component: () => import(/* webpackChunkName: "TeacherTimetable" */ '@/views/index/components/common-main/teacher-timetable.vue'),
          meta: { title: '任课表', menu: '136' }
        },
        {
          path: '/main-common/class-timetable',
          name: 'ClassTimetable',
          component: () => import(/* webpackChunkName: "ClassTimetable" */ '@/views/index/components/common-main/class-timetable.vue'),
          meta: { title: '班级表', menu: '137' }
        },
        {
          path: '/main-common/approval-info-common',
          name: 'ApprovalInfoCommon',
          component: () => import(/* webpackChunkName: "ApprovalInfoCommon" */ '@/views/index/components/common-main/approval-info-common.vue'),
          redirect: { name: 'MyApplyList' },
          children: [
            {
              path: '/main-common/my-apply-list',
              name: 'MyApplyList',
              component: () => import(/* webpackChunkName: "MyApplyList" */ '@/views/index/components/common-main/my-apply-list.vue'),
              meta: { title: '我申请的', menu: '133' }
            },
            {
              path: '/main-common/my-audit-list',
              name: 'MyAuditList',
              component: () => import(/* webpackChunkName: "MyAuditList" */ '@/views/index/components/common-main/my-audit-list.vue'),
              meta: { title: '向我申请', menu: '133' }
            }
          ]
        },
        {
          path: '/main-common/view-approval-common',
          name: 'ViewApprovalCommon',
          component: () => import(/* webpackChunkName: "ViewApprovalCommon" */ '@/views/index/components/common-main/view-approval-common.vue'),
          meta: { title: '审批详情', menu: '133' }
        },
        {
          path: '/main-common/view-supply-common',
          name: 'ViewSupplyCommon',
          component: () => import(/* webpackChunkName: "ViewSupplyCommon" */ '@/views/index/components/common-main/view-supply-common.vue'),
          meta: { title: '代课详情', menu: '134' }
        },
        {
          path: '/main-common/in-approval-common',
          name: 'InApprovalCommon',
          component: () => import(/* webpackChunkName: "InApprovalCommon" */ '@/views/index/components/common-main/in-approval-common.vue'),
          meta: { title: '调课审批', menu: '133' }
        },
        {
          path: '/main-common/approval-form',
          name: 'ApprovalForm',
          component: () => import(/* webpackChunkName: "ApprovalForm" */ '@/views/index/components/common-main/approval-form.vue'),
          meta: { title: '申请调课', menu: '133' }
        },
        {
          path: '/main-common/supply-view-info',
          name: 'SupplyViewInfo',
          component: () => import(/* webpackChunkName: "SupplyViewInfo" */ '@/views/index/components/common-main/supply-view-info.vue'),
          redirect: { name: 'MySupplyList' },
          children: [
            {
              path: '/main-common/my-supply-list',
              name: 'MySupplyList',
              component: () => import(/* webpackChunkName: "MySupplyList" */ '@/views/index/components/common-main/my-supply-list.vue'),
              meta: { title: '我代课的', menu: '134' }
            },
            {
              path: '/main-common/my-wantsupply-list',
              name: 'MyWantsupplyList',
              component: () => import(/* webpackChunkName: "MyWantsupplyList" */ '@/views/index/components/common-main/my-wantsupply-list.vue'),
              meta: { title: '我请假的', menu: '134' }
            }
          ]
        }
      ]
    },
    { // 个人中心页面
      path: '/personal-center',
      name: 'PersonalCenter',
      component: () => import(/* webpackChunkName: "PersonalCenter" */ '@/views/index/components/personal-center/index.vue'),
      redirect: { name: 'Message' },
      children: [
        {
          path: '/personal-center/message',
          name: 'Message',
          component: () => import(/* webpackChunkName: "Message" */ '@/views/index/components/personal-center/message.vue'),
          meta: { title: '个人中心', menu: '104' },
        },
        {
          path: '/personal-center/account-setting',
          name: 'AccountSetting',
          component: () => import(/* webpackChunkName: "AccountSetting" */ '@/views/index/components/personal-center/account-setting.vue'),
          meta: { title: '帐号设置', menu: '105' },
        },
        {
          path: '/personal-center/user-agreement',
          name: 'UserAgreement',
          component: () => import(/* webpackChunkName: "UserAgreement" */ '@/views/index/components/personal-center/user-agreement.vue'),
          meta: { title: '用户协议' , needLogin: false},
        },
      ]
    },
    { // 工作台页面
      path: '/working-table',
      name: 'WorkingTable',
      component: Layout,
      redirect: { name: 'Manager' },
      children: [
        {
          path: '/working-table/manager',
          name: 'Manager',
          component: () => import(/* webpackChunkName: "Manager" */ '@/views/index/components/working-table/manager.vue'),
          meta: { title: '工作台' },
        },
        {
          path: '/working-table/school-accreditation',
          name: 'SchoolAccreditation',
          component: () => import(/* webpackChunkName: "SchoolAccreditation" */ '@/views/index/components/working-table/school-accreditation.vue'),
          meta: { title: '学校认证', menu: '103' },
        },
      ]
    },
    { // 没有入校的人看的消息界面
      path: '/message-center-noschool',
      name: 'MessageCenterNo',
      component: () => import(/* webpackChunkName: "MessageCenterNo" */ '@/views/index/components/message-center/index.vue'),
      redirect: { name: 'MessageCenterNoschool' },
      children: [
        {
          path: '/message-center-noschool/messge-noschool-list',
          name: 'MessageCenterNoschool',
          component: () => import(/* webpackChunkName: "MessageCenterNoschool" */ '@/views/index/components/message-center/message-center-noschool.vue'),
          meta: { title: '系统消息' },
        },
        {
          path: '/message-center-noschool/view-messge-noschool',
          name: 'ViewMessageNoschool',
          component: () => import(/* webpackChunkName: "ViewMessageNoschool" */ '@/views/index/components/message-center/view-messge-noschool.vue'),
          meta: { title: '系统消息' },
        },
      ]
    },
    // 成绩管理
    {
      path: '/score-manage',
      name: 'scoreManage',
      component: () => import(/* webpackChunkName: "PersonalCenter" */ '@/views/index/components/score/index.vue'),
      redirect: { name: 'scoreStatistics' },
      children: [
        {
          path: '/score-statistics',
          name: 'scoreStatistics',
          component: () => import(/* webpackChunkName: "Message" */ '@/views/index/components/score/score-statistics.vue'),
          meta: { title: '成绩统计' }
        }
      ]
    },
    {
      path: '/score-preview',
      name: 'scorePreview',
      component: () => import(/* webpackChunkName: "PersonalCenter" */ '@/views/index/components/score/score-preview.vue'),
      meta: { title: '成绩预览' }
    },
    {
      path: '/noAuth',
      name: 'noAuth',
      component: () => import(/* webpackChunkName: "noAuth" */ '@/views/common-page/noAuth.vue')
    },
    {
      path: '*',
      name: '404',
      // route level code-splitting
      // this generates a separate chunk (404.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // 如果该组件需要预先加载 注入webpackPrefetch: true
      component: () => import(/* webpackChunkName: "404" */ '@/views/common-page/404.vue')
    }
  ]
})
window['menu'] = '';
router.beforeEach((to, from, next) => {
  window['menu'] = to.meta.menu || ''
  const userInfo = storage.getItem('userInfo') || '';
  if (!userInfo) { // 用户未登录
    if (to.meta.needLogin === false) {
      next()
    } else {
      to.fullPath !== '/' ? next({ path: '/' }) : next()
    }
  } else if (to.meta.needAuth) {
    if (store.state.user.auth.indexOf(to.meta.uid) !== -1) {
      next()
    } else {
      next({ path: '/noAuth' })
    }
  } else {
    next()
  }

})
// 使用 afterEach 钩子函数，保证路由已经跳转成功之后修改 title 页面埋点
router.afterEach((route) => {
  let documentTitle = '';
  route.matched.forEach((path) => {
    if (path.meta.title) {
      documentTitle = `${path.meta.title}`;
    }
  });
  // sendSpot({ name: '页面埋点', path: route.path })
  document.title = documentTitle;
});

export default router
