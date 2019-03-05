<template>
  <div class="school-accreditation-wrapper">
    <vue-scroll>
      <s-title :titleArr="titleArr" :showBack="false" :haveBorder="true"></s-title>
      <div class="school-accreditation-body">
        <div class="accreditation-form">
          <el-form
            :model="createAccreditationForm"
            :rules="createAccreditationRules"
            ref="createAccreditationForm"
            label-width="126px"
          >
            <el-form-item
              prop="accreditation"
              class="area"
              label="认证状态:"
              v-show="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
            >
              <p
                class="accreditation-status have-pass"
                v-if="AccreditationStatus === AccreditationStatusObject.HAVEPASSED"
              >已通过</p>
              <p
                class="accreditation-status no-pass"
                v-else-if="AccreditationStatus === AccreditationStatusObject.NOTPASS"
              >
                未通过
                <span>{{'（'+schoolDetail.approvalContent+'）'}}</span>
              </p>
              <p class="accreditation-status in-audit" v-else>审核中</p>
            </el-form-item>
            <el-form-item prop="fullName" class="area" label="学校名称:">
              <el-input
                v-model="createAccreditationForm.fullName"
                placeholder="请输入学校名称"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
              ></el-input>
            </el-form-item>

            <el-form-item prop="provinceCreate" class="area" label="所在地区">
              <el-select
                v-model="createAccreditationForm.provinceCreate"
                placeholder="省"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                @change="provinceChange"
                value-key="uid"
              >
                <el-option
                  v-for="(item, index) in selectApplyProvinceList"
                  :key="index + 'selectApplyProvinceList'"
                  :label="item.cname"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="cityCreate" class="area" label-width="0px">
              <el-select
                v-model="createAccreditationForm.cityCreate"
                placeholder="市"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                value-key="uid"
                @change="cityChange"
              >
                <el-option
                  v-for="(item, index) in selectApplyCityList"
                  :key="index + 'selectApplyCityList'"
                  :label="item.cname"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="areaCreate" class="area" label-width="0px">
              <el-select
                v-model="createAccreditationForm.areaCreate"
                placeholder="区/县"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                value-key="uid"
              >
                <el-option
                  v-for="(item, index) in selectApplyareaList"
                  :key="index + 'selectApplyareaList'"
                  :label="item.cname"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="schoolNature" class="area" label="办学性质:">
              <el-select
                v-model="createAccreditationForm.schoolNature"
                placeholder="请选择"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                @change="schoolNatureChange"
              >
                <el-option
                  v-for="(item, index) in schoolTypeListFormDic"
                  :key="index + 'schoolTypeListFormDic'"
                  :label="item.enumField"
                  :value="item.enumValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="涵盖学段:" class="area" prop="stageTypes" label-width="218px">
              <el-checkbox-group
                v-model="createAccreditationForm.stageTypes"
                v-if="AccreditationStatus === AccreditationStatusObject.UNCERTIFIED"
              >
                <el-checkbox
                  v-for="(item, index) in periodListFormDic"
                  :key="index + 'periodListFormDic'"
                  :label="item.enumValue"
                  name="stageTypes"
                >{{item.enumField}}</el-checkbox>
              </el-checkbox-group>
              <p class="accreditation-status" v-else>{{ periodShow || '暂无学段' }}</p>
            </el-form-item>
            <el-form-item prop="legalName" class="area" label="法人代表:">
              <el-input
                v-model="createAccreditationForm.legalName"
                placeholder="请输入法人代表姓名"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
              ></el-input>
            </el-form-item>
            <el-form-item prop="legalNo" class="area" label="法人代表身份证号:" label-width="218px">
              <el-input
                v-model="createAccreditationForm.legalNo"
                placeholder="请输入证件号"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
              ></el-input>
            </el-form-item>
            <el-form-item prop="schoolLicense" class="area" :label="changeCodeName + '编号:'">
              <el-input
                v-model="createAccreditationForm.schoolLicense"
                placeholder="请输入证件号"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
              ></el-input>
            </el-form-item>

            <el-form-item
              prop="licenseNo"
              class="area"
              label="营业执照编号:"
              label-width="218px"
              v-if="createAccreditationForm.schoolNature !== '1'"
            >
              <el-input
                v-model="createAccreditationForm.licenseNo"
                placeholder="请输入证件号"
                class="width200"
                :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
              ></el-input>
            </el-form-item>

            <div class="upload-wrapper">
              <el-form-item
                prop="schoolLicenseImagePath"
                class="area"
                :label="changeCodeName + ':'"
              >
                <el-upload
                  class="avatar-uploader"
                  :action="uploadPath"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessTwo"
                  :before-upload="beforeAvatarUpload"
                  :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                >
                  <img
                    v-if="schoolLicenseImagePath"
                    :src="schoolLicenseImagePath"
                    :class="{ disabledImg: AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED }"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                    :class="{ disUpload: AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED }"
                  ></i>
                </el-upload>
              </el-form-item>
              <el-form-item
                prop="licenseImagePath"
                class="area"
                label="营业执照:"
                label-width="232px"
                v-if="createAccreditationForm.schoolNature !== '1'"
              >
                <el-upload
                  class="avatar-uploader"
                  :action="uploadPath"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :disabled="AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED"
                >
                  <img
                    v-if="licenseImagePath"
                    :src="licenseImagePath"
                    :class="{ disabledImg: AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED }"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                    :class="{ disUpload: AccreditationStatus !== AccreditationStatusObject.UNCERTIFIED }"
                  ></i>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
          <el-button
            type="primary"
            class="submit-button"
            v-if="AccreditationStatus === AccreditationStatusObject.UNCERTIFIED"
            @click="submitAccreditation"
          >提交认证</el-button>
          <el-button
            type="primary"
            class="submit-button"
            v-if="AccreditationStatus === AccreditationStatusObject.NOTPASS"
            @click="AccreditationStatus = AccreditationStatusObject.UNCERTIFIED"
          >重新认证</el-button>
        </div>
        <el-dialog
          class="dialog-comp"
          :title="'提交成功'"
          width="426px"
          :visible.sync="successDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <p class="success-tips color-blue">
            <i class="iconfont">&#xe6f7;</i>
            <span>机构信息已提交成功！</span>
          </p>
          <p class="success-tips">请及时关注审核状态我们将在3个工作日内对您的信息进行审核。</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="successDialog = false">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import {
  schoolAttestation,
  getSchoolsDetial,
  getAllAreaLevel
} from "../../store/api.js";
import envConfig from "@/config"; // base请求地址

