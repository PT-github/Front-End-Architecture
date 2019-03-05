<template>
  <div class="course-base-rule">
    <vue-scroll>
      <div class="rule-item" :class="{ active: ruleObj['1'] && ruleObj['1']['isOpen'], unModify: ruleObj['1'] && !ruleObj['1']['isEdit'] }" @click="toggleChooseBaseRule('1')">
        <div class="rule-item_title">教师连堂</div>
        <div class="rule-item_info">同一个老师当天上课时间集中安排</div>
      </div>
      <div class="rule-item" :class="{ active: ruleObj['2'] && ruleObj['2']['isOpen'], unModify: ruleObj['2'] && !ruleObj['2']['isEdit'] }" @click="toggleChooseBaseRule('2')">
        <div class="rule-item_title">科目连堂</div>
        <div class="rule-item_info">一个班级如果当天有同样的科目则集中安排</div>
      </div>
      <div class="rule-item" :class="{ active: ruleObj['3'] && ruleObj['3']['isOpen'], unModify: ruleObj['3'] && !ruleObj['3']['isEdit'] }" @click="toggleChooseBaseRule('3')">
        <div class="rule-item_title">每周第一节课设为班主任的科目</div>
        <div class="rule-item_info">主课优先</div>
      </div>
      <div class="rule-item" :class="{ active: ruleObj['4'] && ruleObj['4']['isOpen'], unModify: ruleObj['4'] && !ruleObj['4']['isEdit'] }" @click="toggleChooseBaseRule('4')">
        <div class="rule-item_title">同一班级各科目每日上课数均匀分散</div>
        <div class="rule-item_info">系统内设，无法取消</div>
      </div>
      <div class="rule-item" :class="{ active: ruleObj['5'] && ruleObj['5']['isOpen'], unModify: ruleObj['5'] && !ruleObj['5']['isEdit'] }" @click="toggleChooseBaseRule('5')">
        <div class="rule-item_title">各老师每日上课数均匀分散</div>
        <div class="rule-item_info">系统内设，无法取消</div>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import { updBaseRule } from '../../../store/api'
export default {
  name: 'CourseBaseRule',
  data () {
    return {
      ruleObj: {
        1: {
          isEdit: true,
          isOpen: false
        }, // 1、教师连堂
        2: {
          isEdit: true,
          isOpen: false
        }, // 2、科目连堂
        3: {
          isEdit: true,
          isOpen: false
        }, // 3、每周第一节设为班主任课
        4: {
          isEdit: true,
          isOpen: false
        }, // 系统内设 不可更改
        5: {
          isEdit: true,
          isOpen: false
        } // 系统内设 不可更改
      },
      ruleList: [] // 系统已经存放的基础规则
    }
  },
  mounted () {
  },
  methods: {
    /**设置规则缓存 */
    setRules (rule) {
      this.ruleList.push(...rule)
      for (let i = 0; i < rule.length; i++) {
        this.$set(this.ruleObj, rule[i].ruleType, rule[i])
      }
    },
    /** 修改基础规则 */
    toggleChooseBaseRule (key) {
      if (!this.ruleObj[key]['isEdit']) {
        return
      }
      this.$parent.hasModified = true
      this.$_showLoading()
      let params = []
      for (let i = 0; i < this.$parent.params.gradeId.length; i++) {
        params.push({
          uid: this.ruleObj[key].uid,
          ruleId: this.ruleObj[key].ruleId,
          isOpen: !this.ruleObj[key].isOpen,
          gradeId: this.$parent.params.gradeId[i],
          termId: this.$parent.params.termId,
          schoolId: this.$parent.params.schoolId
        })
      }
      updBaseRule(params).then(() => {
        this.$_hideLoading()
        this.$set(this.ruleObj, key + '', Object.assign(this.ruleObj[key], {
          isOpen: !this.ruleObj[key].isOpen
        }))
      }).catch((error) => {
        console.log('修改基础规则', error)
        this.$_hideLoading()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.course-base-rule {
  width: 100%;
  height: 100%;
  padding: 10px;
  .rule-item {
    height: 65px;
    position: relative;
    background: $course-pre-arrange-color10;
    border-radius: 4px;
    cursor: pointer;
    & + .rule-item {
      margin-top: 10px;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border-width: 10px;
      border-style: solid;
      border-color: $course-pre-arrange-color12 transparent transparent $course-pre-arrange-color12;
      box-sizing: border-box;
    }
    &:after {
      content: '\e6ef';
      font-size: 12px;
      font-family: "iconfont";
      position: absolute;
      color: $course-pre-arrange-color11;
      left: 0;
      top: 0;
    }
    .rule-item_title {
      font-size: 14px;
      color: $course-pre-arrange-color8;
      font-weight: bold;
      padding: 17px 13px 0;
    }
    .rule-item_info {
      font-size: 12px;
      color: $course-pre-arrange-color9;
      padding: 3px 13px 0;
    }
    &.active {
      border: 1px solid $course-pre-arrange-color13;
      background: $course-pre-arrange-color14;
      &:before {
        border-color: $course-pre-arrange-color16 transparent transparent $course-pre-arrange-color16;
      }
      .rule-item_title {
        padding-top: 16px;
        padding-left: 12px;
      }
      .rule-item_title, .rule-item_info {
        color: $course-pre-arrange-color15;
        padding-left: 12px;
      }
    }
    &.unModify {
      &:before, &:after {display: none;}
      background: $course-pre-arrange-color14-1;
    }
  }
}
</style>