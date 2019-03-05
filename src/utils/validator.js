/*
* rule
* {"trigger":"change","max":10,"min":20,"field":"telegrpNo","fullField":"telegrpNo","type":"string", ...}
*  可自定义属性
*/
// 定义默认中文所占字符长度，由个项目使用的数据库决定
// 正常 utf-8以三个字节存储中文；gbk以二个字节存储中文。
// const _chineseLength = 3;
// number校验
import { checkUserMobile } from '../views/index/store/api';
/**
 * 电话手机号码验证
 */
export const checkTel = (rule, value, callback) => {
  // 验证手机号码是否合法
  if (value === "") {
    callback(new Error("手机号码不能为空"));
  } else {
    if (value !== "") {
      var reg = /^1\d{10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入有效的手机号码"));
      }
    }
    callback();
  }
}

/**
 * 验证办学许可证
 */
export const checkSchoolLice = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("办学许可证编号不能为空"));
  } else {
    if (value !== "") {
      var reg = /^\d{13}$/;
      var reg1 = /^\d{15}$/;
      if (!reg.test(value) && !reg1.test(value)) {
        callback(new Error("请输入正确的办学许可证编号"));
      }
    }
    callback();
  }
}

/**
 * 电话手机号码验证(并且检测此号码是否存在于系统中)
 */
export const checkTelAndExist = (rule, value, callback) => {
  // 验证手机号码是否合法
  if (value === "") {
    callback(new Error("手机号码不能为空"));
  } else {
    if (value !== "") {
      var reg = /^1\d{10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入有效的手机号码"));
      } else {
        checkUserMobile({ userMobile: value })
          .then(res => {
            if (res.data) {
              callback(new Error("该手机号码已经被注册"));
            } else {
              callback()
            }
          })
      }
    }
  }
}

/**
 * 验证法人证书标号
 */
export const checkPeopleCode = (rule, value, callback) => {
  // 验证手机号码是否合法
  if (value === "") {
    callback(new Error("法人编号不能为空"));
  } else {
    var reg = /^[a-zA-Z0-9]{1,18}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入有效的法人编号"));
    } else {
      callback();
    }
  }
}

/**
 * 找回密码验证账号是否存在
 */
export const FindPasswordCheck = (rule, value, callback) => {
  // 验证手机号码是否合法
  if (value === "") {
    callback(new Error("手机号码不能为空"));
  } else {
    if (value !== "") {
      var reg = /^1\d{10}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入有效的手机号码"));
      } else {
        checkUserMobile({ userMobile: value })
          .then(res => {
            if (!res.data) {
              callback(new Error("该手机号码还未注册，请先注册"));
            } else {
              callback()
            }
          })
      }
    }
  }
}
/**
 * 判断只能为正整数
 */
export const checkZhengNumber = (rule, value, callback) => {
  if (value) {
    var res = /^\+?[0-9][0-9]*$/;
    if (!res.test(value)) {
      return callback(new Error('只能输入正整数'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}
/**
 * 判断身份证验证
 */
export const checkIdCard = (rule, value, callback) => {
  if (value) {
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(value)) {
      callback(new Error('身份证格式不正确'));
    } else {
      callback();
    }
  }
  callback()
}
