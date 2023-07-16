<template>
  <view>
    <NavBar mark="back" />
    <navigationBar :opacity="opacity" titleText="社区添加" />
    <fui-backdrop :show="alertModalStatus" :zIndex="1" />
    <fui-animation :duration="500" :animationType="animations" :show="alertModalStatus">
      <view class="alertBox">
        <image class="alertImg" :src="addCampusBase64.modalImg" mode="aspectFit" />
        <view class="alertClose">
          <tui-icon @click="closeAlert" name="close" color="#ffffff"></tui-icon>
        </view>
      </view>
    </fui-animation>
    <tui-toast ref="toast" position="center"></tui-toast>
    <fui-loading v-if="submitLoading" text="提交中. . ." :srcCol="commonBase64.loading"></fui-loading>
    <scroll-view class="myScroll" scroll-y @scroll="onScroll"
      style="`background-image:url(${addCampusBase64.backgroundImg})`">
      <view :style="{ height: navigationBarHeight }"></view>
      <view v-show="isContentShow" style="padding-bottom: 30rpx">
        <!-- 社区信息 -->
        <view class="card">
          <tui-card :image="card.campus.img" :title="card.campus.title">
            <template slot="body">
              <view class="tui-default">
                <fui-input v-model="form.campusName" label="名称" required textRight placeholder="请输入学校或社区名称" />
                <picker mode="selector" :value="natureIndex" :range="natures" @change="natureChange">
                  <fui-listcell :highlight="false">
                    <view>
                      <text class="fui-input__required" style="color:#FF2B2B">*</text>
                      <text>性质</text>
                    </view>
                    <view>
                      <text v-if="!isNatureSelect" class="fui-input__placeholder">请选择学校或社区性质</text>
                      <text v-if="isNatureSelect" class="fui-input__placeholder" style="color:#000000">{{
                        form.campusNature }}</text>
                    </view>
                  </fui-listcell>
                </picker>
                <picker mode="region" @change="campusAddressChange">
                  <fui-listcell :highlight="false">
                    <view>
                      <text class="fui-input__required" style="color:#FF2B2B">*</text>
                      <text>地址</text>
                    </view>
                    <view>
                      <text v-if="!isCampusAddressSelect" class="fui-input__placeholder">请选择学校或社区地址</text>
                      <text v-if="isCampusAddressSelect" class="fui-input__placeholder" style="color:#000000">{{
                        form.campusAddress }}</text>
                    </view>
                  </fui-listcell>
                </picker>
                <!-- <fui-input :value="form.campusAddress" label="地址" required textRight placeholder="请选择学校或社区地址" /> -->
              </view>
            </template>
          </tui-card>
        </view>
        <!-- 个人信息 -->
        <view class="card">
          <tui-card :image="card.self.img" :title="card.self.title" :tag="card.self.tag">
            <template slot="body">
              <view class="tui-default">
                <fui-input v-model="form.name" label="姓名" required textRight placeholder="请输入姓名" />
                <picker mode="selector" :value="sexIndex" :range="sexs" @change="sexChange">
                  <fui-listcell :highlight="false">
                    <view>
                      <text class="fui-input__required" style="color:#FF2B2B">*</text>
                      <text>性别</text>
                    </view>
                    <view>
                      <text v-if="!isSexSelect" class="fui-input__placeholder">请选择性别</text>
                      <view v-if="isSexSelect" class="fui-input__placeholder columnFlex" style="color:#000000">
                        <text>{{ form.sex }}</text>
                        <image :src="endTagUrl" :style="endTagStyle" />
                      </view>
                    </view>
                  </fui-listcell>
                </picker>
                <fui-input v-model="form.age" label="年龄" type="number" required textRight placeholder="请输入年龄" />
                <picker mode="selector" :value="gradeIndex" :range="grades" @change="gradeChange">
                  <fui-listcell :highlight="false">
                    <view>
                      <text>年级</text>
                    </view>
                    <view>
                      <text v-if="!isGradeSelect" class="fui-input__placeholder">请选择年级或其他</text>
                      <text v-if="isGradeSelect" class="fui-input__placeholder" style="color:#000000">{{ form.grade
                      }}</text>
                    </view>
                  </fui-listcell>
                </picker>
                <fui-input v-model="form.wxAccount" label="微信账号" textRight placeholder="请输入微信账号" />
                <fui-input v-model="form.qqAccount" label="QQ账号" textRight placeholder="请输入QQ账号" />
                <fui-input v-model="form.email" label="邮箱" textRight placeholder="请输入邮箱" />
              </view>
            </template>
          </tui-card>
        </view>
        <!-- 加入我们 -->
        <view class="card">
          <tui-card :image="card.joinus.img" :title="card.joinus.title">
            <template slot="body">
              <view class="tui-default">
                <picker mode="selector" :range="joinTypes" @change="joinTypeChange">
                  <fui-listcell :highlight="false">
                    <view>
                      <!-- <text class="fui-input__required" style="color:#FF2B2B">*</text> -->
                      <text>是否愿意加入Runners</text>
                    </view>
                    <view>
                      <text v-if="!isJoinSelect" class="fui-input__placeholder">请选择</text>
                      <text v-if="isJoinSelect" class="fui-input__placeholder" style="color:#000000">{{ form.isJoin
                      }}</text>
                    </view>
                  </fui-listcell>
                </picker>

                <fui-textarea v-model="form.desc" maxlength="250" placeholder="您想象中或者希望的Runners是什么样子的呢～" isCounter />
              </view>
            </template>
          </tui-card>
        </view>
        <!-- 提交按钮 -->
        <fui-button class="submitBtn" width="80%" background="#000000" color="#FFFFFF" @click="submit">确定</fui-button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import navigationBar from "@/components/navigationBar.vue";