import { checkSchoolLice, checkPeopleCode } from "../../../../utils/validator.js";

export default {
  name: "SchoolAccreditation",
  data() {
    var validateIdCard = (rule, value, callback) => {
      // 验证身份证号码是否合法
      if (value === "") {
        callback(new Error("法人代表身份证号码不能为空"));
      } else {
        if (value !== "") {
          var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的身份证号码"));
          }
        }
        callback();
      }
    };
    var validateLicenseNo = (rule, value, callback) => {
      // 验证营业执照是否合法
      if (value === "") {
        callback(new Error("营业执照号码不能为空"));
      } else {
        if (value !== "") {
          var reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的营业执照"));
          }
        }
        callback();
      }
    };
    return {
      changeCodeName: "办学许可证",
      titleArr: [
        {
          path: "/working-table/manager",
          name: "工作台"
        },
        {
          path: "/working-table/school-accreditation",
          name: "学校认证"
        }
      ],
      periodListFormDic: [], // 学段列表
      schoolTypeListFormDic: [], // 办学类型
      periodShow: "", // 学段展示
      selectApplyProvinceList: [], // 申请入校时下拉框省数组
      selectApplyCityList: [], // 申请入校时下拉框城市数组
      selectApplyareaList: [], // 申请入校时下拉框区县数组
      schoolUid: "", // 学校UID
      schoolDetail: {}, // 学校详情信息
      uploadPath: envConfig.AUTH + "/new",
      AccreditationStatusObject: {
        UNCERTIFIED: "uncertified", // 未认证
        INAUDIT: "in_audit", // 审核中
        HAVEPASSED: "have_passed", // 已通过
        NOTPASS: "not_pass" // 未通过
      },
      AccreditationStatus: "",
      createAccreditationForm: {
        // 学校认证的表单
        accreditation: "认证状态",
        fullName: "",
        provinceCreate: "",
        cityCreate: "",
        areaCreate: "",
        schoolNature: "",
        stageTypes: [],
        legalName: "",
        legalNo: "",
        licenseNo: "",
        schoolLicense: "",
        licenseImagePath: null,
        schoolLicenseImagePath: null
      },
      createAccreditationRules: {
        accreditation: [
          { required: true, message: "认证状态不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "学校名称不能为空", trigger: "blur" }
        ],
        provinceCreate: [
          { required: true, message: "省不能为空", trigger: "blur" }
        ],
        cityCreate: [
          { required: true, message: "市不能为空", trigger: "blur" }
        ],
        areaCreate: [
          { required: true, message: "区/县不能为空", trigger: "blur" }
        ],
        schoolNature: [
          { required: true, message: "办学性质不能为空", trigger: "blur" }
        ],
        stageTypes: [
          { required: true, message: "涵盖学段不能为空", trigger: "blur" }
        ],
        legalName: [
          { required: true, message: "法人代表姓名不能为空", trigger: "blur" }
        ],
        legalNo: [
          { validator: validateIdCard, trigger: "blur" },
          {
            required: true,
            message: "法人代表身份证号码不能为空",
            trigger: "blur"
          }
        ],
        licenseNo: [
          { validator: validateLicenseNo, trigger: "blur" },
          { required: true, message: "营业执照编号不能为空", trigger: "blur" }
        ],
        schoolLicense: [
          {
            validator: checkSchoolLice,
            trigger: "blur"
          },
          { required: true, message: "办学许可证不能为空", trigger: "blur" }
        ],
        licenseImagePath: [
          { required: true, message: "营业执照照片不能为空", trigger: "blur" }
        ],
        schoolLicenseImagePath: [
          { required: true, message: "办学许可证照片不能为空", trigger: "blur" }
        ]
      },
      schoolLicenseImagePath: "", // 办学许可证图片上传展示
      licenseImagePath: "", // 营业执照图片上传展示
      successDialog: false // 成功信息的模态框
    };
  },
  methods: {
    schoolNatureChange(item) {
      // 办学性质下拉框change事件
      if (item === "1") {
        this.changeCodeName = "法人证书";
        this.createAccreditationForm.licenseImagePath = {}; // 营业执照图片
        this.createAccreditationRules.licenseNo = []; // 营业执照
        this.createAccreditationRules.schoolLicense = [
          {
            validator: checkPeopleCode,
            trigger: "blur"
          },
          { required: true, message: "法人证书不能为空", trigger: "blur" }
        ];
      } else {
        this.changeCodeName = "办学许可证";
        this.createAccreditationForm.licenseImagePath = null;
        this.createAccreditationForm.licenseNo = "";
        this.createAccreditationRules.licenseNo = [
          { required: true, message: "营业执照照片不能为空", trigger: "blur" }
        ]; // 营业执照
        this.createAccreditationRules.schoolLicense = [
          {
            validator: checkSchoolLice,
            trigger: "blur"
          },
          { required: true, message: "办学许可证不能为空", trigger: "blur" }
        ];
      }
    },
    handleAvatarSuccess(res, file) {
      // 营业执照图片上传
      this.licenseImagePath = URL.createObjectURL(file.raw);
      this.createAccreditationForm.licenseImagePath = res.data;
    },
    handleAvatarSuccessTwo(res, file) {
      // 办学许可证图片上传
      this.schoolLicenseImagePath = URL.createObjectURL(file.raw);
      this.createAccreditationForm.schoolLicenseImagePath = res.data;
    },
    beforeAvatarUpload(file) {
      // 上传图片前的回调
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitAccreditation() {
      // 提交学校认证
      this.$refs.createAccreditationForm.validate(valid => {
        if (valid) {
          this.$_showLoading({ text: "提交中..." }); // 打开加载效果
          let submitData = {
            approvalType: 3,
            uid: this.schoolUid,
            fullName: this.createAccreditationForm.fullName,
            provinceId: this.createAccreditationForm.provinceCreate.uid,
            provinceName: this.createAccreditationForm.provinceCreate.cname,
            cityId: this.createAccreditationForm.cityCreate.uid,
            cityName: this.createAccreditationForm.cityCreate.cname,
            areaId: this.createAccreditationForm.areaCreate.uid,
            areaName: this.createAccreditationForm.areaCreate.cname,
            schoolNature: this.createAccreditationForm.schoolNature,
            stageTypes: this.createAccreditationForm.stageTypes,
            legalName: this.createAccreditationForm.legalName,
            legalNo: this.createAccreditationForm.legalNo,
            licenseNo: this.createAccreditationForm.licenseNo,
            schoolLicense: this.createAccreditationForm.schoolLicense,
            appendixInfoList: [
              {
                // 办学许可证图片上传
                contentUid: this.schoolUid,
                filePath: this.createAccreditationForm.schoolLicenseImagePath
                  .filePath,
                filePathName: this.createAccreditationForm
                  .schoolLicenseImagePath.fileName,
                fileType: 1, // 1、图片2、视频
                imgHeight: this.createAccreditationForm.schoolLicenseImagePath
                  .fileHeight,
                imgWidth: this.createAccreditationForm.schoolLicenseImagePath
                  .fileWidth,
                imgSize: this.createAccreditationForm.schoolLicenseImagePath
                  .fileSize,
                objType: 2,
                otherFlag: 2, // 其他标识（例如学校有学校头像、许可证、营业执照。分别定义为1、2、3区分）
                thumbnailName: this.createAccreditationForm
                  .schoolLicenseImagePath.thumbnailFileName,
                thumbnailPath: this.createAccreditationForm
                  .schoolLicenseImagePath.thumbnailFilePath
              }
            ]
          };
          if (this.createAccreditationForm.schoolNature === "2") {
            // 民办学校需要传营业执照和编号
            submitData.appendixInfoList.push({
              // 营业执照图片上传
              contentUid: this.schoolUid,
              filePath: this.createAccreditationForm.licenseImagePath.filePath,
              filePathName: this.createAccreditationForm.licenseImagePath
                .fileName,
              fileType: 1, // 1、图片2、视频
              imgHeight: this.createAccreditationForm.licenseImagePath
                .fileHeight,
              imgWidth: this.createAccreditationForm.licenseImagePath.fileWidth,
              imgSize: this.createAccreditationForm.licenseImagePath.fileSize,
              objType: 2,
              otherFlag: 3, // 其他标识（例如学校有学校头像、许可证、营业执照。分别定义为1、2、3区分）
              thumbnailName: this.createAccreditationForm.licenseImagePath
                .thumbnailFileName,
              thumbnailPath: this.createAccreditationForm.licenseImagePath
                .thumbnailFilePath
            });
          }
          schoolAttestation(submitData)
            .then(() => {
              this.successDialog = true; // 打开成功提示模态框
              this.$_hideLoading(); // 关闭加载效果
              this.$store.commit("UPDATE_CURRENTSCHOOL", "isCertificate", 3); // 更新本地的学校认证状态
              this.pageInit(); // 页面重新加载
            })
            .catch(() => {
              this.$_hideLoading(); // 关闭加载效果
            });
        } else {
          return false;
        }
      });
    },
    provinceChange(city) {
      // 省下拉框的change回调
      this.selectApplyCityList = city.childList;
      if (this.selectApplyCityList) {
        this.createAccreditationForm.cityCreate = this.selectApplyCityList[0];
        this.cityChange(this.selectApplyCityList[0]);
      } else {
        this.createAccreditationForm.cityCreate = "";
      }
    },
    cityChange(area) {
      // 市下拉框的change回调
      this.selectApplyareaList = area.childList;
      if (this.selectApplyareaList) {
        this.createAccreditationForm.areaCreate = this.selectApplyareaList[0];
      } else {
        this.createAccreditationForm.areaCreate = "";
      }
    },
    pageInit() {
      this.$_showLoading({
        // 打开加载效果
        text: "加载中..."
      });
      this.schoolUid = this.$store.state.user.currentSchool.uid; // 获取到学校UID
      // 获取到学段字典信息
      this.periodListFormDic = this.dicFormater("SYS_BASE_STAGE_TYPE");
      this.schoolTypeListFormDic = this.dicFormater(
        "BASE_SCHOOL_INFO_SCHOOL_NATURE"
      );
      // 根据学校的UID查询学校的状态来展示页面
      if (String(this.schoolUid)) {
        getSchoolsDetial(this.schoolUid)
          .then(res => {
            this.schoolDetail = res.data;
            let schoolDetail = res.data;
            switch (schoolDetail.isCertificate) {
              case 1:
                this.AccreditationStatus = this.AccreditationStatusObject.HAVEPASSED; // 审核通过
                break;
              case 2:
                this.AccreditationStatus = this.AccreditationStatusObject.UNCERTIFIED; // 未认证
                break;
              case 3:
                this.AccreditationStatus = this.AccreditationStatusObject.INAUDIT; // 审核中
                break;
              case 4:
                this.AccreditationStatus = this.AccreditationStatusObject.NOTPASS; // 未通过
                break;
            }
            // 这里是所有的状态都要回填的字段
            this.createAccreditationForm.fullName = schoolDetail.fullName;
            // 将省市区联动信息初始化
            getAllAreaLevel()
              .then(res => {
                this.$_hideLoading();
                this.selectApplyProvinceList = res.data.childList; // 接收到省市区信息
                // 还原省市区
                let provinceArr,
                  provinceObj,
                  cityArr,
                  cityObj,
                  areaArr,
                  areaObj;
                provinceArr = this.selectApplyProvinceList.filter(item => {
                  return item.uid === schoolDetail.provinceId;
                });
                if (provinceArr.length) {
                  // 如果存在省
                  provinceObj = provinceArr[0];
                  this.createAccreditationForm.provinceCreate = provinceObj;
                  if (provinceObj.childList) {
                    this.selectApplyCityList = provinceObj.childList;
                    cityArr = provinceObj.childList.filter(item => {
                      return item.uid === schoolDetail.cityId;
                    });
                    if (cityArr.length) {
                      cityObj = cityArr[0];
                      this.createAccreditationForm.cityCreate = cityObj;
                      if (cityObj.childList) {
                        this.selectApplyareaList = cityObj.childList;
                        areaArr = cityObj.childList.filter(item => {
                          return item.uid === schoolDetail.areaId;
                        });
                        if (areaArr.length) {
                          areaObj = areaArr[0];
                          this.createAccreditationForm.areaCreate = areaObj;
                        }
                      }
                    }
                  }
                }
              })
              .catch(() => {
                this.$_hideLoading(); // 关闭加载效果
              });
            // 还原学段
            this.createAccreditationForm.stageTypes = schoolDetail.stageTypes.map(
              item => {
                return String(item);
              }
            );
            // 这里是审核中和审核通过回填的字段
            if (
              this.AccreditationStatus ===
                this.AccreditationStatusObject.INAUDIT ||
              this.AccreditationStatus ===
                this.AccreditationStatusObject.HAVEPASSED
            ) {
              this.createAccreditationForm.schoolNature = String(
                // 还原办学性质
                schoolDetail.schoolNature
              );
              if (schoolDetail.stageTypes.length) {
                // 拼接学段展示
                let periodArrays = [];
                for (let i = 0; i < schoolDetail.stageTypes.length; i++) {
                  periodArrays.push(
                    this.dicFormater(
                      "SYS_BASE_STAGE_TYPE",
                      String(schoolDetail.stageTypes[i])
                    )
                  );
                }
                this.periodShow = periodArrays.join("、");
              }
              this.createAccreditationForm.legalName = schoolDetail.legalName;
              this.createAccreditationForm.legalNo = schoolDetail.legalNo;
              this.createAccreditationForm.licenseNo = schoolDetail.licenseNo;
              this.createAccreditationForm.schoolLicense =
                schoolDetail.schoolLicense;
              const appendixInfoList = schoolDetail.appendixInfoList; // 附件列表
              const schoolLicenseImageArr = appendixInfoList.filter(item => {
                // 办学许可证图片展示
                return item.otherFlag === 2;
              });
              const licenseImagePathArr = appendixInfoList.filter(item => {
                // 营业执照图片展示
                return item.otherFlag === 3;
              });
              if (schoolLicenseImageArr.length) {
                this.schoolLicenseImagePath =
                  envConfig.FILEPATH +
                  schoolLicenseImageArr[0].filePath +
                  "/" +
                  schoolLicenseImageArr[0].filePathName; // 拼接营业执照
              }
              if (licenseImagePathArr.length) {
                this.licenseImagePath =
                  envConfig.FILEPATH +
                  licenseImagePathArr[0].filePath +
                  "/" +
                  licenseImagePathArr[0].filePathName; // 拼接办学许可证
              }
            }
          })
          .catch(() => {
            this.$_hideLoading(); // 关闭加载效果
          });
      } else {
        this.$message.error("参数出错");
      }
    }
  },
  mounted() {
    this.pageInit();
  }
};
</script>
<style lang="scss" scoped>
.school-accreditation-wrapper {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  position: relative;
}
.good-title {
  // 标题公共样式
  height: 50px;
  overflow: hidden;
  line-height: 16px;
  font-size: 14px;
  border-bottom: 1px solid $working-color2;
  margin-bottom: 20px;
  .fl-title {
    border-left: 4px solid $title-color2;
    color: $font-color;
    margin: 17px 0;
    font-weight: bold;
    text-indent: 10px;
    a {
      font-weight: 400;
    }
  }
}
.school-accreditation-body {
  padding: 14px 20px;
  .accreditation-form {
    width: 800px;
    padding-bottom: 90px;
    .area {
      display: inline-block;
    }
    .area:nth-of-type(1),
    .area:nth-of-type(2) {
      width: 750px;
    }
    .area:nth-of-type(7) {
      width: 434px;
    }
    .area:nth-of-type(3),
    .area:nth-of-type(4) {
      margin-right: 12px;
    }
    .upload-wrapper {
      height: 158px;
      .area {
        float: left;
      }
      .area:nth-of-type(1) {
        width: 312px;
      }
      .area:nth-of-type(2) {
        width: 420px;
      }
    }
    .width200 {
      width: 200px;
    }
    .submit-button {
      width: 90px;
      display: block;
      margin: 42px auto 0 auto;
    }
    // 认证状态样式
    .accreditation-status {
      line-height: 40px;
      font-size: 14px;
    }
    .have-pass {
      color: $person-color17;
    }
    .no-pass {
      color: $person-color16;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 624px;
      span {
        color: $working-color3;
      }
    }
    .in-audit {
      color: $working-color15;
    }
  }
}
</style>
<style lang="scss">
.school-accreditation-wrapper {
  // 上传样式
  .avatar-uploader .el-upload {
    width: 200px;
    height: 140px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 50px;
    color: $working-color17;
    width: 200px;
    height: 140px;
    line-height: 140px;
    text-align: center;
    border: 1px dashed $working-color16;
    border-radius: 4px;
  }
  .disUpload {
    // 禁止上传样式
    background: $input-disabled-color2;
    color: $input-disabled-color1;
    cursor: not-allowed;
  }
  .disabledImg {
    cursor: not-allowed;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
  // 按钮默认样式
  .el-button {
    border-radius: 4px;
    color: $home-color5;
    line-height: 0;
    padding: 0;
    height: 32px;
  }
  // 输入框禁用样式
  .el-input.is-disabled .el-input__inner {
    background: $working-color18;
    border-color: $working-color16;
  }
  // 模态框样式
  .dialog-comp {
    .el-dialog__body {
      font-size: 14px;
      .success-tips {
        margin: 0 auto;
        width: 262px;
        line-height: 24px;
        color: $working-color9;
        text-align: center;
        i {
          font-size: 24px;
          padding-right: 10px;
        }
      }
      .success-tips:nth-last-of-type(1) {
        padding-top: 22px;
        padding-bottom: 16px;
      }
      .color-blue {
        color: $working-color1;
        font-size: 16px;
        line-height: 32px;
      }
      .el-form-item__label {
        text-align: right;
      }
    }
  }
}
</style>
