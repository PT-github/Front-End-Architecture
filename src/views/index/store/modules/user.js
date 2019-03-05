import storage from '@/utils/storage'
import { getMsgList } from '../api';
const base64 = require('js-base64').Base64

const user = {
  state: {
    userInfo: null, // 所有的用户信息
    roleList: null,
    schoolInfoList: null,
    organList: null,
    roleAuthList: null,
    currentSchool: null, // 当前选中的学校
    currentRole: null, // 当前用户在选中学校中的角色信息
    userMsgCount: 0 // 当前用户的未读消息数量
  },
  mutations: {
    EXIT_SCHOOL: (state, schoolUid) => { // 用户退出某个学校(删除本地的对应的学校信息)
      if (schoolUid) {
        state.schoolInfoList = state.schoolInfoList.filter(item => {
          return item.uid != schoolUid;
        });
        state.userInfo.schoolInfoList = state.schoolInfoList.filter(item => {
          return item.uid != schoolUid;
        });
        // 如果退出的学校刚好是用户当前的学校
        if (state.currentSchool.uid == schoolUid) {
          if (state.schoolInfoList.length) { // 如果用户还有其他的学校列表
            state.currentSchool = state.schoolInfoList[0];
          } else {
            state.currentSchool = null;
            storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
            storage.setItem('currentSchool', ""); // 将本地存储用户信息刷新
            window.location.reload(); // 刷新页面
            return;
          }
        }
        storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
        storage.setItem('currentSchool', JSON.stringify(state.currentSchool)); // 将本地存储用户信息刷新
        window.location.reload(); // 刷新页面
      }
    },
    REMERBER_PASS: (state, userMess) => { // 用户记住密码
      userMess.userPassword = base64.encode(userMess.userPassword); // 加密
      if (userMess.remember) {
        storage.setItem('remerberPass', JSON.stringify(userMess));
      } else {
        if (storage.getItem('remerberPass')) {
          storage.setItem('remerberPass', '');
        }
      }
    },
    SET_USERINFO: (state, userInfo) => {
      userInfo = JSON.parse(userInfo);
      state.userInfo = userInfo
      state.roleList = userInfo.roleList
      state.schoolInfoList = userInfo.schoolInfoList
      state.organList = userInfo.organList
      state.roleAuthList = userInfo.roleAuthList
    },
    SET_CURRENTSCHOOL: (state, currentSchool) => { // 存储当前学校
      currentSchool = JSON.parse(currentSchool)
      state.currentSchool = currentSchool
    },
    UPDATE_CURRENTSCHOOL: (state, key, value) => { // 修改当前学校
      state.currentSchool[key] = value;
      storage.setItem('currentSchool', JSON.stringify(state.currentSchool)); // 将本地存储用户信息刷新
    },
    CLEAR_USERINFO: (state) => { // 清除用户信息
      storage.setItem('userInfo', '');
      state.userInfo = null
      state.roleList = null
      state.schoolInfoList = null
      state.organList = null
      state.roleAuthList = null
    },
    UPDATE_USERNAME: (state, userName) => { // 更新用户名
      state.userInfo.userName = userName
      storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
    },
    UPDATE_USER_MOBILE: (state, userMobile) => { // 更新用户手机
      state.userInfo.userMobile = userMobile
      storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
    },
    UPDATE_USER_LOGO: (state, imageObj) => { // 更新用户头像
      state.userInfo.imageThumbnailName = imageObj.thumbnailFileName
      state.userInfo.imageThumbnailPath = imageObj.thumbnailFilePath
      state.userInfo.imagePathName = imageObj.fileName
      state.userInfo.imagePath = imageObj.filePath
      storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
    },
    UPDATE_SCHOOL_LOGO: (state, logo) => { // 更新用户的学校头像
      if (state.currentSchool) {
        if (state.currentSchool.appendixInfoList.length) {
          let appendixInfoList = state.currentSchool.appendixInfoList, index;
          for (let i = 0; i < appendixInfoList.length; i++) {
            if (appendixInfoList[i].otherFlag === 1) {
              index = i;
              break;
            }
          }
          state.currentSchool.appendixInfoList.splice(index, 1, logo);
        } else {
          state.currentSchool.appendixInfoList = [logo];
        }
        let indextwo;
        for (let j = 0; j < state.userInfo.schoolInfoList.length; j++) { // 更新学校的列表信息
          if (state.userInfo.schoolInfoList[j].uid === state.currentSchool.uid) {
            indextwo = j;
            break;
          }
        }
        state.userInfo.schoolInfoList.splice(indextwo, 1, state.currentSchool);
      }
      storage.setItem('currentSchool', JSON.stringify(state.currentSchool)); // 将本地存储用户信息刷新
      storage.setItem('userInfo', JSON.stringify(state.userInfo)); // 将本地存储用户信息刷新
    },
    USER_LOGOUT: (state) => { // 用户登出
      state.userInfo = null
      state.roleList = null
      state.schoolInfoList = null
      state.organList = null
      state.roleAuthList = null
      state.currentRole = null
      state.userMsgCount = null
      storage.setItem('userInfo', '') // 置空用户信息
      storage.setItem('currentRole', '') // 置空当前权限
    },
    SET_MSGCOUNT: (state, count) => { // 设置当前未读的消息数量
      state.userMsgCount = count
    },
    ClearCurrentSchool: (state) => { // 清理当前学校
      state.currentSchool = null
      state.currentRole = null
      storage.setItem('currentSchool', '') // 置空当前学校
      storage.setItem('currentRole', '') // 置空当前权限
    }
  },
  actions: {
    SetUserInfo({ commit }, userInfo) { // 将用户信息存入store
      storage.setItem('userInfo', userInfo)
      commit('SET_USERINFO', userInfo)
    },
    SetCurrentSchool({ commit, state }, currentSchool) { // 将当前学校存入store
      try {
        storage.setItem('currentSchool', currentSchool)
        // 取出当前学校的用户角色
        const roleList = state.roleList;
        if (roleList && currentSchool) {
          let organId = JSON.parse(currentSchool)["organId"];
          for (let j = 0; j < roleList.length; j++) {
            let uid = roleList[j]["organId"];
            if (organId === uid) {
              storage.setItem('currentRole', JSON.stringify(roleList[j])); // 将当前用户权限存入本地
              state.currentRole = roleList[j]; // 将当前用户权限存入store
              break;
            }
          }
        }
        commit('SET_CURRENTSCHOOL', currentSchool)
      } catch (error) {
        console.log('设置当前学校失败', error)
      }
    },
    updateUserMsgCountStatus({ commit, state }) { // 更新用户消息的状态
      if (state.userInfo) {
        const queryParam = {
          pageSize: 0,
          "where.userId": state.userInfo.uid,
          "where.isRead": false
        };
        getMsgList(queryParam).then((res) => {
          commit('SET_MSGCOUNT', res.data.total)
        })
      }
    }
  }
}

export default user