import NavBar from "@/components/navBar.vue";
import { uniRequest, jumpTo } from "@/utils/tool.js";
import { commonBase64, addCampusBase64 } from "@/base64/index.js";
export default {
  components: { navigationBar, NavBar },
  onInit() { },
  onLoad(option) {
    this.openid = option.openid;
  },
  onShow() {
    console.log("333");
    setTimeout(() => {
      this.alertModalStatus = true;
    }, 1000);
  },
  onReady() {

  },
  data() {
    return {
      addCampusBase64,
      commonBase64,
      openid: null,
      isSexSelect: false,
      isGradeSelect: false,
      isNatureSelect: false,
      isCampusAddressSelect: false,
      isJoinSelect: false,
      endTagUrl: null,
      endTagStyle: null,
      form: {
        name: null,
        sex: null,
        age: null,
        grade: null,
        wxAccount: null,
        qqAccount: null,
        email: null,
        campusName: null,
        campusNature: null,
        campusAddress: null,
        isJoin: null,
        desc: "",
      },
      tips: [
        { value: "campusName", label: "请输入学校或社区名称" },
        { value: "campusNature", label: "请选择学校或社区性质" },
        { value: "campusAddress", label: "请选择学校或社区地址" },
        { value: "name", label: "请输入您的姓名" },
        { value: "sex", label: "请选择您的性别" },
        { value: "age", label: "请输入您的年龄" },
      ],
      sexs: ["男", "女", "未知"],
      grades: [
        "高一",
        "高二",
        "高三",
        "大一",
        "大二",
        "大三",
        "大四",
        "研一",
        "研二",
        "研三",
        "其他",
      ],
      natures: ["学校", "社区"],
      joinTypes: ["是", "否"],
      sexIndex: 0,
      gradeIndex: 3,
      natureIndex: 0,
      alertModalStatus: false,
      isContentShow: false,
      animations: ["zoom-in"],
      card: {
        self: {
          img: {
            url: addCampusBase64.selfInfo,
            circle: true,
          },
          title: {
            text: "个人信息",
            color: "#000000",
            size: 34,
          },
          tag: {
            text: "（仅用做后续提供奖励联系您）",
          },
        },
        campus: {
          img: {
            url: addCampusBase64.campusInfo,
            circle: true,
          },
          title: {
            text: "学校&社区信息",
            color: "#000000",
            size: 34,
          },
        },
        joinus: {
          img: {
            url: addCampusBase64.runnerLogo,
            circle: true,
          },
          title: {
            text: "加入我们",
            color: "#000000",
            size: 34,
          },
        },
      },
      opacity: 0,
      submitLoading: false,
    };
  },
  computed: {
    navigationBarHeight() {
      let statusBarHeight = 50;
      uni.getSystemInfo({
        success: (result) => {
          statusBarHeight = result.statusBarHeight;
        },
        fail: (error) => {
          console.log(error);
        },
      });
      return 44 + statusBarHeight + "px";
    },
  },
  methods: {
    backpage() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onScroll(e) {
      let top = e.detail.scrollTop;
      let opacity = top / 200;
      this.opacity = opacity;
    },
    closeAlert() {
      this.isContentShow = true;
      this.alertModalStatus = false;
    },
    sexChange(e) {
      this.isSexSelect = true;
      if (e.detail.value === "0") {
        this.endTagStyle = "width:73rpx;height:43rpx";
        this.endTagUrl = addCampusBase64.manEndTag;
        this.form.sex = "1";
      }
      if (e.detail.value === "1") {
        this.endTagStyle = "width:73rpx;height:43rpx";
        this.endTagUrl = addCampusBase64.womanEndTag;
        this.form.sex = "2";
      }
      if (e.detail.value === "2") {
        this.endTagStyle = "width:43rpx;height:43rpx";
        this.endTagUrl = addCampusBase64.manOrWomanEndTag;
        this.form.sex = "0";
      }
    },
    gradeChange(e) {
      this.isGradeSelect = true;
      this.form.grade = this.grades[e.detail.value];
    },
    natureChange(e) {
      this.isNatureSelect = true;
      this.form.campusNature = this.natures[e.detail.value];
    },
    campusAddressChange(e) {
      this.isCampusAddressSelect = true;
      this.form.campusAddress = e.detail.value.join("-");
    },
    joinTypeChange(e) {
      this.isJoinSelect = true;
      this.form.isJoin = this.joinTypes[e.detail.value];
    },
    async submit() {
      for (const item of this.tips) {
        if (!this.form[item.value]) {
          let options = {
            title: item.label,
            imgUrl: commonBase64.warn,
            icon: true,
          };
          this.$refs.toast.show(options);
          return;
        }
      }
      this.isContentShow = false;
      this.submitLoading = true;
      await uniRequest("campus/suggestion", "POST", {
        ...this.form,
        openid: this.openid,
      });
      this.submitLoading = false;
      jumpTo("/pages/result/index", { title: "提交成功！", mark: "back" });
    },
  },
};
</script>

<style lang="scss">
.myScroll {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.alertBox {
  display: flex;
  flex-direction: column;
}

.alertImg {
  width: 700rpx;
  height: 65vh;
}

.alertClose {
  text-align: center;
  margin-top: 20rpx;
}

.card {
  margin-bottom: 20rpx;
}

.fui-input__required {
  position: absolute;
  left: 12rpx;
  /* #ifndef APP-NVUE */
  height: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1.15;
  /* #endif */

  /* #ifdef APP-NVUE */
  flex: 1;
  align-items: center;
  justify-content: center;
  line-height: 1;
  /* #endif */
}

.fui-input__placeholder {
  padding-right: 13rpx;
  /* #ifndef APP-NVUE */
  color: var(--fui-color-minor, #ccc);
  overflow: visible;
  /* #endif */
  /* #ifdef APP-NVUE */
  color: #ccc;
  font-size: 32rpx;
  /* #endif */
}

.columnFlex {
  display: flex;
  align-items: center;
}

.submitBtn {
  display: flex;
  justify-content: center;
  margin: 50rpx 0;
}
</style>


