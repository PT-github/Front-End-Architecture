<template>
  <vue-scroll ref="vs" @handle-scroll="handleScroll">
    <div class="home">
      <!-- 头部 -->
      <div class="home-header width1200">
        <div class="header-left fl">
          <router-link to="/">
            <img class="home-logo" src="../../../../assets/img/home-logo.png">
          </router-link>
        </div>
        <div class="header-right fr">
          <div class="tel fl">
            <div class="tel-logo fl">
              <i class="iconfont">&#xe6d7;</i>
            </div>
            <div class="tel-num fl">0731-89721858</div>
          </div>
          <div class="button-warpper fl">
            <el-button class="def-button" @click="loginOrReg('login')">登录</el-button>
            <el-button class="def-button" @click="loginOrReg('reg')">注册</el-button>
          </div>
          <div class="help-center fl" title="帮助中心">
            <i class="iconfont icon-bangzhuzhongxin"></i>
            <span class="txt">帮助中心</span>
            <div class="select-box">
              <a
                class="select-item"
                title="视频教程"
                :href="ADDPREFIXBase + '/help-center?index=3'"
                target="_blank"
              >视频教程</a>
              <a
                class="select-item"
                title="操作手册"
                :href="PREFIX + 'static/doc/web/viewer.html?file=奥昇教务排课操作手册.pdf'"
                target="_blank"
              >操作手册</a>
              <a
                class="select-item"
                title="FAQ"
                :href="PREFIX + 'static/doc/web/viewer.html?file=奥昇教务排课FAQ文档.pdf'"
                target="_blank"
              >FAQ</a>
            </div>
          </div>
        </div>
      </div>
      <!-- banner图 -->
      <div class="home-banner">
        <div class="banner-wrapper width1200">
          <div class="banner-left">
            <p>奥昇排课系统</p>
            <p>智能排课专家，教务管理好帮手</p>
            <el-button @click="applyAccount">申请试用</el-button>
          </div>
          <div class="banner-right">
            <img src="../../../../assets/img/banner-inner.png" alt>
          </div>
        </div>
      </div>
      <!-- 导航 -->
      <HomeNav></HomeNav>
      <!-- 侧边栏 -->
      <ul class="home-side" v-bind:class="{ sideshow: isSideBarShow }">
        <li @click="openServiceModal">
          <div class="side-icon">
            <i class="iconfont">&#xe6d9;</i>
          </div>
          <div class="side-content">留言</div>
        </li>
        <li slot="reference">
          <el-popover placement="left" trigger="hover" popper-class="popper">
            <HomeTwoDimension :twoDimensionArr="twoDimensionArr"></HomeTwoDimension>
            <div slot="reference">
              <div class="side-icon">
                <i class="iconfont">&#xe6db;</i>
              </div>
              <div class="side-content">二维码</div>
            </div>
          </el-popover>
        </li>
        <li @click="goTop">
          <div class="side-icon">
            <i class="iconfont">&#xe6da;</i>
          </div>
          <div class="side-content">返回顶部</div>
        </li>
      </ul>
      <!-- 轮播图 -->
      <div class="home-carousel">
        <div class="thanks">
          <p class="home-big-title">特别鸣谢</p>
          <p>提供需求调研支持，产品优化意见，帮助我们茁壮成长，我们会更加努力的</p>
        </div>
        <ul class="home-carousel-wrapper clearfix">
          <li v-for="(item, index) in carouselArr" :key="'carousel'+index">
            <div class="big" :class="{ bigShow: selectCarousel === index }">
              <img :src="item.schoolPhoto" alt>
              <div class="school-introduce fl">
                <p class="textoverflow-single">{{ item.schoolName}}</p>
                <p class="textoverflow-single">{{ item.schoolArea }}</p>
                <p class="remarks">{{ item.schoolDetail }}</p>
              </div>
            </div>
            <div
              class="small"
              @mouseenter="selectCarousel = index"
              :class="{ smallHidden: selectCarousel === index }"
            >
              <div class="school-introduce fl">
                <p class="textoverflow-single">{{ item.schoolName}}</p>
                <p class="textoverflow-single">{{ item.schoolArea }}</p>
                <p class="remarks">{{ item.schoolDetail }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 首页公司团队照片展示 -->
      <div class="team-background clearfix">
        <div class="home-team">
          <div class="team-title">
            <p class="home-big-title">我们的团队</p>
            <p>我们的目标，很明确：做好中小学教务管理专家</p>
          </div>
          <div class="carousel-wrapper">
            <el-carousel indicator-position="outside" height="312px" arrow="never">
              <el-carousel-item v-for="(item, index) in teamMessageArr" :key="'team' + index">
                <li v-for="(sonItem, index2) in item" :key="'sonteam' + index2">
                  <div class="team-photo">
                    <img :src="sonItem.photoUrl" alt>
                  </div>
                  <p>{{sonItem.realName}}</p>
                  <p>{{sonItem.position}}</p>
                </li>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
      <!-- 客服模态框 -->
      <div class="home-service">
        <el-dialog
          title="客服咨询"
          :visible.sync="serviceDialogVisible"
          width="500px"
          center
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="modal-tips">您好，欢迎咨询！可在下方留下您的联系方式和问题，我们会及时与您联系。</div>
          <div class="modal-form">
            <el-form
              :model="serviceValidateForm"
              :rules="serviceRules"
              ref="serviceValidateForm"
              class="demo-ruleForm"
            >
              <el-form-item prop="userRealname">
                <el-input v-model="serviceValidateForm.userRealname" placeholder="请输入您的姓名"></el-input>
              </el-form-item>
              <el-form-item prop="userPhone">
                <el-input v-model="serviceValidateForm.userPhone" placeholder="请输入您的联系方式"></el-input>
              </el-form-item>
              <el-form-item prop="questType">
                <el-select
                  v-model="serviceValidateForm.questType"
                  :clearable="true"
                  placeholder="请选择问题类型"
                >
                  <el-option
                    v-for="item in questionTypeFormDic"
                    :key="item.uid + 'questionTypeFormDic'"
                    :label="item.enumField"
                    :value="item.enumValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="notesContent">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="serviceValidateForm.notesContent"
                  placeholder="请在此输入您的问题"
                  resize="none"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button class="commit" @click="commitServiceForm">提交</el-button>
            </span>
          </div>
        </el-dialog>
      </div>
      <div class="others">
        <!-- 申请试用&联系我们 -->
        <div class="trail-contact">
          <div class="home-trial">
            <div class="trial-title">
              <p class="home-big-title">申请试用</p>
              <p>
                欢迎了解奥昇教务管理系统。请填写信息，客服将尽快与您联系。
                审核通过后，您可以获得 免费试用资格，试用期限15天
              </p>
            </div>
            <div class="trial-form">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="fullName">
                  <el-input v-model="ruleForm.fullName" placeholder="请输入学校名称（必填）"></el-input>
                </el-form-item>

                <el-form-item prop="provinceCreate" class="area">
                  <el-select
                    v-model="ruleForm.provinceCreate"
                    placeholder="请选择学校所在省"
                    class="school-address"
                    @change="provinceChangeTwo"
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
                    v-model="ruleForm.cityCreate"
                    placeholder="请选择学校所在市"
                    class="school-address"
                    value-key="uid"
                    @change="cityChangeTwo"
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
                    v-model="ruleForm.areaCreate"
                    placeholder="请选择学校所在区/县"
                    class="school-address"
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
                <el-form-item label="涵盖学段：" prop="stageTypes">
                  <el-checkbox-group v-model="ruleForm.stageTypes">
                    <el-checkbox
                      v-for="(item, index) in periodListFormDic"
                      :key="index + 'periodListFormDic'"
                      :label="item.enumValue"
                      name="stageTypes"
                    >{{item.enumField}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="linkmanPhone">
                  <el-input v-model="ruleForm.linkmanPhone" placeholder="请输入您的手机号(必填)"></el-input>
                </el-form-item>
                <el-form-item prop="linkmanName">
                  <el-input v-model="ruleForm.linkmanName" placeholder="请输入您的姓名(必填)"></el-input>
                </el-form-item>
                <el-form-item prop="agreement">
                  <el-checkbox v-model="ruleForm.agreement">
                    已阅读并同意&nbsp;
                    <a class="agreement" target="_blank" :href="ADDPREFIX">《奥昇教育平台使用协议》</a>
                  </el-checkbox>
                </el-form-item>
                <el-form-item class="button-center">
                  <el-button @click="submitForm()">提交申请</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="home-contact">
            <div class="contact-content">
              <p>联系我们</p>
              <p>长沙地址：长沙市天心区雀园路568号创谷广告产业园B3栋5楼</p>
              <p>怀化地址：怀化市广告创意产业园B8栋2层</p>
              <p>电话：0731-89721858</p>
              <p>邮箱：edu@aorise.org</p>
            </div>
            <div class="contact-img">
              <div v-for="(item, index) in twoDimensionArr" :key="'twodimension' + index">
                <img src="../../../../assets/img/wait.png" alt>
                <p>{{item.nametwo}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="footer">
          <p>{{indexPageParams.footerDesc}}</p>
          <p>湘ICP备18009315号</p>
        </div>
      </div>
      <!-- 页面登录注册 -->
      <div class="home-login-reg">
        <el-dialog
          :visible.sync="loginRegDialogVisible"
          width="480px"
          center
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="logo-icon">
            <img src="../../../../assets/img/home-logo.png" alt>
          </div>
          <div class="s-menu clearfix" v-if="selectIndex !== 2">
            <template>
              <a
                class="s-menu_a"
                v-for="(item, index) in menuList"
                :class="{'router-link-active': index === selectIndex}"
                :key="'s-menu_' + index"
                @click="changeModelIndex(index)"
              >{{ item.title }}</a>
            </template>
          </div>
          <!-- 页面主体 -->
          <HomeLoginRegForm
            :selectIndex="selectIndex"
            :isModalShow="loginRegDialogVisible"
            @childChangeIndex="childChangeIndex"
            @closeModal="loginRegDialogVisible = false;"
          ></HomeLoginRegForm>
        </el-dialog>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
// 图片引入
import team from "../../../../assets/img/曾新荣-项目经理.png";
import team1 from "../../../../assets/img/苏海宾-软件工程师.png";
import team2 from "../../../../assets/img/彭涛-前端工程师.png";
import team3 from "../../../../assets/img/文建纲-软件工程师.png";
import team4 from "../../../../assets/img/王芬-前端工程师.png";
import team5 from "../../../../assets/img/田伟晔-前端工程师.png";
import team6 from "../../../../assets/img/匡明敏-UI设计师.png";
import team7 from "../../../../assets/img/邓佑兰-产品经理.png";
import team8 from "../../../../assets/img/李甜-测试工程师.png";
import team9 from "../../../../assets/img/谭松-产品经理.png";

import schoolImg from "../../../../assets/img/圣达学校.png";
import schoolImg1 from "../../../../assets/img/溆浦一中.png";
import schoolImg2 from "../../../../assets/img/警予小学.png";
import schoolImg3 from "../../../../assets/img/鹿鸣学校.png";

// 组件引入
import HomeNav from "./home-components/home-nav";
import HomeTwoDimension from "./home-components/home-two-dimension";
import HomeLoginRegForm from "./home-components/home-login-reg-form";
// api引入
import {
  addUserNotes,
  addNewSchool,
  getIndexPageParam,
  getAllDic,
  getAllAreaLevel
} from "../../store/api.js";

import storage from "@/utils/storage"; // 引入localStorge
import { checkTel } from "../../../../utils/validator.js";
import envConfig from "@/config"; // base请求地址

export default {
  name: "Home",
  data() {
    var agreementValidate = (rule, value, callback) => {
      // 验证是否勾选协议
      if (value) {
        callback();
      } else {
        callback(new Error("请阅读并勾选使用协议"));
      }
    };
    let _PREFIX = envConfig.ADDPREFIX.substring(0, envConfig.ADDPREFIX.length - 1)
    return {
      selectCarousel: 0, // 初始化轮播选中index
      teamMessageArr: [
        [
          {
            photoUrl: team,
            realName: "曾新荣",
            position: "项目经理"
          },
          {
            photoUrl: team1,
            realName: "苏海宾",
            position: "软件工程师"
          },
          {
            photoUrl: team2,
            realName: "彭涛",
            position: "前端工程师"
          },
          {
            photoUrl: team3,
            realName: "文建纲",
            position: "软件工程师"
          },
          {
            photoUrl: team4,
            realName: "王芬",
            position: "前端工程师"
          }
        ],
        [
          {
            photoUrl: team5,
            realName: "田伟晔",
            position: "前端工程师"
          },
          {
            photoUrl: team8,
            realName: "匡明敏",
            position: "UI设计师"
          },
          {
            photoUrl: team7,
            realName: "邓佑兰",
            position: "产品经理"
          },
          {
            photoUrl: team6,
            realName: "李甜",
            position: "测试工程师"
          },
          {
            photoUrl: team9,
            realName: "谭松",
            position: "产品经理"
          }
        ]
      ],
      carouselArr: [
        // 轮播数组
        {
          isBig: false,
          schoolName: "圣达学校",
          schoolArea: "湖南省怀化市溆浦县",
          schoolPhoto: schoolImg,
          schoolDetail:
            "学校以社会主义核心价值观为指向，以打造孔子文化为契入点，传承中华优秀传统文化，兼容世界先进文明，激励学生励志前行，培养学生爱国精神和科学探索精神，谋求文化共进和内涵发展。以“厚德、博学、健体、担当”为校训，积极践行“对每个孩子终生发展和幸福负责”的办学理念，按照“德育为首、安全第一、质量中心、特色发展”的工作思路，坚持“有理想人格、有核心素养、有民族灵魂、有世界眼光”的人才培养目标，力创“学生向往、教师幸福、家长信任、人民满意”的怀化市标杆学校和湖南省一流的特色名校。"
        },
        {
          isBig: false,
          schoolName: "溆浦一中",
          schoolArea: "湖南省怀化市溆浦县",
          schoolPhoto: schoolImg1,
          schoolDetail:
            "溆浦县第一中学坐落于溆浦县城东郊的枣子坡，背倚凤凰山、前临溆水河、风景秀丽、人才辈出。它创办于1938年秋，前身为湖南省立第九中学，1980年首批进入怀化地区重点中学行列，是怀化市规模最大的完全中学之一，现为湖南省示范性普通高中。近年来，学校紧紧围绕“高质量、高品位、有特色、现代化”的省级示范性高中的奋斗目标，严格按照湖南省示范性普通高中建设的基本条件，全面贯彻“以人为本，全面发展，张扬个性，追求卓越”的办学理念，管理品位不断提升，办学条件得到极大改善。"
        },
        {
          isBig: false,
          schoolName: "警予小学",
          schoolArea: "湖南省怀化市溆浦县",
          schoolPhoto: schoolImg2,
          schoolDetail:
            "警予学校坐落在县城西落阳桥，东接警予馆，西临落阳桥，南靠溆水河，北面是警予路。方圆12.6亩，成四合院型。学校前身是溆浦女校，创建于光绪三十二年。在1978年，为纪念向警予烈士，湖南省宣传部下文改名为“警予学校”。学校坚持“以人为本，面向全员，关注生命，奠基未来”的办学理念，实施“注重校本，全面发展，科研兴校，特色强校”的办学策略，全面贯彻党和国家的教育方针，积极弘扬警予精神！"
        },
        {
          isBig: true,
          schoolName: "鹿鸣学校",
          schoolArea: "湖南省怀化市溆浦县",
          schoolPhoto: schoolImg3,
          schoolDetail:
            "溆浦县鹿鸣学校，是一所九年一贯制公办学校，位于溆浦县卢峰镇城南地坪村。学校校园占地面积144亩，校舍面积33186平方米，建有高标准400米环形跑道的运动场，标准教室82间，可容纳学生4500人左右。学校现有9个年级，79个教学班，在校学生4242人，专任教师221人，本科学历101人、专科学历83人，其中高级教师33人，一级教师131人。近年来，在学校行政班子的带领下，全体鹿鸣人励精图治，奋发图强，学校形成了团结、向上、乐教、好学的良好风气，正逐步向着高标准的现代化学校迈进。"
        }
      ],
      ADDPREFIX: envConfig.ADDPREFIX + "/personal-center/user-agreement", // 用户协议地址
      ADDPREFIXBase: envConfig.ADDPREFIX,
      PREFIX: _PREFIX,
      periodListFormDic: [], // 学段列表
      selectApplyProvinceList: [], // 申请试用时下拉框省数组
      selectApplyCityList: [], // 申请试用时下拉框城市数组
      selectApplyareaList: [], // 申请试用时下拉框区县数组
      twoDimensionArr: [], // 二维码数组 13548729051
      indexPageParams: {}, // 首页参数
      questionTypeFormDic: [], // 问题类型
      ruleForm: {
        fullName: "",
        provinceCreate: "",
        cityCreate: "",
        areaCreate: "",
        stageTypes: [],
        linkmanPhone: "",
        linkmanName: "",
        agreement: ""
      },
      rules: {
        fullName: [
          { required: true, message: "请输入学校名称(必填)", trigger: "blur" },
          { max: 20, message: "学校名称限制20个字", trigger: "blur" }
        ],
        provinceCreate: [
          { required: true, message: "请选择学校所在省", trigger: "change" }
        ],
        cityCreate: [
          { required: true, message: "请选择学校所在市", trigger: "change" }
        ],
        areaCreate: [
          { required: true, message: "请选择学校所在区/县", trigger: "change" }
        ],
        stageTypes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个学段",
            trigger: "change"
          }
        ],
        linkmanPhone: [{ validator: checkTel, trigger: "blur" }],
        linkmanName: [
          { required: true, message: "请输入您的姓名(必填)", trigger: "blur" },
          { max: 10, message: "姓名限制10个字", trigger: "blur" }
        ],
        agreement: [{ validator: agreementValidate, trigger: "blur" }]
      },
      serviceDialogVisible: false, // 客服模态框是否显示
      serviceValidateForm: {
        // 客服表单
        userRealname: "",
        userPhone: "",
        questType: "",
        notesContent: ""
      },
      isSideBarShow: false, // 侧边栏是否显示
      serviceRules: {
        // 客服表单验证
        userRealname: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        userPhone: [{ validator: checkTel, trigger: "blur" }],
        questType: [
          { required: true, message: "问题类型不能为空", trigger: "change" }
        ],
        notesContent: [
          { required: true, message: "问题内容不能为空", trigger: "blur" },
          { max: 200, message: "问题内容限制200个字", trigger: "blur" }
        ]
      },
      selectIndex: 0, // 当前是登录还是注册
      title: "",
      loginRegDialogVisible: false, // 登录注册模态框
      menuList: [
        // 登录模态框切换数组
        {
          title: "登录"
        },
        {
          title: "注册"
        }
      ]
    };
  },
  components: {
    HomeNav,
    HomeTwoDimension,
    HomeLoginRegForm
  },
  methods: {
    // 跳转到帮助中心页面
    goHelpCenter(index) {
      this.$router.push({ path: "/help-center", query: { index: index } });
    },
    goTop() {
      // 返回顶部
      this.$refs["vs"].scrollTo({ x: 0, y: 0 });
    },
    applyAccount() {
      this.$refs["vs"].scrollTo({ x: 0, y: 2300 });
    },
    handleScroll(vertical) {
      // 监听滚动条
      if (vertical.scrollTop >= 200) {
        this.isSideBarShow = true;
      } else {
        this.isSideBarShow = false;
      }
    },
    openServiceModal() {
      // 打开客服模态框
      this.serviceDialogVisible = true;
      this.resetServiceForm(); // 重置客服表单
    },
    commitServiceForm() {
      // 提交客服表单
      this.$refs.serviceValidateForm.validate(valid => {
        if (valid) {
          this.$_showLoading({
            text: "加载中..."
          });
          const submitData = {
            ...this.serviceValidateForm,
            notesSource: 1,
            notesType: 2
          };
          addUserNotes(submitData)
            .then(() => {
              this.serviceDialogVisible = false; // 关闭模态框
              this.$message.success("您的问题已经提交成功");
              this.$_hideLoading();
            })
            .catch(() => {
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetServiceForm() {
      // 重置客服表单
      if (this.$refs.serviceValidateForm) {
        this.$refs.serviceValidateForm.resetFields();
      }
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$_showLoading({
            text: "加载中..."
          });
          const submitData = {
            provinceId: this.ruleForm.provinceCreate.uid,
            provinceName: this.ruleForm.provinceCreate.cname,
            cityId: this.ruleForm.cityCreate.uid,
            cityName: this.ruleForm.cityCreate.cname,
            areaId: this.ruleForm.areaCreate.uid,
            areaName: this.ruleForm.areaCreate.cname,
            fullName: this.ruleForm.fullName,
            stageTypes: this.ruleForm.stageTypes,
            linkmanPhone: this.ruleForm.linkmanPhone,
            linkmanName: this.ruleForm.linkmanName,
            approvalType: 1
          };
          addNewSchool(submitData)
            .then(() => {
              this.$message.success("申请试用成功,请您等待审批");
              this.resetRuleForm(); // 重置申请试用表单
              this.$_hideLoading();
            })
            .catch(e => {
              console.log(e);
              this.$_hideLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetRuleForm() {
      // 重置申请试用表单
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
    provinceChangeTwo(city) {
      // 省下拉框的change回调
      this.selectApplyCityList = city.childList;
      if (this.selectApplyCityList) {
        this.ruleForm.cityCreate = this.selectApplyCityList[0];
        this.cityChangeTwo(this.ruleForm.cityCreate);
      } else {
        this.ruleForm.cityCreate = "";
      }
    },
    cityChangeTwo(area) {
      // 市下拉框的change回调
      this.selectApplyareaList = area.childList;
      if (this.selectApplyareaList) {
        this.ruleForm.areaCreate = this.selectApplyareaList[0];
      } else {
        this.ruleForm.areaCreate = "";
      }
    },
    loginOrReg(type) {
      // 登录或者注册
      if (type === "login") {
        this.selectIndex = 0;
      } else {
        this.selectIndex = 1;
      }
      this.loginRegDialogVisible = true; // 打开登录注册模态框
    },
    changeModelIndex(index) {
      // 切换登录注册
      this.selectIndex = index;
    },
    childChangeIndex(index) {
      this.selectIndex = index; // 接收到子组件传递的index切换页面
    },
    initIndexPage() {
      // 初始化首页参数
      getIndexPageParam().then(res => {
        if (res.hasOwnProperty("data")) {
          this.indexPageParams = res.data;
          // 拼装二维码
          this.twoDimensionArr = [
            {
              name: "Android下载",
              nametwo: "下载APP-安卓版",
              imgUrl:
                this.indexPageParams.androidImagePath +
                this.indexPageParams.androidImageName
            },
            {
              name: "iphone下载",
              nametwo: "下载APP-IOS",
              imgUrl:
                this.indexPageParams.iosImagePath +
                this.indexPageParams.iosImageName
            },
            {
              name: "关注公众号",
              nametwo: "关注公众号",
              imgUrl:
                this.indexPageParams.wechatImagePath +
                this.indexPageParams.wechatImageName
            }
          ];
        }
      });
      // 将省市区联动信息初始化
      getAllAreaLevel().then(res => {
        this.selectApplyProvinceList = res.data.childList;
      });
    }
  },
  mounted() {
    this.initIndexPage();
    // 页面一进来就将字典信息全部存入本地
    getAllDic().then(res => {
      storage.setItem("dic", JSON.stringify(res.data));
      this.$_setDic(res.data);
      this.periodListFormDic = this.dicFormater("SYS_BASE_STAGE_TYPE"); // 获取到学段字典信息
      this.questionTypeFormDic = this.dicFormater(
        // 获取到问题类型字典信息
        "BASE_USER_NOTES_INFO_QUEST_TYPE"
      );
    });
  }
};
</script>
<style lang="scss" scoped>
.home {
  .el-button+.el-button {
    margin-left: 14px;
  }
  .home-button {
    // 首页按钮的统一样式(除了高度和宽度字体大小)
    cursor: pointer;
    background: $home-color15;
    text-align: center;
    font-weight: bold;
    border-radius: 4px;
    color: $home-color5;
  }
  .home-header {
    // 首页头部样式
    height: 78px;
    font-size: 14px;
    .header-left {
      .home-logo {
        margin: 14px 0;
        display: block;
        width: 140px;
      }
    }
    .header-right {
      // width: 434px;
      height: 78px;
      .tel {
        line-height: 26px;
        height: 26px;
        margin: 26px 0;
        width: 148px;
        .tel-logo {
          width: 26px;
          height: 26px;
          i {
            font-size: 26px;
            color: $home-color15;
          }
        }
        .tel-num {
          margin-left: 5px;
          color: $home-color1;
        }
      }
      // 帮助中心
      .help-center {
        position: relative;
        width: 130px;
        // margin: 0 5px;
        line-height: 78px;
        text-align: right;
        height: 78px;
        cursor: pointer;
        i {
          font-size: 28px;
          color: $home-color23;
          position: absolute;
          top: 26px;
          left: 40px;
          height: 28px;
          line-height: 28px;
        }
        .select-box {
          text-align: center;
          display: none;
          position: absolute;
          width: 140px;
          top: 78px;
          left: -10px;
          background: $layout-color4;
          border-radius: 0px 0px 4px 4px;
          box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.4);
          .select-item {
            display: block;
            height: 44px;
            line-height: 44px;
            color: #666666;
            cursor: pointer;
            &:hover {
              background: $layout-color4_5;
              color: $layout-color4_7;
            }
          }
        }
        &:hover {
          i, span.txt {
            color: $main-color;
          }
          .select-box {
            display: block;
          }
        }
      }
      .button-warpper {
        line-height: 78px;
        margin-left: 40px;
        .el-button {
          width: 66px;
          height: 32px;
        }
        .el-button:nth-of-type(1) {
          background: $home-color5;
          color: $home-color14;
          border: 1px solid $home-color15;
        }
      }
      .apply {
        margin: 23px 0 23px 26px;
        line-height: 32px;
        width: 82px;
        height: 32px;
      }
    }
  }
  .home-banner {
    // 首页banner图样式
    width: 100%;
    height: 540px;
    background: url(../../../../assets/img/banner.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
    .banner-wrapper {
      .banner-left {
        height: 540px;
        float: left;
        width: 440px;
        text-align: left;
        p:nth-of-type(1) {
          color: $home-color5;
          font-size: 60px;
          padding-top: 146px;
        }
        p:nth-of-type(2) {
          font-size: 24px;
          color: $home-color5;
          padding-top: 20px;
        }
        .el-button {
          width: 160px;
          height: 50px;
          background: $home-color16;
          font-size: 24px;
          margin-top: 80px;
        }
      }
      .banner-right {
        width: 760px;
        height: 540px;
        float: left;
        img {
          display: block;
          margin-top: 72px;
        }
      }
    }
  }
  .home-introduce {
    // 首页产品介绍样式
    position: relative;
    text-align: center;
    .introduce-icon {
      background: white;
      width: 240px;
      height: 120px;
      border-radius: 120px 120px 0 0;
      position: absolute;
      top: -42px;
      left: calc(50% - 120px);
      i {
        width: 54px;
        height: 54px;
        margin: 36px auto 0 auto;
        font-size: 54px;
        color: $home-color12;
      }
    }
    p:nth-of-type(1) {
      font-size: 48px;
      color: $home-color3;
      padding: 74px 0 50px 0;
    }
    p:nth-of-type(2),
    p:nth-of-type(3) {
      line-height: 36px;
      font-size: 20px;
      color: $home-color1;
    }
  }
  .home-side {
    // 首页侧边栏样式
    border: 1px solid $home-color13;
    border-right: none;
    position: fixed;
    bottom: -200px;
    transition: bottom 1.5s;
    -webkit-transition: bottom 1.5s;
    right: 0px;
    cursor: pointer;
    background: $home-color5;
    li {
      width: 72px;
      height: 66px;
      .side-content {
        line-height: 32px;
        height: 32px;
        font-size: 12px;
        text-align: center;
      }
      .side-icon {
        box-sizing: border-box;
        height: 34px;
        line-height: 38px;
        text-align: center;
        i {
          font-size: 20px;
        }
      }
    }
    li:hover {
      background: $home-color15;
      color: $home-color5;
    }
    li:nth-of-type(1),
    li:nth-of-type(2) {
      border-bottom: 1px solid $home-color13;
    }
  }
  .sideshow {
    bottom: 90px;
  }
  .home-big-title {
    width: 1200px;
    margin: 0 auto;
    font-size: 48px;
    color: $home-color3;
    position: relative;
    &::before {
      content: "";
      position: absolute; /*定位背景横线的位置*/
      top: 52%;
      left: 375px;
      background: $home-color9; /*宽和高做出来的背景横线*/
      width: 80px;
      height: 2px;
    }
    &::after {
      content: "";
      position: absolute; /*定位背景横线的位置*/
      top: 52%;
      left: 745px;
      background: $home-color9; /*宽和高做出来的背景横线*/
      width: 80px;
      height: 2px;
    }
  }
  .home-carousel {
    // 首页轮播样式
    width: 100%;
    .thanks {
      text-align: center;
      padding-top: 100px;
      p {
        width: 1200px;
        margin: 0 auto;
      }
      p:nth-of-type(2) {
        font-size: 18px;
        color: $home-color4;
        padding-top: 18px;
      }
    }
    .home-carousel-wrapper {
      width: 900px;
      margin: 0 auto;
      padding: 120px 0 110px 0;
      box-sizing: border-box;
      li {
        position: relative;
        float: left;
        .small {
          box-sizing: border-box;
          cursor: pointer;
          width: 430px;
          height: 172px;
          border-radius: 5px;
          margin: 10px;
          padding: 27px 30px;
          box-shadow: 0px 4px 13px 3px rgba(129, 160, 205, 0.26);
          opacity: 1;
          -webkit-transition: opacity 0.1s ease-out;
          -moz-transition: opacity 0.1s ease-out;
          transition: opacity 0.1s ease-out;
          p:nth-of-type(1) {
            font-size: 24px;
            color: $home-color3;
          }
          p:nth-of-type(2) {
            font-size: 16px;
            color: $home-color1;
            padding-top: 8px;
          }
          p:nth-of-type(3) {
            font-size: 14px;
            padding-top: 15px;
            color: $home-color20;
            position: relative;
            line-height: 22px;
            height: 60px;
            overflow: hidden;
            &::after {
              content: "...";
              position: absolute;
              bottom: 4px;
              right: 0;
            }
          }
        }
        .big {
          z-index: -2;
          position: absolute;
          box-sizing: border-box;
          height: 240px;
          width: 640px;
          background: rgba(51, 158, 254, 1);
          box-shadow: 0px 4px 13px 3px rgba(52, 136, 254, 0.4);
          border-radius: 10px;
          padding: 30px;
          opacity: 0;
          -webkit-transition: opacity 0.1s ease-out;
          -moz-transition: opacity 0.1s ease-out;
          transition: opacity 0.1s ease-out;
          .school-introduce {
            padding-left: 20px;
            p {
              color: $home-color5;
              width: 372px;
            }
            p:nth-of-type(1) {
              font-size: 24px;
            }
            p:nth-of-type(2) {
              font-size: 16px;
              padding-top: 8px;
            }
            .remarks {
              position: relative;
              font-size: 14px;
              padding-top: 26px;
              width: 370px;
              line-height: 22px;
              height: 136px;
              overflow: hidden;
              &::after {
                content: "...";
                font-weight: bold;
                position: absolute;
                bottom: 4px;
                right: -1px;
              }
            }
          }
          img {
            width: 178px;
            height: 178px;
            float: left;
          }
        }
        .bigShow {
          opacity: 1;
          z-index: 1;
        }
        .smallHidden {
          opacity: 0;
        }
      }
      li:nth-of-type(1) .big {
        top: -74px;
        right: -42px;
      }
      li:nth-of-type(2) .big {
        top: -74px;
        left: -42px;
      }
      li:nth-of-type(3) .big {
        right: -42px;
        top: 26px;
      }
      li:nth-of-type(4) .big {
        top: 26px;
        left: -42px;
      }
    }
  }
  .team-background {
    background: $home-color17;
    .home-team {
      // 首页团队样式
      width: 1220px;
      margin: 0 auto;
      text-align: center;
      border-radius: 8px;
      .el-carousel__item li {
        position: relative;
        width: 224px;
        margin: 0 10px;
        padding: 32px;
        background: $home-color5;
        float: left;
        border-radius: 8px;
        .team-photo {
          img {
            width: 160px;
            height: 160px;
            display: block;
            border-radius: 50%;
          }
        }
        p {
          color: $home-color3;
          font-size: 14px;
          text-align: center;
          padding-top: 4px;
        }
        p:nth-of-type(1) {
          padding-top: 35px;
          font-size: 18px;
          font-weight: bold;
        }
        &:hover {
          box-shadow: 0px 4px 10px 0px rgba(102, 102, 102, 0.3);
        }
      }
    }
  }
  .team-title {
    padding-top: 70px;
    padding-bottom: 30px;
    text-align: center;
    p:nth-of-type(2) {
      color: $home-color4;
      font-size: 18px;
      line-height: 60px;
    }
  }
  .trail-contact {
    //申请试用
    background: url(../../../../assets/img/df.png) no-repeat;
    padding-top: 110px;
    background-size: 100% 100%;
    .home-trial {
      width: 903px;
      margin: 0 auto;
      border-radius: 8px;
      border: 1px solid $home-color8;
      box-shadow: 0px 4px 10px 0px rgba(102, 102, 102, 0.3);
      padding-bottom: 68px;
      background: $home-color5;
      .trial-title {
        padding: 48px 0 30px 0;
        text-align: center;
        p:nth-of-type(1) {
          width: auto;
          &::before {
            left: 225px;
          }
          &::after {
            left: 595px;
          }
        }
        p:nth-of-type(2) {
          width: 530px;
          margin: 0 auto;
          color: $home-color4;
          font-size: 18px;
          line-height: 26px;
          padding: 15px 0 10px 0;
        }
      }
      .trial-form {
        width: 772px;
        margin: 0 auto;
        .area {
          display: inline-block;
          margin-right: 20px;
        }
        .area:nth-of-type(4) {
          margin-right: 0px;
        }
        .school-address {
          width: 244px;
        }
        .button-center {
          text-align: center;
          margin-top: 48px;
          .el-button {
            width: 280px;
            height: 65px;
            font-weight: bold;
            font-size: 24px;
          }
        }
        .agreement {
          color: $home-color15;
        }
      }
    }
    .home-contact {
      //联系我们
      width: 1144px;
      margin: 0 auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding: 48px 0 24px 0;
      color: $home-color5;
      .contact-content {
        p:first-of-type {
          font-size: 24px;
          margin-bottom: 16px;
          font-weight: bold;
        }
        p {
          font-size: 16px;
          margin-bottom: 10px;
        }
      }
      .contact-img {
        display: flex;
        > div {
          width: 116px;
          height: 116px;
          margin: 0 15px 15px 15px;
        }
        img {
          width: 116px;
          height: 116px;
        }
        p {
          text-align: center;
          padding-top: 10px;
        }
      }
    }
  }
  .footer {
    //底部
    width: 100%;
    height: 80px;
    background: $home-color7;
    font-size: 12px;
    color: $home-color5;
    text-align: center;
    padding: 18px 0;
    p {
      margin-bottom: 8px;
    }
  }
}
</style>
<style lang="scss">
// 首页的表单组件统一样式
.home {
  // 按钮统一样式
  .el-button {
    border-radius: 4px;
    background: $home-color15;
    color: $home-color5;
    line-height: 0;
    padding: 0;
    border: none;
  }
  // 申请入校表单输入框样式修改
  .trail-contact {
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-input__inner {
      height: 60px;
      line-height: 60px;
    }
  }
  // 客服模态框样式
  .home-service {
    .el-dialog__wrapper {
      .el-dialog__header {
        padding: 22px 20px;
        background: $home-color15;
        text-align: left;
        .el-dialog__title {
          font-size: 16px;
          color: $home-color5;
        }
        .el-dialog__headerbtn .el-dialog__close {
          color: $home-color5;
        }
      }
      .el-dialog__body {
        padding: 20px 25px 4px 25px;
        .modal-tips {
          background: $home-color19;
          border-radius: 4px;
          padding: 15px 20px;
          font-size: 14px;
          line-height: 26px;
          color: $home-color14;
        }
        .modal-form {
          // 表单样式覆盖
          padding-top: 22px;
          .el-select {
            width: 100%;
          }
          .el-form-item {
            margin-bottom: 18px;
          }
          .el-input__inner {
            height: 48px;
            line-height: 48px;
          }
        }
      }
      .dialog-footer {
        // 模态框底部样式
        .commit {
          width: 164px;
          height: 42px;
          margin: 25px auto;
          display: block;
          font-size: 16px;
        }
      }
    }
  }
  //轮播样式修改
  .home-team {
    .el-carousel__indicator {
      padding: 58px 4px 66px 4px;
      .el-carousel__button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
    .el-carousel__indicators--outside button {
      background-color: $home-color9;
      opacity: 1;
    }
    .el-carousel__indicator.is-active button {
      background: $home-color15;
      opacity: 1;
    }
    .el-carousel__indicator:hover button {
      background: $home-color15;
      opacity: 1;
    }
  }
}

// 注册登录找回密码的样式
.home-login-reg {
  .el-dialog__wrapper {
    .el-dialog__header {
      height: 42px;
      .el-dialog__headerbtn {
        top: 16px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
    .logo-icon {
      // 页面logo样式
      padding-bottom: 24px;
      img {
        display: block;
        margin: 0 auto;
      }
    }
    .s-menu {
      // 切换登录和注册的样式
      height: 50px;
      width: 240px;
      margin: 0 auto;
      border: none;
      .s-menu_a {
        height: 36px;
        line-height: 36px;
        color: $font-color;
        float: left;
        width: 120px;
        background: $menu-color1;
        border-width: 1px 0 1px 1px;
        border-style: solid;
        border-color: $menu-color2;
        text-align: center;
        margin: 0 auto;
        &.router-link-active,
        &:hover {
          color: $menu-color4;
          background: $menu-color3;
          border-color: $menu-color3;
        }
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:last-of-type {
          border-right-width: 1px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
</style>
